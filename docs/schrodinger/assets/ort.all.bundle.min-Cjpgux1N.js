var G$=Object.defineProperty;var H$=(e,t,n)=>t in e?G$(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var rp=(e,t,n)=>H$(e,typeof t!="symbol"?t+"":t,n);/*!
 * ONNX Runtime Web v1.31.1
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */var W$=Object.create,eo=Object.defineProperty,K$=Object.getOwnPropertyDescriptor,X$=Object.getOwnPropertyNames,Z$=Object.getPrototypeOf,J$=Object.prototype.hasOwnProperty,ps=(e=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof require<"u"?require:t)[n]}):e)(function(e){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),k=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(s){throw n=[s],s}},ne=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(n){throw t=0,n}},Yr=(e,t)=>{for(var n in t)eo(e,n,{get:t[n],enumerable:!0})},ob=(e,t,n,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let u of X$(t))!J$.call(e,u)&&u!==n&&eo(e,u,{get:()=>t[u],enumerable:!(s=K$(t,u))||s.enumerable});return e},ce=(e,t,n)=>(n=e!=null?W$(Z$(e)):{},ob(!e||!e.__esModule?eo(n,"default",{value:e,enumerable:!0}):n,e)),fn=e=>ob(eo({},"__esModule",{value:!0}),e),an,Gt,Do,Hr,Co,ab,sb,bu=k(()=>{"use strict";an=new Map,Gt=[],Do=new WeakMap,Hr=(e,t,n)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let s=an.get(e);if(s===void 0)an.set(e,{backend:t,priority:n});else{if(s.priority>n)return;if(s.priority===n&&s.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let u=Gt.indexOf(e);u!==-1&&Gt.splice(u,1);for(let l=0;l<Gt.length;l++)if(an.get(Gt[l]).priority<=n){Gt.splice(l,0,e);return}Gt.push(e)}return}throw new TypeError("not a valid backend")},Co=async e=>{let t=an.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{if(!n){let s=t.backend,u=Do.get(s);t.initPromise=u?u.then(async()=>s.init(e),async()=>s.init(e)):s.init(e),Do.set(s,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(s){return n||(t.error=`${s}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},ab=async e=>{let t=e.executionProviders||[],n=t.map(o=>typeof o=="string"?o:o.name),s=n.length===0?Gt:n,u,l=[],p=new Set;for(let o of s){let r=await Co(o);typeof r=="string"?l.push({name:o,err:r}):(u||(u=r),u===r&&p.add(o))}if(!u)throw new Error(`no available backend found. ERR: ${l.map(o=>`[${o.name}] ${o.err}`).join(", ")}`);for(let{name:o,err:r}of l)n.includes(o)&&console.warn(`removing requested execution provider "${o}" from session options because it is not available: ${r}`);let d=t.filter(o=>p.has(typeof o=="string"?o:o.name));return[u,new Proxy(e,{get:(o,r)=>r==="executionProviders"?d:Reflect.get(o,r)})]},sb=async()=>{let e=[];for(let n of Gt){if(typeof an.get(n).backend.createLoraAdapterHandler!="function")continue;let s=await Co(n);if(typeof s!="string")return s;e.push({name:n,err:s})}let t=e.length===0?"":` ERR: ${e.map(n=>`[${n.name}] ${n.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),Q$=k(()=>{"use strict";bu()}),ub,Y$=k(()=>{"use strict";ub="1.31.1"}),No,Ze,lb=k(()=>{"use strict";Y$(),No="warning",Ze={wasm:{},webgl:{},webgpu:{},versions:{common:ub},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);No=e}},get logLevel(){return No}},Object.defineProperty(Ze,"logLevel",{enumerable:!0})}),ye,eT=k(()=>{"use strict";lb(),ye=Ze}),Ui,zo,wt,ht,Wr,Kr,yu=k(()=>{"use strict";lb(),Ui=(e,t)=>{(typeof Ze.trace>"u"?!Ze.wasm.trace:!Ze.trace)||console.timeStamp(`${e}::ORT::${t}`)},zo=(e,t)=>{var u;let n=((u=new Error().stack)==null?void 0:u.split(/\r\n|\r|\n/g))||[],s=!1;for(let l=0;l<n.length;l++){if(s&&!n[l].includes("TRACE_FUNC")){let p=`FUNC_${e}::${n[l].trim().split(" ")[1]}`;t&&(p+=`::${t}`),Ui("CPU",p);return}n[l].includes("TRACE_FUNC")&&(s=!0)}},wt=e=>{(typeof Ze.trace>"u"?!Ze.wasm.trace:!Ze.trace)||zo("BEGIN",e)},ht=e=>{(typeof Ze.trace>"u"?!Ze.wasm.trace:!Ze.trace)||zo("END",e)},Wr=e=>{(typeof Ze.trace>"u"?!Ze.wasm.trace:!Ze.trace)||console.time(`ORT::${e}`)},Kr=e=>{(typeof Ze.trace>"u"?!Ze.wasm.trace:!Ze.trace)||console.timeEnd(`ORT::${e}`)}}),_u,db=k(()=>{"use strict";bu(),yu(),_u=class pb{constructor(t,n){this.backend=t,this.handler=n}static async create(t){if(wt(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let n=await sb(),s=await n.createLoraAdapterHandler(t);return ht(),new pb(n,s)}async release(){return this.handler.dispose()}}}),cb,hb,tT=k(()=>{"use strict";cb=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let s=n.getContext("2d");if(s!=null){let u,l;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],l=e.dims[3]):(u=e.dims[3],l=e.dims[2]);let p=(t==null?void 0:t.format)!==void 0?t.format:"RGB",d=t==null?void 0:t.norm,o,r;d===void 0||d.mean===void 0?o=[255,255,255,255]:typeof d.mean=="number"?o=[d.mean,d.mean,d.mean,d.mean]:(o=[d.mean[0],d.mean[1],d.mean[2],0],d.mean[3]!==void 0&&(o[3]=d.mean[3])),d===void 0||d.bias===void 0?r=[0,0,0,0]:typeof d.bias=="number"?r=[d.bias,d.bias,d.bias,d.bias]:(r=[d.bias[0],d.bias[1],d.bias[2],0],d.bias[3]!==void 0&&(r[3]=d.bias[3]));let i=l*u,a=0,c=i,h=i*2,m=-1;p==="RGBA"?(a=0,c=i,h=i*2,m=i*3):p==="RGB"?(a=0,c=i,h=i*2):p==="RBG"&&(a=0,h=i,c=i*2);for(let b=0;b<l;b++)for(let x=0;x<u;x++){let w=(e.data[a++]-r[0])*o[0],_=(e.data[c++]-r[1])*o[1],I=(e.data[h++]-r[2])*o[2],E=m===-1?255:(e.data[m++]-r[3])*o[3];s.fillStyle="rgba("+w+","+_+","+I+","+E+")",s.fillRect(x,b,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},hb=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),s;if(n!=null){let u,l,p;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],l=e.dims[1],p=e.dims[3]):(u=e.dims[3],l=e.dims[2],p=e.dims[1]);let d=t!==void 0&&t.format!==void 0?t.format:"RGB",o=t==null?void 0:t.norm,r,i;o===void 0||o.mean===void 0?r=[255,255,255,255]:typeof o.mean=="number"?r=[o.mean,o.mean,o.mean,o.mean]:(r=[o.mean[0],o.mean[1],o.mean[2],255],o.mean[3]!==void 0&&(r[3]=o.mean[3])),o===void 0||o.bias===void 0?i=[0,0,0,0]:typeof o.bias=="number"?i=[o.bias,o.bias,o.bias,o.bias]:(i=[o.bias[0],o.bias[1],o.bias[2],0],o.bias[3]!==void 0&&(i[3]=o.bias[3]));let a=l*u;if(t!==void 0&&(t.format!==void 0&&p===4&&t.format!=="RGBA"||p===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let c=4,h=0,m=1,b=2,x=3,w=0,_=a,I=a*2,E=-1;d==="RGBA"?(w=0,_=a,I=a*2,E=a*3):d==="RGB"?(w=0,_=a,I=a*2):d==="RBG"&&(w=0,I=a,_=a*2),s=n.createImageData(u,l);for(let O=0;O<l*u;h+=c,m+=c,b+=c,x+=c,O++)s.data[h]=(e.data[w++]-i[0])*r[0],s.data[m]=(e.data[_++]-i[1])*r[1],s.data[b]=(e.data[I++]-i[2])*r[2],s.data[x]=E===-1?255:(e.data[E++]-i[3])*r[3]}else throw new Error("Can not access image data");return s}}),wi,fb,mb,gb,bb,yb,rT=k(()=>{"use strict";vu(),wi=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:s}=t,u=t.norm??{mean:255,bias:0},l,p;typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:l=[u.mean[0],u.mean[1],u.mean[2],u.mean[3]??255],typeof u.bias=="number"?p=[u.bias,u.bias,u.bias,u.bias]:p=[u.bias[0],u.bias[1],u.bias[2],u.bias[3]??0];let d=t.format!==void 0?t.format:"RGBA",o=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",r=n*s,i=o==="RGBA"?new Float32Array(r*4):new Float32Array(r*3),a=4,c=0,h=1,m=2,b=3,x=0,w=r,_=r*2,I=-1;d==="RGB"&&(a=3,c=0,h=1,m=2,b=-1),o==="RGBA"?I=r*3:o==="RBG"?(x=0,_=r,w=r*2):o==="BGR"&&(_=0,w=r,x=r*2);for(let E=0;E<r;E++,c+=a,m+=a,h+=a,b+=a)i[x++]=(e[c]+p[0])/l[0],i[w++]=(e[h]+p[1])/l[1],i[_++]=(e[m]+p[2])/l[2],I!==-1&&b!==-1&&(i[I++]=(e[b]+p[3])/l[3]);return o==="RGBA"?new pt("float32",i,[1,4,n,s]):new pt("float32",i,[1,3,n,s])},fb=async(e,t)=>{let n=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,s=typeof ImageData<"u"&&e instanceof ImageData,u=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,l=typeof e=="string",p,d=t??{},o=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},r=i=>typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||i instanceof OffscreenCanvas?i.getContext("2d"):null;if(n){let i=o();i.width=e.width,i.height=e.height;let a=r(i);if(a!=null){let c=e.height,h=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(c=t.resizedHeight,h=t.resizedWidth),t!==void 0){if(d=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");d.tensorFormat="RGBA",d.height=c,d.width=h}else d.tensorFormat="RGBA",d.height=c,d.width=h;a.drawImage(e,0,0),p=a.getImageData(0,0,h,c).data}else throw new Error("Can not access image data")}else if(s){let i,a;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(i=t.resizedHeight,a=t.resizedWidth):(i=e.height,a=e.width),t!==void 0&&(d=t),d.format="RGBA",d.height=i,d.width=a,t!==void 0){let c=o();c.width=a,c.height=i;let h=r(c);if(h!=null)h.putImageData(e,0,0),p=h.getImageData(0,0,a,i).data;else throw new Error("Can not access image data")}else p=e.data}else if(u){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let i=o();i.width=e.width,i.height=e.height;let a=r(i);if(a!=null){let c=e.height,h=e.width;return a.drawImage(e,0,0,h,c),p=a.getImageData(0,0,h,c).data,d.height=c,d.width=h,wi(p,d)}else throw new Error("Can not access image data")}else{if(l)return new Promise((i,a)=>{let c=o(),h=r(c);if(!e||!h)return a();let m=new Image;m.crossOrigin="Anonymous",m.src=e,m.onload=()=>{c.width=m.width,c.height=m.height,h.drawImage(m,0,0,c.width,c.height);let b=h.getImageData(0,0,c.width,c.height);d.height=c.height,d.width=c.width,i(wi(b.data,d))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(p!==void 0)return wi(p,d);throw new Error("Input data provided is not supported - aborted tensor creation")},mb=(e,t)=>{let{width:n,height:s,download:u,dispose:l}=t,p=[1,s,n,4];return new pt({location:"texture",type:"float32",texture:e,dims:p,download:u,dispose:l})},gb=(e,t)=>{let{dataType:n,dims:s,download:u,dispose:l}=t;return new pt({location:"gpu-buffer",type:n??"float32",gpuBuffer:e,dims:s,download:u,dispose:l})},bb=(e,t)=>{let{dataType:n,dims:s,download:u,dispose:l}=t;return new pt({location:"ml-tensor",type:n??"float32",mlTensor:e,dims:s,download:u,dispose:l})},yb=(e,t,n)=>new pt({location:"cpu-pinned",type:e,data:t,dims:n??[t.length]})}),Lr,Vn,Ro,_b,nT=k(()=>{"use strict";Lr=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Vn=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Ro=!1,_b=()=>{if(!Ro){Ro=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,n=globalThis.Float16Array,s=typeof n<"u"&&n.from;e&&(Lr.set("int64",BigInt64Array),Vn.set(BigInt64Array,"int64")),t&&(Lr.set("uint64",BigUint64Array),Vn.set(BigUint64Array,"uint64")),s?(Lr.set("float16",n),Vn.set(n,"float16")):Lr.set("float16",Uint16Array)}}}),vb,wb,iT=k(()=>{"use strict";vu(),vb=e=>{let t=1;for(let n=0;n<e.length;n++){let s=e[n];if(typeof s!="number"||!Number.isSafeInteger(s))throw new TypeError(`dims[${n}] must be an integer, got: ${s}`);if(s<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${s}`);t*=s}return t},wb=(e,t)=>{switch(e.location){case"cpu":return new pt(e.type,e.data,t);case"cpu-pinned":return new pt({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new pt({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new pt({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new pt({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),pt,vu=k(()=>{"use strict";tT(),rT(),nT(),iT(),pt=class{constructor(e,t,n){_b();let s,u;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,s=e.type,u=e.dims,e.location){case"cpu-pinned":{let p=Lr.get(s);if(!p)throw new TypeError(`unsupported type "${s}" to create tensor from pinned buffer`);if(!(e.data instanceof p))throw new TypeError(`buffer should be of type ${p.name}`);this.cpuData=e.data;break}case"texture":{if(s!=="float32")throw new TypeError(`unsupported type "${s}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(s!=="float32"&&s!=="float16"&&s!=="int32"&&s!=="int64"&&s!=="uint32"&&s!=="uint64"&&s!=="int8"&&s!=="uint8"&&s!=="bool"&&s!=="uint4"&&s!=="int4")throw new TypeError(`unsupported type "${s}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let p,d;if(typeof e=="string")if(s=e,d=n,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");p=t}else{let o=Lr.get(e);if(o===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&o===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${o.name} as data.`);e==="uint64"||e==="int64"?p=o.from(t,BigInt):p=o.from(t)}else if(t instanceof o)p=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")p=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&o!==Uint16Array)p=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${s} tensor's data must be type of ${o}`)}else if(d=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let o=typeof e[0];if(o==="string")s="string",p=e;else if(o==="boolean")s="bool",p=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${o}.`)}else if(e instanceof Uint8ClampedArray)s="uint8",p=Uint8Array.from(e);else{let o=Vn.get(e.constructor);if(o===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);s=o,p=e}if(d===void 0)d=[p.length];else if(!Array.isArray(d))throw new TypeError("A tensor's dims must be a number array");u=d,this.cpuData=p,this.dataLocation="cpu"}let l=vb(u);if(this.cpuData&&l!==this.cpuData.length&&!((s==="uint4"||s==="int4")&&Math.ceil(l/2)===this.cpuData.length))throw new Error(`Tensor's size(${l}) does not match data length(${this.cpuData.length}).`);this.type=s,this.dims=u,this.size=l}static async fromImage(e,t){return fb(e,t)}static fromTexture(e,t){return mb(e,t)}static fromGpuBuffer(e,t){return gb(e,t)}static fromMLTensor(e,t){return bb(e,t)}static fromPinnedBuffer(e,t,n){return yb(e,t,n)}toDataURL(e){return cb(this,e)}toImageData(e){return hb(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return wb(this,e)}}}),Dt,xb=k(()=>{"use strict";vu(),Dt=pt}),$b,oT=k(()=>{"use strict";bu(),db(),xb(),yu(),$b=class Tb{constructor(t,n){this.handler=t,this.backend=n}async run(t,n,s){wt(),Wr("InferenceSession.run");let u={},l={};if(typeof t!="object"||t===null||t instanceof Dt||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let p=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof Dt)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");p=!1;for(let i of n){if(typeof i!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(i)===-1)throw new RangeError(`'fetches' contains invalid output name: ${i}.`);u[i]=null}if(typeof s=="object"&&s!==null)l=s;else if(typeof s<"u")throw new TypeError("'options' must be an object.")}else{let i=!1,a=Object.getOwnPropertyNames(n);for(let c of this.outputNames)if(a.indexOf(c)!==-1){let h=n[c];(h===null||h instanceof Dt)&&(i=!0,p=!1,u[c]=h)}if(i){if(typeof s=="object"&&s!==null)l=s;else if(typeof s<"u")throw new TypeError("'options' must be an object.")}else l=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let i of this.inputNames)if(typeof t[i]>"u")throw new Error(`input '${i}' is missing in 'feeds'.`);if(p)for(let i of this.outputNames)u[i]=null;let d;if(l.activeLoraAdapters!==void 0){if(!Array.isArray(l.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");d=l.activeLoraAdapters.map(i=>{if(!(i instanceof _u))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(i.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return i.handler})}let o=await this.handler.run(t,u,l,d),r={};for(let i in o)if(Object.hasOwnProperty.call(o,i)){let a=o[i];a instanceof Dt?r[i]=a:r[i]=new Dt(a.type,a.data,a.dims)}return Kr("InferenceSession.run"),ht(),r}async release(){return this.handler.dispose()}static async create(t,n,s,u){wt(),Wr("InferenceSession.create");let l,p={};if(typeof t=="string"){if(l=t,typeof n=="object"&&n!==null)p=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(l=t,typeof n=="object"&&n!==null)p=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let i=t,a=0,c=t.byteLength;if(typeof n=="object"&&n!==null)p=n;else if(typeof n=="number"){if(a=n,!Number.isSafeInteger(a))throw new RangeError("'byteOffset' must be an integer.");if(a<0||a>=i.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${i.byteLength}).`);if(c=t.byteLength-a,typeof s=="number"){if(c=s,!Number.isSafeInteger(c))throw new RangeError("'byteLength' must be an integer.");if(c<=0||a+c>i.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${i.byteLength-a}].`);if(typeof u=="object"&&u!==null)p=u;else if(typeof u<"u")throw new TypeError("'options' must be an object.")}else if(typeof s<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");l=new Uint8Array(i,a,c)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[d,o]=await ab(p),r=await d.createInferenceSessionHandler(l,o);return Kr("InferenceSession.create"),ht(),new Tb(r,d)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),Sb,aT=k(()=>{"use strict";oT(),Sb=$b}),Ib,sT=k(()=>{"use strict";db(),Ib=_u}),uT=k(()=>{"use strict"}),lT=k(()=>{"use strict"}),dT=k(()=>{"use strict"}),pT=k(()=>{"use strict"}),Ob={};Yr(Ob,{InferenceSession:()=>Sb,LoraAdapter:()=>Ib,TRACE:()=>Ui,TRACE_EVENT_BEGIN:()=>Wr,TRACE_EVENT_END:()=>Kr,TRACE_FUNC_BEGIN:()=>wt,TRACE_FUNC_END:()=>ht,Tensor:()=>Dt,env:()=>ye,registerBackend:()=>Hr});var et=k(()=>{"use strict";Q$(),eT(),aT(),sT(),xb(),uT(),lT(),yu(),dT(),pT()});function Vr(e,t,n,s){if(t===void 0)return cT(e);if(n===void 0)xi(e,t);else if(typeof n=="number"&&s===void 0)xi(e,t);else if(typeof n=="string"&&s===void 0)xi(e,n,1,t);else if(typeof n=="string"&&typeof s=="number")xi(e,n,s,t);else throw new TypeError("input is valid")}function cT(e){return{verbose:Vr.verbose.bind(null,e),info:Vr.info.bind(null,e),warning:Vr.warning.bind(null,e),error:Vr.error.bind(null,e),fatal:Vr.fatal.bind(null,e)}}function xi(e,t,n,s){let u=cn[s||""]||cn[""];cs[e]<cs[u.minimalSeverity]||(u.logDateTime&&(t=`${new Date().toISOString()}|${t}`),u.logSourceLocation,Eb[u.provider].log(e,t,s))}var np,ip,cs,Eb,Bo,cn,qe,Mo,jo,Pb,Sn,Ct=k(()=>{"use strict";np=class{log(e,t,n){}},ip=class{log(e,t,n){console.log(`${this.color(e)} ${n?"\x1B[35m"+n+"\x1B[0m ":""}${t}`)}color(e){switch(e){case"verbose":return"\x1B[34;40mv\x1B[0m";case"info":return"\x1B[32mi\x1B[0m";case"warning":return"\x1B[30;43mw\x1B[0m";case"error":return"\x1B[31;40me\x1B[0m";case"fatal":return"\x1B[101mf\x1B[0m";default:throw new Error(`unsupported severity: ${e}`)}}},cs={verbose:1e3,info:2e3,warning:4e3,error:5e3,fatal:6e3},Eb={none:new np,console:new ip},Bo={provider:"console",minimalSeverity:"warning",logDateTime:!0,logSourceLocation:!1},cn={"":Bo},(e=>{function t(r,i){e("verbose",r,i)}e.verbose=t;function n(r,i){e("info",r,i)}e.info=n;function s(r,i){e("warning",r,i)}e.warning=s;function u(r,i){e("error",r,i)}e.error=u;function l(r,i){e("fatal",r,i)}e.fatal=l;function p(r){cn={},d("",r||{})}e.reset=p;function d(r,i){if(r==="*")p(i);else{let a=cn[r]||Bo;cn[r]={provider:i.provider||a.provider,minimalSeverity:i.minimalSeverity||a.minimalSeverity,logDateTime:i.logDateTime===void 0?a.logDateTime:i.logDateTime,logSourceLocation:i.logSourceLocation===void 0?a.logSourceLocation:i.logSourceLocation}}}e.set=d;function o(r){let i={};r.logLevel&&(i.minimalSeverity=r.logLevel),d("",i)}e.setWithEnv=o})(Vr||(Vr={})),qe=Vr,Mo=class{constructor(e,t,n,s,u,l){this.category=e,this.name=t,this.startTime=n,this.endCallback=s,this.timer=u,this.ctx=l}async end(){return this.endCallback(this)}async checkTimer(){if(this.ctx===void 0||this.timer===void 0)throw new Error("No webgl timer found");return this.ctx.endTimer(),this.ctx.waitForQueryAndGetTime(this.timer)}},jo=class{constructor(e,t,n,s){this.category=e,this.name=t,this.startTime=n,this.endTime=s}},Pb=class{constructor(e,t,n){this._started=!1,this._flushPointer=0,this._started=!1,this._maxNumberEvents=e===void 0?1e4:e,this._flushBatchSize=t===void 0?10:t,this._flushIntervalInMilliseconds=n===void 0?5e3:n}static create(e){return e===void 0?new this:new this(e.maxNumberEvents,e.flushBatchSize,e.flushIntervalInMilliseconds)}start(){this._started=!0,this._timingEvents=[],this._flushTime=Sn(),this._flushPointer=0}stop(){for(this._started=!1;this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer])}event(e,t,n,s){let u=this._started?this.begin(e,t,s):void 0,l=!1,p=n();if(p&&typeof p.then=="function")return l=!0,new Promise((d,o)=>{p.then(async r=>{u&&await u.end(),d(r)},async r=>{u&&await u.end(),o(r)})});if(!l&&u){let d=u.end();if(d&&typeof d.then=="function")return new Promise((o,r)=>{d.then(()=>{o(p)},i=>{r(i)})})}return p}begin(e,t,n){if(!this._started)throw new Error("profiler is not started yet");if(n===void 0){let s=Sn();return this.flush(s),new Mo(e,t,s,u=>this.endSync(u))}else{let s=n.beginTimer();return new Mo(e,t,0,async u=>this.end(u),s,n)}}async end(e){let t=await e.checkTimer();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new jo(e.category,e.name,e.startTime,t)),this.flush(t))}endSync(e){let t=Sn();this._timingEvents.length<this._maxNumberEvents&&(this._timingEvents.push(new jo(e.category,e.name,e.startTime,t)),this.flush(t))}logOneEvent(e){qe.verbose(`Profiler.${e.category}`,`${(e.endTime-e.startTime).toFixed(2)}ms on event '${e.name}' at ${e.endTime.toFixed(2)}`)}flush(e){if(this._timingEvents.length-this._flushPointer>=this._flushBatchSize||e-this._flushTime>=this._flushIntervalInMilliseconds){for(let t=this._flushPointer;this._flushPointer<t+this._flushBatchSize&&this._flushPointer<this._timingEvents.length;this._flushPointer++)this.logOneEvent(this._timingEvents[this._flushPointer]);this._flushTime=Sn()}}get started(){return this._started}},Sn=typeof performance<"u"&&performance.now?()=>performance.now():Date.now});function hT(e,t,n){for(let s of n){let u=s[0],l=s[1],p=s[2],d=s[3],o=s[4];if(e.opType===u){for(let r of t)if((r.domain===l||r.domain==="ai.onnx"&&l==="")&&fT(r.version,p))return{opImpl:d,opInit:o}}}throw new TypeError(`cannot resolve operator '${e.opType}' with opsets: ${t.map(s=>`${s.domain||"ai.onnx"} v${s.version}`).join(", ")}`)}function fT(e,t){if(t.endsWith("+")){let n=Number.parseInt(t.substring(0,t.length-1),10);return!isNaN(n)&&n<=e}else if(t.split("-").length===2){let n=t.split("-"),s=Number.parseInt(n[0],10),u=Number.parseInt(n[1],10);return!isNaN(s)&&!isNaN(u)&&s<=e&&e<=u}else return Number.parseInt(t,10)===e}var mT=k(()=>{"use strict"}),gT=ne(e=>{"use strict";e.__esModule=!0;var t=(function(){function n(s){if(!s)throw new TypeError("Invalid argument; `value` has no value.");this.value=n.EMPTY,s&&n.isGuid(s)&&(this.value=s)}return n.isGuid=function(s){var u=s.toString();return s&&(s instanceof n||n.validator.test(u))},n.create=function(){return new n([n.gen(2),n.gen(1),n.gen(1),n.gen(1),n.gen(3)].join("-"))},n.createEmpty=function(){return new n("emptyguid")},n.parse=function(s){return new n(s)},n.raw=function(){return[n.gen(2),n.gen(1),n.gen(1),n.gen(1),n.gen(3)].join("-")},n.gen=function(s){for(var u="",l=0;l<s;l++)u+=((1+Math.random())*65536|0).toString(16).substring(1);return u},n.prototype.equals=function(s){return n.isGuid(s)&&this.value===s.toString()},n.prototype.isEmpty=function(){return this.value===n.EMPTY},n.prototype.toString=function(){return this.value},n.prototype.toJSON=function(){return{value:this.value}},n.validator=new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$","i"),n.EMPTY="00000000-0000-0000-0000-000000000000",n})();e.Guid=t});function Ne(e,t,n){this.low=e|0,this.high=t|0,this.unsigned=!!n}function rt(e){return(e&&e.__isLong__)===!0}function op(e){var t=Math.clz32(e&-e);return e?31-t:t}function xr(e,t){var n,s,u;return t?(e>>>=0,(u=0<=e&&e<256)&&(s=fs[e],s)?s:(n=Ee(e,0,!0),u&&(fs[e]=n),n)):(e|=0,(u=-128<=e&&e<128)&&(s=hs[e],s)?s:(n=Ee(e,e<0?-1:0,!1),u&&(hs[e]=n),n))}function vt(e,t){if(isNaN(e))return t?Ft:_t;if(t){if(e<0)return Ft;if(e>=ms)return ys}else{if(e<=-gs)return it;if(e+1>=gs)return bs}return e<0?vt(-e,t).neg():Ee(e%Ur|0,e/Ur|0,t)}function Ee(e,t,n){return new Ne(e,t,n)}function wu(e,t,n){if(e.length===0)throw Error("empty string");if(typeof t=="number"?(n=t,t=!1):t=!!t,e==="NaN"||e==="Infinity"||e==="+Infinity"||e==="-Infinity")return t?Ft:_t;if(n=n||10,n<2||36<n)throw RangeError("radix");var s;if((s=e.indexOf("-"))>0)throw Error("interior hyphen");if(s===0)return wu(e.substring(1),t,n).neg();for(var u=vt(Zn(n,8)),l=_t,p=0;p<e.length;p+=8){var d=Math.min(8,e.length-p),o=parseInt(e.substring(p,p+d),n);if(d<8){var r=vt(Zn(n,d));l=l.mul(r).add(vt(o))}else l=l.mul(u),l=l.add(vt(o))}return l.unsigned=t,l}function gt(e,t){return typeof e=="number"?vt(e,t):typeof e=="string"?wu(e,t):Ee(e.low,e.high,typeof t=="boolean"?t:e.unsigned)}var st,hs,fs,Zn,Fo,ap,Ur,ms,gs,Lo,_t,Ft,$r,Vo,$i,bs,ys,it,G,Xr,Ab=k(()=>{st=null;try{st=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}Ne.prototype.__isLong__,Object.defineProperty(Ne.prototype,"__isLong__",{value:!0}),Ne.isLong=rt,hs={},fs={},Ne.fromInt=xr,Ne.fromNumber=vt,Ne.fromBits=Ee,Zn=Math.pow,Ne.fromString=wu,Ne.fromValue=gt,Fo=65536,ap=1<<24,Ur=Fo*Fo,ms=Ur*Ur,gs=ms/2,Lo=xr(ap),_t=xr(0),Ne.ZERO=_t,Ft=xr(0,!0),Ne.UZERO=Ft,$r=xr(1),Ne.ONE=$r,Vo=xr(1,!0),Ne.UONE=Vo,$i=xr(-1),Ne.NEG_ONE=$i,bs=Ee(-1,2147483647,!1),Ne.MAX_VALUE=bs,ys=Ee(-1,-1,!0),Ne.MAX_UNSIGNED_VALUE=ys,it=Ee(0,-2147483648,!1),Ne.MIN_VALUE=it,G=Ne.prototype,G.toInt=function(){return this.unsigned?this.low>>>0:this.low},G.toNumber=function(){return this.unsigned?(this.high>>>0)*Ur+(this.low>>>0):this.high*Ur+(this.low>>>0)},G.toString=function(e){if(e=e||10,e<2||36<e)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(it)){var t=vt(e),n=this.div(t),s=n.mul(t).sub(this);return n.toString(e)+s.toInt().toString(e)}else return"-"+this.neg().toString(e);for(var u=vt(Zn(e,6),this.unsigned),l=this,p="";;){var d=l.div(u),o=l.sub(d.mul(u)).toInt()>>>0,r=o.toString(e);if(l=d,l.isZero())return r+p;for(;r.length<6;)r="0"+r;p=""+r+p}},G.getHighBits=function(){return this.high},G.getHighBitsUnsigned=function(){return this.high>>>0},G.getLowBits=function(){return this.low},G.getLowBitsUnsigned=function(){return this.low>>>0},G.getNumBitsAbs=function(){if(this.isNegative())return this.eq(it)?64:this.neg().getNumBitsAbs();for(var e=this.high!=0?this.high:this.low,t=31;t>0&&(e&1<<t)==0;t--);return this.high!=0?t+33:t+1},G.isSafeInteger=function(){var e=this.high>>21;return e?this.unsigned?!1:e===-1&&!(this.low===0&&this.high===-2097152):!0},G.isZero=function(){return this.high===0&&this.low===0},G.eqz=G.isZero,G.isNegative=function(){return!this.unsigned&&this.high<0},G.isPositive=function(){return this.unsigned||this.high>=0},G.isOdd=function(){return(this.low&1)===1},G.isEven=function(){return(this.low&1)===0},G.equals=function(e){return rt(e)||(e=gt(e)),this.unsigned!==e.unsigned&&this.high>>>31===1&&e.high>>>31===1?!1:this.high===e.high&&this.low===e.low},G.eq=G.equals,G.notEquals=function(e){return!this.eq(e)},G.neq=G.notEquals,G.ne=G.notEquals,G.lessThan=function(e){return this.comp(e)<0},G.lt=G.lessThan,G.lessThanOrEqual=function(e){return this.comp(e)<=0},G.lte=G.lessThanOrEqual,G.le=G.lessThanOrEqual,G.greaterThan=function(e){return this.comp(e)>0},G.gt=G.greaterThan,G.greaterThanOrEqual=function(e){return this.comp(e)>=0},G.gte=G.greaterThanOrEqual,G.ge=G.greaterThanOrEqual,G.compare=function(e){if(rt(e)||(e=gt(e)),this.eq(e))return 0;var t=this.isNegative(),n=e.isNegative();return t&&!n?-1:!t&&n?1:this.unsigned?e.high>>>0>this.high>>>0||e.high===this.high&&e.low>>>0>this.low>>>0?-1:1:this.sub(e).isNegative()?-1:1},G.comp=G.compare,G.negate=function(){return!this.unsigned&&this.eq(it)?it:this.not().add($r)},G.neg=G.negate,G.add=function(e){rt(e)||(e=gt(e));var t=this.high>>>16,n=this.high&65535,s=this.low>>>16,u=this.low&65535,l=e.high>>>16,p=e.high&65535,d=e.low>>>16,o=e.low&65535,r=0,i=0,a=0,c=0;return c+=u+o,a+=c>>>16,c&=65535,a+=s+d,i+=a>>>16,a&=65535,i+=n+p,r+=i>>>16,i&=65535,r+=t+l,r&=65535,Ee(a<<16|c,r<<16|i,this.unsigned)},G.subtract=function(e){return rt(e)||(e=gt(e)),this.add(e.neg())},G.sub=G.subtract,G.multiply=function(e){if(this.isZero())return this;if(rt(e)||(e=gt(e)),st){var t=st.mul(this.low,this.high,e.low,e.high);return Ee(t,st.get_high(),this.unsigned)}if(e.isZero())return this.unsigned?Ft:_t;if(this.eq(it))return e.isOdd()?it:_t;if(e.eq(it))return this.isOdd()?it:_t;if(this.isNegative())return e.isNegative()?this.neg().mul(e.neg()):this.neg().mul(e).neg();if(e.isNegative())return this.mul(e.neg()).neg();if(this.lt(Lo)&&e.lt(Lo))return vt(this.toNumber()*e.toNumber(),this.unsigned);var n=this.high>>>16,s=this.high&65535,u=this.low>>>16,l=this.low&65535,p=e.high>>>16,d=e.high&65535,o=e.low>>>16,r=e.low&65535,i=0,a=0,c=0,h=0;return h+=l*r,c+=h>>>16,h&=65535,c+=u*r,a+=c>>>16,c&=65535,c+=l*o,a+=c>>>16,c&=65535,a+=s*r,i+=a>>>16,a&=65535,a+=u*o,i+=a>>>16,a&=65535,a+=l*d,i+=a>>>16,a&=65535,i+=n*r+s*o+u*d+l*p,i&=65535,Ee(c<<16|h,i<<16|a,this.unsigned)},G.mul=G.multiply,G.divide=function(e){if(rt(e)||(e=gt(e)),e.isZero())throw Error("division by zero");if(st){if(!this.unsigned&&this.high===-2147483648&&e.low===-1&&e.high===-1)return this;var t=(this.unsigned?st.div_u:st.div_s)(this.low,this.high,e.low,e.high);return Ee(t,st.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?Ft:_t;var n,s,u;if(this.unsigned){if(e.unsigned||(e=e.toUnsigned()),e.gt(this))return Ft;if(e.gt(this.shru(1)))return Vo;u=Ft}else{if(this.eq(it)){if(e.eq($r)||e.eq($i))return it;if(e.eq(it))return $r;var l=this.shr(1);return n=l.div(e).shl(1),n.eq(_t)?e.isNegative()?$r:$i:(s=this.sub(e.mul(n)),u=n.add(s.div(e)),u)}else if(e.eq(it))return this.unsigned?Ft:_t;if(this.isNegative())return e.isNegative()?this.neg().div(e.neg()):this.neg().div(e).neg();if(e.isNegative())return this.div(e.neg()).neg();u=_t}for(s=this;s.gte(e);){n=Math.max(1,Math.floor(s.toNumber()/e.toNumber()));for(var p=Math.ceil(Math.log(n)/Math.LN2),d=p<=48?1:Zn(2,p-48),o=vt(n),r=o.mul(e);r.isNegative()||r.gt(s);)n-=d,o=vt(n,this.unsigned),r=o.mul(e);o.isZero()&&(o=$r),u=u.add(o),s=s.sub(r)}return u},G.div=G.divide,G.modulo=function(e){if(rt(e)||(e=gt(e)),st){var t=(this.unsigned?st.rem_u:st.rem_s)(this.low,this.high,e.low,e.high);return Ee(t,st.get_high(),this.unsigned)}return this.sub(this.div(e).mul(e))},G.mod=G.modulo,G.rem=G.modulo,G.not=function(){return Ee(~this.low,~this.high,this.unsigned)},G.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},G.clz=G.countLeadingZeros,G.countTrailingZeros=function(){return this.low?op(this.low):op(this.high)+32},G.ctz=G.countTrailingZeros,G.and=function(e){return rt(e)||(e=gt(e)),Ee(this.low&e.low,this.high&e.high,this.unsigned)},G.or=function(e){return rt(e)||(e=gt(e)),Ee(this.low|e.low,this.high|e.high,this.unsigned)},G.xor=function(e){return rt(e)||(e=gt(e)),Ee(this.low^e.low,this.high^e.high,this.unsigned)},G.shiftLeft=function(e){return rt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Ee(this.low<<e,this.high<<e|this.low>>>32-e,this.unsigned):Ee(0,this.low<<e-32,this.unsigned)},G.shl=G.shiftLeft,G.shiftRight=function(e){return rt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Ee(this.low>>>e|this.high<<32-e,this.high>>e,this.unsigned):Ee(this.high>>e-32,this.high>=0?0:-1,this.unsigned)},G.shr=G.shiftRight,G.shiftRightUnsigned=function(e){return rt(e)&&(e=e.toInt()),(e&=63)===0?this:e<32?Ee(this.low>>>e|this.high<<32-e,this.high>>>e,this.unsigned):e===32?Ee(this.high,0,this.unsigned):Ee(this.high>>>e-32,0,this.unsigned)},G.shru=G.shiftRightUnsigned,G.shr_u=G.shiftRightUnsigned,G.rotateLeft=function(e){var t;return rt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Ee(this.high,this.low,this.unsigned):e<32?(t=32-e,Ee(this.low<<e|this.high>>>t,this.high<<e|this.low>>>t,this.unsigned)):(e-=32,t=32-e,Ee(this.high<<e|this.low>>>t,this.low<<e|this.high>>>t,this.unsigned))},G.rotl=G.rotateLeft,G.rotateRight=function(e){var t;return rt(e)&&(e=e.toInt()),(e&=63)===0?this:e===32?Ee(this.high,this.low,this.unsigned):e<32?(t=32-e,Ee(this.high<<t|this.low>>>e,this.low<<t|this.high>>>e,this.unsigned)):(e-=32,t=32-e,Ee(this.low<<t|this.high>>>e,this.high<<t|this.low>>>e,this.unsigned))},G.rotr=G.rotateRight,G.toSigned=function(){return this.unsigned?Ee(this.low,this.high,!1):this},G.toUnsigned=function(){return this.unsigned?this:Ee(this.low,this.high,!0)},G.toBytes=function(e){return e?this.toBytesLE():this.toBytesBE()},G.toBytesLE=function(){var e=this.high,t=this.low;return[t&255,t>>>8&255,t>>>16&255,t>>>24,e&255,e>>>8&255,e>>>16&255,e>>>24]},G.toBytesBE=function(){var e=this.high,t=this.low;return[e>>>24,e>>>16&255,e>>>8&255,e&255,t>>>24,t>>>16&255,t>>>8&255,t&255]},Ne.fromBytes=function(e,t,n){return n?Ne.fromBytesLE(e,t):Ne.fromBytesBE(e,t)},Ne.fromBytesLE=function(e,t){return new Ne(e[0]|e[1]<<8|e[2]<<16|e[3]<<24,e[4]|e[5]<<8|e[6]<<16|e[7]<<24,t)},Ne.fromBytesBE=function(e,t){return new Ne(e[4]<<24|e[5]<<16|e[6]<<8|e[7],e[0]<<24|e[1]<<16|e[2]<<8|e[3],t)},typeof BigInt=="function"&&(Ne.fromBigInt=function(e,t){var n=Number(BigInt.asIntN(32,e)),s=Number(BigInt.asIntN(32,e>>BigInt(32)));return Ee(n,s,t)},Ne.fromValue=function(e,t){return typeof e=="bigint"?Ne.fromBigInt(e,t):gt(e,t)},G.toBigInt=function(){var e=BigInt(this.low>>>0),t=BigInt(this.unsigned?this.high>>>0:this.high);return t<<BigInt(32)|e}),Xr=Ne}),kb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ArgType=void 0;var t;(function(n){n[n.INPUT=0]="INPUT",n[n.OUTPUT=1]="OUTPUT"})(t||(e.ArgType=t={}))}),xu=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.SIZE_PREFIX_LENGTH=e.FILE_IDENTIFIER_LENGTH=e.SIZEOF_INT=e.SIZEOF_SHORT=void 0,e.SIZEOF_SHORT=2,e.SIZEOF_INT=4,e.FILE_IDENTIFIER_LENGTH=4,e.SIZE_PREFIX_LENGTH=4}),Db=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.isLittleEndian=e.float64=e.float32=e.int32=void 0,e.int32=new Int32Array(2),e.float32=new Float32Array(e.int32.buffer),e.float64=new Float64Array(e.int32.buffer),e.isLittleEndian=new Uint16Array(new Uint8Array([1,0]).buffer)[0]===1}),Cb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Encoding=void 0;var t;(function(n){n[n.UTF8_BYTES=1]="UTF8_BYTES",n[n.UTF16_STRING=2]="UTF16_STRING"})(t||(e.Encoding=t={}))}),Nb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.ByteBuffer=void 0;var t=xu(),n=Cb(),s=Db(),u=class zb{constructor(p){this.bytes_=p,this.position_=0,this.text_decoder_=new TextDecoder}static allocate(p){return new zb(new Uint8Array(p))}clear(){this.position_=0}bytes(){return this.bytes_}position(){return this.position_}setPosition(p){this.position_=p}capacity(){return this.bytes_.length}readInt8(p){return this.readUint8(p)<<24>>24}readUint8(p){return this.bytes_[p]}readInt16(p){return this.readUint16(p)<<16>>16}readUint16(p){return this.bytes_[p]|this.bytes_[p+1]<<8}readInt32(p){return this.bytes_[p]|this.bytes_[p+1]<<8|this.bytes_[p+2]<<16|this.bytes_[p+3]<<24}readUint32(p){return this.readInt32(p)>>>0}readInt64(p){return BigInt.asIntN(64,BigInt(this.readUint32(p))+(BigInt(this.readUint32(p+4))<<BigInt(32)))}readUint64(p){return BigInt.asUintN(64,BigInt(this.readUint32(p))+(BigInt(this.readUint32(p+4))<<BigInt(32)))}readFloat32(p){return s.int32[0]=this.readInt32(p),s.float32[0]}readFloat64(p){return s.int32[s.isLittleEndian?0:1]=this.readInt32(p),s.int32[s.isLittleEndian?1:0]=this.readInt32(p+4),s.float64[0]}writeInt8(p,d){this.bytes_[p]=d}writeUint8(p,d){this.bytes_[p]=d}writeInt16(p,d){this.bytes_[p]=d,this.bytes_[p+1]=d>>8}writeUint16(p,d){this.bytes_[p]=d,this.bytes_[p+1]=d>>8}writeInt32(p,d){this.bytes_[p]=d,this.bytes_[p+1]=d>>8,this.bytes_[p+2]=d>>16,this.bytes_[p+3]=d>>24}writeUint32(p,d){this.bytes_[p]=d,this.bytes_[p+1]=d>>8,this.bytes_[p+2]=d>>16,this.bytes_[p+3]=d>>24}writeInt64(p,d){this.writeInt32(p,Number(BigInt.asIntN(32,d))),this.writeInt32(p+4,Number(BigInt.asIntN(32,d>>BigInt(32))))}writeUint64(p,d){this.writeUint32(p,Number(BigInt.asUintN(32,d))),this.writeUint32(p+4,Number(BigInt.asUintN(32,d>>BigInt(32))))}writeFloat32(p,d){s.float32[0]=d,this.writeInt32(p,s.int32[0])}writeFloat64(p,d){s.float64[0]=d,this.writeInt32(p,s.int32[s.isLittleEndian?0:1]),this.writeInt32(p+4,s.int32[s.isLittleEndian?1:0])}getBufferIdentifier(){if(this.bytes_.length<this.position_+t.SIZEOF_INT+t.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: ByteBuffer is too short to contain an identifier.");let p="";for(let d=0;d<t.FILE_IDENTIFIER_LENGTH;d++)p+=String.fromCharCode(this.readInt8(this.position_+t.SIZEOF_INT+d));return p}__offset(p,d){let o=p-this.readInt32(p);return d<this.readInt16(o)?this.readInt16(o+d):0}__union(p,d){return p.bb_pos=d+this.readInt32(d),p.bb=this,p}__string(p,d){p+=this.readInt32(p);let o=this.readInt32(p);p+=t.SIZEOF_INT;let r=this.bytes_.subarray(p,p+o);return d===n.Encoding.UTF8_BYTES?r:this.text_decoder_.decode(r)}__union_with_string(p,d){return typeof p=="string"?this.__string(d):this.__union(p,d)}__indirect(p){return p+this.readInt32(p)}__vector(p){return p+this.readInt32(p)+t.SIZEOF_INT}__vector_len(p){return this.readInt32(p+this.readInt32(p))}__has_identifier(p){if(p.length!=t.FILE_IDENTIFIER_LENGTH)throw new Error("FlatBuffers: file identifier must be length "+t.FILE_IDENTIFIER_LENGTH);for(let d=0;d<t.FILE_IDENTIFIER_LENGTH;d++)if(p.charCodeAt(d)!=this.readInt8(this.position()+t.SIZEOF_INT+d))return!1;return!0}createScalarList(p,d){let o=[];for(let r=0;r<d;++r){let i=p(r);i!==null&&o.push(i)}return o}createObjList(p,d){let o=[];for(let r=0;r<d;++r){let i=p(r);i!==null&&o.push(i.unpack())}return o}};e.ByteBuffer=u}),bT=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Builder=void 0;var t=Nb(),n=xu(),s=class Rb{constructor(l){this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null,this.text_encoder=new TextEncoder;let p;l?p=l:p=1024,this.bb=t.ByteBuffer.allocate(p),this.space=p}clear(){this.bb.clear(),this.space=this.bb.capacity(),this.minalign=1,this.vtable=null,this.vtable_in_use=0,this.isNested=!1,this.object_start=0,this.vtables=[],this.vector_num_elems=0,this.force_defaults=!1,this.string_maps=null}forceDefaults(l){this.force_defaults=l}dataBuffer(){return this.bb}asUint8Array(){return this.bb.bytes().subarray(this.bb.position(),this.bb.position()+this.offset())}prep(l,p){l>this.minalign&&(this.minalign=l);let d=~(this.bb.capacity()-this.space+p)+1&l-1;for(;this.space<d+l+p;){let o=this.bb.capacity();this.bb=Rb.growByteBuffer(this.bb),this.space+=this.bb.capacity()-o}this.pad(d)}pad(l){for(let p=0;p<l;p++)this.bb.writeInt8(--this.space,0)}writeInt8(l){this.bb.writeInt8(this.space-=1,l)}writeInt16(l){this.bb.writeInt16(this.space-=2,l)}writeInt32(l){this.bb.writeInt32(this.space-=4,l)}writeInt64(l){this.bb.writeInt64(this.space-=8,l)}writeFloat32(l){this.bb.writeFloat32(this.space-=4,l)}writeFloat64(l){this.bb.writeFloat64(this.space-=8,l)}addInt8(l){this.prep(1,0),this.writeInt8(l)}addInt16(l){this.prep(2,0),this.writeInt16(l)}addInt32(l){this.prep(4,0),this.writeInt32(l)}addInt64(l){this.prep(8,0),this.writeInt64(l)}addFloat32(l){this.prep(4,0),this.writeFloat32(l)}addFloat64(l){this.prep(8,0),this.writeFloat64(l)}addFieldInt8(l,p,d){(this.force_defaults||p!=d)&&(this.addInt8(p),this.slot(l))}addFieldInt16(l,p,d){(this.force_defaults||p!=d)&&(this.addInt16(p),this.slot(l))}addFieldInt32(l,p,d){(this.force_defaults||p!=d)&&(this.addInt32(p),this.slot(l))}addFieldInt64(l,p,d){(this.force_defaults||p!==d)&&(this.addInt64(p),this.slot(l))}addFieldFloat32(l,p,d){(this.force_defaults||p!=d)&&(this.addFloat32(p),this.slot(l))}addFieldFloat64(l,p,d){(this.force_defaults||p!=d)&&(this.addFloat64(p),this.slot(l))}addFieldOffset(l,p,d){(this.force_defaults||p!=d)&&(this.addOffset(p),this.slot(l))}addFieldStruct(l,p,d){p!=d&&(this.nested(p),this.slot(l))}nested(l){if(l!=this.offset())throw new TypeError("FlatBuffers: struct must be serialized inline.")}notNested(){if(this.isNested)throw new TypeError("FlatBuffers: object serialization must not be nested.")}slot(l){this.vtable!==null&&(this.vtable[l]=this.offset())}offset(){return this.bb.capacity()-this.space}static growByteBuffer(l){let p=l.capacity();if(p&3221225472)throw new Error("FlatBuffers: cannot grow buffer beyond 2 gigabytes.");let d=p<<1,o=t.ByteBuffer.allocate(d);return o.setPosition(d-p),o.bytes().set(l.bytes(),d-p),o}addOffset(l){this.prep(n.SIZEOF_INT,0),this.writeInt32(this.offset()-l+n.SIZEOF_INT)}startObject(l){this.notNested(),this.vtable==null&&(this.vtable=[]),this.vtable_in_use=l;for(let p=0;p<l;p++)this.vtable[p]=0;this.isNested=!0,this.object_start=this.offset()}endObject(){if(this.vtable==null||!this.isNested)throw new Error("FlatBuffers: endObject called without startObject");this.addInt32(0);let l=this.offset(),p=this.vtable_in_use-1;for(;p>=0&&this.vtable[p]==0;p--);let d=p+1;for(;p>=0;p--)this.addInt16(this.vtable[p]!=0?l-this.vtable[p]:0);let o=2;this.addInt16(l-this.object_start);let r=(d+o)*n.SIZEOF_SHORT;this.addInt16(r);let i=0,a=this.space;e:for(p=0;p<this.vtables.length;p++){let c=this.bb.capacity()-this.vtables[p];if(r==this.bb.readInt16(c)){for(let h=n.SIZEOF_SHORT;h<r;h+=n.SIZEOF_SHORT)if(this.bb.readInt16(a+h)!=this.bb.readInt16(c+h))continue e;i=this.vtables[p];break}}return i?(this.space=this.bb.capacity()-l,this.bb.writeInt32(this.space,i-l)):(this.vtables.push(this.offset()),this.bb.writeInt32(this.bb.capacity()-l,this.offset()-l)),this.isNested=!1,l}finish(l,p,d){let o=d?n.SIZE_PREFIX_LENGTH:0;if(p){let r=p;if(this.prep(this.minalign,n.SIZEOF_INT+n.FILE_IDENTIFIER_LENGTH+o),r.length!=n.FILE_IDENTIFIER_LENGTH)throw new TypeError("FlatBuffers: file identifier must be length "+n.FILE_IDENTIFIER_LENGTH);for(let i=n.FILE_IDENTIFIER_LENGTH-1;i>=0;i--)this.writeInt8(r.charCodeAt(i))}this.prep(this.minalign,n.SIZEOF_INT+o),this.addOffset(l),o&&this.addInt32(this.bb.capacity()-this.space),this.bb.setPosition(this.space)}finishSizePrefixed(l,p){this.finish(l,p,!0)}requiredField(l,p){let d=this.bb.capacity()-l,o=d-this.bb.readInt32(d);if(!(p<this.bb.readInt16(o)&&this.bb.readInt16(o+p)!=0))throw new TypeError("FlatBuffers: field "+p+" must be set")}startVector(l,p,d){this.notNested(),this.vector_num_elems=p,this.prep(n.SIZEOF_INT,l*p),this.prep(d,l*p)}endVector(){return this.writeInt32(this.vector_num_elems),this.offset()}createSharedString(l){if(!l)return 0;if(this.string_maps||(this.string_maps=new Map),this.string_maps.has(l))return this.string_maps.get(l);let p=this.createString(l);return this.string_maps.set(l,p),p}createString(l){if(l==null)return 0;let p;return l instanceof Uint8Array?p=l:p=this.text_encoder.encode(l),this.addInt8(0),this.startVector(1,p.length,1),this.bb.setPosition(this.space-=p.length),this.bb.bytes().set(p,this.space),this.endVector()}createByteVector(l){return l==null?0:(this.startVector(1,l.length,1),this.bb.setPosition(this.space-=l.length),this.bb.bytes().set(l,this.space),this.endVector())}createObjectOffset(l){return l===null?0:typeof l=="string"?this.createString(l):l.pack(this)}createObjectOffsetList(l){let p=[];for(let d=0;d<l.length;++d){let o=l[d];if(o!==null)p.push(this.createObjectOffset(o));else throw new TypeError("FlatBuffers: Argument for createObjectOffsetList cannot contain null.")}return p}createStructOffsetList(l,p){return p(this,l.length),this.createObjectOffsetList(l.slice().reverse()),this.endVector()}};e.Builder=s}),Ae=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Encoding=e.ByteBuffer=e.Builder=e.isLittleEndian=e.int32=e.float64=e.float32=e.SIZE_PREFIX_LENGTH=e.SIZEOF_SHORT=e.SIZEOF_INT=e.FILE_IDENTIFIER_LENGTH=void 0;var t=xu();Object.defineProperty(e,"FILE_IDENTIFIER_LENGTH",{enumerable:!0,get:function(){return t.FILE_IDENTIFIER_LENGTH}}),Object.defineProperty(e,"SIZEOF_INT",{enumerable:!0,get:function(){return t.SIZEOF_INT}}),Object.defineProperty(e,"SIZEOF_SHORT",{enumerable:!0,get:function(){return t.SIZEOF_SHORT}}),Object.defineProperty(e,"SIZE_PREFIX_LENGTH",{enumerable:!0,get:function(){return t.SIZE_PREFIX_LENGTH}});var n=Db();Object.defineProperty(e,"float32",{enumerable:!0,get:function(){return n.float32}}),Object.defineProperty(e,"float64",{enumerable:!0,get:function(){return n.float64}}),Object.defineProperty(e,"int32",{enumerable:!0,get:function(){return n.int32}}),Object.defineProperty(e,"isLittleEndian",{enumerable:!0,get:function(){return n.isLittleEndian}});var s=bT();Object.defineProperty(e,"Builder",{enumerable:!0,get:function(){return s.Builder}});var u=Nb();Object.defineProperty(e,"ByteBuffer",{enumerable:!0,get:function(){return u.ByteBuffer}});var l=Cb();Object.defineProperty(e,"Encoding",{enumerable:!0,get:function(){return l.Encoding}})}),Bb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.ArgTypeAndIndex=void 0;var u=s(Ae()),l=kb(),p=class Ar{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsArgTypeAndIndex(o,r){return(r||new Ar).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsArgTypeAndIndex(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Ar).__init(o.readInt32(o.position())+o.position(),o)}argType(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readInt8(this.bb_pos+o):l.ArgType.INPUT}index(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint32(this.bb_pos+o):0}static startArgTypeAndIndex(o){o.startObject(2)}static addArgType(o,r){o.addFieldInt8(0,r,l.ArgType.INPUT)}static addIndex(o,r){o.addFieldInt32(1,r,0)}static endArgTypeAndIndex(o){return o.endObject()}static createArgTypeAndIndex(o,r,i){return Ar.startArgTypeAndIndex(o),Ar.addArgType(o,r),Ar.addIndex(o,i),Ar.endArgTypeAndIndex(o)}};e.ArgTypeAndIndex=p}),Mb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.AttributeType=void 0;var t;(function(n){n[n.UNDEFINED=0]="UNDEFINED",n[n.FLOAT=1]="FLOAT",n[n.INT=2]="INT",n[n.STRING=3]="STRING",n[n.TENSOR=4]="TENSOR",n[n.GRAPH=5]="GRAPH",n[n.FLOATS=6]="FLOATS",n[n.INTS=7]="INTS",n[n.STRINGS=8]="STRINGS",n[n.TENSORS=9]="TENSORS",n[n.GRAPHS=10]="GRAPHS",n[n.SPARSE_TENSOR=11]="SPARSE_TENSOR",n[n.SPARSE_TENSORS=12]="SPARSE_TENSORS"})(t||(e.AttributeType=t={}))}),jb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.NodeType=void 0;var t;(function(n){n[n.Primitive=0]="Primitive",n[n.Fused=1]="Fused"})(t||(e.NodeType=t={}))}),Fb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||(function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Node=void 0;var u=s(Ae()),l=ny(),p=jb(),d=class Xe{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsNode(r,i){return(i||new Xe).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsNode(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new Xe).__init(r.readInt32(r.position())+r.position(),r)}name(r){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.__string(this.bb_pos+i,r):null}docString(r){let i=this.bb.__offset(this.bb_pos,6);return i?this.bb.__string(this.bb_pos+i,r):null}domain(r){let i=this.bb.__offset(this.bb_pos,8);return i?this.bb.__string(this.bb_pos+i,r):null}sinceVersion(){let r=this.bb.__offset(this.bb_pos,10);return r?this.bb.readInt32(this.bb_pos+r):0}index(){let r=this.bb.__offset(this.bb_pos,12);return r?this.bb.readUint32(this.bb_pos+r):0}opType(r){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb_pos+i,r):null}type(){let r=this.bb.__offset(this.bb_pos,16);return r?this.bb.readInt32(this.bb_pos+r):p.NodeType.Primitive}executionProviderType(r){let i=this.bb.__offset(this.bb_pos,18);return i?this.bb.__string(this.bb_pos+i,r):null}inputs(r,i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}inputsLength(){let r=this.bb.__offset(this.bb_pos,20);return r?this.bb.__vector_len(this.bb_pos+r):0}outputs(r,i){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}outputsLength(){let r=this.bb.__offset(this.bb_pos,22);return r?this.bb.__vector_len(this.bb_pos+r):0}attributes(r,i){let a=this.bb.__offset(this.bb_pos,24);return a?(i||new l.Attribute).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+a)+r*4),this.bb):null}attributesLength(){let r=this.bb.__offset(this.bb_pos,24);return r?this.bb.__vector_len(this.bb_pos+r):0}inputArgCounts(r){let i=this.bb.__offset(this.bb_pos,26);return i?this.bb.readInt32(this.bb.__vector(this.bb_pos+i)+r*4):0}inputArgCountsLength(){let r=this.bb.__offset(this.bb_pos,26);return r?this.bb.__vector_len(this.bb_pos+r):0}inputArgCountsArray(){let r=this.bb.__offset(this.bb_pos,26);return r?new Int32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+r),this.bb.__vector_len(this.bb_pos+r)):null}implicitInputs(r,i){let a=this.bb.__offset(this.bb_pos,28);return a?this.bb.__string(this.bb.__vector(this.bb_pos+a)+r*4,i):null}implicitInputsLength(){let r=this.bb.__offset(this.bb_pos,28);return r?this.bb.__vector_len(this.bb_pos+r):0}static startNode(r){r.startObject(13)}static addName(r,i){r.addFieldOffset(0,i,0)}static addDocString(r,i){r.addFieldOffset(1,i,0)}static addDomain(r,i){r.addFieldOffset(2,i,0)}static addSinceVersion(r,i){r.addFieldInt32(3,i,0)}static addIndex(r,i){r.addFieldInt32(4,i,0)}static addOpType(r,i){r.addFieldOffset(5,i,0)}static addType(r,i){r.addFieldInt32(6,i,p.NodeType.Primitive)}static addExecutionProviderType(r,i){r.addFieldOffset(7,i,0)}static addInputs(r,i){r.addFieldOffset(8,i,0)}static createInputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startInputsVector(r,i){r.startVector(4,i,4)}static addOutputs(r,i){r.addFieldOffset(9,i,0)}static createOutputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startOutputsVector(r,i){r.startVector(4,i,4)}static addAttributes(r,i){r.addFieldOffset(10,i,0)}static createAttributesVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startAttributesVector(r,i){r.startVector(4,i,4)}static addInputArgCounts(r,i){r.addFieldOffset(11,i,0)}static createInputArgCountsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addInt32(i[a]);return r.endVector()}static startInputArgCountsVector(r,i){r.startVector(4,i,4)}static addImplicitInputs(r,i){r.addFieldOffset(12,i,0)}static createImplicitInputsVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startImplicitInputsVector(r,i){r.startVector(4,i,4)}static endNode(r){return r.endObject()}static createNode(r,i,a,c,h,m,b,x,w,_,I,E,O,A){return Xe.startNode(r),Xe.addName(r,i),Xe.addDocString(r,a),Xe.addDomain(r,c),Xe.addSinceVersion(r,h),Xe.addIndex(r,m),Xe.addOpType(r,b),Xe.addType(r,x),Xe.addExecutionProviderType(r,w),Xe.addInputs(r,_),Xe.addOutputs(r,I),Xe.addAttributes(r,E),Xe.addInputArgCounts(r,O),Xe.addImplicitInputs(r,A),Xe.endNode(r)}};e.Node=d}),Lb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.EdgeEnd=void 0;var t=class{constructor(){this.bb=null,this.bb_pos=0}__init(n,s){return this.bb_pos=n,this.bb=s,this}nodeIndex(){return this.bb.readUint32(this.bb_pos)}srcArgIndex(){return this.bb.readInt32(this.bb_pos+4)}dstArgIndex(){return this.bb.readInt32(this.bb_pos+8)}static sizeOf(){return 12}static createEdgeEnd(n,s,u,l){return n.prep(4,12),n.writeInt32(l),n.writeInt32(u),n.writeInt32(s),n.offset()}};e.EdgeEnd=t}),Vb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.NodeEdge=void 0;var u=s(Ae()),l=Lb(),p=class or{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsNodeEdge(o,r){return(r||new or).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsNodeEdge(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new or).__init(o.readInt32(o.position())+o.position(),o)}nodeIndex(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb_pos+o):0}inputEdges(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+o*12,this.bb):null}inputEdgesLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}outputEdges(o,r){let i=this.bb.__offset(this.bb_pos,8);return i?(r||new l.EdgeEnd).__init(this.bb.__vector(this.bb_pos+i)+o*12,this.bb):null}outputEdgesLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}static startNodeEdge(o){o.startObject(3)}static addNodeIndex(o,r){o.addFieldInt32(0,r,0)}static addInputEdges(o,r){o.addFieldOffset(1,r,0)}static startInputEdgesVector(o,r){o.startVector(12,r,4)}static addOutputEdges(o,r){o.addFieldOffset(2,r,0)}static startOutputEdgesVector(o,r){o.startVector(12,r,4)}static endNodeEdge(o){return o.endObject()}static createNodeEdge(o,r,i,a){return or.startNodeEdge(o),or.addNodeIndex(o,r),or.addInputEdges(o,i),or.addOutputEdges(o,a),or.endNodeEdge(o)}};e.NodeEdge=p}),Ub=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(p,d,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(d,o);(!i||("get"in i?!d.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return d[o]}}),Object.defineProperty(p,r,i)}:function(p,d,o,r){r===void 0&&(r=o),p[r]=d[o]}),n=e&&e.__setModuleDefault||(Object.create?function(p,d){Object.defineProperty(p,"default",{enumerable:!0,value:d})}:function(p,d){p.default=d}),s=e&&e.__importStar||(function(){var p=function(d){return p=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},p(d)};return function(d){if(d&&d.__esModule)return d;var o={};if(d!=null)for(var r=p(d),i=0;i<r.length;i++)r[i]!=="default"&&t(o,d,r[i]);return n(o,d),o}})();Object.defineProperty(e,"__esModule",{value:!0}),e.NodesToOptimizeIndices=void 0;var u=s(Ae()),l=class bt{constructor(){this.bb=null,this.bb_pos=0}__init(d,o){return this.bb_pos=d,this.bb=o,this}static getRootAsNodesToOptimizeIndices(d,o){return(o||new bt).__init(d.readInt32(d.position())+d.position(),d)}static getSizePrefixedRootAsNodesToOptimizeIndices(d,o){return d.setPosition(d.position()+u.SIZE_PREFIX_LENGTH),(o||new bt).__init(d.readInt32(d.position())+d.position(),d)}nodeIndices(d){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb.__vector(this.bb_pos+o)+d*4):0}nodeIndicesLength(){let d=this.bb.__offset(this.bb_pos,4);return d?this.bb.__vector_len(this.bb_pos+d):0}nodeIndicesArray(){let d=this.bb.__offset(this.bb_pos,4);return d?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+d),this.bb.__vector_len(this.bb_pos+d)):null}numInputs(){let d=this.bb.__offset(this.bb_pos,6);return d?this.bb.readUint32(this.bb_pos+d):0}numOutputs(){let d=this.bb.__offset(this.bb_pos,8);return d?this.bb.readUint32(this.bb_pos+d):0}hasVariadicInput(){let d=this.bb.__offset(this.bb_pos,10);return d?!!this.bb.readInt8(this.bb_pos+d):!1}hasVariadicOutput(){let d=this.bb.__offset(this.bb_pos,12);return d?!!this.bb.readInt8(this.bb_pos+d):!1}numVariadicInputs(){let d=this.bb.__offset(this.bb_pos,14);return d?this.bb.readUint32(this.bb_pos+d):0}numVariadicOutputs(){let d=this.bb.__offset(this.bb_pos,16);return d?this.bb.readUint32(this.bb_pos+d):0}static startNodesToOptimizeIndices(d){d.startObject(7)}static addNodeIndices(d,o){d.addFieldOffset(0,o,0)}static createNodeIndicesVector(d,o){d.startVector(4,o.length,4);for(let r=o.length-1;r>=0;r--)d.addInt32(o[r]);return d.endVector()}static startNodeIndicesVector(d,o){d.startVector(4,o,4)}static addNumInputs(d,o){d.addFieldInt32(1,o,0)}static addNumOutputs(d,o){d.addFieldInt32(2,o,0)}static addHasVariadicInput(d,o){d.addFieldInt8(3,+o,0)}static addHasVariadicOutput(d,o){d.addFieldInt8(4,+o,0)}static addNumVariadicInputs(d,o){d.addFieldInt32(5,o,0)}static addNumVariadicOutputs(d,o){d.addFieldInt32(6,o,0)}static endNodesToOptimizeIndices(d){return d.endObject()}static createNodesToOptimizeIndices(d,o,r,i,a,c,h,m){return bt.startNodesToOptimizeIndices(d),bt.addNodeIndices(d,o),bt.addNumInputs(d,r),bt.addNumOutputs(d,i),bt.addHasVariadicInput(d,a),bt.addHasVariadicOutput(d,c),bt.addNumVariadicInputs(d,h),bt.addNumVariadicOutputs(d,m),bt.endNodesToOptimizeIndices(d)}};e.NodesToOptimizeIndices=l}),qb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecord=void 0;var u=s(Ae()),l=Ub(),p=class _s{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizationRecord(o,r){return(r||new _s).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizationRecord(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new _s).__init(o.readInt32(o.position())+o.position(),o)}actionId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}nodesToOptimizeIndices(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new l.NodesToOptimizeIndices).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}producedOpIds(o,r){let i=this.bb.__offset(this.bb_pos,10);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+o*4,r):null}producedOpIdsLength(){let o=this.bb.__offset(this.bb_pos,10);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizationRecord(o){o.startObject(4)}static addActionId(o,r){o.addFieldOffset(0,r,0)}static addNodesToOptimizeIndices(o,r){o.addFieldOffset(1,r,0)}static addProducedOpIds(o,r){o.addFieldOffset(3,r,0)}static createProducedOpIdsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startProducedOpIdsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizationRecord(o){return o.endObject()}};e.RuntimeOptimizationRecord=p}),Gb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizationRecordContainerEntry=void 0;var u=s(Ae()),l=qb(),p=class kr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizationRecordContainerEntry(o,r){return(r||new kr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizationRecordContainerEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new kr).__init(o.readInt32(o.position())+o.position(),o)}optimizerName(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}runtimeOptimizationRecords(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.RuntimeOptimizationRecord).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}runtimeOptimizationRecordsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizationRecordContainerEntry(o){o.startObject(2)}static addOptimizerName(o,r){o.addFieldOffset(0,r,0)}static addRuntimeOptimizationRecords(o,r){o.addFieldOffset(1,r,0)}static createRuntimeOptimizationRecordsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startRuntimeOptimizationRecordsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizationRecordContainerEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createRuntimeOptimizationRecordContainerEntry(o,r,i){return kr.startRuntimeOptimizationRecordContainerEntry(o),kr.addOptimizerName(o,r),kr.addRuntimeOptimizationRecords(o,i),kr.endRuntimeOptimizationRecordContainerEntry(o)}};e.RuntimeOptimizationRecordContainerEntry=p}),Hb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.RuntimeOptimizations=void 0;var u=s(Ae()),l=Gb(),p=class un{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsRuntimeOptimizations(o,r){return(r||new un).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsRuntimeOptimizations(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new un).__init(o.readInt32(o.position())+o.position(),o)}records(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new l.RuntimeOptimizationRecordContainerEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}recordsLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startRuntimeOptimizations(o){o.startObject(1)}static addRecords(o,r){o.addFieldOffset(0,r,0)}static createRecordsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startRecordsVector(o,r){o.startVector(4,r,4)}static endRuntimeOptimizations(o){return o.endObject()}static createRuntimeOptimizations(o,r){return un.startRuntimeOptimizations(o),un.addRecords(o,r),un.endRuntimeOptimizations(o)}};e.RuntimeOptimizations=p}),to=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TensorDataType=void 0;var t;(function(n){n[n.UNDEFINED=0]="UNDEFINED",n[n.FLOAT=1]="FLOAT",n[n.UINT8=2]="UINT8",n[n.INT8=3]="INT8",n[n.UINT16=4]="UINT16",n[n.INT16=5]="INT16",n[n.INT32=6]="INT32",n[n.INT64=7]="INT64",n[n.STRING=8]="STRING",n[n.BOOL=9]="BOOL",n[n.FLOAT16=10]="FLOAT16",n[n.DOUBLE=11]="DOUBLE",n[n.UINT32=12]="UINT32",n[n.UINT64=13]="UINT64",n[n.COMPLEX64=14]="COMPLEX64",n[n.COMPLEX128=15]="COMPLEX128",n[n.BFLOAT16=16]="BFLOAT16",n[n.FLOAT8E4M3FN=17]="FLOAT8E4M3FN",n[n.FLOAT8E4M3FNUZ=18]="FLOAT8E4M3FNUZ",n[n.FLOAT8E5M2=19]="FLOAT8E5M2",n[n.FLOAT8E5M2FNUZ=20]="FLOAT8E5M2FNUZ"})(t||(e.TensorDataType=t={}))}),ro=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Tensor=void 0;var u=s(Ae()),l=to(),p=class yt{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsTensor(o,r){return(r||new yt).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsTensor(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new yt).__init(o.readInt32(o.position())+o.position(),o)}name(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}docString(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}dims(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.readInt64(this.bb.__vector(this.bb_pos+r)+o*8):BigInt(0)}dimsLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}dataType(){let o=this.bb.__offset(this.bb_pos,10);return o?this.bb.readInt32(this.bb_pos+o):l.TensorDataType.UNDEFINED}rawData(o){let r=this.bb.__offset(this.bb_pos,12);return r?this.bb.readUint8(this.bb.__vector(this.bb_pos+r)+o):0}rawDataLength(){let o=this.bb.__offset(this.bb_pos,12);return o?this.bb.__vector_len(this.bb_pos+o):0}rawDataArray(){let o=this.bb.__offset(this.bb_pos,12);return o?new Uint8Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+o),this.bb.__vector_len(this.bb_pos+o)):null}stringData(o,r){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.__string(this.bb.__vector(this.bb_pos+i)+o*4,r):null}stringDataLength(){let o=this.bb.__offset(this.bb_pos,14);return o?this.bb.__vector_len(this.bb_pos+o):0}externalDataOffset(){let o=this.bb.__offset(this.bb_pos,16);return o?this.bb.readInt64(this.bb_pos+o):BigInt("-1")}static startTensor(o){o.startObject(7)}static addName(o,r){o.addFieldOffset(0,r,0)}static addDocString(o,r){o.addFieldOffset(1,r,0)}static addDims(o,r){o.addFieldOffset(2,r,0)}static createDimsVector(o,r){o.startVector(8,r.length,8);for(let i=r.length-1;i>=0;i--)o.addInt64(r[i]);return o.endVector()}static startDimsVector(o,r){o.startVector(8,r,8)}static addDataType(o,r){o.addFieldInt32(3,r,l.TensorDataType.UNDEFINED)}static addRawData(o,r){o.addFieldOffset(4,r,0)}static createRawDataVector(o,r){o.startVector(1,r.length,1);for(let i=r.length-1;i>=0;i--)o.addInt8(r[i]);return o.endVector()}static startRawDataVector(o,r){o.startVector(1,r,1)}static addStringData(o,r){o.addFieldOffset(5,r,0)}static createStringDataVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startStringDataVector(o,r){o.startVector(4,r,4)}static addExternalDataOffset(o,r){o.addFieldInt64(6,r,BigInt("-1"))}static endTensor(o){return o.endObject()}static createTensor(o,r,i,a,c,h,m,b){return yt.startTensor(o),yt.addName(o,r),yt.addDocString(o,i),yt.addDims(o,a),yt.addDataType(o,c),yt.addRawData(o,h),yt.addStringData(o,m),yt.addExternalDataOffset(o,b),yt.endTensor(o)}};e.Tensor=p}),Wb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.SparseTensor=void 0;var u=s(Ae()),l=ro(),p=class vs{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsSparseTensor(o,r){return(r||new vs).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsSparseTensor(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new vs).__init(o.readInt32(o.position())+o.position(),o)}values(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new l.Tensor).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}indices(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new l.Tensor).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}dims(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.readInt64(this.bb.__vector(this.bb_pos+r)+o*8):BigInt(0)}dimsLength(){let o=this.bb.__offset(this.bb_pos,8);return o?this.bb.__vector_len(this.bb_pos+o):0}static startSparseTensor(o){o.startObject(3)}static addValues(o,r){o.addFieldOffset(0,r,0)}static addIndices(o,r){o.addFieldOffset(1,r,0)}static addDims(o,r){o.addFieldOffset(2,r,0)}static createDimsVector(o,r){o.startVector(8,r.length,8);for(let i=r.length-1;i>=0;i--)o.addInt64(r[i]);return o.endVector()}static startDimsVector(o,r){o.startVector(8,r,8)}static endSparseTensor(o){return o.endObject()}};e.SparseTensor=p}),Kb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||(function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}})();Object.defineProperty(e,"__esModule",{value:!0}),e.MapType=void 0;var u=s(Ae()),l=to(),p=no(),d=class ws{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsMapType(r,i){return(i||new ws).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsMapType(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new ws).__init(r.readInt32(r.position())+r.position(),r)}keyType(){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.readInt32(this.bb_pos+r):l.TensorDataType.UNDEFINED}valueType(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new p.TypeInfo).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startMapType(r){r.startObject(2)}static addKeyType(r,i){r.addFieldInt32(0,i,l.TensorDataType.UNDEFINED)}static addValueType(r,i){r.addFieldOffset(1,i,0)}static endMapType(r){return r.endObject()}};e.MapType=d}),Xb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.SequenceType=void 0;var u=s(Ae()),l=no(),p=class ln{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsSequenceType(o,r){return(r||new ln).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsSequenceType(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new ln).__init(o.readInt32(o.position())+o.position(),o)}elemType(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new l.TypeInfo).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startSequenceType(o){o.startObject(1)}static addElemType(o,r){o.addFieldOffset(0,r,0)}static endSequenceType(o){return o.endObject()}static createSequenceType(o,r){return ln.startSequenceType(o),ln.addElemType(o,r),ln.endSequenceType(o)}};e.SequenceType=p}),Zb=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValueType=void 0;var t;(function(n){n[n.UNKNOWN=0]="UNKNOWN",n[n.VALUE=1]="VALUE",n[n.PARAM=2]="PARAM"})(t||(e.DimensionValueType=t={}))}),Jb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.DimensionValue=void 0;var u=s(Ae()),l=Zb(),p=class ar{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDimensionValue(o,r){return(r||new ar).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDimensionValue(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new ar).__init(o.readInt32(o.position())+o.position(),o)}dimType(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readInt8(this.bb_pos+o):l.DimensionValueType.UNKNOWN}dimValue(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readInt64(this.bb_pos+o):BigInt("0")}dimParam(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.__string(this.bb_pos+r,o):null}static startDimensionValue(o){o.startObject(3)}static addDimType(o,r){o.addFieldInt8(0,r,l.DimensionValueType.UNKNOWN)}static addDimValue(o,r){o.addFieldInt64(1,r,BigInt("0"))}static addDimParam(o,r){o.addFieldOffset(2,r,0)}static endDimensionValue(o){return o.endObject()}static createDimensionValue(o,r,i,a){return ar.startDimensionValue(o),ar.addDimType(o,r),ar.addDimValue(o,i),ar.addDimParam(o,a),ar.endDimensionValue(o)}};e.DimensionValue=p}),Qb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Dimension=void 0;var u=s(Ae()),l=Jb(),p=class Dr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDimension(o,r){return(r||new Dr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDimension(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Dr).__init(o.readInt32(o.position())+o.position(),o)}value(o){let r=this.bb.__offset(this.bb_pos,4);return r?(o||new l.DimensionValue).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}denotation(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}static startDimension(o){o.startObject(2)}static addValue(o,r){o.addFieldOffset(0,r,0)}static addDenotation(o,r){o.addFieldOffset(1,r,0)}static endDimension(o){return o.endObject()}static createDimension(o,r,i){return Dr.startDimension(o),Dr.addValue(o,r),Dr.addDenotation(o,i),Dr.endDimension(o)}};e.Dimension=p}),Yb=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Shape=void 0;var u=s(Ae()),l=Qb(),p=class dn{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsShape(o,r){return(r||new dn).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsShape(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new dn).__init(o.readInt32(o.position())+o.position(),o)}dim(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new l.Dimension).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}dimLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startShape(o){o.startObject(1)}static addDim(o,r){o.addFieldOffset(0,r,0)}static createDimVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startDimVector(o,r){o.startVector(4,r,4)}static endShape(o){return o.endObject()}static createShape(o,r){return dn.startShape(o),dn.addDim(o,r),dn.endShape(o)}};e.Shape=p}),ey=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||(function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}})();Object.defineProperty(e,"__esModule",{value:!0}),e.TensorTypeAndShape=void 0;var u=s(Ae()),l=Yb(),p=to(),d=class xs{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsTensorTypeAndShape(r,i){return(i||new xs).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsTensorTypeAndShape(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new xs).__init(r.readInt32(r.position())+r.position(),r)}elemType(){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.readInt32(this.bb_pos+r):p.TensorDataType.UNDEFINED}shape(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.Shape).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startTensorTypeAndShape(r){r.startObject(2)}static addElemType(r,i){r.addFieldInt32(0,i,p.TensorDataType.UNDEFINED)}static addShape(r,i){r.addFieldOffset(1,i,0)}static endTensorTypeAndShape(r){return r.endObject()}};e.TensorTypeAndShape=d}),ty=ne(e=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.TypeInfoValue=void 0,e.unionToTypeInfoValue=l,e.unionListToTypeInfoValue=p;var t=Kb(),n=Xb(),s=ey(),u;(function(d){d[d.NONE=0]="NONE",d[d.tensor_type=1]="tensor_type",d[d.sequence_type=2]="sequence_type",d[d.map_type=3]="map_type"})(u||(e.TypeInfoValue=u={}));function l(d,o){switch(u[d]){case"NONE":return null;case"tensor_type":return o(new s.TensorTypeAndShape);case"sequence_type":return o(new n.SequenceType);case"map_type":return o(new t.MapType);default:return null}}function p(d,o,r){switch(u[d]){case"NONE":return null;case"tensor_type":return o(r,new s.TensorTypeAndShape);case"sequence_type":return o(r,new n.SequenceType);case"map_type":return o(r,new t.MapType);default:return null}}}),no=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.TypeInfo=void 0;var u=s(Ae()),l=ty(),p=class sr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsTypeInfo(o,r){return(r||new sr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsTypeInfo(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new sr).__init(o.readInt32(o.position())+o.position(),o)}denotation(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}valueType(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint8(this.bb_pos+o):l.TypeInfoValue.NONE}value(o){let r=this.bb.__offset(this.bb_pos,8);return r?this.bb.__union(o,this.bb_pos+r):null}static startTypeInfo(o){o.startObject(3)}static addDenotation(o,r){o.addFieldOffset(0,r,0)}static addValueType(o,r){o.addFieldInt8(1,r,l.TypeInfoValue.NONE)}static addValue(o,r){o.addFieldOffset(2,r,0)}static endTypeInfo(o){return o.endObject()}static createTypeInfo(o,r,i,a){return sr.startTypeInfo(o),sr.addDenotation(o,r),sr.addValueType(o,i),sr.addValue(o,a),sr.endTypeInfo(o)}};e.TypeInfo=p}),ry=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.ValueInfo=void 0;var u=s(Ae()),l=no(),p=class $s{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsValueInfo(o,r){return(r||new $s).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsValueInfo(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new $s).__init(o.readInt32(o.position())+o.position(),o)}name(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}docString(o){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__string(this.bb_pos+r,o):null}type(o){let r=this.bb.__offset(this.bb_pos,8);return r?(o||new l.TypeInfo).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startValueInfo(o){o.startObject(3)}static addName(o,r){o.addFieldOffset(0,r,0)}static addDocString(o,r){o.addFieldOffset(1,r,0)}static addType(o,r){o.addFieldOffset(2,r,0)}static endValueInfo(o){return o.endObject()}};e.ValueInfo=p}),$u=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(c,h,m,b){b===void 0&&(b=m);var x=Object.getOwnPropertyDescriptor(h,m);(!x||("get"in x?!h.__esModule:x.writable||x.configurable))&&(x={enumerable:!0,get:function(){return h[m]}}),Object.defineProperty(c,b,x)}:function(c,h,m,b){b===void 0&&(b=m),c[b]=h[m]}),n=e&&e.__setModuleDefault||(Object.create?function(c,h){Object.defineProperty(c,"default",{enumerable:!0,value:h})}:function(c,h){c.default=h}),s=e&&e.__importStar||(function(){var c=function(h){return c=Object.getOwnPropertyNames||function(m){var b=[];for(var x in m)Object.prototype.hasOwnProperty.call(m,x)&&(b[b.length]=x);return b},c(h)};return function(h){if(h&&h.__esModule)return h;var m={};if(h!=null)for(var b=c(h),x=0;x<b.length;x++)b[x]!=="default"&&t(m,h,b[x]);return n(m,h),m}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Graph=void 0;var u=s(Ae()),l=Fb(),p=Vb(),d=Hb(),o=Wb(),r=ro(),i=ry(),a=class Ts{constructor(){this.bb=null,this.bb_pos=0}__init(h,m){return this.bb_pos=h,this.bb=m,this}static getRootAsGraph(h,m){return(m||new Ts).__init(h.readInt32(h.position())+h.position(),h)}static getSizePrefixedRootAsGraph(h,m){return h.setPosition(h.position()+u.SIZE_PREFIX_LENGTH),(m||new Ts).__init(h.readInt32(h.position())+h.position(),h)}initializers(h,m){let b=this.bb.__offset(this.bb_pos,4);return b?(m||new r.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}initializersLength(){let h=this.bb.__offset(this.bb_pos,4);return h?this.bb.__vector_len(this.bb_pos+h):0}nodeArgs(h,m){let b=this.bb.__offset(this.bb_pos,6);return b?(m||new i.ValueInfo).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodeArgsLength(){let h=this.bb.__offset(this.bb_pos,6);return h?this.bb.__vector_len(this.bb_pos+h):0}nodes(h,m){let b=this.bb.__offset(this.bb_pos,8);return b?(m||new l.Node).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodesLength(){let h=this.bb.__offset(this.bb_pos,8);return h?this.bb.__vector_len(this.bb_pos+h):0}maxNodeIndex(){let h=this.bb.__offset(this.bb_pos,10);return h?this.bb.readUint32(this.bb_pos+h):0}nodeEdges(h,m){let b=this.bb.__offset(this.bb_pos,12);return b?(m||new p.NodeEdge).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}nodeEdgesLength(){let h=this.bb.__offset(this.bb_pos,12);return h?this.bb.__vector_len(this.bb_pos+h):0}inputs(h,m){let b=this.bb.__offset(this.bb_pos,14);return b?this.bb.__string(this.bb.__vector(this.bb_pos+b)+h*4,m):null}inputsLength(){let h=this.bb.__offset(this.bb_pos,14);return h?this.bb.__vector_len(this.bb_pos+h):0}outputs(h,m){let b=this.bb.__offset(this.bb_pos,16);return b?this.bb.__string(this.bb.__vector(this.bb_pos+b)+h*4,m):null}outputsLength(){let h=this.bb.__offset(this.bb_pos,16);return h?this.bb.__vector_len(this.bb_pos+h):0}sparseInitializers(h,m){let b=this.bb.__offset(this.bb_pos,18);return b?(m||new o.SparseTensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+b)+h*4),this.bb):null}sparseInitializersLength(){let h=this.bb.__offset(this.bb_pos,18);return h?this.bb.__vector_len(this.bb_pos+h):0}runtimeOptimizations(h){let m=this.bb.__offset(this.bb_pos,20);return m?(h||new d.RuntimeOptimizations).__init(this.bb.__indirect(this.bb_pos+m),this.bb):null}static startGraph(h){h.startObject(9)}static addInitializers(h,m){h.addFieldOffset(0,m,0)}static createInitializersVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startInitializersVector(h,m){h.startVector(4,m,4)}static addNodeArgs(h,m){h.addFieldOffset(1,m,0)}static createNodeArgsVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startNodeArgsVector(h,m){h.startVector(4,m,4)}static addNodes(h,m){h.addFieldOffset(2,m,0)}static createNodesVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startNodesVector(h,m){h.startVector(4,m,4)}static addMaxNodeIndex(h,m){h.addFieldInt32(3,m,0)}static addNodeEdges(h,m){h.addFieldOffset(4,m,0)}static createNodeEdgesVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startNodeEdgesVector(h,m){h.startVector(4,m,4)}static addInputs(h,m){h.addFieldOffset(5,m,0)}static createInputsVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startInputsVector(h,m){h.startVector(4,m,4)}static addOutputs(h,m){h.addFieldOffset(6,m,0)}static createOutputsVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startOutputsVector(h,m){h.startVector(4,m,4)}static addSparseInitializers(h,m){h.addFieldOffset(7,m,0)}static createSparseInitializersVector(h,m){h.startVector(4,m.length,4);for(let b=m.length-1;b>=0;b--)h.addOffset(m[b]);return h.endVector()}static startSparseInitializersVector(h,m){h.startVector(4,m,4)}static addRuntimeOptimizations(h,m){h.addFieldOffset(8,m,0)}static endGraph(h){return h.endObject()}};e.Graph=a}),ny=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(r,i,a,c){c===void 0&&(c=a);var h=Object.getOwnPropertyDescriptor(i,a);(!h||("get"in h?!i.__esModule:h.writable||h.configurable))&&(h={enumerable:!0,get:function(){return i[a]}}),Object.defineProperty(r,c,h)}:function(r,i,a,c){c===void 0&&(c=a),r[c]=i[a]}),n=e&&e.__setModuleDefault||(Object.create?function(r,i){Object.defineProperty(r,"default",{enumerable:!0,value:i})}:function(r,i){r.default=i}),s=e&&e.__importStar||(function(){var r=function(i){return r=Object.getOwnPropertyNames||function(a){var c=[];for(var h in a)Object.prototype.hasOwnProperty.call(a,h)&&(c[c.length]=h);return c},r(i)};return function(i){if(i&&i.__esModule)return i;var a={};if(i!=null)for(var c=r(i),h=0;h<c.length;h++)c[h]!=="default"&&t(a,i,c[h]);return n(a,i),a}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Attribute=void 0;var u=s(Ae()),l=Mb(),p=$u(),d=ro(),o=class Ss{constructor(){this.bb=null,this.bb_pos=0}__init(i,a){return this.bb_pos=i,this.bb=a,this}static getRootAsAttribute(i,a){return(a||new Ss).__init(i.readInt32(i.position())+i.position(),i)}static getSizePrefixedRootAsAttribute(i,a){return i.setPosition(i.position()+u.SIZE_PREFIX_LENGTH),(a||new Ss).__init(i.readInt32(i.position())+i.position(),i)}name(i){let a=this.bb.__offset(this.bb_pos,4);return a?this.bb.__string(this.bb_pos+a,i):null}docString(i){let a=this.bb.__offset(this.bb_pos,6);return a?this.bb.__string(this.bb_pos+a,i):null}type(){let i=this.bb.__offset(this.bb_pos,8);return i?this.bb.readInt32(this.bb_pos+i):l.AttributeType.UNDEFINED}f(){let i=this.bb.__offset(this.bb_pos,10);return i?this.bb.readFloat32(this.bb_pos+i):0}i(){let i=this.bb.__offset(this.bb_pos,12);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}s(i){let a=this.bb.__offset(this.bb_pos,14);return a?this.bb.__string(this.bb_pos+a,i):null}t(i){let a=this.bb.__offset(this.bb_pos,16);return a?(i||new d.Tensor).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}g(i){let a=this.bb.__offset(this.bb_pos,18);return a?(i||new p.Graph).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}floats(i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.readFloat32(this.bb.__vector(this.bb_pos+a)+i*4):0}floatsLength(){let i=this.bb.__offset(this.bb_pos,20);return i?this.bb.__vector_len(this.bb_pos+i):0}floatsArray(){let i=this.bb.__offset(this.bb_pos,20);return i?new Float32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+i),this.bb.__vector_len(this.bb_pos+i)):null}ints(i){let a=this.bb.__offset(this.bb_pos,22);return a?this.bb.readInt64(this.bb.__vector(this.bb_pos+a)+i*8):BigInt(0)}intsLength(){let i=this.bb.__offset(this.bb_pos,22);return i?this.bb.__vector_len(this.bb_pos+i):0}strings(i,a){let c=this.bb.__offset(this.bb_pos,24);return c?this.bb.__string(this.bb.__vector(this.bb_pos+c)+i*4,a):null}stringsLength(){let i=this.bb.__offset(this.bb_pos,24);return i?this.bb.__vector_len(this.bb_pos+i):0}tensors(i,a){let c=this.bb.__offset(this.bb_pos,26);return c?(a||new d.Tensor).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}tensorsLength(){let i=this.bb.__offset(this.bb_pos,26);return i?this.bb.__vector_len(this.bb_pos+i):0}graphs(i,a){let c=this.bb.__offset(this.bb_pos,28);return c?(a||new p.Graph).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}graphsLength(){let i=this.bb.__offset(this.bb_pos,28);return i?this.bb.__vector_len(this.bb_pos+i):0}static startAttribute(i){i.startObject(13)}static addName(i,a){i.addFieldOffset(0,a,0)}static addDocString(i,a){i.addFieldOffset(1,a,0)}static addType(i,a){i.addFieldInt32(2,a,l.AttributeType.UNDEFINED)}static addF(i,a){i.addFieldFloat32(3,a,0)}static addI(i,a){i.addFieldInt64(4,a,BigInt("0"))}static addS(i,a){i.addFieldOffset(5,a,0)}static addT(i,a){i.addFieldOffset(6,a,0)}static addG(i,a){i.addFieldOffset(7,a,0)}static addFloats(i,a){i.addFieldOffset(8,a,0)}static createFloatsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addFloat32(a[c]);return i.endVector()}static startFloatsVector(i,a){i.startVector(4,a,4)}static addInts(i,a){i.addFieldOffset(9,a,0)}static createIntsVector(i,a){i.startVector(8,a.length,8);for(let c=a.length-1;c>=0;c--)i.addInt64(a[c]);return i.endVector()}static startIntsVector(i,a){i.startVector(8,a,8)}static addStrings(i,a){i.addFieldOffset(10,a,0)}static createStringsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startStringsVector(i,a){i.startVector(4,a,4)}static addTensors(i,a){i.addFieldOffset(11,a,0)}static createTensorsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startTensorsVector(i,a){i.startVector(4,a,4)}static addGraphs(i,a){i.addFieldOffset(12,a,0)}static createGraphsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startGraphsVector(i,a){i.startVector(4,a,4)}static endAttribute(i){return i.endObject()}};e.Attribute=o}),iy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(p,d,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(d,o);(!i||("get"in i?!d.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return d[o]}}),Object.defineProperty(p,r,i)}:function(p,d,o,r){r===void 0&&(r=o),p[r]=d[o]}),n=e&&e.__setModuleDefault||(Object.create?function(p,d){Object.defineProperty(p,"default",{enumerable:!0,value:d})}:function(p,d){p.default=d}),s=e&&e.__importStar||(function(){var p=function(d){return p=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},p(d)};return function(d){if(d&&d.__esModule)return d;var o={};if(d!=null)for(var r=p(d),i=0;i<r.length;i++)r[i]!=="default"&&t(o,d,r[i]);return n(o,d),o}})();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedKernelCreateInfos=void 0;var u=s(Ae()),l=class Cr{constructor(){this.bb=null,this.bb_pos=0}__init(d,o){return this.bb_pos=d,this.bb=o,this}static getRootAsDeprecatedKernelCreateInfos(d,o){return(o||new Cr).__init(d.readInt32(d.position())+d.position(),d)}static getSizePrefixedRootAsDeprecatedKernelCreateInfos(d,o){return d.setPosition(d.position()+u.SIZE_PREFIX_LENGTH),(o||new Cr).__init(d.readInt32(d.position())+d.position(),d)}nodeIndices(d){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.readUint32(this.bb.__vector(this.bb_pos+o)+d*4):0}nodeIndicesLength(){let d=this.bb.__offset(this.bb_pos,4);return d?this.bb.__vector_len(this.bb_pos+d):0}nodeIndicesArray(){let d=this.bb.__offset(this.bb_pos,4);return d?new Uint32Array(this.bb.bytes().buffer,this.bb.bytes().byteOffset+this.bb.__vector(this.bb_pos+d),this.bb.__vector_len(this.bb_pos+d)):null}kernelDefHashes(d){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.readUint64(this.bb.__vector(this.bb_pos+o)+d*8):BigInt(0)}kernelDefHashesLength(){let d=this.bb.__offset(this.bb_pos,6);return d?this.bb.__vector_len(this.bb_pos+d):0}static startDeprecatedKernelCreateInfos(d){d.startObject(2)}static addNodeIndices(d,o){d.addFieldOffset(0,o,0)}static createNodeIndicesVector(d,o){d.startVector(4,o.length,4);for(let r=o.length-1;r>=0;r--)d.addInt32(o[r]);return d.endVector()}static startNodeIndicesVector(d,o){d.startVector(4,o,4)}static addKernelDefHashes(d,o){d.addFieldOffset(1,o,0)}static createKernelDefHashesVector(d,o){d.startVector(8,o.length,8);for(let r=o.length-1;r>=0;r--)d.addInt64(o[r]);return d.endVector()}static startKernelDefHashesVector(d,o){d.startVector(8,o,8)}static endDeprecatedKernelCreateInfos(d){return d.endObject()}static createDeprecatedKernelCreateInfos(d,o,r){return Cr.startDeprecatedKernelCreateInfos(d),Cr.addNodeIndices(d,o),Cr.addKernelDefHashes(d,r),Cr.endDeprecatedKernelCreateInfos(d)}};e.DeprecatedKernelCreateInfos=l}),yT=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(p,d,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(d,o);(!i||("get"in i?!d.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return d[o]}}),Object.defineProperty(p,r,i)}:function(p,d,o,r){r===void 0&&(r=o),p[r]=d[o]}),n=e&&e.__setModuleDefault||(Object.create?function(p,d){Object.defineProperty(p,"default",{enumerable:!0,value:d})}:function(p,d){p.default=d}),s=e&&e.__importStar||(function(){var p=function(d){return p=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},p(d)};return function(d){if(d&&d.__esModule)return d;var o={};if(d!=null)for(var r=p(d),i=0;i<r.length;i++)r[i]!=="default"&&t(o,d,r[i]);return n(o,d),o}})();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedNodeIndexAndKernelDefHash=void 0;var u=s(Ae()),l=class Nr{constructor(){this.bb=null,this.bb_pos=0}__init(d,o){return this.bb_pos=d,this.bb=o,this}static getRootAsDeprecatedNodeIndexAndKernelDefHash(d,o){return(o||new Nr).__init(d.readInt32(d.position())+d.position(),d)}static getSizePrefixedRootAsDeprecatedNodeIndexAndKernelDefHash(d,o){return d.setPosition(d.position()+u.SIZE_PREFIX_LENGTH),(o||new Nr).__init(d.readInt32(d.position())+d.position(),d)}nodeIndex(){let d=this.bb.__offset(this.bb_pos,4);return d?this.bb.readUint32(this.bb_pos+d):0}kernelDefHash(){let d=this.bb.__offset(this.bb_pos,6);return d?this.bb.readUint64(this.bb_pos+d):BigInt("0")}static startDeprecatedNodeIndexAndKernelDefHash(d){d.startObject(2)}static addNodeIndex(d,o){d.addFieldInt32(0,o,0)}static addKernelDefHash(d,o){d.addFieldInt64(1,o,BigInt("0"))}static endDeprecatedNodeIndexAndKernelDefHash(d){return d.endObject()}static createDeprecatedNodeIndexAndKernelDefHash(d,o,r){return Nr.startDeprecatedNodeIndexAndKernelDefHash(d),Nr.addNodeIndex(d,o),Nr.addKernelDefHash(d,r),Nr.endDeprecatedNodeIndexAndKernelDefHash(d)}};e.DeprecatedNodeIndexAndKernelDefHash=l}),oy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSubGraphSessionState=void 0;var u=s(Ae()),l=ay(),p=class Is{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsDeprecatedSubGraphSessionState(o,r){return(r||new Is).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsDeprecatedSubGraphSessionState(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Is).__init(o.readInt32(o.position())+o.position(),o)}graphId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}sessionState(o){let r=this.bb.__offset(this.bb_pos,6);return r?(o||new l.DeprecatedSessionState).__init(this.bb.__indirect(this.bb_pos+r),this.bb):null}static startDeprecatedSubGraphSessionState(o){o.startObject(2)}static addGraphId(o,r){o.addFieldOffset(0,r,0)}static addSessionState(o,r){o.addFieldOffset(1,r,0)}static endDeprecatedSubGraphSessionState(o){let r=o.endObject();return o.requiredField(r,4),r}};e.DeprecatedSubGraphSessionState=p}),ay=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||(function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}})();Object.defineProperty(e,"__esModule",{value:!0}),e.DeprecatedSessionState=void 0;var u=s(Ae()),l=iy(),p=oy(),d=class zr{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsDeprecatedSessionState(r,i){return(i||new zr).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsDeprecatedSessionState(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new zr).__init(r.readInt32(r.position())+r.position(),r)}kernels(r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new l.DeprecatedKernelCreateInfos).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}subGraphSessionStates(r,i){let a=this.bb.__offset(this.bb_pos,6);return a?(i||new p.DeprecatedSubGraphSessionState).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+a)+r*4),this.bb):null}subGraphSessionStatesLength(){let r=this.bb.__offset(this.bb_pos,6);return r?this.bb.__vector_len(this.bb_pos+r):0}static startDeprecatedSessionState(r){r.startObject(2)}static addKernels(r,i){r.addFieldOffset(0,i,0)}static addSubGraphSessionStates(r,i){r.addFieldOffset(1,i,0)}static createSubGraphSessionStatesVector(r,i){r.startVector(4,i.length,4);for(let a=i.length-1;a>=0;a--)r.addOffset(i[a]);return r.endVector()}static startSubGraphSessionStatesVector(r,i){r.startVector(4,i,4)}static endDeprecatedSessionState(r){return r.endObject()}static createDeprecatedSessionState(r,i,a){return zr.startDeprecatedSessionState(r),zr.addKernels(r,i),zr.addSubGraphSessionStates(r,a),zr.endDeprecatedSessionState(r)}};e.DeprecatedSessionState=d}),sy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrArgsEntry=void 0;var u=s(Ae()),l=Bb(),p=class Rr{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsKernelTypeStrArgsEntry(o,r){return(r||new Rr).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsKernelTypeStrArgsEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Rr).__init(o.readInt32(o.position())+o.position(),o)}kernelTypeStr(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}args(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.ArgTypeAndIndex).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}argsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startKernelTypeStrArgsEntry(o){o.startObject(2)}static addKernelTypeStr(o,r){o.addFieldOffset(0,r,0)}static addArgs(o,r){o.addFieldOffset(1,r,0)}static createArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startArgsVector(o,r){o.startVector(4,r,4)}static endKernelTypeStrArgsEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createKernelTypeStrArgsEntry(o,r,i){return Rr.startKernelTypeStrArgsEntry(o),Rr.addKernelTypeStr(o,r),Rr.addArgs(o,i),Rr.endKernelTypeStrArgsEntry(o)}};e.KernelTypeStrArgsEntry=p}),uy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.OpIdKernelTypeStrArgsEntry=void 0;var u=s(Ae()),l=sy(),p=class Br{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsOpIdKernelTypeStrArgsEntry(o,r){return(r||new Br).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsOpIdKernelTypeStrArgsEntry(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new Br).__init(o.readInt32(o.position())+o.position(),o)}opId(o){let r=this.bb.__offset(this.bb_pos,4);return r?this.bb.__string(this.bb_pos+r,o):null}kernelTypeStrArgs(o,r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new l.KernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}kernelTypeStrArgsLength(){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__vector_len(this.bb_pos+o):0}static startOpIdKernelTypeStrArgsEntry(o){o.startObject(2)}static addOpId(o,r){o.addFieldOffset(0,r,0)}static addKernelTypeStrArgs(o,r){o.addFieldOffset(1,r,0)}static createKernelTypeStrArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startKernelTypeStrArgsVector(o,r){o.startVector(4,r,4)}static endOpIdKernelTypeStrArgsEntry(o){let r=o.endObject();return o.requiredField(r,4),r}static createOpIdKernelTypeStrArgsEntry(o,r,i){return Br.startOpIdKernelTypeStrArgsEntry(o),Br.addOpId(o,r),Br.addKernelTypeStrArgs(o,i),Br.endOpIdKernelTypeStrArgsEntry(o)}};e.OpIdKernelTypeStrArgsEntry=p}),ly=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(d,o,r,i){i===void 0&&(i=r);var a=Object.getOwnPropertyDescriptor(o,r);(!a||("get"in a?!o.__esModule:a.writable||a.configurable))&&(a={enumerable:!0,get:function(){return o[r]}}),Object.defineProperty(d,i,a)}:function(d,o,r,i){i===void 0&&(i=r),d[i]=o[r]}),n=e&&e.__setModuleDefault||(Object.create?function(d,o){Object.defineProperty(d,"default",{enumerable:!0,value:o})}:function(d,o){d.default=o}),s=e&&e.__importStar||(function(){var d=function(o){return d=Object.getOwnPropertyNames||function(r){var i=[];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(i[i.length]=a);return i},d(o)};return function(o){if(o&&o.__esModule)return o;var r={};if(o!=null)for(var i=d(o),a=0;a<i.length;a++)i[a]!=="default"&&t(r,o,i[a]);return n(r,o),r}})();Object.defineProperty(e,"__esModule",{value:!0}),e.KernelTypeStrResolver=void 0;var u=s(Ae()),l=uy(),p=class pn{constructor(){this.bb=null,this.bb_pos=0}__init(o,r){return this.bb_pos=o,this.bb=r,this}static getRootAsKernelTypeStrResolver(o,r){return(r||new pn).__init(o.readInt32(o.position())+o.position(),o)}static getSizePrefixedRootAsKernelTypeStrResolver(o,r){return o.setPosition(o.position()+u.SIZE_PREFIX_LENGTH),(r||new pn).__init(o.readInt32(o.position())+o.position(),o)}opKernelTypeStrArgs(o,r){let i=this.bb.__offset(this.bb_pos,4);return i?(r||new l.OpIdKernelTypeStrArgsEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+i)+o*4),this.bb):null}opKernelTypeStrArgsLength(){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__vector_len(this.bb_pos+o):0}static startKernelTypeStrResolver(o){o.startObject(1)}static addOpKernelTypeStrArgs(o,r){o.addFieldOffset(0,r,0)}static createOpKernelTypeStrArgsVector(o,r){o.startVector(4,r.length,4);for(let i=r.length-1;i>=0;i--)o.addOffset(r[i]);return o.endVector()}static startOpKernelTypeStrArgsVector(o,r){o.startVector(4,r,4)}static endKernelTypeStrResolver(o){return o.endObject()}static createKernelTypeStrResolver(o,r){return pn.startKernelTypeStrResolver(o),pn.addOpKernelTypeStrArgs(o,r),pn.endKernelTypeStrResolver(o)}};e.KernelTypeStrResolver=p}),dy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(p,d,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(d,o);(!i||("get"in i?!d.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return d[o]}}),Object.defineProperty(p,r,i)}:function(p,d,o,r){r===void 0&&(r=o),p[r]=d[o]}),n=e&&e.__setModuleDefault||(Object.create?function(p,d){Object.defineProperty(p,"default",{enumerable:!0,value:d})}:function(p,d){p.default=d}),s=e&&e.__importStar||(function(){var p=function(d){return p=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},p(d)};return function(d){if(d&&d.__esModule)return d;var o={};if(d!=null)for(var r=p(d),i=0;i<r.length;i++)r[i]!=="default"&&t(o,d,r[i]);return n(o,d),o}})();Object.defineProperty(e,"__esModule",{value:!0}),e.OperatorSetId=void 0;var u=s(Ae()),l=class Mr{constructor(){this.bb=null,this.bb_pos=0}__init(d,o){return this.bb_pos=d,this.bb=o,this}static getRootAsOperatorSetId(d,o){return(o||new Mr).__init(d.readInt32(d.position())+d.position(),d)}static getSizePrefixedRootAsOperatorSetId(d,o){return d.setPosition(d.position()+u.SIZE_PREFIX_LENGTH),(o||new Mr).__init(d.readInt32(d.position())+d.position(),d)}domain(d){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__string(this.bb_pos+o,d):null}version(){let d=this.bb.__offset(this.bb_pos,6);return d?this.bb.readInt64(this.bb_pos+d):BigInt("0")}static startOperatorSetId(d){d.startObject(2)}static addDomain(d,o){d.addFieldOffset(0,o,0)}static addVersion(d,o){d.addFieldInt64(1,o,BigInt("0"))}static endOperatorSetId(d){return d.endObject()}static createOperatorSetId(d,o,r){return Mr.startOperatorSetId(d),Mr.addDomain(d,o),Mr.addVersion(d,r),Mr.endOperatorSetId(d)}};e.OperatorSetId=l}),py=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(p,d,o,r){r===void 0&&(r=o);var i=Object.getOwnPropertyDescriptor(d,o);(!i||("get"in i?!d.__esModule:i.writable||i.configurable))&&(i={enumerable:!0,get:function(){return d[o]}}),Object.defineProperty(p,r,i)}:function(p,d,o,r){r===void 0&&(r=o),p[r]=d[o]}),n=e&&e.__setModuleDefault||(Object.create?function(p,d){Object.defineProperty(p,"default",{enumerable:!0,value:d})}:function(p,d){p.default=d}),s=e&&e.__importStar||(function(){var p=function(d){return p=Object.getOwnPropertyNames||function(o){var r=[];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(r[r.length]=i);return r},p(d)};return function(d){if(d&&d.__esModule)return d;var o={};if(d!=null)for(var r=p(d),i=0;i<r.length;i++)r[i]!=="default"&&t(o,d,r[i]);return n(o,d),o}})();Object.defineProperty(e,"__esModule",{value:!0}),e.StringStringEntry=void 0;var u=s(Ae()),l=class jr{constructor(){this.bb=null,this.bb_pos=0}__init(d,o){return this.bb_pos=d,this.bb=o,this}static getRootAsStringStringEntry(d,o){return(o||new jr).__init(d.readInt32(d.position())+d.position(),d)}static getSizePrefixedRootAsStringStringEntry(d,o){return d.setPosition(d.position()+u.SIZE_PREFIX_LENGTH),(o||new jr).__init(d.readInt32(d.position())+d.position(),d)}key(d){let o=this.bb.__offset(this.bb_pos,4);return o?this.bb.__string(this.bb_pos+o,d):null}value(d){let o=this.bb.__offset(this.bb_pos,6);return o?this.bb.__string(this.bb_pos+o,d):null}static startStringStringEntry(d){d.startObject(2)}static addKey(d,o){d.addFieldOffset(0,o,0)}static addValue(d,o){d.addFieldOffset(1,o,0)}static endStringStringEntry(d){return d.endObject()}static createStringStringEntry(d,o,r){return jr.startStringStringEntry(d),jr.addKey(d,o),jr.addValue(d,r),jr.endStringStringEntry(d)}};e.StringStringEntry=l}),cy=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(r,i,a,c){c===void 0&&(c=a);var h=Object.getOwnPropertyDescriptor(i,a);(!h||("get"in h?!i.__esModule:h.writable||h.configurable))&&(h={enumerable:!0,get:function(){return i[a]}}),Object.defineProperty(r,c,h)}:function(r,i,a,c){c===void 0&&(c=a),r[c]=i[a]}),n=e&&e.__setModuleDefault||(Object.create?function(r,i){Object.defineProperty(r,"default",{enumerable:!0,value:i})}:function(r,i){r.default=i}),s=e&&e.__importStar||(function(){var r=function(i){return r=Object.getOwnPropertyNames||function(a){var c=[];for(var h in a)Object.prototype.hasOwnProperty.call(a,h)&&(c[c.length]=h);return c},r(i)};return function(i){if(i&&i.__esModule)return i;var a={};if(i!=null)for(var c=r(i),h=0;h<c.length;h++)c[h]!=="default"&&t(a,i,c[h]);return n(a,i),a}})();Object.defineProperty(e,"__esModule",{value:!0}),e.Model=void 0;var u=s(Ae()),l=$u(),p=dy(),d=py(),o=class Os{constructor(){this.bb=null,this.bb_pos=0}__init(i,a){return this.bb_pos=i,this.bb=a,this}static getRootAsModel(i,a){return(a||new Os).__init(i.readInt32(i.position())+i.position(),i)}static getSizePrefixedRootAsModel(i,a){return i.setPosition(i.position()+u.SIZE_PREFIX_LENGTH),(a||new Os).__init(i.readInt32(i.position())+i.position(),i)}irVersion(){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}opsetImport(i,a){let c=this.bb.__offset(this.bb_pos,6);return c?(a||new p.OperatorSetId).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}opsetImportLength(){let i=this.bb.__offset(this.bb_pos,6);return i?this.bb.__vector_len(this.bb_pos+i):0}producerName(i){let a=this.bb.__offset(this.bb_pos,8);return a?this.bb.__string(this.bb_pos+a,i):null}producerVersion(i){let a=this.bb.__offset(this.bb_pos,10);return a?this.bb.__string(this.bb_pos+a,i):null}domain(i){let a=this.bb.__offset(this.bb_pos,12);return a?this.bb.__string(this.bb_pos+a,i):null}modelVersion(){let i=this.bb.__offset(this.bb_pos,14);return i?this.bb.readInt64(this.bb_pos+i):BigInt("0")}docString(i){let a=this.bb.__offset(this.bb_pos,16);return a?this.bb.__string(this.bb_pos+a,i):null}graph(i){let a=this.bb.__offset(this.bb_pos,18);return a?(i||new l.Graph).__init(this.bb.__indirect(this.bb_pos+a),this.bb):null}graphDocString(i){let a=this.bb.__offset(this.bb_pos,20);return a?this.bb.__string(this.bb_pos+a,i):null}metadataProps(i,a){let c=this.bb.__offset(this.bb_pos,22);return c?(a||new d.StringStringEntry).__init(this.bb.__indirect(this.bb.__vector(this.bb_pos+c)+i*4),this.bb):null}metadataPropsLength(){let i=this.bb.__offset(this.bb_pos,22);return i?this.bb.__vector_len(this.bb_pos+i):0}static startModel(i){i.startObject(10)}static addIrVersion(i,a){i.addFieldInt64(0,a,BigInt("0"))}static addOpsetImport(i,a){i.addFieldOffset(1,a,0)}static createOpsetImportVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startOpsetImportVector(i,a){i.startVector(4,a,4)}static addProducerName(i,a){i.addFieldOffset(2,a,0)}static addProducerVersion(i,a){i.addFieldOffset(3,a,0)}static addDomain(i,a){i.addFieldOffset(4,a,0)}static addModelVersion(i,a){i.addFieldInt64(5,a,BigInt("0"))}static addDocString(i,a){i.addFieldOffset(6,a,0)}static addGraph(i,a){i.addFieldOffset(7,a,0)}static addGraphDocString(i,a){i.addFieldOffset(8,a,0)}static addMetadataProps(i,a){i.addFieldOffset(9,a,0)}static createMetadataPropsVector(i,a){i.startVector(4,a.length,4);for(let c=a.length-1;c>=0;c--)i.addOffset(a[c]);return i.endVector()}static startMetadataPropsVector(i,a){i.startVector(4,a,4)}static endModel(i){return i.endObject()}};e.Model=o}),_T=ne(e=>{"use strict";var t=e&&e.__createBinding||(Object.create?function(o,r,i,a){a===void 0&&(a=i);var c=Object.getOwnPropertyDescriptor(r,i);(!c||("get"in c?!r.__esModule:c.writable||c.configurable))&&(c={enumerable:!0,get:function(){return r[i]}}),Object.defineProperty(o,a,c)}:function(o,r,i,a){a===void 0&&(a=i),o[a]=r[i]}),n=e&&e.__setModuleDefault||(Object.create?function(o,r){Object.defineProperty(o,"default",{enumerable:!0,value:r})}:function(o,r){o.default=r}),s=e&&e.__importStar||(function(){var o=function(r){return o=Object.getOwnPropertyNames||function(i){var a=[];for(var c in i)Object.prototype.hasOwnProperty.call(i,c)&&(a[a.length]=c);return a},o(r)};return function(r){if(r&&r.__esModule)return r;var i={};if(r!=null)for(var a=o(r),c=0;c<a.length;c++)a[c]!=="default"&&t(i,r,a[c]);return n(i,r),i}})();Object.defineProperty(e,"__esModule",{value:!0}),e.InferenceSession=void 0;var u=s(Ae()),l=ly(),p=cy(),d=class Es{constructor(){this.bb=null,this.bb_pos=0}__init(r,i){return this.bb_pos=r,this.bb=i,this}static getRootAsInferenceSession(r,i){return(i||new Es).__init(r.readInt32(r.position())+r.position(),r)}static getSizePrefixedRootAsInferenceSession(r,i){return r.setPosition(r.position()+u.SIZE_PREFIX_LENGTH),(i||new Es).__init(r.readInt32(r.position())+r.position(),r)}static bufferHasIdentifier(r){return r.__has_identifier("ORTM")}ortVersion(r){let i=this.bb.__offset(this.bb_pos,4);return i?this.bb.__string(this.bb_pos+i,r):null}model(r){let i=this.bb.__offset(this.bb_pos,6);return i?(r||new p.Model).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}kernelTypeStrResolver(r){let i=this.bb.__offset(this.bb_pos,10);return i?(r||new l.KernelTypeStrResolver).__init(this.bb.__indirect(this.bb_pos+i),this.bb):null}static startInferenceSession(r){r.startObject(4)}static addOrtVersion(r,i){r.addFieldOffset(0,i,0)}static addModel(r,i){r.addFieldOffset(1,i,0)}static addKernelTypeStrResolver(r,i){r.addFieldOffset(3,i,0)}static endInferenceSession(r){return r.endObject()}static finishInferenceSessionBuffer(r,i){r.finish(i,"ORTM")}static finishSizePrefixedInferenceSessionBuffer(r,i){r.finish(i,"ORTM",!0)}};e.InferenceSession=d}),vT,wT,Ps,At,xT,$T,TT,ST,IT,OT,ET,PT,hy,fy,AT,kT,DT,CT,my,NT,zT,RT,BT,MT,jT,FT,LT,VT,UT,qT,GT,HT,ji,gy,WT,by,KT,XT=k(()=>{"use strict";vT=ce(kb()),wT=ce(Bb()),Ps=ce(ny()),At=ce(Mb()),xT=ce(iy()),$T=ce(yT()),TT=ce(ay()),ST=ce(oy()),IT=ce(Qb()),OT=ce(Jb()),ET=ce(Zb()),PT=ce(Lb()),hy=ce($u()),fy=ce(_T()),AT=ce(sy()),kT=ce(ly()),DT=ce(Kb()),CT=ce(cy()),my=ce(Fb()),NT=ce(Vb()),zT=ce(jb()),RT=ce(Ub()),BT=ce(uy()),MT=ce(dy()),jT=ce(qb()),FT=ce(Gb()),LT=ce(Hb()),VT=ce(Xb()),UT=ce(Yb()),qT=ce(Wb()),GT=ce(py()),HT=ce(ro()),ji=ce(to()),gy=ce(ey()),WT=ce(no()),by=ce(ty()),KT=ce(ry())}),io=k(()=>{"use strict";XT()}),ZT=ne((e,t)=>{"use strict";t.exports=n;function n(s,u){for(var l=new Array(arguments.length-1),p=0,d=2,o=!0;d<arguments.length;)l[p++]=arguments[d++];return new Promise(function(r,i){l[p]=function(a){if(o)if(o=!1,a)i(a);else{for(var c=new Array(arguments.length-1),h=0;h<c.length;)c[h++]=arguments[h];r.apply(null,c)}};try{s.apply(u||null,l)}catch(a){o&&(o=!1,i(a))}})}}),JT=ne(e=>{"use strict";var t=e;t.length=function(p){var d=p.length;if(!d)return 0;for(var o=0;--d%4>1&&p.charAt(d)==="=";)++o;return Math.ceil(p.length*3)/4-o};var n=new Array(64),s=new Array(123);for(u=0;u<64;)s[n[u]=u<26?u+65:u<52?u+71:u<62?u-4:u-59|43]=u++;var u;t.encode=function(p,d,o){for(var r=null,i=[],a=0,c=0,h;d<o;){var m=p[d++];switch(c){case 0:i[a++]=n[m>>2],h=(m&3)<<4,c=1;break;case 1:i[a++]=n[h|m>>4],h=(m&15)<<2,c=2;break;case 2:i[a++]=n[h|m>>6],i[a++]=n[m&63],c=0;break}a>8191&&((r||(r=[])).push(String.fromCharCode.apply(String,i)),a=0)}return c&&(i[a++]=n[h],i[a++]=61,c===1&&(i[a++]=61)),r?(a&&r.push(String.fromCharCode.apply(String,i.slice(0,a))),r.join("")):String.fromCharCode.apply(String,i.slice(0,a))};var l="invalid encoding";t.decode=function(p,d,o){for(var r=o,i=0,a,c=0;c<p.length;){var h=p.charCodeAt(c++);if(h===61&&i>1)break;if((h=s[h])===void 0)throw Error(l);switch(i){case 0:a=h,i=1;break;case 1:d[o++]=a<<2|(h&48)>>4,a=h,i=2;break;case 2:d[o++]=(a&15)<<4|(h&60)>>2,a=h,i=3;break;case 3:d[o++]=(a&3)<<6|h,i=0;break}}if(i===1)throw Error(l);return o-r},t.test=function(p){return/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(p)}}),QT=ne((e,t)=>{"use strict";t.exports=n;function n(){this._listeners=Object.create(null)}n.prototype.on=function(s,u,l){return(this._listeners[s]||(this._listeners[s]=[])).push({fn:u,ctx:l||this}),this},n.prototype.off=function(s,u){if(s===void 0)this._listeners=Object.create(null);else if(u===void 0)this._listeners[s]=[];else{var l=this._listeners[s];if(!l)return this;for(var p=0;p<l.length;)l[p].fn===u?l.splice(p,1):++p}return this},n.prototype.emit=function(s){var u=this._listeners[s];if(u){for(var l=[],p=1;p<arguments.length;)l.push(arguments[p++]);for(p=0;p<u.length;)u[p].fn.apply(u[p++].ctx,l)}return this}}),YT=ne((e,t)=>{"use strict";t.exports=n(n);function n(d){return typeof Float32Array<"u"?(function(){var o=new Float32Array([-0]),r=new Uint8Array(o.buffer),i=r[3]===128;function a(b,x,w){o[0]=b,x[w]=r[0],x[w+1]=r[1],x[w+2]=r[2],x[w+3]=r[3]}function c(b,x,w){o[0]=b,x[w]=r[3],x[w+1]=r[2],x[w+2]=r[1],x[w+3]=r[0]}d.writeFloatLE=i?a:c,d.writeFloatBE=i?c:a;function h(b,x){return r[0]=b[x],r[1]=b[x+1],r[2]=b[x+2],r[3]=b[x+3],o[0]}function m(b,x){return r[3]=b[x],r[2]=b[x+1],r[1]=b[x+2],r[0]=b[x+3],o[0]}d.readFloatLE=i?h:m,d.readFloatBE=i?m:h})():(function(){function o(i,a,c,h){var m=a<0?1:0;if(m&&(a=-a),a===0)i(1/a>0?0:2147483648,c,h);else if(isNaN(a))i(2143289344,c,h);else if(a>34028234663852886e22)i((m<<31|2139095040)>>>0,c,h);else if(a<11754943508222875e-54)i((m<<31|Math.round(a/1401298464324817e-60))>>>0,c,h);else{var b=Math.floor(Math.log(a)/Math.LN2),x=Math.round(a*Math.pow(2,-b)*8388608)&8388607;i((m<<31|b+127<<23|x)>>>0,c,h)}}d.writeFloatLE=o.bind(null,s),d.writeFloatBE=o.bind(null,u);function r(i,a,c){var h=i(a,c),m=(h>>31)*2+1,b=h>>>23&255,x=h&8388607;return b===255?x?NaN:m*(1/0):b===0?m*1401298464324817e-60*x:m*Math.pow(2,b-150)*(x+8388608)}d.readFloatLE=r.bind(null,l),d.readFloatBE=r.bind(null,p)})(),typeof Float64Array<"u"?(function(){var o=new Float64Array([-0]),r=new Uint8Array(o.buffer),i=r[7]===128;function a(b,x,w){o[0]=b,x[w]=r[0],x[w+1]=r[1],x[w+2]=r[2],x[w+3]=r[3],x[w+4]=r[4],x[w+5]=r[5],x[w+6]=r[6],x[w+7]=r[7]}function c(b,x,w){o[0]=b,x[w]=r[7],x[w+1]=r[6],x[w+2]=r[5],x[w+3]=r[4],x[w+4]=r[3],x[w+5]=r[2],x[w+6]=r[1],x[w+7]=r[0]}d.writeDoubleLE=i?a:c,d.writeDoubleBE=i?c:a;function h(b,x){return r[0]=b[x],r[1]=b[x+1],r[2]=b[x+2],r[3]=b[x+3],r[4]=b[x+4],r[5]=b[x+5],r[6]=b[x+6],r[7]=b[x+7],o[0]}function m(b,x){return r[7]=b[x],r[6]=b[x+1],r[5]=b[x+2],r[4]=b[x+3],r[3]=b[x+4],r[2]=b[x+5],r[1]=b[x+6],r[0]=b[x+7],o[0]}d.readDoubleLE=i?h:m,d.readDoubleBE=i?m:h})():(function(){function o(i,a,c,h,m,b){var x=h<0?1:0;if(x&&(h=-h),h===0)i(0,m,b+a),i(1/h>0?0:2147483648,m,b+c);else if(isNaN(h))i(0,m,b+a),i(2146959360,m,b+c);else if(h>17976931348623157e292)i(0,m,b+a),i((x<<31|2146435072)>>>0,m,b+c);else{var w;if(h<22250738585072014e-324)w=h/5e-324,i(w>>>0,m,b+a),i((x<<31|w/4294967296)>>>0,m,b+c);else{var _=Math.floor(Math.log(h)/Math.LN2);_===1024&&(_=1023),w=h*Math.pow(2,-_),i(w*4503599627370496>>>0,m,b+a),i((x<<31|_+1023<<20|w*1048576&1048575)>>>0,m,b+c)}}}d.writeDoubleLE=o.bind(null,s,0,4),d.writeDoubleBE=o.bind(null,u,4,0);function r(i,a,c,h,m){var b=i(h,m+a),x=i(h,m+c),w=(x>>31)*2+1,_=x>>>20&2047,I=4294967296*(x&1048575)+b;return _===2047?I?NaN:w*(1/0):_===0?w*5e-324*I:w*Math.pow(2,_-1075)*(I+4503599627370496)}d.readDoubleLE=r.bind(null,l,0,4),d.readDoubleBE=r.bind(null,p,4,0)})(),d}function s(d,o,r){o[r]=d&255,o[r+1]=d>>>8&255,o[r+2]=d>>>16&255,o[r+3]=d>>>24}function u(d,o,r){o[r]=d>>>24,o[r+1]=d>>>16&255,o[r+2]=d>>>8&255,o[r+3]=d&255}function l(d,o){return(d[o]|d[o+1]<<8|d[o+2]<<16|d[o+3]<<24)>>>0}function p(d,o){return(d[o]<<24|d[o+1]<<16|d[o+2]<<8|d[o+3])>>>0}}),e3=ne((e,t)=>{"use strict";t.exports=n;function n(s){try{if(typeof ps!="function")return null;var u=ps(s);return u&&(u.length||Object.keys(u).length)?u:null}catch{return null}}}),t3=ne(e=>{"use strict";var t=e,n="�";t.length=function(s){for(var u=0,l=0,p=0;p<s.length;++p)l=s.charCodeAt(p),l<128?u+=1:l<2048?u+=2:(l&64512)===55296&&(s.charCodeAt(p+1)&64512)===56320?(++p,u+=4):u+=3;return u},t.read=function(s,u,l){if(l-u<1)return"";for(var p="",d=u;d<l;){var o=s[d++];if(o<=127)p+=String.fromCharCode(o);else if(o>=192&&o<224){var r=(o&31)<<6|s[d++]&63;p+=r>=128?String.fromCharCode(r):n}else if(o>=224&&o<240){var i=(o&15)<<12|(s[d++]&63)<<6|s[d++]&63;p+=i>=2048?String.fromCharCode(i):n}else if(o>=240){var a=(o&7)<<18|(s[d++]&63)<<12|(s[d++]&63)<<6|s[d++]&63;a<65536||a>1114111?p+=n:(a-=65536,p+=String.fromCharCode(55296+(a>>10)),p+=String.fromCharCode(56320+(a&1023)))}}return p},t.write=function(s,u,l){for(var p=l,d,o,r=0;r<s.length;++r)d=s.charCodeAt(r),d<128?u[l++]=d:d<2048?(u[l++]=d>>6|192,u[l++]=d&63|128):(d&64512)===55296&&((o=s.charCodeAt(r+1))&64512)===56320?(d=65536+((d&1023)<<10)+(o&1023),++r,u[l++]=d>>18|240,u[l++]=d>>12&63|128,u[l++]=d>>6&63|128,u[l++]=d&63|128):(u[l++]=d>>12|224,u[l++]=d>>6&63|128,u[l++]=d&63|128);return l-p}}),r3=ne((e,t)=>{"use strict";t.exports=n;function n(s,u,l){var p=l||8192,d=p>>>1,o=null,r=p;return function(i){if(i<1||i>d)return s(i);r+i>p&&(o=s(p),r=0);var a=u.call(o,r,r+=i);return r&7&&(r=(r|7)+1),a}}}),n3=ne((e,t)=>{"use strict";t.exports=s;var n=en();function s(d,o){this.lo=d>>>0,this.hi=o>>>0}var u=s.zero=new s(0,0);u.toNumber=function(){return 0},u.zzEncode=u.zzDecode=function(){return this},u.length=function(){return 1};var l=s.zeroHash="\0\0\0\0\0\0\0\0";s.fromNumber=function(d){if(d===0)return u;var o=d<0;o&&(d=-d);var r=d>>>0,i=(d-r)/4294967296>>>0;return o&&(i=~i>>>0,r=~r>>>0,++r>4294967295&&(r=0,++i>4294967295&&(i=0))),new s(r,i)},s.from=function(d){if(typeof d=="number")return s.fromNumber(d);if(n.isString(d))if(n.Long)d=n.Long.fromString(d);else return s.fromNumber(parseInt(d,10));return d.low||d.high?new s(d.low>>>0,d.high>>>0):u},s.prototype.toNumber=function(d){if(!d&&this.hi>>>31){var o=~this.lo+1>>>0,r=~this.hi>>>0;return o||(r=r+1>>>0),-(o+r*4294967296)}return this.lo+this.hi*4294967296},s.prototype.toLong=function(d){return n.Long?new n.Long(this.lo|0,this.hi|0,!!d):{low:this.lo|0,high:this.hi|0,unsigned:!!d}};var p=String.prototype.charCodeAt;s.fromHash=function(d){return d===l?u:new s((p.call(d,0)|p.call(d,1)<<8|p.call(d,2)<<16|p.call(d,3)<<24)>>>0,(p.call(d,4)|p.call(d,5)<<8|p.call(d,6)<<16|p.call(d,7)<<24)>>>0)},s.prototype.toHash=function(){return String.fromCharCode(this.lo&255,this.lo>>>8&255,this.lo>>>16&255,this.lo>>>24,this.hi&255,this.hi>>>8&255,this.hi>>>16&255,this.hi>>>24)},s.prototype.zzEncode=function(){var d=this.hi>>31;return this.hi=((this.hi<<1|this.lo>>>31)^d)>>>0,this.lo=(this.lo<<1^d)>>>0,this},s.prototype.zzDecode=function(){var d=-(this.lo&1);return this.lo=((this.lo>>>1|this.hi<<31)^d)>>>0,this.hi=(this.hi>>>1^d)>>>0,this},s.prototype.length=function(){var d=this.lo,o=(this.lo>>>28|this.hi<<4)>>>0,r=this.hi>>>24;return r===0?o===0?d<16384?d<128?1:2:d<2097152?3:4:o<16384?o<128?5:6:o<2097152?7:8:r<128?9:10}}),i3=ne((e,t)=>{(function(n,s){function u(l){return l.default||l}typeof define=="function"&&define.amd?define([],function(){var l={};return s(l),u(l)}):typeof e=="object"?(s(e),typeof t=="object"&&(t.exports=u(e))):(function(){var l={};s(l),n.Long=u(l)})()})(typeof globalThis<"u"?globalThis:typeof self<"u"?self:e,function(n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var s=null;try{s=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function u($,B,q){this.low=$|0,this.high=B|0,this.unsigned=!!q}u.prototype.__isLong__,Object.defineProperty(u.prototype,"__isLong__",{value:!0});function l($){return($&&$.__isLong__)===!0}function p($){var B=Math.clz32($&-$);return $?31-B:B}u.isLong=l;var d={},o={};function r($,B){var q,J,K;return B?($>>>=0,(K=0<=$&&$<256)&&(J=o[$],J)?J:(q=a($,0,!0),K&&(o[$]=q),q)):($|=0,(K=-128<=$&&$<128)&&(J=d[$],J)?J:(q=a($,$<0?-1:0,!1),K&&(d[$]=q),q))}u.fromInt=r;function i($,B){if(isNaN($))return B?A:O;if(B){if($<0)return A;if($>=_)return Q}else{if($<=-I)return H;if($+1>=I)return U}return $<0?i(-$,B).neg():a($%w|0,$/w|0,B)}u.fromNumber=i;function a($,B,q){return new u($,B,q)}u.fromBits=a;var c=Math.pow;function h($,B,q){if($.length===0)throw Error("empty string");if(typeof B=="number"?(q=B,B=!1):B=!!B,$==="NaN"||$==="Infinity"||$==="+Infinity"||$==="-Infinity")return B?A:O;if(q=q||10,q<2||36<q)throw RangeError("radix");var J;if((J=$.indexOf("-"))>0)throw Error("interior hyphen");if(J===0)return h($.substring(1),B,q).neg();for(var K=i(c(q,8)),ae=O,z=0;z<$.length;z+=8){var X=Math.min(8,$.length-z),Z=parseInt($.substring(z,z+X),q);if(X<8){var V=i(c(q,X));ae=ae.mul(V).add(i(Z))}else ae=ae.mul(K),ae=ae.add(i(Z))}return ae.unsigned=B,ae}u.fromString=h;function m($,B){return typeof $=="number"?i($,B):typeof $=="string"?h($,B):a($.low,$.high,typeof B=="boolean"?B:$.unsigned)}u.fromValue=m;var b=65536,x=1<<24,w=b*b,_=w*w,I=_/2,E=r(x),O=r(0);u.ZERO=O;var A=r(0,!0);u.UZERO=A;var D=r(1);u.ONE=D;var S=r(1,!0);u.UONE=S;var F=r(-1);u.NEG_ONE=F;var U=a(-1,2147483647,!1);u.MAX_VALUE=U;var Q=a(-1,-1,!0);u.MAX_UNSIGNED_VALUE=Q;var H=a(0,-2147483648,!1);u.MIN_VALUE=H;var N=u.prototype;N.toInt=function(){return this.unsigned?this.low>>>0:this.low},N.toNumber=function(){return this.unsigned?(this.high>>>0)*w+(this.low>>>0):this.high*w+(this.low>>>0)},N.toString=function($){if($=$||10,$<2||36<$)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(H)){var B=i($),q=this.div(B),J=q.mul(B).sub(this);return q.toString($)+J.toInt().toString($)}else return"-"+this.neg().toString($);for(var K=i(c($,6),this.unsigned),ae=this,z="";;){var X=ae.div(K),Z=ae.sub(X.mul(K)).toInt()>>>0,V=Z.toString($);if(ae=X,ae.isZero())return V+z;for(;V.length<6;)V="0"+V;z=""+V+z}},N.getHighBits=function(){return this.high},N.getHighBitsUnsigned=function(){return this.high>>>0},N.getLowBits=function(){return this.low},N.getLowBitsUnsigned=function(){return this.low>>>0},N.getNumBitsAbs=function(){if(this.isNegative())return this.eq(H)?64:this.neg().getNumBitsAbs();for(var $=this.high!=0?this.high:this.low,B=31;B>0&&($&1<<B)==0;B--);return this.high!=0?B+33:B+1},N.isSafeInteger=function(){var $=this.high>>21;return $?this.unsigned?!1:$===-1&&!(this.low===0&&this.high===-2097152):!0},N.isZero=function(){return this.high===0&&this.low===0},N.eqz=N.isZero,N.isNegative=function(){return!this.unsigned&&this.high<0},N.isPositive=function(){return this.unsigned||this.high>=0},N.isOdd=function(){return(this.low&1)===1},N.isEven=function(){return(this.low&1)===0},N.equals=function($){return l($)||($=m($)),this.unsigned!==$.unsigned&&this.high>>>31===1&&$.high>>>31===1?!1:this.high===$.high&&this.low===$.low},N.eq=N.equals,N.notEquals=function($){return!this.eq($)},N.neq=N.notEquals,N.ne=N.notEquals,N.lessThan=function($){return this.comp($)<0},N.lt=N.lessThan,N.lessThanOrEqual=function($){return this.comp($)<=0},N.lte=N.lessThanOrEqual,N.le=N.lessThanOrEqual,N.greaterThan=function($){return this.comp($)>0},N.gt=N.greaterThan,N.greaterThanOrEqual=function($){return this.comp($)>=0},N.gte=N.greaterThanOrEqual,N.ge=N.greaterThanOrEqual,N.compare=function($){if(l($)||($=m($)),this.eq($))return 0;var B=this.isNegative(),q=$.isNegative();return B&&!q?-1:!B&&q?1:this.unsigned?$.high>>>0>this.high>>>0||$.high===this.high&&$.low>>>0>this.low>>>0?-1:1:this.sub($).isNegative()?-1:1},N.comp=N.compare,N.negate=function(){return!this.unsigned&&this.eq(H)?H:this.not().add(D)},N.neg=N.negate,N.add=function($){l($)||($=m($));var B=this.high>>>16,q=this.high&65535,J=this.low>>>16,K=this.low&65535,ae=$.high>>>16,z=$.high&65535,X=$.low>>>16,Z=$.low&65535,V=0,fe=0,le=0,de=0;return de+=K+Z,le+=de>>>16,de&=65535,le+=J+X,fe+=le>>>16,le&=65535,fe+=q+z,V+=fe>>>16,fe&=65535,V+=B+ae,V&=65535,a(le<<16|de,V<<16|fe,this.unsigned)},N.subtract=function($){return l($)||($=m($)),this.add($.neg())},N.sub=N.subtract,N.multiply=function($){if(this.isZero())return this;if(l($)||($=m($)),s){var B=s.mul(this.low,this.high,$.low,$.high);return a(B,s.get_high(),this.unsigned)}if($.isZero())return this.unsigned?A:O;if(this.eq(H))return $.isOdd()?H:O;if($.eq(H))return this.isOdd()?H:O;if(this.isNegative())return $.isNegative()?this.neg().mul($.neg()):this.neg().mul($).neg();if($.isNegative())return this.mul($.neg()).neg();if(this.lt(E)&&$.lt(E))return i(this.toNumber()*$.toNumber(),this.unsigned);var q=this.high>>>16,J=this.high&65535,K=this.low>>>16,ae=this.low&65535,z=$.high>>>16,X=$.high&65535,Z=$.low>>>16,V=$.low&65535,fe=0,le=0,de=0,He=0;return He+=ae*V,de+=He>>>16,He&=65535,de+=K*V,le+=de>>>16,de&=65535,de+=ae*Z,le+=de>>>16,de&=65535,le+=J*V,fe+=le>>>16,le&=65535,le+=K*Z,fe+=le>>>16,le&=65535,le+=ae*X,fe+=le>>>16,le&=65535,fe+=q*V+J*Z+K*X+ae*z,fe&=65535,a(de<<16|He,fe<<16|le,this.unsigned)},N.mul=N.multiply,N.divide=function($){if(l($)||($=m($)),$.isZero())throw Error("division by zero");if(s){if(!this.unsigned&&this.high===-2147483648&&$.low===-1&&$.high===-1)return this;var B=(this.unsigned?s.div_u:s.div_s)(this.low,this.high,$.low,$.high);return a(B,s.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?A:O;var q,J,K;if(this.unsigned){if($.unsigned||($=$.toUnsigned()),$.gt(this))return A;if($.gt(this.shru(1)))return S;K=A}else{if(this.eq(H)){if($.eq(D)||$.eq(F))return H;if($.eq(H))return D;var ae=this.shr(1);return q=ae.div($).shl(1),q.eq(O)?$.isNegative()?D:F:(J=this.sub($.mul(q)),K=q.add(J.div($)),K)}else if($.eq(H))return this.unsigned?A:O;if(this.isNegative())return $.isNegative()?this.neg().div($.neg()):this.neg().div($).neg();if($.isNegative())return this.div($.neg()).neg();K=O}for(J=this;J.gte($);){q=Math.max(1,Math.floor(J.toNumber()/$.toNumber()));for(var z=Math.ceil(Math.log(q)/Math.LN2),X=z<=48?1:c(2,z-48),Z=i(q),V=Z.mul($);V.isNegative()||V.gt(J);)q-=X,Z=i(q,this.unsigned),V=Z.mul($);Z.isZero()&&(Z=D),K=K.add(Z),J=J.sub(V)}return K},N.div=N.divide,N.modulo=function($){if(l($)||($=m($)),s){var B=(this.unsigned?s.rem_u:s.rem_s)(this.low,this.high,$.low,$.high);return a(B,s.get_high(),this.unsigned)}return this.sub(this.div($).mul($))},N.mod=N.modulo,N.rem=N.modulo,N.not=function(){return a(~this.low,~this.high,this.unsigned)},N.countLeadingZeros=function(){return this.high?Math.clz32(this.high):Math.clz32(this.low)+32},N.clz=N.countLeadingZeros,N.countTrailingZeros=function(){return this.low?p(this.low):p(this.high)+32},N.ctz=N.countTrailingZeros,N.and=function($){return l($)||($=m($)),a(this.low&$.low,this.high&$.high,this.unsigned)},N.or=function($){return l($)||($=m($)),a(this.low|$.low,this.high|$.high,this.unsigned)},N.xor=function($){return l($)||($=m($)),a(this.low^$.low,this.high^$.high,this.unsigned)},N.shiftLeft=function($){return l($)&&($=$.toInt()),($&=63)===0?this:$<32?a(this.low<<$,this.high<<$|this.low>>>32-$,this.unsigned):a(0,this.low<<$-32,this.unsigned)},N.shl=N.shiftLeft,N.shiftRight=function($){return l($)&&($=$.toInt()),($&=63)===0?this:$<32?a(this.low>>>$|this.high<<32-$,this.high>>$,this.unsigned):a(this.high>>$-32,this.high>=0?0:-1,this.unsigned)},N.shr=N.shiftRight,N.shiftRightUnsigned=function($){return l($)&&($=$.toInt()),($&=63)===0?this:$<32?a(this.low>>>$|this.high<<32-$,this.high>>>$,this.unsigned):$===32?a(this.high,0,this.unsigned):a(this.high>>>$-32,0,this.unsigned)},N.shru=N.shiftRightUnsigned,N.shr_u=N.shiftRightUnsigned,N.rotateLeft=function($){var B;return l($)&&($=$.toInt()),($&=63)===0?this:$===32?a(this.high,this.low,this.unsigned):$<32?(B=32-$,a(this.low<<$|this.high>>>B,this.high<<$|this.low>>>B,this.unsigned)):($-=32,B=32-$,a(this.high<<$|this.low>>>B,this.low<<$|this.high>>>B,this.unsigned))},N.rotl=N.rotateLeft,N.rotateRight=function($){var B;return l($)&&($=$.toInt()),($&=63)===0?this:$===32?a(this.high,this.low,this.unsigned):$<32?(B=32-$,a(this.high<<B|this.low>>>$,this.low<<B|this.high>>>$,this.unsigned)):($-=32,B=32-$,a(this.low<<B|this.high>>>$,this.high<<B|this.low>>>$,this.unsigned))},N.rotr=N.rotateRight,N.toSigned=function(){return this.unsigned?a(this.low,this.high,!1):this},N.toUnsigned=function(){return this.unsigned?this:a(this.low,this.high,!0)},N.toBytes=function($){return $?this.toBytesLE():this.toBytesBE()},N.toBytesLE=function(){var $=this.high,B=this.low;return[B&255,B>>>8&255,B>>>16&255,B>>>24,$&255,$>>>8&255,$>>>16&255,$>>>24]},N.toBytesBE=function(){var $=this.high,B=this.low;return[$>>>24,$>>>16&255,$>>>8&255,$&255,B>>>24,B>>>16&255,B>>>8&255,B&255]},u.fromBytes=function($,B,q){return q?u.fromBytesLE($,B):u.fromBytesBE($,B)},u.fromBytesLE=function($,B){return new u($[0]|$[1]<<8|$[2]<<16|$[3]<<24,$[4]|$[5]<<8|$[6]<<16|$[7]<<24,B)},u.fromBytesBE=function($,B){return new u($[4]<<24|$[5]<<16|$[6]<<8|$[7],$[0]<<24|$[1]<<16|$[2]<<8|$[3],B)},typeof BigInt=="function"&&(u.fromBigInt=function($,B){var q=Number(BigInt.asIntN(32,$)),J=Number(BigInt.asIntN(32,$>>BigInt(32)));return a(q,J,B)},u.fromValue=function($,B){return typeof $=="bigint"?u.fromBigInt($,B):m($,B)},N.toBigInt=function(){var $=BigInt(this.low>>>0),B=BigInt(this.unsigned?this.high>>>0:this.high);return B<<BigInt(32)|$});var M=n.default=u})}),en=ne(e=>{"use strict";var t=e;t.asPromise=ZT(),t.base64=JT(),t.EventEmitter=QT(),t.float=YT(),t.inquire=e3(),t.utf8=t3(),t.pool=r3(),t.LongBits=n3();function n(l){return l==="__proto__"||l==="prototype"||l==="constructor"}t.isUnsafeProperty=n,t.isNode=!!(typeof global<"u"&&global&&global.process&&global.process.versions&&global.process.versions.node),t.global=t.isNode&&global||typeof window<"u"&&window||typeof self<"u"&&self||e,t.emptyArray=Object.freeze?Object.freeze([]):[],t.emptyObject=Object.freeze?Object.freeze({}):{},t.isInteger=Number.isInteger||function(l){return typeof l=="number"&&isFinite(l)&&Math.floor(l)===l},t.isString=function(l){return typeof l=="string"||l instanceof String},t.isObject=function(l){return l&&typeof l=="object"},t.isset=t.isSet=function(l,p){var d=l[p];return d!=null&&Object.hasOwnProperty.call(l,p)?typeof d!="object"||(Array.isArray(d)?d.length:Object.keys(d).length)>0:!1},t.Buffer=(function(){try{var l=t.global.Buffer;return l.prototype.utf8Write?l:null}catch{return null}})(),t._Buffer_from=null,t._Buffer_allocUnsafe=null,t.newBuffer=function(l){return typeof l=="number"?t.Buffer?t._Buffer_allocUnsafe(l):new t.Array(l):t.Buffer?t._Buffer_from(l):typeof Uint8Array>"u"?l:new Uint8Array(l)},t.Array=typeof Uint8Array<"u"?Uint8Array:Array,t.Long=t.global.dcodeIO&&t.global.dcodeIO.Long||t.global.Long||(function(){try{var l=i3();return l&&l.isLong?l:null}catch{return null}})(),t.key2Re=/^true|false|0|1$/,t.key32Re=/^-?(?:0|[1-9][0-9]*)$/,t.key64Re=/^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/,t.longToHash=function(l){return l?t.LongBits.from(l).toHash():t.LongBits.zeroHash},t.longFromHash=function(l,p){var d=t.LongBits.fromHash(l);return t.Long?t.Long.fromBits(d.lo,d.hi,p):d.toNumber(!!p)};function s(l){var p=typeof arguments[arguments.length-1]=="boolean",d=p?arguments.length-1:arguments.length;p=p&&arguments[arguments.length-1];for(var o=1;o<d;++o){var r=arguments[o];if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)!n(i[a])&&(l[i[a]]===void 0||!p)&&(l[i[a]]=r[i[a]])}return l}t.merge=s,t.nestingLimit=32,t.recursionLimit=100,t.makeProp=function(l,p){Object.defineProperty(l,p,{enumerable:!0,configurable:!0,writable:!0})},t.lcFirst=function(l){return l.charAt(0).toLowerCase()+l.substring(1)};function u(l){function p(d,o){if(!(this instanceof p))return new p(d,o);Object.defineProperty(this,"message",{get:function(){return d}}),Error.captureStackTrace?Error.captureStackTrace(this,p):Object.defineProperty(this,"stack",{value:new Error().stack||""}),o&&s(this,o)}return p.prototype=Object.create(Error.prototype,{constructor:{value:p,writable:!0,enumerable:!1,configurable:!0},name:{get:function(){return l},set:void 0,enumerable:!1,configurable:!0},toString:{value:function(){return this.name+": "+this.message},writable:!0,enumerable:!1,configurable:!0}}),p}t.newError=u,t.ProtocolError=u("ProtocolError"),t.oneOfGetter=function(l){for(var p={},d=0;d<l.length;++d)p[l[d]]=1;return function(){for(var o=Object.keys(this),r=o.length-1;r>-1;--r)if(p[o[r]]===1&&this[o[r]]!==void 0&&this[o[r]]!==null)return o[r]}},t.oneOfSetter=function(l){return function(p){for(var d=0;d<l.length;++d)l[d]!==p&&delete this[l[d]]}},t.toJSONOptions={longs:String,enums:String,bytes:String,json:!0},t._configure=function(){var l=t.Buffer;if(!l){t._Buffer_from=t._Buffer_allocUnsafe=null;return}t._Buffer_from=l.from!==Uint8Array.from&&l.from||function(p,d){return new l(p,d)},t._Buffer_allocUnsafe=l.allocUnsafe||function(p){return new l(p)}}}),yy=ne((e,t)=>{"use strict";t.exports=i;var n=en(),s,u=n.LongBits,l=n.base64,p=n.utf8;function d(_,I,E){this.fn=_,this.len=I,this.next=void 0,this.val=E}function o(){}function r(_){this.head=_.head,this.tail=_.tail,this.len=_.len,this.next=_.states}function i(){this.len=0,this.head=new d(o,0,0),this.tail=this.head,this.states=null}var a=function(){return n.Buffer?function(){return(i.create=function(){return new s})()}:function(){return new i}};i.create=a(),i.alloc=function(_){return new n.Array(_)},n.Array!==Array&&(i.alloc=n.pool(i.alloc,n.Array.prototype.subarray)),i.prototype._push=function(_,I,E){return this.tail=this.tail.next=new d(_,I,E),this.len+=I,this};function c(_,I,E){I[E]=_&255}function h(_,I,E){for(;_>127;)I[E++]=_&127|128,_>>>=7;I[E]=_}function m(_,I){this.len=_,this.next=void 0,this.val=I}m.prototype=Object.create(d.prototype),m.prototype.fn=h,i.prototype.uint32=function(_){return this.len+=(this.tail=this.tail.next=new m((_=_>>>0)<128?1:_<16384?2:_<2097152?3:_<268435456?4:5,_)).len,this},i.prototype.int32=function(_){return(_|=0)<0?this._push(b,10,u.fromNumber(_)):this.uint32(_)},i.prototype.sint32=function(_){return this.uint32((_<<1^_>>31)>>>0)};function b(_,I,E){for(var O=_.lo,A=_.hi;A;)I[E++]=O&127|128,O=(O>>>7|A<<25)>>>0,A>>>=7;for(;O>127;)I[E++]=O&127|128,O=O>>>7;I[E++]=O}i.prototype.uint64=function(_){var I=u.from(_);return this._push(b,I.length(),I)},i.prototype.int64=i.prototype.uint64,i.prototype.sint64=function(_){var I=u.from(_).zzEncode();return this._push(b,I.length(),I)},i.prototype.bool=function(_){return this._push(c,1,_?1:0)};function x(_,I,E){I[E]=_&255,I[E+1]=_>>>8&255,I[E+2]=_>>>16&255,I[E+3]=_>>>24}i.prototype.fixed32=function(_){return this._push(x,4,_>>>0)},i.prototype.sfixed32=i.prototype.fixed32,i.prototype.fixed64=function(_){var I=u.from(_);return this._push(x,4,I.lo)._push(x,4,I.hi)},i.prototype.sfixed64=i.prototype.fixed64,i.prototype.float=function(_){return this._push(n.float.writeFloatLE,4,_)},i.prototype.double=function(_){return this._push(n.float.writeDoubleLE,8,_)};var w=n.Array.prototype.set?function(_,I,E){I.set(_,E)}:function(_,I,E){for(var O=0;O<_.length;++O)I[E+O]=_[O]};i.prototype.bytes=function(_){var I=_.length>>>0;if(!I)return this._push(c,1,0);if(n.isString(_)){var E=i.alloc(I=l.length(_));l.decode(_,E,0),_=E}return this.uint32(I)._push(w,I,_)},i.prototype.string=function(_){var I=p.length(_);return I?this.uint32(I)._push(p.write,I,_):this._push(c,1,0)},i.prototype.fork=function(){return this.states=new r(this),this.head=this.tail=new d(o,0,0),this.len=0,this},i.prototype.reset=function(){return this.states?(this.head=this.states.head,this.tail=this.states.tail,this.len=this.states.len,this.states=this.states.next):(this.head=this.tail=new d(o,0,0),this.len=0),this},i.prototype.ldelim=function(){var _=this.head,I=this.tail,E=this.len;return this.reset().uint32(E),E&&(this.tail.next=_.next,this.tail=I,this.len+=E),this},i.prototype.finish=function(){for(var _=this.head.next,I=this.constructor.alloc(this.len),E=0;_;)_.fn(_.val,I,E),E+=_.len,_=_.next;return I},i._configure=function(_){s=_,i.create=a(),s._configure()}}),o3=ne((e,t)=>{"use strict";t.exports=u;var n=yy();(u.prototype=Object.create(n.prototype)).constructor=u;var s=en();function u(){n.call(this)}u._configure=function(){u.alloc=s._Buffer_allocUnsafe,u.writeBytesBuffer=s.Buffer&&s.Buffer.prototype instanceof Uint8Array&&s.Buffer.prototype.set.name==="set"?function(p,d,o){d.set(p,o)}:function(p,d,o){if(p.copy)p.copy(d,o,0,p.length);else for(var r=0;r<p.length;)d[o++]=p[r++]}},u.prototype.bytes=function(p){s.isString(p)&&(p=s._Buffer_from(p,"base64"));var d=p.length>>>0;return this.uint32(d),d&&this._push(u.writeBytesBuffer,d,p),this};function l(p,d,o){p.length<40?s.utf8.write(p,d,o):d.utf8Write?d.utf8Write(p,o):d.write(p,o)}u.prototype.string=function(p){var d=s.Buffer.byteLength(p);return this.uint32(d),d&&this._push(l,d,p),this},u._configure()}),_y=ne((e,t)=>{"use strict";t.exports=d;var n=en(),s,u=n.LongBits,l=n.utf8;function p(h,m){return RangeError("index out of range: "+h.pos+" + "+(m||1)+" > "+h.len)}function d(h){this.buf=h,this.pos=0,this.len=h.length}var o=typeof Uint8Array<"u"?function(h){if(h instanceof Uint8Array||Array.isArray(h))return new d(h);throw Error("illegal buffer")}:function(h){if(Array.isArray(h))return new d(h);throw Error("illegal buffer")},r=function(){return n.Buffer?function(h){return(d.create=function(m){return n.Buffer.isBuffer(m)?new s(m):o(m)})(h)}:o};d.create=r(),d.prototype._slice=n.Array.prototype.subarray||n.Array.prototype.slice,d.prototype.uint32=(function(){var h=4294967295;return function(){if(h=(this.buf[this.pos]&127)>>>0,this.buf[this.pos++]<128||(h=(h|(this.buf[this.pos]&127)<<7)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&127)<<14)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&127)<<21)>>>0,this.buf[this.pos++]<128)||(h=(h|(this.buf[this.pos]&15)<<28)>>>0,this.buf[this.pos++]<128))return h;if((this.pos+=5)>this.len)throw this.pos=this.len,p(this,10);return h}})(),d.prototype.int32=function(){return this.uint32()|0},d.prototype.sint32=function(){var h=this.uint32();return h>>>1^-(h&1)|0};function i(){var h=new u(0,0),m=0;if(this.len-this.pos>4){for(;m<4;++m)if(h.lo=(h.lo|(this.buf[this.pos]&127)<<m*7)>>>0,this.buf[this.pos++]<128)return h;if(h.lo=(h.lo|(this.buf[this.pos]&127)<<28)>>>0,h.hi=(h.hi|(this.buf[this.pos]&127)>>4)>>>0,this.buf[this.pos++]<128)return h;m=0}else{for(;m<3;++m){if(this.pos>=this.len)throw p(this);if(h.lo=(h.lo|(this.buf[this.pos]&127)<<m*7)>>>0,this.buf[this.pos++]<128)return h}return h.lo=(h.lo|(this.buf[this.pos++]&127)<<m*7)>>>0,h}if(this.len-this.pos>4){for(;m<5;++m)if(h.hi=(h.hi|(this.buf[this.pos]&127)<<m*7+3)>>>0,this.buf[this.pos++]<128)return h}else for(;m<5;++m){if(this.pos>=this.len)throw p(this);if(h.hi=(h.hi|(this.buf[this.pos]&127)<<m*7+3)>>>0,this.buf[this.pos++]<128)return h}throw Error("invalid varint encoding")}d.prototype.bool=function(){return this.uint32()!==0};function a(h,m){return(h[m-4]|h[m-3]<<8|h[m-2]<<16|h[m-1]<<24)>>>0}d.prototype.fixed32=function(){if(this.pos+4>this.len)throw p(this,4);return a(this.buf,this.pos+=4)},d.prototype.sfixed32=function(){if(this.pos+4>this.len)throw p(this,4);return a(this.buf,this.pos+=4)|0};function c(){if(this.pos+8>this.len)throw p(this,8);return new u(a(this.buf,this.pos+=4),a(this.buf,this.pos+=4))}d.prototype.float=function(){if(this.pos+4>this.len)throw p(this,4);var h=n.float.readFloatLE(this.buf,this.pos);return this.pos+=4,h},d.prototype.double=function(){if(this.pos+8>this.len)throw p(this,4);var h=n.float.readDoubleLE(this.buf,this.pos);return this.pos+=8,h},d.prototype.bytes=function(){var h=this.uint32(),m=this.pos,b=this.pos+h;if(b>this.len)throw p(this,h);if(this.pos+=h,Array.isArray(this.buf))return this.buf.slice(m,b);if(m===b){var x=n.Buffer;return x?x.alloc(0):new this.buf.constructor(0)}return this._slice.call(this.buf,m,b)},d.prototype.string=function(){var h=this.bytes();return l.read(h,0,h.length)},d.prototype.skip=function(h){if(typeof h=="number"){if(this.pos+h>this.len)throw p(this,h);this.pos+=h}else do if(this.pos>=this.len)throw p(this);while(this.buf[this.pos++]&128);return this},d.recursionLimit=n.recursionLimit,d.prototype.skipType=function(h,m){if(m===void 0&&(m=0),m>d.recursionLimit)throw Error("maximum nesting depth exceeded");switch(h){case 0:this.skip();break;case 1:this.skip(8);break;case 2:this.skip(this.uint32());break;case 3:for(;(h=this.uint32()&7)!==4;)this.skipType(h,m+1);break;case 5:this.skip(4);break;default:throw Error("invalid wire type "+h+" at offset "+this.pos)}return this},d._configure=function(h){s=h,d.create=r(),s._configure();var m=n.Long?"toLong":"toNumber";n.merge(d.prototype,{int64:function(){return i.call(this)[m](!1)},uint64:function(){return i.call(this)[m](!0)},sint64:function(){return i.call(this).zzDecode()[m](!1)},fixed64:function(){return c.call(this)[m](!0)},sfixed64:function(){return c.call(this)[m](!1)}})}}),a3=ne((e,t)=>{"use strict";t.exports=u;var n=_y();(u.prototype=Object.create(n.prototype)).constructor=u;var s=en();function u(l){n.call(this,l)}u._configure=function(){s.Buffer&&(u.prototype._slice=s.Buffer.prototype.slice)},u.prototype.string=function(){var l=this.uint32();return this.buf.utf8Slice?this.buf.utf8Slice(this.pos,this.pos=Math.min(this.pos+l,this.len)):this.buf.toString("utf-8",this.pos,this.pos=Math.min(this.pos+l,this.len))},u._configure()}),s3=ne((e,t)=>{"use strict";t.exports=s;var n=en();(s.prototype=Object.create(n.EventEmitter.prototype)).constructor=s;function s(u,l,p){if(typeof u!="function")throw TypeError("rpcImpl must be a function");n.EventEmitter.call(this),this.rpcImpl=u,this.requestDelimited=!!l,this.responseDelimited=!!p}s.prototype.rpcCall=function u(l,p,d,o,r){if(!o)throw TypeError("request must be specified");var i=this;if(!r)return n.asPromise(u,i,l,p,d,o);if(!i.rpcImpl){setTimeout(function(){r(Error("already ended"))},0);return}try{return i.rpcImpl(l,p[i.requestDelimited?"encodeDelimited":"encode"](o).finish(),function(a,c){if(a)return i.emit("error",a,l),r(a);if(c===null){i.end(!0);return}if(!(c instanceof d))try{c=d[i.responseDelimited?"decodeDelimited":"decode"](c)}catch(h){return i.emit("error",h,l),r(h)}return i.emit("data",c,l),r(null,c)})}catch(a){i.emit("error",a,l),setTimeout(function(){r(a)},0);return}},s.prototype.end=function(u){return this.rpcImpl&&(u||this.rpcImpl(null,null,null),this.rpcImpl=null,this.emit("end").off()),this}}),u3=ne(e=>{"use strict";var t=e;t.Service=s3()}),l3=ne((e,t)=>{"use strict";t.exports=Object.create(null)}),d3=ne(e=>{"use strict";var t=e;t.build="minimal",t.Writer=yy(),t.BufferWriter=o3(),t.Reader=_y(),t.BufferReader=a3(),t.util=en(),t.rpc=u3(),t.roots=l3(),t.configure=n;function n(){t.util._configure(),t.Writer._configure(t.BufferWriter),t.Reader._configure(t.BufferReader)}n()}),p3=ne((e,t)=>{"use strict";t.exports=d3()}),oi=ne((e,t)=>{"use strict";var n=p3(),s=n.Reader,u=n.Writer,l=n.util,p=n.roots.default||(n.roots.default={});p.onnx=(function(){var d={};return d.Version=(function(){var o={},r=Object.create(o);return r[o[0]="_START_VERSION"]=0,r[o[1]="IR_VERSION_2017_10_10"]=1,r[o[2]="IR_VERSION_2017_10_30"]=2,r[o[3]="IR_VERSION_2017_11_3"]=3,r[o[4]="IR_VERSION_2019_1_22"]=4,r[o[5]="IR_VERSION_2019_3_18"]=5,r[o[6]="IR_VERSION_2019_9_19"]=6,r[o[7]="IR_VERSION_2020_5_8"]=7,r[o[8]="IR_VERSION_2021_7_30"]=8,r[o[9]="IR_VERSION"]=9,r})(),d.AttributeProto=(function(){function o(r){if(this.floats=[],this.ints=[],this.strings=[],this.tensors=[],this.graphs=[],this.sparseTensors=[],this.typeProtos=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.refAttrName="",o.prototype.docString="",o.prototype.type=0,o.prototype.f=0,o.prototype.i=l.Long?l.Long.fromBits(0,0,!1):0,o.prototype.s=l.newBuffer([]),o.prototype.t=null,o.prototype.g=null,o.prototype.sparseTensor=null,o.prototype.tp=null,o.prototype.floats=l.emptyArray,o.prototype.ints=l.emptyArray,o.prototype.strings=l.emptyArray,o.prototype.tensors=l.emptyArray,o.prototype.graphs=l.emptyArray,o.prototype.sparseTensors=l.emptyArray,o.prototype.typeProtos=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.f!=null&&Object.hasOwnProperty.call(r,"f")&&i.uint32(21).float(r.f),r.i!=null&&Object.hasOwnProperty.call(r,"i")&&i.uint32(24).int64(r.i),r.s!=null&&Object.hasOwnProperty.call(r,"s")&&i.uint32(34).bytes(r.s),r.t!=null&&Object.hasOwnProperty.call(r,"t")&&p.onnx.TensorProto.encode(r.t,i.uint32(42).fork()).ldelim(),r.g!=null&&Object.hasOwnProperty.call(r,"g")&&p.onnx.GraphProto.encode(r.g,i.uint32(50).fork()).ldelim(),r.floats!=null&&r.floats.length){i.uint32(58).fork();for(var a=0;a<r.floats.length;++a)i.float(r.floats[a]);i.ldelim()}if(r.ints!=null&&r.ints.length){i.uint32(66).fork();for(var a=0;a<r.ints.length;++a)i.int64(r.ints[a]);i.ldelim()}if(r.strings!=null&&r.strings.length)for(var a=0;a<r.strings.length;++a)i.uint32(74).bytes(r.strings[a]);if(r.tensors!=null&&r.tensors.length)for(var a=0;a<r.tensors.length;++a)p.onnx.TensorProto.encode(r.tensors[a],i.uint32(82).fork()).ldelim();if(r.graphs!=null&&r.graphs.length)for(var a=0;a<r.graphs.length;++a)p.onnx.GraphProto.encode(r.graphs[a],i.uint32(90).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(106).string(r.docString),r.tp!=null&&Object.hasOwnProperty.call(r,"tp")&&p.onnx.TypeProto.encode(r.tp,i.uint32(114).fork()).ldelim(),r.typeProtos!=null&&r.typeProtos.length)for(var a=0;a<r.typeProtos.length;++a)p.onnx.TypeProto.encode(r.typeProtos[a],i.uint32(122).fork()).ldelim();if(r.type!=null&&Object.hasOwnProperty.call(r,"type")&&i.uint32(160).int32(r.type),r.refAttrName!=null&&Object.hasOwnProperty.call(r,"refAttrName")&&i.uint32(170).string(r.refAttrName),r.sparseTensor!=null&&Object.hasOwnProperty.call(r,"sparseTensor")&&p.onnx.SparseTensorProto.encode(r.sparseTensor,i.uint32(178).fork()).ldelim(),r.sparseTensors!=null&&r.sparseTensors.length)for(var a=0;a<r.sparseTensors.length;++a)p.onnx.SparseTensorProto.encode(r.sparseTensors[a],i.uint32(186).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.AttributeProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 21:{c.refAttrName=r.string();break}case 13:{c.docString=r.string();break}case 20:{c.type=r.int32();break}case 2:{c.f=r.float();break}case 3:{c.i=r.int64();break}case 4:{c.s=r.bytes();break}case 5:{c.t=p.onnx.TensorProto.decode(r,r.uint32());break}case 6:{c.g=p.onnx.GraphProto.decode(r,r.uint32());break}case 22:{c.sparseTensor=p.onnx.SparseTensorProto.decode(r,r.uint32());break}case 14:{c.tp=p.onnx.TypeProto.decode(r,r.uint32());break}case 7:{if(c.floats&&c.floats.length||(c.floats=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.floats.push(r.float());else c.floats.push(r.float());break}case 8:{if(c.ints&&c.ints.length||(c.ints=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.ints.push(r.int64());else c.ints.push(r.int64());break}case 9:{c.strings&&c.strings.length||(c.strings=[]),c.strings.push(r.bytes());break}case 10:{c.tensors&&c.tensors.length||(c.tensors=[]),c.tensors.push(p.onnx.TensorProto.decode(r,r.uint32()));break}case 11:{c.graphs&&c.graphs.length||(c.graphs=[]),c.graphs.push(p.onnx.GraphProto.decode(r,r.uint32()));break}case 23:{c.sparseTensors&&c.sparseTensors.length||(c.sparseTensors=[]),c.sparseTensors.push(p.onnx.SparseTensorProto.decode(r,r.uint32()));break}case 15:{c.typeProtos&&c.typeProtos.length||(c.typeProtos=[]),c.typeProtos.push(p.onnx.TypeProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.refAttrName!=null&&r.hasOwnProperty("refAttrName")&&!l.isString(r.refAttrName))return"refAttrName: string expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString))return"docString: string expected";if(r.type!=null&&r.hasOwnProperty("type"))switch(r.type){default:return"type: enum value expected";case 0:case 1:case 2:case 3:case 4:case 5:case 11:case 13:case 6:case 7:case 8:case 9:case 10:case 12:case 14:break}if(r.f!=null&&r.hasOwnProperty("f")&&typeof r.f!="number")return"f: number expected";if(r.i!=null&&r.hasOwnProperty("i")&&!l.isInteger(r.i)&&!(r.i&&l.isInteger(r.i.low)&&l.isInteger(r.i.high)))return"i: integer|Long expected";if(r.s!=null&&r.hasOwnProperty("s")&&!(r.s&&typeof r.s.length=="number"||l.isString(r.s)))return"s: buffer expected";if(r.t!=null&&r.hasOwnProperty("t")){var i=p.onnx.TensorProto.verify(r.t);if(i)return"t."+i}if(r.g!=null&&r.hasOwnProperty("g")){var i=p.onnx.GraphProto.verify(r.g);if(i)return"g."+i}if(r.sparseTensor!=null&&r.hasOwnProperty("sparseTensor")){var i=p.onnx.SparseTensorProto.verify(r.sparseTensor);if(i)return"sparseTensor."+i}if(r.tp!=null&&r.hasOwnProperty("tp")){var i=p.onnx.TypeProto.verify(r.tp);if(i)return"tp."+i}if(r.floats!=null&&r.hasOwnProperty("floats")){if(!Array.isArray(r.floats))return"floats: array expected";for(var a=0;a<r.floats.length;++a)if(typeof r.floats[a]!="number")return"floats: number[] expected"}if(r.ints!=null&&r.hasOwnProperty("ints")){if(!Array.isArray(r.ints))return"ints: array expected";for(var a=0;a<r.ints.length;++a)if(!l.isInteger(r.ints[a])&&!(r.ints[a]&&l.isInteger(r.ints[a].low)&&l.isInteger(r.ints[a].high)))return"ints: integer|Long[] expected"}if(r.strings!=null&&r.hasOwnProperty("strings")){if(!Array.isArray(r.strings))return"strings: array expected";for(var a=0;a<r.strings.length;++a)if(!(r.strings[a]&&typeof r.strings[a].length=="number"||l.isString(r.strings[a])))return"strings: buffer[] expected"}if(r.tensors!=null&&r.hasOwnProperty("tensors")){if(!Array.isArray(r.tensors))return"tensors: array expected";for(var a=0;a<r.tensors.length;++a){var i=p.onnx.TensorProto.verify(r.tensors[a]);if(i)return"tensors."+i}}if(r.graphs!=null&&r.hasOwnProperty("graphs")){if(!Array.isArray(r.graphs))return"graphs: array expected";for(var a=0;a<r.graphs.length;++a){var i=p.onnx.GraphProto.verify(r.graphs[a]);if(i)return"graphs."+i}}if(r.sparseTensors!=null&&r.hasOwnProperty("sparseTensors")){if(!Array.isArray(r.sparseTensors))return"sparseTensors: array expected";for(var a=0;a<r.sparseTensors.length;++a){var i=p.onnx.SparseTensorProto.verify(r.sparseTensors[a]);if(i)return"sparseTensors."+i}}if(r.typeProtos!=null&&r.hasOwnProperty("typeProtos")){if(!Array.isArray(r.typeProtos))return"typeProtos: array expected";for(var a=0;a<r.typeProtos.length;++a){var i=p.onnx.TypeProto.verify(r.typeProtos[a]);if(i)return"typeProtos."+i}}return null},o.fromObject=function(r){if(r instanceof p.onnx.AttributeProto)return r;var i=new p.onnx.AttributeProto;switch(r.name!=null&&(i.name=String(r.name)),r.refAttrName!=null&&(i.refAttrName=String(r.refAttrName)),r.docString!=null&&(i.docString=String(r.docString)),r.type){default:if(typeof r.type=="number"){i.type=r.type;break}break;case"UNDEFINED":case 0:i.type=0;break;case"FLOAT":case 1:i.type=1;break;case"INT":case 2:i.type=2;break;case"STRING":case 3:i.type=3;break;case"TENSOR":case 4:i.type=4;break;case"GRAPH":case 5:i.type=5;break;case"SPARSE_TENSOR":case 11:i.type=11;break;case"TYPE_PROTO":case 13:i.type=13;break;case"FLOATS":case 6:i.type=6;break;case"INTS":case 7:i.type=7;break;case"STRINGS":case 8:i.type=8;break;case"TENSORS":case 9:i.type=9;break;case"GRAPHS":case 10:i.type=10;break;case"SPARSE_TENSORS":case 12:i.type=12;break;case"TYPE_PROTOS":case 14:i.type=14;break}if(r.f!=null&&(i.f=Number(r.f)),r.i!=null&&(l.Long?(i.i=l.Long.fromValue(r.i)).unsigned=!1:typeof r.i=="string"?i.i=parseInt(r.i,10):typeof r.i=="number"?i.i=r.i:typeof r.i=="object"&&(i.i=new l.LongBits(r.i.low>>>0,r.i.high>>>0).toNumber())),r.s!=null&&(typeof r.s=="string"?l.base64.decode(r.s,i.s=l.newBuffer(l.base64.length(r.s)),0):r.s.length>=0&&(i.s=r.s)),r.t!=null){if(typeof r.t!="object")throw TypeError(".onnx.AttributeProto.t: object expected");i.t=p.onnx.TensorProto.fromObject(r.t)}if(r.g!=null){if(typeof r.g!="object")throw TypeError(".onnx.AttributeProto.g: object expected");i.g=p.onnx.GraphProto.fromObject(r.g)}if(r.sparseTensor!=null){if(typeof r.sparseTensor!="object")throw TypeError(".onnx.AttributeProto.sparseTensor: object expected");i.sparseTensor=p.onnx.SparseTensorProto.fromObject(r.sparseTensor)}if(r.tp!=null){if(typeof r.tp!="object")throw TypeError(".onnx.AttributeProto.tp: object expected");i.tp=p.onnx.TypeProto.fromObject(r.tp)}if(r.floats){if(!Array.isArray(r.floats))throw TypeError(".onnx.AttributeProto.floats: array expected");i.floats=[];for(var a=0;a<r.floats.length;++a)i.floats[a]=Number(r.floats[a])}if(r.ints){if(!Array.isArray(r.ints))throw TypeError(".onnx.AttributeProto.ints: array expected");i.ints=[];for(var a=0;a<r.ints.length;++a)l.Long?(i.ints[a]=l.Long.fromValue(r.ints[a])).unsigned=!1:typeof r.ints[a]=="string"?i.ints[a]=parseInt(r.ints[a],10):typeof r.ints[a]=="number"?i.ints[a]=r.ints[a]:typeof r.ints[a]=="object"&&(i.ints[a]=new l.LongBits(r.ints[a].low>>>0,r.ints[a].high>>>0).toNumber())}if(r.strings){if(!Array.isArray(r.strings))throw TypeError(".onnx.AttributeProto.strings: array expected");i.strings=[];for(var a=0;a<r.strings.length;++a)typeof r.strings[a]=="string"?l.base64.decode(r.strings[a],i.strings[a]=l.newBuffer(l.base64.length(r.strings[a])),0):r.strings[a].length>=0&&(i.strings[a]=r.strings[a])}if(r.tensors){if(!Array.isArray(r.tensors))throw TypeError(".onnx.AttributeProto.tensors: array expected");i.tensors=[];for(var a=0;a<r.tensors.length;++a){if(typeof r.tensors[a]!="object")throw TypeError(".onnx.AttributeProto.tensors: object expected");i.tensors[a]=p.onnx.TensorProto.fromObject(r.tensors[a])}}if(r.graphs){if(!Array.isArray(r.graphs))throw TypeError(".onnx.AttributeProto.graphs: array expected");i.graphs=[];for(var a=0;a<r.graphs.length;++a){if(typeof r.graphs[a]!="object")throw TypeError(".onnx.AttributeProto.graphs: object expected");i.graphs[a]=p.onnx.GraphProto.fromObject(r.graphs[a])}}if(r.sparseTensors){if(!Array.isArray(r.sparseTensors))throw TypeError(".onnx.AttributeProto.sparseTensors: array expected");i.sparseTensors=[];for(var a=0;a<r.sparseTensors.length;++a){if(typeof r.sparseTensors[a]!="object")throw TypeError(".onnx.AttributeProto.sparseTensors: object expected");i.sparseTensors[a]=p.onnx.SparseTensorProto.fromObject(r.sparseTensors[a])}}if(r.typeProtos){if(!Array.isArray(r.typeProtos))throw TypeError(".onnx.AttributeProto.typeProtos: array expected");i.typeProtos=[];for(var a=0;a<r.typeProtos.length;++a){if(typeof r.typeProtos[a]!="object")throw TypeError(".onnx.AttributeProto.typeProtos: object expected");i.typeProtos[a]=p.onnx.TypeProto.fromObject(r.typeProtos[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.floats=[],a.ints=[],a.strings=[],a.tensors=[],a.graphs=[],a.typeProtos=[],a.sparseTensors=[]),i.defaults){if(a.name="",a.f=0,l.Long){var c=new l.Long(0,0,!1);a.i=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.i=i.longs===String?"0":0;i.bytes===String?a.s="":(a.s=[],i.bytes!==Array&&(a.s=l.newBuffer(a.s))),a.t=null,a.g=null,a.docString="",a.tp=null,a.type=i.enums===String?"UNDEFINED":0,a.refAttrName="",a.sparseTensor=null}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.f!=null&&r.hasOwnProperty("f")&&(a.f=i.json&&!isFinite(r.f)?String(r.f):r.f),r.i!=null&&r.hasOwnProperty("i")&&(typeof r.i=="number"?a.i=i.longs===String?String(r.i):r.i:a.i=i.longs===String?l.Long.prototype.toString.call(r.i):i.longs===Number?new l.LongBits(r.i.low>>>0,r.i.high>>>0).toNumber():r.i),r.s!=null&&r.hasOwnProperty("s")&&(a.s=i.bytes===String?l.base64.encode(r.s,0,r.s.length):i.bytes===Array?Array.prototype.slice.call(r.s):r.s),r.t!=null&&r.hasOwnProperty("t")&&(a.t=p.onnx.TensorProto.toObject(r.t,i)),r.g!=null&&r.hasOwnProperty("g")&&(a.g=p.onnx.GraphProto.toObject(r.g,i)),r.floats&&r.floats.length){a.floats=[];for(var h=0;h<r.floats.length;++h)a.floats[h]=i.json&&!isFinite(r.floats[h])?String(r.floats[h]):r.floats[h]}if(r.ints&&r.ints.length){a.ints=[];for(var h=0;h<r.ints.length;++h)typeof r.ints[h]=="number"?a.ints[h]=i.longs===String?String(r.ints[h]):r.ints[h]:a.ints[h]=i.longs===String?l.Long.prototype.toString.call(r.ints[h]):i.longs===Number?new l.LongBits(r.ints[h].low>>>0,r.ints[h].high>>>0).toNumber():r.ints[h]}if(r.strings&&r.strings.length){a.strings=[];for(var h=0;h<r.strings.length;++h)a.strings[h]=i.bytes===String?l.base64.encode(r.strings[h],0,r.strings[h].length):i.bytes===Array?Array.prototype.slice.call(r.strings[h]):r.strings[h]}if(r.tensors&&r.tensors.length){a.tensors=[];for(var h=0;h<r.tensors.length;++h)a.tensors[h]=p.onnx.TensorProto.toObject(r.tensors[h],i)}if(r.graphs&&r.graphs.length){a.graphs=[];for(var h=0;h<r.graphs.length;++h)a.graphs[h]=p.onnx.GraphProto.toObject(r.graphs[h],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.tp!=null&&r.hasOwnProperty("tp")&&(a.tp=p.onnx.TypeProto.toObject(r.tp,i)),r.typeProtos&&r.typeProtos.length){a.typeProtos=[];for(var h=0;h<r.typeProtos.length;++h)a.typeProtos[h]=p.onnx.TypeProto.toObject(r.typeProtos[h],i)}if(r.type!=null&&r.hasOwnProperty("type")&&(a.type=i.enums===String?p.onnx.AttributeProto.AttributeType[r.type]===void 0?r.type:p.onnx.AttributeProto.AttributeType[r.type]:r.type),r.refAttrName!=null&&r.hasOwnProperty("refAttrName")&&(a.refAttrName=r.refAttrName),r.sparseTensor!=null&&r.hasOwnProperty("sparseTensor")&&(a.sparseTensor=p.onnx.SparseTensorProto.toObject(r.sparseTensor,i)),r.sparseTensors&&r.sparseTensors.length){a.sparseTensors=[];for(var h=0;h<r.sparseTensors.length;++h)a.sparseTensors[h]=p.onnx.SparseTensorProto.toObject(r.sparseTensors[h],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.AttributeProto"},o.AttributeType=(function(){var r={},i=Object.create(r);return i[r[0]="UNDEFINED"]=0,i[r[1]="FLOAT"]=1,i[r[2]="INT"]=2,i[r[3]="STRING"]=3,i[r[4]="TENSOR"]=4,i[r[5]="GRAPH"]=5,i[r[11]="SPARSE_TENSOR"]=11,i[r[13]="TYPE_PROTO"]=13,i[r[6]="FLOATS"]=6,i[r[7]="INTS"]=7,i[r[8]="STRINGS"]=8,i[r[9]="TENSORS"]=9,i[r[10]="GRAPHS"]=10,i[r[12]="SPARSE_TENSORS"]=12,i[r[14]="TYPE_PROTOS"]=14,i})(),o})(),d.ValueInfoProto=(function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.type=null,o.prototype.docString="",o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.type!=null&&Object.hasOwnProperty.call(r,"type")&&p.onnx.TypeProto.encode(r.type,i.uint32(18).fork()).ldelim(),r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(26).string(r.docString),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.ValueInfoProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 2:{c.type=p.onnx.TypeProto.decode(r,r.uint32());break}case 3:{c.docString=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.type!=null&&r.hasOwnProperty("type")){var i=p.onnx.TypeProto.verify(r.type);if(i)return"type."+i}return r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString)?"docString: string expected":null},o.fromObject=function(r){if(r instanceof p.onnx.ValueInfoProto)return r;var i=new p.onnx.ValueInfoProto;if(r.name!=null&&(i.name=String(r.name)),r.type!=null){if(typeof r.type!="object")throw TypeError(".onnx.ValueInfoProto.type: object expected");i.type=p.onnx.TypeProto.fromObject(r.type)}return r.docString!=null&&(i.docString=String(r.docString)),i},o.toObject=function(r,i){i||(i={});var a={};return i.defaults&&(a.name="",a.type=null,a.docString=""),r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.type!=null&&r.hasOwnProperty("type")&&(a.type=p.onnx.TypeProto.toObject(r.type,i)),r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.ValueInfoProto"},o})(),d.NodeProto=(function(){function o(r){if(this.input=[],this.output=[],this.attribute=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.input=l.emptyArray,o.prototype.output=l.emptyArray,o.prototype.name="",o.prototype.opType="",o.prototype.domain="",o.prototype.attribute=l.emptyArray,o.prototype.docString="",o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)i.uint32(10).string(r.input[a]);if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)i.uint32(18).string(r.output[a]);if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(26).string(r.name),r.opType!=null&&Object.hasOwnProperty.call(r,"opType")&&i.uint32(34).string(r.opType),r.attribute!=null&&r.attribute.length)for(var a=0;a<r.attribute.length;++a)p.onnx.AttributeProto.encode(r.attribute[a],i.uint32(42).fork()).ldelim();return r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(50).string(r.docString),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(58).string(r.domain),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.NodeProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.input&&c.input.length||(c.input=[]),c.input.push(r.string());break}case 2:{c.output&&c.output.length||(c.output=[]),c.output.push(r.string());break}case 3:{c.name=r.string();break}case 4:{c.opType=r.string();break}case 7:{c.domain=r.string();break}case 5:{c.attribute&&c.attribute.length||(c.attribute=[]),c.attribute.push(p.onnx.AttributeProto.decode(r,r.uint32()));break}case 6:{c.docString=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i)if(!l.isString(r.input[i]))return"input: string[] expected"}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i)if(!l.isString(r.output[i]))return"output: string[] expected"}if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.opType!=null&&r.hasOwnProperty("opType")&&!l.isString(r.opType))return"opType: string expected";if(r.domain!=null&&r.hasOwnProperty("domain")&&!l.isString(r.domain))return"domain: string expected";if(r.attribute!=null&&r.hasOwnProperty("attribute")){if(!Array.isArray(r.attribute))return"attribute: array expected";for(var i=0;i<r.attribute.length;++i){var a=p.onnx.AttributeProto.verify(r.attribute[i]);if(a)return"attribute."+a}}return r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString)?"docString: string expected":null},o.fromObject=function(r){if(r instanceof p.onnx.NodeProto)return r;var i=new p.onnx.NodeProto;if(r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.NodeProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a)i.input[a]=String(r.input[a])}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.NodeProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a)i.output[a]=String(r.output[a])}if(r.name!=null&&(i.name=String(r.name)),r.opType!=null&&(i.opType=String(r.opType)),r.domain!=null&&(i.domain=String(r.domain)),r.attribute){if(!Array.isArray(r.attribute))throw TypeError(".onnx.NodeProto.attribute: array expected");i.attribute=[];for(var a=0;a<r.attribute.length;++a){if(typeof r.attribute[a]!="object")throw TypeError(".onnx.NodeProto.attribute: object expected");i.attribute[a]=p.onnx.AttributeProto.fromObject(r.attribute[a])}}return r.docString!=null&&(i.docString=String(r.docString)),i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.input=[],a.output=[],a.attribute=[]),i.defaults&&(a.name="",a.opType="",a.docString="",a.domain=""),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=r.input[c]}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=r.output[c]}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.opType!=null&&r.hasOwnProperty("opType")&&(a.opType=r.opType),r.attribute&&r.attribute.length){a.attribute=[];for(var c=0;c<r.attribute.length;++c)a.attribute[c]=p.onnx.AttributeProto.toObject(r.attribute[c],i)}return r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.NodeProto"},o})(),d.TrainingInfoProto=(function(){function o(r){if(this.initializationBinding=[],this.updateBinding=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.initialization=null,o.prototype.algorithm=null,o.prototype.initializationBinding=l.emptyArray,o.prototype.updateBinding=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.initialization!=null&&Object.hasOwnProperty.call(r,"initialization")&&p.onnx.GraphProto.encode(r.initialization,i.uint32(10).fork()).ldelim(),r.algorithm!=null&&Object.hasOwnProperty.call(r,"algorithm")&&p.onnx.GraphProto.encode(r.algorithm,i.uint32(18).fork()).ldelim(),r.initializationBinding!=null&&r.initializationBinding.length)for(var a=0;a<r.initializationBinding.length;++a)p.onnx.StringStringEntryProto.encode(r.initializationBinding[a],i.uint32(26).fork()).ldelim();if(r.updateBinding!=null&&r.updateBinding.length)for(var a=0;a<r.updateBinding.length;++a)p.onnx.StringStringEntryProto.encode(r.updateBinding[a],i.uint32(34).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.TrainingInfoProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.initialization=p.onnx.GraphProto.decode(r,r.uint32());break}case 2:{c.algorithm=p.onnx.GraphProto.decode(r,r.uint32());break}case 3:{c.initializationBinding&&c.initializationBinding.length||(c.initializationBinding=[]),c.initializationBinding.push(p.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 4:{c.updateBinding&&c.updateBinding.length||(c.updateBinding=[]),c.updateBinding.push(p.onnx.StringStringEntryProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.initialization!=null&&r.hasOwnProperty("initialization")){var i=p.onnx.GraphProto.verify(r.initialization);if(i)return"initialization."+i}if(r.algorithm!=null&&r.hasOwnProperty("algorithm")){var i=p.onnx.GraphProto.verify(r.algorithm);if(i)return"algorithm."+i}if(r.initializationBinding!=null&&r.hasOwnProperty("initializationBinding")){if(!Array.isArray(r.initializationBinding))return"initializationBinding: array expected";for(var a=0;a<r.initializationBinding.length;++a){var i=p.onnx.StringStringEntryProto.verify(r.initializationBinding[a]);if(i)return"initializationBinding."+i}}if(r.updateBinding!=null&&r.hasOwnProperty("updateBinding")){if(!Array.isArray(r.updateBinding))return"updateBinding: array expected";for(var a=0;a<r.updateBinding.length;++a){var i=p.onnx.StringStringEntryProto.verify(r.updateBinding[a]);if(i)return"updateBinding."+i}}return null},o.fromObject=function(r){if(r instanceof p.onnx.TrainingInfoProto)return r;var i=new p.onnx.TrainingInfoProto;if(r.initialization!=null){if(typeof r.initialization!="object")throw TypeError(".onnx.TrainingInfoProto.initialization: object expected");i.initialization=p.onnx.GraphProto.fromObject(r.initialization)}if(r.algorithm!=null){if(typeof r.algorithm!="object")throw TypeError(".onnx.TrainingInfoProto.algorithm: object expected");i.algorithm=p.onnx.GraphProto.fromObject(r.algorithm)}if(r.initializationBinding){if(!Array.isArray(r.initializationBinding))throw TypeError(".onnx.TrainingInfoProto.initializationBinding: array expected");i.initializationBinding=[];for(var a=0;a<r.initializationBinding.length;++a){if(typeof r.initializationBinding[a]!="object")throw TypeError(".onnx.TrainingInfoProto.initializationBinding: object expected");i.initializationBinding[a]=p.onnx.StringStringEntryProto.fromObject(r.initializationBinding[a])}}if(r.updateBinding){if(!Array.isArray(r.updateBinding))throw TypeError(".onnx.TrainingInfoProto.updateBinding: array expected");i.updateBinding=[];for(var a=0;a<r.updateBinding.length;++a){if(typeof r.updateBinding[a]!="object")throw TypeError(".onnx.TrainingInfoProto.updateBinding: object expected");i.updateBinding[a]=p.onnx.StringStringEntryProto.fromObject(r.updateBinding[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.initializationBinding=[],a.updateBinding=[]),i.defaults&&(a.initialization=null,a.algorithm=null),r.initialization!=null&&r.hasOwnProperty("initialization")&&(a.initialization=p.onnx.GraphProto.toObject(r.initialization,i)),r.algorithm!=null&&r.hasOwnProperty("algorithm")&&(a.algorithm=p.onnx.GraphProto.toObject(r.algorithm,i)),r.initializationBinding&&r.initializationBinding.length){a.initializationBinding=[];for(var c=0;c<r.initializationBinding.length;++c)a.initializationBinding[c]=p.onnx.StringStringEntryProto.toObject(r.initializationBinding[c],i)}if(r.updateBinding&&r.updateBinding.length){a.updateBinding=[];for(var c=0;c<r.updateBinding.length;++c)a.updateBinding[c]=p.onnx.StringStringEntryProto.toObject(r.updateBinding[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TrainingInfoProto"},o})(),d.ModelProto=(function(){function o(r){if(this.opsetImport=[],this.metadataProps=[],this.trainingInfo=[],this.functions=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.irVersion=l.Long?l.Long.fromBits(0,0,!1):0,o.prototype.opsetImport=l.emptyArray,o.prototype.producerName="",o.prototype.producerVersion="",o.prototype.domain="",o.prototype.modelVersion=l.Long?l.Long.fromBits(0,0,!1):0,o.prototype.docString="",o.prototype.graph=null,o.prototype.metadataProps=l.emptyArray,o.prototype.trainingInfo=l.emptyArray,o.prototype.functions=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.irVersion!=null&&Object.hasOwnProperty.call(r,"irVersion")&&i.uint32(8).int64(r.irVersion),r.producerName!=null&&Object.hasOwnProperty.call(r,"producerName")&&i.uint32(18).string(r.producerName),r.producerVersion!=null&&Object.hasOwnProperty.call(r,"producerVersion")&&i.uint32(26).string(r.producerVersion),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(34).string(r.domain),r.modelVersion!=null&&Object.hasOwnProperty.call(r,"modelVersion")&&i.uint32(40).int64(r.modelVersion),r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(50).string(r.docString),r.graph!=null&&Object.hasOwnProperty.call(r,"graph")&&p.onnx.GraphProto.encode(r.graph,i.uint32(58).fork()).ldelim(),r.opsetImport!=null&&r.opsetImport.length)for(var a=0;a<r.opsetImport.length;++a)p.onnx.OperatorSetIdProto.encode(r.opsetImport[a],i.uint32(66).fork()).ldelim();if(r.metadataProps!=null&&r.metadataProps.length)for(var a=0;a<r.metadataProps.length;++a)p.onnx.StringStringEntryProto.encode(r.metadataProps[a],i.uint32(114).fork()).ldelim();if(r.trainingInfo!=null&&r.trainingInfo.length)for(var a=0;a<r.trainingInfo.length;++a)p.onnx.TrainingInfoProto.encode(r.trainingInfo[a],i.uint32(162).fork()).ldelim();if(r.functions!=null&&r.functions.length)for(var a=0;a<r.functions.length;++a)p.onnx.FunctionProto.encode(r.functions[a],i.uint32(202).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.ModelProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.irVersion=r.int64();break}case 8:{c.opsetImport&&c.opsetImport.length||(c.opsetImport=[]),c.opsetImport.push(p.onnx.OperatorSetIdProto.decode(r,r.uint32()));break}case 2:{c.producerName=r.string();break}case 3:{c.producerVersion=r.string();break}case 4:{c.domain=r.string();break}case 5:{c.modelVersion=r.int64();break}case 6:{c.docString=r.string();break}case 7:{c.graph=p.onnx.GraphProto.decode(r,r.uint32());break}case 14:{c.metadataProps&&c.metadataProps.length||(c.metadataProps=[]),c.metadataProps.push(p.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 20:{c.trainingInfo&&c.trainingInfo.length||(c.trainingInfo=[]),c.trainingInfo.push(p.onnx.TrainingInfoProto.decode(r,r.uint32()));break}case 25:{c.functions&&c.functions.length||(c.functions=[]),c.functions.push(p.onnx.FunctionProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.irVersion!=null&&r.hasOwnProperty("irVersion")&&!l.isInteger(r.irVersion)&&!(r.irVersion&&l.isInteger(r.irVersion.low)&&l.isInteger(r.irVersion.high)))return"irVersion: integer|Long expected";if(r.opsetImport!=null&&r.hasOwnProperty("opsetImport")){if(!Array.isArray(r.opsetImport))return"opsetImport: array expected";for(var i=0;i<r.opsetImport.length;++i){var a=p.onnx.OperatorSetIdProto.verify(r.opsetImport[i]);if(a)return"opsetImport."+a}}if(r.producerName!=null&&r.hasOwnProperty("producerName")&&!l.isString(r.producerName))return"producerName: string expected";if(r.producerVersion!=null&&r.hasOwnProperty("producerVersion")&&!l.isString(r.producerVersion))return"producerVersion: string expected";if(r.domain!=null&&r.hasOwnProperty("domain")&&!l.isString(r.domain))return"domain: string expected";if(r.modelVersion!=null&&r.hasOwnProperty("modelVersion")&&!l.isInteger(r.modelVersion)&&!(r.modelVersion&&l.isInteger(r.modelVersion.low)&&l.isInteger(r.modelVersion.high)))return"modelVersion: integer|Long expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString))return"docString: string expected";if(r.graph!=null&&r.hasOwnProperty("graph")){var a=p.onnx.GraphProto.verify(r.graph);if(a)return"graph."+a}if(r.metadataProps!=null&&r.hasOwnProperty("metadataProps")){if(!Array.isArray(r.metadataProps))return"metadataProps: array expected";for(var i=0;i<r.metadataProps.length;++i){var a=p.onnx.StringStringEntryProto.verify(r.metadataProps[i]);if(a)return"metadataProps."+a}}if(r.trainingInfo!=null&&r.hasOwnProperty("trainingInfo")){if(!Array.isArray(r.trainingInfo))return"trainingInfo: array expected";for(var i=0;i<r.trainingInfo.length;++i){var a=p.onnx.TrainingInfoProto.verify(r.trainingInfo[i]);if(a)return"trainingInfo."+a}}if(r.functions!=null&&r.hasOwnProperty("functions")){if(!Array.isArray(r.functions))return"functions: array expected";for(var i=0;i<r.functions.length;++i){var a=p.onnx.FunctionProto.verify(r.functions[i]);if(a)return"functions."+a}}return null},o.fromObject=function(r){if(r instanceof p.onnx.ModelProto)return r;var i=new p.onnx.ModelProto;if(r.irVersion!=null&&(l.Long?(i.irVersion=l.Long.fromValue(r.irVersion)).unsigned=!1:typeof r.irVersion=="string"?i.irVersion=parseInt(r.irVersion,10):typeof r.irVersion=="number"?i.irVersion=r.irVersion:typeof r.irVersion=="object"&&(i.irVersion=new l.LongBits(r.irVersion.low>>>0,r.irVersion.high>>>0).toNumber())),r.opsetImport){if(!Array.isArray(r.opsetImport))throw TypeError(".onnx.ModelProto.opsetImport: array expected");i.opsetImport=[];for(var a=0;a<r.opsetImport.length;++a){if(typeof r.opsetImport[a]!="object")throw TypeError(".onnx.ModelProto.opsetImport: object expected");i.opsetImport[a]=p.onnx.OperatorSetIdProto.fromObject(r.opsetImport[a])}}if(r.producerName!=null&&(i.producerName=String(r.producerName)),r.producerVersion!=null&&(i.producerVersion=String(r.producerVersion)),r.domain!=null&&(i.domain=String(r.domain)),r.modelVersion!=null&&(l.Long?(i.modelVersion=l.Long.fromValue(r.modelVersion)).unsigned=!1:typeof r.modelVersion=="string"?i.modelVersion=parseInt(r.modelVersion,10):typeof r.modelVersion=="number"?i.modelVersion=r.modelVersion:typeof r.modelVersion=="object"&&(i.modelVersion=new l.LongBits(r.modelVersion.low>>>0,r.modelVersion.high>>>0).toNumber())),r.docString!=null&&(i.docString=String(r.docString)),r.graph!=null){if(typeof r.graph!="object")throw TypeError(".onnx.ModelProto.graph: object expected");i.graph=p.onnx.GraphProto.fromObject(r.graph)}if(r.metadataProps){if(!Array.isArray(r.metadataProps))throw TypeError(".onnx.ModelProto.metadataProps: array expected");i.metadataProps=[];for(var a=0;a<r.metadataProps.length;++a){if(typeof r.metadataProps[a]!="object")throw TypeError(".onnx.ModelProto.metadataProps: object expected");i.metadataProps[a]=p.onnx.StringStringEntryProto.fromObject(r.metadataProps[a])}}if(r.trainingInfo){if(!Array.isArray(r.trainingInfo))throw TypeError(".onnx.ModelProto.trainingInfo: array expected");i.trainingInfo=[];for(var a=0;a<r.trainingInfo.length;++a){if(typeof r.trainingInfo[a]!="object")throw TypeError(".onnx.ModelProto.trainingInfo: object expected");i.trainingInfo[a]=p.onnx.TrainingInfoProto.fromObject(r.trainingInfo[a])}}if(r.functions){if(!Array.isArray(r.functions))throw TypeError(".onnx.ModelProto.functions: array expected");i.functions=[];for(var a=0;a<r.functions.length;++a){if(typeof r.functions[a]!="object")throw TypeError(".onnx.ModelProto.functions: object expected");i.functions[a]=p.onnx.FunctionProto.fromObject(r.functions[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.opsetImport=[],a.metadataProps=[],a.trainingInfo=[],a.functions=[]),i.defaults){if(l.Long){var c=new l.Long(0,0,!1);a.irVersion=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.irVersion=i.longs===String?"0":0;if(a.producerName="",a.producerVersion="",a.domain="",l.Long){var c=new l.Long(0,0,!1);a.modelVersion=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.modelVersion=i.longs===String?"0":0;a.docString="",a.graph=null}if(r.irVersion!=null&&r.hasOwnProperty("irVersion")&&(typeof r.irVersion=="number"?a.irVersion=i.longs===String?String(r.irVersion):r.irVersion:a.irVersion=i.longs===String?l.Long.prototype.toString.call(r.irVersion):i.longs===Number?new l.LongBits(r.irVersion.low>>>0,r.irVersion.high>>>0).toNumber():r.irVersion),r.producerName!=null&&r.hasOwnProperty("producerName")&&(a.producerName=r.producerName),r.producerVersion!=null&&r.hasOwnProperty("producerVersion")&&(a.producerVersion=r.producerVersion),r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.modelVersion!=null&&r.hasOwnProperty("modelVersion")&&(typeof r.modelVersion=="number"?a.modelVersion=i.longs===String?String(r.modelVersion):r.modelVersion:a.modelVersion=i.longs===String?l.Long.prototype.toString.call(r.modelVersion):i.longs===Number?new l.LongBits(r.modelVersion.low>>>0,r.modelVersion.high>>>0).toNumber():r.modelVersion),r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.graph!=null&&r.hasOwnProperty("graph")&&(a.graph=p.onnx.GraphProto.toObject(r.graph,i)),r.opsetImport&&r.opsetImport.length){a.opsetImport=[];for(var h=0;h<r.opsetImport.length;++h)a.opsetImport[h]=p.onnx.OperatorSetIdProto.toObject(r.opsetImport[h],i)}if(r.metadataProps&&r.metadataProps.length){a.metadataProps=[];for(var h=0;h<r.metadataProps.length;++h)a.metadataProps[h]=p.onnx.StringStringEntryProto.toObject(r.metadataProps[h],i)}if(r.trainingInfo&&r.trainingInfo.length){a.trainingInfo=[];for(var h=0;h<r.trainingInfo.length;++h)a.trainingInfo[h]=p.onnx.TrainingInfoProto.toObject(r.trainingInfo[h],i)}if(r.functions&&r.functions.length){a.functions=[];for(var h=0;h<r.functions.length;++h)a.functions[h]=p.onnx.FunctionProto.toObject(r.functions[h],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.ModelProto"},o})(),d.StringStringEntryProto=(function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.key="",o.prototype.value="",o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.key!=null&&Object.hasOwnProperty.call(r,"key")&&i.uint32(10).string(r.key),r.value!=null&&Object.hasOwnProperty.call(r,"value")&&i.uint32(18).string(r.value),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.StringStringEntryProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.key=r.string();break}case 2:{c.value=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){return typeof r!="object"||r===null?"object expected":r.key!=null&&r.hasOwnProperty("key")&&!l.isString(r.key)?"key: string expected":r.value!=null&&r.hasOwnProperty("value")&&!l.isString(r.value)?"value: string expected":null},o.fromObject=function(r){if(r instanceof p.onnx.StringStringEntryProto)return r;var i=new p.onnx.StringStringEntryProto;return r.key!=null&&(i.key=String(r.key)),r.value!=null&&(i.value=String(r.value)),i},o.toObject=function(r,i){i||(i={});var a={};return i.defaults&&(a.key="",a.value=""),r.key!=null&&r.hasOwnProperty("key")&&(a.key=r.key),r.value!=null&&r.hasOwnProperty("value")&&(a.value=r.value),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.StringStringEntryProto"},o})(),d.TensorAnnotation=(function(){function o(r){if(this.quantParameterTensorNames=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.tensorName="",o.prototype.quantParameterTensorNames=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.tensorName!=null&&Object.hasOwnProperty.call(r,"tensorName")&&i.uint32(10).string(r.tensorName),r.quantParameterTensorNames!=null&&r.quantParameterTensorNames.length)for(var a=0;a<r.quantParameterTensorNames.length;++a)p.onnx.StringStringEntryProto.encode(r.quantParameterTensorNames[a],i.uint32(18).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.TensorAnnotation;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.tensorName=r.string();break}case 2:{c.quantParameterTensorNames&&c.quantParameterTensorNames.length||(c.quantParameterTensorNames=[]),c.quantParameterTensorNames.push(p.onnx.StringStringEntryProto.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.tensorName!=null&&r.hasOwnProperty("tensorName")&&!l.isString(r.tensorName))return"tensorName: string expected";if(r.quantParameterTensorNames!=null&&r.hasOwnProperty("quantParameterTensorNames")){if(!Array.isArray(r.quantParameterTensorNames))return"quantParameterTensorNames: array expected";for(var i=0;i<r.quantParameterTensorNames.length;++i){var a=p.onnx.StringStringEntryProto.verify(r.quantParameterTensorNames[i]);if(a)return"quantParameterTensorNames."+a}}return null},o.fromObject=function(r){if(r instanceof p.onnx.TensorAnnotation)return r;var i=new p.onnx.TensorAnnotation;if(r.tensorName!=null&&(i.tensorName=String(r.tensorName)),r.quantParameterTensorNames){if(!Array.isArray(r.quantParameterTensorNames))throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: array expected");i.quantParameterTensorNames=[];for(var a=0;a<r.quantParameterTensorNames.length;++a){if(typeof r.quantParameterTensorNames[a]!="object")throw TypeError(".onnx.TensorAnnotation.quantParameterTensorNames: object expected");i.quantParameterTensorNames[a]=p.onnx.StringStringEntryProto.fromObject(r.quantParameterTensorNames[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.quantParameterTensorNames=[]),i.defaults&&(a.tensorName=""),r.tensorName!=null&&r.hasOwnProperty("tensorName")&&(a.tensorName=r.tensorName),r.quantParameterTensorNames&&r.quantParameterTensorNames.length){a.quantParameterTensorNames=[];for(var c=0;c<r.quantParameterTensorNames.length;++c)a.quantParameterTensorNames[c]=p.onnx.StringStringEntryProto.toObject(r.quantParameterTensorNames[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorAnnotation"},o})(),d.GraphProto=(function(){function o(r){if(this.node=[],this.initializer=[],this.sparseInitializer=[],this.input=[],this.output=[],this.valueInfo=[],this.quantizationAnnotation=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.node=l.emptyArray,o.prototype.name="",o.prototype.initializer=l.emptyArray,o.prototype.sparseInitializer=l.emptyArray,o.prototype.docString="",o.prototype.input=l.emptyArray,o.prototype.output=l.emptyArray,o.prototype.valueInfo=l.emptyArray,o.prototype.quantizationAnnotation=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.node!=null&&r.node.length)for(var a=0;a<r.node.length;++a)p.onnx.NodeProto.encode(r.node[a],i.uint32(10).fork()).ldelim();if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(18).string(r.name),r.initializer!=null&&r.initializer.length)for(var a=0;a<r.initializer.length;++a)p.onnx.TensorProto.encode(r.initializer[a],i.uint32(42).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(82).string(r.docString),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)p.onnx.ValueInfoProto.encode(r.input[a],i.uint32(90).fork()).ldelim();if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)p.onnx.ValueInfoProto.encode(r.output[a],i.uint32(98).fork()).ldelim();if(r.valueInfo!=null&&r.valueInfo.length)for(var a=0;a<r.valueInfo.length;++a)p.onnx.ValueInfoProto.encode(r.valueInfo[a],i.uint32(106).fork()).ldelim();if(r.quantizationAnnotation!=null&&r.quantizationAnnotation.length)for(var a=0;a<r.quantizationAnnotation.length;++a)p.onnx.TensorAnnotation.encode(r.quantizationAnnotation[a],i.uint32(114).fork()).ldelim();if(r.sparseInitializer!=null&&r.sparseInitializer.length)for(var a=0;a<r.sparseInitializer.length;++a)p.onnx.SparseTensorProto.encode(r.sparseInitializer[a],i.uint32(122).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.GraphProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.node&&c.node.length||(c.node=[]),c.node.push(p.onnx.NodeProto.decode(r,r.uint32()));break}case 2:{c.name=r.string();break}case 5:{c.initializer&&c.initializer.length||(c.initializer=[]),c.initializer.push(p.onnx.TensorProto.decode(r,r.uint32()));break}case 15:{c.sparseInitializer&&c.sparseInitializer.length||(c.sparseInitializer=[]),c.sparseInitializer.push(p.onnx.SparseTensorProto.decode(r,r.uint32()));break}case 10:{c.docString=r.string();break}case 11:{c.input&&c.input.length||(c.input=[]),c.input.push(p.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 12:{c.output&&c.output.length||(c.output=[]),c.output.push(p.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 13:{c.valueInfo&&c.valueInfo.length||(c.valueInfo=[]),c.valueInfo.push(p.onnx.ValueInfoProto.decode(r,r.uint32()));break}case 14:{c.quantizationAnnotation&&c.quantizationAnnotation.length||(c.quantizationAnnotation=[]),c.quantizationAnnotation.push(p.onnx.TensorAnnotation.decode(r,r.uint32()));break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.node!=null&&r.hasOwnProperty("node")){if(!Array.isArray(r.node))return"node: array expected";for(var i=0;i<r.node.length;++i){var a=p.onnx.NodeProto.verify(r.node[i]);if(a)return"node."+a}}if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.initializer!=null&&r.hasOwnProperty("initializer")){if(!Array.isArray(r.initializer))return"initializer: array expected";for(var i=0;i<r.initializer.length;++i){var a=p.onnx.TensorProto.verify(r.initializer[i]);if(a)return"initializer."+a}}if(r.sparseInitializer!=null&&r.hasOwnProperty("sparseInitializer")){if(!Array.isArray(r.sparseInitializer))return"sparseInitializer: array expected";for(var i=0;i<r.sparseInitializer.length;++i){var a=p.onnx.SparseTensorProto.verify(r.sparseInitializer[i]);if(a)return"sparseInitializer."+a}}if(r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString))return"docString: string expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i){var a=p.onnx.ValueInfoProto.verify(r.input[i]);if(a)return"input."+a}}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i){var a=p.onnx.ValueInfoProto.verify(r.output[i]);if(a)return"output."+a}}if(r.valueInfo!=null&&r.hasOwnProperty("valueInfo")){if(!Array.isArray(r.valueInfo))return"valueInfo: array expected";for(var i=0;i<r.valueInfo.length;++i){var a=p.onnx.ValueInfoProto.verify(r.valueInfo[i]);if(a)return"valueInfo."+a}}if(r.quantizationAnnotation!=null&&r.hasOwnProperty("quantizationAnnotation")){if(!Array.isArray(r.quantizationAnnotation))return"quantizationAnnotation: array expected";for(var i=0;i<r.quantizationAnnotation.length;++i){var a=p.onnx.TensorAnnotation.verify(r.quantizationAnnotation[i]);if(a)return"quantizationAnnotation."+a}}return null},o.fromObject=function(r){if(r instanceof p.onnx.GraphProto)return r;var i=new p.onnx.GraphProto;if(r.node){if(!Array.isArray(r.node))throw TypeError(".onnx.GraphProto.node: array expected");i.node=[];for(var a=0;a<r.node.length;++a){if(typeof r.node[a]!="object")throw TypeError(".onnx.GraphProto.node: object expected");i.node[a]=p.onnx.NodeProto.fromObject(r.node[a])}}if(r.name!=null&&(i.name=String(r.name)),r.initializer){if(!Array.isArray(r.initializer))throw TypeError(".onnx.GraphProto.initializer: array expected");i.initializer=[];for(var a=0;a<r.initializer.length;++a){if(typeof r.initializer[a]!="object")throw TypeError(".onnx.GraphProto.initializer: object expected");i.initializer[a]=p.onnx.TensorProto.fromObject(r.initializer[a])}}if(r.sparseInitializer){if(!Array.isArray(r.sparseInitializer))throw TypeError(".onnx.GraphProto.sparseInitializer: array expected");i.sparseInitializer=[];for(var a=0;a<r.sparseInitializer.length;++a){if(typeof r.sparseInitializer[a]!="object")throw TypeError(".onnx.GraphProto.sparseInitializer: object expected");i.sparseInitializer[a]=p.onnx.SparseTensorProto.fromObject(r.sparseInitializer[a])}}if(r.docString!=null&&(i.docString=String(r.docString)),r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.GraphProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a){if(typeof r.input[a]!="object")throw TypeError(".onnx.GraphProto.input: object expected");i.input[a]=p.onnx.ValueInfoProto.fromObject(r.input[a])}}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.GraphProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a){if(typeof r.output[a]!="object")throw TypeError(".onnx.GraphProto.output: object expected");i.output[a]=p.onnx.ValueInfoProto.fromObject(r.output[a])}}if(r.valueInfo){if(!Array.isArray(r.valueInfo))throw TypeError(".onnx.GraphProto.valueInfo: array expected");i.valueInfo=[];for(var a=0;a<r.valueInfo.length;++a){if(typeof r.valueInfo[a]!="object")throw TypeError(".onnx.GraphProto.valueInfo: object expected");i.valueInfo[a]=p.onnx.ValueInfoProto.fromObject(r.valueInfo[a])}}if(r.quantizationAnnotation){if(!Array.isArray(r.quantizationAnnotation))throw TypeError(".onnx.GraphProto.quantizationAnnotation: array expected");i.quantizationAnnotation=[];for(var a=0;a<r.quantizationAnnotation.length;++a){if(typeof r.quantizationAnnotation[a]!="object")throw TypeError(".onnx.GraphProto.quantizationAnnotation: object expected");i.quantizationAnnotation[a]=p.onnx.TensorAnnotation.fromObject(r.quantizationAnnotation[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.node=[],a.initializer=[],a.input=[],a.output=[],a.valueInfo=[],a.quantizationAnnotation=[],a.sparseInitializer=[]),i.defaults&&(a.name="",a.docString=""),r.node&&r.node.length){a.node=[];for(var c=0;c<r.node.length;++c)a.node[c]=p.onnx.NodeProto.toObject(r.node[c],i)}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.initializer&&r.initializer.length){a.initializer=[];for(var c=0;c<r.initializer.length;++c)a.initializer[c]=p.onnx.TensorProto.toObject(r.initializer[c],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=p.onnx.ValueInfoProto.toObject(r.input[c],i)}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=p.onnx.ValueInfoProto.toObject(r.output[c],i)}if(r.valueInfo&&r.valueInfo.length){a.valueInfo=[];for(var c=0;c<r.valueInfo.length;++c)a.valueInfo[c]=p.onnx.ValueInfoProto.toObject(r.valueInfo[c],i)}if(r.quantizationAnnotation&&r.quantizationAnnotation.length){a.quantizationAnnotation=[];for(var c=0;c<r.quantizationAnnotation.length;++c)a.quantizationAnnotation[c]=p.onnx.TensorAnnotation.toObject(r.quantizationAnnotation[c],i)}if(r.sparseInitializer&&r.sparseInitializer.length){a.sparseInitializer=[];for(var c=0;c<r.sparseInitializer.length;++c)a.sparseInitializer[c]=p.onnx.SparseTensorProto.toObject(r.sparseInitializer[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.GraphProto"},o})(),d.TensorProto=(function(){function o(r){if(this.dims=[],this.floatData=[],this.int32Data=[],this.stringData=[],this.int64Data=[],this.externalData=[],this.doubleData=[],this.uint64Data=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.dims=l.emptyArray,o.prototype.dataType=0,o.prototype.segment=null,o.prototype.floatData=l.emptyArray,o.prototype.int32Data=l.emptyArray,o.prototype.stringData=l.emptyArray,o.prototype.int64Data=l.emptyArray,o.prototype.name="",o.prototype.docString="",o.prototype.rawData=l.newBuffer([]),o.prototype.externalData=l.emptyArray,o.prototype.dataLocation=0,o.prototype.doubleData=l.emptyArray,o.prototype.uint64Data=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.dims!=null&&r.dims.length){i.uint32(10).fork();for(var a=0;a<r.dims.length;++a)i.int64(r.dims[a]);i.ldelim()}if(r.dataType!=null&&Object.hasOwnProperty.call(r,"dataType")&&i.uint32(16).int32(r.dataType),r.segment!=null&&Object.hasOwnProperty.call(r,"segment")&&p.onnx.TensorProto.Segment.encode(r.segment,i.uint32(26).fork()).ldelim(),r.floatData!=null&&r.floatData.length){i.uint32(34).fork();for(var a=0;a<r.floatData.length;++a)i.float(r.floatData[a]);i.ldelim()}if(r.int32Data!=null&&r.int32Data.length){i.uint32(42).fork();for(var a=0;a<r.int32Data.length;++a)i.int32(r.int32Data[a]);i.ldelim()}if(r.stringData!=null&&r.stringData.length)for(var a=0;a<r.stringData.length;++a)i.uint32(50).bytes(r.stringData[a]);if(r.int64Data!=null&&r.int64Data.length){i.uint32(58).fork();for(var a=0;a<r.int64Data.length;++a)i.int64(r.int64Data[a]);i.ldelim()}if(r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(66).string(r.name),r.rawData!=null&&Object.hasOwnProperty.call(r,"rawData")&&i.uint32(74).bytes(r.rawData),r.doubleData!=null&&r.doubleData.length){i.uint32(82).fork();for(var a=0;a<r.doubleData.length;++a)i.double(r.doubleData[a]);i.ldelim()}if(r.uint64Data!=null&&r.uint64Data.length){i.uint32(90).fork();for(var a=0;a<r.uint64Data.length;++a)i.uint64(r.uint64Data[a]);i.ldelim()}if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(98).string(r.docString),r.externalData!=null&&r.externalData.length)for(var a=0;a<r.externalData.length;++a)p.onnx.StringStringEntryProto.encode(r.externalData[a],i.uint32(106).fork()).ldelim();return r.dataLocation!=null&&Object.hasOwnProperty.call(r,"dataLocation")&&i.uint32(112).int32(r.dataLocation),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.TensorProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{if(c.dims&&c.dims.length||(c.dims=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.dims.push(r.int64());else c.dims.push(r.int64());break}case 2:{c.dataType=r.int32();break}case 3:{c.segment=p.onnx.TensorProto.Segment.decode(r,r.uint32());break}case 4:{if(c.floatData&&c.floatData.length||(c.floatData=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.floatData.push(r.float());else c.floatData.push(r.float());break}case 5:{if(c.int32Data&&c.int32Data.length||(c.int32Data=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.int32Data.push(r.int32());else c.int32Data.push(r.int32());break}case 6:{c.stringData&&c.stringData.length||(c.stringData=[]),c.stringData.push(r.bytes());break}case 7:{if(c.int64Data&&c.int64Data.length||(c.int64Data=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.int64Data.push(r.int64());else c.int64Data.push(r.int64());break}case 8:{c.name=r.string();break}case 12:{c.docString=r.string();break}case 9:{c.rawData=r.bytes();break}case 13:{c.externalData&&c.externalData.length||(c.externalData=[]),c.externalData.push(p.onnx.StringStringEntryProto.decode(r,r.uint32()));break}case 14:{c.dataLocation=r.int32();break}case 10:{if(c.doubleData&&c.doubleData.length||(c.doubleData=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.doubleData.push(r.double());else c.doubleData.push(r.double());break}case 11:{if(c.uint64Data&&c.uint64Data.length||(c.uint64Data=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.uint64Data.push(r.uint64());else c.uint64Data.push(r.uint64());break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.dims!=null&&r.hasOwnProperty("dims")){if(!Array.isArray(r.dims))return"dims: array expected";for(var i=0;i<r.dims.length;++i)if(!l.isInteger(r.dims[i])&&!(r.dims[i]&&l.isInteger(r.dims[i].low)&&l.isInteger(r.dims[i].high)))return"dims: integer|Long[] expected"}if(r.dataType!=null&&r.hasOwnProperty("dataType")&&!l.isInteger(r.dataType))return"dataType: integer expected";if(r.segment!=null&&r.hasOwnProperty("segment")){var a=p.onnx.TensorProto.Segment.verify(r.segment);if(a)return"segment."+a}if(r.floatData!=null&&r.hasOwnProperty("floatData")){if(!Array.isArray(r.floatData))return"floatData: array expected";for(var i=0;i<r.floatData.length;++i)if(typeof r.floatData[i]!="number")return"floatData: number[] expected"}if(r.int32Data!=null&&r.hasOwnProperty("int32Data")){if(!Array.isArray(r.int32Data))return"int32Data: array expected";for(var i=0;i<r.int32Data.length;++i)if(!l.isInteger(r.int32Data[i]))return"int32Data: integer[] expected"}if(r.stringData!=null&&r.hasOwnProperty("stringData")){if(!Array.isArray(r.stringData))return"stringData: array expected";for(var i=0;i<r.stringData.length;++i)if(!(r.stringData[i]&&typeof r.stringData[i].length=="number"||l.isString(r.stringData[i])))return"stringData: buffer[] expected"}if(r.int64Data!=null&&r.hasOwnProperty("int64Data")){if(!Array.isArray(r.int64Data))return"int64Data: array expected";for(var i=0;i<r.int64Data.length;++i)if(!l.isInteger(r.int64Data[i])&&!(r.int64Data[i]&&l.isInteger(r.int64Data[i].low)&&l.isInteger(r.int64Data[i].high)))return"int64Data: integer|Long[] expected"}if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString))return"docString: string expected";if(r.rawData!=null&&r.hasOwnProperty("rawData")&&!(r.rawData&&typeof r.rawData.length=="number"||l.isString(r.rawData)))return"rawData: buffer expected";if(r.externalData!=null&&r.hasOwnProperty("externalData")){if(!Array.isArray(r.externalData))return"externalData: array expected";for(var i=0;i<r.externalData.length;++i){var a=p.onnx.StringStringEntryProto.verify(r.externalData[i]);if(a)return"externalData."+a}}if(r.dataLocation!=null&&r.hasOwnProperty("dataLocation"))switch(r.dataLocation){default:return"dataLocation: enum value expected";case 0:case 1:break}if(r.doubleData!=null&&r.hasOwnProperty("doubleData")){if(!Array.isArray(r.doubleData))return"doubleData: array expected";for(var i=0;i<r.doubleData.length;++i)if(typeof r.doubleData[i]!="number")return"doubleData: number[] expected"}if(r.uint64Data!=null&&r.hasOwnProperty("uint64Data")){if(!Array.isArray(r.uint64Data))return"uint64Data: array expected";for(var i=0;i<r.uint64Data.length;++i)if(!l.isInteger(r.uint64Data[i])&&!(r.uint64Data[i]&&l.isInteger(r.uint64Data[i].low)&&l.isInteger(r.uint64Data[i].high)))return"uint64Data: integer|Long[] expected"}return null},o.fromObject=function(r){if(r instanceof p.onnx.TensorProto)return r;var i=new p.onnx.TensorProto;if(r.dims){if(!Array.isArray(r.dims))throw TypeError(".onnx.TensorProto.dims: array expected");i.dims=[];for(var a=0;a<r.dims.length;++a)l.Long?(i.dims[a]=l.Long.fromValue(r.dims[a])).unsigned=!1:typeof r.dims[a]=="string"?i.dims[a]=parseInt(r.dims[a],10):typeof r.dims[a]=="number"?i.dims[a]=r.dims[a]:typeof r.dims[a]=="object"&&(i.dims[a]=new l.LongBits(r.dims[a].low>>>0,r.dims[a].high>>>0).toNumber())}if(r.dataType!=null&&(i.dataType=r.dataType|0),r.segment!=null){if(typeof r.segment!="object")throw TypeError(".onnx.TensorProto.segment: object expected");i.segment=p.onnx.TensorProto.Segment.fromObject(r.segment)}if(r.floatData){if(!Array.isArray(r.floatData))throw TypeError(".onnx.TensorProto.floatData: array expected");i.floatData=[];for(var a=0;a<r.floatData.length;++a)i.floatData[a]=Number(r.floatData[a])}if(r.int32Data){if(!Array.isArray(r.int32Data))throw TypeError(".onnx.TensorProto.int32Data: array expected");i.int32Data=[];for(var a=0;a<r.int32Data.length;++a)i.int32Data[a]=r.int32Data[a]|0}if(r.stringData){if(!Array.isArray(r.stringData))throw TypeError(".onnx.TensorProto.stringData: array expected");i.stringData=[];for(var a=0;a<r.stringData.length;++a)typeof r.stringData[a]=="string"?l.base64.decode(r.stringData[a],i.stringData[a]=l.newBuffer(l.base64.length(r.stringData[a])),0):r.stringData[a].length>=0&&(i.stringData[a]=r.stringData[a])}if(r.int64Data){if(!Array.isArray(r.int64Data))throw TypeError(".onnx.TensorProto.int64Data: array expected");i.int64Data=[];for(var a=0;a<r.int64Data.length;++a)l.Long?(i.int64Data[a]=l.Long.fromValue(r.int64Data[a])).unsigned=!1:typeof r.int64Data[a]=="string"?i.int64Data[a]=parseInt(r.int64Data[a],10):typeof r.int64Data[a]=="number"?i.int64Data[a]=r.int64Data[a]:typeof r.int64Data[a]=="object"&&(i.int64Data[a]=new l.LongBits(r.int64Data[a].low>>>0,r.int64Data[a].high>>>0).toNumber())}if(r.name!=null&&(i.name=String(r.name)),r.docString!=null&&(i.docString=String(r.docString)),r.rawData!=null&&(typeof r.rawData=="string"?l.base64.decode(r.rawData,i.rawData=l.newBuffer(l.base64.length(r.rawData)),0):r.rawData.length>=0&&(i.rawData=r.rawData)),r.externalData){if(!Array.isArray(r.externalData))throw TypeError(".onnx.TensorProto.externalData: array expected");i.externalData=[];for(var a=0;a<r.externalData.length;++a){if(typeof r.externalData[a]!="object")throw TypeError(".onnx.TensorProto.externalData: object expected");i.externalData[a]=p.onnx.StringStringEntryProto.fromObject(r.externalData[a])}}switch(r.dataLocation){default:if(typeof r.dataLocation=="number"){i.dataLocation=r.dataLocation;break}break;case"DEFAULT":case 0:i.dataLocation=0;break;case"EXTERNAL":case 1:i.dataLocation=1;break}if(r.doubleData){if(!Array.isArray(r.doubleData))throw TypeError(".onnx.TensorProto.doubleData: array expected");i.doubleData=[];for(var a=0;a<r.doubleData.length;++a)i.doubleData[a]=Number(r.doubleData[a])}if(r.uint64Data){if(!Array.isArray(r.uint64Data))throw TypeError(".onnx.TensorProto.uint64Data: array expected");i.uint64Data=[];for(var a=0;a<r.uint64Data.length;++a)l.Long?(i.uint64Data[a]=l.Long.fromValue(r.uint64Data[a])).unsigned=!0:typeof r.uint64Data[a]=="string"?i.uint64Data[a]=parseInt(r.uint64Data[a],10):typeof r.uint64Data[a]=="number"?i.uint64Data[a]=r.uint64Data[a]:typeof r.uint64Data[a]=="object"&&(i.uint64Data[a]=new l.LongBits(r.uint64Data[a].low>>>0,r.uint64Data[a].high>>>0).toNumber(!0))}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dims=[],a.floatData=[],a.int32Data=[],a.stringData=[],a.int64Data=[],a.doubleData=[],a.uint64Data=[],a.externalData=[]),i.defaults&&(a.dataType=0,a.segment=null,a.name="",i.bytes===String?a.rawData="":(a.rawData=[],i.bytes!==Array&&(a.rawData=l.newBuffer(a.rawData))),a.docString="",a.dataLocation=i.enums===String?"DEFAULT":0),r.dims&&r.dims.length){a.dims=[];for(var c=0;c<r.dims.length;++c)typeof r.dims[c]=="number"?a.dims[c]=i.longs===String?String(r.dims[c]):r.dims[c]:a.dims[c]=i.longs===String?l.Long.prototype.toString.call(r.dims[c]):i.longs===Number?new l.LongBits(r.dims[c].low>>>0,r.dims[c].high>>>0).toNumber():r.dims[c]}if(r.dataType!=null&&r.hasOwnProperty("dataType")&&(a.dataType=r.dataType),r.segment!=null&&r.hasOwnProperty("segment")&&(a.segment=p.onnx.TensorProto.Segment.toObject(r.segment,i)),r.floatData&&r.floatData.length){a.floatData=[];for(var c=0;c<r.floatData.length;++c)a.floatData[c]=i.json&&!isFinite(r.floatData[c])?String(r.floatData[c]):r.floatData[c]}if(r.int32Data&&r.int32Data.length){a.int32Data=[];for(var c=0;c<r.int32Data.length;++c)a.int32Data[c]=r.int32Data[c]}if(r.stringData&&r.stringData.length){a.stringData=[];for(var c=0;c<r.stringData.length;++c)a.stringData[c]=i.bytes===String?l.base64.encode(r.stringData[c],0,r.stringData[c].length):i.bytes===Array?Array.prototype.slice.call(r.stringData[c]):r.stringData[c]}if(r.int64Data&&r.int64Data.length){a.int64Data=[];for(var c=0;c<r.int64Data.length;++c)typeof r.int64Data[c]=="number"?a.int64Data[c]=i.longs===String?String(r.int64Data[c]):r.int64Data[c]:a.int64Data[c]=i.longs===String?l.Long.prototype.toString.call(r.int64Data[c]):i.longs===Number?new l.LongBits(r.int64Data[c].low>>>0,r.int64Data[c].high>>>0).toNumber():r.int64Data[c]}if(r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.rawData!=null&&r.hasOwnProperty("rawData")&&(a.rawData=i.bytes===String?l.base64.encode(r.rawData,0,r.rawData.length):i.bytes===Array?Array.prototype.slice.call(r.rawData):r.rawData),r.doubleData&&r.doubleData.length){a.doubleData=[];for(var c=0;c<r.doubleData.length;++c)a.doubleData[c]=i.json&&!isFinite(r.doubleData[c])?String(r.doubleData[c]):r.doubleData[c]}if(r.uint64Data&&r.uint64Data.length){a.uint64Data=[];for(var c=0;c<r.uint64Data.length;++c)typeof r.uint64Data[c]=="number"?a.uint64Data[c]=i.longs===String?String(r.uint64Data[c]):r.uint64Data[c]:a.uint64Data[c]=i.longs===String?l.Long.prototype.toString.call(r.uint64Data[c]):i.longs===Number?new l.LongBits(r.uint64Data[c].low>>>0,r.uint64Data[c].high>>>0).toNumber(!0):r.uint64Data[c]}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.externalData&&r.externalData.length){a.externalData=[];for(var c=0;c<r.externalData.length;++c)a.externalData[c]=p.onnx.StringStringEntryProto.toObject(r.externalData[c],i)}return r.dataLocation!=null&&r.hasOwnProperty("dataLocation")&&(a.dataLocation=i.enums===String?p.onnx.TensorProto.DataLocation[r.dataLocation]===void 0?r.dataLocation:p.onnx.TensorProto.DataLocation[r.dataLocation]:r.dataLocation),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorProto"},o.DataType=(function(){var r={},i=Object.create(r);return i[r[0]="UNDEFINED"]=0,i[r[1]="FLOAT"]=1,i[r[2]="UINT8"]=2,i[r[3]="INT8"]=3,i[r[4]="UINT16"]=4,i[r[5]="INT16"]=5,i[r[6]="INT32"]=6,i[r[7]="INT64"]=7,i[r[8]="STRING"]=8,i[r[9]="BOOL"]=9,i[r[10]="FLOAT16"]=10,i[r[11]="DOUBLE"]=11,i[r[12]="UINT32"]=12,i[r[13]="UINT64"]=13,i[r[14]="COMPLEX64"]=14,i[r[15]="COMPLEX128"]=15,i[r[16]="BFLOAT16"]=16,i[r[17]="FLOAT8E4M3FN"]=17,i[r[18]="FLOAT8E4M3FNUZ"]=18,i[r[19]="FLOAT8E5M2"]=19,i[r[20]="FLOAT8E5M2FNUZ"]=20,i})(),o.Segment=(function(){function r(i){if(i)for(var a=Object.keys(i),c=0;c<a.length;++c)i[a[c]]!=null&&(this[a[c]]=i[a[c]])}return r.prototype.begin=l.Long?l.Long.fromBits(0,0,!1):0,r.prototype.end=l.Long?l.Long.fromBits(0,0,!1):0,r.create=function(i){return new r(i)},r.encode=function(i,a){return a||(a=u.create()),i.begin!=null&&Object.hasOwnProperty.call(i,"begin")&&a.uint32(8).int64(i.begin),i.end!=null&&Object.hasOwnProperty.call(i,"end")&&a.uint32(16).int64(i.end),a},r.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},r.decode=function(i,a){i instanceof s||(i=s.create(i));for(var c=a===void 0?i.len:i.pos+a,h=new p.onnx.TensorProto.Segment;i.pos<c;){var m=i.uint32();switch(m>>>3){case 1:{h.begin=i.int64();break}case 2:{h.end=i.int64();break}default:i.skipType(m&7);break}}return h},r.decodeDelimited=function(i){return i instanceof s||(i=new s(i)),this.decode(i,i.uint32())},r.verify=function(i){return typeof i!="object"||i===null?"object expected":i.begin!=null&&i.hasOwnProperty("begin")&&!l.isInteger(i.begin)&&!(i.begin&&l.isInteger(i.begin.low)&&l.isInteger(i.begin.high))?"begin: integer|Long expected":i.end!=null&&i.hasOwnProperty("end")&&!l.isInteger(i.end)&&!(i.end&&l.isInteger(i.end.low)&&l.isInteger(i.end.high))?"end: integer|Long expected":null},r.fromObject=function(i){if(i instanceof p.onnx.TensorProto.Segment)return i;var a=new p.onnx.TensorProto.Segment;return i.begin!=null&&(l.Long?(a.begin=l.Long.fromValue(i.begin)).unsigned=!1:typeof i.begin=="string"?a.begin=parseInt(i.begin,10):typeof i.begin=="number"?a.begin=i.begin:typeof i.begin=="object"&&(a.begin=new l.LongBits(i.begin.low>>>0,i.begin.high>>>0).toNumber())),i.end!=null&&(l.Long?(a.end=l.Long.fromValue(i.end)).unsigned=!1:typeof i.end=="string"?a.end=parseInt(i.end,10):typeof i.end=="number"?a.end=i.end:typeof i.end=="object"&&(a.end=new l.LongBits(i.end.low>>>0,i.end.high>>>0).toNumber())),a},r.toObject=function(i,a){a||(a={});var c={};if(a.defaults){if(l.Long){var h=new l.Long(0,0,!1);c.begin=a.longs===String?h.toString():a.longs===Number?h.toNumber():h}else c.begin=a.longs===String?"0":0;if(l.Long){var h=new l.Long(0,0,!1);c.end=a.longs===String?h.toString():a.longs===Number?h.toNumber():h}else c.end=a.longs===String?"0":0}return i.begin!=null&&i.hasOwnProperty("begin")&&(typeof i.begin=="number"?c.begin=a.longs===String?String(i.begin):i.begin:c.begin=a.longs===String?l.Long.prototype.toString.call(i.begin):a.longs===Number?new l.LongBits(i.begin.low>>>0,i.begin.high>>>0).toNumber():i.begin),i.end!=null&&i.hasOwnProperty("end")&&(typeof i.end=="number"?c.end=a.longs===String?String(i.end):i.end:c.end=a.longs===String?l.Long.prototype.toString.call(i.end):a.longs===Number?new l.LongBits(i.end.low>>>0,i.end.high>>>0).toNumber():i.end),c},r.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},r.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TensorProto.Segment"},r})(),o.DataLocation=(function(){var r={},i=Object.create(r);return i[r[0]="DEFAULT"]=0,i[r[1]="EXTERNAL"]=1,i})(),o})(),d.SparseTensorProto=(function(){function o(r){if(this.dims=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.values=null,o.prototype.indices=null,o.prototype.dims=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.values!=null&&Object.hasOwnProperty.call(r,"values")&&p.onnx.TensorProto.encode(r.values,i.uint32(10).fork()).ldelim(),r.indices!=null&&Object.hasOwnProperty.call(r,"indices")&&p.onnx.TensorProto.encode(r.indices,i.uint32(18).fork()).ldelim(),r.dims!=null&&r.dims.length){i.uint32(26).fork();for(var a=0;a<r.dims.length;++a)i.int64(r.dims[a]);i.ldelim()}return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.SparseTensorProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.values=p.onnx.TensorProto.decode(r,r.uint32());break}case 2:{c.indices=p.onnx.TensorProto.decode(r,r.uint32());break}case 3:{if(c.dims&&c.dims.length||(c.dims=[]),(h&7)===2)for(var m=r.uint32()+r.pos;r.pos<m;)c.dims.push(r.int64());else c.dims.push(r.int64());break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.values!=null&&r.hasOwnProperty("values")){var i=p.onnx.TensorProto.verify(r.values);if(i)return"values."+i}if(r.indices!=null&&r.hasOwnProperty("indices")){var i=p.onnx.TensorProto.verify(r.indices);if(i)return"indices."+i}if(r.dims!=null&&r.hasOwnProperty("dims")){if(!Array.isArray(r.dims))return"dims: array expected";for(var a=0;a<r.dims.length;++a)if(!l.isInteger(r.dims[a])&&!(r.dims[a]&&l.isInteger(r.dims[a].low)&&l.isInteger(r.dims[a].high)))return"dims: integer|Long[] expected"}return null},o.fromObject=function(r){if(r instanceof p.onnx.SparseTensorProto)return r;var i=new p.onnx.SparseTensorProto;if(r.values!=null){if(typeof r.values!="object")throw TypeError(".onnx.SparseTensorProto.values: object expected");i.values=p.onnx.TensorProto.fromObject(r.values)}if(r.indices!=null){if(typeof r.indices!="object")throw TypeError(".onnx.SparseTensorProto.indices: object expected");i.indices=p.onnx.TensorProto.fromObject(r.indices)}if(r.dims){if(!Array.isArray(r.dims))throw TypeError(".onnx.SparseTensorProto.dims: array expected");i.dims=[];for(var a=0;a<r.dims.length;++a)l.Long?(i.dims[a]=l.Long.fromValue(r.dims[a])).unsigned=!1:typeof r.dims[a]=="string"?i.dims[a]=parseInt(r.dims[a],10):typeof r.dims[a]=="number"?i.dims[a]=r.dims[a]:typeof r.dims[a]=="object"&&(i.dims[a]=new l.LongBits(r.dims[a].low>>>0,r.dims[a].high>>>0).toNumber())}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dims=[]),i.defaults&&(a.values=null,a.indices=null),r.values!=null&&r.hasOwnProperty("values")&&(a.values=p.onnx.TensorProto.toObject(r.values,i)),r.indices!=null&&r.hasOwnProperty("indices")&&(a.indices=p.onnx.TensorProto.toObject(r.indices,i)),r.dims&&r.dims.length){a.dims=[];for(var c=0;c<r.dims.length;++c)typeof r.dims[c]=="number"?a.dims[c]=i.longs===String?String(r.dims[c]):r.dims[c]:a.dims[c]=i.longs===String?l.Long.prototype.toString.call(r.dims[c]):i.longs===Number?new l.LongBits(r.dims[c].low>>>0,r.dims[c].high>>>0).toNumber():r.dims[c]}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.SparseTensorProto"},o})(),d.TensorShapeProto=(function(){function o(r){if(this.dim=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.dim=l.emptyArray,o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.dim!=null&&r.dim.length)for(var a=0;a<r.dim.length;++a)p.onnx.TensorShapeProto.Dimension.encode(r.dim[a],i.uint32(10).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.TensorShapeProto;r.pos<a;){var h=r.uint32();h>>>3===1?(c.dim&&c.dim.length||(c.dim=[]),c.dim.push(p.onnx.TensorShapeProto.Dimension.decode(r,r.uint32()))):r.skipType(h&7)}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.dim!=null&&r.hasOwnProperty("dim")){if(!Array.isArray(r.dim))return"dim: array expected";for(var i=0;i<r.dim.length;++i){var a=p.onnx.TensorShapeProto.Dimension.verify(r.dim[i]);if(a)return"dim."+a}}return null},o.fromObject=function(r){if(r instanceof p.onnx.TensorShapeProto)return r;var i=new p.onnx.TensorShapeProto;if(r.dim){if(!Array.isArray(r.dim))throw TypeError(".onnx.TensorShapeProto.dim: array expected");i.dim=[];for(var a=0;a<r.dim.length;++a){if(typeof r.dim[a]!="object")throw TypeError(".onnx.TensorShapeProto.dim: object expected");i.dim[a]=p.onnx.TensorShapeProto.Dimension.fromObject(r.dim[a])}}return i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.dim=[]),r.dim&&r.dim.length){a.dim=[];for(var c=0;c<r.dim.length;++c)a.dim[c]=p.onnx.TensorShapeProto.Dimension.toObject(r.dim[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.TensorShapeProto"},o.Dimension=(function(){function r(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}r.prototype.dimValue=null,r.prototype.dimParam=null,r.prototype.denotation="";var i;return Object.defineProperty(r.prototype,"value",{get:l.oneOfGetter(i=["dimValue","dimParam"]),set:l.oneOfSetter(i)}),r.create=function(a){return new r(a)},r.encode=function(a,c){return c||(c=u.create()),a.dimValue!=null&&Object.hasOwnProperty.call(a,"dimValue")&&c.uint32(8).int64(a.dimValue),a.dimParam!=null&&Object.hasOwnProperty.call(a,"dimParam")&&c.uint32(18).string(a.dimParam),a.denotation!=null&&Object.hasOwnProperty.call(a,"denotation")&&c.uint32(26).string(a.denotation),c},r.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},r.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TensorShapeProto.Dimension;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{m.dimValue=a.int64();break}case 2:{m.dimParam=a.string();break}case 3:{m.denotation=a.string();break}default:a.skipType(b&7);break}}return m},r.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},r.verify=function(a){if(typeof a!="object"||a===null)return"object expected";var c={};if(a.dimValue!=null&&a.hasOwnProperty("dimValue")&&(c.value=1,!l.isInteger(a.dimValue)&&!(a.dimValue&&l.isInteger(a.dimValue.low)&&l.isInteger(a.dimValue.high))))return"dimValue: integer|Long expected";if(a.dimParam!=null&&a.hasOwnProperty("dimParam")){if(c.value===1)return"value: multiple values";if(c.value=1,!l.isString(a.dimParam))return"dimParam: string expected"}return a.denotation!=null&&a.hasOwnProperty("denotation")&&!l.isString(a.denotation)?"denotation: string expected":null},r.fromObject=function(a){if(a instanceof p.onnx.TensorShapeProto.Dimension)return a;var c=new p.onnx.TensorShapeProto.Dimension;return a.dimValue!=null&&(l.Long?(c.dimValue=l.Long.fromValue(a.dimValue)).unsigned=!1:typeof a.dimValue=="string"?c.dimValue=parseInt(a.dimValue,10):typeof a.dimValue=="number"?c.dimValue=a.dimValue:typeof a.dimValue=="object"&&(c.dimValue=new l.LongBits(a.dimValue.low>>>0,a.dimValue.high>>>0).toNumber())),a.dimParam!=null&&(c.dimParam=String(a.dimParam)),a.denotation!=null&&(c.denotation=String(a.denotation)),c},r.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.denotation=""),a.dimValue!=null&&a.hasOwnProperty("dimValue")&&(typeof a.dimValue=="number"?h.dimValue=c.longs===String?String(a.dimValue):a.dimValue:h.dimValue=c.longs===String?l.Long.prototype.toString.call(a.dimValue):c.longs===Number?new l.LongBits(a.dimValue.low>>>0,a.dimValue.high>>>0).toNumber():a.dimValue,c.oneofs&&(h.value="dimValue")),a.dimParam!=null&&a.hasOwnProperty("dimParam")&&(h.dimParam=a.dimParam,c.oneofs&&(h.value="dimParam")),a.denotation!=null&&a.hasOwnProperty("denotation")&&(h.denotation=a.denotation),h},r.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},r.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TensorShapeProto.Dimension"},r})(),o})(),d.TypeProto=(function(){function o(i){if(i)for(var a=Object.keys(i),c=0;c<a.length;++c)i[a[c]]!=null&&(this[a[c]]=i[a[c]])}o.prototype.tensorType=null,o.prototype.sequenceType=null,o.prototype.mapType=null,o.prototype.optionalType=null,o.prototype.sparseTensorType=null,o.prototype.denotation="";var r;return Object.defineProperty(o.prototype,"value",{get:l.oneOfGetter(r=["tensorType","sequenceType","mapType","optionalType","sparseTensorType"]),set:l.oneOfSetter(r)}),o.create=function(i){return new o(i)},o.encode=function(i,a){return a||(a=u.create()),i.tensorType!=null&&Object.hasOwnProperty.call(i,"tensorType")&&p.onnx.TypeProto.Tensor.encode(i.tensorType,a.uint32(10).fork()).ldelim(),i.sequenceType!=null&&Object.hasOwnProperty.call(i,"sequenceType")&&p.onnx.TypeProto.Sequence.encode(i.sequenceType,a.uint32(34).fork()).ldelim(),i.mapType!=null&&Object.hasOwnProperty.call(i,"mapType")&&p.onnx.TypeProto.Map.encode(i.mapType,a.uint32(42).fork()).ldelim(),i.denotation!=null&&Object.hasOwnProperty.call(i,"denotation")&&a.uint32(50).string(i.denotation),i.sparseTensorType!=null&&Object.hasOwnProperty.call(i,"sparseTensorType")&&p.onnx.TypeProto.SparseTensor.encode(i.sparseTensorType,a.uint32(66).fork()).ldelim(),i.optionalType!=null&&Object.hasOwnProperty.call(i,"optionalType")&&p.onnx.TypeProto.Optional.encode(i.optionalType,a.uint32(74).fork()).ldelim(),a},o.encodeDelimited=function(i,a){return this.encode(i,a).ldelim()},o.decode=function(i,a){i instanceof s||(i=s.create(i));for(var c=a===void 0?i.len:i.pos+a,h=new p.onnx.TypeProto;i.pos<c;){var m=i.uint32();switch(m>>>3){case 1:{h.tensorType=p.onnx.TypeProto.Tensor.decode(i,i.uint32());break}case 4:{h.sequenceType=p.onnx.TypeProto.Sequence.decode(i,i.uint32());break}case 5:{h.mapType=p.onnx.TypeProto.Map.decode(i,i.uint32());break}case 9:{h.optionalType=p.onnx.TypeProto.Optional.decode(i,i.uint32());break}case 8:{h.sparseTensorType=p.onnx.TypeProto.SparseTensor.decode(i,i.uint32());break}case 6:{h.denotation=i.string();break}default:i.skipType(m&7);break}}return h},o.decodeDelimited=function(i){return i instanceof s||(i=new s(i)),this.decode(i,i.uint32())},o.verify=function(i){if(typeof i!="object"||i===null)return"object expected";var a={};if(i.tensorType!=null&&i.hasOwnProperty("tensorType")){a.value=1;{var c=p.onnx.TypeProto.Tensor.verify(i.tensorType);if(c)return"tensorType."+c}}if(i.sequenceType!=null&&i.hasOwnProperty("sequenceType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=p.onnx.TypeProto.Sequence.verify(i.sequenceType);if(c)return"sequenceType."+c}}if(i.mapType!=null&&i.hasOwnProperty("mapType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=p.onnx.TypeProto.Map.verify(i.mapType);if(c)return"mapType."+c}}if(i.optionalType!=null&&i.hasOwnProperty("optionalType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=p.onnx.TypeProto.Optional.verify(i.optionalType);if(c)return"optionalType."+c}}if(i.sparseTensorType!=null&&i.hasOwnProperty("sparseTensorType")){if(a.value===1)return"value: multiple values";a.value=1;{var c=p.onnx.TypeProto.SparseTensor.verify(i.sparseTensorType);if(c)return"sparseTensorType."+c}}return i.denotation!=null&&i.hasOwnProperty("denotation")&&!l.isString(i.denotation)?"denotation: string expected":null},o.fromObject=function(i){if(i instanceof p.onnx.TypeProto)return i;var a=new p.onnx.TypeProto;if(i.tensorType!=null){if(typeof i.tensorType!="object")throw TypeError(".onnx.TypeProto.tensorType: object expected");a.tensorType=p.onnx.TypeProto.Tensor.fromObject(i.tensorType)}if(i.sequenceType!=null){if(typeof i.sequenceType!="object")throw TypeError(".onnx.TypeProto.sequenceType: object expected");a.sequenceType=p.onnx.TypeProto.Sequence.fromObject(i.sequenceType)}if(i.mapType!=null){if(typeof i.mapType!="object")throw TypeError(".onnx.TypeProto.mapType: object expected");a.mapType=p.onnx.TypeProto.Map.fromObject(i.mapType)}if(i.optionalType!=null){if(typeof i.optionalType!="object")throw TypeError(".onnx.TypeProto.optionalType: object expected");a.optionalType=p.onnx.TypeProto.Optional.fromObject(i.optionalType)}if(i.sparseTensorType!=null){if(typeof i.sparseTensorType!="object")throw TypeError(".onnx.TypeProto.sparseTensorType: object expected");a.sparseTensorType=p.onnx.TypeProto.SparseTensor.fromObject(i.sparseTensorType)}return i.denotation!=null&&(a.denotation=String(i.denotation)),a},o.toObject=function(i,a){a||(a={});var c={};return a.defaults&&(c.denotation=""),i.tensorType!=null&&i.hasOwnProperty("tensorType")&&(c.tensorType=p.onnx.TypeProto.Tensor.toObject(i.tensorType,a),a.oneofs&&(c.value="tensorType")),i.sequenceType!=null&&i.hasOwnProperty("sequenceType")&&(c.sequenceType=p.onnx.TypeProto.Sequence.toObject(i.sequenceType,a),a.oneofs&&(c.value="sequenceType")),i.mapType!=null&&i.hasOwnProperty("mapType")&&(c.mapType=p.onnx.TypeProto.Map.toObject(i.mapType,a),a.oneofs&&(c.value="mapType")),i.denotation!=null&&i.hasOwnProperty("denotation")&&(c.denotation=i.denotation),i.sparseTensorType!=null&&i.hasOwnProperty("sparseTensorType")&&(c.sparseTensorType=p.onnx.TypeProto.SparseTensor.toObject(i.sparseTensorType,a),a.oneofs&&(c.value="sparseTensorType")),i.optionalType!=null&&i.hasOwnProperty("optionalType")&&(c.optionalType=p.onnx.TypeProto.Optional.toObject(i.optionalType,a),a.oneofs&&(c.value="optionalType")),c},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(i){return i===void 0&&(i="type.googleapis.com"),i+"/onnx.TypeProto"},o.Tensor=(function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=0,i.prototype.shape=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&c.uint32(8).int32(a.elemType),a.shape!=null&&Object.hasOwnProperty.call(a,"shape")&&p.onnx.TensorShapeProto.encode(a.shape,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TypeProto.Tensor;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{m.elemType=a.int32();break}case 2:{m.shape=p.onnx.TensorShapeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return m},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")&&!l.isInteger(a.elemType))return"elemType: integer expected";if(a.shape!=null&&a.hasOwnProperty("shape")){var c=p.onnx.TensorShapeProto.verify(a.shape);if(c)return"shape."+c}return null},i.fromObject=function(a){if(a instanceof p.onnx.TypeProto.Tensor)return a;var c=new p.onnx.TypeProto.Tensor;if(a.elemType!=null&&(c.elemType=a.elemType|0),a.shape!=null){if(typeof a.shape!="object")throw TypeError(".onnx.TypeProto.Tensor.shape: object expected");c.shape=p.onnx.TensorShapeProto.fromObject(a.shape)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=0,h.shape=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=a.elemType),a.shape!=null&&a.hasOwnProperty("shape")&&(h.shape=p.onnx.TensorShapeProto.toObject(a.shape,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Tensor"},i})(),o.Sequence=(function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&p.onnx.TypeProto.encode(a.elemType,c.uint32(10).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TypeProto.Sequence;a.pos<h;){var b=a.uint32();b>>>3===1?m.elemType=p.onnx.TypeProto.decode(a,a.uint32()):a.skipType(b&7)}return m},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")){var c=p.onnx.TypeProto.verify(a.elemType);if(c)return"elemType."+c}return null},i.fromObject=function(a){if(a instanceof p.onnx.TypeProto.Sequence)return a;var c=new p.onnx.TypeProto.Sequence;if(a.elemType!=null){if(typeof a.elemType!="object")throw TypeError(".onnx.TypeProto.Sequence.elemType: object expected");c.elemType=p.onnx.TypeProto.fromObject(a.elemType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=p.onnx.TypeProto.toObject(a.elemType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Sequence"},i})(),o.Map=(function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.keyType=0,i.prototype.valueType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.keyType!=null&&Object.hasOwnProperty.call(a,"keyType")&&c.uint32(8).int32(a.keyType),a.valueType!=null&&Object.hasOwnProperty.call(a,"valueType")&&p.onnx.TypeProto.encode(a.valueType,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TypeProto.Map;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{m.keyType=a.int32();break}case 2:{m.valueType=p.onnx.TypeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return m},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.keyType!=null&&a.hasOwnProperty("keyType")&&!l.isInteger(a.keyType))return"keyType: integer expected";if(a.valueType!=null&&a.hasOwnProperty("valueType")){var c=p.onnx.TypeProto.verify(a.valueType);if(c)return"valueType."+c}return null},i.fromObject=function(a){if(a instanceof p.onnx.TypeProto.Map)return a;var c=new p.onnx.TypeProto.Map;if(a.keyType!=null&&(c.keyType=a.keyType|0),a.valueType!=null){if(typeof a.valueType!="object")throw TypeError(".onnx.TypeProto.Map.valueType: object expected");c.valueType=p.onnx.TypeProto.fromObject(a.valueType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.keyType=0,h.valueType=null),a.keyType!=null&&a.hasOwnProperty("keyType")&&(h.keyType=a.keyType),a.valueType!=null&&a.hasOwnProperty("valueType")&&(h.valueType=p.onnx.TypeProto.toObject(a.valueType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Map"},i})(),o.Optional=(function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&p.onnx.TypeProto.encode(a.elemType,c.uint32(10).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TypeProto.Optional;a.pos<h;){var b=a.uint32();b>>>3===1?m.elemType=p.onnx.TypeProto.decode(a,a.uint32()):a.skipType(b&7)}return m},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")){var c=p.onnx.TypeProto.verify(a.elemType);if(c)return"elemType."+c}return null},i.fromObject=function(a){if(a instanceof p.onnx.TypeProto.Optional)return a;var c=new p.onnx.TypeProto.Optional;if(a.elemType!=null){if(typeof a.elemType!="object")throw TypeError(".onnx.TypeProto.Optional.elemType: object expected");c.elemType=p.onnx.TypeProto.fromObject(a.elemType)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=p.onnx.TypeProto.toObject(a.elemType,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.Optional"},i})(),o.SparseTensor=(function(){function i(a){if(a)for(var c=Object.keys(a),h=0;h<c.length;++h)a[c[h]]!=null&&(this[c[h]]=a[c[h]])}return i.prototype.elemType=0,i.prototype.shape=null,i.create=function(a){return new i(a)},i.encode=function(a,c){return c||(c=u.create()),a.elemType!=null&&Object.hasOwnProperty.call(a,"elemType")&&c.uint32(8).int32(a.elemType),a.shape!=null&&Object.hasOwnProperty.call(a,"shape")&&p.onnx.TensorShapeProto.encode(a.shape,c.uint32(18).fork()).ldelim(),c},i.encodeDelimited=function(a,c){return this.encode(a,c).ldelim()},i.decode=function(a,c){a instanceof s||(a=s.create(a));for(var h=c===void 0?a.len:a.pos+c,m=new p.onnx.TypeProto.SparseTensor;a.pos<h;){var b=a.uint32();switch(b>>>3){case 1:{m.elemType=a.int32();break}case 2:{m.shape=p.onnx.TensorShapeProto.decode(a,a.uint32());break}default:a.skipType(b&7);break}}return m},i.decodeDelimited=function(a){return a instanceof s||(a=new s(a)),this.decode(a,a.uint32())},i.verify=function(a){if(typeof a!="object"||a===null)return"object expected";if(a.elemType!=null&&a.hasOwnProperty("elemType")&&!l.isInteger(a.elemType))return"elemType: integer expected";if(a.shape!=null&&a.hasOwnProperty("shape")){var c=p.onnx.TensorShapeProto.verify(a.shape);if(c)return"shape."+c}return null},i.fromObject=function(a){if(a instanceof p.onnx.TypeProto.SparseTensor)return a;var c=new p.onnx.TypeProto.SparseTensor;if(a.elemType!=null&&(c.elemType=a.elemType|0),a.shape!=null){if(typeof a.shape!="object")throw TypeError(".onnx.TypeProto.SparseTensor.shape: object expected");c.shape=p.onnx.TensorShapeProto.fromObject(a.shape)}return c},i.toObject=function(a,c){c||(c={});var h={};return c.defaults&&(h.elemType=0,h.shape=null),a.elemType!=null&&a.hasOwnProperty("elemType")&&(h.elemType=a.elemType),a.shape!=null&&a.hasOwnProperty("shape")&&(h.shape=p.onnx.TensorShapeProto.toObject(a.shape,c)),h},i.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},i.getTypeUrl=function(a){return a===void 0&&(a="type.googleapis.com"),a+"/onnx.TypeProto.SparseTensor"},i})(),o})(),d.OperatorSetIdProto=(function(){function o(r){if(r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.domain="",o.prototype.version=l.Long?l.Long.fromBits(0,0,!1):0,o.create=function(r){return new o(r)},o.encode=function(r,i){return i||(i=u.create()),r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(10).string(r.domain),r.version!=null&&Object.hasOwnProperty.call(r,"version")&&i.uint32(16).int64(r.version),i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.OperatorSetIdProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.domain=r.string();break}case 2:{c.version=r.int64();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){return typeof r!="object"||r===null?"object expected":r.domain!=null&&r.hasOwnProperty("domain")&&!l.isString(r.domain)?"domain: string expected":r.version!=null&&r.hasOwnProperty("version")&&!l.isInteger(r.version)&&!(r.version&&l.isInteger(r.version.low)&&l.isInteger(r.version.high))?"version: integer|Long expected":null},o.fromObject=function(r){if(r instanceof p.onnx.OperatorSetIdProto)return r;var i=new p.onnx.OperatorSetIdProto;return r.domain!=null&&(i.domain=String(r.domain)),r.version!=null&&(l.Long?(i.version=l.Long.fromValue(r.version)).unsigned=!1:typeof r.version=="string"?i.version=parseInt(r.version,10):typeof r.version=="number"?i.version=r.version:typeof r.version=="object"&&(i.version=new l.LongBits(r.version.low>>>0,r.version.high>>>0).toNumber())),i},o.toObject=function(r,i){i||(i={});var a={};if(i.defaults)if(a.domain="",l.Long){var c=new l.Long(0,0,!1);a.version=i.longs===String?c.toString():i.longs===Number?c.toNumber():c}else a.version=i.longs===String?"0":0;return r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.version!=null&&r.hasOwnProperty("version")&&(typeof r.version=="number"?a.version=i.longs===String?String(r.version):r.version:a.version=i.longs===String?l.Long.prototype.toString.call(r.version):i.longs===Number?new l.LongBits(r.version.low>>>0,r.version.high>>>0).toNumber():r.version),a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.OperatorSetIdProto"},o})(),d.OperatorStatus=(function(){var o={},r=Object.create(o);return r[o[0]="EXPERIMENTAL"]=0,r[o[1]="STABLE"]=1,r})(),d.FunctionProto=(function(){function o(r){if(this.input=[],this.output=[],this.attribute=[],this.attributeProto=[],this.node=[],this.opsetImport=[],r)for(var i=Object.keys(r),a=0;a<i.length;++a)r[i[a]]!=null&&(this[i[a]]=r[i[a]])}return o.prototype.name="",o.prototype.input=l.emptyArray,o.prototype.output=l.emptyArray,o.prototype.attribute=l.emptyArray,o.prototype.attributeProto=l.emptyArray,o.prototype.node=l.emptyArray,o.prototype.docString="",o.prototype.opsetImport=l.emptyArray,o.prototype.domain="",o.create=function(r){return new o(r)},o.encode=function(r,i){if(i||(i=u.create()),r.name!=null&&Object.hasOwnProperty.call(r,"name")&&i.uint32(10).string(r.name),r.input!=null&&r.input.length)for(var a=0;a<r.input.length;++a)i.uint32(34).string(r.input[a]);if(r.output!=null&&r.output.length)for(var a=0;a<r.output.length;++a)i.uint32(42).string(r.output[a]);if(r.attribute!=null&&r.attribute.length)for(var a=0;a<r.attribute.length;++a)i.uint32(50).string(r.attribute[a]);if(r.node!=null&&r.node.length)for(var a=0;a<r.node.length;++a)p.onnx.NodeProto.encode(r.node[a],i.uint32(58).fork()).ldelim();if(r.docString!=null&&Object.hasOwnProperty.call(r,"docString")&&i.uint32(66).string(r.docString),r.opsetImport!=null&&r.opsetImport.length)for(var a=0;a<r.opsetImport.length;++a)p.onnx.OperatorSetIdProto.encode(r.opsetImport[a],i.uint32(74).fork()).ldelim();if(r.domain!=null&&Object.hasOwnProperty.call(r,"domain")&&i.uint32(82).string(r.domain),r.attributeProto!=null&&r.attributeProto.length)for(var a=0;a<r.attributeProto.length;++a)p.onnx.AttributeProto.encode(r.attributeProto[a],i.uint32(90).fork()).ldelim();return i},o.encodeDelimited=function(r,i){return this.encode(r,i).ldelim()},o.decode=function(r,i){r instanceof s||(r=s.create(r));for(var a=i===void 0?r.len:r.pos+i,c=new p.onnx.FunctionProto;r.pos<a;){var h=r.uint32();switch(h>>>3){case 1:{c.name=r.string();break}case 4:{c.input&&c.input.length||(c.input=[]),c.input.push(r.string());break}case 5:{c.output&&c.output.length||(c.output=[]),c.output.push(r.string());break}case 6:{c.attribute&&c.attribute.length||(c.attribute=[]),c.attribute.push(r.string());break}case 11:{c.attributeProto&&c.attributeProto.length||(c.attributeProto=[]),c.attributeProto.push(p.onnx.AttributeProto.decode(r,r.uint32()));break}case 7:{c.node&&c.node.length||(c.node=[]),c.node.push(p.onnx.NodeProto.decode(r,r.uint32()));break}case 8:{c.docString=r.string();break}case 9:{c.opsetImport&&c.opsetImport.length||(c.opsetImport=[]),c.opsetImport.push(p.onnx.OperatorSetIdProto.decode(r,r.uint32()));break}case 10:{c.domain=r.string();break}default:r.skipType(h&7);break}}return c},o.decodeDelimited=function(r){return r instanceof s||(r=new s(r)),this.decode(r,r.uint32())},o.verify=function(r){if(typeof r!="object"||r===null)return"object expected";if(r.name!=null&&r.hasOwnProperty("name")&&!l.isString(r.name))return"name: string expected";if(r.input!=null&&r.hasOwnProperty("input")){if(!Array.isArray(r.input))return"input: array expected";for(var i=0;i<r.input.length;++i)if(!l.isString(r.input[i]))return"input: string[] expected"}if(r.output!=null&&r.hasOwnProperty("output")){if(!Array.isArray(r.output))return"output: array expected";for(var i=0;i<r.output.length;++i)if(!l.isString(r.output[i]))return"output: string[] expected"}if(r.attribute!=null&&r.hasOwnProperty("attribute")){if(!Array.isArray(r.attribute))return"attribute: array expected";for(var i=0;i<r.attribute.length;++i)if(!l.isString(r.attribute[i]))return"attribute: string[] expected"}if(r.attributeProto!=null&&r.hasOwnProperty("attributeProto")){if(!Array.isArray(r.attributeProto))return"attributeProto: array expected";for(var i=0;i<r.attributeProto.length;++i){var a=p.onnx.AttributeProto.verify(r.attributeProto[i]);if(a)return"attributeProto."+a}}if(r.node!=null&&r.hasOwnProperty("node")){if(!Array.isArray(r.node))return"node: array expected";for(var i=0;i<r.node.length;++i){var a=p.onnx.NodeProto.verify(r.node[i]);if(a)return"node."+a}}if(r.docString!=null&&r.hasOwnProperty("docString")&&!l.isString(r.docString))return"docString: string expected";if(r.opsetImport!=null&&r.hasOwnProperty("opsetImport")){if(!Array.isArray(r.opsetImport))return"opsetImport: array expected";for(var i=0;i<r.opsetImport.length;++i){var a=p.onnx.OperatorSetIdProto.verify(r.opsetImport[i]);if(a)return"opsetImport."+a}}return r.domain!=null&&r.hasOwnProperty("domain")&&!l.isString(r.domain)?"domain: string expected":null},o.fromObject=function(r){if(r instanceof p.onnx.FunctionProto)return r;var i=new p.onnx.FunctionProto;if(r.name!=null&&(i.name=String(r.name)),r.input){if(!Array.isArray(r.input))throw TypeError(".onnx.FunctionProto.input: array expected");i.input=[];for(var a=0;a<r.input.length;++a)i.input[a]=String(r.input[a])}if(r.output){if(!Array.isArray(r.output))throw TypeError(".onnx.FunctionProto.output: array expected");i.output=[];for(var a=0;a<r.output.length;++a)i.output[a]=String(r.output[a])}if(r.attribute){if(!Array.isArray(r.attribute))throw TypeError(".onnx.FunctionProto.attribute: array expected");i.attribute=[];for(var a=0;a<r.attribute.length;++a)i.attribute[a]=String(r.attribute[a])}if(r.attributeProto){if(!Array.isArray(r.attributeProto))throw TypeError(".onnx.FunctionProto.attributeProto: array expected");i.attributeProto=[];for(var a=0;a<r.attributeProto.length;++a){if(typeof r.attributeProto[a]!="object")throw TypeError(".onnx.FunctionProto.attributeProto: object expected");i.attributeProto[a]=p.onnx.AttributeProto.fromObject(r.attributeProto[a])}}if(r.node){if(!Array.isArray(r.node))throw TypeError(".onnx.FunctionProto.node: array expected");i.node=[];for(var a=0;a<r.node.length;++a){if(typeof r.node[a]!="object")throw TypeError(".onnx.FunctionProto.node: object expected");i.node[a]=p.onnx.NodeProto.fromObject(r.node[a])}}if(r.docString!=null&&(i.docString=String(r.docString)),r.opsetImport){if(!Array.isArray(r.opsetImport))throw TypeError(".onnx.FunctionProto.opsetImport: array expected");i.opsetImport=[];for(var a=0;a<r.opsetImport.length;++a){if(typeof r.opsetImport[a]!="object")throw TypeError(".onnx.FunctionProto.opsetImport: object expected");i.opsetImport[a]=p.onnx.OperatorSetIdProto.fromObject(r.opsetImport[a])}}return r.domain!=null&&(i.domain=String(r.domain)),i},o.toObject=function(r,i){i||(i={});var a={};if((i.arrays||i.defaults)&&(a.input=[],a.output=[],a.attribute=[],a.node=[],a.opsetImport=[],a.attributeProto=[]),i.defaults&&(a.name="",a.docString="",a.domain=""),r.name!=null&&r.hasOwnProperty("name")&&(a.name=r.name),r.input&&r.input.length){a.input=[];for(var c=0;c<r.input.length;++c)a.input[c]=r.input[c]}if(r.output&&r.output.length){a.output=[];for(var c=0;c<r.output.length;++c)a.output[c]=r.output[c]}if(r.attribute&&r.attribute.length){a.attribute=[];for(var c=0;c<r.attribute.length;++c)a.attribute[c]=r.attribute[c]}if(r.node&&r.node.length){a.node=[];for(var c=0;c<r.node.length;++c)a.node[c]=p.onnx.NodeProto.toObject(r.node[c],i)}if(r.docString!=null&&r.hasOwnProperty("docString")&&(a.docString=r.docString),r.opsetImport&&r.opsetImport.length){a.opsetImport=[];for(var c=0;c<r.opsetImport.length;++c)a.opsetImport[c]=p.onnx.OperatorSetIdProto.toObject(r.opsetImport[c],i)}if(r.domain!=null&&r.hasOwnProperty("domain")&&(a.domain=r.domain),r.attributeProto&&r.attributeProto.length){a.attributeProto=[];for(var c=0;c<r.attributeProto.length;++c)a.attributeProto[c]=p.onnx.AttributeProto.toObject(r.attributeProto[c],i)}return a},o.prototype.toJSON=function(){return this.constructor.toObject(this,n.util.toJSONOptions)},o.getTypeUrl=function(r){return r===void 0&&(r="type.googleapis.com"),r+"/onnx.FunctionProto"},o})(),d})(),t.exports=p});function vy(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function As(e){return new TextDecoder().decode(e)}var Re,Un,sp,Vt,wy,dt,Lt,ge,ks,qi,ti,ri,ke=k(()=>{"use strict";Ab(),Re=ce(oi()),yn(),Un=class{static arraysEqual(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}},sp=class{static preprocessInputShapes(e,t){let n=e.length===1?[1,e[0]]:e,s=t.length===1?[t[0],1]:t;return[n,s]}static postprocessOutputShape(e,t,n){t===1&&e.splice(e.length-2,1),n===1&&e.pop()}static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Vt=class qn{static calcShape(t,n,s=!1){let u=t.length,l=n.length;if(u===0)return n;if(l===0)return t;let p=Math.max(t.length,n.length),d=new Array(p);if(s){if(u<2||l<2)return;let o=sp.calcMatMulShape([t[u-2],t[u-1]],[n[l-2],n[l-1]]);if(o===void 0)return;[d[p-2],d[p-1]]=o}for(let o=s?3:1;o<=p;o++){let r=u-o<0?1:t[u-o],i=l-o<0?1:n[l-o];if(r!==i&&r>1&&i>1)return;d[p-o]=Math.max(r,i)}return d}static index(t,n){let s=new Array(n.length);return qn.fillIndex(t,n,s),s}static fillIndex(t,n,s){let u=t.length-n.length;for(let l=0;l<n.length;l++)s[l]=t[u+l]%n[l]}static calc(t,n,s,u,l){let p=qn.calcShape(t.dims,n.dims);if(p){if(u&&!ge.areEqual(p,t.dims))return;let d=ge.size(p),o=u?t:new ct(p,l||t.type);if(p.length===0)o.set([],s(t.get([]),n.get([])));else{let r=new Array(p.length),i=new Array(t.dims.length),a=new Array(n.dims.length),c=0,h=0,m=!1,b=!1;t.dims.length===0&&(c=t.get([]),m=!0),n.dims.length===0&&(h=n.get([]),b=!0);let x;for(let w=0;w<d;w++){x=w;for(let _=p.length-1;_>=0;_--)r[_]=x%p[_],x=Math.floor(x/p[_]);m||(qn.fillIndex(r,t.dims,i),c=t.get(i)),b||(qn.fillIndex(r,n.dims,a),h=n.get(a)),o.set(r,s(c,h))}}return o}}static isValidBroadcast(t,n){let s=t.length,u=n.length;if(s>u)return!1;for(let l=1;l<=s;l++)if(t[s-l]!==1&&t[s-l]!==n[u-l])return!1;return!0}static getBroadcastDims(t,n){let s=t.length,u=[];for(let l=0;l<s;l++){let p=s-1-l,d=t[p]||1;(n[n.length-1-l]||1)>1&&d===1&&u.unshift(p)}return u}},wy=class{static getShapeOfGemmResult(e,t,n,s,u){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let l,p,d;t?(l=e[1],p=e[0]):(l=e[0],p=e[1]);let o=-1;if(s?(d=n[0],o=1):(d=n[1],o=0),n[o]!==p)throw new Error("dimension mismatch");if(l<=0||d<=0||p<=0)throw new Error("invalid shape specified");if(u&&!Vt.isValidBroadcast(u,[l,d]))throw new Error("gemm: invalid bias shape for broadcast");return[l,d,p]}},dt=class Ds{static tensorDataTypeFromProto(t){switch(t){case Re.onnx.TensorProto.DataType.INT8:return"int8";case Re.onnx.TensorProto.DataType.UINT8:return"uint8";case Re.onnx.TensorProto.DataType.BOOL:return"bool";case Re.onnx.TensorProto.DataType.INT16:return"int16";case Re.onnx.TensorProto.DataType.UINT16:return"uint16";case Re.onnx.TensorProto.DataType.INT32:return"int32";case Re.onnx.TensorProto.DataType.UINT32:return"uint32";case Re.onnx.TensorProto.DataType.FLOAT:return"float32";case Re.onnx.TensorProto.DataType.DOUBLE:return"float64";case Re.onnx.TensorProto.DataType.STRING:return"string";case Re.onnx.TensorProto.DataType.INT64:return"int32";case Re.onnx.TensorProto.DataType.UINT64:return"uint32";default:throw new Error(`unsupported data type: ${Re.onnx.TensorProto.DataType[t]}`)}}static tensorDataTypeStringToEnum(t){switch(t){case"int8":return Re.onnx.TensorProto.DataType.INT8;case"uint8":return Re.onnx.TensorProto.DataType.UINT8;case"bool":return Re.onnx.TensorProto.DataType.BOOL;case"int16":return Re.onnx.TensorProto.DataType.INT16;case"uint16":return Re.onnx.TensorProto.DataType.UINT16;case"int32":return Re.onnx.TensorProto.DataType.INT32;case"uint32":return Re.onnx.TensorProto.DataType.UINT32;case"float32":return Re.onnx.TensorProto.DataType.FLOAT;case"float64":return Re.onnx.TensorProto.DataType.DOUBLE;case"string":return Re.onnx.TensorProto.DataType.STRING;case"int64":return Re.onnx.TensorProto.DataType.INT64;case"uint64":return Re.onnx.TensorProto.DataType.UINT64;default:throw new Error(`unsupported data type: ${t}`)}}static tensorDimsFromProto(t){return t.map(n=>Xr.isLong(n)?n.toNumber():n)}static tensorValueTypeFromProto(t){return{tensorType:Ds.tensorDataTypeFromProto(t.elemType),shape:{dims:Ds.tensorDimsFromProto(t.shape.dim.map(n=>n.dimValue))}}}static tensorDimsFromORTFormat(t){let n=[];for(let s=0;s<t.dimsLength();s++)n.push(Lt.longToNumber(t.dims(s)));return n}static tensorAttributesFromORTFormat(t){let n=[];for(let s=0;s<t.attributesLength();s++)n.push(t.attributes(s));return n}},Lt=class{static longToNumber(e){return Xr.isLong(e)?e.toNumber():typeof e=="bigint"?Number(e):e}static isLong(e){return Xr.isLong(e)||typeof e=="bigint"}},ge=class ur{static size(t){return ur.getSizeFromDimensionRange(t,0,t.length)}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return ur.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return ur.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,s){let u=1;for(let l=n;l<s;l++){if(t[l]<=0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains 0 or negative values in them.");u*=t[l]}return u}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let s=new Array(n);s[n-1]=1,s[n-2]=t[n-1];for(let u=n-3;u>=0;--u)s[u]=s[u+1]*t[u+1];return s}static transpose(t){return t.slice().reverse()}static indicesToOffset(t,n,s){s===void 0&&(s=t.length);let u=0;for(let l=0;l<s;++l)u+=n[l]*t[l];return u}static offsetToIndices(t,n){let s=n.length;if(s===0)return[];if(s===1)return[t*n[0]];let u=new Array(n.length);for(let l=0;l<u.length-1;++l)u[l]=Math.floor(t/n[l]),t-=u[l]*n[l];return u[u.length-1]=t,u}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(s=>this.normalizeAxis(s,n))}static incrementIndex(t,n,s){if(n.length===0||t.length===0)throw new Error("Index incrementing unsupported for scalar Tensor");if(s===void 0)s=n.length;else if(s<=0||s>n.length)throw new Error("Incorrect axis to increment on");for(let u=s-1;u>=0&&(t[u]++,!(t[u]<n[u]));--u)t[u]=0}static calculateReshapedDims(t,n){if(n.length===0){if(t.length===0||ur.size(t)===1)return[];throw new Error("cannot reshape to a scalar Tensor")}let s=n.length,u=new Array(s),l=-1,p=1;for(let o=0;o<s;o++){if(n[o]<-1)throw new Error("a dimension in shape hints cannot be less than -1");if(n[o]===-1){if(l!==-1)throw new Error("at most one dimension in shape hints can be -1");l=o}else{if(n[o]===0){if(o>=t.length)throw new Error("the dimension with value zero exceeds the dimension size of the input tensor");u[o]=t[o]}else u[o]=n[o];p*=u[o]}}let d=ur.size(t);if(l!==-1){if(d%p!==0)throw new Error(`the input tensor cannot be reshaped to the requested shape. Input shape: [${t}] Output shape: [${n}]`);u[l]=d/p}else if(p!==d)throw new Error("reshapedDims and originalDims don't have matching sizes");return u}static sortBasedOnPerm(t,n){return n?n.map(s=>t[s]):t.slice().reverse()}static padShape(t,n){let s=t.length;return t.map((u,l)=>u+n[l]+n[l+s])}static areEqual(t,n){return t.length!==n.length?!1:t.every((s,u)=>s===n[u])}static validateDimsAndCalcSize(t){if(t.length>6)throw new TypeError("Only rank 0 to 6 is supported for tensor shape.");let n=1;for(let s of t){if(!Number.isInteger(s))throw new TypeError(`Invalid shape: ${s} is not an integer`);if(s<0||s>2147483647)throw new TypeError(`Invalid shape: length ${s} is not allowed`);n*=s}return n}static flattenShape(t,n){n<0&&(n+=t.length);let s=t.reduce((l,p)=>l*p,1),u=t.slice(n).reduce((l,p)=>l*p,1);return[s/u,u]}static squeezeShape(t,n){let s=new Array;n=ur.normalizeAxes(n,t.length);for(let u=0;u<t.length;u++){let l=n.indexOf(u)>=0;if(l&&t[u]!==1)throw new Error("squeeze an axis of size different than 1");(n.length===0&&t[u]>1||n.length>0&&!l)&&s.push(t[u])}return s}static unsqueezeShape(t,n){let s=new Array(t.length+n.length);s.fill(0);for(let l=0;l<n.length;l++){let p=ur.normalizeAxis(n[l],s.length);if(p>=s.length)throw new Error("'axes' has an out of range axis");if(s[p]!==0)throw new Error("'axes' has a duplicate axis");s[p]=1}let u=0;for(let l=0;l<s.length;l++)s[l]===0&&(s[l]=t[u++]);if(u!==t.length)throw new Error("the unsqueezed dimension could not be established");return s}},ks=class xy{static splitShape(t,n,s,u){if(s.length===0){if(!u)throw new Error("need to know number of outputs when the 'split' attribute is not specified");xy.determineSplit(t[n],u,s)}let l=[],p=[0];for(let d=0;d<s.length;++d){d!==0&&p.push(p[d-1]+s[d-1]);let o=t.slice();o[n]=s[d],l.push(o)}return[l,p]}static determineSplit(t,n,s){if(t%n!==0)throw new Error("cannot split tensor to equal sized parts");for(let u=0;u<n;++u)s.push(t/n)}},qi=class lr{static adjustPoolAttributes(t,n,s,u,l,p){if(!t&&s.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let d=0;d<n.length-2;d++)d>=s.length?s.push(n[d+2]):s[d]=n[d+2];for(let d=0;d<s.length;d++)if(d<u.length){if(u[d]<0)throw new Error("strides should be greater than or equal to 1")}else u.push(1);for(let d=0;d<s.length;d++)if(d<l.length){if(l[d]<0)throw new Error("dilations should be greater than or equal to 1")}else l.push(1);for(let d=0;d<s.length*2;d++)if(d<p.length){if(p[d]<0)throw new Error("pad should be greater than or equal to 1")}else p.push(0);for(let d=0;d<s.length;d++){if(s[d]<=0)throw new Error("kernel shapes need to be greater than 0");if(p[d]>=s[d]||p[d+s.length]>=s[d])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,s,u,l,p){if(p){if(l.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(u.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let d=0;d<t.length-2;d++)lr.adjustPadAndReturnShape(t[d+2],n[d],s[d],u[d],l,d,d+t.length-2,p)}}static computePoolOutputShape(t,n,s,u,l,p,d,o=0){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let r=[n[0],n[1]];return lr.computeShapeHelper(t,n,r,s,u,l,p,d,o),r}static computeConvOutputShape(t,n,s,u,l,p,d){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let o=[t[0],n[0]];return lr.computeShapeHelper(!1,t,o,s,u,l,p,d),o}static computeShapeHelper(t,n,s,u,l,p,d,o,r=0){if(t)for(let i=0;i<n.length-2;i++)s.push(1);else for(let i=0;i<n.length-2;i++)s.push(lr.adjustPadAndReturnShape(n[i+2],u[i],l[i],p[i],d,i,i+n.length-2,o,r))}static computeOutputSize(t,n,s,u,l){let p=Math.floor(t/n)+1;return l===1&&(p=Math.ceil(t/n)+1,(p-1)*n>=s+u&&(p-=1)),p}static adjustPadAndReturnShape(t,n,s,u,l,p,d,o,r=0){let i=s*(u-1)+1;if(o&&o!=="NOTSET")switch(o){case"VALID":return l[p]=0,l[d]=0,lr.computeOutputSize(t-i,n,t,0,r);case"SAME_LOWER":case"SAME_UPPER":if(s!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let a=(Math.floor((t+n-1)/n)-1)*n+u-t;return l[p]=Math.floor(o==="SAME_LOWER"?(a+1)/2:a/2),l[d]=a-l[p],lr.computeOutputSize(t+l[p]+l[d]-i,n,t,l[p],r)}default:throw new Error("Unsupported AutoPad type")}else return lr.computeOutputSize(t+l[p]+l[d]-i,n,t,l[p],r)}},ti=-34028234663852886e22,ri=34028234663852886e22});function c3(e){switch(e){case"bool":case"int8":case"uint8":return 1;case"int16":case"uint16":return 2;case"int32":case"uint32":case"float32":return 4;case"float64":return 8;default:throw new Error(`cannot calculate sizeof() on type ${e}`)}}function up(e){switch(e){case _e.onnx.TensorProto.DataType.UINT8:case _e.onnx.TensorProto.DataType.INT8:case _e.onnx.TensorProto.DataType.BOOL:return 1;case _e.onnx.TensorProto.DataType.UINT16:case _e.onnx.TensorProto.DataType.INT16:return 2;case _e.onnx.TensorProto.DataType.FLOAT:case _e.onnx.TensorProto.DataType.INT32:case _e.onnx.TensorProto.DataType.UINT32:return 4;case _e.onnx.TensorProto.DataType.INT64:case _e.onnx.TensorProto.DataType.DOUBLE:case _e.onnx.TensorProto.DataType.UINT64:return 8;default:throw new Error(`cannot calculate sizeof() on type ${_e.onnx.TensorProto.DataType[e]}`)}}function h3(e,t){return new($y(t))(e)}function $y(e){switch(e){case"bool":case"uint8":return Uint8Array;case"int8":return Int8Array;case"int16":return Int16Array;case"uint16":return Uint16Array;case"int32":return Int32Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"float32":return Float32Array;case"float64":return Float64Array;default:throw new Error("unspecified error")}}function Cs(e,t){if(t===_e.onnx.TensorProto.DataType.INT64||t===ji.TensorDataType.INT64){if(e.greaterThanOrEqual(2147483648)||e.lessThan(-2147483648))throw new TypeError("int64 is not supported")}else if(t===_e.onnx.TensorProto.DataType.UINT32||t===ji.TensorDataType.UINT32||t===_e.onnx.TensorProto.DataType.UINT64||t===ji.TensorDataType.UINT64){if(e.greaterThanOrEqual(4294967296)||e.lessThan(0))throw new TypeError("uint64 is not supported")}else throw new TypeError(`not a LONG type: ${_e.onnx.TensorProto.DataType[t]}`);return e.toNumber()}function lp(e,t,n){switch(t){case _e.onnx.TensorProto.DataType.BOOL:case _e.onnx.TensorProto.DataType.UINT8:return e.getUint8(n);case _e.onnx.TensorProto.DataType.INT8:return e.getInt8(n);case _e.onnx.TensorProto.DataType.UINT16:return e.getUint16(n,!0);case _e.onnx.TensorProto.DataType.INT16:return e.getInt16(n,!0);case _e.onnx.TensorProto.DataType.FLOAT:return e.getFloat32(n,!0);case _e.onnx.TensorProto.DataType.INT32:return e.getInt32(n,!0);case _e.onnx.TensorProto.DataType.UINT32:return e.getUint32(n,!0);case _e.onnx.TensorProto.DataType.INT64:return Cs(Xr.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!1),t);case _e.onnx.TensorProto.DataType.DOUBLE:return e.getFloat64(n,!0);case _e.onnx.TensorProto.DataType.UINT64:return Cs(Xr.fromBits(e.getUint32(n,!0),e.getUint32(n+4,!0),!0),t);default:throw new Error(`cannot read from DataView for type ${_e.onnx.TensorProto.DataType[t]}`)}}var dp,_e,ct,yn=k(()=>{"use strict";dp=ce(gT()),Ab(),io(),_e=ce(oi()),ke(),ct=class Fi{constructor(t,n,s,u,l,p=dp.Guid.create()){this.dims=t,this.type=n,this.dataProvider=s,this.asyncDataProvider=u,this.cache=l,this.dataId=p,this.size=ge.validateDimsAndCalcSize(t);let d=this.size,o=s===void 0&&u===void 0&&l===void 0;if(l!==void 0&&l.length!==d)throw new RangeError("Input dims doesn't match data length.");if(n==="string"){if(l!==void 0&&(!Array.isArray(l)||!l.every(r=>typeof r=="string")))throw new TypeError("cache should be a string array");o&&(this.cache=new Array(d))}else{if(l!==void 0){let r=$y(n);if(!(l instanceof r))throw new TypeError(`cache should be type ${r.name}`)}if(o){let r=new ArrayBuffer(d*c3(n));this.cache=h3(r,n)}}}get data(){if(this.cache===void 0){let t=this.dataProvider(this.dataId);if(t.length!==this.size)throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");this.cache=t}return this.cache}get stringData(){if(this.type!=="string")throw new TypeError("data type is not string");return this.data}get integerData(){switch(this.type){case"uint8":case"int8":case"uint16":case"int16":case"int32":case"uint32":case"bool":return this.data;default:throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)")}}get floatData(){switch(this.type){case"float32":case"float64":return this.data;default:throw new TypeError("data type is not float (float32, float64)")}}get numberData(){if(this.type!=="string")return this.data;throw new TypeError("type cannot be non-number (string)")}get(t){return this.data[ge.indicesToOffset(t,this.strides)]}set(t,n){this.data[ge.indicesToOffset(t,this.strides)]=n}async getData(){return this.cache===void 0&&(this.cache=await this.asyncDataProvider(this.dataId)),this.cache}get strides(){return this._strides||(this._strides=ge.computeStrides(this.dims)),this._strides}static fromProto(t){if(!t)throw new Error("cannot construct Value from an empty tensor");let n=dt.tensorDataTypeFromProto(t.dataType),s=dt.tensorDimsFromProto(t.dims),u=new Fi(s,n);if(n==="string")t.stringData.forEach((l,p)=>{u.data[p]=As(l)});else if(t.rawData&&typeof t.rawData.byteLength=="number"&&t.rawData.byteLength>0){let l=u.data,p=new DataView(t.rawData.buffer,t.rawData.byteOffset,t.rawData.byteLength),d=up(t.dataType),o=t.rawData.byteLength/d;if(t.rawData.byteLength%d!==0)throw new Error("invalid buffer length");if(l.length!==o)throw new Error("buffer length mismatch");for(let r=0;r<o;r++){let i=lp(p,t.dataType,r*d);l[r]=i}}else{let l;switch(t.dataType){case _e.onnx.TensorProto.DataType.FLOAT:l=t.floatData;break;case _e.onnx.TensorProto.DataType.INT32:case _e.onnx.TensorProto.DataType.INT16:case _e.onnx.TensorProto.DataType.UINT16:case _e.onnx.TensorProto.DataType.INT8:case _e.onnx.TensorProto.DataType.UINT8:case _e.onnx.TensorProto.DataType.BOOL:l=t.int32Data;break;case _e.onnx.TensorProto.DataType.INT64:l=t.int64Data;break;case _e.onnx.TensorProto.DataType.DOUBLE:l=t.doubleData;break;case _e.onnx.TensorProto.DataType.UINT32:case _e.onnx.TensorProto.DataType.UINT64:l=t.uint64Data;break;default:throw new Error("unspecific error")}if(l==null)throw new Error("failed to populate data from a tensorproto value");let p=u.data;if(p.length!==l.length)throw new Error("array length mismatch");for(let d=0;d<l.length;d++){let o=l[d];Xr.isLong(o)?p[d]=Cs(o,t.dataType):p[d]=o}}return u}static fromData(t,n,s){return new Fi(n,s,void 0,void 0,t)}static fromOrtTensor(t){if(!t)throw new Error("cannot construct Value from an empty tensor");let n=dt.tensorDimsFromORTFormat(t),s=dt.tensorDataTypeFromProto(t.dataType()),u=new Fi(n,s);if(s==="string")for(let l=0;l<t.stringDataLength();l++)u.data[l]=t.stringData(l);else if(t.rawDataArray()&&typeof t.rawDataLength()=="number"&&t.rawDataLength()>0){let l=u.data,p=new DataView(t.rawDataArray().buffer,t.rawDataArray().byteOffset,t.rawDataLength()),d=up(t.dataType()),o=t.rawDataLength()/d;if(t.rawDataLength()%d!==0)throw new Error("invalid buffer length");if(l.length!==o)throw new Error("buffer length mismatch");for(let r=0;r<o;r++){let i=lp(p,t.dataType(),r*d);l[r]=i}}return u}}});function Se(e){return e===1?Ty:Sy}function f3(e){let t=Se(e);return`${t.version}
      precision highp float;
      ${t.attribute} vec3 position;
      ${t.attribute} vec2 textureCoord;

      ${t.varyingVertex} vec2 TexCoords;

      void main()
      {
          gl_Position = vec4(position, 1.0);
          TexCoords = textureCoord;
      }`}function m3(e){let t=Se(e);return`${t.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${t.varyingFrag} vec2 TexCoords;
    ${t.outputDeclaration}
    const vec2 halfCR = vec2(0.5, 0.5);

    // Custom vector types to handle higher dimenalities.
    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    `}function g3(e,t){let n=Se(e);return`
  void main() {
    int indices[${t}];
    toVec(TexCoords, indices);
    vec4 result = vec4(process(indices));
    ${n.output} = result;
  }
  `}var Ty,Sy,Le=k(()=>{"use strict";Ty={version:"",attribute:"attribute",varyingVertex:"varying",varyingFrag:"varying",texture2D:"texture2D",output:"gl_FragColor",outputDeclaration:""},Sy={version:"#version 300 es",attribute:"in",varyingVertex:"out",varyingFrag:"in",texture2D:"texture",output:"outputColor",outputDeclaration:"out vec4 outputColor;"}}),Oe=k(()=>{"use strict"});async function pp(e,t=s=>0,n){return new Promise((s,u)=>{let l=0,p=()=>{if(e()){s();return}l++;let d=t(l);setTimeout(p,d)};p()})}function Uo(e){return vy(typeof e<"u"&&e.length!==0,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)}function b3(e){return vy(typeof e<"u"&&e.length!==0,()=>"empty string found for sampler name"),"get"+e.charAt(0).toUpperCase()+e.slice(1)+"AtOutCoords"}function In(e,t){let n=JSON.parse(JSON.stringify(e));return n=t,n}function On(e,t){return t.map(n=>e[n]).join(", ")}function cr(e){if(e<=1)return"int";if(e===2)return"ivec2";if(e===3)return"ivec3";if(e===4)return"ivec4";if(e===5)return"ivec5";if(e===6)return"ivec6";throw Error(`GPU for rank ${e} is not yet supported`)}function mn(e=6){return["x","y","z","w","u","v"].slice(0,e)}var Zt=k(()=>{"use strict";ke()});function y3(e,t){return mn(t).map(n=>`${e}.${n}`)}function Tu(e,t){return t===1?[e]:y3(e,t)}function ai(){return`
    float getChannel(vec4 frag, int dim) {
      int modCoord = imod(dim, 2);
      return modCoord == 0 ? frag.r : frag.g;
    }

    float getChannel(vec4 frag, vec2 innerDims) {
      vec2 modCoord = mod(innerDims, 2.);
      return modCoord.x == 0. ?
        (modCoord.y == 0. ? frag.r : frag.g) :
        (modCoord.y == 0. ? frag.b : frag.a);
    }
  `}var _n=k(()=>{"use strict";Zt()});function _3(e,t,n){if(e===0)return"false";if(e===1)return`rc > ${t[0]}`;let s="";for(let u=e-2;u<e;u++)s+=`${n[u]} >= ${t[u-e+2]}`,u<e-1&&(s+="||");return s}function v3(e,t){let n=e.length;if(n===0)return"getA(), 0, 0, 0";if(n===1)return`getA(rc),
            rc + 1 >= ${e[0]} ? 0. : getA(rc + 1),
            0, 0`;let s="r, c",u="r, cp1",l="rp1, c",p="rp1, cp1",d="";if(n>2)for(let o=0;o<n-2;++o)d=d+`${t[o]},`;return`getA(${d}${s}),
          rEdge ? 0. : getA(${d}${l}),
          cEdge ? 0. : getA(${d}${u}),
          rEdge || cEdge ? 0. : getA(${d}${p})`}function w3(e,t,n,s){return e===0||e===1?"":`
    int r = ${t[e-2]};
    int c = ${t[e-1]};
    int rp1 = ${t[e-2]} + 1;
    int cp1 = ${t[e-1]} + 1;
    bool rEdge = rp1 >= ${s};
    bool cEdge = cp1 >= ${n};
    `}var qo,cp,Iy,x3=k(()=>{"use strict";Le(),Oe(),Zt(),_n(),qo={name:"pack",inputNames:["A"],inputTypes:[1]},cp=(e,t)=>{let n=Se(e.session.backend.glContext.version),s=t.dims,u=s.length,l=t.dims.length,p=cr(l),d=Tu("rc",l),o=w3(l,d,s[s.length-2],s[s.length-1]),r;u===0?r=[1,1]:u===1?r=[s[0],1]:r=[s[l-1],s[l-2]];let i=_3(l,r,d),a=v3(s,d),c=`
        void main() {
          ${p} rc = getOutputCoords();

          if(${i}) {
            ${n.output} = vec4(0);
          } else {
            ${o}

            ${n.output} = vec4(${a});
          }
        }
      `;return{...qo,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:2},shaderSource:c}},Iy=(e,t)=>({...qo,get:()=>cp(e,t)})});function hp(e){if(e.length===0)return[1,1,1];let t=1;for(let n=0;n<e.length-2;++n)t*=e[n];return[t,e.length>1?e[e.length-2]:1,e[e.length-1]]}function $3(e,t){let n=!1;return e.length===0||t.length===0?n=!0:e.length<2||t.length<2?n=e[e.length-1]===t[t.length-1]:n=e[e.length-1]===t[t.length-1]&&e[e.length-2]===t[t.length-2],n}function T3(e){let t=ge.computeStrides(e),n=["b","r","c"],s="index";return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${t.map((u,l)=>{let p=`int ${n[l]} = ${s} / ${u}`,d=l===t.length-1?`int ${n[l+1]} = ${s} - ${n[l]} * ${u}`:`index -= ${n[l]} * ${u}`;return`${p}; ${d};`}).join("")}
      return ivec3(b, r, c);
    }
  `}function S3(e){let t=ge.computeStrides(e);return`
  int getFlattenedIndex(ivec3 coords) {
    // reverse y, z order
    return coords.x * ${t[0]} + coords.z * ${t[1]} + coords.y;
  }
`}var fp,mp,Oy,I3=k(()=>{"use strict";ke(),Le(),Oe(),_n(),fp=e=>({name:"Reshape (packed)",inputTypes:[2],inputNames:["A"],cacheHint:`${e}`}),mp=(e,t,n,s)=>{let u=t.dims,l=s,p="";for(let r=0;r<4;r++){let i="";switch(r){case 0:i="outputCoords = rc;";break;case 1:i="outputCoords = ivec3(rc.x, rc.y+1, rc.z);";break;case 2:i="outputCoords = ivec3(rc.x, rc.y, rc.z+1);";break;case 3:i="outputCoords = ivec3(rc.x, rc.y+1, rc.z+1);";break;default:throw new Error}p+=`
        ${i}
        ${r>0?"if(outputCoords.y < rows && outputCoords.z < cols){":""}
          int flattenedIndex = getFlattenedIndex(outputCoords);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flattenedIndex);
          vec2 innerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${r}] = getChannel(getA(inputRC.x, inputRC.y, inputRC.z), innerDims);

        ${r>0?"}":""}
      `}let d=Se(e.session.backend.glContext.version),o=`
      ${T3(u)}
      ${S3(l)}
      ${ai()}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.0);

        ivec3 outputCoords;
        int rows = ${l[2]};
        int cols = ${l[1]};

        ${p}
        ${d.output} = result;
      }
    `;return{...n,output:{dims:l,type:t.type,textureType:2},shaderSource:o,hasMain:!0}},Oy=(e,t,n)=>{let s=fp(n);return{...s,get:()=>mp(e,t,s,n)}}}),Ns,O3=k(()=>{"use strict";Le(),Oe(),Ns=(e,t)=>{let n=t.shape,s=Se(e.session.backend.glContext.version),u=`
    const float FLOAT_MAX = 1.70141184e38;
    const float FLOAT_MIN = 1.17549435e-38;

    bool isNaN(float val) {
      return (val < 1.0 || 0.0 < val || val == 0.0) ? false : true;
    }

    highp vec4 encodeAsUint8(highp float v) {
      if (isNaN(v)) {
        return vec4(255, 255, 255, 255);
      }

      highp float av = abs(v);

      if(av < FLOAT_MIN) {
        return vec4(0.0, 0.0, 0.0, 0.0);
      } else if(v > FLOAT_MAX) {
        return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
      } else if(v < -FLOAT_MAX) {
        return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
      }

      highp vec4 c = vec4(0,0,0,0);

      highp float e = floor(log2(av));
      highp float m = exp2(fract(log2(av))) - 1.0;

      c[2] = floor(128.0 * m);
      m -= c[2] / 128.0;
      c[1] = floor(32768.0 * m);
      m -= c[1] / 32768.0;
      c[0] = floor(8388608.0 * m);

      highp float ebias = e + 127.0;
      c[3] = floor(ebias / 2.0);
      ebias -= c[3] * 2.0;
      c[2] += floor(ebias) * 128.0;

      c[3] += 128.0 * step(0.0, -v);

      return c / 255.0;
    }

    void main() {
      float value = ${s.texture2D}(X,TexCoords).r;
      ${s.output} = encodeAsUint8(value);
    }`,l={name:"Uint8Encode",inputTypes:[0],inputNames:["X"],output:{dims:n,type:t.tensor.type,textureType:3},shaderSource:u,hasMain:!0};return e.executeProgram(l,[t.tensor])}});function E3(e,t){if(e===1)return"rc";let n="";for(let s=0;s<e;s++)n+=t[s],s<e-1&&(n+=",");return n}var Go,gp,Ey,P3=k(()=>{"use strict";Le(),Oe(),Zt(),_n(),Go={name:"unpack",inputNames:["A"],inputTypes:[2]},gp=(e,t)=>{let n=t.dims.length,s=Tu("rc",n),u=s.slice(-2),l=cr(n),p=ai(),d=t.dims.length===0?"":E3(n,s),o=n<=1?"rc":`vec2(${u.join(",")})`,r=Se(e.session.backend.glContext.version),i=`
    ${p}
    void main() {
      ${l} rc = getOutputCoords();

       // Sample the texture with the coords to get the rgba channel value.
       vec4 packedInput = getA(${d});

       ${r.output} = vec4(getChannel(packedInput, ${o}), 0, 0, 0);
     }
   `;return{...Go,hasMain:!0,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:i}},Ey=(e,t)=>({...Go,get:()=>gp(e,t)})}),Py,zs,Ay,Gi=k(()=>{"use strict";Ct(),Py=class{constructor(e,t=1){if(t===1)this.internalFormat=e.R32F,this.format=e.RED,this.textureType=e.FLOAT,this.channelSize=t;else if(t===4)this.internalFormat=e.RGBA32F,this.format=e.RGBA,this.textureType=e.FLOAT,this.channelSize=t;else throw new Error(`Invalid number of channels: ${t}`)}encode(e,t){let n,s;return e.constructor!==Float32Array&&(qe.warning("Encoder","data was not of type Float32; creating new Float32Array"),s=new Float32Array(e)),t*this.channelSize>e.length?(qe.warning("Encoder","Source data too small. Allocating larger array"),s=e,n=this.allocate(t*this.channelSize),s.forEach((u,l)=>n[l]=u)):(s=e,n=s),n}allocate(e){return new Float32Array(e*4)}decode(e,t){return this.channelSize===1?e.filter((n,s)=>s%4===0).subarray(0,t):e.subarray(0,t)}},zs=class{constructor(e,t=1,n){if(t!==1&&t!==4)throw new Error(`Invalid number of channels: ${t}`);this.internalFormat=e.RGBA,this.format=e.RGBA,this.channelSize=t,this.textureType=n||e.FLOAT}encode(e,t){let n=e;return this.channelSize===1&&(qe.verbose("Encoder","Exploding into a larger array"),n=this.allocate(t),e.forEach((s,u)=>n[u*4]=s)),n}allocate(e){return new Float32Array(e*4)}decode(e,t){return this.channelSize===1?e.filter((n,s)=>s%4===0).subarray(0,t):e.subarray(0,t)}},Ay=class{constructor(e,t=1){if(this.channelSize=4,t===1)this.internalFormat=e.ALPHA,this.format=e.ALPHA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else if(t===4)this.internalFormat=e.RGBA,this.format=e.RGBA,this.textureType=e.UNSIGNED_BYTE,this.channelSize=t;else throw new Error(`Invalid number of channels: ${t}`)}encode(e,t){return new Uint8Array(e.buffer,e.byteOffset,e.byteLength)}allocate(e){return new Uint8Array(e*this.channelSize)}decode(e,t){if(e instanceof Uint8Array)return e.subarray(0,t);throw new Error(`Invalid array type: ${e.constructor}`)}}}),Jn,ky,Rs,A3=k(()=>{"use strict";ke(),Oe(),Jn=(e,t,n)=>{let s=n===0||n===1?1:4,u=n===2,l=n===1||n===2,p=n===4?t.length-1:void 0,d=n===4?t.map((o,r)=>r===t.length-1?o*4:o):void 0;return Rs(e,t,s,d,{isPacked:u,reverseWH:l,breakAxis:p})},ky=(e,t,n)=>{let s=Jn(e,t,n);return[s.width,s.height]},Rs=(e,t,n=1,s,u)=>{let l=!!(u&&u.isPacked),[p,d]=e.computeTextureWH(l&&s||t,u),o=t.length,r=t.slice(0);if(o===0&&(r=[1]),n===1)s=t;else if(l){if(n!==4)throw new Error("a packed texture must be 4-channel");s=t,o>0&&(r[o-1]=Math.ceil(r[o-1]/2)),o>1&&(r[o-2]=Math.ceil(r[o-2]/2))}else if(!s)throw new Error("Unpacked shape is needed when using channels > 1");return{width:p,height:d,channels:n,isPacked:l,shape:r,strides:ge.computeStrides(r),unpackedShape:s,reversedWH:u&&u.reverseWH}}}),bp,Dy,k3=k(()=>{"use strict";Ct(),yn(),ke(),x3(),I3(),O3(),P3(),Gi(),A3(),Oe(),bp=(e,t)=>{let n=t.map(u=>`${u.unpackedShape.join(",")};${u.width}x${u.height}`).join("_"),s=e.name;return e.cacheHint&&(s+="["+e.cacheHint+"]"),s+=":"+n,s},Dy=class{constructor(e){this.session=e,this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map}calculateTextureWidthAndHeight(e,t){return ky(this.session.layoutStrategy,e,t)}executeProgram(e,t){if(t.length<e.inputNames.length)throw new Error(`Input size mustn't be less than ${e.inputNames.length}.`);if(e.inputNames.length!==e.inputTypes.length)throw new Error("input names size does not match input types");let n=[];for(let o=0;o<e.inputNames.length;++o)n[o]=this.getOrCreateTextureData(t[o],e.inputTypes[o]);let s=bp(e,n),u=this.session.programManager.getArtifact(s),l=u?u.programInfo:typeof e.get=="function"?e.get():e,p=Jn(this.session.layoutStrategy,l.output.dims,l.output.textureType),d=this.createTextureData(p,l.output.type);return u||(u=this.session.programManager.build(l,n,d),this.session.programManager.setArtifact(s,u)),this.runProgram(u,n,d),d}run(e,t){return this.executeProgram(e,t).tensor}runProgram(e,t,n){for(let s=0;s<t.length;++s)if(!!t[s].isPacked!=(e.programInfo.inputTypes[s]===2))throw new Error(`input[${s}] property packed inconsistent`);if(!!n.isPacked!=(e.programInfo.output.textureType===2))throw new Error("output property packed inconsistent");this.session.programManager.run(e,t,n)}getOrCreateTextureData(e,t){let n=this.getTextureData(e.dataId,t===2);if(!n&&(n=this.getTextureData(e.dataId,t!==2),n))return t===2?this.pack(n):this.unpack(n);if(!n){let s=Jn(this.session.layoutStrategy,e.dims,t);if(t===4){let u=e.dims;if(u.length===4){let l=[u[0],Math.ceil(u[1]*u[2]*u[3]/4)],p=Jn(this.session.layoutStrategy,l,t),d=e.numberData;if(u[1]*u[2]*u[3]%4!==0){let o=u[0],r=u[1]*u[2]*u[3],i=Math.ceil(r*1/4)*4,a=o*i;d=new Float32Array(a);for(let c=0;c<o;++c){let h=c*r,m=c*i+c%1*r;d.set(e.numberData.subarray(h,h+r),m)}}return this.createTextureData(p,e.type,d,e,1)}}if(t===2){let u=Rs(this.session.layoutStrategy,e.dims,1,[],{reverseWH:!0}),l=this.createTextureData(u,e.type,e.numberData,e,1);n=this.pack(l)}else n=this.createTextureData(s,e.type,e.numberData,e,1)}return n}createTextureDataFromLayoutBindTensor(e,t,n,s){return this.createTextureData(e,t,n,s,1)}createTextureData(e,t,n,s,u){qe.verbose("InferenceHandler",`Creating TextureData: layout:[${JSON.stringify(e)}]`);let l=this.session.textureManager.createTextureFromLayout(t,e,n,u);return this.createTextureDataFromTexture(e,t,l,s)}reshapeUnpacked(e,t){let n=this.getOrCreateTextureData(e,0),s={channels:n.channels,height:n.height,width:n.width,shape:t.length!==0?t:[1],strides:ge.computeStrides(t),unpackedShape:t};return this.createTextureDataFromTexture(s,e.type,n.texture).tensor}reshapePacked(e,t){let n=this.getOrCreateTextureData(e,2);if($3(e.dims,t)){let d={channels:n.channels,height:n.height,width:n.width,shape:t.length!==0?t:[1],strides:ge.computeStrides(t),unpackedShape:t,isPacked:!0};return this.createTextureDataFromTexture(d,e.type,n.texture).tensor}let s=hp(e.dims),u=hp(t),l=this.reshapePacked(e,s),p=this.run(Oy(this,l,u),[l]);return this.reshapePacked(p,t)}cast(e,t){let n=this.getOrCreateTextureData(e,0);return this.createTextureDataFromTexture(n,t,n.texture).tensor}createTextureDataFromTexture(e,t,n,s,u){let l={...e,tensor:s||new ct(e.unpackedShape,t,p=>this.readTexture(l),async p=>this.readTextureAsync(l),void 0,u),texture:n};return this.setTextureData(l.tensor.dataId,l,e.isPacked),l}getTextureData(e,t=!1){return this.session.isInitializer(e)?this.session.getTextureData(e,t):t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){this.session.isInitializer(e)?this.session.setTextureData(e,t,n):(n?this.packedTextureDataCache:this.unpackedTextureDataCache).set(e,t)}isTextureLayoutCached(e,t=!1){return!!this.getTextureData(e.dataId,t)}dispose(){this.session.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.session.textureManager.releaseTexture(e)),this.unpackedTextureDataCache=new Map}readTexture(e){return e.isPacked?this.readTexture(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTexture(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Ns(this,e))}async readTextureAsync(e){return e.isPacked?this.readTextureAsync(this.unpack(e)):this.session.backend.glContext.isFloat32DownloadSupported?this.session.textureManager.readTextureAsync(e,e.tensor.type,e.channels):this.session.textureManager.readUint8TextureAsFloat(Ns(this,e))}pack(e){return this.executeProgram(Iy(this,e.tensor),[e.tensor])}unpack(e){return this.executeProgram(Ey(this,e.tensor),[e.tensor])}}}),yp,Be,tt=k(()=>{"use strict";yp=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Be=e=>new yp(e)}),Ho,Cy,Ny,_p,vp,D3=k(()=>{"use strict";tt(),Le(),Oe(),Ho={name:"BatchNormalization",inputNames:["A","Scale","B","Mean","Variance"],inputTypes:[0,0,0,0,0]},Cy=(e,t,n)=>(vp(t),[e.run({...Ho,cacheHint:n.cacheKey,get:()=>_p(e,t,n)},t)]),Ny=e=>{let t=e.attributes.getFloat("epsilon",1e-5),n=e.attributes.getFloat("momentum",.9),s=e.attributes.getInt("spatial",1);return Be({epsilon:t,momentum:n,spatial:s})},_p=(e,t,n)=>{let s=Se(e.session.backend.glContext.version),u=t[0].dims.length,[l,p]=e.calculateTextureWidthAndHeight(t[1].dims,0),d=`
  float process(int[${u}] indices) {
    vec2 position = offsetToCoords(indices[1], ${l}, ${p});
    float scale = getColorAsFloat(${s.texture2D}(Scale, position));
    float mean = getColorAsFloat(${s.texture2D}(Mean, position));
    float variance = getColorAsFloat(${s.texture2D}(Variance, position));
    float b = getColorAsFloat(${s.texture2D}(B, position));

    return scale * ( (_A(indices) - mean) / sqrt(variance + float(${n.epsilon})) ) + b;
  }`;return{...Ho,output:{dims:t[0].dims,type:t[0].type,textureType:0},shaderSource:d}},vp=e=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs.");let t=e[0],n=e[1],s=e[2],u=e[3],l=e[4];if(t.dims.length<3||n.dims.length!==1||s.dims.length!==1||u.dims.length!==1||l.dims.length!==1)throw new Error("invalid input shape.");if(n.dims[0]!==t.dims[1]||s.dims[0]!==t.dims[1]||u.dims[0]!==t.dims[1]||l.dims[0]!==t.dims[1])throw new Error("invalid input shape.");if(t.type!=="float32"&&t.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||s.type!=="float32"&&s.type!=="float64"||u.type!=="float32"&&u.type!=="float64"||l.type!=="float32"&&l.type!=="float64")throw new Error("invalid input tensor types.")}}),zy,vn,ee,Bs,Ry,fr=k(()=>{"use strict";zy=class{constructor(e,t,n,s){this.glContext=e,this.programInfo=t,this.inputTextureLayouts=n,this.outputTextureLayout=s}},vn=class{constructor(e){this.context=e}},ee=class{constructor(e,t){this.routineBody=e,this.dependencies=t}},Bs=class{constructor(e,t,n){this.name=e,n?this.dependencies=n:this.dependencies=[],t&&(this.routineBody=t)}addDependency(e){e&&this.dependencies.push(e)}},Ry=class{static returnOrderedNodes(e){if(!e||e.length===0)return[];if(e.length===1)return e;let t=new Set,n=new Set,s=new Array;return this.createOrderedNodes(e,t,n,s),s}static createOrderedNodes(e,t,n,s){for(let u=0;u<e.length;++u)this.dfsTraverse(e[u],t,n,s)}static dfsTraverse(e,t,n,s){if(!e||n.has(e.name))return;if(t.has(e.name))throw new Error("Cyclic dependency detected. Can't topologically sort routines needed for shader.");t.add(e.name);let u=e.dependencies;if(u&&u.length>0)for(let l=0;l<u.length;++l)this.dfsTraverse(u[l],t,n,s);s.push(e),n.add(e.name),t.delete(e.name)}}});function C3(){let e="add_";return{body:`
  float ${e}(float a, float b) {
    return a + b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 + v2;
  }
  `,name:e,type:0}}function N3(){let e="div_";return{body:`
  float ${e}(float a, float b) {
    return a / b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 / v2;
  }
  `,name:e,type:0}}function z3(){let e="mul_";return{body:`
  float ${e}(float a, float b) {
    return a * b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 * v2;
  }
  `,name:e,type:0}}function R3(){let e="sub_";return{body:`
  float ${e}(float a, float b) {
    return a - b;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return v1 - v2;
  }
  `,name:e,type:0}}function B3(){let e="equal_";return{body:`
  float ${e}(float a, float b) {
    return float(a == b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(equal(v1, v2));
  }
  `,name:e,type:0}}function M3(){let e="greater_";return{body:`
  float ${e}(float a, float b) {
    return float(a > b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r > v2.r ,
      v1.g > v2.g,
      v1.b > v2.b,
      v1.a > v2.a );
  }
  `,name:e,type:0}}function j3(){let e="less_";return{body:`
  float ${e}(float a, float b) {
    return float(a < b);
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4( v1.r < v2.r ,
                v1.g < v2.g,
                v1.b < v2.b,
                v1.a < v2.a );
  }
  `,name:e,type:0}}function F3(){let e="and_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) && bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r && b2.r ,
                b1.g && b2.g,
                b1.b && b2.b,
                b1.a && b2.a );
  }
  `,name:e,type:0}}function L3(){return{body:`
  float or_(float a, float b) {
    return float( bool(a) || bool(b) );
  }
  vec4 or_(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r || b2.r ,
                b1.g || b2.g,
                b1.b || b2.b,
                b1.a || b2.a );
  }
  `,name:"or_",type:0}}function V3(){let e="xor_";return{body:`
  float ${e}(float a, float b) {
    return float( bool(a) ^^ bool(b) );
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    bvec4 b1 = bvec4(v1);
    bvec4 b2 = bvec4(v2);
    return vec4( b1.r ^^ b2.r ,
                b1.g ^^ b2.g,
                b1.b ^^ b2.b,
                b1.a ^^ b2.a );
  }
  `,name:e,type:0}}function U3(){return G3("pow")}function q3(){let e="prelu_";return{body:`
  float ${e}(float a, float b) {
    return a < 0.0 ? a * b: a;
  }
  vec4 ${e}(vec4 v1, vec4 v2) {
    return vec4(
      v1.r < 0.0 ? v1.r * v2.r: v1.r,
      v1.g < 0.0 ? v1.g * v2.g: v1.g,
      v1.b < 0.0 ? v1.b * v2.b: v1.b,
      v1.a < 0.0 ? v1.a * v2.a: v1.a
      );
  }
  `,name:e,type:0}}function G3(e){let t=`${e}_`;return{body:`
  float ${t}(float a, float b) {
    return ${e}(a, b);
  }
  vec4 ${t}(vec4 v1, vec4 v2) {
    return ${e}(v1, v2);
  }
  `,name:t,type:0}}var ut,wp,By,My,jy,Fy,Ly,Vy,Uy,qy,Gy,Hy,Wy,Ky,H3=k(()=>{"use strict";ke(),fr(),Le(),Oe(),ut=(e,t,n,s=t[0].type,u)=>{let l=e.session.pack?2:0;return{name:n.name,inputNames:["A","B"],inputTypes:[l,l],cacheHint:u,get:()=>wp(e,t,n,s)}},wp=(e,t,n,s=t[0].type)=>{let u=e.session.pack?2:0,l=!ge.areEqual(t[0].dims,t[1].dims),p=t[0].dims,d=e.session.pack;if(l){let i=Vt.calcShape(t[0].dims,t[1].dims,!1);if(!i)throw new Error("Can't perform binary op on the given tensors");p=i;let a=p.length,c=t[0].dims.length!==0?t[0].dims.length:1,h=t[1].dims.length!==0?t[1].dims.length:1,m=t[0].dims.length!==0?"bcastIndices_A(indices, aindices);":"aindices[0] = 0;",b=t[1].dims.length!==0?"bcastIndices_B(indices, bindices);":"bindices[0] = 0;",x=Se(e.session.backend.glContext.version),w=d?`
      ${n.body}
      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();
        vec4 result = ${n.name}(a, b);
        ${x.output} = result;
      }`:`
      ${n.body}
      float process(int indices[${a}]) {
        int aindices[${c}];
        int bindices[${h}];
        ${m}
        ${b}
        return ${n.name}(_A(aindices), _B(bindices));
      }`;return{name:n.name,inputNames:["A","B"],inputTypes:[u,u],output:{dims:p,type:s,textureType:u},shaderSource:w,hasMain:d}}let o=Se(e.session.backend.glContext.version),r=`
    ${n.body}
    void main() {
      vec4 v1 = ${o.texture2D}(A, TexCoords);
      vec4 v2 = ${o.texture2D}(B, TexCoords);
      vec4 result = ${n.name}(v1, v2);
      ${o.output} = result;
    }
    `;return{name:n.name,inputNames:["A","B"],inputTypes:[u,u],output:{dims:t[0].dims,type:s,textureType:u},shaderSource:r,hasMain:!0}},By=(e,t)=>[e.run(ut(e,t,C3()),t)],My=(e,t)=>[e.run(ut(e,t,F3(),"bool"),t)],jy=(e,t)=>[e.run(ut(e,t,N3()),t)],Fy=(e,t)=>[e.run(ut(e,t,B3(),"bool"),t)],Ly=(e,t)=>[e.run(ut(e,t,M3(),"bool"),t)],Vy=(e,t)=>[e.run(ut(e,t,j3(),"bool"),t)],Uy=(e,t)=>[e.run(ut(e,t,z3()),t)],qy=(e,t)=>[e.run(ut(e,t,L3(),"bool"),t)],Gy=(e,t)=>[e.run(ut(e,t,U3()),t)],Hy=(e,t)=>[e.run(ut(e,t,q3()),t)],Wy=(e,t)=>[e.run(ut(e,t,R3()),t)],Ky=(e,t)=>[e.run(ut(e,t,V3(),"bool"),t)]}),Xy,Zy,xp,W3=k(()=>{"use strict";ke(),Xy=(e,t,n)=>(xp(t),[e.cast(t[0],n)]),Zy=e=>dt.tensorDataTypeFromProto(e.attributes.getInt("to")),xp=e=>{if(!e||e.length!==1)throw new Error("Cast requires 1 input.");if(e[0].type==="string")throw new Error("Invalid input type.")}}),$p,Tp,Jy,En,K3=k(()=>{"use strict";Le(),Oe(),Zt(),_n(),$p=(e,t)=>({name:"Concat (packed)",inputNames:Array.from({length:e},(n,s)=>`X${s}`),inputTypes:Array(e).fill(2),cacheHint:t}),Tp=(e,t,n,s)=>{let u=n[0].dims.slice();if(s>=u.length||s<-1*u.length)throw new Error("axis specified for concat doesn't match input dimensionality");s<0&&(s=u.length+s);let l=u.slice(0);for(let O=1;O<n.length;O++){let A=n[O].dims.slice();for(let D=0;D<u.length;D++)if(D===s)l[s]+=A[D];else if(u[D]!==A[D])throw new Error("non concat dimensions must match")}let p=l.length,d=Tu("coords",p),o=cr(p),r=ai(),i=n.map(O=>O.dims),a=mn(p),c=new Array(i.length-1);c[0]=i[0][s];for(let O=1;O<c.length;O++)c[O]=c[O-1]+i[O][s];let h=a[s],m=a.slice(-2),b=a.join(),x=`if (${h} < ${c[0]}) {
        return getChannel(
            getX0(${b}), vec2(${m.join()}));
        }`;for(let O=1;O<c.length;O++){let A=c[O-1];x+=`
            if (${h} < ${c[O]}  && ${h} >= ${c[O-1]}) {
              return getChannel(
                getX${O}(${En(a,h,A)}),
                vec2(${En(m,h,A)}));
            }`}let w=c.length,_=c[c.length-1];x+=`
            return getChannel(
              getX${w}(${En(a,h,_)}),
              vec2(${En(m,h,_)}));`;let I=Se(e.session.backend.glContext.version),E=`
          ${r}
          float getValue(${a.map(O=>"int "+O)}) {
            ${x}
          }

          void main() {
            ${o} coords = getOutputCoords();
            int lastDim = coords.${a[p-1]};
            coords.${a[p-1]} = coords.${a[p-2]};
            coords.${a[p-2]} = lastDim;

            vec4 result = vec4(getValue(${d}), 0., 0., 0.);

            ${d[p-1]} = ${d[p-1]} + 1;
            if (${d[p-1]} < ${l[p-1]}) {
              result.g = getValue(${d});
            }

            ${d[p-2]} = ${d[p-2]} + 1;
            if (${d[p-2]} < ${l[p-2]}) {
              result.a = getValue(${d});
            }

            ${d[p-1]} = ${d[p-1]} - 1;
            if (${d[p-2]} < ${l[p-2]} &&
                ${d[p-1]} < ${l[p-1]}) {
              result.b = getValue(${d});
            }
            ${I.output} = result;
          }
        `;return{...t,output:{dims:l,type:n[0].type,textureType:2},shaderSource:E,hasMain:!0}},Jy=(e,t,n)=>{let s=$p(t.length,n.cacheKey);return{...s,get:()=>Tp(e,s,t,n.axis)}},En=(e,t,n)=>{let s=e.indexOf(t);return e.map((u,l)=>l===s?`${u} - ${n}`:u).join()}}),Qy,Sp,Ip,Op,Wo,Ep,Pp,Ap,Yy,kp,X3=k(()=>{"use strict";tt(),Oe(),K3(),Qy=(e,t,n)=>(kp(t),e.session.pack&&t[0].dims.length>1?[e.run(Jy(e,t,n),t)]:[e.run(Op(e,t,n),t)]),Sp=(e,t)=>({name:"Concat",inputNames:Array.from({length:e},(n,s)=>`X${s}`),inputTypes:Array(e).fill(0),cacheHint:t}),Ip=(e,t,n,s)=>{let u=n[0].dims.slice();if(s>=u.length||s<-1*u.length)throw new Error("axis specified for concat doesn't match input dimensionality");s<0&&(s=u.length+s);let l=u.slice(0);for(let h=1;h<n.length;h++){let m=n[h].dims.slice();for(let b=0;b<u.length;b++)if(b===s)l[s]+=m[b];else if(u[b]!==m[b])throw new Error("non concat dimensions must match")}let p=l.length,d=new Array(n.length),o=0;for(let h=0;h<d.length;++h)o+=n[h].dims[s],d[h]=o;let r="";n.length<5?r=Wo(d):r=Ep(d);let i=Pp(n.length,p),a=Ap(d),c=`
        ${i}
        ${a}
        ${r}
        float process(int indices[${p}]) {
          int textureIndex = getTextureWhereDataResides (indices[${s}]);

          if(textureIndex != 0) {
            indices[${s}] = indices[${s}] - int(getSizeInConcatAxisValueFromIndex(textureIndex-int(1)));
          }

          return fetchDataFromCorrectTexture(textureIndex, indices);
        }`;return{...t,output:{dims:l,type:n[0].type,textureType:0},shaderSource:c}},Op=(e,t,n)=>{let s=Sp(t.length,n.cacheKey);return{...s,get:()=>Ip(e,s,t,n.axis)}},Wo=e=>`int getTextureWhereDataResides(int index) {
      ${e.map((t,n)=>`if(index<${t}) {return ${n};}
`).join("")}
    }`,Ep=e=>Wo(e),Pp=(e,t)=>{let n=[`float fetchDataFromCorrectTexture(int textureIndex, int indices[${t}]) {`];for(let s=0;s<e;++s)s===0?n.push(`	if (textureIndex == ${s}) { return _X${s}(indices); }`):s===e-1?n.push(`	else { return _X${s}(indices); }`):n.push(`	else if (textureIndex == ${s}) { return _X${s}(indices); }`);return n.push("	}"),n.join(`
`)},Ap=e=>{let t=["int getSizeInConcatAxisValueFromIndex(int index) {"];for(let n=0;n<e.length;++n)n===0?t.push(`	if (index == ${n}) { return ${e[n]}; }`):n===e.length-1?t.push(`	else { return ${e[n]}; }`):t.push(`	else if (index == ${n}) { return ${e[n]}; }`);return t.push("	}"),t.join(`
`)},Yy=e=>Be({axis:e.attributes.getInt("axis")}),kp=e=>{if(!e||e.length<1)throw new Error("too few inputs");let t=e[0].type,n=e[0].dims.length;if(t==="string")throw new Error("string tensor is not supported yet");for(let s of e){if(s.type!==t)throw new Error("input tensors should be one type");if(s.dims.length!==n)throw new Error("input tensors should have the same shape")}}});function Z3(){return xt("abs")}function J3(){return xt("acos")}function Q3(){return xt("asin")}function Y3(){return xt("atan")}function eS(){return xt("ceil")}function tS(){return xt("cos")}function rS(e){return{body:`
  const float alpha = float(${e});

  float elu_(float a) {
    return a >= 0.0 ? a: (exp(a) - 1.0) * alpha;
  }
  vec4 elu_(vec4 v) {
    return vec4(elu_(v.x), elu_(v.y), elu_(v.z), elu_(v.w));
  }
  `,name:"elu",type:0}}function nS(){return xt("exp")}function iS(){return xt("floor")}function e0(e,t){let n="clip";return{body:`
  const float min = float(${e});
  const float max = float(${t});

  float ${n}_(float a) {
    return clamp(a, min, max);
  }
  vec4 ${n}_(vec4 v) {
    return clamp(v, min, max);
  }
  `,name:n,type:0}}function oS(){let e="indentity";return{body:`
  float ${e}_(float a) {
    return a;
  }
  vec4 ${e}_(vec4 v) {
    return v;
  }
  `,name:e,type:0}}function aS(e){let t="leakyRelu";return{body:`
  const float alpha = float(${e});

  float ${t}_(float a) {
    return a < 0.0 ? a * alpha : a;
  }
  vec4 ${t}_(vec4 v) {
    return vec4(${t}_(v.x), ${t}_(v.y), ${t}_(v.z), ${t}_(v.w));
  }
  `,name:t,type:0}}function sS(){return xt("log")}function uS(){return{body:`
  float neg_(float a) {
    return -a;
  }
  vec4 neg_(vec4 v) {
    return -v;
  }
  `,name:"neg",type:0}}function lS(){return{body:`
  float not_(float a) {
    return float( ! bool(a) );
  }
  bool not_(bool a) {
    return !a;
  }
  vec4 not_(vec4 v) {
    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));
  }
  bvec4 not_(bvec4 v) {
    return bvec4(!v.x, !v.y, !v.z, !v.w);
  }
  `,name:"not",type:0}}function dS(){return xt("sin")}function t0(){let e="relu";return{body:`
  float ${e}_(float a) {
    return max( a, 0.0 );
  }
  vec4 ${e}_(vec4 v) {
    return max( v, 0.0 );
  }
  `,name:e,type:0}}function r0(){let e="sigmoid";return{body:`
  float ${e}_(float a) {
    return 1.0 / (1.0 + exp(-a));
  }
  vec4 ${e}_(vec4 v) {
    return 1.0 / (1.0 + exp(-v));
  }
  `,name:e,type:0}}function pS(){return xt("sqrt")}function cS(){return xt("tan")}function hS(){let e="tanh";return{body:`
  float ${e}_(float a) {
    a = clamp(a, -10., 10.);
    a = exp(2.*a);
    return (a - 1.) / (a + 1.);
  }
  vec4 ${e}_(vec4 v) {
    v = clamp(v, -10., 10.);
    v = exp(2.*v);
    return (v - 1.) / (v + 1.);
  }
  `,name:e,type:0}}function xt(e){return{body:`
  float ${e}_(float a) {
    return ${e}(a);
  }
  vec4 ${e}_(vec4 v) {
    return ${e}(v);
  }
  `,name:e,type:0}}var Dp,Ue,n0,i0,o0,a0,Ms,s0,u0,Cp,l0,d0,p0,c0,h0,f0,js,m0,g0,b0,y0,_0,v0,w0,x0,$0,T0,S0,I0=k(()=>{"use strict";tt(),ke(),fr(),Le(),Oe(),Dp=(e,t,n,s)=>{let u=e.session.pack?2:0,l=Se(e.session.backend.glContext.version);return{...t,output:{dims:n.dims,type:n.type,textureType:u},shaderSource:`
     ${s.body}
     void main() {
       vec4 v = ${l.texture2D}(A, TexCoords);
       v = ${s.name}_(v);
       ${l.output} = v;
     }
     `,hasMain:!0}},Ue=(e,t,n,s)=>{let u=e.session.pack?2:0,l={name:n.name,inputTypes:[u],inputNames:["A"],cacheHint:s};return{...l,get:()=>Dp(e,l,t,n)}},n0=(e,t)=>[e.run(Ue(e,t[0],Z3()),t)],i0=(e,t)=>[e.run(Ue(e,t[0],J3()),t)],o0=(e,t)=>[e.run(Ue(e,t[0],Q3()),t)],a0=(e,t)=>[e.run(Ue(e,t[0],Y3()),t)],Ms=(e,t,n)=>[e.run(Ue(e,t[0],e0(n.min,n.max),n.cacheKey),t)],s0=e=>Be({min:e.attributes.getFloat("min",ti),max:e.attributes.getFloat("max",ri)}),u0=(e,t)=>{let n=Cp(e,t);return Ms(e,[t[0]],n)},Cp=(e,t)=>{if(t.length>=3&&(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)))throw new Error("dynamic clip attributes are not allowed");let n=t.length>=3?t[1].numberData[0]:ti,s=t.length>=3?t[2].numberData[0]:ri;return Be({min:n,max:s})},l0=(e,t)=>[e.run(Ue(e,t[0],eS()),t)],d0=(e,t)=>[e.run(Ue(e,t[0],tS()),t)],p0=(e,t,n)=>[e.run(Ue(e,t[0],rS(n.alpha),n.cacheKey),t)],c0=e=>Be({alpha:e.attributes.getFloat("alpha",1)}),h0=(e,t)=>[e.run(Ue(e,t[0],nS()),t)],f0=(e,t)=>[e.run(Ue(e,t[0],iS()),t)],js=(e,t)=>[e.run(Ue(e,t[0],oS()),t)],m0=(e,t,n)=>[e.run(Ue(e,t[0],aS(n.alpha),n.cacheKey),t)],g0=e=>Be({alpha:e.attributes.getFloat("alpha",.01)}),b0=(e,t)=>[e.run(Ue(e,t[0],sS()),t)],y0=(e,t)=>[e.run(Ue(e,t[0],uS()),t)],_0=(e,t)=>[e.run(Ue(e,t[0],lS()),t)],v0=(e,t)=>[e.run(Ue(e,t[0],t0()),t)],w0=(e,t)=>[e.run(Ue(e,t[0],r0()),t)],x0=(e,t)=>[e.run(Ue(e,t[0],dS()),t)],$0=(e,t)=>[e.run(Ue(e,t[0],pS()),t)],T0=(e,t)=>[e.run(Ue(e,t[0],cS()),t)],S0=(e,t)=>[e.run(Ue(e,t[0],hS()),t)]});function si(e){let t;switch(e.activation){case"Relu":t=t0();break;case"Sigmoid":t=r0();break;case"Clip":t=e0(e.clipMin,e.clipMax);break;default:return{activationFunction:"",applyActivation:""}}let n=t.name,s=t.body,u=`value = ${n}_(value);`;return{activationFunction:s,applyActivation:u}}var oo,wn=k(()=>{"use strict";ke(),I0(),oo=e=>{let t=e.getString("activation","");if(t==="Clip"){let[n,s]=e.getFloats("activation_params",[ti,ri]);return{activation:t,clipMax:s,clipMin:n,activationCacheKey:`${t}:${n},${s}`}}return{activation:t,activationCacheKey:t}}}),Np,zp,O0,fS=k(()=>{"use strict";Ct(),Le(),Oe(),Ou(),wn(),Np=(e,t)=>({name:"GroupedConv",inputNames:e?["X","W","Bias"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),zp=(e,t,n,s)=>{let u=t.length>2?"value += getBias(output_channel);":"",l=t[0].dims.slice(),p=t[1].dims.slice(),d=p[0]/s.group;qe.verbose("GroupedConv",`autpPad:${s.autoPad}, dilations:${s.dilations}, group:${s.group}, kernelShape:${s.kernelShape}, pads:${s.pads}, strides:${s.strides}`);let o=Qn(l,p,s.dilations,s.pads,s.strides),r=Se(e.session.backend.glContext.version),{activationFunction:i,applyActivation:a}=si(s),c=`
  const ivec2 strides = ivec2(${s.strides[0]}, ${s.strides[1]});
  const ivec2 pads = ivec2(${s.pads[0]}, ${s.pads[1]});
  ${i}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;
    ivec2 xRCCorner = coords.zw * strides - pads;
    int group_id = output_channel / ${d};

    float value = 0.0;
    for (int wInChannel = 0; wInChannel < ${p[1]}; wInChannel++) {
      int input_channel = group_id * ${p[1]} + wInChannel;
      for (int wHeight = 0; wHeight < ${p[2]}; wHeight++) {
        int xHeight = xRCCorner.x + wHeight * ${s.dilations[0]};

        if (xHeight < 0 || xHeight >= ${l[2]}) {
          continue;
        }

        for (int wWidth = 0; wWidth < ${p[3]}; wWidth++) {
          int xWidth = xRCCorner.y + wWidth * ${s.dilations[1]};
          if (xWidth < 0 || xWidth >= ${l[3]}) {
            continue;
          }

          float xVal = getX(batch, input_channel, xWidth, xHeight);
          float wVal = getW(output_channel, wInChannel, wWidth, wHeight);
          value += xVal*wVal;
        }
      }
    }
    ${u}
    ${a}
    ${r.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:o,type:t[0].type,textureType:0},shaderSource:c,hasMain:!0}},O0=(e,t,n)=>{let s=Np(t.length>2,n.cacheKey);return{...s,get:()=>zp(e,t,s,n)}}}),Rp,Bp,E0,mS=k(()=>{"use strict";Le(),Oe(),_n(),Rp=e=>({name:"Im2Col (packed)",inputNames:["A"],inputTypes:[2],cacheHint:e}),Bp=(e,t,n,s,u,l)=>{let p=n.dims,d=s.dims,o=2,r=3,i=u.length,a=[d[1]*d[2]*d[3],u[2]*u[3]],c=d[2]*d[3],h=ai(),m=Se(e.session.backend.glContext.version),b="";for(let w=0;w<=1;w++)for(let _=0;_<=1;_++)b+=`
            blockIndex = rc.x + ${_};
            pos = rc.y + ${w};

            if(blockIndex < ${a[1]} && pos < ${a[0]}) {
              offsetY = int(blockIndex / (${u[i-1]})) * ${l.strides[0]} -
                ${l.pads[0]};
              d0 = offsetY + ${l.dilations[0]} * (imod(pos, ${c}) / ${d[2]});

              if(d0 < ${p[o]} && d0 >= 0) {
                offsetX = imod(blockIndex, ${u[i-1]}) * ${l.strides[1]} -
                  ${l.pads[1]};
                d1 = offsetX + ${l.dilations[1]} * imod(imod(pos, ${c}), ${d[2]});

                if(d1 < ${p[r]} && d1 >= 0) {

                  ch = int(float(pos)/ ${c}.);
                    innerDims = vec2(d0, d1);
                    result[${w*2+_}] = getChannel(
                      getA(0, ch, int(innerDims.x),
                      int(innerDims.y)), innerDims);
                }
              }
            }

          `;let x=`
      ${h}

      void main() {
        ivec2 rc = getOutputCoords();
          vec4 result = vec4(0.0);
          int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
          vec2 innerDims;
          ${b}
          ${m.output} = result;
      }
            `;return{...t,output:{dims:a,type:n.type,textureType:2},shaderSource:x,hasMain:!0}},E0=(e,t,n,s,u)=>{let l=Rp(u.cacheKey);return{...l,get:()=>Bp(e,l,t,n,s,u)}}});function gS(e,t,n){let s=t[0].dims,u=t[1].dims,l=Vt.calcShape(s,u,!0);if(!l)throw new Error("Can't use matmul on the given tensors");let p=cr(l.length),d=mn(),{activationFunction:o,applyActivation:r}=si(n),i=t.length>2,a=i?"value += getBiasForMatmul();":"",c=i?`${A0(p,d,t[2].dims,l,!1)}`:"",h=l.length,m=s.length,b=u.length,x=s[s.length-1],w=`
    ${o}
    ${c}
    float process(int indices[${h}]) {
        int a[${m}];
        int b[${b}];
        bcastMatmulIndices_A(indices, a);
        bcastMatmulIndices_B(indices, b);

        float value;
        for (int k=0; k<${x}; ++k) {
            a[${m-1}] = k;
            b[${b-2}] = k;
            value += _A(a) * _B(b);
        }
        ${a}
        ${r}
        return value;
    }`;return{...e,output:{dims:l,type:t[0].type,textureType:0},shaderSource:w}}function P0(e,t){let n=C0(e.length>2,t.activationCacheKey);return{...n,get:()=>gS(n,e,t)}}function A0(e,t,n,s,u){let l="",p=n.length,d=s.length,o=d-p;d<2&&p>0?l="coords":l=n.map((c,h)=>`coords.${t[h+o]}`).join(", ");let r=Vt.getBroadcastDims(n,s).map(c=>`coords.${t[c+o]} = 0;`).join(`
`),i=ge.size(n)===1,a="vec4(outputValue.xx, outputValue.yy)";return i&&(a="vec4(outputValue.x)"),u?`
vec4 getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${r}
  vec4 outputValue = getBias(${l});
  return ${a};
}`:`
float getBiasForMatmul() {
  ${e} coords = getOutputCoords();
  ${r}
  return getBias(coords.x);
}`}var k0,D0,C0,Mp,Su=k(()=>{"use strict";ke(),Oe(),Zt(),wn(),N0(),k0=(e,t,n)=>(Mp(t),e.session.pack?[e.run(Iu(e,t,n),t)]:[e.run(P0(t,n),t)]),D0=e=>oo(e.attributes),C0=(e,t)=>({name:"MatMul",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),Mp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.");if(e[0].type!=="float32"&&e[0].type!=="float64"||e[1].type!=="float32"&&e[1].type!=="float64")throw new Error("inputs should be float type");if(e[0].type!==e[1].type)throw new Error("inputs types should match")}});function bS(e,t,n,s){let u=[],l=[],p=n[0].dims,d=n[1].dims,o=p.length,r=d.length,i=s.length,a=i-o,c=i-r;u=p.map((_,I)=>`coords.${t[I+a]}`),u[o-1]="i*2",u.join(", "),l=d.map((_,I)=>`coords.${t[I+c]}`),l[r-2]="i*2",l.join(", ");let h=Vt.getBroadcastDims(p,s),m=Vt.getBroadcastDims(d,s),b=h.map(_=>`coords.${t[_+a]} = 0;`).join(`
`),x=m.map(_=>`coords.${t[_+c]} = 0;`).join(`
`),w=`int lastDim = coords.${t[i-1]};
  coords.${t[i-1]} = coords.${t[i-2]};
  coords.${t[i-2]} = lastDim;`;return`
vec4 getAAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${w}
  ${b}
  vec4 outputValue = getA(${u});
  return outputValue;
}

vec4 getBAtOutCoordsMatmul(int i) {
  ${e} coords = getOutputCoords();
  ${w}
  ${x}
  vec4 outputValue = getB(${l});
  return outputValue;
}`}function yS(e,t){let n="";for(let s=0;s<t-2;s++)n+=`rc.${e[s]}, `;return n+=`rc.${e[t-2]}, i*2`,n}function _S(e,t){let n="";for(let s=0;s<t-2;s++)n+=`rc.${e[s]}, `;return n+=`i*2, rc.${e[t-1]}`,n}var jp,Fp,Iu,N0=k(()=>{"use strict";ke(),Le(),Oe(),Zt(),wn(),Su(),jp=(e,t)=>({name:"MatMul (packed)",inputNames:e?["A","B","Bias"]:["A","B"],inputTypes:e?[2,2,2]:[2,2],cacheHint:t}),Fp=(e,t,n,s)=>{let u=n.length>2,l=u?"value += getBiasForMatmul();":"",p=n[0].dims,d=n[1].dims,o=Vt.calcShape(p,d,!0),r=!ge.areEqual(n[0].dims,n[1].dims);if(!o)throw new Error("Can't use matmul on the given tensors");let i=p[p.length-1],a=Math.ceil(i/2),c=p.length,h=d.length,m=Se(e.session.backend.glContext.version),b=cr(o.length),x=o.length,w=mn(),{activationFunction:_,applyActivation:I}=si(s),E=u?`${A0(b,w,n[2].dims,o,!0)}`:"",O=r?`${bS(b,w,n,o)}`:"",A=r?"getAAtOutCoordsMatmul(i)":`getA(${yS(w,c)})`,D=r?"getBAtOutCoordsMatmul(i)":`getB(${_S(w,h)})`,S=r?"":`${b} rc =
          getOutputCoords(); int lastDim = rc.${w[x-1]}; rc.${w[x-1]} =
          rc.${w[x-2]}; rc.${w[x-2]} = lastDim;
      `,F=`
            ${O}
            ${E}
            ${_}
            void main() {
              ${S}

              vec4 value = vec4(0);
              for (int i = 0; i < ${a}; i++) {
                vec4 a = ${A};
                vec4 b = ${D};

                value += (a.rrbb * b.rgrg);
                value += (a.ggaa * b.baba);
              }
              ${l}
              ${I}
              ${m.output} = value;
            }`;return{...t,output:{dims:o,type:n[0].type,textureType:2},shaderSource:F,hasMain:!0}},Iu=(e,t,n)=>{let s=jp(t.length>2,n.activationCacheKey);return{...s,get:()=>Fp(e,s,t,n)}}}),z0,vS=k(()=>{"use strict";Ou(),mS(),N0(),z0=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,l=Qn(s,u,n.dilations,n.pads,n.strides),p=e.run(E0(e,t[0],t[1],l,n),[t[0]]),d=e.reshapePacked(t[1],[u[0],u[1]*u[2]*u[3]]),o=t.length===3?[d,p,t[2]]:[d,p],r=e.run(Iu(e,o,n),o);return e.reshapePacked(r,l)}}),Lp,Vp,R0,Fs,B0=k(()=>{"use strict";Oe(),Lp=e=>({name:"Im2Col",inputNames:["X"],inputTypes:[0],cacheHint:e}),Vp=(e,t,n,s,u,l)=>{let p=n.dims,d=s.dims,o=u.length,r=Fs(p,d,u,4),i=`
        const int XC = ${p[1]};
        const int XH = ${p[2]};
        const int XW = ${p[3]};
        const int KH = ${l.kernelShape[0]};
        const int KW = ${l.kernelShape[1]};
        const int dilationH = ${l.dilations[0]};
        const int dilationW = ${l.dilations[1]};
        const int strideH = ${l.strides[0]};
        const int strideW = ${l.strides[1]};
        const int padH = ${l.pads[0]};
        const int padW = ${l.pads[1]};
        const int KHKW = KH*KW;
        const int XCKHKW = XC * KHKW;
        const int outputChannels = 4;
        vec4 process(int indices[${o}]) {
          int b  = indices[0]; // batch size
          int oh = indices[1] * strideH - padH; //output height
          int ow = indices[2] * strideW - padW; //output width
          int p = indices[3] * outputChannels; //patch
          vec4 value = vec4(0.0);
          for(int i=0; i < outputChannels; ++i) {
            if(p < XCKHKW) {
              int patchC = p / KHKW;
              int patchH = (p - patchC*KHKW) / KW;
              int patchW = (p - patchC*KHKW) - patchH * KW;
              int xh2 = oh + patchH * dilationH;
              int xw2 = ow + patchW * dilationW;
              int x[${p.length}];
              x[0] = b;
              x[1] = patchC;
              x[2] = xh2;
              x[3] = xw2;
              if(xh2 >= 0 &&
                  xh2 < XH &&
                  xw2 >= 0 &&
                  xw2 < XW) {
                value[i] = _X(x);
              }
            }
            ++p;
          }
          return value;
        }
        `;return{...t,output:{dims:r,type:n.type,textureType:4},shaderSource:i}},R0=(e,t,n,s,u)=>{let l=Lp(u.cacheKey);return{...l,get:()=>Vp(e,l,t,n,s,u)}},Fs=(e,t,n,s=4)=>[n[0],n[2],n[3],Math.ceil(e[1]*t[2]*t[3]/s)]}),Up,qp,M0,wS=k(()=>{"use strict";ke(),Le(),Oe(),wn(),B0(),Up=(e,t)=>({name:"ConvDotProduct",inputNames:e?["Im2Col","K","B"]:["Im2Col","K"],inputTypes:e?[0,4,0]:[0,4],cacheKey:t.activationCacheKey}),qp=(e,t,n,s,u)=>{let l=n[0].dims,p=n[1].dims,d=[p[0],Math.ceil(l[1]*p[2]*p[3]/4)],o=Fs(l,p,s),[r,i]=e.calculateTextureWidthAndHeight(d,4),a=ge.computeStrides(o),[c,h]=e.calculateTextureWidthAndHeight(o,4),m=s.length,b=n.length<3?"0.0":"_B(b)",x=Math.ceil(l[1]*p[2]*p[3]/4),{activationFunction:w,applyActivation:_}=si(u),I=Se(e.session.backend.glContext.version),E=`
${w}
float process(int indices[${m}]) {
  int b[1];
  b[0] = indices[1];
  int im2col[4];
  im2col[0] = indices[0];
  im2col[1] = indices[2];
  im2col[2] = indices[3];
  int im2colOffset = im2col[0] * ${a[0]} + im2col[1] * ${a[1]} + im2col[2] * ${a[2]};
  int kernelOffset = indices[1] * ${d[1]};
  float value = ${b};
  for (int i = 0; i < ${x}; ++i) {
    vec2 im2colCoords = offsetToCoords(im2colOffset, ${c}, ${h});
    vec2 kernelCoords = offsetToCoords(kernelOffset, ${r}, ${i});
    value += dot(${I.texture2D}(Im2Col, im2colCoords), ${I.texture2D}(K, kernelCoords));
    ++im2colOffset;
    ++kernelOffset;
  }
  ${_}
  return value;
}`;return{...t,output:{dims:s,type:n[0].type,textureType:0},shaderSource:E}},M0=(e,t,n,s)=>{let u=Up(t.length>2,s);return{...u,get:()=>qp(e,u,t,n,s)}}}),Qn,Ls,Gp,Hp,Wp,Kp,Vs,Xp,Ou=k(()=>{"use strict";tt(),ke(),fS(),vS(),wS(),wn(),B0(),Su(),Qn=(e,t,n,s,u)=>{let l=e[0],p=e.slice(2),d=p.length,o=t[0],r=t.slice(2).map((a,c)=>a+(a-1)*(n[c]-1)),i=p.map((a,c)=>a+s[c]+s[c+d]).map((a,c)=>Math.floor((a-r[c]+u[c])/u[c]));return[l,o].concat(...i)},Ls=(e,t,n)=>(Xp(t,n),Gp(e,t,n)),Gp=(e,t,n)=>{let s=Kp(n,t),u=e.session.pack,l=s.kernelShape[0]===1&&s.kernelShape[1]===1;return s.group>1?[e.run(O0(e,t,s),t)]:l&&u?[Hp(e,t,s)]:u&&t[0].dims.length===4&&t[0].dims[0]===1&&!l?[z0(e,t,s)]:[Wp(e,t,s)]},Hp=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,l=Qn(s,u,n.dilations,n.pads,n.strides),p=e.reshapeUnpacked(t[0],[s[1],s[2]*s[3]]),d=e.reshapeUnpacked(t[1],[u[0],u[1]]),o=t.length>2?[d,p,t[2]]:[d,p],r=e.run(P0(o,n),o);return e.reshapeUnpacked(r,l)},Wp=(e,t,n)=>{let s=t[0].dims,u=t[1].dims,l=Qn(s,u,n.dilations,n.pads,n.strides),p=e.run(R0(e,t[0],t[1],l,n),[t[0]]),d=t.length===3?[p,t[1],t[2]]:[p,t[1]];return e.run(M0(e,t,l,n),d)},Kp=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0)for(let l=2;l<t[1].dims.length;++l)n.push(t[1].dims[l]);let s=e.pads.slice();qi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,s,e.autoPad);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:s,cacheKey:e.cacheKey}),u},Vs=e=>{let t=e.attributes,n=oo(t),s=t.getString("auto_pad","NOTSET"),u=t.getInts("dilations",[1,1]),l=t.getInt("group",1),p=t.getInts("kernel_shape",[]),d=t.getInts("pads",[0,0,0,0]),o=t.getInts("strides",[1,1]);return Be({autoPad:s,dilations:u,group:l,kernelShape:p,pads:d,strides:o,...n})},Xp=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4||e[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=e[0].dims[1],s=e[1].dims[1]*t.group;if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let u=e[0].dims.length-2;if(t.dilations.length!==u)throw new Error(`dilations should be ${u}D`);if(t.strides.length!==u)throw new Error(`strides should be ${u}D`);if(t.pads.length!==u*2)throw new Error(`pads should be ${u*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(e[0].type!=="float32"||e[1].type!=="float32")throw new Error("Conv input(X,W) should be float tensor");if(e.length===3&&e[2].type!=="float32")throw new Error("Conv input(bias) should be float tensor")}}),Zp,Jp,Qp,j0,Yp,ec,tc,rc,nc,ic,F0,oc,xS=k(()=>{"use strict";tt(),Le(),Oe(),wn(),Zp=(e,t,n,s,u,l)=>(e-1)*t+n+(s-1)*u+1-l,Jp=(e,t,n,s,u)=>{let l=Math.floor(e/2);t==="SAME_UPPER"?(n[s]=l,n[u]=e-l):t==="SAME_LOWER"&&(n[s]=e-l,n[u]=l)},Qp=(e,t,n,s,u,l,p,d)=>{let o=e.length-2,r=d.length===0;for(let i=0;i<o;++i){let a=r?e[i+2]*l[i]:d[i],c=Zp(e[i+2],l[i],u[i],t[i],n[i],a);Jp(c,s,u,i,i+o),r&&d.push(l[i]*(e[i+2]-1)+p[i]+(t[i]-1)*n[i]+1-u[i]-u[i+o])}},j0=(e,t,n)=>(oc(t,n),Yp(e,t,n)),Yp=(e,t,n)=>{let s=ic(n,t);return[nc(e,t,s)]},ec=(e,t)=>({name:"ConvTranspose",inputNames:e?["X","W","B"]:["X","W"],inputTypes:e?[0,0,0]:[0,0],cacheHint:t}),tc=(e,t,n,s)=>{let u=t.length>2?"getB(output_channel)":"0.0",l=t[0].dims,p=t[1].dims,d=p[1],o=p[0]/s.group,r=[t[0].dims[0],t[1].dims[1]*s.group,...s.outputShape],i=Se(e.session.backend.glContext.version),{activationFunction:a,applyActivation:c}=si(s),h=`
  const ivec2 strides = ivec2(${s.strides[0]}, ${s.strides[1]});
  const ivec2 pads = ivec2(${s.pads[0]}, ${s.pads[1]});
  ${a}
  void main() {
    ivec4 coords = getOutputCoords();
    int batch = coords.x;
    int output_channel = coords.y;

    ivec2 loc = coords.zw + pads;

    int group_id = output_channel / ${d};
    int wOutChannel = output_channel - group_id * ${d};

    float value = ${u};
    for (int inChannelOffset = 0; inChannelOffset < ${o}; inChannelOffset++) {
      int input_channel = group_id * ${o} + inChannelOffset;
      for (int wWOff = 0; wWOff < ${p[2]}; wWOff++) {
        for (int wHOff = 0; wHOff < ${p[3]}; wHOff++) {
          ivec2 wOff = ivec2(wWOff * ${s.dilations[0]}, wHOff * ${s.dilations[1]});
          ivec2 wLoc = loc - wOff;
          ivec2 wLocIn = wLoc / strides;
          if (
            wLocIn * strides == wLoc &&
            wLocIn.x >= 0 && wLocIn.x < ${l[2]} &&
            wLocIn.y >= 0 && wLocIn.y < ${l[3]}
          ) {
            float xVal = getX(batch, input_channel, wLocIn.y, wLocIn.x);
            float wVal = getW(input_channel, wOutChannel, wHOff, wWOff);
            value += xVal * wVal;
          }
        }
      }
    }
    ${c}
    ${i.output} = vec4(value, .0, .0, .0);
  }
`;return{...n,output:{dims:r,type:t[0].type,textureType:0},shaderSource:h,hasMain:!0}},rc=(e,t,n)=>{let s=ec(t.length>2,n.cacheKey);return{...s,get:()=>tc(e,t,s,n)}},nc=(e,t,n)=>e.run(rc(e,t,n),t),ic=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0)for(let d=2;d<t[1].dims.length;++d)n.push(t[1].dims[d]);let s=e.pads.slice(),u=e.outputShape.slice(),l=t[0].dims;Qp(l,n,e.dilations,e.autoPad,s,e.strides,e.outputPadding,u);let p=Object.assign({},e);return Object.assign(p,{kernelShape:n,pads:s,outputShape:u,cacheKey:e.cacheKey}),p},F0=e=>{let t=e.attributes,n=oo(t),s=t.getString("auto_pad","NOTSET"),u=t.getInts("dilations",[1,1]),l=t.getInt("group",1),p=t.getInts("kernel_shape",[]),d=t.getInts("output_padding",[0,0]),o=t.getInts("output_shape",[]),r=t.getInts("pads",[0,0,0,0]),i=t.getInts("strides",[1,1]);return Be({autoPad:s,dilations:u,group:l,kernelShape:p,outputPadding:d,outputShape:o,pads:r,strides:i,...n})},oc=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4||e[1].dims.length!==4)throw new Error("currently only support 2-dimensional conv");let n=e[0].dims[1],s=e[1].dims[0];if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let u=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==u))throw new Error("invalid bias");let l=e[0].dims.length-2;if(t.dilations.length!==l)throw new Error(`dilations should be ${l}D`);if(t.strides.length!==l)throw new Error(`strides should be ${l}D`);if(t.pads.length!==l*2)throw new Error(`pads should be ${l*2}D`);if(t.outputPadding.length!==l)throw new Error(`output_padding should be ${l}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape");if(e[0].type!=="float32"||e[1].type!=="float32")throw new Error("ConvTranspose input(X,W) should be float tensor");if(e.length===3&&e[2].type!=="float32")throw new Error("ConvTranspose input(bias) should be float tensor")}}),Ko,ni,L0,ac,Xo,sc,uc,lc,Eu=k(()=>{"use strict";tt(),ke(),Oe(),Ko={name:"Transpose",inputNames:["A"],inputTypes:[0]},ni=(e,t,n)=>(lc(t),[e.run({...Ko,cacheHint:n.cacheKey,get:()=>ac(e,t[0],n.perm)},t)]),L0=e=>Be({perm:e.attributes.getInts("perm",[])}),ac=(e,t,n)=>{let s=t.dims;n=Xo(s,n);let u=sc(s,n),l=s.length,p=`
      ${uc("perm",n,l)}
      float process(int indices[${l}]) {
        int a[${l}];
        perm(a, indices);
        return _A(a);
      }`;return{...Ko,output:{dims:u,type:t.type,textureType:0},shaderSource:p}},Xo=(e,t)=>(t&&t.length!==e.length&&(t=[...e.keys()].reverse()),t),sc=(e,t)=>(t=Xo(e,t),ge.sortBasedOnPerm(e,t)),uc=(e,t,n)=>{let s=[];s.push(`void ${e}(out int a[${n}], int src[${n}]) {`);for(let u=0;u<n;++u)s.push(`	a[${t[u]}]=src[${u}];`);return s.push("	}"),s.join(`
`)},lc=e=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("input should be float tensor")}}),V0,U0,dc,$S=k(()=>{"use strict";Eu(),V0=(e,t,n)=>{dc(t);let s=n.blocksize,u=s*s,l=n.mode==="DCR"?[0,3,4,1,5,2]:[0,1,4,2,5,3],p=n.mode==="DCR"?[t[0].dims[0],s,s,t[0].dims[1]/u,t[0].dims[2],t[0].dims[3]]:[t[0].dims[0],t[0].dims[1]/u,s,s,t[0].dims[2],t[0].dims[3]],d=e.reshapeUnpacked(t[0],p),o={perm:l,cacheKey:`${l}`},[r]=ni(e,[d],o),i=[t[0].dims[0],t[0].dims[1]/u,t[0].dims[2]*s,t[0].dims[3]*s];return[e.reshapeUnpacked(r,i)]},U0=e=>{let t=e.attributes.getInt("blocksize");if(t<1)throw new Error(`blocksize must be >= 1, but got : ${t} for DepthToSpace`);let n=e.attributes.getString("mode","DCR");if(n!=="DCR"&&n!=="CRD")throw new Error(`unrecognized mode: ${n} for DepthToSpace`);return{mode:n,blocksize:t}},dc=e=>{if(e.length!==1)throw new Error(`DepthToSpace expect 1 inputs, but got ${e.length}`);if(e[0].type==="string"||e[0].dims.length!==4)throw new TypeError("DepthToSpace input should be a 4-D numeric tensor")}}),q0,G0,pc,TS=k(()=>{"use strict";ke(),q0=(e,t,n)=>{pc(t,n);let s=ge.flattenShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},G0=e=>e.attributes.getInt("axis",1),pc=(e,t)=>{if(!e||e.length!==1)throw new Error("Flatten requires 1 input.");let n=e[0].dims.length;if(n===0)throw new Error("scalar tensor is not supported.");if(t<-n||t>n)throw new Error("Invalid axis");if(e[0].type==="string")throw new Error("string tensor is not supported.")}}),ui,ao=k(()=>{"use strict";ui=["float32","float64","int32","int16","int8","uint16","uint32","uint8"]}),H0,W0,cc,hc,fc,mc,SS=k(()=>{"use strict";tt(),ao(),ke(),Oe(),H0=(e,t,n)=>(mc(t,n.axis),[e.run(fc(e,t,n),t)]),W0=e=>Be({axis:e.attributes.getInt("axis",0)}),cc={name:"Gather",inputNames:["A","B"],inputTypes:[0,0]},hc=(e,t,n,s)=>{let u=n[0].dims.slice(),l=n[1].dims.slice(),p=new Array(u.length+l.length-1);s=ge.normalizeAxis(s,u.length);let d=[];for(let c=0;c<p.length;c++)c<s?(p[c]=u[c],d.push(`inputIdx[${c}] = outputIdx[${c}];`)):c<s+l.length?(p[c]=l[c-s],d.push(`indexDataIdx[${c-s}] = outputIdx[${c}];`)):(p[c]=u[c-l.length+1],d.push(`inputIdx[${c-l.length+1}] = outputIdx[${c}];`));let o=p.length||1,r=u.length,i=l.length||1,a=`
      float process(int outputIdx[${o}]) {
        int inputIdx[${r}];
        int indexDataIdx[${i}];
        indexDataIdx[0] = 0;
        ${d.join(`
        `)}
        int idx = int(_B(indexDataIdx));
        inputIdx[${s}] = idx < 0 ? idx + ${u[s]} : idx;
        return _A(inputIdx);
      }`;return{...t,output:{dims:p,type:n[0].type,textureType:0},shaderSource:a}},fc=(e,t,n)=>{let s={...cc,cacheHint:n.cacheKey};return{...s,get:()=>hc(e,s,t,n.axis)}},mc=(e,t)=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.");let n=e[0].dims.length;if(n<1)throw new Error("Invalid input shape.");if(t<-n||t>n-1)throw new Error("Invalid axis.");if(ui.indexOf(e[0].type)===-1)throw new Error("Invaid input type.");if(e[1].type!=="int32"&&e[1].type!=="int16")throw new Error("Invaid input type.")}}),Us,Zo,K0,X0,gc,bc,yc,IS=k(()=>{"use strict";tt(),ke(),Oe(),Us=(e,t,n)=>(yc(t,n),[e.run(gc(t,n),t)]),Zo=(e,t)=>{let n=e.attributes.getInt("transA",0)!==0,s=e.attributes.getInt("transB",0)!==0,u=e.attributes.getFloat("alpha",1),l=e.attributes.getFloat("beta",1);return Be({transA:n,transB:s,alpha:u,beta:l,isOptionalC:t})},K0=e=>Zo(e,!1),X0=e=>Zo(e,!0),gc=(e,t)=>{let n={name:"Gemm",inputNames:e.length===3?["A","B","C"]:["A","B"],inputTypes:e.length===3?[0,0,0]:[0,0],key:t.cacheKey};return{...n,get:()=>bc(n,e,t)}},bc=(e,t,n)=>{let s=t[0].dims.slice(),u=t[1].dims.slice(),[l,p]=wy.getShapeOfGemmResult(s,n.transA,u,n.transB,t.length===3?t[2].dims:void 0),d=[l,p];if(!d)throw new Error("Can't use gemm on the given tensors");let o=s[s.length-1],r="";n.transA&&(o=s[0]),n.transA&&n.transB?r="value += _A_T(a) * _B_T(b);":n.transA&&!n.transB?r="value += _A_T(a) * _B(b);":!n.transA&&n.transB?r="value += _A(a) * _B_T(b);":!n.transA&&!n.transB&&(r="value += _A(a) * _B(b);");let i=d.length,a=t.length===3?`int c[${t[2].dims.length}];`:"",c=t.length===3?"bcastIndices_C(indices, c);":"",h=t.length===3?"value += beta * _C(c);":"",m=`
      float process(int indices[${i}]) {
          int a[${i}];
          int b[${i}];
          ${a}

          copyVec(indices, a);
          copyVec(indices, b);
          ${c}

          float value = 0.0;
          for (int k=0; k<${o}; ++k) {
              a[${i-1}] = k;
              b[${i-2}] = k;
              ${r}
          }

          value = value * alpha;
          ${h}
          return value;
      }`;return{...e,output:{dims:d,type:t[0].type,textureType:0},variables:[{name:"alpha",type:"float",data:n.alpha},{name:"beta",type:"float",data:n.beta}],shaderSource:m}},yc=(e,t)=>{if(!e)throw new Error("Input is missing");if(t.isOptionalC&&(e.length<2||e.length>3))throw new Error("Invaid input shape.");if(!t.isOptionalC&&e.length!==3)throw new Error("Gemm requires 3 inputs");if(e.length===3&&e[2].dims.length!==1&&e[2].dims.length!==2)throw new Error("Invalid input shape of C");if(e[0].type!=="float32"&&e[0].type!=="float64"||e[1].type!=="float32"&&e[1].type!=="float64"||e.length===3&&e[2].type!=="float32"&&e[2].type!=="float64")throw new Error("Invalid input type.");if(e[0].type!==e[1].type||e.length===3&&e[0].type!==e[2].type)throw new Error("Input types are mismatched")}}),Z0,J0,_c,vc,wc,xc,$c,OS=k(()=>{"use strict";tt(),Oe(),Z0=(e,t,n)=>($c(t),[e.run(wc(e,t,n),t)]),J0=e=>{let t=e.attributes.getFloat("scale"),n=e.attributes.getFloats("bias");return Be({scale:t,bias:n})},_c={name:"ImageScaler",inputNames:["X"],inputTypes:[0]},vc=(e,t,n,s)=>{let u=n[0].dims.slice(),l=u.length,p=`
      ${xc(s.bias.length)}
      float process(int indices[${l}]) {
        return _X(indices) * scale + getBias(bias, indices[1]);
      }`;return{...t,output:{dims:u,type:n[0].type,textureType:0},variables:[{name:"bias",type:"float",arrayLength:s.bias.length,data:s.bias},{name:"scale",type:"float",data:s.scale}],shaderSource:p}},wc=(e,t,n)=>{let s={..._c,cacheHint:n.cacheKey};return{...s,get:()=>vc(e,s,t,n)}},xc=e=>{let t=[`float getBias(float bias[${e}], int channel) {`];for(let n=0;n<e;++n)n===0?t.push(`	if (channel == ${n}) { return bias[${n}]; }`):n===e-1?t.push(`	else { return bias[${n}]; }`):t.push(`	else if (channel == ${n}) { return bias[${n}]; }`);return t.push("	}"),t.join(`
`)},$c=e=>{if(!e||e.length!==1)throw new Error("ImageScaler requires 1 input.");if(e[0].dims.length!==4)throw new Error("Invalid input shape.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")}}),Q0,Y0,Jo,Tc,Sc,Ic,Oc,Ec,Pc,ES=k(()=>{"use strict";Le(),Oe(),Q0=(e,t,n)=>{Pc(t);let s=e.run(Sc(t[0]),t);return[e.run(Ec(e,t[0],n,s.dims),[t[0],s,t[1],t[2]])]},Y0=e=>e.attributes.getFloat("epsilon",1e-5),Jo={name:"InstanceNormalization_MeanAndVariance",inputNames:["X"],inputTypes:[0]},Tc=(e,t)=>{let n=t.dims.slice(),s=n[1],u=n[2]*n[3],l=[n[0],s],p=`
      vec4 process(int[2] indices) {
        vec4 v = vec4(0.0);
        int a[4];
        a[0] = indices[0];
        a[1] = indices[1];
        float temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += x;
          }
        }
        float mean = temp / float(${u});
        temp = 0.0;
        for(int a2=0; a2<${n[2]}; a2++) {
          a[2] = a2;
          for(int a3=0; a3<${n[3]}; a3++) {
            a[3] = a3;
            float x = _X(a);
            temp += (x - mean) * (x - mean);
          }
        }
        v.r = mean;
        v.g = temp / float(${u});

        return v;
      }`;return{...e,output:{dims:l,type:t.type,textureType:4},shaderSource:p}},Sc=e=>({...Jo,get:()=>Tc(Jo,e)}),Ic={name:"InstanceNormalization_ComputeOutput",inputNames:["X","MeanAndVariance","Scale","B"],inputTypes:[0,4,0,0]},Oc=(e,t,n,s,u)=>{let l=Se(e.session.backend.glContext.version),[p,d]=e.calculateTextureWidthAndHeight(u,4),[o,r]=[p/4,d],i=`
      vec4 get_MeanAndVariance(int[2] mv) {
        int offset = indicesToOffset_MeanAndVariance(mv);
        vec2 coords = offsetToCoords(offset, ${o}, ${r});
        return ${l.texture2D}(MeanAndVariance, coords);
      }

      float process(int[4] indices) {
        int mv[2];
        mv[0] = indices[0];
        mv[1] = indices[1];
        vec4 mean_and_variance = get_MeanAndVariance(mv);
        float mean = mean_and_variance.r;
        float variance = mean_and_variance.g;

        int sb[1];
        sb[0] = indices[1];
        float scale = _Scale(sb);
        float b = _B(sb);

        return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;
      }`;return{...t,output:{dims:n.dims,type:n.type,textureType:0},variables:[{name:"epsilon",type:"float",data:s}],shaderSource:i}},Ec=(e,t,n,s)=>{let u={...Ic,cacheHint:`${n}`};return{...u,get:()=>Oc(e,u,t,n,s)}},Pc=e=>{if(!e||e.length!==3)throw new Error("InstanceNormalization requires 3 inputs.");let t=e[0],n=e[1],s=e[2];if(t.dims.length<3||n.dims.length!==1||s.dims.length!==1)throw new Error("Invalid input shape.");if(n.dims[0]!==t.dims[1]||s.dims[0]!==t.dims[1])throw new Error("Input shapes are mismatched.");if(t.type!=="float32"&&t.type!=="float64"||n.type!=="float32"&&n.type!=="float64"||s.type!=="float32"&&s.type!=="float64")throw new Error("Invalid input type.");if(e[0].dims.length!==4)throw new Error("Only support 4-D input shape.")}});function PS(e,t){let n=e[0].dims[1],s=e[0].dims.length,u=-Math.floor((t.size-1)/2),l=Math.ceil((t.size-1)/2),p=`float(${t.alpha}) / float(${t.size})`,d=`float(${t.bias})`,o=`float(${t.beta})`,r=`
    float process(int indices[${s}]) {
        int c = indices[1];
        float x = _X(indices);
        float square_sum = 0.0;

        for (int i = ${u}; i <= ${l}; i++) {
          int idx = c + i;
          if (c >= 0 && c < ${n}) {
            indices[1] = idx;
            float j = _X(indices);
            square_sum += j * j;
          }
        }
        return x / pow(${d} + ${p} * square_sum, ${o});
    }`;return{...Pu,cacheHint:t.cacheKey,output:{dims:e[0].dims,type:e[0].type,textureType:0},shaderSource:r}}function AS(e,t){return{...Pu,cacheHint:t.cacheKey,get:()=>PS(e,t)}}var e_,t_,Pu,Ac,kS=k(()=>{"use strict";tt(),Oe(),e_=(e,t,n)=>(Ac(t),[e.run(AS(t,n),t)]),t_=e=>{let t=e.attributes.getFloat("alpha",1e-4),n=e.attributes.getFloat("beta",.75),s=e.attributes.getFloat("bias",1),u=e.attributes.getInt("size");return Be({alpha:t,beta:n,bias:s,size:u})},Pu={name:"LRN",inputNames:["X"],inputTypes:[0]},Ac=e=>{if(!e||e.length!==1)throw new Error("LRN requires 1 input.");if(e[0].dims.length!==4)throw new Error('currently only support LRN for input with "NCHW" format');if(e[0].type!=="float32")throw new Error("input should be float type")}}),kc,qs,r_,n_,i_,Dc,Cc,Nc,zc,Rc,Bc,Mc,jc,DS=k(()=>{"use strict";tt(),ke(),Le(),Oe(),kc={name:"Pad",inputNames:["A"],inputTypes:[0]},qs=(e,t,n)=>(Nc(t),[e.run({...kc,cacheHint:n.cacheKey,get:()=>Cc(e,t[0],n)},t)]),r_=e=>{let t=e.attributes.getString("mode","constant"),n=e.attributes.getFloat("value",0),s=e.attributes.getInts("pads");return Be({mode:t,value:n,pads:s})},n_=(e,t,n)=>{zc(t);let s=Dc(e,t,n);return qs(e,[t[0]],s)},i_=e=>e.attributes.getString("mode","constant"),Dc=(e,t,n)=>{if(!e.session.isInitializer(t[1].dataId)||t.length>=3&&!e.session.isInitializer(t[2].dataId))throw new Error("dynamic pad attributes are not allowed");let s=Array.from(t[1].integerData),u=t.length>=3?t[2].floatData[0]:0;return Be({mode:n,pads:s,value:u})},Cc=(e,t,n)=>{let s=ge.padShape(t.dims.slice(),n.pads),u=s.length,l=`
      ${Rc(e,t,n)}
      float process(int[${u}] indices) {
          return padA(indices);
      }`;return{name:"Pad",inputNames:["A"],inputTypes:[0],output:{dims:s,type:t.type,textureType:0},shaderSource:l}},Nc=e=>{if(!e||e.length!==1)throw new Error("Pad requires 1 input");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")},zc=e=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Pad requires 2 or 3 inputs");if(e[1].type!=="int32")throw new Error("Invalid input type.");if(e.length>=3&&e[2].type==="string")throw new Error("Invalid input type.")},Rc=(e,t,n)=>{let s=Se(e.session.backend.glContext.version),[u,l]=e.calculateTextureWidthAndHeight(t.dims,0),p=ge.computeStrides(t.dims);switch(n.mode){case"constant":return Bc(s,t.dims,p,u,l,n.pads,n.value);case"reflect":return Mc(s,t.dims,p,u,l,n.pads);case"edge":return jc(s,t.dims,p,u,l,n.pads);default:throw new Error("Invalid mode")}},Bc=(e,t,n,s,u,l,p)=>{let d=t.length,o="";for(let r=d-1;r>=0;--r)o+=`
        k = m[${r}] - ${l[r]};
        if (k < 0)  return constant;
        if (k >= ${t[r]}) return constant;
        offset += k * ${n[r]};
        `;return`
      float padA(int m[${d}]) {
        const float constant = float(${p});
        int offset = 0;
        int k = 0;
        ${o}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},Mc=(e,t,n,s,u,l)=>{let p=t.length,d="";for(let o=p-1;o>=0;--o)d+=`
        k = m[${o}] - ${l[o]};
        if (k < 0) { k = -k; }
        {
          const int _2n_1 = ${2*(t[o]-1)};
          k = int( mod( float(k), float(_2n_1) ) ) ;
          if(k >= ${t[o]}) { k = _2n_1 - k; }
        }
        offset += k * ${n[o]};
        `;return`
      float padA(int m[${p}]) {
        int offset = 0;
        int k = 0;
        ${d}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `},jc=(e,t,n,s,u,l)=>{let p=t.length,d="";for(let o=p-1;o>=0;--o)d+=`
        k = m[${o}] - ${l[o]};
        if (k < 0)  k = 0;
        if (k >= ${t[o]}) k = ${t[o]-1};
        offset += k * ${n[o]};
      `;return`
      float padA(int m[${p}]) {
        int offset = 0;
        int k = 0;
        ${d}
        vec2 coords = offsetToCoords(offset, ${s}, ${u});
        float value = getColorAsFloat(${e.texture2D}(A, coords));
        return value;
      }
      `}}),o_,a_,Qo,s_,u_,l_,d_,Yo,ea,Fc,ta,p_,Pn,ra,An,Lc,CS=k(()=>{"use strict";tt(),ke(),Oe(),o_=(e,t,n)=>{Pn(t);let s={name:"AveragePool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[e.run({...s,get:()=>Qo(t,s,!1,n)},t)]},a_=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),s=e.attributes.getInt("count_include_pad",0)!==0,u=e.attributes.getInts("kernel_shape"),l=e.attributes.getInts("strides",[]),p=e.attributes.getInts("pads",[]);if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");return Be({autoPad:t,ceilMode:n,countIncludePad:s,kernelShape:u,strides:l,pads:p})},Qo=(e,t,n,s)=>{let[u,l]=ea(e,s,n),p=ge.size(u.kernelShape),d="value += _X(x);",o="";u.countIncludePad?o+=`value /= float(${p});`:o+=`value /= float(${p} - pad);`;let r=`
        ${ra(e[0].dims,u,d,o,"0.0")}
      `;return{...t,output:{dims:l,type:e[0].type,textureType:0},shaderSource:r}},s_=(e,t,n)=>{Pn(t);let s={name:"GlobalAveragePool",inputNames:["X"],inputTypes:[0],cacheHint:`${n.countIncludePad}`};return[e.run({...s,get:()=>Qo(t,s,!0,n)},t)]},u_=e=>{let t=e.attributes.getInt("count_include_pad",0)!==0;return Be({autoPad:"",ceilMode:0,countIncludePad:t,kernelShape:[],strides:[],pads:[]})},l_=(e,t,n)=>{Pn(t);let s={name:"MaxPool",inputNames:["X"],inputTypes:[0],cacheHint:n.cacheKey};return[e.run({...s,get:()=>Yo(t,s,!1,n)},t)]},d_=e=>{let t=e.attributes.getString("auto_pad","NOTSET"),n=e.attributes.getInt("ceil_mode",0),s=e.attributes.getInts("kernel_shape"),u=e.attributes.getInts("strides",[]),l=e.attributes.getInts("pads",[]),p=e.attributes.getInt("storage_order",0),d=e.attributes.getInts("dilations",[]);if(p!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(n!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");return Be({autoPad:t,ceilMode:n,countIncludePad:!1,kernelShape:s,strides:u,pads:l,storageOrder:p,dilations:d})},Yo=(e,t,n,s)=>{let[u,l]=ea(e,s,n),p=`
      ${ra(e[0].dims,u,`
      value = max(_X(x), value);
    `,"","-1e5")}
    `;return{...t,output:{dims:l,type:e[0].type,textureType:0},shaderSource:p}},ea=(e,t,n)=>{let s=e[0].dims.slice(),u=Object.hasOwnProperty.call(t,"dilations"),l=t.kernelShape.slice(),p=t.strides.slice(),d=u?t.dilations.slice():[],o=t.pads.slice();qi.adjustPoolAttributes(n,s,l,p,d,o);let r=qi.computePoolOutputShape(n,s,p,d,l,o,t.autoPad),i=Object.assign({},t);return u?Object.assign(i,{kernelShape:l,strides:p,pads:o,dilations:d,cacheKey:t.cacheKey}):Object.assign(i,{kernelShape:l,strides:p,pads:o,cacheKey:t.cacheKey}),[i,r]},Fc={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[],cacheKey:""},ta={name:"GlobalMaxPool",inputNames:["X"],inputTypes:[0]},p_=(e,t)=>(Pn(t),[e.run({...ta,get:()=>Yo(t,ta,!0,Fc)},t)]),Pn=e=>{if(!e||e.length!==1)throw new Error("Pool ops requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.")},ra=(e,t,n,s,u)=>{let l=e.length;if(t.kernelShape.length<=2){let p=t.kernelShape[t.kernelShape.length-1],d=t.strides[t.strides.length-1],o=t.pads[t.pads.length/2-1],r=t.pads[t.pads.length-1],i=e[l-1],a="",c="",h="";if(o+r!==0?a=`
          for (int i = 0; i < ${p}; i++) {
            x[${l} - 1] = indices[${l} - 1] * ${d} - ${o} + i;
            if (x[${l} - 1] < 0 || x[${l} - 1] >= ${i}) {
              pad++;
              continue;
            }
            ${n}
          }`:a=`
          for (int i = 0; i < ${p}; i++) {
            x[${l} - 1] = indices[${l} - 1] * ${d} - ${o} + i;
            ${n}
          }`,t.kernelShape.length===2){let m=t.kernelShape[t.kernelShape.length-2],b=t.strides[t.strides.length-2],x=t.pads[t.pads.length/2-2],w=t.pads[t.pads.length-2],_=e[l-2];x+w!==0?c=`
            for (int j = 0; j < ${m}; j++) {
              x[${l} - 2] = indices[${l} - 2] * ${b} - ${x} + j;
              if (x[${l} - 2] < 0 || x[${l} - 2] >= ${_}) {
                pad+= ${p};
                continue;
              }
          `:c=`
            for (int j = 0; j < ${m}; j++) {
              x[${l} - 2] = indices[${l} - 2] * ${b} - ${x} + j;
            `,h=`
          }
        `}return`
        float process(int indices[${l}]) {
          int x[${l}];
          copyVec(indices, x);

          float value = ${u};
          int pad = 0;
          ${c}
          ${a}
          ${h}
          ${s}
          return value;
        }
      `}else{let p=ge.size(t.kernelShape),d=ge.computeStrides(t.kernelShape),o=d.length,r=t.pads.length,i=Lc(o),a=An(e,"inputDims"),c=An(t.pads,"pads"),h=An(d,"kernelStrides"),m=An(t.strides,"strides"),b=t.pads.reduce((w,_)=>w+_),x="";return b?x=`
            if (x[j] >= inputDims[j] || x[j] < 0) {
              pad++;
              isPad = true;
              break;
            }
          }
          if (!isPad) {
            ${n}
          }`:x=`
          }
          ${n}
        `,`
        ${i}
        float process(int indices[${l}]) {
          int x[${l}];
          copyVec(indices, x);
          int offset[${o}];
          int pads[${r}];
          int inputDims[${l}];
          int kernelStrides[${o}];
          int strides[${o}];
          ${c}
          ${a}
          ${m}
          ${h}

          float value = ${u};
          int pad = 0;
          bool isPad = false;
          for (int i = 0; i < ${p}; i++) {
            offsetToIndices(i, kernelStrides, offset);
            isPad = false;
            for (int j = ${l} - ${o}; j < ${l}; j++) {
              x[j] = indices[j] * strides[j - ${l} + ${o}]
                + offset[j - ${l} + ${o}] - pads[j - 2];
              ${x}
          }
          ${s}

          return value;
        }
      `}},An=(e,t)=>{let n="";for(let s=0;s<e.length;s++)n+=`
      ${t}[${s}] = ${e[s]};
    `;return n},Lc=e=>`
  void offsetToIndices(int offset, int[${e}] strides, out int[${e}] indices) {
    if (${e} == 0) {
      return;
    }
    for (int i = 0; i < ${e} - 1; ++i) {
      indices[i] = offset / strides[i];
      offset -= indices[i] * strides[i];
    }
    indices[${e} - 1] = offset;
  }`}),rr,dr,Vc,Uc,c_,h_,f_,m_,g_,b_,y_,NS=k(()=>{"use strict";tt(),ao(),ke(),Oe(),rr=(e,t,n,s,u)=>{Uc(t);let l={name:s,inputNames:["A"],inputTypes:[0]};return[e.run({...l,cacheHint:n.cacheKey,get:()=>Vc(e,t,n,s,u,l)},t)]},dr=e=>{let t=e.attributes.getInts("axes",[]),n=e.attributes.getInt("keepdims",1)===1;return Be({axes:t,keepDims:n})},Vc=(e,t,n,s,u,l)=>{let p=[],d=t[0].dims.length||1,o=[],r=ge.normalizeAxes(n.axes,t[0].dims.length),i=u(t,r),a=i[1];for(let h=0;h<t[0].dims.length;h++)r.indexOf(h)>=0||r.length===0?(n.keepDims&&p.push(1),a=`
          for(int j${h} = 0; j${h} < ${t[0].dims[h]}; j${h}++) {
            inputIdx[${h}] = j${h};
            ${a}
          }`):(o.push(`inputIdx[${h}] = outputIdx[${p.length}];`),p.push(t[0].dims[h]));let c=`
      float process(int outputIdx[${p.length||1}]) {
        float value;                 // final result
        int inputIdx[${d}];      // addressing input data
        ${o.join(`
`)}
        ${i[0]}       // init ops for reduce max/min
        ${a}
        ${i[2]}       // final computation for reduce mean
        return value;
      }`;return{...l,output:{dims:p,type:t[0].type,textureType:0},shaderSource:c}},Uc=e=>{if(!e||e.length!==1)throw new Error("Reduce op requires 1 input.");if(ui.indexOf(e[0].type)===-1)throw new Error("Invalid input type.")},c_=(e,t,n)=>rr(e,t,n,"ReduceSum",()=>["value = 0.0;","value += _A(inputIdx);",""]),h_=(e,t,n)=>rr(e,t,n,"ReduceMean",(s,u)=>{let l=1;for(let p=0;p<s[0].dims.length;p++)(u.indexOf(p)>=0||u.length===0)&&(l*=s[0].dims[p]);return["value = 0.0;","value += _A(inputIdx);",`value /= ${l}.;`]}),f_=(e,t,n)=>rr(e,t,n,"ReduceMax",(s,u)=>{let l=[];for(let p=0;p<s[0].dims.length;p++)(u.indexOf(p)>=0||u.length===0)&&l.push(`inputIdx[${p}] = 0;`);return[`${l.join(`
`)}
value = _A(inputIdx);`,"value = max(value, _A(inputIdx));",""]}),m_=(e,t,n)=>rr(e,t,n,"ReduceMin",(s,u)=>{let l=[];for(let p=0;p<s[0].dims.length;p++)(u.indexOf(p)>=0||u.length===0)&&l.push(`inputIdx[${p}] = 0;`);return[`${l.join(`
`)}
value = _A(inputIdx);`,"value = min(value, _A(inputIdx));",""]}),g_=(e,t,n)=>rr(e,t,n,"ReduceProd",()=>["value = 1.0;","value *= _A(inputIdx);",""]),b_=(e,t,n)=>rr(e,t,n,"ReduceLogSum",()=>["value = 0.0;","value += _A(inputIdx);","value = log(value);"]),y_=(e,t,n)=>rr(e,t,n,"ReduceLogSumSquare",()=>["float t; value = 0.0;","t = _A(inputIdx); value += t * t;",""])}),__,zS=k(()=>{"use strict";ke(),__=(e,t)=>{let n=ge.calculateReshapedDims(t[0].dims,t[1].integerData);return e.session.pack?[e.reshapePacked(t[0],n)]:[e.reshapeUnpacked(t[0],n)]}}),na,Gs,v_,w_,Yn,qc,Hs,Hi,x_=k(()=>{"use strict";tt(),Le(),Oe(),na={name:"Upsample",inputNames:["X"],inputTypes:[0]},Gs=(e,t,n)=>(Hs(t,n),[e.run({...na,cacheHint:n.cacheKey,get:()=>qc(e,t,n)},t)]),v_=e=>Yn(e,7),w_=e=>Yn(e,9),Yn=(e,t)=>{let n=t>=10,s=e.attributes.getString("mode","nearest");if(s!=="nearest"&&s!=="linear"&&(t<11||s!=="cubic"))throw new Error(`unrecognized mode: ${s}`);let u=[];t<9&&(u=e.attributes.getFloats("scales"),Hi(u,s,n));let l=e.attributes.getFloat("extrapolation_value",0),p=t>10?e.attributes.getString("coordinate_transformation_mode","half_pixel"):"asymmetric";if(["asymmetric","pytorch_half_pixel","tf_half_pixel_for_nn","align_corners","tf_crop_and_resize","half_pixel"].indexOf(p)===-1)throw new Error(`coordinate_transform_mode '${p}' is not supported`);let d=p==="tf_crop_and_resize",o=d,r=s==="nearest"&&t>=11?e.attributes.getString("nearest_mode","round_prefer_floor"):"";if(["round_prefer_floor","round_prefer_ceil","floor","ceil",""].indexOf(r)===-1)throw new Error(`nearest_mode '${r}' is not supported`);let i=e.attributes.getFloat("cubic_coeff_a",-.75),a=e.attributes.getInt("exclude_outside",0)!==0;if(a&&s!=="cubic")throw new Error("exclude_outside can be set to 1 only when mode is CUBIC.");let c=t<11?!0:s==="nearest"&&p==="asymmetric"&&r==="floor",h=0,m=0,b=0;return t>10?e.inputs.length>2?(h=1,m=2,b=3):(m=1,b=2):t===9&&(m=1),Be({opset:t,isResize:n,mode:s,scales:u,extrapolationValue:l,coordinateTransformMode:p,useExtrapolation:o,needRoiInput:d,nearestMode:r,cubicCoefficientA:i,excludeOutside:a,useNearest2xOptimization:c,roiInputIdx:h,scalesInputIdx:m,sizesInputIdx:b})},qc=(e,t,n)=>{let s=Se(e.session.backend.glContext.version),[u,l]=e.calculateTextureWidthAndHeight(t[0].dims,0),p=t[0].dims.map((b,x)=>Math.floor(b*n.scales[x])),[d,o]=e.calculateTextureWidthAndHeight(p,0),r=p.length,i=new Array(r),a=new Array(r),c=`
      int output_pitches[${r}];
      int input_pitches[${r}];
      `;for(let b=r-1;b>=0;b--)i[b]=b===r-1?1:i[b+1]*p[b+1],a[b]=b===r-1?1:a[b+1]*t[0].dims[b+1],c+=`
        output_pitches[${b}] = ${i[b]};
        input_pitches[${b}] = ${a[b]};
        `;let h=`
      float getInputFloat(int index) {
        vec2 coords = offsetToCoords(index, ${u}, ${l});
        float value = getColorAsFloat(${s.texture2D}(X, coords));
        return value;
      }
      `,m=n.mode==="nearest"?`
    ${h}
    float process(int indices[${r}]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${d}, ${o});

      ${c}

      int d, m;
      for (int dim = 0; dim < ${r}; ++dim) {
        d = output_index / output_pitches[dim];
        m = output_index - d * output_pitches[dim];
        output_index = m;

        if (scales[dim] != 1 && d > 0) {
          int d2 = d / scales[dim];
          m = d - d2 * scales[dim];
          d = d2;
        }
        input_index += input_pitches[dim] * d;
      }

      return getInputFloat(input_index);
    }`:r===4?`
    ${h}
    float process(int indices[4]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${d}, ${o});

      ${c}

      int m;
      int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m / output_pitches[1];
      m = m - index_of_dim1 * output_pitches[1];
      index_of_dim2 = m / output_pitches[2];
      m = m - index_of_dim2 * output_pitches[2];
      index_of_dim3 = m;

      int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;
      index_of_input_dim2 = index_of_dim2 / scales[2];
      y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];
      index_of_input_dim3 = index_of_dim3 / scales[3];
      x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];

      input_index = index_of_dim0 * input_pitches[0] +
            index_of_dim1 * input_pitches[1] +
            index_of_input_dim2 * input_pitches[2] +
            index_of_input_dim3;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim2 = false;
      if (index_of_input_dim2 == (${t[0].dims[2]} - 1)) {
        // It's the end in dimension 2
        x01 = x00;
        end_of_dim2 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[2]);
      }

      if (index_of_input_dim3 == (input_pitches[2] - 1)) {
        // It's the end in dimension 3
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);
    }`:`
    ${h}
    float process(int indices[2]) {
      int input_index = 0;
      int output_index = coordsToOffset(TexCoords, ${d}, ${o});

      ${c}

      int m;
      int index_of_dim0, index_of_dim1;
      index_of_dim0 = output_index / output_pitches[0];
      m = output_index - index_of_dim0 * output_pitches[0];
      index_of_dim1 = m;

      int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;
      index_of_input_dim0 = index_of_dim0 / scales[0];
      y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];
      index_of_input_dim1 = index_of_dim1 / scales[1];
      x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];

      input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;

      float x00 = getInputFloat(input_index);
      float x10, x01, x11;

      bool end_of_dim0 = false;
      if (index_of_input_dim0 == (${t[0].dims[0]} - 1)) {
        // It's the end in dimension 0
        x01 = x00;
        end_of_dim0 = true;
      } else {
        x01 = getInputFloat(input_index + input_pitches[0]);
      }

      if (index_of_input_dim1 == (input_pitches[0] - 1)) {
        // It's the end in dimension 1
        x10 = x00;
        x11 = x01;
      }
      else {
        x10 = getInputFloat(input_index + 1);
        x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);
      }

      float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);
      float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);
      return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);
    }`;return{...na,output:{dims:p,type:t[0].type,textureType:0},shaderSource:m,variables:[{name:"scales",type:"int",arrayLength:n.scales.length,data:n.scales.map(b=>Math.ceil(b))}]}},Hs=(e,t)=>{if(!e||t.opset<9&&e.length!==1||t.opset>=9&&t.opset<11&&e.length!==2||t.opset>=11&&e.length<2)throw new Error("invalid inputs.");if(t.scales.length>0&&e[0].dims.length!==t.scales.length)throw new Error("Invalid input shape.");if(e[0].type==="string")throw new Error("Invalid input tensor types.")},Hi=(e,t,n)=>{if(n){for(let s of e)if(s<=0)throw new Error("Scale value should be greater than 0.")}else for(let s of e)if(s<1)throw new Error("Scale value should be greater than or equal to 1.");if((t==="linear"||t==="cubic")&&e.length!==2&&(e.length!==4||e[0]!==1||e[1]!==1))throw new Error(`'Linear' mode and 'Cubic' mode only support 2-D inputs ('Bilinear', 'Bicubic')         or 4-D inputs with the corresponding outermost 2 scale values being 1         in the ${n?"Resize":"Upsample"} opeartor.`)}}),Ti,Ws,$_,T_,Gc,Hc,Wc,Kc,RS=k(()=>{"use strict";Le(),Oe(),Zt(),_n(),x_(),Ti={name:"Resize",inputNames:["A"],inputTypes:[2]},Ws=(e,t,n)=>(Hs(t,n),[e.run({...Ti,cacheHint:n.cacheKey,get:()=>Gc(e,t,n)},t)]),$_=e=>Yn(e,10),T_=e=>Yn(e,11),Gc=(e,t,n)=>{let s=Se(e.session.backend.glContext.version),[u,l]=Hc(t,n);if(u.every(_=>_===1)&&n.coordinateTransformMode!=="tf_crop_and_resize")return{...Ti,output:{dims:l,type:t[0].type,textureType:2},hasMain:!0,shaderSource:`void main() {
                    vec4 v = ${s.texture2D}(X, TexCoords);
                    ${s.output} = v;
                }`};let p=l.length;if(p<2)throw new Error(`output dimension should be at least 2, but got ${p}`);let d=l[p-2],o=l[p-1],r=t[0].dims;if(p!==r.length)throw new Error(`output dimension should match input ${r.length}, but got ${p}`);let i=r[p-2],a=r[p-1],c=u[p-2],h=u[p-1],m="";if(n.mode!=="linear")throw new Error(`resize (packed) does not support mode: '${n.mode}'`);switch(n.coordinateTransformMode){case"asymmetric":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return vec4(coords) / scaleWHWH;
                    }
                `;break;case"half_pixel":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        return (vec4(coords) + 0.5) / scaleWHWH - 0.5;
                    }
                `;break;case"pytorch_half_pixel":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 fcoords = vec4(coords);
                        return vec4(
                            ${o}.0 > 1.0 ? (fcoords.x + 0.5) / scaleWHWH.x - 0.5 : 0.0,
                            ${d}.0 > 1.0 ? (fcoords.y + 0.5) / scaleWHWH.y - 0.5 : 0.0,
                            ${o}.0 > 1.0 ? (fcoords.z + 0.5) / scaleWHWH.z - 0.5 : 0.0,
                            ${d}.0 > 1.0 ? (fcoords.w + 0.5) / scaleWHWH.w - 0.5 : 0.0
                          );
                    }
                `;break;case"align_corners":m=`
                    vec4 getSourceFracIndex(ivec4 coords) {
                        vec4 resized = vec4(${o}.0 - 1.0, ${d}.0 - 1.0, ${o}.0 - 1.0,
                            ${d}.0 - 1.0);
                        vec4 original = vec4(${a}.0 - 1.0, ${i}.0 - 1.0, ${a}.0 - 1.0,
                            ${i}.0 - 1.0);
                        vec4 new_scale = original / resized;
                        return vec4(coords) * new_scale;
                    }
                `;break;default:throw new Error(`resize (packed) does not support coordinateTransformMode:                                 '${n.coordinateTransformMode}'`)}let b=cr(p),x=ai(),w=`
            const vec2 inputWH = vec2(${i}.0, ${a}.0);
            const vec4 scaleWHWH = vec4(float(${c}), float(${h}), float(${c}), float(${h}));
            ${x}
            ${m}
            float getAValue(int x10, int r, int c, int d) {
                return getChannel(getA(x10, r, c, d), vec2(c, d));
            }
            void main() {
                ${b} rc = getOutputCoords();

                int batch = rc[0];
                int depth = rc[1];

                // retrieve the 4 coordinates that is used in the 4 packed output values.
                ivec4 coords = ivec4(rc.wz, rc.w + 1, rc.z + 1);

                // calculate the source index in fraction
                vec4 sourceFrac = getSourceFracIndex(coords);

                // get the lower and upper bound of the 4 values that will be packed into one texel.
                ivec4 x00 = ivec4(max(sourceFrac.xy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xy)));
                ivec4 x01 = ivec4(max(sourceFrac.xw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.xw)));
                ivec4 x10 = ivec4(max(sourceFrac.zy, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zy)));
                ivec4 x11 = ivec4(max(sourceFrac.zw, vec2(0.0)), min(inputWH - 1.0, ceil(sourceFrac.zw)));

                bool hasNextRow = rc.w < ${d-1};
                bool hasNextCol = rc.z < ${o-1};

                // pack x00, x01, x10, x11's top-left corner into one vec4 structure
                vec4 topLeft = vec4(
                    getAValue(batch, depth, x00.x, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.y) : 0.0);

                // pack x00, x01, x10, x11's top-right corner into one vec4 structure
                vec4 topRight = vec4(
                    getAValue(batch, depth, x00.x, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.x, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.x, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.x, x11.w) : 0.0);

                // pack x00, x01, x10, x11's bottom-left corner into one vec4 structure
                vec4 bottomLeft = vec4(
                    getAValue(batch, depth, x00.z, x00.y),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.y) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.y) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.y) : 0.0);

                // pack x00, x01, x10, x11's bottom-right corner into one vec4 structure
                vec4 bottomRight = vec4(
                    getAValue(batch, depth, x00.z, x00.w),
                    hasNextCol ? getAValue(batch, depth, x01.z, x01.w) : 0.0,
                    hasNextRow ? getAValue(batch, depth, x10.z, x10.w) : 0.0,
                    (hasNextRow && hasNextCol) ? getAValue(batch, depth, x11.z, x11.w) : 0.0);

                // calculate the interpolation fraction on u and v direction
                vec4 frac = vec4(sourceFrac) - floor(sourceFrac);
                vec4 clampFrac = clamp(frac, vec4(0.0), vec4(1.0));

                vec4 top = mix(topLeft, topRight, clampFrac.ywyw);
                vec4 bottom = mix(bottomLeft, bottomRight, clampFrac.ywyw);
                vec4 newValue = mix(top, bottom, clampFrac.xxzz);

                ${s.output} = vec4(newValue);
            }
        `;return{...Ti,output:{dims:l,type:t[0].type,textureType:2},hasMain:!0,shaderSource:w}},Hc=(e,t)=>{let n=e[0].dims,s=t.scales,u;if(s.length===0){let p=e[t.scalesInputIdx];if(p&&p.size!==0){if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");s=Wc(p,t.mode,t.isResize)}else{let d=e[t.sizesInputIdx];if(!d||d.size===0)throw new Error("Either scales or sizes MUST be provided as input.");u=Array.from(d.integerData),s=Kc(u,n,t.mode,t.isResize)}}else if(e[t.sizesInputIdx])throw new Error("Only one of scales or sizes must be provided as input.");let l=u||n.map((p,d)=>Math.floor(p*s[d]));return[s,l]},Wc=(e,t,n)=>{let s=Array.from(e.floatData);return Hi(s,t,n),s},Kc=(e,t,n,s)=>{let u=t.length,l=new Array(u);for(let p=0,d=u;p<d;p++)if(t[p]===0){if(e[p]!==0)throw new Error("Input dim is zero but required output dim is non-zero.");l[p]=1}else l[p]=e[p]/t[p];return Hi(l,n,s),l}}),S_,Xc,BS=k(()=>{"use strict";yn(),S_=(e,t)=>(Xc(t),[new ct([t[0].dims.length],"int32",void 0,void 0,new Int32Array(t[0].dims))]),Xc=e=>{if(!e||e.length!==1)throw new Error("Shape requires 1 input.")}}),Si,I_,O_,ia,Zc,E_,Jc,Qc,MS=k(()=>{"use strict";tt(),ao(),ke(),Oe(),Si={name:"Slice",inputNames:["A"],inputTypes:[0]},I_=(e,t,n)=>(Zc(t),[e.run({...Si,cacheHint:n.cacheKey,get:()=>ia(e,t[0],n)},t)]),O_=e=>{let t=e.attributes.getInts("starts"),n=e.attributes.getInts("ends"),s=e.attributes.getInts("axes",[]);return Be({starts:t,ends:n,axes:s})},ia=(e,t,n)=>{let s=n.axes.length===0?t.dims.slice(0).map((i,a)=>a):n.axes,u=ge.normalizeAxes(s,t.dims.length),l=n.starts.map((i,a)=>i>t.dims[u[a]]-1?t.dims[u[a]]:ge.normalizeAxis(i,t.dims[u[a]])),p=n.ends.map((i,a)=>i>t.dims[u[a]]-1?t.dims[u[a]]:ge.normalizeAxis(i,t.dims[u[a]])),d=t.dims.slice(),o=[];for(let i=0;i<u.length;i++)d[u[i]]=p[i]-l[i],l[i]>0&&o.push(`outputIdx[${u[i]}] += ${l[i]};`);let r=`
      float process(int outputIdx[${d.length}]) {
        ${o.join(`
      `)}
        return _A(outputIdx);
      }`;return{...Si,output:{dims:d,type:t.type,textureType:0},shaderSource:r}},Zc=e=>{if(!e||e.length!==1)throw new Error("Slice requires 1 input.");if(ui.indexOf(e[0].type)===-1)throw new Error("Invalid input type.")},E_=(e,t)=>{Qc(t);let n=Jc(e,t);return[e.run({...Si,cacheHint:n.cacheKey,get:()=>ia(e,t[0],n)},[t[0]])]},Jc=(e,t)=>{if(!e.session.isInitializer(t[1].dataId)||!e.session.isInitializer(t[2].dataId)||t.length>=4&&!e.session.isInitializer(t[3].dataId)||t.length>=5&&!e.session.isInitializer(t[4].dataId))throw new Error("dynamic slice attributes are not allowed");if(t.length>=5&&t[4].integerData.some(p=>p!==1))throw new Error("currently non-1 steps is not supported for Slice");let n=Array.from(t[1].integerData),s=Array.from(t[2].integerData),u=t.length>=4?Array.from(t[3].integerData):[],l=`${u};${n};${s}`;return{starts:n,ends:s,axes:u,cacheKey:l}},Qc=e=>{if(!e||e.length<3||e.length>5)throw new Error("Invalid input number.");if(e[1].type!=="int32"||e[1].dims.length!==1)throw new Error("Invalid input type.");if(e[2].type!=="int32"||e[2].dims.length!==1)throw new Error("Invalid input type.");if(e.length>=4&&(e[3].type!=="int32"||e[3].dims.length!==1))throw new Error("Invalid input type.");if(e.length>=5&&(e[4].type!=="int32"||e[4].dims.length!==1))throw new Error("Invalid input type.")}}),oa,aa,sa,P_,A_,k_,D_,ua,Yc,eh,th,la,jS=k(()=>{"use strict";tt(),ke(),Le(),Oe(),Eu(),oa={name:"SoftmaxComputeMax",inputNames:["A"],inputTypes:[0]},aa={name:"SoftmaxComputeScale",inputNames:["A","Max"],inputTypes:[0,0]},sa={name:"SoftMax",inputNames:["A","Max","Norm"],inputTypes:[0,0,0]},P_=(e,t,n)=>{la(t);let s=t[0].dims.slice(),u=ge.normalizeAxis(n.axis,s.length),l=ge.sizeToDimension(s,u),p=ge.sizeFromDimension(s,u);return ua(e,t,n,l,p)},A_=e=>Be({axis:e.attributes.getInt("axis",1)}),k_=e=>Be({axis:e.attributes.getInt("axis",-1)}),D_=(e,t,n)=>{la(t);let s=t[0].dims.slice(),u=ge.normalizeAxis(n.axis,s.length),l=s.length,p=u!==l-1,d=[],o=[],r=[],i;p&&(o=Array.from({length:l}).map((m,b)=>b),o[u]=l-1,o[l-1]=u,o.map(m=>d.push(s[m])),i=Be({perm:o}),r=ni(e,t,i));let a=p?ge.sizeToDimension(d,l-1):ge.sizeToDimension(s,l-1),c=p?ge.sizeFromDimension(d,l-1):ge.sizeFromDimension(s,l-1),h=ua(e,p?r:t,n,a,c);return p?ni(e,h,i):h},ua=(e,t,n,s,u)=>{let l=Yc(e,t[0],s,u,[s]),p=e.run({...oa,cacheHint:n.cacheKey,get:()=>l},t),d=eh(e,t[0],s,u,l.output.dims,[s]),o=e.run({...aa,cacheHint:n.cacheKey,get:()=>d},[t[0],p]),r=th(e,t[0],s,u,l.output.dims,d.output.dims);return[e.run({...sa,cacheHint:n.cacheKey,get:()=>r},[t[0],p,o])]},Yc=(e,t,n,s,u)=>{let[l,p]=e.calculateTextureWidthAndHeight(t.dims,0),d=u.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(u.length!==1)throw new Error("Dimensionality of the output should be 1");if(u[0]!==n)throw new Error("Shape of the output should be equal to logical row count");let o=Se(e.session.backend.glContext.version),r=`
      float process(int[${d}] indices) {
        int logical_row_start_offset = indices[0] * ${s};

        float max = getColorAsFloat(${o.texture2D}(A, offsetToCoords(logical_row_start_offset, ${l},
        ${p} )));
        for(int i=1; i<${s}; ++i)
        {
          float current = getColorAsFloat(${o.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${l}, ${p})));
          if(current > max)
          max = current;
        }

        return max;
      }`;return{...oa,output:{dims:u,type:t.type,textureType:0},shaderSource:r}},eh=(e,t,n,s,u,l)=>{let[p,d]=e.calculateTextureWidthAndHeight(t.dims,0),o=l.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(l.length!==1)throw new Error("Dimensionality of the output should be 1");if(l[0]!==n)throw new Error("Shape of the output should be equal to logical row count");if(u.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(u[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let r=Se(e.session.backend.glContext.version),i=`
      float process(int[${o}] indices) {
        int logical_row_start_offset = indices[0] * ${s};

        float norm_factor = 0.0;
        float max = _Max(indices);
        for(int i=0; i<${s}; ++i)
        {
          norm_factor += exp(getColorAsFloat(${r.texture2D}(A, offsetToCoords(logical_row_start_offset + i,
            ${p}, ${d}))) - max);
        }

        return norm_factor;
      }`;return{...aa,output:{dims:l,type:t.type,textureType:0},shaderSource:i}},th=(e,t,n,s,u,l)=>{let[p,d]=e.calculateTextureWidthAndHeight(t.dims,0),o=t.dims.length;if(n<1||s<1)throw new Error("Logical row count N and feature count D must be greater than or equal to 1");if(u.length!==1||l.length!==1)throw new Error("Dimensionality of the intermediate results should be 1");if(u[0]!==n||l[0]!==n)throw new Error("Shape of the intermediate results should be equal to logical row count");let r=`
      float process(int[${o}] indices) {

      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)
      int offset = coordsToOffset(TexCoords, ${p}, ${d});

      //determine the logical row for this index
      int logical_row_index[1];
      logical_row_index[0] = offset / ${s};

      float norm_factor = _Norm(logical_row_index);

      // avoid possible division by 0
      // if norm_facor is 0, all elements are zero
      // if so, return 0
      if(norm_factor == 0.0)
        return 0.0;

      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;
    }`;return{...sa,output:{dims:t.dims,type:t.type,textureType:0},shaderSource:r}},la=e=>{if(!e||e.length!==1)throw new Error("Softmax requires 1 input.");if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type")}}),da,C_,N_,rh,nh,ih,FS=k(()=>{"use strict";tt(),ke(),Oe(),da={name:"Split",inputNames:["A"],inputTypes:[0]},C_=(e,t,n)=>{ih(t);let s=ge.normalizeAxis(n.axis,t[0].dims.length),u=rh(e,t,s,n),l=[];for(let p=0;p<u;++p)l.push(e.run({...da,cacheHint:`${n.cacheKey};${p}`,get:()=>nh(e,t[0],n,s,p)},t));return l},N_=e=>{let t=e.attributes.getInt("axis",0),n=e.attributes.getInts("split",[]),s=e.outputs.length;return Be({axis:t,split:n,numOutputs:s})},rh=(e,t,n,s)=>{let[,u]=ks.splitShape(t[0].dims,n,s.split,s.numOutputs);return u.length},nh=(e,t,n,s,u)=>{let[l,p]=ks.splitShape(t.dims,s,n.split,n.numOutputs),d=p[u],o=l[u],r=`
      float process(int indices[${o.length}]) {
        indices[${s}] += ${d};
        return _A(indices);
      }
    `;return{...da,cacheHint:`${n.cacheKey}:${u}`,output:{dims:o,type:t.type,textureType:0},shaderSource:r}},ih=e=>{if(!e||e.length!==1)throw new Error("Split requires one input.");if(e[0].type!=="int8"&&e[0].type!=="uint8"&&e[0].type!=="int16"&&e[0].type!=="uint16"&&e[0].type!=="int32"&&e[0].type!=="uint32"&&e[0].type!=="float32"&&e[0].type!=="float64"&&e[0].type!=="bool")throw new Error("Invalid input type.")}}),Ks,z_,R_,oh,ah,LS=k(()=>{"use strict";ke(),Ks=(e,t,n)=>{oh(t);let s=ge.squeezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},z_=(e,t)=>(ah(t),Ks(e,[t[0]],Array.from(t[1].integerData))),R_=e=>e.attributes.getInts("axes"),oh=e=>{if(!e||e.length!==1)throw new Error("Squeeze requires 1 input.");if(e[0].type==="string")throw new Error("invalid input tensor types.")},ah=e=>{if(!e||e.length!==2)throw new Error("Squeeze requires 2 inputs.");if(e[1].type!=="int32")throw new Error("Invalid input type.")}}),B_,sh,uh,VS=k(()=>{"use strict";Le(),Oe(),B_=(e,t)=>{uh(t);let n={name:"Sum",inputNames:t.map((s,u)=>`X${u}`),inputTypes:new Array(t.length).fill(0)};return[e.run({...n,get:()=>sh(e,t,n)},t)]},sh=(e,t,n)=>{let s=Se(e.session.backend.glContext.version),u=t[0].dims.slice(),l=`
      void main() {
        vec4 result = ${t.map((p,d)=>`${s.texture2D}(X${d},TexCoords)`).join(" + ")};
        ${s.output} = result;
      }
    `;return{...n,output:{dims:u,type:t[0].type,textureType:0},hasMain:!0,shaderSource:l}},uh=e=>{if(!e||e.length===0)throw new Error("Sum requires inputs.");let t=e[0].dims.length;for(let n=1;n<e.length;n++){if(t!==e[n].dims.length)throw new Error("Input shapes are mismatched.");for(let s=0;s<t;s++)if(e[0].dims[s]!==e[n].dims[s])throw new Error("Input shapes are not matched.")}if(e[0].type!=="float32"&&e[0].type!=="float64")throw new Error("Invalid input type.");for(let n=1;n<e.length;n++)if(e[0].type!==e[n].type)throw new Error("Input types are not matched.")}}),M_,lh,dh,US=k(()=>{"use strict";ao(),Oe(),M_=(e,t)=>{dh(t);let n={name:"Tile",inputNames:["A"],inputTypes:[0]};return[e.run({...n,get:()=>lh(e,t,n)},t)]},lh=(e,t,n)=>{let s=t[0].dims.slice(),u=new Array(s.length),l=[];for(let o=0;o<s.length;o++)u[o]=s[o]*t[1].numberData[o],l.push(`inputIdx[${o}] = int(mod(float(outputIdx[${o}]), ${s[o]}.));`);let p=u.length,d=`
      float process(int outputIdx[${p}]) {
        int inputIdx[${p}];
        ${l.join(`
`)}
        return _A(inputIdx);
      }
    `;return{...n,output:{dims:u,type:t[0].type,textureType:0},shaderSource:d}},dh=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 input.");if(e[1].dims.length!==1)throw new Error("The second input shape must 1 dimension.");if(e[1].dims[0]!==e[0].dims.length)throw new Error("Invalid input shape.");if(ui.indexOf(e[0].type)===-1)throw new Error("Invalid input type.");if(e[1].type!=="int32"&&e[1].type!=="int16")throw new Error("Invalid repeat type.")}}),Xs,j_,F_,ph,ch,qS=k(()=>{"use strict";ke(),Xs=(e,t,n)=>{ph(t);let s=ge.unsqueezeShape(t[0].dims,n);return[e.reshapeUnpacked(t[0],s)]},j_=(e,t)=>(ch(t),Xs(e,[t[0]],Array.from(t[1].integerData))),F_=e=>e.attributes.getInts("axes"),ph=e=>{if(!e||e.length!==1)throw new Error("Unsqueeze requires 1 input.");if(e[0].type==="string")throw new Error("invalid input tensor types.")},ch=e=>{if(!e||e.length!==2)throw new Error("Unsqueeze requires 2 inputs.");if(e[1].type!=="int32")throw new Error("Invalid input type.")}}),L_,GS=k(()=>{"use strict";D3(),H3(),W3(),X3(),Ou(),xS(),$S(),TS(),SS(),IS(),OS(),ES(),kS(),Su(),DS(),CS(),NS(),zS(),RS(),BS(),MS(),jS(),FS(),LS(),VS(),US(),Eu(),I0(),qS(),x_(),L_=[["Abs","","6+",n0],["Acos","","7+",i0],["Add","","7+",By],["And","","7+",My],["Asin","","7+",o0],["Atan","","7+",a0],["AveragePool","","7+",o_,a_],["BatchNormalization","","7+",Cy,Ny],["Cast","","6+",Xy,Zy],["Ceil","","6+",l0],["Clip","","6-10",Ms,s0],["Clip","","11+",u0],["Concat","","4+",Qy,Yy],["Conv","","1+",Ls,Vs],["ConvTranspose","","1+",j0,F0],["Cos","","7+",d0],["Div","","7+",jy],["Dropout","","7+",js],["DepthToSpace","","1+",V0,U0],["Equal","","7+",Fy],["Elu","","6+",p0,c0],["Exp","","6+",h0],["Flatten","","1+",q0,G0],["Floor","","6+",f0],["FusedConv","com.microsoft","1+",Ls,Vs],["Gather","","1+",H0,W0],["Gemm","","7-10",Us,K0],["Gemm","","11+",Us,X0],["GlobalAveragePool","","1+",s_,u_],["GlobalMaxPool","","1+",p_],["Greater","","7+",Ly],["Identity","","1+",js],["ImageScaler","","1+",Z0,J0],["InstanceNormalization","","6+",Q0,Y0],["LeakyRelu","","6+",m0,g0],["Less","","7+",Vy],["LRN","","1+",e_,t_],["Log","","6+",b0],["MatMul","","1+",k0,D0],["MaxPool","","1+",l_,d_],["Mul","","7+",Uy],["Neg","","6+",y0],["Not","","1+",_0],["Or","","7+",qy],["Pad","","2-10",qs,r_],["Pad","","11+",n_,i_],["Pow","","7+",Gy],["PRelu","","7+",Hy],["ReduceLogSum","","1+",b_,dr],["ReduceMax","","1+",f_,dr],["ReduceMean","","1+",h_,dr],["ReduceMin","","1+",m_,dr],["ReduceProd","","1+",g_,dr],["ReduceSum","","1-12",c_,dr],["ReduceSumSquare","","1+",y_,dr],["Relu","","6+",v0],["Reshape","","5+",__],["Resize","","10",Ws,$_],["Resize","","11+",Ws,T_],["Shape","","1+",S_],["Sigmoid","","6+",w0],["Sin","","7+",x0],["Slice","","10+",E_],["Slice","","1-9",I_,O_],["Softmax","","1-12",P_,A_],["Softmax","","13+",D_,k_],["Split","","2-12",C_,N_],["Sqrt","","6+",$0],["Squeeze","","1-12",Ks,R_],["Squeeze","","13+",z_],["Sub","","7+",Wy],["Sum","","6+",B_],["Tan","","7+",T0],["Tanh","","6+",S0],["Tile","","6+",M_],["Transpose","","1+",ni,L0],["Upsample","","7-8",Gs,v_],["Upsample","","9",Gs,w_],["Unsqueeze","","1-12",Xs,F_],["Unsqueeze","","13+",j_],["Xor","","7+",Ky]]});function HS(e){let t={},n;for(;(n=Zs.exec(e))!==null;){let s=n[3].split(",").map(u=>{let l=u.trim().split(" ");return l&&l.length===2?{type:l[0],name:l[1]}:null}).filter(u=>u!==null);t[n[2]]={params:s,body:n[4]}}for(let s in t){let u=V_.replace("__FUNC__",s),l=new RegExp(u,"gm");for(;(n=l.exec(e))!==null;){let p=n[1],d=n[2],o=n[3].split(","),r=p?`${p} ${d};`:"",i=t[s].body,a="";t[s].params.forEach((h,m)=>{h&&(a+=`${h.type} ${h.name} = ${o[m]};
`)}),i=`${a}
 ${i}`,i=i.replace("return",`${d} = `);let c=`
      ${r}
      {
        ${i}
      }
      `;e=e.replace(n[0],c)}}return e=e.replace(Zs,""),e}var Zs,V_,WS=k(()=>{"use strict";Zs=/@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm,V_="(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;"});function Gn(e,t){let n=[],s=[];for(let u=0;u<e.length;++u)e[u]!==1&&(n.push(e[u]),s.push(u));return{newShape:n,keptDims:s}}function KS(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function hh(e){let t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}var U_,q_=k(()=>{"use strict";Ct(),ke(),U_=class{constructor(e){this.maxTextureSize=e}computeTextureWH(e,t){let n=this.computeTexture(e,t);return t&&t.isPacked&&(n[0]/=2,n[1]/=2),t&&t.reverseWH?[n[1],n[0]]:n}computeTexture(e,t){let n=t&&t.isPacked;if(e.length===0)return n?[2,2]:[1,1];let s=this.maxTextureSize;if(t&&t.breakAxis!==void 0){let p=t.breakAxis>=e.length?1:e.slice(t.breakAxis).reduce((o,r)=>o*r),d=t.breakAxis<=0?1:e.slice(0,t.breakAxis).reduce((o,r)=>o*r);if(p>s||d>s)qe.verbose("TextureLayout",`Given width/height preferences were unattainable: shape:${e}, breakAxis:${t.breakAxis}`);else return[p,d]}let u=e.slice(0);n&&(s=s*2,u=u.map((p,d)=>d>=u.length-2?u[d]%2===0?u[d]:u[d]+1:u[d]),u.length===1&&(u=[2,u[0]])),u.length!==2&&(u=Gn(u).newShape);let l=KS(u);return u.length<=1&&l<=s?[1,l]:u.length===2&&u[0]<=s&&u[1]<=s?u:u.length===3&&u[0]*u[1]<=s&&u[2]<=s?[u[0]*u[1],u[2]]:u.length===3&&u[0]<=s&&u[1]*u[2]<=s?[u[0],u[1]*u[2]]:u.length===4&&u[0]*u[1]*u[2]<=s&&u[3]<=s?[u[0]*u[1]*u[2],u[3]]:u.length===4&&u[0]<=s&&u[1]*u[2]*u[3]<=s?[u[0],u[1]*u[2]*u[3]]:n?hh(l/4).map(p=>p*2):hh(l)}}}),G_,XS=k(()=>{"use strict";ke(),fr(),Le(),q_(),Zt(),G_=class extends vn{constructor(e){super(e)}getFunctions(){return{...this.offsetToCoords(),...this.coordsToOffset(),...this.toVec(),...this.valueFrom(),...this.getCommonUtilFuncs(),...this.getInputsSamplingSnippets(),...this.getOutputSamplingSnippet()}}getCustomTypes(){return{}}offsetToCoords(){let e="offsetToCoords";return{offsetToCoords:new ee(`
      vec2 ${e}(int offset, int width, int height) {
        int t = offset / width;
        int s = offset - t*width;
        vec2 coords = (vec2(s,t) + vec2(0.5,0.5)) / vec2(width, height);
        return coords;
      }
      `)}}coordsToOffset(){let e="coordsToOffset";return{coordsToOffset:new ee(`
      int ${e}(vec2 coords, int width, int height) {
        float s = coords.s * float(width);
        float t = coords.t * float(height);
        int offset = int(t) * width + int(s);
        return offset;
      }
      `)}}getOutputSamplingSnippet(){let e=this.context.outputTextureLayout;return e.isPacked?this.getPackedOutputSamplingSnippet(e):this.getUnpackedOutputSamplingSnippet(e)}getPackedOutputSamplingSnippet(e){let t=e.unpackedShape,n=[e.width,e.height],s={},u="getOutputCoords";switch(t.length){case 0:s[u]=this.getOutputScalarCoords();break;case 1:s[u]=this.getOutputPacked1DCoords(t,n);break;case 2:s[u]=this.getOutputPacked2DCoords(t,n);break;case 3:s[u]=this.getOutputPacked3DCoords(t,n);break;default:s[u]=this.getOutputPackedNDCoords(t,n)}let l=`
      void setOutput(vec4 val) {
        ${Se(this.context.glContext.version).output} = val;
      }
    `,p="floatTextureSetRGBA";return s[p]=new ee(l),s}getUnpackedOutputSamplingSnippet(e){let t=e.unpackedShape,n=[e.width,e.height],s={},u="getOutputCoords";switch(t.length){case 0:s[u]=this.getOutputScalarCoords();break;case 1:s[u]=this.getOutputUnpacked1DCoords(t,n);break;case 2:s[u]=this.getOutputUnpacked2DCoords(t,n);break;case 3:s[u]=this.getOutputUnpacked3DCoords(t,n);break;case 4:s[u]=this.getOutputUnpacked4DCoords(t,n);break;case 5:s[u]=this.getOutputUnpacked5DCoords(t,n);break;case 6:s[u]=this.getOutputUnpacked6DCoords(t,n);break;default:throw new Error(`Unsupported output dimensionality: ${t.length}`)}let l=`
        void setOutput(float val) {
          ${Se(this.context.glContext.version).output} = vec4(val, 0, 0, 0);
        }
    `,p="floatTextureSetR";return s[p]=new ee(l),s}getOutputScalarCoords(){return new ee(`
      int getOutputCoords() {
        return 0;
      }
    `)}getOutputPacked1DCoords(e,t){let n=t,s="";return n[0]===1?(s=`
          int getOutputCoords() {
            return 2 * int(TexCoords.y * ${n[1]}.0);
          }
        `,new ee(s)):n[1]===1?(s=`
          int getOutputCoords() {
            return 2 * int(TexCoords.x * ${n[0]}.0);
          }
        `,new ee(s)):(s=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                 vec2(${n[0]}, ${n[1]}));
          return 2 * (resTexRC.y * ${n[0]} + resTexRC.x);
        }
      `,new ee(s))}getOutputPacked2DCoords(e,t){let n="";if(Un.arraysEqual(e,t))return n=`
        ivec2 getOutputCoords() {
          return 2 * ivec2(TexCoords.xy * vec2(${t[0]}, ${t[1]}));
        }
      `,new ee(n);let s=t,u=Math.ceil(e[1]/2);return n=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${s[0]}, ${s[1]}));

          int index = resTexRC.y * ${s[0]} + resTexRC.x;

          // reverse r and c order for packed texture
          int r = imod(index, ${u}) * 2;
          int c = 2 * (index / ${u});

          return ivec2(r, c);
        }
      `,new ee(n)}getOutputPacked3DCoords(e,t){let n=[t[0],t[1]],s=Math.ceil(e[2]/2),u=s*Math.ceil(e[1]/2),l=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${n[0]}, ${n[1]}));
          int index = resTexRC.y * ${n[0]} + resTexRC.x;

          int b = index / ${u};
          index -= b * ${u};

          // reverse r and c order for packed texture
          int r = imod(index, ${s}) * 2;
          int c = 2 * (index / ${s});

          return ivec3(b, r, c);
        }
      `;return new ee(l)}getOutputPackedNDCoords(e,t){let n=[t[0],t[1]],s=Math.ceil(e[e.length-1]/2),u=s*Math.ceil(e[e.length-2]/2),l=u,p="",d="b, r, c";for(let r=2;r<e.length-1;r++)l*=e[e.length-r-1],p=`
      int b${r} = index / ${l};
      index -= b${r} * ${l};
    `+p,d=`b${r}, `+d;let o=`
      ivec${e.length} getOutputCoords() {
        ivec2 resTexRC = ivec2(TexCoords.xy *
                              vec2(${n[0]}, ${n[1]}));
        int index = resTexRC.y * ${n[0]} + resTexRC.x;

        ${p}

        int b = index / ${u};
        index -= b * ${u};

        // reverse r and c order for packed texture
        int r = imod(index, ${s}) * 2;
        int c = 2 * (index / ${s});

        return ivec${e.length}(${d});
      }
    `;return new ee(o)}getOutputUnpacked1DCoords(e,t){let n=`
        int getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          return resTexRC.y * ${t[0]} + resTexRC.x;
        }
      `;return new ee(n)}getOutputUnpacked2DCoords(e,t){let n=`
        ivec2 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          int r = index / ${e[1]};
          int c = index - r * ${e[1]};
          return ivec2(r, c);
        }
      `;return new ee(n)}getOutputUnpacked3DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let d=s-3;d>=0;--d)u[d]=u[d+1]*e[d+1];let l=["r","c","d"],p=u.map((d,o)=>{let r=`int ${l[o]} = index / ${d}`,i=o===u.length-1?`int ${l[o+1]} = index - ${l[o]} * ${d}`:`index -= ${l[o]} * ${d}`;return`${r}; ${i};`}).join("");return n=`
        ivec3 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${p}
          return ivec3(r, c, d);
        }
      `,new ee(n)}getOutputUnpacked4DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let d=s-3;d>=0;--d)u[d]=u[d+1]*e[d+1];let l=["r","c","d","d2"],p=u.map((d,o)=>{let r=`int ${l[o]} = index / ${d}`,i=o===u.length-1?`int ${l[o+1]} = index - ${l[o]} * ${d}`:`index -= ${l[o]} * ${d}`;return`${r}; ${i};`}).join("");return n=`
      ivec4 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${p}
          return ivec4(r, c, d, d2);
        }
      `,new ee(n)}getOutputUnpacked5DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let d=s-3;d>=0;--d)u[d]=u[d+1]*e[d+1];let l=["r","c","d","d2","d3"],p=u.map((d,o)=>{let r=`int ${l[o]} = index / ${d}`,i=o===u.length-1?`int ${l[o+1]} = index - ${l[o]} * ${d}`:`index -= ${l[o]} * ${d}`;return`${r}; ${i};`}).join("");return n=`
      ivec5 getOutputCoords() {
          ivec2 resTexRC = ivec2(TexCoords.xy *
                                vec2(${t[0]}, ${t[1]}));
          int index = resTexRC.y * ${t[0]} + resTexRC.x;
          ${p}
          return ivec5(r, c, d, d2, d3);
        }
      `,new ee(n)}getOutputUnpacked6DCoords(e,t){let n="",s=e.length,u=null;s<2&&(u=[]),u=new Array(s-1),u[s-2]=e[s-1];for(let d=s-3;d>=0;--d)u[d]=u[d+1]*e[d+1];let l=["r","c","d","d2","d3","d4"],p=u.map((d,o)=>{let r=`int ${l[o]} = index / ${d}`,i=o===u.length-1?`int ${l[o+1]} = index - ${l[o]} * ${d}`:`index -= ${l[o]} * ${d}`;return`${r}; ${i};`}).join("");return n=`
     ivec6 getOutputCoords() {
         ivec2 resTexRC = ivec2(TexCoords.xy *
                               vec2(${t[0]}, ${t[1]}));
         int index = resTexRC.y * ${t[0]} + resTexRC.x;
         ${p}
         return ivec6(r, c, d, d2, d3, d4);
       }
     `,new ee(n)}getCommonUtilFuncs(){let e={},t="uvFromFlat";e[t]=new ee(`
    vec2 uvFromFlat(int texNumR, int texNumC, int index) {
      int texC = index / texNumR;
      int texR = index - texC * texNumR;
      // TODO: swap texR, texC order in following function so row is corresponding to u and column is corresponding to
      //       v.
      return (vec2(texR, texC) + halfCR) / vec2(texNumR, texNumC);
    }
    `),t="packedUVfrom1D",e[t]=new ee(`
      vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
        int texelIndex = index / 2;
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom2D",e[t]=new ee(`
      vec2 packedUVfrom2D(int texNumR, int texNumC, int texelsInLogicalRow, int row, int col) {
        int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = texelIndex / texNumC;
        int texC = texelIndex - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="packedUVfrom3D",e[t]=new ee(`
      vec2 packedUVfrom3D(int texNumR, int texNumC,
          int texelsInBatch, int texelsInLogicalRow, int b,
          int row, int col) {
        int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
        int texR = index / texNumC;
        int texC = index - texR * texNumC;
        return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
      }
      `),t="sampleTexture";let n=Se(this.context.glContext.version);return e[t]=new ee(`
        float sampleTexture(sampler2D textureSampler, vec2 uv) {
            return ${n.texture2D}(textureSampler, uv).r;
        }`),e}getInputsSamplingSnippets(){let e={},t=this.context.outputTextureLayout;return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s],l=Uo(n);u.isPacked?e[l]=this.getPackedSamplerFromInput(l,n,u):e[l]=this.getUnpackedSamplerFromInput(l,n,u);let p=b3(n);u.unpackedShape.length<=t.unpackedShape.length&&(u.isPacked?e[p]=this.getPackedSamplerAtOutputCoords(p,u,t,n):e[p]=this.getUnpackedSamplerAtOutputCoords(p,u,t,n))}),e}getPackedSamplerAtOutputCoords(e,t,n,s){let u=t.unpackedShape,l=n.unpackedShape,p=Uo(s),d=u.length,o=l.length,r=Vt.getBroadcastDims(u,l),i=cr(o),a=o-d,c,h=mn();d===0?c="":o<2&&r.length>=1?c="coords = 0;":c=r.map(E=>`coords.${h[E+a]} = 0;`).join(`
`);let m="";o<2&&d>0?m="coords":m=u.map((E,O)=>`coords.${h[O+a]}`).join(", ");let b="return outputValue;",x=ge.size(u)===1,w=ge.size(l)===1;if(d===1&&!x&&!w)b=`
        return vec4(outputValue.xy, outputValue.xy);
      `;else if(x&&!w)o===1?b=`
          return vec4(outputValue.x, outputValue.x, 0., 0.);
        `:b=`
          return vec4(outputValue.x);
        `;else if(r.length){let E=d-2,O=d-1;r.indexOf(E)>-1&&r.indexOf(O)>-1?b="return vec4(outputValue.x);":r.indexOf(E)>-1?b="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":r.indexOf(O)>-1&&(b="return vec4(outputValue.xx, outputValue.zz);")}let _=`
        int lastDim = coords.${h[o-1]};
        coords.${h[o-1]} = coords.${h[o-2]};
        coords.${h[o-2]} = lastDim;
      `,I=`
      vec4 ${e}() {
        ${i} coords = getOutputCoords();
        ${_}
        ${c}
        vec4 outputValue = ${p}(${m});
        ${b}
      }
    `;return new ee(I,["coordinates.getOutputCoords"])}getUnpackedSamplerAtOutputCoords(e,t,n,s){let u=[n.width,n.height],l=[t.width,t.height],p=t.unpackedShape.length,d=n.unpackedShape.length,o=t.unpackedShape,r=n.unpackedShape,i=Uo(s);if(p===d&&Un.arraysEqual(l,u)){let _=`
          float ${e}() {
            return sampleTexture(${s}, TexCoords);
          }
        `;return new ee(_,["coordinates.sampleTexture"])}let a=cr(d),c=Vt.getBroadcastDims(o,r),h=d-p,m,b=mn();p===0?m="":d<2&&c.length>=1?m="coords = 0;":m=c.map(_=>`coords.${b[_+h]} = 0;`).join(`
`);let x="";d<2&&p>0?x="coords":x=t.unpackedShape.map((_,I)=>`coords.${b[I+h]}`).join(", ");let w=`
        float ${e}() {
          ${a} coords = getOutputCoords();
          ${m}
          return ${i}(${x});
        }
      `;return new ee(w,["coordinates.getOutputCoords"])}getPackedSamplerFromInput(e,t,n){switch(n.unpackedShape.length){case 0:return this.getPackedSamplerScalar(e,t);case 1:return this.getPackedSampler1D(e,t,n);case 2:return this.getPackedSampler2D(e,t,n);case 3:return this.getPackedSampler3D(e,t,n);default:return this.getPackedSamplerND(e,t,n)}}getUnpackedSamplerFromInput(e,t,n){let s=n.unpackedShape;switch(s.length){case 0:return this.getUnpackedSamplerScalar(e,t,n);case 1:return this.getUnpackedSampler1D(e,t,n);case 2:return this.getUnpackedSampler2D(e,t,n);case 3:return this.getUnpackedSampler3D(e,t,n);case 4:return this.getUnpackedSampler4D(e,t,n);case 5:return this.getUnpackedSampler5D(e,t,n);case 6:return this.getUnpackedSampler6D(e,t,n);default:throw new Error(`Unsupported dimension ${s.length}-D`)}}getPackedSamplerScalar(e,t){let n=Se(this.context.glContext.version),s=`
          vec4 ${e}() {
            return ${n.texture2D}(${t}, halfCR);
          }
        `;return new ee(s)}getPackedSampler1D(e,t,n){let s=[n.width,n.height],u=[s[1],s[0]],l=Se(this.context.glContext.version),p=`vec4 ${e}(int index) {
      vec2 uv = packedUVfrom1D(
      ${u[0]}, ${u[1]}, index);
      return ${l.texture2D}(${t}, uv);
    }`;return new ee(p,["coordinates.packedUVfrom1D"])}getPackedSampler2D(e,t,n){let s=n.unpackedShape,u=[n.width,n.height],l=Se(this.context.glContext.version),p=u[0],d=u[1];if(u!=null&&Un.arraysEqual(s,u)){let a=`vec4 ${e}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${d}.0, ${p}.0);
        return ${l.texture2D}(${t}, uv);
      }`;return new ee(a)}let o=u,r=Math.ceil(s[1]/2),i=`vec4 ${e}(int row, int col) {
      vec2 uv = packedUVfrom2D(${o[1]}, ${o[0]}, ${r}, row, col);
      return ${l.texture2D}(${t}, uv);
    }`;return new ee(i,["coordinates.packedUVfrom2D"])}getPackedSampler3D(e,t,n){let s=n.unpackedShape,u=[n.width,n.height],l=[u[0],u[1]],p=Se(this.context.glContext.version);if(s[0]===1){let c=s.slice(1),h=[1,2],m=In(s,c),b=["b","row","col"],x=JSON.parse(JSON.stringify(n));x.unpackedShape=m;let w=this.getPackedSamplerFromInput(e,t,x),_=`${w.routineBody}
      vec4 ${e}(int b, int row, int col) {
        return ${e}(${On(b,h)});
      } `;return new ee(_,w.dependencies)}let d=l[0],o=l[1],r=Math.ceil(s[2]/2),i=r*Math.ceil(s[1]/2),a=`vec4 ${e}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${o}, ${d}, ${i}, ${r}, b, row, col);
      return ${p.texture2D}(${t}, uv);}`;return new ee(a,["coordinates.packedUVfrom3D"])}getPackedSamplerND(e,t,n){let s=n.unpackedShape,u=s.length,l=[n.width,n.height],p=Se(this.context.glContext.version),d=[l[0],l[1]],o=d[1],r=d[0],i=Math.ceil(s[u-1]/2),a=i*Math.ceil(s[u-2]/2),c="int b, int row, int col",h=`b * ${a} + (row / 2) * ${i} + (col / 2)`;for(let b=2;b<u-1;b++)c=`int b${b}, `+c,a*=s[u-b-1],h=`b${b} * ${a} + `+h;let m=`vec4 ${e}(${c}) {
      int index = ${h};
      int texR = index / ${r};
      int texC = index - texR * ${r};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}, ${o});
      return ${p.texture2D}(${t}, uv);
    }`;return new ee(m)}getUnpackedSamplerScalar(e,t,n){let[s,u]=[n.width,n.height];if(s===1&&u===1){let p=`
          float ${e}() {
            return sampleTexture(${t}, halfCR);
          }
        `;return new ee(p,["coordinates.sampleTexture"])}let l=`
        float ${e}() {
          int offset_${t} = coordsToOffset(TexCoords, ${s}, ${u});
          vec2 uv = uvFromFlat(${s}, ${u}, offset_${t});
          return sampleTexture(${t}, uv);
        }
      `;return new ee(l,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler1D(e,t,n){let s=n.width,u=n.height;if(u===1&&s===1){let p=`
        float ${e}(int index) {
          return sampleTexture(${t}, halfCR);
        }
      `;return new ee(p,["coordinates.sampleTexture"])}if(u===1){let p=`
          float ${e}(int index) {
            vec2 uv = vec2((float(index) + 0.5) / ${s}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(p,["coordinates.sampleTexture"])}if(s===1){let p=`
          float ${e}(int index) {
            vec2 uv = vec2(0.5, (float(index) + 0.5) / ${u}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(p,["coordinates.sampleTexture"])}let l=`
        float ${e}(int index) {
          vec2 uv = uvFromFlat(${s}, ${u}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new ee(l,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler2D(e,t,n){let s=n.unpackedShape,u=[n.height,n.width];if(u!=null&&Un.arraysEqual(s,u)){let a=u[1],c=u[0],h=`
          float ${e}(int row, int col) {
            vec2 uv = (vec2(row, col) + halfCR) / vec2(${a}.0, ${c}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(h,["coordinates.sampleTexture"])}let{newShape:l,keptDims:p}=Gn(s),d=l;if(d.length<s.length){let a=In(s,d),c=JSON.parse(JSON.stringify(n));c.unpackedShape=a;let h=["col","row"],m=`
          ${this.getUnpackedSamplerFromInput(e,t,c).routineBody}
          float ${e}(int row, int col) {
            return ${e}(${On(h,p)});
          }
        `;return new ee(m,["coordinates.sampleTexture"])}let o=u[1],r=u[0];if(r===1){let a=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${o}, ${r});
            float index = dot(vec3(row, col, offset_${t}), vec3(${s[1]}, 1, 1));
            vec2 uv = vec2(0.5, (index + 0.5) / ${o}.0);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(a,["coordinates.sampleTexture","coordinates.coordsToOffset"])}if(o===1){let a=`
          float ${e}(int row, int col) {
            int offset_${t} = coordsToOffset(TexCoords, ${o}, ${r});
            float index = dot(vec3(row, col, offset_${t}), vec3(${s[1]}, 1, 1));
            vec2 uv = vec2((index + 0.5) / ${r}.0, 0.5);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(a,["coordinates.sampleTexture","coordinates.coordsToOffset"])}let i=`
        float ${e}(int row, int col) {
          int index = col * ${s[1]} + row;
          vec2 uv = uvFromFlat(${o}, ${r}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new ee(i,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler3D(e,t,n){let s=n.unpackedShape,u=s[1]*s[2],l=s[2],{newShape:p,keptDims:d}=Gn(s),o=p;if(o.length<s.length){let c=In(s,o),h=["batch","col","row"],m=JSON.parse(JSON.stringify(n));m.unpackedShape=c;let b=this.getUnpackedSamplerFromInput(e,t,m),x=d.reverse(),w=`
          ${b.routineBody}
          float ${e}(int batch, int row, int col) {
            return ${e}(${On(h,x)});
          }
        `;return new ee(w,b.dependencies)}let r=n.width,i=n.height,a=`
          float ${e}(int depth, int row, int col) {
            // Explicitly use integer operations as dot() only works on floats.
            int index = depth * ${u} + col * ${l} + row;
            vec2 uv = uvFromFlat(${r}, ${i}, index);
            return sampleTexture(${t}, uv);
          }
      `;return new ee(a,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}getUnpackedSampler4D(e,t,n){let s=n.unpackedShape,u=s[3],l=s[2]*u,p=s[1]*l,d=n.width,o=n.height,r=`
        float ${e}(int row, int col, int depth, int depth2) {
          int index = row * ${p} + col * ${l} +
              depth2 * ${u} + depth;
          vec2 uv = uvFromFlat(${d}, ${o}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new ee(r,["coordinates.uvFromFlat","coordinates.sampleTexture"])}getUnpackedSampler5D(e,t,n){let s=n.unpackedShape,u=s[4],l=s[3]*u,p=s[2]*l,d=s[1]*p,{newShape:o,keptDims:r}=Gn(s);if(o.length<s.length){let h=In(s,o),m=["row","col","depth","depth2","depth3"],b=JSON.parse(JSON.stringify(n));b.unpackedShape=h;let x=`
          ${this.getUnpackedSamplerFromInput(e,t,b).routineBody}
          float ${e}(int row, int col, int depth, int depth2, int depth3) {
            return ${e}(${On(m,r)});
          }
        `;return new ee(x,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let i=n.width,a=n.height,c=`
        float ${e}(int row, int col, int depth, int depth2, int depth3) {
          int index = row * ${d} + col * ${p} + depth * ${l} +
          depth3 * ${u} + depth2;
          vec2 uv = uvFromFlat(${i}, ${a}, index);
          return sampleTexture(${t}, uv);
        }
      `;return new ee(c,["coordinates.sampleTexture","coordinates.uvFromFlat"])}getUnpackedSampler6D(e,t,n){let s=n.unpackedShape,u=s[5],l=s[4]*u,p=s[3]*l,d=s[2]*p,o=s[1]*d,{newShape:r,keptDims:i}=Gn(s);if(r.length<s.length){let m=In(s,r),b=["row","col","depth","depth2","depth3","depth4"],x=JSON.parse(JSON.stringify(n));x.unpackedShape=m;let w=`
            ${this.getUnpackedSamplerFromInput(e,t,x).routineBody}
            float ${e}(int row, int col, int depth,
              int depth2, int depth3, int depth4) {
              return ${e}(${On(b,i)});
            }
          `;return new ee(w,["coordinates.sampleTexture","coordinates.uvFromFlat"])}let a=n.width,c=n.height,h=`
          float ${e}(int row, int col, int depth,
            int depth2, int depth3, int depth4) {
            int index = row * ${o} + col * ${d} + depth * ${p} +
            depth2 * ${l} + depth3 * ${u} + depth4;
            vec2 uv = uvFromFlat(${a}, ${c}, index);
            return sampleTexture(${t}, uv);
          }
        `;return new ee(h,["coordinates.uvFromFlat","coordinates.sampleTexture","coordinates.coordsToOffset"])}toVec(){let e=this.context.outputTextureLayout,t=e.shape.length,n=e.strides,s=e.width,u=e.height,l=[];for(let d=0;d<t-1;++d)l.push(`
        c[${d}] = offset / ${n[d]};`),l.push(`
        offset -= c[${d}] * ${n[d]};`);l.push(`
        c[${t-1}] = offset;`);let p=`
      void toVec(vec2 texCoords, out int c[${t}]) {
        int offset = coordsToOffset(texCoords, ${s}, ${u});
        ${l.join("")}
      }
      void toVec(int offset, out int c[${t}]) {
        ${l.join("")}
      }
    `;return{toVec:new ee(p,["coordinates.coordsToOffset"])}}valueFrom(){let e={};return this.context.programInfo.inputNames.forEach((t,n)=>{let s=this.context.inputTextureLayouts[n],u=(s.unpackedShape.length>0?s.unpackedShape:s.shape).length,l=`_${t}`;e[l]=new ee(this.getValueFromSingle(t,u,s.width,s.height,!1),[`shapeUtils.indicesToOffset${l}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"]),l=l+"_T",e[l]=new ee(this.getValueFromSingle(t,u,s.width,s.height,!0),[`shapeUtils.indicesToOffset${l}`,"coordinates.offsetToCoords","fragcolor.getColorAsFloat"])}),e}getValueFromSingle(e,t,n,s,u){let l=`_${e}`;u&&(l=l+"_T");let p=Se(this.context.glContext.version);return`
        float ${l}(int m[${t}]) {
          int offset = indicesToOffset${l}(m);
          vec2 coords = offsetToCoords(offset, ${n}, ${s});
          float value = getColorAsFloat(${p.texture2D}(${e}, coords));
          return value;
        }
        `}getPackedValueFrom(e,t,n,s,u){let l=`_${e}_Pack`;u&&(l=l+"_T");let p=Se(this.context.glContext.version);return`
        vec4 ${l}(int m[${t}]) {
          int offset = indicesToOffset_${e}(m);
          vec2 coords = offsetToCoords(offset, ${n}, ${s});
          return ${p.texture2D}(${e}, coords);
        }
        `}}}),H_,ZS=k(()=>{"use strict";fr(),H_=class Js extends vn{constructor(t){super(t)}getFunctions(){return{...this.encodeFloat32(),...this.decodeFloat32()}}getCustomTypes(){return{}}encodeFloat32(){return{encode:new ee(`highp vec4 encode(highp float f) {
        return vec4(f, 0.0, 0.0, 0.0);
      }
        `)}}decodeFloat32(){return{decode:new ee(`highp float decode(highp vec4 rgba) {
        return rgba.r;
      }
        `)}}encodeUint8(){let t=Js.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{encode:new ee(`
      highp vec4 encode(highp float f) {
        highp float F = abs(f);
        highp float Sign = step(0.0,-f);
        highp float Exponent = floor(log2(F));
        highp float Mantissa = (exp2(- Exponent) * F);
        Exponent = floor(log2(F) + 127.0) + floor(log2(Mantissa));
        highp vec4 rgba;
        rgba[0] = 128.0 * Sign  + floor(Exponent*exp2(-1.0));
        rgba[1] = 128.0 * mod(Exponent,2.0) + mod(floor(Mantissa*128.0),128.0);
        rgba[2] = floor(mod(floor(Mantissa*exp2(23.0 -8.0)),exp2(8.0)));
        rgba[3] = floor(exp2(23.0)*mod(Mantissa,exp2(-15.0)));
        ${t}
        rgba = rgba / 255.0; // values need to be normalized to [0,1]
        return rgba;
    }
        `)}}decodeUint8(){let t=Js.isLittleEndian()?"rgba.rgba=rgba.abgr;":"";return{decode:new ee(`
        highp float decode(highp vec4 rgba) {
          rgba = rgba * 255.0; // values need to be de-normalized from [0,1] to [0,255]
          ${t}
          highp float Sign = 1.0 - step(128.0,rgba[0])*2.0;
          highp float Exponent = 2.0 * mod(rgba[0],128.0) + step(128.0,rgba[1]) - 127.0;
          highp float Mantissa = mod(rgba[1],128.0)*65536.0 + rgba[2]*256.0 +rgba[3] + float(0x800000);
          highp float Result =  Sign * exp2(Exponent) * (Mantissa * exp2(-23.0 ));
          return Result;
      }
        `)}}static isLittleEndian(){let t=new ArrayBuffer(4),n=new Uint32Array(t),s=new Uint8Array(t);if(n[0]=3735928559,s[0]===239)return!0;if(s[0]===222)return!1;throw new Error("unknown endianness")}}}),W_,JS=k(()=>{"use strict";fr(),Le(),W_=class extends vn{constructor(e){super(e)}getFunctions(){return{...this.setFragColor(),...this.getColorAsFloat()}}getCustomTypes(){return{}}setFragColor(){let e=Se(this.context.glContext.version);return{setFragColor:new ee(`
        void setFragColor(float value) {
            ${e.output} = encode(value);
        }
        `,["encoding.encode"])}}getColorAsFloat(){return{getColorAsFloat:new ee(`
        float getColorAsFloat(vec4 color) {
            return decode(color);
        }
        `,["encoding.decode"])}}}}),K_,QS=k(()=>{"use strict";fr(),K_=class Hn extends vn{constructor(t){super(t)}getFunctions(){return{...this.bcastIndex(),...this.bcastMatmulIndex(),...this.offsetToIndices(),...this.indicesToOffset(),...this.incrementIndices()}}getCustomTypes(){return{}}bcastIndex(){let t=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((s,u)=>{let l=this.context.inputTextureLayouts[u].unpackedShape;if(l.length<=t){let p=l.length,d=t-p,o=`bcastIndices_${s}`,r="";for(let a=0;a<p;++a)r+=`
          realIndices[${a}] = int( mod(float(bcastedIndices[${d+a}]), ${l[a]}.0) );
          `;let i=`
        void ${o} (int bcastedIndices[${t}], out int realIndices[${p}]) {
          ${r}
        }
        `;n[o]=new ee(i)}}),n}bcastMatmulIndex(){let t=this.context.outputTextureLayout.shape.length,n={};return this.context.programInfo.inputNames.forEach((s,u)=>{let l=this.context.inputTextureLayouts[u].shape;if(!(l.length<2||l.length>t)){let p=l.length,d=t-p,o=`bcastMatmulIndices_${s}`,r="";for(let a=0;a<p-2;++a)r+=`
          realIndices[${a}] = int( mod(float(bcastedIndices[${d+a}]), ${l[a]}.0) );
          `;let i=`
        void ${o}(int bcastedIndices[${t}], out int realIndices[${p}]) {
          ${r}
          realIndices[${p-1}] = bcastedIndices[${t-1}];
          realIndices[${p-2}] = bcastedIndices[${t-2}];
        }
        `;n[o]=new ee(i)}}),n}indicesToOffset(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,l=this.context.inputTextureLayouts[s].strides,p=u.length,d=`indicesToOffset_${n}`;t[d]=new ee(Hn.indexToOffsetSingle(d,p,l)),d=`indicesToOffset_${n}_T`,t[d]=new ee(Hn.indexToOffsetSingle(d,p,l.slice().reverse()))}),t}static indexToOffsetSingle(t,n,s){let u="";for(let l=n-1;l>=0;--l)u+=`
        offset += indices[${l}] * ${s[l]};
        `;return`
      int ${t}(int indices[${n}]) {
        int offset = 0;
        ${u}
        return offset;
      }
      `}offsetToIndices(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,l=this.context.inputTextureLayouts[s].strides,p=u.length,d=`offsetToIndices_${n}`;t[d]=new ee(Hn.offsetToIndicesSingle(d,p,l)),d=`offsetToIndices_${n}_T`,t[d]=new ee(Hn.offsetToIndicesSingle(d,p,l.slice().reverse()))}),t}static offsetToIndicesSingle(t,n,s){let u=[];for(let l=0;l<n-1;++l)u.push(`
      indices[${l}] = offset / ${s[l]};`),u.push(`
        offset -= indices[${l}] * ${s[l]};`);return u.push(`
      indices[${n-1}] = offset;`),`
      void ${t}(int offset, out int indices[${n}]) {
        ${u.join("")}
      }
      `}incrementIndices(){let t={};return this.context.programInfo.inputNames.forEach((n,s)=>{let u=this.context.inputTextureLayouts[s].shape,l=u.length,p=`incrementIndices_${n}`,d="";for(let r=0;r<l;++r)d+=`
        shape[${r}] = ${u[r]};`;let o=`
        void ${p}(int axis, out int indices[${l}]) {
          int shape[${l}];
          ${d};
          for(int i = ${l} -1 ; i >= 0; --i) {
            if(i > axis) continue;
            indices[i] += 1;
            if(indices[i] < shape[i]) {
              break;
            }
            indices[i] = 0;
          }
        }
        `;t[p]=new ee(o)}),t}}}),X_,YS=k(()=>{"use strict";fr(),X_=class extends vn{constructor(e){super(e)}getCustomTypes(){return{}}getFunctions(){return{...this.binaryVecFunctions(),...this.copyVec(),...this.setVecItem(),...this.getVecItem()}}binaryVecFunctions(){let e=this.context.outputTextureLayout.shape.length,t={add:"+=",sub:"-=",mul:"*=",div:"/="},n={};for(let s in t){let u=`${s}Vec`,l="";for(let d=0;d<e;++d)l+=`
          dest[${d}] ${t[s]} src[${d}];
          `;let p=`
        void ${u}(int src[${e}], out int dest[${e}]) {
          ${l}
        }
        `;n[u]=new ee(p)}return n}copyVec(){let e=this.context.outputTextureLayout.shape.length,t="";for(let s=0;s<e;++s)t+=`
        dest[${s}] = src[${s}];
        `;let n=`
      void copyVec(int src[${e}], out int dest[${e}]) {
        ${t}
      }
      `;return{copyVec:new ee(n)}}setVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index =${e} + index;
        if (index == 0)
            m[0] = value;
        `;for(let s=1;s<e-1;++s)t+=`
        else if (index == ${s})
            m[${s}] = value;
            `;t+=`
        else
            m[${e-1}] = value;
        `;let n=`
      void setVecItem(out int m[${e}], int index, int value) {
        ${t}
      }
        `;return{setVecItem:new ee(n)}}getVecItem(){let e=this.context.outputTextureLayout.shape.length,t=`
        if(index < 0)
            index = ${e} + index;
        if (index == 0)
            return m[0];
      `;for(let s=1;s<e-1;++s)t+=`
        else if (index == ${s})
            return m[${s}];
      `;t+=`
        else
            return m[${e-1}];
        `;let n=`
      int getVecItem(int m[${e}], int index) {
        ${t}
      }
    `;return{getVecItem:new ee(n)}}}}),Qs,eI=k(()=>{"use strict";XS(),ZS(),JS(),QS(),YS(),Qs={encoding:H_,fragcolor:W_,vec:X_,shapeUtils:K_,coordinates:G_}}),Z_,tI=k(()=>{"use strict";fr(),WS(),eI(),Le(),Z_=class{constructor(e,t,n,s){this.libs={},this.glslLibRoutineDependencyGraph={},this.context=new zy(e,t,n,s),Object.keys(Qs).forEach(l=>{let p=new Qs[l](this.context);this.libs[l]=p});let u=this.glslLibRoutineDependencyGraph;for(let l in this.libs){let p=this.libs[l].getFunctions();for(let d in p){let o=l+"."+d,r;u[o]?(r=u[o],r.routineBody=p[d].routineBody):(r=new Bs(o,p[d].routineBody),u[o]=r);let i=p[d].dependencies;if(i)for(let a=0;a<i.length;++a)if(u[i[a]])r.addDependency(u[i[a]]);else{let c=new Bs(i[a]);u[i[a]]=c,r.addDependency(c)}}}}preprocess(){let e=this.context.programInfo,t=e.shaderSource;return this.context.programInfo.hasMain||(t=`${t}
      ${g3(this.context.glContext.version,this.context.outputTextureLayout.shape.length)}`),t=HS(t),`${m3(this.context.glContext.version)}
    ${this.getUniforms(e.inputNames,e.variables)}
    ${this.getImports(t)}
    ${t}`}getImports(e){let t=this.selectGlslLibRoutinesToBeIncluded(e);if(t.length===0)return"";let n="";for(let s=0;s<t.length;++s)if(t[s].routineBody)n+=t[s].routineBody+`
`;else throw new Error(`Missing body for the Glsl Library routine: ${t[s].name}`);return n}selectGlslLibRoutinesToBeIncluded(e){let t=[];return Object.keys(this.glslLibRoutineDependencyGraph).forEach(n=>{let s=n.split(".")[1];e.indexOf(s)!==-1&&t.push(this.glslLibRoutineDependencyGraph[n])}),Ry.returnOrderedNodes(t)}getUniforms(e,t){let n=[];if(e)for(let s of e)n.push(`uniform sampler2D ${s};`);if(t)for(let s of t)n.push(`uniform ${s.type} ${s.name}${s.arrayLength?`[${s.arrayLength}]`:""};`);return n.join(`
`)}}}),J_,rI=k(()=>{"use strict";et(),Ct(),tI(),Le(),J_=class{constructor(e,t,n){this.profiler=e,this.glContext=t,this.textureLayoutStrategy=n,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n){this.profiler.event("op",`ProgramManager.run ${e.programInfo.name??"unknown kernel"}`,()=>{let s=this.glContext.gl,u=e.program;s.useProgram(u);try{this.bindOutput(n),this.attributesBound||this.bindAttributes(e.attribLocations),this.bindUniforms(e.uniformLocations,e.programInfo.variables??[],t)}catch(l){throw qe.error("ProgramManager",e.programInfo.shaderSource),l}this.profiler.event("backend","GlContext.draw()",()=>{this.glContext.draw()})},this.glContext)}dispose(){this.vertexShader&&this.glContext.deleteShader(this.vertexShader),this.repo.forEach(e=>this.glContext.deleteProgram(e.program))}build(e,t,n){return this.profiler.event("backend","ProgramManager.build",()=>{let s=new Z_(this.glContext,e,t,n),u=s.preprocess(),l=this.compile(u);return{programInfo:e,program:l,uniformLocations:this.getUniformLocations(l,s.context.programInfo.inputNames,s.context.programInfo.variables),attribLocations:this.getAttribLocations(l)}})}compile(e){if(!this.vertexShader){qe.verbose("ProrgramManager","Compiling and caching Vertex shader for the first time");let s=f3(this.glContext.version);this.vertexShader=this.glContext.compileShader(s,this.glContext.gl.VERTEX_SHADER)}ye.debug&&qe.verbose("ProrgramManager",`FragShader:
${e}
`);let t=this.glContext.compileShader(e,this.glContext.gl.FRAGMENT_SHADER),n=this.glContext.createProgram(this.vertexShader,t);return this.glContext.deleteShader(t),n}bindOutput(e){let t=e.width,n=e.height;qe.verbose("ProrgramManager",`Binding output texture to Framebuffer: w/h=${t}/${n}, shape=${e.shape}, type=${e.tensor.type}`),this.glContext.attachFramebuffer(e.texture,t,n)}bindAttributes(e){let t=e.position,n=e.textureCoord;this.glContext.setVertexAttributes(t,n),this.attributesBound=!0}bindUniforms(e,t,n){var l;let s=this.glContext.gl,u=0;for(let{name:p,type:d,location:o,arrayLength:r}of e){let i=(l=t.find(a=>a.name===p))==null?void 0:l.data;if(d!=="sampler2D"&&!i)throw new Error(`variable '${p}' does not have data defined in program info`);switch(d){case"sampler2D":this.bindTexture(n[u],o,u),u++;break;case"float":r?s.uniform1fv(o,i):s.uniform1f(o,i);break;case"int":r?s.uniform1iv(o,i):s.uniform1i(o,i);break;default:throw new Error(`Uniform not implemented: ${d}`)}}}bindTexture(e,t,n){this.glContext.bindTextureToUniform(e.texture,n,t)}getAttribLocations(e){return{position:this.getAttribLocation(e,"position"),textureCoord:this.getAttribLocation(e,"textureCoord")}}getUniformLocations(e,t,n){let s=[];if(t)for(let u of t)s.push({name:u,type:"sampler2D",location:this.getUniformLocation(e,u)});if(n)for(let u of n)s.push({...u,location:this.getUniformLocation(e,u.name)});return s}getUniformLocation(e,t){let n=this.glContext.gl.getUniformLocation(e,t);if(n===null)throw new Error(`Uniform ${t} not found.`);return n}getAttribLocation(e,t){return this.glContext.gl.getAttribLocation(e,t)}}}),Q_,nI=k(()=>{"use strict";Ct(),Gi(),Q_=class{constructor(e,t,n,s){this.glContext=e,this.layoutStrategy=t,this.profiler=n,this.config=s,this.pendingRead=new Map,s.reuseTextures&&(this.inUseTextures=new Map,this.idleTextures=new Map,this.textureLookup=new Map)}createTextureFromLayout(e,t,n,s){let u=this.toEncoderType(e),l=this.glContext.getEncoder(u,t.channels||1,s);if(t.isPacked&&s===1)throw new Error("not implemented");let p=t.width,d=t.height,o,r;if(this.config.reuseTextures){o=`${p}x${d}_${l.format}_${l.internalFormat}_${l.textureType}`,r=this.inUseTextures.get(o),r||(r=[],this.inUseTextures.set(o,r));let a=this.idleTextures.get(o);if(a&&a.length>0){let c=a.pop();return r.push(c),s===1&&this.glContext.updateTexture(c,p,d,l,this.toTextureData(e,n)),c}}qe.verbose("TextureManager",`Creating new texture of size ${t.width}x${t.height}`);let i=this.glContext.allocateTexture(p,d,l,this.toTextureData(e,n));return this.config.reuseTextures&&(r.push(i),this.textureLookup.set(i,o)),i}readTexture(e,t,n){return n||(n=1),this.profiler.event("backend","TextureManager.readTexture",()=>{let s=e.shape.reduce((l,p)=>l*p)*n,u=this.glContext.readTexture(e.texture,e.width,e.height,s,this.toEncoderType(t),n);return this.toTensorData(t,u)})}async readTextureAsync(e,t,n){let s=e.tensor.dataId;if(n||(n=1),this.pendingRead.has(s)){let u=this.pendingRead.get(s);return new Promise(l=>u==null?void 0:u.push(l))}return this.profiler.event("backend","TextureManager.readTextureAsync",async()=>{this.pendingRead.set(s,[]);let u=e.shape.reduce((o,r)=>o*r)*n;await this.glContext.createAndWaitForFence();let l=this.glContext.readTexture(e.texture,e.width,e.height,u,this.toEncoderType(t),n),p=this.toTensorData(t,l),d=this.pendingRead.get(s);return this.pendingRead.delete(s),d==null||d.forEach(o=>o(p)),p})}readUint8TextureAsFloat(e){return this.profiler.event("backend","TextureManager.readUint8TextureAsFloat",()=>{let t=e.shape.reduce((s,u)=>s*u),n=this.glContext.readTexture(e.texture,e.width,e.height,t*4,"byte",4);return new Float32Array(n.buffer,n.byteOffset,t)})}releaseTexture(e,t){let n;if(this.config.reuseTextures&&(n=this.textureLookup.get(e.texture),n)){t&&this.textureLookup.delete(n);let s=this.inUseTextures.get(n);if(s){let u=s.indexOf(e.texture);if(u!==-1){s.splice(u,1);let l=this.idleTextures.get(n);l||(l=[],this.idleTextures.set(n,l)),l.push(e.texture)}}}(!n||t)&&(qe.verbose("TextureManager",`Deleting texture of size ${e.width}x${e.height}`),this.glContext.deleteTexture(e.texture))}toTensorData(e,t){switch(e){case"int16":return t instanceof Int16Array?t:Int16Array.from(t);case"int32":return t instanceof Int32Array?t:Int32Array.from(t);case"int8":return t instanceof Int8Array?t:Int8Array.from(t);case"uint16":return t instanceof Uint16Array?t:Uint16Array.from(t);case"uint32":return t instanceof Uint32Array?t:Uint32Array.from(t);case"uint8":case"bool":return t instanceof Uint8Array?t:Uint8Array.from(t);case"float32":return t instanceof Float32Array?t:Float32Array.from(t);case"float64":return t instanceof Float64Array?t:Float64Array.from(t);default:throw new Error(`TensorData type ${e} is not supported`)}}toTextureData(e,t){if(t)return t instanceof Float32Array?t:new Float32Array(t)}toEncoderType(e){return"float"}clearActiveTextures(){this.glContext.clearActiveTextures()}}}),Y_,iI=k(()=>{"use strict";Ct(),mT(),k3(),GS(),rI(),q_(),nI(),Y_=class{constructor(e,t){this.backend=e,this.context=t,this.layoutStrategy=new U_(e.glContext.maxTextureSize),this.programManager=new J_(this.context.profiler,e.glContext,this.layoutStrategy),this.textureManager=new Q_(e.glContext,this.layoutStrategy,this.context.profiler,{reuseTextures:e.textureCacheMode==="full"}),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache=new Map,this.pack=e.pack,this.pack2unpackMap=new Map,this.unpack2packMap=new Map}createInferenceHandler(){return new Dy(this)}onGraphInitialized(e){let t=e.getValues().filter(n=>n.from===-1&&n.tensor).map(n=>n.tensor.dataId);this.initializers=new Set(t)}isInitializer(e){return this.initializers?this.initializers.has(e):!1}addInitializer(e){this.initializers.add(e)}getTextureData(e,t){return t?this.packedTextureDataCache.get(e):this.unpackedTextureDataCache.get(e)}setTextureData(e,t,n=!1){qe.verbose("WebGLSessionHandler","Storing Texture data in cache"),n?this.packedTextureDataCache.set(e,t):this.unpackedTextureDataCache.set(e,t)}dispose(){this.programManager.dispose(),this.textureManager.clearActiveTextures(),this.packedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.packedTextureDataCache=new Map,this.unpackedTextureDataCache.forEach(e=>this.textureManager.releaseTexture(e,!0)),this.unpackedTextureDataCache=new Map}resolve(e,t,n){let s=hT(e,t,L_);return{impl:s.opImpl,context:s.opInit?s.opInit(e,n):e}}}});function oI(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}var Ys,aI=k(()=>{"use strict";et(),Gi(),Gi(),Zt(),Ys=class{constructor(e,t){this.frameBufferBound=!1,this.itemsToPoll=[],this.gl=e,this.version=t,this.getExtensions(),this.vertexbuffer=this.createVertexbuffer(),this.framebuffer=this.createFramebuffer(),this.queryVitalParameters()}allocateTexture(e,t,n,s){let u=this.gl,l=u.createTexture();u.bindTexture(u.TEXTURE_2D,l),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE);let p=s?n.encode(s,e*t):null;return u.texImage2D(u.TEXTURE_2D,0,n.internalFormat,e,t,0,n.format,n.textureType,p),this.checkError(),l}updateTexture(e,t,n,s,u){let l=this.gl;l.bindTexture(l.TEXTURE_2D,e);let p=s.encode(u,t*n);l.texSubImage2D(l.TEXTURE_2D,0,0,0,t,n,s.format,s.textureType,p),this.checkError()}attachFramebuffer(e,t,n){let s=this.gl;s.bindTexture(s.TEXTURE_2D,e),s.bindFramebuffer(s.FRAMEBUFFER,this.framebuffer),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,e,0),this.checkError(),s.viewport(0,0,t,n),s.scissor(0,0,t,n)}readTexture(e,t,n,s,u,l){let p=this.gl;l||(l=1),this.frameBufferBound||this.attachFramebuffer(e,t,n);let d=this.getEncoder(u,l),o=d.allocate(t*n);return p.bindTexture(p.TEXTURE_2D,e),p.framebufferTexture2D(p.FRAMEBUFFER,p.COLOR_ATTACHMENT0,p.TEXTURE_2D,e,0),p.readPixels(0,0,t,n,p.RGBA,d.textureType,o),this.checkError(),d.decode(o,s)}isFramebufferReady(){return!0}getActiveTexture(){let e=this.gl;return`TEXTURE${e.getParameter(this.gl.ACTIVE_TEXTURE)-e.TEXTURE0}`}getTextureBinding(){return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D)}getFramebufferBinding(){return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING)}setVertexAttributes(e,t){let n=this.gl;n.vertexAttribPointer(e,3,n.FLOAT,!1,20,0),n.enableVertexAttribArray(e),t!==-1&&(n.vertexAttribPointer(t,2,n.FLOAT,!1,20,12),n.enableVertexAttribArray(t)),this.checkError()}createProgram(e,t){let n=this.gl,s=n.createProgram();return n.attachShader(s,e),n.attachShader(s,t),n.linkProgram(s),s}compileShader(e,t){let n=this.gl,s=n.createShader(t);if(!s)throw new Error(`createShader() returned null with type ${t}`);if(n.shaderSource(s,e),n.compileShader(s),n.getShaderParameter(s,n.COMPILE_STATUS)===!1)throw new Error(`Failed to compile shader: ${n.getShaderInfoLog(s)}
Shader source:
${e}`);return s}deleteShader(e){this.gl.deleteShader(e)}bindTextureToUniform(e,t,n){let s=this.gl;s.activeTexture(s.TEXTURE0+t),this.checkError(),s.bindTexture(s.TEXTURE_2D,e),this.checkError(),s.uniform1i(n,t),this.checkError()}draw(){this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.checkError()}checkError(){if(ye.debug){let e=this.gl,t=e.getError(),n="";switch(t){case e.NO_ERROR:return;case e.INVALID_ENUM:n="INVALID_ENUM";break;case e.INVALID_VALUE:n="INVALID_VALUE";break;case e.INVALID_OPERATION:n="INVALID_OPERATION";break;case e.INVALID_FRAMEBUFFER_OPERATION:n="INVALID_FRAMEBUFFER_OPERATION";break;case e.OUT_OF_MEMORY:n="OUT_OF_MEMORY";break;case e.CONTEXT_LOST_WEBGL:n="CONTEXT_LOST_WEBGL";break;default:n=`Unknown WebGL Error: ${t.toString(16)}`}throw new Error(n)}}deleteTexture(e){this.gl.deleteTexture(e)}deleteProgram(e){this.gl.deleteProgram(e)}getEncoder(e,t,n=0){if(this.version===2)return new Py(this.gl,t);switch(e){case"float":return n===1||this.isRenderFloat32Supported?new zs(this.gl,t):new zs(this.gl,t,this.textureHalfFloatExtension.HALF_FLOAT_OES);case"int":throw new Error("not implemented");case"byte":return new Ay(this.gl,t);default:throw new Error(`Invalid dataType: ${e}`)}}clearActiveTextures(){let e=this.gl;for(let t=0;t<this.maxTextureImageUnits;++t)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,null)}dispose(){if(this.disposed)return;let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(this.framebuffer),e.bindBuffer(e.ARRAY_BUFFER,null),e.deleteBuffer(this.vertexbuffer),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.finish(),this.disposed=!0}createDefaultGeometry(){return new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0])}createVertexbuffer(){let e=this.gl,t=e.createBuffer();if(!t)throw new Error("createBuffer() returned null");let n=this.createDefaultGeometry();return e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,n,e.STATIC_DRAW),this.checkError(),t}createFramebuffer(){let e=this.gl.createFramebuffer();if(!e)throw new Error("createFramebuffer returned null");return e}queryVitalParameters(){let e=this.gl;if(this.isFloatTextureAttachableToFrameBuffer=this.checkFloatTextureAttachableToFrameBuffer(),this.isRenderFloat32Supported=this.checkRenderFloat32(),this.isFloat32DownloadSupported=this.checkFloat32Download(),this.version===1&&!this.textureHalfFloatExtension&&!this.isRenderFloat32Supported)throw new Error("both float32 and float16 TextureType are not supported");this.isBlendSupported=!this.isRenderFloat32Supported||this.checkFloat32Blend(),this.maxTextureSize=e.getParameter(e.MAX_TEXTURE_SIZE),this.maxTextureImageUnits=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),this.version}getExtensions(){this.version===2?(this.colorBufferFloatExtension=this.gl.getExtension("EXT_color_buffer_float"),this.disjointTimerQueryWebgl2Extension=this.gl.getExtension("EXT_disjoint_timer_query_webgl2")):(this.textureFloatExtension=this.gl.getExtension("OES_texture_float"),this.textureHalfFloatExtension=this.gl.getExtension("OES_texture_half_float"))}checkFloatTextureAttachableToFrameBuffer(){let e=this.gl,t=e.createTexture();e.bindTexture(e.TEXTURE_2D,t);let n=this.version===2?e.RGBA32F:e.RGBA;e.texImage2D(e.TEXTURE_2D,0,n,1,1,0,e.RGBA,e.FLOAT,null);let s=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,s),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0);let u=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(t),e.deleteFramebuffer(s),u}checkRenderFloat32(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension)return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Download(){if(this.version===2){if(!this.colorBufferFloatExtension)return!1}else if(!this.textureFloatExtension||!this.gl.getExtension("WEBGL_color_buffer_float"))return!1;return this.isFloatTextureAttachableToFrameBuffer}checkFloat32Blend(){let e=this.gl,t,n,s,u,l;try{t=e.createTexture(),n=e.createFramebuffer(),e.bindTexture(e.TEXTURE_2D,t);let p=this.version===2?e.RGBA32F:e.RGBA;return e.texImage2D(e.TEXTURE_2D,0,p,1,1,0,e.RGBA,e.FLOAT,null),e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.enable(e.BLEND),s=e.createShader(e.VERTEX_SHADER),!s||(e.shaderSource(s,"void main(){}"),e.compileShader(s),u=e.createShader(e.FRAGMENT_SHADER),!u)||(e.shaderSource(u,"precision highp float;void main(){gl_FragColor=vec4(0.5);}"),e.compileShader(u),l=e.createProgram(),!l)?!1:(e.attachShader(l,s),e.attachShader(l,u),e.linkProgram(l),e.useProgram(l),e.drawArrays(e.POINTS,0,1),e.getError()===e.NO_ERROR)}finally{e.disable(e.BLEND),l&&e.deleteProgram(l),s&&e.deleteShader(s),u&&e.deleteShader(u),n&&(e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n)),t&&(e.bindTexture(e.TEXTURE_2D,null),e.deleteTexture(t))}}beginTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension,n=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,n),n}else throw new Error("WebGL1 profiling currently not supported.")}endTimer(){if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let e=this.gl,t=this.disjointTimerQueryWebgl2Extension;e.endQuery(t.TIME_ELAPSED_EXT);return}else throw new Error("WebGL1 profiling currently not supported")}isTimerResultAvailable(e){let t=!1,n=!1;if(this.version===2&&this.disjointTimerQueryWebgl2Extension){let s=this.gl,u=this.disjointTimerQueryWebgl2Extension;t=s.getQueryParameter(e,s.QUERY_RESULT_AVAILABLE),n=s.getParameter(u.GPU_DISJOINT_EXT)}else throw new Error("WebGL1 profiling currently not supported");return t&&!n}getTimerResult(e){let t=0;if(this.version===2){let n=this.gl;t=n.getQueryParameter(e,n.QUERY_RESULT),n.deleteQuery(e)}else throw new Error("WebGL1 profiling currently not supported");return t/1e6}async waitForQueryAndGetTime(e){return await pp(()=>this.isTimerResultAvailable(e)),this.getTimerResult(e)}async createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,n=e,s=n.fenceSync(n.SYNC_GPU_COMMANDS_COMPLETE,0);return e.flush(),s===null?t=()=>!0:t=()=>{let u=n.clientWaitSync(s,0,0);return u===n.ALREADY_SIGNALED||u===n.CONDITION_SATISFIED},{query:s,isFencePassed:t}}async pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=oI(this.itemsToPoll.map(t=>t.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:n}=this.itemsToPoll[t];n()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}async addItemToPoll(e,t){this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),!(this.itemsToPoll.length>1)&&await pp(()=>(this.pollItems(),this.itemsToPoll.length===0))}}});function ev(e){let t;if((!e||e==="webgl2")&&"webgl2"in Fr?t=Fr.webgl2:(!e||e==="webgl")&&"webgl"in Fr&&(t=Fr.webgl),!t)try{let s=uI();t=fh(s,e)}catch{let s=sI();t=fh(s,e)}e=e||t.version===1?"webgl":"webgl2";let n=t.gl;return Fr[e]=t,n.isContextLost()?(delete Fr[e],ev(e)):(n.disable(n.DEPTH_TEST),n.disable(n.STENCIL_TEST),n.disable(n.BLEND),n.disable(n.DITHER),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SAMPLE_COVERAGE),n.enable(n.SCISSOR_TEST),n.enable(n.CULL_FACE),n.cullFace(n.BACK),t)}function fh(e,t){let n={alpha:!1,depth:!1,antialias:!1,stencil:!1,preserveDrawingBuffer:!1,premultipliedAlpha:!1,failIfMajorPerformanceCaveat:!1},s,u=n;if((!t||t==="webgl2")&&(s=e.getContext("webgl2",u),s))try{return new Ys(s,2)}catch(l){qe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl2'. Error: ${l}`)}if((!t||t==="webgl")&&(s=e.getContext("webgl",u)||e.getContext("experimental-webgl",u),s))try{return new Ys(s,1)}catch(l){qe.warning("GlContextFactory",`failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: ${l}`)}throw new Error("WebGL is not supported")}function sI(){if(typeof document>"u")throw new TypeError("failed to create canvas: document is not supported");let e=document.createElement("canvas");return e.width=1,e.height=1,e}function uI(){if(typeof OffscreenCanvas>"u")throw new TypeError("failed to create offscreen canvas: OffscreenCanvas is not supported");return new OffscreenCanvas(1,1)}var Fr,lI=k(()=>{"use strict";Ct(),aI(),Fr={}}),tv,dI=k(()=>{"use strict";et(),Ct(),iI(),lI(),tv=class{get contextId(){return ye.webgl.contextId}set contextId(e){ye.webgl.contextId=e}get matmulMaxBatchSize(){return ye.webgl.matmulMaxBatchSize}set matmulMaxBatchSize(e){ye.webgl.matmulMaxBatchSize=e}get textureCacheMode(){return ye.webgl.textureCacheMode}set textureCacheMode(e){ye.webgl.textureCacheMode=e}get pack(){return ye.webgl.pack}set pack(e){ye.webgl.pack=e}get async(){return ye.webgl.async}set async(e){ye.webgl.async=e}initialize(){try{return this.glContext=ev(this.contextId),typeof this.matmulMaxBatchSize!="number"&&(this.matmulMaxBatchSize=16),typeof this.textureCacheMode!="string"&&(this.textureCacheMode="full"),typeof this.pack!="boolean"&&(this.pack=!1),typeof this.async!="boolean"&&(this.async=!1),qe.setWithEnv(ye),ye.webgl.context||Object.defineProperty(ye.webgl,"context",{value:this.glContext.gl}),qe.verbose("WebGLBackend",`Created WebGLContext: ${typeof this.glContext} with matmulMaxBatchSize: ${this.matmulMaxBatchSize}; textureCacheMode: ${this.textureCacheMode}; pack: ${this.pack}; async: ${this.async}.`),!0}catch(e){return qe.warning("WebGLBackend",`Unable to initialize WebGLBackend. ${e}`),!1}}createSessionHandler(e){return new Y_(this,e)}dispose(){this.glContext.dispose()}}});async function rv(e){if(e){let t=typeof e=="string"?[e]:e;for(let n of t){let s=Au.get(n);if(s)return s;let u=await pI(n);if(u)return u}}else return rv(["webgl"]);throw new Error("no available backend to use")}async function pI(e){let t=nv;if(typeof t[e]<"u"&&cI(t[e])){let n=t[e],s=n.initialize();if(typeof s=="object"&&"then"in s&&(s=await s),s)return Au.set(e,n),n}}function cI(e){let t=e;return"initialize"in t&&typeof t.initialize=="function"&&"createSessionHandler"in t&&typeof t.createSessionHandler=="function"&&"dispose"in t&&typeof t.dispose=="function"}var Au,nv,hI=k(()=>{"use strict";dI(),Au=new Map,nv={webgl:new tv}}),mh,iv,fI=k(()=>{"use strict";Ct(),mh=class{constructor(e,t){this.op=e,this.node=t}},iv=class{constructor(e,t,n){this.graph=e,this.profiler=n,this.initialize(t)}initialize(e){this.profiler.event("session","ExecutionPlan.initialize",()=>{let t=this.graph.getNodes();if(t.length!==e.length)throw new Error("The size of nodes and OPs do not match.");this._ops=e.map((n,s)=>new mh(n,t[s])),this.reset(),this._starter=[],this._ops.forEach((n,s)=>{let u=!0;for(let l of n.node.inputs)if(!this._values[l]&&this.graph.getInputIndices().indexOf(l)===-1){u=!1;break}u&&this._starter.push(s)})})}reset(){this._values=this.graph.getValues().map(e=>e.tensor)}async execute(e,t){return this.profiler.event("session","ExecutionPlan.execute",async()=>{this.reset();let n=e.createInferenceHandler(),s=this.graph.getInputIndices();if(t.length!==s.length)throw new Error(`number of input tensors don't match the number of inputs to the model: actual: ${t.length} expected: ${s.length}`);t.forEach((r,i)=>{let a=s[i];this._values[a]=r});let u=this._starter.slice(0),l=this.graph.getValues(),p=this.graph.getNodes(),d=0;for(;d<u.length;){let r=u[d++],i=this._ops[r],a=i.node.inputs.map(b=>this._values[b]);if(a.indexOf(void 0)!==-1)throw new Error(`unresolved input detected: op: ${i.node}`);let c=a;qe.verbose("ExecPlan",`Running op:${i.node.name} (${c.map((b,x)=>`'${i.node.inputs[x]}': ${b.type}[${b.dims.join(",")}]`).join(", ")})`);let h=await this.profiler.event("node",i.node.name,async()=>i.op.impl(n,c,i.op.context));if(h.length!==i.node.outputs.length)throw new Error("the size of output does not match model definition.");h.forEach((b,x)=>{let w=i.node.outputs[x];if(this._values[w])throw new Error(`output [${w}] already has value: op:${i.node.name}`);this._values[w]=b});let m=new Set;h.forEach((b,x)=>{let w=i.node.outputs[x];for(let _ of l[w].to){let I=p[_],E=!0;for(let O of I.inputs)if(!this._values[O]){E=!1;break}E&&m.add(_)}}),u.push(...m)}let o=[];for(let r=0;r<this.graph.getOutputIndices().length;r++){let i=this.graph.getOutputIndices()[r],a=this._values[i];if(a===void 0)throw new Error(`required output [${i}] does not have value`);i===0?await a.getData():a.data,o.push(a)}return qe.verbose("ExecPlan","disposing of inferenceHandler"),n.dispose(),o})}}}),ve,eu,mI=k(()=>{"use strict";io(),ve=ce(oi()),yn(),ke(),eu=class Wn{constructor(t){if(this._attributes=new Map,t!=null){for(let n of t)n instanceof ve.onnx.AttributeProto?this._attributes.set(n.name,[Wn.getValue(n),Wn.getType(n)]):n instanceof Ps.Attribute&&this._attributes.set(n.name(),[Wn.getValue(n),Wn.getType(n)]);if(this._attributes.size<t.length)throw new Error("duplicated attribute names")}}set(t,n,s){this._attributes.set(t,[s,n])}delete(t){this._attributes.delete(t)}getFloat(t,n){return this.get(t,"float",n)}getInt(t,n){return this.get(t,"int",n)}getString(t,n){return this.get(t,"string",n)}getTensor(t,n){return this.get(t,"tensor",n)}getFloats(t,n){return this.get(t,"floats",n)}getInts(t,n){return this.get(t,"ints",n)}getStrings(t,n){return this.get(t,"strings",n)}getTensors(t,n){return this.get(t,"tensors",n)}get(t,n,s){let u=this._attributes.get(t);if(u===void 0){if(s!==void 0)return s;throw new Error(`required attribute not found: ${t}`)}if(u[1]!==n)throw new Error(`type mismatch: expected ${n} but got ${u[1]}`);return u[0]}static getType(t){let n=t instanceof ve.onnx.AttributeProto?t.type:t.type();switch(n){case ve.onnx.AttributeProto.AttributeType.FLOAT:return"float";case ve.onnx.AttributeProto.AttributeType.INT:return"int";case ve.onnx.AttributeProto.AttributeType.STRING:return"string";case ve.onnx.AttributeProto.AttributeType.TENSOR:return"tensor";case ve.onnx.AttributeProto.AttributeType.FLOATS:return"floats";case ve.onnx.AttributeProto.AttributeType.INTS:return"ints";case ve.onnx.AttributeProto.AttributeType.STRINGS:return"strings";case ve.onnx.AttributeProto.AttributeType.TENSORS:return"tensors";default:throw new Error(`attribute type is not supported yet: ${ve.onnx.AttributeProto.AttributeType[n]}`)}}static getValue(t){let n=t instanceof ve.onnx.AttributeProto?t.type:t.type();if(n===ve.onnx.AttributeProto.AttributeType.GRAPH||n===ve.onnx.AttributeProto.AttributeType.GRAPHS)throw new Error("graph attribute is not supported yet");let s=this.getValueNoCheck(t);if(n===ve.onnx.AttributeProto.AttributeType.INT&&Lt.isLong(s))return Lt.longToNumber(s);if(n===ve.onnx.AttributeProto.AttributeType.INTS){let u=s,l=new Array(u.length);for(let p=0;p<u.length;p++){let d=u[p];l[p]=Lt.longToNumber(d)}return l}if(n===ve.onnx.AttributeProto.AttributeType.TENSOR)return t instanceof ve.onnx.AttributeProto?ct.fromProto(s):ct.fromOrtTensor(s);if(n===ve.onnx.AttributeProto.AttributeType.TENSORS){if(t instanceof ve.onnx.AttributeProto)return s.map(u=>ct.fromProto(u));if(t instanceof Ps.Attribute)return s.map(u=>ct.fromOrtTensor(u))}return n===ve.onnx.AttributeProto.AttributeType.STRING&&t instanceof ve.onnx.AttributeProto?As(s):n===ve.onnx.AttributeProto.AttributeType.STRINGS&&t instanceof ve.onnx.AttributeProto?s.map(As):s}static getValueNoCheck(t){return t instanceof ve.onnx.AttributeProto?this.getValueNoCheckFromOnnxFormat(t):this.getValueNoCheckFromOrtFormat(t)}static getValueNoCheckFromOnnxFormat(t){switch(t.type){case ve.onnx.AttributeProto.AttributeType.FLOAT:return t.f;case ve.onnx.AttributeProto.AttributeType.INT:return t.i;case ve.onnx.AttributeProto.AttributeType.STRING:return t.s;case ve.onnx.AttributeProto.AttributeType.TENSOR:return t.t;case ve.onnx.AttributeProto.AttributeType.GRAPH:return t.g;case ve.onnx.AttributeProto.AttributeType.FLOATS:return t.floats;case ve.onnx.AttributeProto.AttributeType.INTS:return t.ints;case ve.onnx.AttributeProto.AttributeType.STRINGS:return t.strings;case ve.onnx.AttributeProto.AttributeType.TENSORS:return t.tensors;case ve.onnx.AttributeProto.AttributeType.GRAPHS:return t.graphs;default:throw new Error(`unsupported attribute type: ${ve.onnx.AttributeProto.AttributeType[t.type]}`)}}static getValueNoCheckFromOrtFormat(t){switch(t.type()){case At.AttributeType.FLOAT:return t.f();case At.AttributeType.INT:return t.i();case At.AttributeType.STRING:return t.s();case At.AttributeType.TENSOR:return t.t();case At.AttributeType.GRAPH:return t.g();case At.AttributeType.FLOATS:return t.floatsArray();case At.AttributeType.INTS:{let n=[];for(let s=0;s<t.intsLength();s++)n.push(t.ints(s));return n}case At.AttributeType.STRINGS:{let n=[];for(let s=0;s<t.stringsLength();s++)n.push(t.strings(s));return n}case At.AttributeType.TENSORS:{let n=[];for(let s=0;s<t.tensorsLength();s++)n.push(t.tensors(s));return n}default:throw new Error(`unsupported attribute type: ${At.AttributeType[t.type()]}`)}}}}),pa,tu,Ht,ca,gh,gI=k(()=>{"use strict";mI(),io(),pa=ce(oi()),yn(),ke(),tu={from:(e,t)=>new gh(e,t)},Ht=class{constructor(e){this._from=void 0,this._to=[],this.tensor=void 0,this.type=void 0,e&&(this.type=dt.tensorValueTypeFromProto(e.type.tensorType))}get from(){return this._from}get to(){return this._to}},ca=class{constructor(e,t){e instanceof pa.onnx.NodeProto?(this.name=e.name,this.opType=e.opType,this.attributes=new eu(e.attribute)):e instanceof my.Node&&(this.name=t??e.name(),this.opType=e.opType(),this.attributes=new eu(dt.tensorAttributesFromORTFormat(e))),this.inputs=[],this.outputs=[],this.executeNode=!0}},gh=class{constructor(e,t){if(!e)throw new TypeError("graph is empty");this.buildGraph(e),this.transformGraph(t),this.checkIsAcyclic()}getInputIndices(){return this._allInputIndices}getInputNames(){return this._allInputNames}getOutputIndices(){return this._allOutputIndices}getOutputNames(){return this._allOutputNames}getValues(){return this._allData}getNodes(){return this._nodes}buildGraph(e){if(e instanceof pa.onnx.GraphProto)this.buildGraphFromOnnxFormat(e);else if(e instanceof hy.Graph)this.buildGraphFromOrtFormat(e);else throw new TypeError("Graph type is not supported.")}buildGraphFromOnnxFormat(e){let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let n=new Map;if(!e.input)throw new Error("missing information in graph: input");let s=[];for(let u of e.input){if(t.has(u.name))throw new Error(`duplicated input name: ${u.name}`);let l=this._allData.push(new Ht(u))-1;t.set(u.name,l),s.push(u.name)}if(!e.initializer)throw new Error("missing information in graph: initializer");for(let u of e.initializer){let l=t.get(u.name);if(l===void 0){let p=new Ht;p.type={shape:{dims:dt.tensorDimsFromProto(u.dims)},tensorType:dt.tensorDataTypeFromProto(u.dataType)},l=this._allData.push(p)-1,t.set(u.name,l)}this._allData[l]._from=-1,this._allData[l].tensor=ct.fromProto(u)}for(let u=0;u<this._allData.length;u++)this._allData[u].tensor||(this._allInputIndices.push(u),this._allInputNames.push(s[u]));if(!e.output)throw new Error("missing information in graph: output");for(let u of e.output){if(t.has(u.name))throw new Error(`duplicated output name: ${u.name}`);let l=this._allData.push(new Ht(u))-1;t.set(u.name,l),this._allOutputIndices.push(l),this._allOutputNames.push(u.name)}if(!e.node)throw new Error("missing information in graph: node");for(let u of e.node){if(!u.name)for(let p=0;;p++){let d=`unnamed_${u.opType}_${p}`;if(!n.has(d)){u.name=d;break}}if(n.has(u.name))throw new Error(`duplicated node name: ${u.name}`);let l=this._nodes.push(new ca(u))-1;n.set(u.name,l)}for(let u=0;u<this._nodes.length;u++){let l=this._nodes[u],p=e.node[u];if(!p.output)throw new Error(`missing output for node: ${p.name}`);for(let d of p.output){let o=t.get(d);if(typeof o>"u"&&(o=this._allData.push(new Ht)-1,t.set(d,o)),l.outputs.push(o),this._allData[o]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${o}`);if(this._allData[o]._from=u,p.opType==="Constant"){if(!p.attribute||p.attribute.length!==1||!p.attribute[0].t)throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(!p.output||p.output.length!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");l.outputs.pop(),l.executeNode=!1,this._allData[o]._from=-1,this._allData[o].tensor=ct.fromProto(p.attribute[0].t)}}}for(let u=0;u<this._nodes.length;u++){let l=this._nodes[u],p=e.node[u];if(!p.input)throw new Error(`missing input for node: ${p.name}`);for(let d of p.input){let o=t.get(d);if(typeof o>"u"){if(d===""&&(p.input.length===3||p.input.length===4)&&p.opType==="Resize")continue;throw new Error(`unrecognized input '${d}' for node: ${p.name}`)}l.inputs.push(o),this._allData[o]._to.push(u)}}return!0}buildGraphFromOrtFormat(e){var u,l,p;let t=new Map;this._allData=[],this._allInputIndices=[],this._allInputNames=[],this._allOutputIndices=[],this._allOutputNames=[],this._nodes=[];let n=new Map,s=[];for(let d=0;d<e.inputsLength();d++){let o=e.inputs(d);if(t.has(o))throw new Error(`duplicated input name: ${o}`);for(let r=0;r<e.nodeArgsLength();r++)if(((u=e.nodeArgs(r))==null?void 0:u.name())===o){let i=new Ht;if(((p=(l=e.nodeArgs(r))==null?void 0:l.type())==null?void 0:p.valueType())!==by.TypeInfoValue.tensor_type)throw new Error("Unexpected value type for the nodeArg.");let a=e.nodeArgs(r).type().value(new gy.TensorTypeAndShape),c=dt.tensorDataTypeFromProto(a.elemType()),h=a.shape(),m=[];for(let x=0;x<h.dimLength();x++)m.push(Lt.longToNumber(h.dim(x).value().dimValue()));i.type={shape:{dims:m},tensorType:c};let b=this._allData.push(i)-1;t.set(o,b),s.push(o)}}for(let d=0;d<e.initializersLength();d++){let o=e.initializers(d),r=t.get(o.name());if(r===void 0){let i=new Ht,a=dt.tensorDimsFromORTFormat(o),c=dt.tensorDataTypeFromProto(o.dataType());i.type={shape:{dims:a},tensorType:c},r=this._allData.push(i)-1,t.set(o.name(),r)}this._allData[r]._from=-1,this._allData[r].tensor=ct.fromOrtTensor(o)}for(let d=0;d<this._allData.length;d++)this._allData[d].tensor||(this._allInputIndices.push(d),this._allInputNames.push(s[d]));for(let d=0;d<e.outputsLength();d++){let o=e.outputs(d);if(t.has(o))throw new Error(`duplicated output name: ${o}`);let r=this._allData.push(new Ht)-1;t.set(o,r),this._allOutputIndices.push(r),this._allOutputNames.push(o)}if(!e.nodes)throw new Error("missing information in graph: node");for(let d=0;d<e.nodesLength();d++){let o=e.nodes(d),r=o.name();if(!r)for(let a=0;r=`unnamed_${o.opType()}_${a}`,!!n.has(r);a++);if(n.has(r))throw new Error(`duplicated node name: ${r}`);let i=this._nodes.push(new ca(o,r))-1;n.set(r,i)}for(let d=0;d<this._nodes.length;d++){let o=this._nodes[d],r=e.nodes(d);if(r==null)throw new Error(`No node exists at index ${d}`);if((r==null?void 0:r.outputsLength())===0)throw new Error(`missing output for node: ${r.name}`);for(let i=0;i<(r==null?void 0:r.outputsLength());i++){let a=r==null?void 0:r.outputs(i),c=t.get(a);if(typeof c>"u"&&(c=this._allData.push(new Ht)-1,t.set(a,c)),o.outputs.push(c),this._allData[c]._from!==void 0)throw new Error(`multiple nodes output to one data value: ${c}`);if(this._allData[c]._from=d,r.opType()==="Constant"){if(r.attributesLength()!==1||!r.attributes(0).t())throw new Error("missing attributes or missing tensor value in attributes for this Constant operator");if(r.outputsLength()!==1)throw new Error("missing output or incorrect number of outputs for this Constant operator");o.outputs.pop(),o.executeNode=!1,this._allData[c]._from=-1,this._allData[c].tensor=ct.fromOrtTensor(r.attributes(0).t())}}}for(let d=0;d<this._nodes.length;d++){let o=this._nodes[d],r=e.nodes(d);if(r.inputsLength()===0)throw new Error(`missing input for node: ${r.name}`);for(let i=0;i<r.inputsLength();i++){let a=r.inputs(i),c=t.get(a);if(typeof c>"u")throw new Error(`unrecognized input '${a}' for node: ${r.name()}`);o.inputs.push(c),this._allData[c]._to.push(d)}}}checkIsAcyclic(){let e=new Set;this._allInputIndices.forEach(s=>{this._allData[s]._to.forEach(u=>{e.add(u)})});let t=Array.from(e),n=new Array(this._nodes.length).fill("white");for(;t.length>0;){let s=t.pop();n[s]==="gray"?n[s]="black":(t.push(s),n[s]="gray",this._nodes[s].outputs.forEach(u=>{let l=this._allData[u];if(typeof l.tensor<"u")throw new Error("node outputs should not be initialized");if(l._from!==s)throw new Error("from property of the Value object doesn't match index of Node being processed");l._to.forEach(p=>{if(n[p]==="gray")throw new Error("model graph is cyclic");n[p]==="white"&&t.push(p)})}))}}transformGraph(e){this.removeAllIdentityNodes(),this.removeAllDropoutNodes(),this.fuseConvActivationNodes(),e&&e.transformGraph(this),this.finalizeGraph()}finalizeGraph(){let e=0,t=new Array(this._nodes.length,0),n=0;for(let s=0;s<this._nodes.length;s++)t[s]=n,this._nodes[s].executeNode?(n!==s&&(this._nodes[n]=this._nodes[s]),n++):this._nodes[s].outputs.forEach(u=>{this._allData[u]._from=-2});this._nodes.splice(n,this._nodes.length-n);for(let s=0;s<this._allData.length;s++){let u=this._allData[s];u._from!==void 0&&u._from!==-1&&u._from!==-2&&(u._from=t[u._from]);for(let l=0;l<u._to.length;l++)if(u._to[l]>=0)u._to[l]=t[u._to[l]];else throw new Error("Trying to update a removed node")}e=0;for(let s=0;s<this._allData.length;s++){if(this._allData[s].from===-2&&this._allOutputIndices.indexOf(s+e)===-1){e++,this._allData.splice(s,1),s--;continue}if(e>0){let u=-1;this._allData[s].from!==void 0&&this._allData[s].from!==-1?(u=this._nodes[this._allData[s].from].outputs.indexOf(s+e),u!==-1&&(this._nodes[this._allData[s].from].outputs[u]=s)):(u=this._allInputIndices.indexOf(s+e),u!==-1&&(this._allInputIndices[u]=s)),this._allData[s].to.forEach(l=>{u=this._nodes[l].inputs.indexOf(s+e),u!==-1&&(this._nodes[l].inputs[u]=s)}),this._allData[s].to.length===0&&(u=this._allOutputIndices.indexOf(s+e),u!==-1&&(this._allOutputIndices[u]=s))}}}deleteNode(e){let t=this._nodes[e];if(t.outputs.length>1){for(let p=1;p<t.outputs.length;p++)if(this._allData[t.outputs[p]].to.length>0)throw new Error("Node deletion with more than one output connected to other nodes is not supported. ")}t.executeNode=!1;let n=t.inputs[0],s=t.outputs[0],u=this._allData[s].to;for(let p=0;p<t.inputs.length;p++){let d=this._allData[t.inputs[p]].to.indexOf(e);if(d===-1)throw new Error("The Value object doesn't have the current Node in it's 'to' property ");this._allData[t.inputs[p]].to.splice(d,1)}this._allData[s]._to=[];let l=this._allOutputIndices.indexOf(s);if(l!==-1&&(this._allOutputIndices[l]=n),u&&u.length>0)for(let p of u){let d=this._nodes[p].inputs.indexOf(s);if(d===-1)throw new Error("The Node object doesn't have the output Value in it's 'inputs' property ");this._nodes[p].inputs[d]=n,this._allData[n].to.push(p)}}removeAllDropoutNodes(){let e=0;for(let t of this._nodes){if(t.opType==="Dropout"){if(t.inputs.length!==1)throw new Error("Dropout nodes should only contain one input. ");if(t.outputs.length!==1&&t.outputs.length!==2)throw new Error("Dropout nodes should contain either 1 or 2 output(s)");if(t.outputs.length===2&&this._allData[t.outputs[1]]._to.length!==0)throw new Error("Dropout nodes's second output should not be referenced by other nodes");this.deleteNode(e)}e++}}removeAllIdentityNodes(){let e=0;for(let t of this._nodes)t.opType==="Identity"&&this.deleteNode(e),e++}isActivation(e){switch(e.opType){case"Relu":case"Sigmoid":case"Clip":return!0;default:return!1}}fuseConvActivationNodes(){for(let e of this._nodes)if(e.opType==="Conv"){let t=this._allData[e.outputs[0]]._to;if(t.length===1&&this.isActivation(this._nodes[t[0]])){let n=this._nodes[t[0]];if(n.opType==="Clip")if(n.inputs.length===1)try{e.attributes.set("activation_params","floats",[n.attributes.getFloat("min"),n.attributes.getFloat("max")])}catch{e.attributes.set("activation_params","floats",[ti,ri])}else if(n.inputs.length>=3&&this._allData[n.inputs[1]].tensor!==void 0&&this._allData[n.inputs[2]].tensor!==void 0)e.attributes.set("activation_params","floats",[this._allData[n.inputs[1]].tensor.floatData[0],this._allData[n.inputs[2]].tensor.floatData[0]]);else continue;e.attributes.set("activation","string",n.opType),this.deleteNode(t[0])}}}}}),bh,yh,ov,bI=k(()=>{"use strict";bh=ce(Ae()),gI(),io(),yh=ce(oi()),ke(),ov=class{constructor(){}load(e,t,n){let s;if(!n)try{this.loadFromOnnxFormat(e,t);return}catch(u){if(n!==void 0)throw u;s=u}try{this.loadFromOrtFormat(e,t)}catch(u){throw n!==void 0?u:new Error(`Failed to load model as ONNX format: ${s}
as ORT format: ${u}`)}}loadFromOnnxFormat(e,t){let n=yh.onnx.ModelProto.decode(e);if(Lt.longToNumber(n.irVersion)<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=n.opsetImport.map(s=>({domain:s.domain,version:Lt.longToNumber(s.version)})),this._graph=tu.from(n.graph,t)}loadFromOrtFormat(e,t){let n=new bh.ByteBuffer(e),s=fy.InferenceSession.getRootAsInferenceSession(n).model();if(Lt.longToNumber(s.irVersion())<3)throw new Error("only support ONNX model with IR_VERSION>=3");this._opsets=[];for(let u=0;u<s.opsetImportLength();u++){let l=s.opsetImport(u);this._opsets.push({domain:l==null?void 0:l.domain(),version:Lt.longToNumber(l.version())})}this._graph=tu.from(s.graph(),t)}get graph(){return this._graph}get opsets(){return this._opsets}}}),av,yI=k(()=>{"use strict";hI(),fI(),Ct(),bI(),av=class{constructor(e={}){this._initialized=!1,this.backendHint=e.backendHint,this.profiler=Pb.create(e.profiler),this.context={profiler:this.profiler,graphInputTypes:[],graphInputDims:[]}}get inputNames(){return this._model.graph.getInputNames()}get outputNames(){return this._model.graph.getOutputNames()}startProfiling(){this.profiler.start()}endProfiling(){this.profiler.stop()}async loadModel(e,t,n){await this.profiler.event("session","Session.loadModel",async()=>{let s=await rv(this.backendHint);if(this.sessionHandler=s.createSessionHandler(this.context),this._model=new ov,typeof e=="string"){let u=e.endsWith(".ort");{let l=await(await fetch(e)).arrayBuffer();this.initialize(new Uint8Array(l),u)}}else if(ArrayBuffer.isView(e))this.initialize(e);else{let u=new Uint8Array(e,t||0,n||e.byteLength);this.initialize(u)}})}initialize(e,t){if(this._initialized)throw new Error("already initialized");this.profiler.event("session","Session.initialize",()=>{let n=this.sessionHandler.transformGraph?this.sessionHandler:void 0;this._model.load(e,n,t),this.sessionHandler.onGraphInitialized&&this.sessionHandler.onGraphInitialized(this._model.graph),this.initializeOps(this._model.graph),this._executionPlan=new iv(this._model.graph,this._ops,this.profiler)}),this._initialized=!0}async run(e){if(!this._initialized)throw new Error("session not initialized yet");return this.profiler.event("session","Session.run",async()=>{let t=this.normalizeAndValidateInputs(e),n=await this._executionPlan.execute(this.sessionHandler,t);return this.createOutput(n)})}normalizeAndValidateInputs(e){let t=this._model.graph.getInputNames();if(Array.isArray(e)){if(e.length!==t.length)throw new Error(`incorrect input array length: expected ${t.length} but got ${e.length}`)}else{if(e.size!==t.length)throw new Error(`incorrect input map size: expected ${t.length} but got ${e.size}`);let n=new Array(e.size),s=0;for(let u=0;u<t.length;++u){let l=e.get(t[u]);if(!l)throw new Error(`missing input tensor for: '${name}'`);n[s++]=l}e=n}if(!this.context.graphInputTypes||this.context.graphInputTypes.length===0||!this.context.graphInputDims||this.context.graphInputDims.length===0){let n=this._model.graph.getInputIndices(),s=this._model.graph.getValues(),u=new Array(n.length);for(let l=0;l<n.length;++l){let p=s[n[l]];u[l]=p.type.shape.dims,this.context.graphInputTypes.push(p.type.tensorType),this.context.graphInputDims.push(e[l].dims)}this.validateInputTensorDims(u,e,!0)}else this.validateInputTensorDims(this.context.graphInputDims,e,!1);return this.validateInputTensorTypes(this.context.graphInputTypes,e),e}validateInputTensorTypes(e,t){for(let n=0;n<t.length;n++){let s=e[n],u=t[n].type;if(s!==u)throw new Error(`input tensor[${n}] check failed: expected type '${s}' but got ${u}`)}}validateInputTensorDims(e,t,n){for(let s=0;s<t.length;s++){let u=e[s],l=t[s].dims;if(!this.compareTensorDims(u,l,n))throw new Error(`input tensor[${s}] check failed: expected shape '[${u.join(",")}]' but got [${l.join(",")}]`)}}compareTensorDims(e,t,n){if(e.length!==t.length)return!1;for(let s=0;s<e.length;++s)if(e[s]!==t[s]&&(!n||e[s]!==0))return!1;return!0}createOutput(e){let t=this._model.graph.getOutputNames();if(e.length!==t.length)throw new Error("expected number of outputs do not match number of generated outputs");let n=new Map;for(let s=0;s<t.length;++s)n.set(t[s],e[s]);return n}initializeOps(e){let t=e.getNodes();this._ops=new Array(t.length);for(let n=0;n<t.length;n++)this._ops[n]=this.sessionHandler.resolve(t[n],this._model.opsets,e)}}}),sv,_I=k(()=>{"use strict";et(),yn(),sv=class{constructor(e){this.session=e,this.inputNames=this.session.inputNames,this.outputNames=this.session.outputNames}get inputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}get outputMetadata(){throw new Error("Getting model metadata is not supported in webgl backend.")}async dispose(){}async run(e,t,n){let s=new Map;for(let p in e)if(Object.hasOwnProperty.call(e,p)){let d=e[p];s.set(p,new ct(d.dims,d.type,void 0,void 0,d.data))}let u=await this.session.run(s),l={};return u.forEach((p,d)=>{l[d]=new Dt(p.type,p.data,p.dims)}),l}startProfiling(){this.session.startProfiling()}endProfiling(){this.session.endProfiling()}}}),ku,uv=k(()=>{"use strict";ku=e=>{if(e!=null&&e.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),lv={};Yr(lv,{onnxjsBackend:()=>dv});var _h,dv,vI=k(()=>{"use strict";yI(),_I(),uv(),_h=class{async init(){}async createInferenceSessionHandler(e,t){ku(t);let n=new av(t);return typeof e=="string"?await n.loadModel(e):await n.loadModel(e),new sv(n)}},dv=new _h}),Du=k(()=>{"use strict"}),pv={};Yr(pv,{default:()=>cv});var ha,fa,cv,wI=k(()=>{"use strict";var e;w2(),tn(),Cu(),ha="ort-wasm-proxy-worker",fa=((e=globalThis.self)==null?void 0:e.name)===ha,fa&&(self.onmessage=t=>{let{type:n,in:s}=t.data;try{switch(n){case"init-wasm":Nu(s.wasm).then(()=>{Ju(s).then(()=>{postMessage({type:n})},u=>{postMessage({type:n,err:u})})},u=>{postMessage({type:n,err:u})});break;case"init-ep":{let{epName:u,env:l}=s;Qu(l,u).then(()=>{postMessage({type:n})},p=>{postMessage({type:n,err:p})});break}case"copy-from":{let{buffer:u}=s,l=Yi(u);postMessage({type:n,out:l});break}case"create":{let{model:u,options:l}=s;Yu(u,l).then(p=>{postMessage({type:n,out:p})},p=>{postMessage({type:n,err:p})});break}case"release":el(s),postMessage({type:n});break;case"run":{let{sessionId:u,inputIndices:l,inputs:p,outputIndices:d,options:o}=s;tl(u,l,p,d,new Array(d.length).fill(null),o).then(r=>{r.some(i=>i[3]!=="cpu")?postMessage({type:n,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:n,out:r},nl([...p,...r]))},r=>{postMessage({type:n,err:r})});break}case"end-profiling":rl(s),postMessage({type:n});break;default:}}catch(u){postMessage({type:n,err:u})}}),cv=fa?null:t=>new Worker(t??lt,{type:"module",name:ha})}),hv={};Yr(hv,{default:()=>fv});async function vh(e={}){var ep,tp;var t=e,n=!!globalThis.window,s=!!globalThis.WorkerGlobalScope,u=s&&((ep=self.name)==null?void 0:ep.startsWith("em-pthread"));t.mountExternalData=(f,g)=>{f.startsWith("./")&&(f=f.substring(2)),(t.jd||(t.jd=new Map)).set(f,g)},t.unmountExternalData=()=>{delete t.jd,delete t.ke,delete t.je,delete t.le},globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,shared:!0}).buffer.constructor;let l=f=>async(...g)=>{var v;try{if(t.hd)throw Error("Session already started");let y=t.hd={Vd:g[0],errors:[]},T=await f(...g);if(t.hd!==y)throw Error("Session mismatch");(v=t.pd)==null||v.flush();let P=y.errors;if(0<P.length){let C=await Promise.all(P);if(C=C.filter(j=>j),0<C.length)throw Error(C.join(`
`))}return T}finally{t.hd=null}};t.jsepInit=(f,g)=>{if(f==="webgpu"){[t.pd,t.Ld,t.Pd,t.rd,t.Od,t.ic,t.Qd,t.Sd,t.Md,t.Nd,t.Rd]=g;let v=t.pd;t.jsepRegisterBuffer=(y,T,P,C)=>v.registerBuffer(y,T,P,C),t.jsepGetBuffer=y=>v.getBuffer(y),t.jsepCreateDownloader=(y,T,P)=>v.createDownloader(y,T,P),t.jsepOnCreateSession=y=>{v.onCreateSession(y)},t.jsepOnReleaseSession=y=>{v.onReleaseSession(y)},t.jsepOnRunStart=y=>v.onRunStart(y),t.Td=(y,T)=>{v.upload(y,T)}}else if(f==="webnn"){let v=g[0];[t.ce,t.Cd,t.webnnEnsureTensor,t.Dd,t.webnnDownloadTensor,t.be,t.webnnEnableTraceEvent]=g.slice(1),t.webnnReleaseTensorId=t.Cd,t.webnnUploadTensor=t.Dd,t.webnnRegisterMLContext=t.be,t.webnnOnRunStart=y=>v.onRunStart(y),t.webnnOnRunEnd=v.onRunEnd.bind(v),t.webnnOnReleaseSession=y=>{v.onReleaseSession(y)},t.webnnCreateMLTensorDownloader=(y,T)=>v.createMLTensorDownloader(y,T),t.webnnRegisterMLTensor=(y,T,P,C)=>v.registerMLTensor(y,T,P,C),t.webnnCreateMLContext=y=>v.createMLContext(y),t.webnnRegisterGraphInput=v.registerGraphInput.bind(v),t.webnnIsGraphInput=v.isGraphInput.bind(v),t.webnnRegisterGraphOutput=v.registerGraphOutput.bind(v),t.webnnIsGraphOutput=v.isGraphOutput.bind(v),t.webnnCreateTemporaryTensor=v.createTemporaryTensor.bind(v),t.webnnIsGraphInputOutputTypeSupported=v.isGraphInputOutputTypeSupported.bind(v)}};let p=()=>{let f=g=>(...v)=>{let y=Rt;return v=g(...v),Rt!=y?new Promise((T,P)=>{_o={resolve:T,reject:P}}):v};(g=>{for(let v of g)t[v]=f(t[v])})("_OrtAppendExecutionProvider _OrtAppendExecutionProviderV2 _OrtCreateSession _OrtRun _OrtRunWithBinding _OrtBindInput".split(" ")),l!==void 0&&(t._OrtRun=l(t._OrtRun),t._OrtRunWithBinding=l(t._OrtRunWithBinding)),p=void 0};t.asyncInit=()=>{p==null||p()};var d,o,r=(f,g)=>{throw g},i=import.meta.url,a="";if(n||s){try{a=new URL(".",i).href}catch{}s&&(o=f=>{var g=new XMLHttpRequest;return g.open("GET",f,!1),g.responseType="arraybuffer",g.send(null),new Uint8Array(g.response)}),d=async f=>{if(D(f))return new Promise((v,y)=>{var T=new XMLHttpRequest;T.open("GET",f,!0),T.responseType="arraybuffer",T.onload=()=>{T.status==200||T.status==0&&T.response?v(T.response):y(T.status)},T.onerror=y,T.send(null)});var g=await fetch(f,{credentials:"same-origin"});if(g.ok)return g.arrayBuffer();throw Error(g.status+" : "+g.url)}}var c,h,m,b,x,w,_=console.log.bind(console),I=console.error.bind(console),E=_,O=I,A=!1,D=f=>f.startsWith("file://");function S(){Qt.buffer!=U.buffer&&X()}if(u){let f=function(g){try{var v=g.data,y=v.bd;if(y==="load"){let T=[];self.onmessage=P=>T.push(P),w=()=>{postMessage({bd:"loaded"});for(let P of T)f(P);self.onmessage=f};for(let P of v.Hd)t[P]&&!t[P].proxy||(t[P]=(...C)=>{postMessage({bd:"callHandler",Fd:P,args:C})},P=="print"&&(E=t[P]),P=="printErr"&&(O=t[P]));Qt=v.Zd,X(),h=v.$d,le(),vi()}else if(y==="run"){(function(T){var P=(S(),$)[T+52>>>2>>>0];T=(S(),$)[T+56>>>2>>>0],ud(P,P-T),he(P)})(v.ad),To(v.ad,0,0,1,0,0),ul(),go(v.ad),F||(rd(),F=!0);try{z2(v.Xd,v.nd)}catch(T){if(T!="unwind")throw T}}else v.target!=="setimmediate"&&(y==="checkMailbox"?F&&hi():y&&(O(`worker: received unknown command ${y}`),O(v)))}catch(T){throw nd(),T}};var F=!1;self.onunhandledrejection=g=>{throw g.reason||g},self.onmessage=f}var U,Q,H,N,M,$,B,q,J,K,ae,z=!1;function X(){var f=Qt.buffer;t.HEAP8=U=new Int8Array(f),H=new Int16Array(f),t.HEAPU8=Q=new Uint8Array(f),N=new Uint16Array(f),t.HEAP32=M=new Int32Array(f),t.HEAPU32=$=new Uint32Array(f),B=new Float32Array(f),q=new Float64Array(f),J=new BigInt64Array(f),K=new BigUint64Array(f)}function Z(){z=!0,u?w():qt.vb()}function V(f){throw O(f="Aborted("+f+")"),A=!0,f=new WebAssembly.RuntimeError(f+". Build with -sASSERTIONS for more info."),x==null||x(f),f}function fe(){return{a:{na:i$,jb:n$,g:R2,G:B2,f:M2,o:j2,h:F2,$:L2,b:V2,S:U2,Ja:fl,n:q2,aa:yl,_a:_l,Fa:vl,Ha:wl,$a:xl,Ya:$l,Ra:Tl,Xa:Sl,la:Il,Ga:Ol,Da:El,Za:Pl,Ea:Al,eb:G2,ga:H2,ya:W2,wa:X2,fa:J2,N:Q2,I:Y2,xa:ex,_:sx,za:ux,Ua:lx,Ba:px,Ka:cx,ua:hx,ha:fx,Ta:go,bb:mx,Q:_x,r:Tx,c:fo,kb:Sx,y:Ix,M:Ox,D:Ex,m:Px,s:Ml,lb:Ax,J:kx,R:Dx,j:Cx,u:Nx,q:zx,k:Rx,Oa:Bx,Pa:Mx,Qa:jx,Ma:Vl,Na:Ul,va:ql,gb:Lx,db:Ux,v:qx,ba:Gx,ia:Hx,cb:Vx,V:Wx,ab:Kx,Ca:Xx,F:Fx,U:Zx,ma:yi,Aa:Qx,ib:Jx,hb:Yx,Va:Kl,Wa:Xl,Ia:at,T:Zl,La:Jl,ka:Ql,Sa:Yl,ja:ed,nb:V$,oa:B$,ob:L$,pa:R$,H:S$,e:u$,t:a$,w:o$,B:_$,pb:C$,Z:D$,x:c$,qa:N$,X:M$,ca:k$,qb:A$,ea:d$,O:v$,sb:O$,ra:P$,tb:I$,L:$$,Y:z$,d:s$,A:p$,l:l$,mb:U$,p:f$,z:m$,C:h$,E:g$,K:w$,sa:T$,P:j$,da:x$,W:F$,ub:y$,ta:b$,rb:E$,i:t$,a:Qt,fb:Ve}}}async function le(){function f(y,T){var P=qt=y.exports;y={};for(let[C,j]of Object.entries(P))typeof j=="function"?(P=gx(j),y[C]=P):y[C]=j;return qt=y,qt=(function(){var C=qt,j=Y=>pe=>Y(pe)>>>0,W=Y=>()=>Y()>>>0;return(C=Object.assign({},C)).wb=j(C.wb),C.ec=W(C.ec),C.gc=j(C.gc),C.uc=j(C.uc),C.vc=W(C.vc),C.zc=j(C.zc),C})(),al.push(qt.hc),td=(y=qt).wb,rd=y.xb,t._OrtInit=y.yb,t._OrtGetLastError=y.zb,t._OrtCreateSessionOptions=y.Ab,t._OrtAppendExecutionProvider=y.Bb,t._OrtGetEpDevices=y.Cb,t._OrtEpDevice_EpName=y.Db,t._OrtAppendExecutionProviderV2=y.Eb,t._OrtAddFreeDimensionOverride=y.Fb,t._OrtAddSessionConfigEntry=y.Gb,t._OrtReleaseSessionOptions=y.Hb,t._OrtCreateSession=y.Ib,t._OrtReleaseSession=y.Jb,t._OrtGetInputOutputCount=y.Kb,t._OrtGetInputOutputMetadata=y.Lb,t._OrtFree=y.Mb,t._OrtCreateTensor=y.Nb,t._OrtGetTensorData=y.Ob,t._OrtReleaseTensor=y.Pb,t._OrtCreateLoraAdapter=y.Qb,t._OrtReleaseLoraAdapter=y.Rb,t._OrtCreateRunOptions=y.Sb,t._OrtAddRunConfigEntry=y.Tb,t._OrtRunOptionsAddActiveLoraAdapter=y.Ub,t._OrtReleaseRunOptions=y.Vb,t._OrtCreateBinding=y.Wb,t._OrtBindInput=y.Xb,t._OrtBindOutput=y.Yb,t._OrtClearBoundOutputs=y.Zb,t._OrtReleaseBinding=y._b,t._OrtRunWithBinding=y.$b,t._OrtRun=y.ac,t._OrtEndProfiling=y.bc,t._JsepOutput=y.cc,t._JsepGetNodeName=y.dc,_i=y.ec,Bt=t._free=y.fc,$n=t._malloc=y.gc,To=y.jc,nd=y.kc,id=y.lc,od=y.mc,So=y.nc,ad=y.oc,sd=y.pc,be=y.qc,Tn=y.rc,ud=y.sc,he=y.tc,Io=y.uc,me=y.vc,ld=y.wc,Oo=y.xc,dd=y.yc,pd=y.zc,cd=y.Ac,Eo=y.Bc,hd=y.Cc,fd=y.Dc,md=y.Ec,gd=y.Fc,bd=y.Gc,yd=y.Hc,_d=y.Ic,vd=y.Jc,wd=y.Kc,xd=y.Lc,$d=y.Mc,Td=y.Nc,Sd=y.Oc,Id=y.Pc,Od=y.Qc,Ed=y.Rc,Pd=y.Sc,Ad=y.Tc,kd=y.Uc,Dd=y.Vc,Cd=y.Wc,Nd=y.Xc,zd=y.Yc,Rd=y._c,Bd=y.$c,Md=y.kd,jd=y.ld,Fd=y.qd,Ld=y.vd,Vd=y.wd,Ud=y.xd,qd=y.yd,Gd=y.zd,Hd=y.Ad,Wd=y.Bd,Kd=y.Gd,Xd=y.Jd,Zd=y.fe,Jd=y.ge,Qd=y.he,Yd=y.ie,h=T,qt}var g,v=fe();return t.instantiateWasm?new Promise(y=>{t.instantiateWasm(v,(T,P)=>{y(f(T,P))})}):u?f(new WebAssembly.Instance(h,fe()),h):(ae??(ae=t.locateFile?t.locateFile?t.locateFile("ort-wasm-simd-threaded.jsep.wasm",a):a+"ort-wasm-simd-threaded.jsep.wasm":new URL(""+new URL("ort-wasm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,import.meta.url).href),g=await(async function(y){var T=ae;if(!c&&!D(T))try{var P=fetch(T,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(P,y)}catch(C){O(`wasm streaming compile failed: ${C}`),O("falling back to ArrayBuffer instantiation")}return(async function(C,j){try{var W=await(async function(Y){if(!c)try{var pe=await d(Y);return new Uint8Array(pe)}catch{}if(Y==ae&&c)Y=new Uint8Array(c);else{if(!o)throw"both async and sync fetching of the wasm failed";Y=o(Y)}return Y})(C);return await WebAssembly.instantiate(W,j)}catch(Y){O(`failed to asynchronously prepare wasm: ${Y}`),V(Y)}})(T,y)})(v),f(g.instance,g.module))}class de{constructor(g){rp(this,"name","ExitStatus");this.message=`Program terminated with exit(${g})`,this.status=g}}var He=f=>{f.terminate(),f.onmessage=()=>{}},Qe=[],gr=0,br=null,$t=f=>{Nt.length==0&&(dl(),ll(Nt[0]));var g=Nt.pop();if(!g)return 6;yr.push(g),_r[f.ad]=g,g.ad=f.ad;var v={bd:"run",Xd:f.Wd,nd:f.nd,ad:f.ad};return g.postMessage(v,f.ud),0},Ye=0,Pe=(f,g,...v)=>{var y,T=16*v.length,P=me(),C=Io(T),j=C>>>3;for(y of v)typeof y=="bigint"?((S(),J)[j++>>>0]=1n,(S(),J)[j++>>>0]=y):((S(),J)[j++>>>0]=0n,(S(),q)[j++>>>0]=y);return f=id(f,0,T,C,g),he(P),f};function Ve(f){if(u)return Pe(0,1,f);if(m=f,!(0<Ye)){for(var g of yr)He(g);for(g of Nt)He(g);Nt=[],yr=[],_r={},A=!0}r(0,new de(f))}function Me(f){if(u)return Pe(1,0,f);at(f)}var at=f=>{if(m=f,u)throw Me(f),"unwind";Ve(f)},Nt=[],yr=[],al=[],_r={},sl=f=>{var g=f.ad;delete _r[g],Nt.push(f),yr.splice(yr.indexOf(f),1),f.ad=0,od(g)};function ul(){al.forEach(f=>f())}var ll=f=>new Promise(g=>{f.onmessage=T=>{var P=T.data;if(T=P.bd,P.md&&P.md!=_i()){var C=_r[P.md];C?C.postMessage(P,P.ud):O(`Internal error! Worker sent a message "${T}" to target pthread ${P.md}, but that thread no longer exists!`)}else T==="checkMailbox"?hi():T==="spawnThread"?$t(P):T==="cleanupThread"?ci(()=>{sl(_r[P.Yd])}):T==="loaded"?(f.loaded=!0,g(f)):P.target==="setimmediate"?f.postMessage(P):T==="uncaughtException"?f.onerror(P.error):T==="callHandler"?t[P.Fd](...P.args):T&&O(`worker sent an unknown command ${T}`)},f.onerror=T=>{throw O(`worker sent an error! ${T.filename}:${T.lineno}: ${T.message}`),T};var v,y=[];for(v of[])t.propertyIsEnumerable(v)&&y.push(v);f.postMessage({bd:"load",Hd:y,Zd:Qt,$d:h})});function dl(){var f=new Worker((()=>{let g=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new g("ort.all.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});Nt.push(f)}var Qt,z2=(f,g)=>{Ye=0,f=Eo(f,g),0<Ye?m=f:So(f)},li=[],di=0;function R2(f){var g=new lo(f>>>=0);return(S(),U)[g.cd+12>>>0]==0&&(pl(g,!0),di--),cl(g,!1),li.push(g),pd(f)}var nn=0,B2=()=>{be(0,0);var f=li.pop();ld(f.od),nn=0};function pl(f,g){g=g?1:0,(S(),U)[f.cd+12>>>0]=g}function cl(f,g){g=g?1:0,(S(),U)[f.cd+13>>>0]=g}class lo{constructor(g){this.od=g,this.cd=g-24}}var po=f=>{var g=nn;if(!g)return Tn(0),0;var v=new lo(g);(S(),$)[v.cd+16>>>2>>>0]=g;var y=(S(),$)[v.cd+4>>>2>>>0];if(!y)return Tn(0),g;for(var T of f){if(T===0||T===y)break;if(dd(T,y,v.cd+16))return Tn(T),g}return Tn(y),g};function M2(){return po([])}function j2(f){return po([f>>>0])}function F2(f,g,v,y){return po([f>>>0,g>>>0,v>>>0,y>>>0])}var L2=()=>{var f=li.pop();f||V("no exception to throw");var g=f.od;throw(S(),U)[f.cd+13>>>0]==0&&(li.push(f),cl(f,!0),pl(f,!1),di++),Oo(g),nn=g};function V2(f,g,v){var y=new lo(f>>>=0);throw g>>>=0,v>>>=0,(S(),$)[y.cd+16>>>2>>>0]=0,(S(),$)[y.cd+4>>>2>>>0]=g,(S(),$)[y.cd+8>>>2>>>0]=v,Oo(f),di++,nn=f}var U2=()=>di;function hl(f,g,v,y){return u?Pe(2,1,f,g,v,y):fl(f,g,v,y)}function fl(f,g,v,y){if(f>>>=0,g>>>=0,v>>>=0,y>>>=0,!globalThis.SharedArrayBuffer)return 6;var T=[];return u&&T.length===0?hl(f,g,v,y):(f={Wd:v,ad:f,nd:y,ud:T},u?(f.bd="spawnThread",postMessage(f,T),0):$t(f))}function q2(f){throw nn||(nn=f>>>0),nn}var ml=globalThis.TextDecoder&&new TextDecoder,gl=(f,g,v,y)=>{if(v=g+v,y)return v;for(;f[g]&&!(g>=v);)++g;return g},bl=(f,g=0,v,y)=>{if(16<(v=gl(f,g>>>=0,v,y))-g&&f.buffer&&ml)return ml.decode(f.buffer instanceof ArrayBuffer?f.subarray(g,v):f.slice(g,v));for(y="";g<v;){var T=f[g++];if(128&T){var P=63&f[g++];if((224&T)==192)y+=String.fromCharCode((31&T)<<6|P);else{var C=63&f[g++];65536>(T=(240&T)==224?(15&T)<<12|P<<6|C:(7&T)<<18|P<<12|C<<6|63&f[g++])?y+=String.fromCharCode(T):(T-=65536,y+=String.fromCharCode(55296|T>>10,56320|1023&T))}}else y+=String.fromCharCode(T)}return y},Ge=(f,g,v)=>(f>>>=0)?bl((S(),Q),f,g,v):"";function yl(f,g,v){return u?Pe(3,1,f,g,v):0}function _l(f,g){if(u)return Pe(4,1,f,g)}function vl(f,g){if(u)return Pe(5,1,f,g)}function wl(f,g,v){if(u)return Pe(6,1,f,g,v)}function xl(f,g,v){return u?Pe(7,1,f,g,v):0}function $l(f,g){if(u)return Pe(8,1,f,g)}function Tl(f,g,v){if(u)return Pe(9,1,f,g,v)}function Sl(f,g,v,y){if(u)return Pe(10,1,f,g,v,y)}function Il(f,g,v,y){if(u)return Pe(11,1,f,g,v,y)}function Ol(f,g,v,y){if(u)return Pe(12,1,f,g,v,y)}function El(f){if(u)return Pe(13,1,f)}function Pl(f,g){if(u)return Pe(14,1,f,g)}function Al(f,g,v){if(u)return Pe(15,1,f,g,v)}var G2=()=>V(""),zt=f=>{f>>>=0;for(var g="";;){var v=(S(),Q)[f++>>>0];if(!v)return g;g+=String.fromCharCode(v)}},co={},ho={},on=class extends Error{constructor(f){super(f),this.name="BindingError"}};function Ut(f,g,v={}){return(function(y,T,P={}){var C=T.name;if(!y)throw new on(`type "${C}" must have a positive integer typeid pointer`);if(ho.hasOwnProperty(y)){if(P.Id)return;throw new on(`Cannot register type '${C}' twice`)}ho[y]=T,co.hasOwnProperty(y)&&(T=co[y],delete co[y],T.forEach(j=>j()))})(f,g,v)}var kl=(f,g,v)=>{switch(g){case 1:return v?y=>(S(),U)[y>>>0]:y=>(S(),Q)[y>>>0];case 2:return v?y=>(S(),H)[y>>>1>>>0]:y=>(S(),N)[y>>>1>>>0];case 4:return v?y=>(S(),M)[y>>>2>>>0]:y=>(S(),$)[y>>>2>>>0];case 8:return v?y=>(S(),J)[y>>>3>>>0]:y=>(S(),K)[y>>>3>>>0];default:throw new TypeError(`invalid integer width (${g}): ${f}`)}};function H2(f,g,v,y,T){f>>>=0,v>>>=0,g=zt(g>>>0);let P=C=>C;if(y=y===0n){let C=8*v;P=j=>BigInt.asUintN(C,j),T=P(T)}Ut(f,{name:g,Zc:P,ed:(C,j)=>(typeof j=="number"&&(j=BigInt(j)),j),dd:kl(g,v,!y),gd:null})}function W2(f,g,v,y){Ut(f>>>=0,{name:g=zt(g>>>0),Zc:function(T){return!!T},ed:function(T,P){return P?v:y},dd:function(T){return this.Zc((S(),Q)[T>>>0])},gd:null})}var Dl=[],vr=[0,1,,1,null,1,!0,1,!1,1];function fo(f){9<(f>>>=0)&&--vr[f+1]===0&&(vr[f]=void 0,Dl.push(f))}var mt=f=>{if(!f)throw new on(`Cannot use deleted val. handle = ${f}`);return vr[f]},Tt=f=>{switch(f){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let g=Dl.pop()||vr.length;return vr[g]=f,vr[g+1]=1,g}};function mo(f){return this.Zc((S(),$)[f>>>2>>>0])}var K2={name:"emscripten::val",Zc:f=>{var g=mt(f);return fo(f),g},ed:(f,g)=>Tt(g),dd:mo,gd:null};function X2(f){return Ut(f>>>0,K2)}var Z2=(f,g)=>{switch(g){case 4:return function(v){return this.Zc((S(),B)[v>>>2>>>0])};case 8:return function(v){return this.Zc((S(),q)[v>>>3>>>0])};default:throw new TypeError(`invalid float width (${g}): ${f}`)}};function J2(f,g,v){v>>>=0,Ut(f>>>=0,{name:g=zt(g>>>0),Zc:y=>y,ed:(y,T)=>T,dd:Z2(g,v),gd:null})}function Q2(f,g,v,y,T){f>>>=0,v>>>=0,g=zt(g>>>0);let P=j=>j;if(y===0){var C=32-8*v;P=j=>j<<C>>>C,T=P(T)}Ut(f,{name:g,Zc:P,ed:(j,W)=>W,dd:kl(g,v,y!==0),gd:null})}function Y2(f,g,v){function y(P){var C=(S(),$)[P>>>2>>>0];return P=(S(),$)[P+4>>>2>>>0],new T((S(),U).buffer,P,C)}var T=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][g];Ut(f>>>=0,{name:v=zt(v>>>0),Zc:y,dd:y},{Id:!0})}var Yt=(f,g,v)=>{var y=(S(),Q);if(g>>>=0,0<v){var T=g;v=g+v-1;for(var P=0;P<f.length;++P){var C=f.codePointAt(P);if(127>=C){if(g>=v)break;y[g++>>>0]=C}else if(2047>=C){if(g+1>=v)break;y[g++>>>0]=192|C>>6,y[g++>>>0]=128|63&C}else if(65535>=C){if(g+2>=v)break;y[g++>>>0]=224|C>>12,y[g++>>>0]=128|C>>6&63,y[g++>>>0]=128|63&C}else{if(g+3>=v)break;y[g++>>>0]=240|C>>18,y[g++>>>0]=128|C>>12&63,y[g++>>>0]=128|C>>6&63,y[g++>>>0]=128|63&C,P++}}y[g>>>0]=0,f=g-T}else f=0;return f},pi=f=>{for(var g=0,v=0;v<f.length;++v){var y=f.charCodeAt(v);127>=y?g++:2047>=y?g+=2:55296<=y&&57343>=y?(g+=4,++v):g+=3}return g};function ex(f,g){Ut(f>>>=0,{name:g=zt(g>>>0),Zc(v){var y=(S(),$)[v>>>2>>>0];return y=Ge(v+4,y,!0),Bt(v),y},ed(v,y){y instanceof ArrayBuffer&&(y=new Uint8Array(y));var T=typeof y=="string";if(!(T||ArrayBuffer.isView(y)&&y.BYTES_PER_ELEMENT==1))throw new on("Cannot pass non-string to std::string");var P=T?pi(y):y.length,C=$n(4+P+1),j=C+4;return(S(),$)[C>>>2>>>0]=P,T?Yt(y,j,P+1):(S(),Q).set(y,j>>>0),v!==null&&v.push(Bt,C),C},dd:mo,gd(v){Bt(v)}})}var Cl=globalThis.TextDecoder?new TextDecoder("utf-16le"):void 0,tx=(f,g,v)=>{if(f>>>=1,16<(g=gl((S(),N),f,g/2,v))-f&&Cl)return Cl.decode((S(),N).slice(f,g));for(v="";f<g;++f){var y=(S(),N)[f>>>0];v+=String.fromCharCode(y)}return v},rx=(f,g,v)=>{if(v??(v=2147483647),2>v)return 0;var y=g;v=(v-=2)<2*f.length?v/2:f.length;for(var T=0;T<v;++T){var P=f.charCodeAt(T);(S(),H)[g>>>1>>>0]=P,g+=2}return(S(),H)[g>>>1>>>0]=0,g-y},nx=f=>2*f.length,ix=(f,g,v)=>{var y="";f>>>=2;for(var T=0;!(T>=g/4);T++){var P=(S(),$)[f+T>>>0];if(!P&&!v)break;y+=String.fromCodePoint(P)}return y},ox=(f,g,v)=>{if(g>>>=0,v??(v=2147483647),4>v)return 0;var y=g;v=y+v-4;for(var T=0;T<f.length;++T){var P=f.codePointAt(T);if(65535<P&&T++,(S(),M)[g>>>2>>>0]=P,(g+=4)+4>v)break}return(S(),M)[g>>>2>>>0]=0,g-y},ax=f=>{for(var g=0,v=0;v<f.length;++v)65535<f.codePointAt(v)&&v++,g+=4;return g};function sx(f,g,v){if(f>>>=0,g>>>=0,v=zt(v>>>=0),g===2)var y=tx,T=rx,P=nx;else y=ix,T=ox,P=ax;Ut(f,{name:v,Zc:C=>{var j=(S(),$)[C>>>2>>>0];return j=y(C+4,j*g,!0),Bt(C),j},ed:(C,j)=>{if(typeof j!="string")throw new on(`Cannot pass non-string to C++ string type ${v}`);var W=P(j),Y=$n(4+W+g);return(S(),$)[Y>>>2>>>0]=W/g,T(j,Y+4,W+g),C!==null&&C.push(Bt,Y),Y},dd:mo,gd(C){Bt(C)}})}function ux(f,g){Ut(f>>>=0,{Kd:!0,name:g=zt(g>>>0),Zc:()=>{},ed:()=>{}})}function lx(f){To(f>>>0,!s,1,!n,131072,!1),ul()}var ci=f=>{if(!A)try{if(f(),!(0<Ye))try{u?_i()&&So(m):at(m)}catch(g){g instanceof de||g=="unwind"||r(0,g)}}catch(g){g instanceof de||g=="unwind"||r(0,g)}},dx=!Atomics.waitAsync||((tp=globalThis.navigator)==null?void 0:tp.userAgent)&&91>Number((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||[])[2]);function go(f){f>>>=0,dx||(Atomics.waitAsync((S(),M),f>>>2,f).value.then(hi),f+=128,Atomics.store((S(),M),f>>>2,1))}var hi=()=>ci(()=>{var f=_i();f&&(go(f),sd())});function px(f,g){(f>>>=0)==g>>>0?setTimeout(hi):u?postMessage({md:f,bd:"checkMailbox"}):(f=_r[f])&&f.postMessage({bd:"checkMailbox"})}var bo=[];function cx(f,g,v,y,T){for(g>>>=0,T>>>=0,bo.length=0,v=T>>>3,y=T+y>>>3;v<y;){var P;P=(S(),J)[v++>>>0]?(S(),J)[v++>>>0]:(S(),q)[v++>>>0],bo.push(P)}return(g?Po[g]:r$[f])(...bo)}var hx=()=>{Ye=0};function fx(f){f>>>=0,u?postMessage({bd:"cleanupThread",Yd:f}):sl(_r[f])}function mx(f){}var fi=f=>{try{f()}catch(g){V(g)}};function gx(f){var g=(...v)=>{mi.push(f);try{return f(...v)}finally{A||(mi.pop(),Rt&&er===1&&mi.length===0&&(er=0,Ye+=1,fi(Jd),typeof Fibers<"u"&&Fibers.ne()))}};return Rl.set(f,g),g}var er=0,Rt=null,Nl=0,mi=[],yo=new Map,zl=new Map,Rl=new Map,bx=0,_o=null,yx=[],Bl=f=>(function(g){if(!A){if(er===0){var v=!1,y=!1;g((T=0)=>{if(!A&&(Nl=T,v=!0,y)){er=2,fi(()=>Qd(Rt)),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.resume(),T=!1;try{var P=(function(){var W=(S(),M)[Rt+8>>>2>>>0];return W=zl.get(W),W=Rl.get(W),--Ye,W()})()}catch(W){P=W,T=!0}var C=!1;if(!Rt){var j=_o;j&&(_o=null,(T?j.reject:j.resolve)(P),C=!0)}if(T&&!C)throw P}}),y=!0,v||(er=1,Rt=(function(){var T=$n(65548),P=T+12;if((S(),$)[T>>>2>>>0]=P,(S(),$)[T+4>>>2>>>0]=P+65536,P=mi[0],!yo.has(P)){var C=bx++;yo.set(P,C),zl.set(C,P)}return P=yo.get(P),(S(),M)[T+8>>>2>>>0]=P,T})(),typeof MainLoop<"u"&&MainLoop.Ed&&MainLoop.pause(),fi(()=>Zd(Rt)))}else er===2?(er=0,fi(Yd),Bt(Rt),Rt=null,yx.forEach(ci)):V(`invalid state: ${er}`);return Nl}})(g=>{f().then(g)});function _x(f){return f>>>=0,Bl(async()=>{var g=await mt(f);return Tt(g)})}var vo=[],vx=f=>{var g=vo.length;return vo.push(f),g},wx=(f,g)=>{for(var v=Array(f),y=0;y<f;++y){var T=y,P=(S(),$)[g+4*y>>>2>>>0],C=ho[P];if(C===void 0)throw f=`parameter ${y}`,P=td(P),g=zt(P),Bt(P),new on(`${f} has unknown type ${g}`);v[T]=C}return v},xx=(f,g,v)=>{var y=[];return f=f(y,v),y.length&&((S(),$)[g>>>2>>>0]=Tt(y)),f},$x={},gi=f=>{var g=$x[f];return g===void 0?zt(f):g};function Tx(f,g,v){var[y,...T]=wx(f,g>>>0);g=y.ed.bind(y);var P=T.map(W=>W.dd.bind(W));f--;var C={toValue:mt};switch(f=P.map((W,Y)=>{var pe=`argFromPtr${Y}`;return C[pe]=W,`${pe}(args${Y?"+"+8*Y:""})`}),v){case 0:var j="toValue(handle)";break;case 2:j="new (toValue(handle))";break;case 3:j="";break;case 1:C.getStringOrSymbol=gi,j="toValue(handle)[getStringOrSymbol(methodName)]"}return j+=`(${f})`,y.Kd||(C.toReturnWire=g,C.emval_returnValue=xx,j=`return emval_returnValue(toReturnWire, destructorsRef, ${j})`),j=`return function (handle, methodName, destructorsRef, args) {
  ${j}
  }`,v=new Function(Object.keys(C),j)(...Object.values(C)),j=`methodCaller<(${T.map(W=>W.name)}) => ${y.name}>`,vx(Object.defineProperty(v,"name",{value:j}))}function Sx(f,g){return g>>>=0,(f=mt(f>>>0))==mt(g)}function Ix(f){return(f>>>=0)?(f=gi(f),Tt(globalThis[f])):Tt(globalThis)}function Ox(f){return f=gi(f>>>0),Tt(t[f])}function Ex(f,g){return g>>>=0,f=mt(f>>>0),g=mt(g),Tt(f[g])}function Px(f){9<(f>>>=0)&&(vr[f+1]+=1)}function Ml(f,g,v,y,T){return vo[f>>>0](g>>>0,v>>>0,y>>>0,T>>>0)}function Ax(f,g,v,y,T){return Ml(f>>>0,g>>>0,v>>>0,y>>>0,T>>>0)}function kx(){return Tt([])}function Dx(f){f=mt(f>>>0);for(var g=Array(f.length),v=0;v<f.length;v++)g[v]=f[v];return Tt(g)}function Cx(f){return Tt(gi(f>>>0))}function Nx(){return Tt({})}function zx(f){for(var g=mt(f>>>=0);g.length;){var v=g.pop();g.pop()(v)}fo(f)}function Rx(f,g,v){g>>>=0,v>>>=0,f=mt(f>>>0),g=mt(g),v=mt(v),f[g]=v}function Bx(f,g){f=-9007199254740992>f||9007199254740992<f?NaN:Number(f),g>>>=0,f=new Date(1e3*f),(S(),M)[g>>>2>>>0]=f.getUTCSeconds(),(S(),M)[g+4>>>2>>>0]=f.getUTCMinutes(),(S(),M)[g+8>>>2>>>0]=f.getUTCHours(),(S(),M)[g+12>>>2>>>0]=f.getUTCDate(),(S(),M)[g+16>>>2>>>0]=f.getUTCMonth(),(S(),M)[g+20>>>2>>>0]=f.getUTCFullYear()-1900,(S(),M)[g+24>>>2>>>0]=f.getUTCDay(),f=(f.getTime()-Date.UTC(f.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,(S(),M)[g+28>>>2>>>0]=f}var jl=f=>f%4==0&&(f%100!=0||f%400==0),Fl=[0,31,60,91,121,152,182,213,244,274,305,335],Ll=[0,31,59,90,120,151,181,212,243,273,304,334];function Mx(f,g){f=-9007199254740992>f||9007199254740992<f?NaN:Number(f),g>>>=0,f=new Date(1e3*f),(S(),M)[g>>>2>>>0]=f.getSeconds(),(S(),M)[g+4>>>2>>>0]=f.getMinutes(),(S(),M)[g+8>>>2>>>0]=f.getHours(),(S(),M)[g+12>>>2>>>0]=f.getDate(),(S(),M)[g+16>>>2>>>0]=f.getMonth(),(S(),M)[g+20>>>2>>>0]=f.getFullYear()-1900,(S(),M)[g+24>>>2>>>0]=f.getDay();var v=(jl(f.getFullYear())?Fl:Ll)[f.getMonth()]+f.getDate()-1|0;(S(),M)[g+28>>>2>>>0]=v,(S(),M)[g+36>>>2>>>0]=-60*f.getTimezoneOffset(),v=new Date(f.getFullYear(),6,1).getTimezoneOffset();var y=new Date(f.getFullYear(),0,1).getTimezoneOffset();f=0|(v!=y&&f.getTimezoneOffset()==Math.min(y,v)),(S(),M)[g+32>>>2>>>0]=f}function jx(f){f>>>=0;var g=new Date((S(),M)[f+20>>>2>>>0]+1900,(S(),M)[f+16>>>2>>>0],(S(),M)[f+12>>>2>>>0],(S(),M)[f+8>>>2>>>0],(S(),M)[f+4>>>2>>>0],(S(),M)[f>>>2>>>0],0),v=(S(),M)[f+32>>>2>>>0],y=g.getTimezoneOffset(),T=new Date(g.getFullYear(),6,1).getTimezoneOffset(),P=new Date(g.getFullYear(),0,1).getTimezoneOffset(),C=Math.min(P,T);return 0>v?(S(),M)[f+32>>>2>>>0]=+(T!=P&&C==y):0<v!=(C==y)&&(T=Math.max(P,T),g.setTime(g.getTime()+6e4*((0<v?C:T)-y))),(S(),M)[f+24>>>2>>>0]=g.getDay(),v=(jl(g.getFullYear())?Fl:Ll)[g.getMonth()]+g.getDate()-1|0,(S(),M)[f+28>>>2>>>0]=v,(S(),M)[f>>>2>>>0]=g.getSeconds(),(S(),M)[f+4>>>2>>>0]=g.getMinutes(),(S(),M)[f+8>>>2>>>0]=g.getHours(),(S(),M)[f+12>>>2>>>0]=g.getDate(),(S(),M)[f+16>>>2>>>0]=g.getMonth(),(S(),M)[f+20>>>2>>>0]=g.getYear(),f=g.getTime(),BigInt(isNaN(f)?-1:f/1e3)}function Vl(f,g,v,y,T,P,C){return u?Pe(16,1,f,g,v,y,T,P,C):-52}function Ul(f,g,v,y,T,P){if(u)return Pe(17,1,f,g,v,y,T,P)}var xn={},Fx=()=>performance.timeOrigin+performance.now();function ql(f,g){if(u)return Pe(18,1,f,g);if(xn[f]&&(clearTimeout(xn[f].id),delete xn[f]),!g)return 0;var v=setTimeout(()=>{delete xn[f],ci(()=>ad(f,performance.timeOrigin+performance.now()))},g);return xn[f]={id:v,me:g},0}function Lx(f,g,v,y){f>>>=0,g>>>=0,v>>>=0,y>>>=0;var T=new Date().getFullYear(),P=new Date(T,0,1).getTimezoneOffset();T=new Date(T,6,1).getTimezoneOffset();var C=Math.max(P,T);(S(),$)[f>>>2>>>0]=60*C,(S(),M)[g>>>2>>>0]=+(P!=T),f=(g=j=>{var W=Math.abs(j);return`UTC${0<=j?"-":"+"}${String(Math.floor(W/60)).padStart(2,"0")}${String(W%60).padStart(2,"0")}`})(P),g=g(T),T<P?(Yt(f,v,17),Yt(g,y,17)):(Yt(f,y,17),Yt(g,v,17))}var Vx=()=>Date.now();function Ux(f,g,v){return v>>>=0,0<=f&&3>=f?(f===0?f=Date.now():f=performance.timeOrigin+performance.now(),f=Math.round(1e6*f),(S(),J)[v>>>3>>>0]=BigInt(f),0):28}var wo=[],Gl=(f,g)=>{wo.length=0;for(var v;v=(S(),Q)[f++>>>0];){var y=v!=105;g+=(y&=v!=112)&&g%8?4:0,wo.push(v==112?(S(),$)[g>>>2>>>0]:v==106?(S(),J)[g>>>3>>>0]:v==105?(S(),M)[g>>>2>>>0]:(S(),q)[g>>>3>>>0]),g+=y?8:4}return wo};function qx(f,g,v){return f>>>=0,g=Gl(g>>>0,v>>>0),Po[f](...g)}function Gx(f,g,v){return f>>>=0,g=Gl(g>>>0,v>>>0),Po[f](...g)}var Hx=()=>{};function Wx(f,g){return O(Ge(f>>>0,g>>>0))}var Kx=()=>{throw Ye+=1,"unwind"};function Xx(){return 4294901760}var Zx=()=>navigator.hardwareConcurrency,wr={},bi=f=>{var g;return(g=/\bwasm-function\[\d+\]:(0x[0-9a-f]+)/.exec(f))?+g[1]:(g=/:(\d+):\d+(?:\)|$)/.exec(f))?2147483648|+g[1]:0},Hl=f=>{for(var g of f)(f=bi(g))&&(wr[f]=g)};function Jx(){var f=Error().stack.toString().split(`
`);return f[0]=="Error"&&f.shift(),Hl(f),wr.sd=bi(f[3]),wr.Ud=f,wr.sd}function yi(f){if(!(f=wr[f>>>0]))return 0;var g;if(g=/^\s+at .*\.wasm\.(.*) \(.*\)$/.exec(f))f=g[1];else if(g=/^\s+at (.*) \(.*\)$/.exec(f))f=g[1];else{if(!(g=/^(.+?)@/.exec(f)))return 0;f=g[1]}Bt(yi.td??0),g=pi(f)+1;var v=$n(g);return v&&Yt(f,v,g),yi.td=v,yi.td}function Qx(f){f>>>=0;var g=(S(),Q).length;if(f<=g||4294901760<f)return!1;for(var v=1;4>=v;v*=2){var y=g*(1+.2/v);y=Math.min(y,f+100663296);e:{y=(Math.min(4294901760,65536*Math.ceil(Math.max(f,y)/65536))-Qt.buffer.byteLength+65535)/65536|0;try{Qt.grow(y),X();var T=1;break e}catch{}T=void 0}if(T)return!0}return!1}function Yx(f,g,v){if(f>>>=0,g>>>=0,wr.sd==f)var y=wr.Ud;else(y=Error().stack.toString().split(`
`))[0]=="Error"&&y.shift(),Hl(y);for(var T=3;y[T]&&bi(y[T])!=f;)++T;for(f=0;f<v&&y[f+T];++f)(S(),M)[g+4*f>>>2>>>0]=bi(y[f+T]);return f}var xo,$o={},Wl=()=>{var y;if(!xo){var f,g={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(((y=globalThis.navigator)==null?void 0:y.language)??"C").replace("-","_")+".UTF-8",_:"./this.program"};for(f in $o)$o[f]===void 0?delete g[f]:g[f]=$o[f];var v=[];for(f in g)v.push(`${f}=${g[f]}`);xo=v}return xo};function Kl(f,g){if(u)return Pe(19,1,f,g);f>>>=0,g>>>=0;var v,y=0,T=0;for(v of Wl()){var P=g+y;(S(),$)[f+T>>>2>>>0]=P,y+=Yt(v,P,1/0)+1,T+=4}return 0}function Xl(f,g){if(u)return Pe(20,1,f,g);f>>>=0,g>>>=0;var v=Wl();for(var y of((S(),$)[f>>>2>>>0]=v.length,f=0,v))f+=pi(y)+1;return(S(),$)[g>>>2>>>0]=f,0}function Zl(f){return u?Pe(21,1,f):52}function Jl(f,g,v,y,T){return u?Pe(22,1,f,g,v,y,T):52}function Ql(f,g,v,y){return u?Pe(23,1,f,g,v,y):52}function Yl(f,g,v,y){return u?Pe(24,1,f,g,v,y):70}var e$=[null,[],[]];function ed(f,g,v,y){if(u)return Pe(25,1,f,g,v,y);g>>>=0,v>>>=0,y>>>=0;for(var T=0,P=0;P<v;P++){var C=(S(),$)[g>>>2>>>0],j=(S(),$)[g+4>>>2>>>0];g+=8;for(var W=0;W<j;W++){var Y=f,pe=(S(),Q)[C+W>>>0],xe=e$[Y];pe===0||pe===10?((Y===1?E:O)(bl(xe)),xe.length=0):xe.push(pe)}T+=j}return(S(),$)[y>>>2>>>0]=T,0}function t$(f){return f>>>0}u||(function(){for(var f=t.numThreads-1;f--;)dl();Qe.push(async()=>{var g=(async function(){if(!u)return Promise.all(Nt.map(ll))})();gr++,await g,--gr==0&&br&&(g=br,br=null,g())})})(),u||(Qt=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),X()),t.wasmBinary&&(c=t.wasmBinary),t.stackSave=()=>me(),t.stackRestore=f=>he(f),t.stackAlloc=f=>Io(f),t.setValue=function(f,g,v="i8"){switch(v.endsWith("*")&&(v="*"),v){case"i1":case"i8":(S(),U)[f>>>0]=g;break;case"i16":(S(),H)[f>>>1>>>0]=g;break;case"i32":(S(),M)[f>>>2>>>0]=g;break;case"i64":(S(),J)[f>>>3>>>0]=BigInt(g);break;case"float":(S(),B)[f>>>2>>>0]=g;break;case"double":(S(),q)[f>>>3>>>0]=g;break;case"*":(S(),$)[f>>>2>>>0]=g;break;default:V(`invalid type for setValue: ${v}`)}},t.getValue=function(f,g="i8"){switch(g.endsWith("*")&&(g="*"),g){case"i1":case"i8":return(S(),U)[f>>>0];case"i16":return(S(),H)[f>>>1>>>0];case"i32":return(S(),M)[f>>>2>>>0];case"i64":return(S(),J)[f>>>3>>>0];case"float":return(S(),B)[f>>>2>>>0];case"double":return(S(),q)[f>>>3>>>0];case"*":return(S(),$)[f>>>2>>>0];default:V(`invalid type for getValue: ${g}`)}},t.UTF8ToString=Ge,t.stringToUTF8=Yt,t.lengthBytesUTF8=pi;var td,rd,_i,Bt,$n,To,nd,id,od,So,ad,sd,be,Tn,ud,he,Io,me,ld,Oo,dd,pd,cd,Eo,hd,fd,md,gd,bd,yd,_d,vd,wd,xd,$d,Td,Sd,Id,Od,Ed,Pd,Ad,kd,Dd,Cd,Nd,zd,Rd,Bd,Md,jd,Fd,Ld,Vd,Ud,qd,Gd,Hd,Wd,Kd,Xd,Zd,Jd,Qd,Yd,qt,r$=[Ve,Me,hl,yl,_l,vl,wl,xl,$l,Tl,Sl,Il,Ol,El,Pl,Al,Vl,Ul,ql,Kl,Xl,Zl,Jl,Ql,Yl,ed],Po={1124124:(f,g,v,y,T)=>{if(t===void 0||!t.jd)return 1;if((f=Ge(Number(f>>>0))).startsWith("./")&&(f=f.substring(2)),!(f=t.jd.get(f)))return 2;if(g=Number(g>>>0),v=Number(v>>>0),y=Number(y>>>0),g+v>f.byteLength)return 3;try{let P=f.subarray(g,g+v);switch(T){case 0:(S(),Q).set(P,y>>>0);break;case 1:t.ae?t.ae(y,P):t.Td(y,P);break;default:return 4}return 0}catch{return 4}},1124948:()=>typeof navigator<"u"&&navigator.de?1:0,1125020:(f,g,v)=>{t.Dd(f,(S(),Q).subarray(g>>>0,g+v>>>0))},1125084:()=>t.ce(),1125126:f=>{t.Cd(f)},1125163:()=>{t.Md()},1125194:()=>{t.Nd()},1125223:()=>{t.Rd()},1125248:f=>t.Ld(f),1125281:f=>t.Pd(f),1125313:(f,g,v)=>{t.rd(Number(f),Number(g),Number(v),!0)},1125376:(f,g,v)=>{t.rd(Number(f),Number(g),Number(v))},1125433:()=>typeof wasmOffsetConverter<"u",1125490:f=>{t.ic("Abs",f,void 0)},1125541:f=>{t.ic("Neg",f,void 0)},1125592:f=>{t.ic("Floor",f,void 0)},1125645:f=>{t.ic("Ceil",f,void 0)},1125697:f=>{t.ic("Reciprocal",f,void 0)},1125755:f=>{t.ic("Sqrt",f,void 0)},1125807:f=>{t.ic("Exp",f,void 0)},1125858:f=>{t.ic("Erf",f,void 0)},1125909:f=>{t.ic("Sigmoid",f,void 0)},1125964:(f,g,v)=>{t.ic("HardSigmoid",f,{alpha:g,beta:v})},1126043:f=>{t.ic("HardSwish",f,void 0)},1126100:f=>{t.ic("Log",f,void 0)},1126151:f=>{t.ic("Sin",f,void 0)},1126202:f=>{t.ic("Cos",f,void 0)},1126253:f=>{t.ic("Tan",f,void 0)},1126304:f=>{t.ic("Asin",f,void 0)},1126356:f=>{t.ic("Acos",f,void 0)},1126408:f=>{t.ic("Atan",f,void 0)},1126460:f=>{t.ic("Sinh",f,void 0)},1126512:f=>{t.ic("Cosh",f,void 0)},1126564:f=>{t.ic("Asinh",f,void 0)},1126617:f=>{t.ic("Acosh",f,void 0)},1126670:f=>{t.ic("Atanh",f,void 0)},1126723:f=>{t.ic("Tanh",f,void 0)},1126775:f=>{t.ic("Not",f,void 0)},1126826:(f,g,v)=>{t.ic("Clip",f,{min:g,max:v})},1126895:f=>{t.ic("Clip",f,void 0)},1126947:(f,g)=>{t.ic("Elu",f,{alpha:g})},1127005:f=>{t.ic("Gelu",f,void 0)},1127057:f=>{t.ic("Relu",f,void 0)},1127109:(f,g)=>{t.ic("LeakyRelu",f,{alpha:g})},1127173:(f,g)=>{t.ic("ThresholdedRelu",f,{alpha:g})},1127243:(f,g)=>{t.ic("Cast",f,{to:g})},1127301:f=>{t.ic("Add",f,void 0)},1127352:f=>{t.ic("Sub",f,void 0)},1127403:f=>{t.ic("Mul",f,void 0)},1127454:f=>{t.ic("Div",f,void 0)},1127505:f=>{t.ic("Pow",f,void 0)},1127556:f=>{t.ic("Equal",f,void 0)},1127609:f=>{t.ic("Greater",f,void 0)},1127664:f=>{t.ic("GreaterOrEqual",f,void 0)},1127726:f=>{t.ic("Less",f,void 0)},1127778:f=>{t.ic("LessOrEqual",f,void 0)},1127837:(f,g,v,y,T)=>{t.ic("ReduceMean",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128012:(f,g,v,y,T)=>{t.ic("ReduceMax",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128186:(f,g,v,y,T)=>{t.ic("ReduceMin",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128360:(f,g,v,y,T)=>{t.ic("ReduceProd",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128535:(f,g,v,y,T)=>{t.ic("ReduceSum",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128709:(f,g,v,y,T)=>{t.ic("ReduceL1",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1128882:(f,g,v,y,T)=>{t.ic("ReduceL2",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129055:(f,g,v,y,T)=>{t.ic("ReduceLogSum",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129232:(f,g,v,y,T)=>{t.ic("ReduceSumSquare",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129412:(f,g,v,y,T)=>{t.ic("ReduceLogSumExp",f,{keepDims:!!g,noopWithEmptyAxes:!!v,axes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1129592:f=>{t.ic("Where",f,void 0)},1129645:(f,g,v)=>{t.ic("Transpose",f,{perm:g?Array.from((S(),M).subarray(Number(g)>>>0,Number(v)>>>0)):[]})},1129769:(f,g,v,y)=>{t.ic("DepthToSpace",f,{blocksize:g,mode:Ge(v),format:y?"NHWC":"NCHW"})},1129902:(f,g,v,y)=>{t.ic("DepthToSpace",f,{blocksize:g,mode:Ge(v),format:y?"NHWC":"NCHW"})},1130035:(f,g,v,y)=>{t.ic("DFT",f,{axis:g,inverse:v,onesided:y})},1130127:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze,tr)=>{t.ic("ConvTranspose",f,{format:W?"NHWC":"NCHW",autoPad:g,dilations:[v],group:y,kernelShape:[T],pads:[P,C],strides:[j],wIsConst:()=>!!(S(),U)[Y>>>0],outputPadding:pe?Array.from((S(),M).subarray(Number(pe)>>>0,Number(xe)>>>0)):[],outputShape:Ce?Array.from((S(),M).subarray(Number(Ce)>>>0,Number(ze)>>>0)):[],activation:Ge(tr)})},1130560:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("ConvTranspose",f,{format:j?"NHWC":"NCHW",autoPad:g,dilations:Array.from((S(),M).subarray(Number(v)>>>0,(Number(v)>>>0)+2>>>0)),group:y,kernelShape:Array.from((S(),M).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((S(),M).subarray(Number(P)>>>0,(Number(P)>>>0)+4>>>0)),strides:Array.from((S(),M).subarray(Number(C)>>>0,(Number(C)>>>0)+2>>>0)),wIsConst:()=>!!(S(),U)[W>>>0],outputPadding:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],outputShape:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[],activation:Ge(ze)})},1131221:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze,tr)=>{t.ic("ConvTranspose",f,{format:W?"NHWC":"NCHW",autoPad:g,dilations:[v],group:y,kernelShape:[T],pads:[P,C],strides:[j],wIsConst:()=>!!(S(),U)[Y>>>0],outputPadding:pe?Array.from((S(),M).subarray(Number(pe)>>>0,Number(xe)>>>0)):[],outputShape:Ce?Array.from((S(),M).subarray(Number(Ce)>>>0,Number(ze)>>>0)):[],activation:Ge(tr)})},1131654:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("ConvTranspose",f,{format:j?"NHWC":"NCHW",autoPad:g,dilations:Array.from((S(),M).subarray(Number(v)>>>0,(Number(v)>>>0)+2>>>0)),group:y,kernelShape:Array.from((S(),M).subarray(Number(T)>>>0,(Number(T)>>>0)+2>>>0)),pads:Array.from((S(),M).subarray(Number(P)>>>0,(Number(P)>>>0)+4>>>0)),strides:Array.from((S(),M).subarray(Number(C)>>>0,(Number(C)>>>0)+2>>>0)),wIsConst:()=>!!(S(),U)[W>>>0],outputPadding:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],outputShape:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[],activation:Ge(ze)})},1132315:(f,g)=>{t.ic("GlobalAveragePool",f,{format:g?"NHWC":"NCHW"})},1132406:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("AveragePool",f,{format:ze?"NHWC":"NCHW",auto_pad:g,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[],kernel_shape:j?Array.from((S(),M).subarray(Number(j)>>>0,Number(W)>>>0)):[],pads:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],strides:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1132885:(f,g)=>{t.ic("GlobalAveragePool",f,{format:g?"NHWC":"NCHW"})},1132976:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("AveragePool",f,{format:ze?"NHWC":"NCHW",auto_pad:g,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[],kernel_shape:j?Array.from((S(),M).subarray(Number(j)>>>0,Number(W)>>>0)):[],pads:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],strides:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1133455:(f,g)=>{t.ic("GlobalMaxPool",f,{format:g?"NHWC":"NCHW"})},1133542:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("MaxPool",f,{format:ze?"NHWC":"NCHW",auto_pad:g,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[],kernel_shape:j?Array.from((S(),M).subarray(Number(j)>>>0,Number(W)>>>0)):[],pads:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],strides:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1134017:(f,g)=>{t.ic("GlobalMaxPool",f,{format:g?"NHWC":"NCHW"})},1134104:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze)=>{t.ic("MaxPool",f,{format:ze?"NHWC":"NCHW",auto_pad:g,ceil_mode:v,count_include_pad:y,storage_order:T,dilations:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[],kernel_shape:j?Array.from((S(),M).subarray(Number(j)>>>0,Number(W)>>>0)):[],pads:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],strides:xe?Array.from((S(),M).subarray(Number(xe)>>>0,Number(Ce)>>>0)):[]})},1134579:(f,g,v,y,T)=>{t.ic("Gemm",f,{alpha:g,beta:v,transA:y,transB:T})},1134683:f=>{t.ic("MatMul",f,void 0)},1134737:(f,g,v,y)=>{t.ic("ArgMax",f,{keepDims:!!g,selectLastIndex:!!v,axis:y})},1134845:(f,g,v,y)=>{t.ic("ArgMin",f,{keepDims:!!g,selectLastIndex:!!v,axis:y})},1134953:(f,g)=>{t.ic("Softmax",f,{axis:g})},1135016:(f,g)=>{t.ic("Concat",f,{axis:g})},1135076:(f,g,v,y,T)=>{t.ic("Split",f,{axis:g,numOutputs:v,splitSizes:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1135232:f=>{t.ic("Expand",f,void 0)},1135286:(f,g)=>{t.ic("Gather",f,{axis:Number(g)})},1135357:(f,g)=>{t.ic("GatherElements",f,{axis:Number(g)})},1135436:(f,g)=>{t.ic("GatherND",f,{batch_dims:Number(g)})},1135515:(f,g,v,y,T,P,C,j,W,Y,pe)=>{t.ic("Resize",f,{antialias:g,axes:v?Array.from((S(),M).subarray(Number(v)>>>0,Number(y)>>>0)):[],coordinateTransformMode:Ge(T),cubicCoeffA:P,excludeOutside:C,extrapolationValue:j,keepAspectRatioPolicy:Ge(W),mode:Ge(Y),nearestMode:Ge(pe)})},1135877:(f,g,v,y,T,P,C)=>{t.ic("Slice",f,{starts:g?Array.from((S(),M).subarray(Number(g)>>>0,Number(v)>>>0)):[],ends:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[],axes:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[]})},1136141:f=>{t.ic("Tile",f,void 0)},1136193:(f,g,v)=>{t.ic("InstanceNormalization",f,{epsilon:g,format:v?"NHWC":"NCHW"})},1136307:(f,g,v)=>{t.ic("InstanceNormalization",f,{epsilon:g,format:v?"NHWC":"NCHW"})},1136421:f=>{t.ic("Range",f,void 0)},1136474:(f,g)=>{t.ic("Einsum",f,{equation:Ge(g)})},1136555:(f,g,v,y,T)=>{t.ic("Pad",f,{mode:g,value:v,pads:y?Array.from((S(),M).subarray(Number(y)>>>0,Number(T)>>>0)):[]})},1136698:(f,g,v,y,T,P)=>{t.ic("BatchNormalization",f,{epsilon:g,momentum:v,spatial:!!T,trainingMode:!!y,format:P?"NHWC":"NCHW"})},1136867:(f,g,v,y,T,P)=>{t.ic("BatchNormalization",f,{epsilon:g,momentum:v,spatial:!!T,trainingMode:!!y,format:P?"NHWC":"NCHW"})},1137036:(f,g,v)=>{t.ic("CumSum",f,{exclusive:Number(g),reverse:Number(v)})},1137133:(f,g,v)=>{t.ic("DequantizeLinear",f,{axis:g,blockSize:v})},1137223:(f,g,v,y,T)=>{t.ic("GridSample",f,{align_corners:g,mode:Ge(v),padding_mode:Ge(y),format:T?"NHWC":"NCHW"})},1137393:(f,g,v,y,T)=>{t.ic("GridSample",f,{align_corners:g,mode:Ge(v),padding_mode:Ge(y),format:T?"NHWC":"NCHW"})},1137563:(f,g)=>{t.ic("ScatterND",f,{reduction:Ge(g)})},1137648:(f,g,v,y,T,P,C,j,W)=>{t.ic("Attention",f,{numHeads:g,isUnidirectional:v,maskFilterValue:y,scale:T,doRotary:P,qkvHiddenSizes:C?Array.from((S(),M).subarray(Number(j)>>>0,Number(j)+C>>>0)):[],pastPresentShareBuffer:!!W})},1137920:f=>{t.ic("BiasAdd",f,void 0)},1137975:f=>{t.ic("BiasSplitGelu",f,void 0)},1138036:f=>{t.ic("FastGelu",f,void 0)},1138092:(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze,tr,Ao)=>{t.ic("Conv",f,{format:xe?"NHWC":"NCHW",auto_pad:g,dilations:v?Array.from((S(),M).subarray(Number(v)>>>0,Number(y)>>>0)):[],group:T,kernel_shape:P?Array.from((S(),M).subarray(Number(P)>>>0,Number(C)>>>0)):[],pads:j?Array.from((S(),M).subarray(Number(j)>>>0,Number(W)>>>0)):[],strides:Y?Array.from((S(),M).subarray(Number(Y)>>>0,Number(pe)>>>0)):[],w_is_const:()=>!!(S(),U)[Number(Ce)>>>0],activation:Ge(ze),activation_params:tr?Array.from((S(),B).subarray(Number(tr)>>>0,Number(Ao)>>>0)):[]})},1138676:f=>{t.ic("Gelu",f,void 0)},1138728:(f,g,v,y,T,P,C,j,W)=>{t.ic("GroupQueryAttention",f,{numHeads:g,kvNumHeads:v,scale:y,softcap:T,doRotary:P,rotaryInterleaved:C,smoothSoftmax:j,localWindowSize:W})},1138945:(f,g,v,y)=>{t.ic("LayerNormalization",f,{axis:g,epsilon:v,simplified:!!y})},1139056:(f,g,v,y)=>{t.ic("LayerNormalization",f,{axis:g,epsilon:v,simplified:!!y})},1139167:(f,g,v,y,T,P)=>{t.ic("MatMulNBits",f,{k:g,n:v,accuracyLevel:y,bits:T,blockSize:P})},1139294:(f,g,v,y,T,P)=>{t.ic("MultiHeadAttention",f,{numHeads:g,isUnidirectional:v,maskFilterValue:y,scale:T,doRotary:P})},1139453:(f,g)=>{t.ic("QuickGelu",f,{alpha:g})},1139517:(f,g,v,y,T)=>{t.ic("RotaryEmbedding",f,{interleaved:!!g,numHeads:v,rotaryEmbeddingDim:y,scale:T})},1139656:(f,g,v)=>{t.ic("SkipLayerNormalization",f,{epsilon:g,simplified:!!v})},1139758:(f,g,v)=>{t.ic("SkipLayerNormalization",f,{epsilon:g,simplified:!!v})},1139860:(f,g,v,y)=>{t.ic("GatherBlockQuantized",f,{gatherAxis:g,quantizeAxis:v,blockSize:y})},1139981:f=>{t.Qd(f)},1140015:(f,g)=>t.Sd(Number(f),Number(g),t.hd.Vd,t.hd.errors)};function n$(f,g,v){return Bl(async()=>{await t.Od(Number(f),Number(g),Number(v))})}function i$(){return typeof wasmOffsetConverter<"u"}function o$(f,g,v,y){var T=me();try{return wd(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function a$(f,g,v){var y=me();try{return _d(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;be(1,0)}}function s$(f){var g=me();try{bd(f)}catch(v){if(he(g),v!==v+0)throw v;be(1,0)}}function u$(f,g){var v=me();try{return Eo(f,g)}catch(y){if(he(v),y!==y+0)throw y;be(1,0)}}function l$(f,g,v){var y=me();try{cd(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;be(1,0)}}function d$(f,g,v,y){var T=me();try{return Id(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function p$(f,g){var v=me();try{xd(f,g)}catch(y){if(he(v),y!==y+0)throw y;be(1,0)}}function c$(f,g,v,y,T,P,C){var j=me();try{return vd(f,g,v,y,T,P,C)}catch(W){if(he(j),W!==W+0)throw W;be(1,0)}}function h$(f,g,v,y,T,P){var C=me();try{hd(f,g,v,y,T,P)}catch(j){if(he(C),j!==j+0)throw j;be(1,0)}}function f$(f,g,v,y){var T=me();try{md(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function m$(f,g,v,y,T){var P=me();try{yd(f,g,v,y,T)}catch(C){if(he(P),C!==C+0)throw C;be(1,0)}}function g$(f,g,v,y,T,P,C){var j=me();try{Td(f,g,v,y,T,P,C)}catch(W){if(he(j),W!==W+0)throw W;be(1,0)}}function b$(f,g,v,y,T,P,C){var j=me();try{Sd(f,g,v,y,T,P,C)}catch(W){if(he(j),W!==W+0)throw W;be(1,0)}}function y$(f,g,v,y,T,P,C,j){var W=me();try{Ad(f,g,v,y,T,P,C,j)}catch(Y){if(he(W),Y!==Y+0)throw Y;be(1,0)}}function _$(f,g,v,y,T){var P=me();try{return $d(f,g,v,y,T)}catch(C){if(he(P),C!==C+0)throw C;be(1,0)}}function v$(f,g,v){var y=me();try{return gd(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;be(1,0)}}function w$(f,g,v,y,T,P,C,j){var W=me();try{kd(f,g,v,y,T,P,C,j)}catch(Y){if(he(W),Y!==Y+0)throw Y;be(1,0)}}function x$(f,g,v,y,T,P,C,j,W,Y,pe,xe){var Ce=me();try{Od(f,g,v,y,T,P,C,j,W,Y,pe,xe)}catch(ze){if(he(Ce),ze!==ze+0)throw ze;be(1,0)}}function $$(f,g,v){var y=me();try{return Dd(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;return be(1,0),0n}}function T$(f,g,v,y,T,P,C,j,W){var Y=me();try{fd(f,g,v,y,T,P,C,j,W)}catch(pe){if(he(Y),pe!==pe+0)throw pe;be(1,0)}}function S$(f){var g=me();try{return Cd(f)}catch(v){if(he(g),v!==v+0)throw v;be(1,0)}}function I$(f,g){var v=me();try{return Kd(f,g)}catch(y){if(he(v),y!==y+0)throw y;return be(1,0),0n}}function O$(f,g,v,y){var T=me();try{return Nd(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function E$(f,g,v,y,T,P,C){var j=me();try{Xd(f,g,v,y,T,P,C)}catch(W){if(he(j),W!==W+0)throw W;be(1,0)}}function P$(f){var g=me();try{return zd(f)}catch(v){if(he(g),v!==v+0)throw v;return be(1,0),0n}}function A$(f,g,v,y,T){var P=me();try{return Ld(f,g,v,y,T)}catch(C){if(he(P),C!==C+0)throw C;be(1,0)}}function k$(f,g,v,y,T,P){var C=me();try{return Vd(f,g,v,y,T,P)}catch(j){if(he(C),j!==j+0)throw j;be(1,0)}}function D$(f,g,v,y,T,P){var C=me();try{return Ed(f,g,v,y,T,P)}catch(j){if(he(C),j!==j+0)throw j;be(1,0)}}function C$(f,g,v,y,T,P){var C=me();try{return Ud(f,g,v,y,T,P)}catch(j){if(he(C),j!==j+0)throw j;be(1,0)}}function N$(f,g,v,y,T,P,C,j){var W=me();try{return Pd(f,g,v,y,T,P,C,j)}catch(Y){if(he(W),Y!==Y+0)throw Y;be(1,0)}}function z$(f,g,v,y,T){var P=me();try{return qd(f,g,v,y,T)}catch(C){if(he(P),C!==C+0)throw C;return be(1,0),0n}}function R$(f,g,v,y){var T=me();try{return Gd(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function B$(f,g,v,y){var T=me();try{return Hd(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function M$(f,g,v,y,T,P,C,j,W,Y,pe,xe){var Ce=me();try{return Wd(f,g,v,y,T,P,C,j,W,Y,pe,xe)}catch(ze){if(he(Ce),ze!==ze+0)throw ze;be(1,0)}}function j$(f,g,v,y,T,P,C,j,W,Y,pe){var xe=me();try{jd(f,g,v,y,T,P,C,j,W,Y,pe)}catch(Ce){if(he(xe),Ce!==Ce+0)throw Ce;be(1,0)}}function F$(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze,tr,Ao){var q$=me();try{Fd(f,g,v,y,T,P,C,j,W,Y,pe,xe,Ce,ze,tr,Ao)}catch(ko){if(he(q$),ko!==ko+0)throw ko;be(1,0)}}function L$(f,g,v){var y=me();try{return Rd(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;be(1,0)}}function V$(f,g,v){var y=me();try{return Bd(f,g,v)}catch(T){if(he(y),T!==T+0)throw T;be(1,0)}}function U$(f,g,v,y){var T=me();try{Md(f,g,v,y)}catch(P){if(he(T),P!==P+0)throw P;be(1,0)}}function vi(){if(0<gr)br=vi;else if(u)b==null||b(t),Z();else{for(var f=Qe;0<f.length;)f.shift()(t);0<gr?br=vi:(t.calledRun=!0,A||(Z(),b==null||b(t)))}}return u||(qt=await le(),vi()),t.PTR_SIZE=4,z?t:new Promise((f,g)=>{b=f,x=g})}var fv,wh,xI=k(()=>{"use strict";var e,t;fv=vh,wh=(t=(e=globalThis.self)==null?void 0:e.name)==null?void 0:t.startsWith("em-pthread"),wh&&vh()}),ma,ru,xh,lt,mv,Ii,$h,Th,ga,Sh,ba,gv,ya,bv,Cu=k(()=>{"use strict";Du(),ma=typeof location>"u"?void 0:location.origin,ru=import.meta.url>"file:"&&import.meta.url<"file;",xh=()=>{if(ru){let e=URL;return new URL(new e("ort.all.bundle.min.mjs",import.meta.url).href,ma).href}return import.meta.url},lt=xh(),mv=()=>{if(lt&&!lt.startsWith("blob:"))return lt.substring(0,lt.lastIndexOf("/")+1)},Ii=(e,t)=>{try{let n=t??lt;return(n?new URL(e,n):new URL(e)).origin===ma}catch{return!1}},$h=(e,t)=>{let n=t??lt;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},Th=(e,t)=>`${t??"./"}${e}`,ga=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Sh=async e=>(await import(e)).default,ba=(wI(),fn(pv)).default,gv=async()=>{if(!lt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(Ii(lt))return[void 0,ba()];let e=await ga(lt);return[e,ba(e)]},ya=(xI(),fn(hv)).default,bv=async(e,t,n,s)=>{let u=ya&&!(e||t);if(u)if(lt)u=Ii(lt)||s&&!n;else if(s&&!n)u=!0;else throw new Error("cannot determine the script source URL.");if(u)return[void 0,ya];{let l="ort-wasm-simd-threaded.jsep.mjs",p=e??$h(l,t),d=n&&p&&!Ii(p,t),o=d?await ga(p):p??Th(l,t);return[d?o:void 0,await Sh(o)]}}}),_a,Oi,kn,va,Ih,Oh,Eh,Nu,De,tn=k(()=>{"use strict";Cu(),Oi=!1,kn=!1,va=!1,Ih=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Oh=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Eh=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Nu=async e=>{if(Oi)return Promise.resolve();if(kn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(va)throw new Error("previous call to 'initializeWebAssembly()' failed.");kn=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Eh())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Oh())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let s=Ih();n>1&&!s&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=n=1);let u=e.wasmPaths,l=typeof u=="string"?u:void 0,p=u==null?void 0:u.mjs,d=(p==null?void 0:p.href)??p,o=u==null?void 0:u.wasm,r=(o==null?void 0:o.href)??o,i=e.wasmBinary,[a,c]=await bv(d,l,n>1,!!i||!!r),h=!1,m=[];if(t>0&&m.push(new Promise(b=>{setTimeout(()=>{h=!0,b()},t)})),m.push(new Promise((b,x)=>{let w={numThreads:n};if(i)w.wasmBinary=i,w.locateFile=_=>_;else if(r||l)w.locateFile=_=>r??l+_;else if(d&&d.indexOf("blob:")!==0)w.locateFile=_=>new URL(_,d).href;else if(a){let _=mv();_&&(w.locateFile=I=>_+I)}c(w).then(_=>{kn=!1,Oi=!0,_a=_,b(),a&&URL.revokeObjectURL(a)},_=>{kn=!1,va=!0,x(_)})})),await Promise.race(m),h)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},De=()=>{if(Oi&&_a)return _a;throw new Error("WebAssembly is not initialized yet.")}}),kt,Wi,Te,zu=k(()=>{"use strict";tn(),kt=(e,t)=>{let n=De(),s=n.lengthBytesUTF8(e)+1,u=n._malloc(s);return n.stringToUTF8(e,u,s),t.push(u),u},Wi=(e,t,n,s)=>{if(typeof e=="object"&&e!==null){if(n.has(e))throw new Error("Circular reference in options");n.add(e)}Object.entries(e).forEach(([u,l])=>{let p=t?t+u:u;if(typeof l=="object")Wi(l,p+".",n,s);else if(typeof l=="string"||typeof l=="number")s(p,l.toString());else if(typeof l=="boolean")s(p,l?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof l}`)})},Te=e=>{let t=De(),n=t.stackSave();try{let s=t.PTR_SIZE,u=t.stackAlloc(2*s);t._OrtGetLastError(u,u+s);let l=Number(t.getValue(u,s===4?"i32":"i64")),p=t.getValue(u+s,"*"),d=p?t.UTF8ToString(p):"";throw new Error(`${e} ERROR_CODE: ${l}, ERROR_MESSAGE: ${d}`)}finally{t.stackRestore(n)}}}),yv,$I=k(()=>{"use strict";tn(),zu(),yv=(e,t)=>{let n=De(),s=0,u=[],l=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)l.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)l.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(l.terminate=!1);let p=0;(e==null?void 0:e.tag)!==void 0&&(p=kt(e.tag,u)),s=n._OrtCreateRunOptions(l.logSeverityLevel,l.logVerbosityLevel,!!l.terminate,p),s===0&&Te("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Wi(e.extra,"",new WeakSet,(d,o)=>{let r=kt(d,u),i=kt(o,u);n._OrtAddRunConfigEntry(s,r,i)!==0&&Te(`Can't set a run config entry: ${d} - ${o}.`)});for(let d of t)n._OrtRunOptionsAddActiveLoraAdapter(s,d)!==0&&Te("Can't add an active LoRA adapter.");return[s,u]}catch(p){throw s!==0&&n._OrtReleaseRunOptions(s),u.forEach(d=>n._free(d)),p}}}),Ph,Ah,kh,Tr,Dh,_v,TI=k(()=>{"use strict";tn(),zu(),Ph=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Ah=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},kh=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(e.enableMemPattern=!1)},Tr=(e,t,n,s)=>{let u=kt(t,s),l=kt(n,s);De()._OrtAddSessionConfigEntry(e,u,l)!==0&&Te(`Can't set a session config entry: ${t} - ${n}.`)},Dh=async(e,t,n)=>{let s=t.executionProviders;for(let u of s){let l=typeof u=="string"?u:u.name,p=[],d;switch(l){case"webnn":if(l="WEBNN",Tr(e,"session.disable_quant_qdq","1",n),Tr(e,"session.disable_qdq_constant_folding","1",n),typeof u!="string"){let c=u==null?void 0:u.deviceType;c&&Tr(e,"deviceType",c,n)}break;case"webgpu":if(l="JS",typeof u!="string"){let c=u;if(c!=null&&c.preferredLayout){if(c.preferredLayout!=="NCHW"&&c.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${c.preferredLayout}`);Tr(e,"preferredLayout",c.preferredLayout,n)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${l}`)}let o=p.length,r=0,i=0;if(o>0){r=De()._malloc(o*De().PTR_SIZE),n.push(r),i=De()._malloc(o*De().PTR_SIZE),n.push(i);for(let c=0;c<o;c++)De().setValue(r+c*De().PTR_SIZE,p[c][0],"*"),De().setValue(i+c*De().PTR_SIZE,p[c][1],"*")}let a;if(d===void 0){let c=kt(l,n);a=await De()._OrtAppendExecutionProvider(e,c,r,i,o)}a!==0&&Te(`Can't append execution provider: ${l}.`)}},_v=async e=>{let t=De(),n=0,s=[],u=e||{};kh(u);try{let l=Ph(u.graphOptimizationLevel??"all"),p=Ah(u.executionMode??"sequential"),d=typeof u.logId=="string"?kt(u.logId,s):0,o=u.logSeverityLevel??2;if(!Number.isInteger(o)||o<0||o>4)throw new Error(`log severity level is not valid: ${o}`);let r=u.logVerbosityLevel??0;if(!Number.isInteger(r)||r<0||r>4)throw new Error(`log verbosity level is not valid: ${r}`);let i=typeof u.optimizedModelFilePath=="string"?kt(u.optimizedModelFilePath,s):0;if(n=t._OrtCreateSessionOptions(l,!!u.enableCpuMemArena,!!u.enableMemPattern,p,!!u.enableProfiling,0,d,o,r,i),n===0&&Te("Can't create session options."),u.executionProviders&&await Dh(n,u,s),u.enableGraphCapture!==void 0){if(typeof u.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${u.enableGraphCapture}`);Tr(n,"enableGraphCapture",u.enableGraphCapture.toString(),s)}if(u.freeDimensionOverrides)for(let[a,c]of Object.entries(u.freeDimensionOverrides)){if(typeof a!="string")throw new Error(`free dimension override name must be a string: ${a}`);if(typeof c!="number"||!Number.isInteger(c)||c<0)throw new Error(`free dimension override value must be a non-negative integer: ${c}`);let h=kt(a,s);t._OrtAddFreeDimensionOverride(n,h,c)!==0&&Te(`Can't set a free dimension override: ${a} - ${c}.`)}return u.extra!==void 0&&Wi(u.extra,"",new WeakSet,(a,c)=>{Tr(n,a,c,s)}),[n,s]}catch(l){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&Te("Can't release session options."),s.forEach(p=>t._free(p)),l}}}),qr,Xt,Gr,so,Ki,Ru,Bu,nu,oe=k(()=>{"use strict";qr=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Xt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Gr=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],s=typeof t=="number"?t:t.reduce((u,l)=>u*l,1);return n>0?Math.ceil(s*n):void 0},so=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Ki=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ru=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Bu=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",nu=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),uo,Mu=k(()=>{"use strict";Du(),uo=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let n=t.headers.get("Content-Length"),s=n?parseInt(n,10):0;if(s<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let u=t.body.getReader(),l;try{l=new ArrayBuffer(s)}catch(d){if(d instanceof RangeError){let o=Math.ceil(s/65536);l=new WebAssembly.Memory({initial:o,maximum:o}).buffer}else throw d}let p=0;for(;;){let{done:d,value:o}=await u.read();if(d)break;let r=o.byteLength;new Uint8Array(l,p,r).set(o),p+=r}return new Uint8Array(l,0,s)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ch,Nh,zh,Rh,ju,Bh,we,Jt=k(()=>{"use strict";oe(),Ch=["V","I","W","E","F"],Nh=(e,t)=>{console.log(`[${Ch[e]},${new Date().toISOString()}]${t}`)},ju=(e,t)=>{zh=e,Rh=t},Bh=(e,t)=>{let n=Ki(e),s=Ki(zh);n>=s&&Nh(n,typeof t=="function"?t():t)},we=(...e)=>{Rh&&Bh(...e)}}),Mh,gn,R,Xi,vv,wv,xv,se=k(()=>{"use strict";Mh=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},gn=class{static calcShape(e,t,n=!1){let s=e.length,u=t.length;if(s===0)return t;if(u===0)return e;let l=Math.max(e.length,t.length),p=new Array(l);if(n){if(s<2||u<2)return;let d=Mh.calcMatMulShape([e[s-2],e[s-1]],[t[u-2],t[u-1]]);if(d===void 0)return;[p[l-2],p[l-1]]=d}for(let d=n?3:1;d<=l;d++){let o=s-d<0?1:e[s-d],r=u-d<0?1:t[u-d];if(o!==r&&o>1&&r>1)return;let i=Math.max(o,r);if(o&&r)p[l-d]=Math.max(o,r);else{if(i>1)return;p[l-d]=0}}return p}static isValidBroadcast(e,t){let n=e.length,s=t.length;if(n>s)return!1;for(let u=1;u<=n;u++)if(e[n-u]!==1&&e[n-u]!==t[s-u])return!1;return!0}},R=class Li{static size(t){return Li.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,n=4){let s=t.length;if(s===0)return[];let u=new Array(s),l=s-1;for(;l>=0;){if(t[l]%n===0){u[l]=t[l]/n;break}if(n%t[l]!==0)throw new Error("cannot convert shape");u[l]=1,n/=t[l],l--}for(l--;l>=0;l--)u[l]=t[l];return u}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Li.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Li.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,s){let u=1;for(let l=n;l<s;l++){if(t[l]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");u*=Number(t[l])}return u}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let s=new Array(n);s[n-1]=1,s[n-2]=t[n-1];for(let u=n-3;u>=0;--u)s[u]=s[u+1]*t[u+1];return s}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(s=>this.normalizeAxis(s,n??t.length))}static sortBasedOnPerm(t,n){return n?n.map(s=>t[s]):t.slice().reverse()}static padShape(t,n){let s=t.length;return t.map((u,l)=>u+n[l]+n[l+s])}static areEqual(t,n){return t.length!==n.length?!1:t.every((s,u)=>s===n[u])}},Xi=class pr{static adjustPoolAttributes(t,n,s,u,l,p){if(!t&&s.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let d=0;d<n.length-2;d++)d>=s.length?s.push(n[d+2]):s[d]=n[d+2];for(let d=0;d<s.length;d++)if(d<u.length){if(u[d]<0)throw new Error("strides should be greater than or equal to 1")}else u.push(1);for(let d=0;d<s.length;d++)if(d<l.length){if(l[d]<0)throw new Error("dilations should be greater than or equal to 1")}else l.push(1);for(let d=0;d<s.length*2;d++)if(d<p.length){if(p[d]<0)throw new Error("pad should be greater than or equal to 1")}else p.push(0);for(let d=0;d<s.length;d++){if(s[d]<=0)throw new Error("kernel shapes need to be greater than 0");if(p[d]>=s[d]||p[d+s.length]>=s[d])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,s,u,l,p,d){if(d){if(l.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(u.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let o=0;o<t.length-2;o++)pr.adjustPadAndReturnShape(t[o+(p?1:2)],n[o],s[o],u[o],l,o,o+t.length-2,d)}}static computePoolOutputShape(t,n,s,u,l,p,d,o=0){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let r=[n[0],n[1]];return pr.computeShapeHelper(t,n,r,s,u,l,p,d,o),r}static computeConvOutputShape(t,n,s,u,l,p,d){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let o=[t[0],n[0]];return pr.computeShapeHelper(!1,t,o,s,u,l,p,d),o}static computeShapeHelper(t,n,s,u,l,p,d,o,r=0){if(t)for(let i=0;i<n.length-2;i++)s.push(1);else for(let i=0;i<n.length-2;i++)s.push(pr.adjustPadAndReturnShape(n[i+2],u[i],l[i],p[i],d,i,i+n.length-2,o,r))}static computeOutputSize(t,n,s,u,l){let p=Math.floor(t/n)+1;return l===1&&(p=Math.ceil(t/n)+1,(p-1)*n>=s+u&&(p-=1)),p}static adjustPadAndReturnShape(t,n,s,u,l,p,d,o,r=0){let i=s*(u-1)+1;if(o&&o!=="NOTSET")switch(o){case"VALID":return l[p]=0,l[d]=0,pr.computeOutputSize(t-i,n,t,0,r);case"SAME_LOWER":case"SAME_UPPER":if(s!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let a=(Math.floor((t+n-1)/n)-1)*n+u-t;return l[p]=Math.floor(o==="SAME_LOWER"?(a+1)/2:a/2),l[d]=a-l[p],pr.computeOutputSize(t+l[p]+l[d]-i,n,t,l[p],r)}default:throw new Error("Unsupported AutoPad type")}else return pr.computeOutputSize(t+l[p]+l[d]-i,n,t,l[p],r)}},vv=class{static getShapeOfGemmResult(e,t,n,s,u){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let l,p,d;t?(l=e[1],p=e[0]):(l=e[0],p=e[1]);let o=-1;if(s?(d=n[0],o=1):(d=n[1],o=0),n[o]!==p)throw new Error("dimension mismatch");if(l<=0||d<=0||p<=0)throw new Error("invalid shape specified");if(u&&!gn.isValidBroadcast(u,[l,d]))throw new Error("gemm: invalid bias shape for broadcast");return[l,d,p]}},wv=-34028234663852886e22,xv=34028234663852886e22}),Fu,$v=k(()=>{"use strict";oe(),Fu=(e,t)=>new(so(t))(e)}),wa,jh,xa,Fh,$a,Lh,Ta,Sa,Ia,Vh,Tv,SI=k(()=>{"use strict";oe(),Jt(),wa=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),jh=(e,t)=>{if(t==="int32")return e;let n=wa.get(t);if(!n)throw new Error(`WebNN backend does not support data type: ${t}`);let s=n/8;if(e.byteLength%s!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${s}.`);let u=e.byteLength/s,l=new(so(t))(e.buffer,e.byteOffset,u);switch(t){case"int64":case"uint64":{let p=new Int32Array(u);for(let d=0;d<u;d++){let o=l[d];if(o>2147483647n||o<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");p[d]=Number(o)}return new Uint8Array(p.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&l.some(d=>d>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let p=Int32Array.from(l,Number);return new Uint8Array(p.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},xa=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let n=e.byteLength/4,s=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case"int64":{let u=BigInt64Array.from(s,BigInt);return new Uint8Array(u.buffer)}case"uint64":{if(s.some(l=>l<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let u=BigUint64Array.from(s,BigInt);return new Uint8Array(u.buffer)}case"int8":{if(s.some(l=>l<-128||l>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let u=Int8Array.from(s,Number);return new Uint8Array(u.buffer)}case"uint8":{if(s.some(u=>u<0||u>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(s,Number)}case"uint32":{if(s.some(l=>l<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let u=Uint32Array.from(s,Number);return new Uint8Array(u.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},Fh=1,$a=()=>Fh++,Lh=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Ta=(e,t)=>{let n=wa.get(e);if(!n)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((s,u)=>s*u)*n/8):0},Sa=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:s,dataType:u,shape:l,fallbackDataType:p}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=s,this.dataType=u,this.tensorShape=l,this.fallbackDataType=p}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Ta(this.dataType,this.tensorShape)}destroy(){we("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=xa(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return new Uint8Array(n).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((s,u)=>s===n[u])}setIsDataConverted(e){this.isDataConverted=e}},Ia=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,s){let u=this.tensorManager.getMLContext(e),l=this.tensorManager.getMLOpSupportLimits(e),p;if(!(l!=null&&l.input.dataTypes.includes(t))){if(p=Lh.get(t),!p||!(l!=null&&l.input.dataTypes.includes(p)))throw new Error(`WebNN backend does not support data type: ${t}`);we("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${p}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(u,t,n))return this.wrapper.tensor;if(s){if(this.wrapper.byteLength!==Ta(t,n))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let d=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,d,!0,!0,p),s&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=jh(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else we("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,n;if(this.activeUpload){let s=(t=this.wrapper)!=null&&t.isDataConverted?xa(this.activeUpload,(n=this.wrapper)==null?void 0:n.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(s):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(s);return}else return s.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Vh=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=$a();return this.tensorTrackersById.set(e,new Ia(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,s,u){we("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${s}, copyOld: ${u}}`);let l=this.tensorTrackersById.get(t);if(!l)throw new Error("Tensor not found.");return l.ensureTensor(e,n,s,u)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");n.upload(t)}async download(e,t){we("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,s){let u=this.getMLContext(e),l=$a(),p=new Sa({sessionId:e,context:u,tensor:t,dataType:n,shape:s});return this.tensorTrackersById.set(l,new Ia(this,p)),this.externalTensors.add(p),l}async getCachedTensor(e,t,n,s,u,l,p){let d=this.getMLContext(e);for(let[r,i]of this.freeTensors.entries())if(i.canReuseTensor(d,t,n)){we("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${p?`fallbackDataType: ${p},`:""} shape: ${n}`);let a=this.freeTensors.splice(r,1)[0];return a.sessionId=e,a}we("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${p?`fallbackDataType: ${p},`:""} shape: ${n}}`);let o=await d.createTensor({dataType:p??t,shape:n,dimensions:n,usage:s,writable:u,readable:l});return new Sa({sessionId:e,context:d,tensor:o,dataType:t,shape:n,fallbackDataType:p})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Tv=(...e)=>new Vh(...e)}),Dn,Uh,Sv,II=k(()=>{"use strict";oe(),tn(),$v(),SI(),Jt(),Dn=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Uh=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),s=Object.keys(t).sort();return n.length===s.length&&n.every((u,l)=>u===s[l]&&e[u]===t[u])},Sv=class{constructor(e){this.tensorManager=Tv(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,ju(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){we("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){we("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let n of t)we("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${n}}`),this.tensorManager.releaseTensorId(n);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let n=this.mlContextCache.findIndex(s=>s.gpuDevice===e);if(n!==-1)return this.mlContextCache[n].mlContext;{let s=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:s}),s}}else if(e===void 0){let n=this.mlContextCache.findIndex(s=>s.options===void 0&&s.gpuDevice===void 0);if(n!==-1)return this.mlContextCache[n].mlContext;{let s=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:s}),s}}let t=this.mlContextCache.findIndex(n=>Uh(n.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:n}),n}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let s=this.mlContextCache.findIndex(u=>u.mlContext===t);s!==-1&&this.mlContextCache.splice(s,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){we("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,s,u){let l=Dn.get(n);if(!l)throw new Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,l,s,u)}async createTemporaryTensor(e,t,n){we("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let s=Dn.get(t);if(!s)throw new Error(`Unsupported ONNX data type: ${t}`);let u=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,u,s,n,!1);let l=this.temporarySessionTensorIds.get(e);return l?l.push(u):this.temporarySessionTensorIds.set(e,[u]),u}uploadTensor(e,t){if(!De().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");we("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return Fu(n,t)}}registerMLTensor(e,t,n,s){let u=Dn.get(n);if(!u)throw new Error(`Unsupported ONNX data type: ${n}`);let l=this.tensorManager.registerTensor(e,t,u,s);return we("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${u}, dimensions: ${s}} -> {tensorId: ${l}}`),l}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let s=Dn.get(qr(t)),u=this.mlOpSupportLimitsBySessionId.get(e);return typeof s>"u"?!1:n?!!(u!=null&&u.input.dataTypes.includes(s)):!!(u!=null&&u.output.dataTypes.includes(s))}flush(){}}}),Lu=k(()=>{"use strict"}),Oa,Ei,Pi,qh,Gh,Ea,iu,Hh,Iv,OI=k(()=>{"use strict";Jt(),Lu(),Oa=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Ei=[],Pi=e=>Math.ceil(Number(e)/16)*16,qh=e=>{for(let t=0;t<Ei.length;t++){let n=Ei[t];if(e<=n)return n}return Math.ceil(e/16)*16},Gh=1,Ea=()=>Gh++,iu=async(e,t,n,s)=>{let u=Pi(n),l=e.device.createBuffer({size:u,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let p=e.getCommandEncoder();e.endComputePass(),p.copyBufferToBuffer(t,0,l,0,u),e.flush(),await l.mapAsync(GPUMapMode.READ);let d=l.getMappedRange();if(s){let o=s();return o.set(new Uint8Array(d,0,n)),o}else return new Uint8Array(d.slice(0,n))}finally{l.destroy()}},Hh=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Oa)Ei.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,s=t.byteOffset,u=t.byteLength,l=Pi(u),p=this.storageCache.get(e);if(!p)throw new Error("gpu data for uploading does not exist");if(Number(p.originalSize)!==u)throw new Error(`inconsistent data size. gpu data size=${p.originalSize}, data size=${u}`);if(l===u&&s%4===0)this.backend.device.queue.writeBuffer(p.gpuData.buffer,0,n,s,u);else{let d=new Uint8Array(l);d.set(t),this.backend.device.queue.writeBuffer(p.gpuData.buffer,0,d,0,l)}we("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw new Error("source gpu data for memcpy does not exist");let s=this.storageCache.get(t);if(!s)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==s.originalSize)throw new Error("inconsistent source and destination gpu data size");let u=Pi(n.originalSize),l=this.backend.getCommandEncoder();this.backend.endComputePass(),l.copyBufferToBuffer(n.gpuData.buffer,0,s.gpuData.buffer,0,u)}registerExternalBuffer(e,t,n){let s;if(n){if(s=n[0],e===n[1])return we("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${s}, buffer is the same, skip.`),s;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else s=Ea();return this.storageCache.set(s,{gpuData:{id:s,type:0,buffer:e},originalSize:t}),we("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${s}, registered.`),s}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),we("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=qh(e),s,u=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,l=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(u||l){let d=(u?this.freeBuffers:this.freeUniformBuffers).get(n);d?d.length>0?s=d.pop():s=this.backend.device.createBuffer({size:n,usage:t}):s=this.backend.device.createBuffer({size:n,usage:t})}else s=this.backend.device.createBuffer({size:n,usage:t});let p={id:Ea(),type:0,buffer:s};return this.storageCache.set(p.id,{gpuData:p,originalSize:Number(e)}),we("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${p.id}`),p}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return we("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw new Error("data does not exist");await iu(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Oa.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(we("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(n=>{n.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Iv=(...e)=>new Hh(...e)}),Wh,Ie,Fe=k(()=>{"use strict";Wh=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},Ie=e=>new Wh(e)}),bn,Ai,Ke,We,ie,je,ou,hn,hr,re,Cn,L,te,Ov,Vu,Kh,Ev,ue=k(()=>{"use strict";oe(),se(),bn=64,Ai=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ke=(e,t=1)=>{let n=Ai(e,t);return typeof n=="string"?n:n[0]},We=(e,t=1)=>{let n=Ai(e,t);return typeof n=="string"?n:n[1]},ie=(...e)=>{let t=[];return e.forEach(n=>{n.length!==0&&t.push({type:12,data:n},{type:12,data:R.computeStrides(n)})}),t},je=e=>e%4===0?4:e%2===0?2:1,ou=(e="f32",t,n="0")=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,hn=(e,t,n)=>e==="f32"?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,hr=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,re=(e,t,n,s)=>e.startsWith("uniforms.")&&n>4?typeof t=="string"?s==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:s==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,Cn=(e,t,n,s,u)=>{let l=typeof n=="number",p=l?n:n.length,d=[...new Array(p).keys()],o=p<2?"u32":p<=4?`vec${p}<u32>`:`array<u32, ${p}>`,r=Ai(t,u),i=typeof r=="string"?r:r[1],a=typeof r=="string"?r:r[0],c={indices:o,value:i,storage:a,tensor:t},h=z=>typeof z=="string"?z:`${z}u`,m={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},b=l?"uniforms.":"",x=`${b}${e}_shape`,w=`${b}${e}_strides`,_="";for(let z=0;z<p-1;z++)_+=`
    let dim${z} = current / ${re(w,z,p)};
    let rest${z} = current % ${re(w,z,p)};
    indices[${z}] = dim${z};
    current = rest${z};
    `;_+=`indices[${p-1}] = current;`;let I=p<2?"":`
  fn o2i_${e}(offset: u32) -> ${c.indices} {
    var indices: ${c.indices};
    var current = offset;
    ${_}
    return indices;
  }`,E=z=>(m.offsetToIndices=!0,p<2?z:`o2i_${e}(${z})`),O=[];if(p>=2)for(let z=p-1;z>=0;z--)O.push(`${re(w,z,p)} * (indices[${z}])`);let A=p<2?"":`
  fn i2o_${e}(indices: ${c.indices}) -> u32 {
    return ${O.join("+")};
  }`,D=z=>(m.indicesToOffset=!0,p<2?z:`i2o_${e}(${z})`),S=(...z)=>p===0?"0u":`${c.indices}(${z.map(h).join(",")})`,F=(z,X)=>p<2?`${z}`:`${re(z,X,p)}`,U=(z,X,Z)=>p<2?`${z}=${Z};`:`${re(z,X,p)}=${Z};`,Q={},H=(z,X)=>{m.broadcastedIndicesToOffset=!0;let Z=`${X.name}broadcastedIndicesTo${e}Offset`;if(Z in Q)return`${Z}(${z})`;let V=[];for(let fe=p-1;fe>=0;fe--){let le=X.indicesGet("outputIndices",fe+X.rank-p);V.push(`${F(w,fe)} * (${le} % ${F(x,fe)})`)}return Q[Z]=`fn ${Z}(outputIndices: ${X.type.indices}) -> u32 {
             return ${V.length>0?V.join("+"):"0u"};
           }`,`${Z}(${z})`},N=(z,X)=>(()=>{if(c.storage===c.value)return`${e}[${z}]=${X};`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`${e}[${z}]=vec2<u32>(u32(${X}), select(0u, 0xFFFFFFFFu, ${X} < 0));`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`${e}[${z}]=vec2<u32>(u32(${X}), 0u);`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`${e}[${z}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${X}));`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),M=z=>(()=>{if(c.storage===c.value)return`${e}[${z}]`;if(c.storage==="vec2<u32>"&&c.value==="i32")return`i32(${e}[${z}].x)`;if(c.storage==="vec2<u32>"&&c.value==="u32")return`u32(${e}[${z}].x)`;if(c.storage==="u32"&&c.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${z}] & 0xFFu), bool(${e}[${z}] & 0xFF00u), bool(${e}[${z}] & 0xFF0000u), bool(${e}[${z}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${c.storage} and value type ${c.value} yet`)})(),$=p<2?"":`
  fn get_${e}ByIndices(indices: ${c.indices}) -> ${i} {
    return ${M(`i2o_${e}(indices)`)};
  }`,B=p<2?"":(()=>{let z=d.map(Z=>`d${Z}: u32`).join(", "),X=d.map(Z=>`d${Z}`).join(", ");return`
  fn get_${e}(${z}) -> ${i} {
    return get_${e}ByIndices(${S(X)});
  }`})(),q=(...z)=>{if(z.length!==p)throw new Error(`indices length must be ${p}`);let X=z.map(h).join(",");return p===0?M("0u"):p===1?M(X[0]):(m.get=!0,m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}(${X})`)},J=z=>p<2?M(z):(m.getByIndices=!0,m.indicesToOffset=!0,`get_${e}ByIndices(${z})`),K=p<2?"":`
  fn set_${e}ByIndices(indices: ${c.indices}, value: ${i}) {
    ${N(`i2o_${e}(indices)`,"value")}
  }`,ae=p<2?"":(()=>{let z=d.map(Z=>`d${Z}: u32`).join(", "),X=d.map(Z=>`d${Z}`).join(", ");return`
  fn set_${e}(${z}, value: ${i}) {
    set_${e}ByIndices(${S(X)}, value);
  }`})();return{impl:()=>{let z=[],X=!1;return m.offsetToIndices&&(z.push(I),X=!0),m.indicesToOffset&&(z.push(A),X=!0),m.broadcastedIndicesToOffset&&(Object.values(Q).forEach(Z=>z.push(Z)),X=!0),m.set&&(z.push(ae),X=!0),m.setByIndices&&(z.push(K),X=!0),m.get&&(z.push(B),X=!0),m.getByIndices&&(z.push($),X=!0),!l&&X&&z.unshift(`const ${x} = ${c.indices}(${n.join(",")});`,`const ${w} = ${c.indices}(${R.computeStrides(n).join(",")});`),z.join(`
`)},type:c,offsetToIndices:E,indicesToOffset:D,broadcastedIndicesToOffset:H,indices:S,indicesGet:F,indicesSet:U,set:(...z)=>{if(z.length!==p+1)throw new Error(`indices length must be ${p}`);let X=z[p];if(typeof X!="string")throw new Error("value must be string");let Z=z.slice(0,p).map(h).join(",");return p===0?N("0u",X):p===1?N(Z[0],X):(m.set=!0,m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}(${Z}, ${X})`)},setByOffset:N,setByIndices:(z,X)=>p<2?N(z,X):(m.setByIndices=!0,m.indicesToOffset=!0,`set_${e}ByIndices(${z}, ${X});`),get:q,getByOffset:M,getByIndices:J,usage:s,name:e,strides:w,shape:x,rank:p}},L=(e,t,n,s=1)=>Cn(e,t,n,"input",s),te=(e,t,n,s=1)=>Cn(e,t,n,"output",s),Ov=(e,t,n)=>Cn(e,t,n,"atomicOutput",1),Vu=(e,t,n,s=1)=>Cn(e,t,n,"internal",s),Kh=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=bn){let t=typeof e=="number"?e:e[0],n=typeof e=="number"?1:e[1],s=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||s>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${n}, ${s}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*s>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${n}, ${s}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let u=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,l=u?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,p=u?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*s}u + local_idx;`;return`@compute @workgroup_size(${t}, ${n}, ${s})
  fn main(${l}) {
    ${p}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage==="input"?"read":"read_write",s=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${s}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:n,length:s}of this.uniforms)if(s&&s>4)n==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(s/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(s/4)}>`);else{let u=s==null||s===1?n:`vec${s}<${n}>`;e.push(`${t}:${u}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Ev=(e,t)=>new Kh(e,t)}),Xh,Pa,Zh,Jh,Qh,Yh,ft,Pv,Av,mr=k(()=>{"use strict";oe(),se(),Fe(),ue(),Xh=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Pa=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),Zh=(e,t)=>R.sortBasedOnPerm(e,Pa(e.length,t)),Jh=(e,t,n,s)=>{let u=`fn perm(i: ${s.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let l=0;l<t;++l)u+=`a[${e[l]}]=i[${l}];`;return u+="return a;}"},Qh=(e,t)=>{let n=[],s=[];for(let u=0;u<e.length;++u)e[u]!==1&&n.push(e[u]),e[t[u]]!==1&&s.push(t[u]);return{newShape:n,newPerm:s}},Yh=(e,t)=>{let n=0;for(let s=0;s<e.length;++s)if(t[e[s]]!==1){if(e[s]<n)return!1;n=e[s]}return!0},ft=(e,t)=>{let n=e.dataType,s=e.dims.length,u=Pa(s,t),l=Zh(e.dims,u),p=e.dims,d=l,o=s<2||Yh(u,e.dims),r;if(o)return r=m=>{let b=L("input",n,p,4),x=te("output",n,d,4);return`
  ${m.registerUniform("output_size","u32").declareVariables(b,x)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let m=R.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64/4)},programUniforms:[{type:12,data:Math.ceil(m/4)}]}},getShaderSource:r};let{newShape:i,newPerm:a}=Qh(e.dims,u),c=R.areEqual(a,[2,3,1]),h=R.areEqual(a,[3,1,2]);if(i.length===2||c||h){p=c?[i[0],i[1]*i[2]]:h?[i[0]*i[1],i[2]]:i,d=[p[1],p[0]];let m=16;return r=b=>{let x=L("a",n,p.length),w=te("output",n,d.length);return`
  ${b.registerUniform("output_size","u32").declareVariables(x,w)}
  var<workgroup> tile : array<array<${w.type.value}, ${m+1}>, ${m}>;
  ${b.mainStart([m,m,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${m} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${m}u + local_id.x;
    let input_row = workgroup_id_x * ${m}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${x.getByIndices(`${x.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${m}u + local_id.x;
    let output_row = workgroup_id_y * ${m}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${w.setByIndices(`${w.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let b=R.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(d[1]/m),y:Math.ceil(d[0]/m)},programUniforms:[{type:12,data:b},...ie(p,d)]}},getShaderSource:r}}return r=m=>{let b=L("a",n,p.length),x=te("output",n,d.length);return`
  ${m.registerUniform("output_size","u32").declareVariables(b,x)}

  ${Jh(u,s,b,x)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${x.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${x.setByOffset("global_idx",b.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let m=R.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...ie(p,d)]}},getShaderSource:r}},Pv=(e,t)=>{Xh(e.inputs,t.perm),e.compute(ft(e.inputs[0],t.perm))},Av=e=>Ie({perm:e.perm})}),ef,tf,rf,nf,of,af,sf,uf,lf,df,St,kv,Dv,Cv,Nv,zv,Rv,Bv,Mv,jv,Fv,EI=k(()=>{"use strict";oe(),se(),ue(),Uu(),mr(),ef={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},tf={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},rf={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},nf={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},of=(e,t)=>{let n=[];for(let s=t-e;s<t;++s)n.push(s);return n},af=(e,t)=>{let n=[],s=e.length;for(let l=0;l<s;l++)t.indexOf(l)===-1&&n.push(e[l]);let u=t.map(l=>e[l]);return[n,u]},sf=(e,t)=>{let n=e.length+t.length,s=[],u=0;for(let l=0;l<n;l++)t.indexOf(l)===-1?s.push(e[u++]):s.push(1);return s},uf=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},lf=(e,t)=>{let n=[];if(!uf(e,t)){for(let s=0;s<t;++s)e.indexOf(s)===-1&&n.push(s);e.forEach(s=>n.push(s))}return n},df=(e,t,n,s,u,l,p)=>{let d=n[0].dims,o=R.size(l),r=R.size(p),i=L("_A",n[0].dataType,d),a=te("output",u,l),c=64;o===1&&(c=256);let h=`
          var<workgroup> aBestValues : array<f32, ${c}>;
       `,m=b=>`
        ${b.registerUniform("reduceSize","u32").declareVariables(i,a)}
        ${h}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${b.mainStart(c)}

          let outputIndex = global_idx / ${c};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${rf[s]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${c}) {
           let candidate = f32(${i.getByOffset("offset + k")});
           bestValue = ${ef[s]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${c}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${tf[s]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${a.setByOffset("outputIndex",`${s==="mean"?`${a.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${a.type.storage}(${nf[s]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${c}`,inputDependencies:["type"]},getShaderSource:m,getRunData:()=>({outputs:[{dims:l,dataType:u}],dispatchGroup:{x:o},programUniforms:[{type:12,data:r}]})}},St=(e,t,n,s)=>{let u=e.inputs.length===1?n:au(e.inputs,n),l=u.axes;l.length===0&&!u.noopWithEmptyAxes&&(l=e.inputs[0].dims.map((h,m)=>m));let p=R.normalizeAxes(l,e.inputs[0].dims.length),d=p,o=e.inputs[0],r=lf(d,e.inputs[0].dims.length);r.length>0&&(o=e.compute(ft(e.inputs[0],r),{inputs:[0],outputs:[-1]})[0],d=of(d.length,o.dims.length));let[i,a]=af(o.dims,d),c=i;u.keepDims&&(c=sf(i,p)),e.compute(df(t,u.cacheKey,[o],s,e.inputs[0].dataType,c,a),{inputs:[o]})},kv=(e,t)=>{St(e,"ReduceMeanShared",t,"mean")},Dv=(e,t)=>{St(e,"ReduceL1Shared",t,"l1")},Cv=(e,t)=>{St(e,"ReduceL2Shared",t,"l2")},Nv=(e,t)=>{St(e,"ReduceLogSumExpShared",t,"logSumExp")},zv=(e,t)=>{St(e,"ReduceMaxShared",t,"max")},Rv=(e,t)=>{St(e,"ReduceMinShared",t,"min")},Bv=(e,t)=>{St(e,"ReduceProdShared",t,"prod")},Mv=(e,t)=>{St(e,"ReduceSumShared",t,"sum")},jv=(e,t)=>{St(e,"ReduceSumSquareShared",t,"sumSquare")},Fv=(e,t)=>{St(e,"ReduceLogSumShared",t,"logSum")}}),It,pf,Zi,au,Ot,cf,hf,ff,mf,gf,bf,yf,_f,vf,wf,Et,Lv,Vv,Uv,qv,Gv,Hv,Wv,Kv,Xv,Zv,Uu=k(()=>{"use strict";oe(),se(),Fe(),ue(),EI(),It=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},pf=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Zi=(e,t,n,s,u,l,p=!1,d=!1)=>{let o=[],r=n[0].dims,i=r.length,a=R.normalizeAxes(u,i),c=!d&&a.length===0;r.forEach((b,x)=>{c||a.indexOf(x)>=0?p&&o.push(1):o.push(b)});let h=o.length,m=R.size(o);return{name:e,shaderCache:t,getShaderSource:b=>{let x=[],w=L("_A",n[0].dataType,i),_=te("output",l,h),I=s(w,_,a),E=I[2];for(let O=0,A=0;O<i;O++)c||a.indexOf(O)>=0?(p&&A++,E=`for(var j${O}: u32 = 0; j${O} < ${r[O]}; j${O}++) {
                  ${I[2].includes("last_index")?`let last_index = j${O};`:""}
                  ${w.indicesSet("input_indices",O,`j${O}`)}
                  ${E}
                }`):(x.push(`${w.indicesSet("input_indices",O,_.indicesGet("output_indices",A))};`),A++);return`

        ${b.registerUniform("output_size","u32").declareVariables(w,_)}

        ${b.mainStart()}
          ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${w.type.indices};
          let output_indices = ${_.offsetToIndices("global_idx")};

          ${x.join(`
`)}
          ${I[0]}       // init ops for reduce max/min
          ${I[1]}
          ${E}
          ${I[3]}
          ${I.length===4?_.setByOffset("global_idx","value"):I.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:o,dataType:l}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},...ie(r,o)]})}},au=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(s=>n.push(Number(s))),Ie({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},Ot=(e,t,n,s)=>{let u=e.inputs,l=u.length===1?n:au(u,n);e.compute(Zi(t,{hint:l.cacheKey,inputDependencies:["rank"]},[u[0]],l.noopWithEmptyAxes&&l.axes.length===0?pf:s,l.axes,u[0].dataType,l.keepDims,l.noopWithEmptyAxes),{inputs:[0]})},cf=(e,t)=>{It(e.inputs),Ot(e,"ReduceLogSum",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},hf=(e,t)=>{It(e.inputs),Ot(e,"ReduceL1",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},ff=(e,t)=>{It(e.inputs),Ot(e,"ReduceL2",t,(n,s)=>[`var t = ${s.type.value}(0); var value = ${s.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},mf=(e,t)=>{It(e.inputs),Ot(e,"ReduceLogSumExp",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},gf=(e,t)=>{It(e.inputs),Ot(e,"ReduceMax",t,(n,s,u)=>{let l=[];for(let p=0;p<n.rank;p++)(u.indexOf(p)>=0||u.length===0)&&l.push(n.indicesSet("input_indices",p,0));return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},bf=(e,t)=>{It(e.inputs),Ot(e,"ReduceMean",t,(n,s,u)=>{let l=1;for(let p=0;p<n.rank;p++)(u.indexOf(p)>=0||u.length===0)&&(l*=e.inputs[0].dims[p]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${s.type.value}(sum / ${l});`]})},yf=(e,t)=>{It(e.inputs),Ot(e,"ReduceMin",t,(n,s,u)=>{let l=[];for(let p=0;p<n.rank;p++)(u.indexOf(p)>=0||u.length===0)&&l.push(`input_indices[${p}] = 0;`);return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},_f=(e,t)=>{It(e.inputs),Ot(e,"ReduceProd",t,(n,s)=>[`var value = ${s.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},vf=(e,t)=>{It(e.inputs),Ot(e,"ReduceSum",t,(n,s)=>[`var value = ${s.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},wf=(e,t)=>{It(e.inputs),Ot(e,"ReduceSumSquare",t,(n,s)=>[`var t = ${s.type.value}(0); var value = ${s.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},Et=(e,t,n)=>{if(t.length===0)return n;let s=1,u=1;for(let l=0;l<t.length;l++)t.indexOf(l)===-1?s*=e[l]:u*=e[l];return u<32&&s>1024},Lv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?bf(e,t):kv(e,t)},Vv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?hf(e,t):Dv(e,t)},Uv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?ff(e,t):Cv(e,t)},qv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?mf(e,t):Nv(e,t)},Gv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?gf(e,t):zv(e,t)},Hv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?yf(e,t):Rv(e,t)},Wv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?_f(e,t):Bv(e,t)},Kv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?vf(e,t):Mv(e,t)},Xv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?wf(e,t):jv(e,t)},Zv=(e,t)=>{Et(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?cf(e,t):Fv(e,t)}}),Aa,Jv,Qv,su,PI=k(()=>{"use strict";oe(),Fe(),Uu(),Aa=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Jv=(e,t)=>{Aa(e.inputs);let n=(s,u,l)=>{let p=[];for(let d=0;d<s.rank;d++)(l.indexOf(d)>=0||l.length===0)&&p.push(`input_indices[${d}] = 0;`);return[`${p.join(`
`)}`,`var value = ${s.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${s.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${s.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Zi("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},Qv=(e,t)=>{Aa(e.inputs);let n=(s,u,l)=>{let p=[];for(let d=0;d<s.rank;d++)(l.indexOf(d)>=0||l.length===0)&&p.push(`input_indices[${d}] = 0;`);return[`${p.join(`
`)}`,`var value = ${s.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${s.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${s.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Zi("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},su=e=>Ie(e)}),xf,ki,$f,Tf,Sf,ii,If,Yv,qu=k(()=>{"use strict";oe(),se(),Lu(),ue(),xf=(e,t)=>{let n=e[0],s=e[1],u=e[2],l=e[3],p=e[4],d=e[5];if(p&&d)throw new Error("Attention cannot have both past and attention_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let o=n.dims[0],r=n.dims[1],i=n.dims[2];if(u.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(s.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(s.dims[0]!==i)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(u.dims[0]!==s.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let a=u.dims[0]/3,c=a,h=c;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let I of t.qkvHiddenSizes)if(I%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");a=t.qkvHiddenSizes[0],c=t.qkvHiddenSizes[1],h=t.qkvHiddenSizes[2]}let m=r;if(a!==c)throw new Error("qkv_hidden_sizes first element should be same as the second");if(u.dims[0]!==a+c+h)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let b=0;if(p){if(c!==h)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(p.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(p.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(p.dims[1]!==o)throw new Error('Input "past" second dimension must be batch_size');if(p.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(p.dims[4]!==c/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(b=p.dims[3])}let x=m+b,w=-1,_=0;if(l)throw new Error("Mask not supported");if(p)throw new Error("past is not supported");if(d){if(d.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(d.dims[0]!==o||d.dims[1]!==t.numHeads||d.dims[2]!==r||d.dims[3]!==x)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:o,sequenceLength:r,pastSequenceLength:b,kvSequenceLength:m,totalSequenceLength:x,maxSequenceLength:w,inputHiddenSize:i,hiddenSize:a,vHiddenSize:h,headSize:Math.floor(a/t.numHeads),vHeadSize:Math.floor(h/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},ki=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,$f=(e,t,n,s,u,l,p,d)=>{let o=je(p?1:l),r=64,i=l/o;i<r&&(r=32);let a=Math.ceil(l/o/r),c=[{type:12,data:t},{type:12,data:n},{type:12,data:s},{type:12,data:u},{type:12,data:i},{type:12,data:a}],h=Ke(e.dataType,o),m=We(1,o),b=["type"];p&&b.push("type"),d&&b.push("type");let x=w=>{let _=te("x",e.dataType,e.dims,o),I=[_],E=p?L("seq_lens",p.dataType,p.dims):void 0;E&&I.push(E);let O=d?L("total_sequence_length_input",d.dataType,d.dims):void 0;O&&I.push(O);let A=We(e.dataType),D=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${r}>;
  var<workgroup> thread_sum: array<f32, ${r}>;
  ${w.registerUniforms(D).declareVariables(...I)}
  ${w.mainStart([r,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${ki(E,O,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${r}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${p?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${m}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${m}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(o){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${r}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${m}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${m}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(o){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${o}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${r}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${_.type.value}(${A}(1.0) / ${A}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${m}(x[offset + i]);
        x[offset + i] = ${_.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${p?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${_.type.value}(${A}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${r};${h};${o}`,inputDependencies:b},getShaderSource:x,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:u,z:t*n},programUniforms:c})}},Tf=(e,t,n,s,u,l,p,d,o)=>{let r=p+l.kvSequenceLength,i=[l.batchSize,l.numHeads,l.sequenceLength,r],a=e>1&&s,c=l.kvNumHeads?l.kvNumHeads:l.numHeads,h=a?[l.batchSize,c,r,l.headSize]:void 0,m=l.nReps?l.nReps:1,b=l.scale===0?1/Math.sqrt(l.headSize):l.scale,x=je(l.headSize),w=l.headSize/x,_=12,I={x:Math.ceil(r/_),y:Math.ceil(l.sequenceLength/_),z:l.batchSize*l.numHeads},E=[{type:12,data:l.sequenceLength},{type:12,data:w},{type:12,data:r},{type:12,data:l.numHeads},{type:12,data:l.headSize},{type:1,data:b},{type:12,data:p},{type:12,data:l.kvSequenceLength},{type:12,data:m}],O=a&&s&&R.size(s.dims)>0,A=["type","type"];O&&A.push("type"),u&&A.push("type"),d&&A.push("type"),o&&A.push("type");let D=[{dims:i,dataType:t.dataType,gpuDataType:0}];a&&D.push({dims:h,dataType:t.dataType,gpuDataType:0});let S=F=>{let U=L("q",t.dataType,t.dims,x),Q=L("key",n.dataType,n.dims,x),H=[U,Q];if(O){let K=L("past_key",s.dataType,s.dims,x);H.push(K)}u&&H.push(L("attention_bias",u.dataType,u.dims));let N=d?L("seq_lens",d.dataType,d.dims):void 0;N&&H.push(N);let M=o?L("total_sequence_length_input",o.dataType,o.dims):void 0;M&&H.push(M);let $=te("output",t.dataType,i),B=[$];a&&B.push(te("present_key",t.dataType,h,x));let q=We(1,x),J=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${_}u;

  var<workgroup> tileQ: array<${U.type.storage}, ${_*_}>;
  var<workgroup> tileK: array<${U.type.storage}, ${_*_}>;
  ${F.registerUniforms(J).declareVariables(...H,...B)}
  ${F.mainStart([_,_,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${m===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${m===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${ki(N,M,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${O&&a?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${a?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${q}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${O&&a?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${a?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${q}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(x){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${x}`)}})()};
        output[outputIdx] = ${$.type.value} (sum * uniforms.alpha) + ${u?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${x};${u!==void 0};${s!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:D,dispatchGroup:I,programUniforms:E}),getShaderSource:S}},Sf=(e,t,n,s,u,l,p=void 0,d=void 0)=>{let o=l+u.kvSequenceLength,r=u.nReps?u.nReps:1,i=u.vHiddenSize*r,a=e>1&&s,c=u.kvNumHeads?u.kvNumHeads:u.numHeads,h=a?[u.batchSize,c,o,u.headSize]:void 0,m=[u.batchSize,u.sequenceLength,i],b=12,x={x:Math.ceil(u.vHeadSize/b),y:Math.ceil(u.sequenceLength/b),z:u.batchSize*u.numHeads},w=[{type:12,data:u.sequenceLength},{type:12,data:o},{type:12,data:u.vHeadSize},{type:12,data:u.numHeads},{type:12,data:u.headSize},{type:12,data:i},{type:12,data:l},{type:12,data:u.kvSequenceLength},{type:12,data:r}],_=a&&s&&R.size(s.dims)>0,I=["type","type"];_&&I.push("type"),p&&I.push("type"),d&&I.push("type");let E=[{dims:m,dataType:t.dataType,gpuDataType:0}];a&&E.push({dims:h,dataType:t.dataType,gpuDataType:0});let O=A=>{let D=L("probs",t.dataType,t.dims),S=L("v",n.dataType,n.dims),F=[D,S];_&&F.push(L("past_value",s.dataType,s.dims));let U=p?L("seq_lens",p.dataType,p.dims):void 0;p&&F.push(U);let Q=d?L("total_sequence_length_input",d.dataType,d.dims):void 0;d&&F.push(Q);let H=[te("output",t.dataType,m)];a&&H.push(te("present_value",t.dataType,h));let N=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileQ: array<${D.type.value}, ${b*b}>;
  var<workgroup> tileV: array<${D.type.value}, ${b*b}>;
  ${A.registerUniforms(N).declareVariables(...F,...H)}
  ${A.mainStart([b,b,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${r===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${r===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${ki(U,Q,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${_&&a?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${a?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${D.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${_&&a?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${a?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${s!==void 0};${e}`,inputDependencies:I},getRunData:()=>({outputs:E,dispatchGroup:x,programUniforms:w}),getShaderSource:O}},ii=(e,t,n,s,u,l,p,d,o,r,i=void 0,a=void 0)=>{let c=Math.min(e.outputCount,1+(p?1:0)+(d?1:0)),h=c>1?p:void 0,m=c>1?d:void 0,b=c>1?r.pastSequenceLength:0,x=b+r.kvSequenceLength,w=o&&R.size(o.dims)>0?o:void 0,_=[t,n];h&&R.size(h.dims)>0&&_.push(h),w&&_.push(w),i&&_.push(i),a&&_.push(a);let I=e.compute(Tf(c,t,n,h,w,r,b,i,a),{inputs:_,outputs:c>1?[-1,1]:[-1]})[0];e.compute($f(I,r.batchSize,r.numHeads,b,r.sequenceLength,x,i,a),{inputs:i&&a?[I,i,a]:[I],outputs:[]});let E=[I,s];m&&R.size(m.dims)>0&&E.push(m),i&&E.push(i),a&&E.push(a),e.compute(Sf(c,I,s,m,r,b,i,a),{inputs:E,outputs:c>1?[0,2]:[0]})},If=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],s=t.sequenceLength,u=t.inputHiddenSize,l=t.headSize,p=12,d={x:Math.ceil(t.headSize/p),y:Math.ceil(t.sequenceLength/p),z:t.batchSize*t.numHeads},o=[e.inputs[0],e.inputs[1],e.inputs[2]],r=[{type:12,data:s},{type:12,data:u},{type:12,data:l},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],i=a=>{let c=te("output_q",o[0].dataType,n),h=te("output_k",o[0].dataType,n),m=te("output_v",o[0].dataType,n),b=L("input",o[0].dataType,o[0].dims),x=L("weight",o[1].dataType,o[1].dims),w=L("bias",o[2].dataType,o[2].dims),_=b.type.storage,I=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${p}u;
  var<workgroup> tileInput: array<${_}, ${p*p}>;
  var<workgroup> tileWeightQ: array<${_}, ${p*p}>;
  var<workgroup> tileWeightK: array<${_}, ${p*p}>;
  var<workgroup> tileWeightV: array<${_}, ${p*p}>;
  ${a.registerUniforms(I).declareVariables(b,x,w,c,h,m)}
  ${a.mainStart([p,p,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${_}(0);
    var valueK = ${_}(0);
    var valueV = ${_}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:d,programUniforms:r}),getShaderSource:i},{inputs:o,outputs:[-1,-1,-1]})},Yv=(e,t)=>{let n=xf(e.inputs,t),[s,u,l]=If(e,n);return ii(e,s,u,l,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),Of,Ef,Pf,e1,AI=k(()=>{"use strict";et(),oe(),se(),Fe(),ue(),Of=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(s,u,l)=>{let p=u.length;if(p!==s.length)throw new Error(`${l}: num dimensions != ${p}`);u.forEach((d,o)=>{if(d!==s[o])throw new Error(`${l}: dim[${o}] do not match`)})};if(e[0].dims.length>1){let s=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,s,"Invalid input scale"),n(e[2].dims,s,"Invalid input B"),n(e[3].dims,s,"Invalid input mean"),n(e[4].dims,s,"Invalid input var")}else n(e[1].dims,[1],"Invalid input scale"),n(e[2].dims,[1],"Invalid input B"),n(e[3].dims,[1],"Invalid input mean"),n(e[4].dims,[1],"Invalid input var")},Ef=(e,t)=>{let{epsilon:n,spatial:s,format:u}=t,l=e[0].dims,p=s?je(l[l.length-1]):1,d=u==="NHWC"&&l.length>1?p:1,o=R.size(l)/p,r=s,i=r?l.length:l,a=L("x",e[0].dataType,e[0].dims,p),c=L("scale",e[1].dataType,e[1].dims,d),h=L("bias",e[2].dataType,e[2].dims,d),m=L("inputMean",e[3].dataType,e[3].dims,d),b=L("inputVar",e[4].dataType,e[4].dims,d),x=te("y",e[0].dataType,i,p),w=()=>{let I="";if(s)I=`let cOffset = ${l.length===1?"0u":u==="NHWC"?`outputIndices[${l.length-1}] / ${p}`:"outputIndices[1]"};`;else if(u==="NCHW")I=`
            ${x.indicesSet("outputIndices","0","0")}
            let cOffset = ${x.indicesToOffset("outputIndices")};`;else{I=`var cIndices = ${c.type.indices}(0);
                       cIndices[0] = outputIndices[${l.length-1}];`;for(let E=1;E<c.rank;E++)I+=`cIndices[${E}] = outputIndices[${E}];`;I+=`let cOffset = ${c.indicesToOffset("cIndices")};`}return I},_=I=>`
  const epsilon = ${n};
  ${I.registerUniform("outputSize","u32").declareVariables(a,c,h,m,b,x)}
  ${I.mainStart()}
  ${I.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${x.offsetToIndices(`global_idx * ${p}`)};
    ${w()}
    let scale = ${c.getByOffset("cOffset")};
    let bias = ${h.getByOffset("cOffset")};
    let inputMean = ${m.getByOffset("cOffset")};
    let inputVar = ${b.getByOffset("cOffset")};
    let x = ${a.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${x.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${s}_${p}`,inputDependencies:r?["rank","type","type","type","type"]:void 0},getShaderSource:_,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:r?[{type:12,data:o},...ie(l)]:[{type:12,data:o}]})}},Pf=e=>Ie(e),e1=(e,t)=>{let{inputs:n,outputCount:s}=e,u=Pf({...t,outputCount:s});if(ye.webgpu.validateInputContent&&Of(n,u),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(Ef(n,u))}}),Af,kf,t1,kI=k(()=>{"use strict";se(),ue(),Af=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},kf=e=>{let t=e[0].dims,n=e[0].dims[2],s=R.size(t)/4,u=e[0].dataType,l=L("input",u,t,4),p=L("bias",u,[n],4),d=L("residual",u,t,4),o=te("output",u,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(s/64)}}),getShaderSource:r=>`
  const channels = ${n}u / 4;
  ${r.declareVariables(l,p,d,o)}

  ${r.mainStart()}
    ${r.guardAgainstOutOfBoundsWorkgroupSizes(s)}
    let value = ${l.getByOffset("global_idx")}
      + ${p.getByOffset("global_idx % channels")} + ${d.getByOffset("global_idx")};
    ${o.setByOffset("global_idx","value")}
  }`}},t1=e=>{Af(e.inputs),e.compute(kf(e.inputs))}}),Df,$e,r1,n1,i1,o1,a1,s1,u1,l1,d1,Cf,p1,c1,h1,f1,Kn,m1,Vi,g1,b1,y1,_1,v1,w1,x1,$1,T1,S1,I1,O1,E1,P1,A1,k1,D1,ka,C1,uu,lu,N1,z1,R1,Nf,zf,B1,Gu=k(()=>{"use strict";oe(),se(),Fe(),ue(),Df=(e,t,n,s,u,l,p)=>{let d=Math.ceil(t/4),o="";typeof u=="string"?o=`${u}(a)`:o=u("a");let r=L("inputData",n,[d],4),i=te("outputData",s,[d],4),a=[{name:"vec_size",type:"u32"}];return p&&a.push(...p),`
      ${e.registerUniforms(a).declareVariables(r,i)}

  ${l??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${r.getByOffset("global_idx")};
    ${i.setByOffset("global_idx",o)}
  }`},$e=(e,t,n,s,u,l=e.dataType,p,d)=>{let o=[{type:12,data:Math.ceil(R.size(e.dims)/4)}];return p&&o.push(...p),{name:t,shaderCache:{hint:u,inputDependencies:["type"]},getShaderSource:r=>Df(r,R.size(e.dims),e.dataType,l,n,s,d),getRunData:r=>({outputs:[{dims:e.dims,dataType:l}],dispatchGroup:{x:Math.ceil(R.size(r[0].dims)/64/4)},programUniforms:o})}},r1=e=>{e.compute($e(e.inputs[0],"Abs","abs"))},n1=e=>{e.compute($e(e.inputs[0],"Acos","acos"))},i1=e=>{e.compute($e(e.inputs[0],"Acosh","acosh"))},o1=e=>{e.compute($e(e.inputs[0],"Asin","asin"))},a1=e=>{e.compute($e(e.inputs[0],"Asinh","asinh"))},s1=e=>{e.compute($e(e.inputs[0],"Atan","atan"))},u1=e=>{e.compute($e(e.inputs[0],"Atanh","atanh"))},l1=e=>Ie(e),d1=(e,t)=>{let n;switch(t.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute($e(e.inputs[0],"Cast",n,void 0,t.cacheKey,t.to))},Cf=e=>{let t,n,s=e.length>=2&&e[1].data!==0,u=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=s?e[1].getFloat32Array()[0]:-34028234663852886e22,n=u?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=s?e[1].getUint16Array()[0]:64511,n=u?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return Ie({min:t,max:n})},p1=(e,t)=>{let n=t||Cf(e.inputs),s=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Clip",u=>`clamp(${u}, vec4<${s}>(uniforms.min), vec4<${s}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:"min",type:s},{name:"max",type:s}]),{inputs:[0]})},c1=e=>{e.compute($e(e.inputs[0],"Ceil","ceil"))},h1=e=>{e.compute($e(e.inputs[0],"Cos","cos"))},f1=e=>{e.compute($e(e.inputs[0],"Cosh","cosh"))},Kn=e=>Ie(e),m1=(e,t)=>{let n=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Elu",s=>`elu_vf32(${s})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Vi=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,g1=e=>{let t=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Erf",n=>`erf_vf32(${n})`,Vi(t)))},b1=e=>{e.compute($e(e.inputs[0],"Exp","exp"))},y1=e=>{e.compute($e(e.inputs[0],"Floor","floor"))},_1=e=>{let t=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,Vi(t)))},v1=(e,t)=>{let n=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"LeakyRelu",s=>`select(leaky_relu_alpha_ * ${s}, ${s}, ${s} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},w1=e=>{e.compute($e(e.inputs[0],"Not",t=>`!${t}`))},x1=e=>{e.compute($e(e.inputs[0],"Neg",t=>`-${t}`))},$1=e=>{e.compute($e(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},T1=e=>{let t=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"Relu",n=>`select(vec4<${t}>(0.0), ${n}, ${n} > vec4<${t}>(0.0))`))},S1=e=>{e.compute($e(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},I1=e=>Ie(e),O1=(e,t)=>{let n=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"HardSigmoid",s=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${s} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},E1=e=>{let t=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"HardSwish",n=>`${n} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${n} + vec4<${t}>(0.5)))`))},P1=e=>{e.compute($e(e.inputs[0],"Sin","sin"))},A1=e=>{e.compute($e(e.inputs[0],"Sinh","sinh"))},k1=e=>{e.compute($e(e.inputs[0],"Sqrt","sqrt"))},D1=e=>{e.compute($e(e.inputs[0],"Tan","tan"))},ka=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,C1=e=>{e.compute($e(e.inputs[0],"Tanh",ka))},uu=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${ka("v")};
}
`,lu=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,N1=e=>{let t=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"FastGelu",lu,uu(t),void 0,e.inputs[0].dataType))},z1=(e,t)=>{let n=We(e.inputs[0].dataType);return e.compute($e(e.inputs[0],"ThresholdedRelu",s=>`select(vec4<${n}>(0.0), ${s}, ${s} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},R1=e=>{e.compute($e(e.inputs[0],"Log","log"))},Nf=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,zf=e=>`quick_gelu_impl(${e})`,B1=(e,t)=>{let n=We(e.inputs[0].dataType);e.compute($e(e.inputs[0],"QuickGelu",zf,Nf(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Rf,Bf,M1,DI=k(()=>{"use strict";se(),ue(),Gu(),Rf=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Bf=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let n=L("input",e[0].dataType,e[0].dims,4),s=L("bias",e[0].dataType,[e[0].dims[2]],4),u=te("output",e[0].dataType,t,4),l=R.size(t)/4,p=Ke(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)}}),getShaderSource:d=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${d.declareVariables(n,s,u)}

  ${Vi(p)}

  ${d.mainStart()}
    ${d.guardAgainstOutOfBoundsWorkgroupSizes(l)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${u.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},M1=e=>{Rf(e.inputs),e.compute(Bf(e.inputs))}}),Mf,jf,Pt,j1,F1,L1,V1,U1,q1,G1,H1,W1,K1,CI=k(()=>{"use strict";oe(),se(),ue(),Mf=(e,t,n,s,u,l,p,d,o,r,i,a)=>{let c,h;typeof d=="string"?c=h=(_,I)=>`${d}((${_}),(${I}))`:typeof d=="function"?c=h=d:(c=d.scalar,h=d.vector);let m=te("outputData",i,s.length,4),b=L("aData",o,t.length,4),x=L("bData",r,n.length,4),w;if(u)if(l){let _=R.size(t)===1,I=R.size(n)===1,E=t.length>0&&t[t.length-1]%4===0,O=n.length>0&&n[n.length-1]%4===0;_||I?w=m.setByOffset("global_idx",h(_?`${b.type.value}(${b.getByOffset("0")}.x)`:b.getByOffset("global_idx"),I?`${x.type.value}(${x.getByOffset("0")}.x)`:x.getByOffset("global_idx"))):w=`
            let outputIndices = ${m.offsetToIndices("global_idx * 4u")};
            let offsetA = ${b.broadcastedIndicesToOffset("outputIndices",m)};
            let offsetB = ${x.broadcastedIndicesToOffset("outputIndices",m)};
            ${m.setByOffset("global_idx",h(p||E?b.getByOffset("offsetA / 4u"):`${b.type.value}(${b.getByOffset("offsetA / 4u")}[offsetA % 4u])`,p||O?x.getByOffset("offsetB / 4u"):`${x.type.value}(${x.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else w=m.setByOffset("global_idx",h(b.getByOffset("global_idx"),x.getByOffset("global_idx")));else{if(!l)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let _=(I,E,O="")=>{let A=`aData[indexA${E}][componentA${E}]`,D=`bData[indexB${E}][componentB${E}]`;return`
            let outputIndices${E} = ${m.offsetToIndices(`global_idx * 4u + ${E}u`)};
            let offsetA${E} = ${b.broadcastedIndicesToOffset(`outputIndices${E}`,m)};
            let offsetB${E} = ${x.broadcastedIndicesToOffset(`outputIndices${E}`,m)};
            let indexA${E} = offsetA${E} / 4u;
            let indexB${E} = offsetB${E} / 4u;
            let componentA${E} = offsetA${E} % 4u;
            let componentB${E} = offsetB${E} % 4u;
            ${I}[${E}] = ${O}(${c(A,D)});
          `};i===9?w=`
            var data = vec4<u32>(0);
            ${_("data",0,"u32")}
            ${_("data",1,"u32")}
            ${_("data",2,"u32")}
            ${_("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:w=`
            ${_("outputData[global_idx]",0)}
            ${_("outputData[global_idx]",1)}
            ${_("outputData[global_idx]",2)}
            ${_("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(b,x,m)}

        ${a??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${w}
      }`},jf=(e,t,n,s,u,l,p=n.dataType)=>{let d=n.dims.map(Number),o=s.dims.map(Number),r=!R.areEqual(d,o),i=d,a=R.size(d),c=!1,h=!1,m=[r];if(r){let b=gn.calcShape(d,o,!1);if(!b)throw new Error("Can't perform binary op on the given tensors");i=b.slice(),a=R.size(i);let x=R.size(d)===1,w=R.size(o)===1,_=d.length>0&&d[d.length-1]%4===0,I=o.length>0&&o[o.length-1]%4===0;m.push(x),m.push(w),m.push(_),m.push(I);let E=1;for(let O=1;O<i.length;O++){let A=d[d.length-O],D=o[o.length-O];if(A===D)E*=A;else break}E%4===0?(h=!0,c=!0):(x||w||_||I)&&(c=!0)}else c=!0;return m.push(c),{name:e,shaderCache:{hint:t+m.map(b=>b.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:b=>Mf(b,d,o,i,c,r,h,u,n.dataType,s.dataType,p,l),getRunData:()=>({outputs:[{dims:i,dataType:p}],dispatchGroup:{x:Math.ceil(a/64/4)},programUniforms:[{type:12,data:Math.ceil(R.size(i)/4)},...ie(d,o,i)]})}},Pt=(e,t,n,s,u,l)=>{e.compute(jf(t,u??"",e.inputs[0],e.inputs[1],n,s,l))},j1=e=>{Pt(e,"Add",(t,n)=>`${t}+${n}`)},F1=e=>{Pt(e,"Div",(t,n)=>`${t}/${n}`)},L1=e=>{Pt(e,"Equal",{scalar:(t,n)=>`u32(${t}==${n})`,vector:(t,n)=>`vec4<u32>(${t}==${n})`},void 0,void 0,9)},V1=e=>{Pt(e,"Mul",(t,n)=>`${t}*${n}`)},U1=e=>{let t=L("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;Pt(e,"Pow",{scalar:(n,s)=>`pow_custom(${n},${s})`,vector:(n,s)=>`pow_vector_custom(${n},${s})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},q1=e=>{Pt(e,"Sub",(t,n)=>`${t}-${n}`)},G1=e=>{Pt(e,"Greater",{scalar:(t,n)=>`u32(${t}>${n})`,vector:(t,n)=>`vec4<u32>(${t}>${n})`},void 0,void 0,9)},H1=e=>{Pt(e,"Less",{scalar:(t,n)=>`u32(${t}<${n})`,vector:(t,n)=>`vec4<u32>(${t}<${n})`},void 0,void 0,9)},W1=e=>{Pt(e,"GreaterOrEqual",{scalar:(t,n)=>`u32(${t}>=${n})`,vector:(t,n)=>`vec4<u32>(${t}>=${n})`},void 0,void 0,9)},K1=e=>{Pt(e,"LessOrEqual",{scalar:(t,n)=>`u32(${t}<=${n})`,vector:(t,n)=>`vec4<u32>(${t}<=${n})`},void 0,void 0,9)}}),Ff,Lf,X1,Z1,NI=k(()=>{"use strict";oe(),se(),Fe(),ue(),Ff=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let n=0,s=e[n],u=s.dataType,l=s.dims.length;e.forEach((p,d)=>{if(d!==n){if(p.dataType!==u)throw new Error("input tensors should be one type");if(p.dims.length!==l)throw new Error("input tensors should have the same shape");p.dims.forEach((o,r)=>{if(r!==t&&o!==s.dims[r])throw new Error("non concat dimensions must match")})}})},Lf=(e,t,n,s,u=0)=>{let l=e.reduce((w,_)=>w+R.size(_.dims),0),p=new Array(e.length),d=new Array(e.length),o=new Array(e.length),r=0,i=u,a=[],c=[],h=[{type:12,data:l}];for(let w=0;w<e.length;++w)p[w]=r,d[w]=i,r+=R.size(e[w].dims),i+=e[w].dims[t],c.push(e[w].dims.length),o[w]=L(`input${w}`,s,c[w]),a.push("rank"),h.push({type:12,data:p[w]}),h.push({type:12,data:d[w]});for(let w=0;w<e.length;++w)h.push(...ie(e[w].dims));h.push(...ie(n));let m=te("output",s,n.length),b=o.map((w,_)=>{let I=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${_}`};
        var outputIndices = ${w.offsetToIndices("inputOffset")};
        ${m.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${_};
        ${m.setByIndices("outputIndices",w.getByOffset("inputOffset"))}`;return e.length===1?I:_===0?`if (inputIndex == 0u) {${I}}`:_===e.length-1?`else {${I}}`:`else if (inputIndex == ${_}u) {${I}}`}).join(`
`),x=w=>`

  ${(()=>{w.registerUniform("outputSize","u32");for(let _=0;_<e.length;_++)w.registerUniform(`inputOffset${_}`,"u32"),w.registerUniform(`outputAxisOffset${_}`,"u32");return w.declareVariables(...o,m)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${o.slice(1).map((_,I)=>`if (global_idx < uniforms.inputOffset${I+1}) {
      return ${I}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${b}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:n,dataType:s}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:h}),getShaderSource:x}},X1=(e,t)=>{let n=e.inputs,s=n[0].dims,u=R.normalizeAxis(t.axis,s.length);Ff(n,u);let l=s.slice();l[u]=n.reduce((r,i)=>r+(i.dims.length>u?i.dims[u]:0),0);let p=n.filter(r=>R.size(r.dims)>0);if(p.length===0){e.output(0,l);return}let d=e.deviceLimits.maxStorageBuffersPerShaderStage-1,o=0;for(let r=0;r<p.length;r+=d){let i=p.slice(r,r+d);e.compute(Lf(i,u,l,n[0].dataType,o),{inputs:i,outputs:[0]}),o+=i.reduce((a,c)=>a+c.dims[u],0)}},Z1=e=>Ie({axis:e.axis})}),Zr,Jr,Qr,Hu,rn=k(()=>{"use strict";oe(),se(),Zr=(e,t,n="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Jr=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Qr=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Hu=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[n,s]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:n,beta:s}}else if(t==="Clip"){let[n,s]=(e==null?void 0:e.activation_params)||[wv,xv];return{activation:t,clipMax:s,clipMin:n}}else if(t==="LeakyRelu"){let[n]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:n}}return{activation:t}}}),Je,J1,Wu=k(()=>{"use strict";Je=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},J1=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Q1,zI=k(()=>{"use strict";Q1=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),ei,Ku,Xu=k(()=>{"use strict";oe(),se(),ue(),rn(),ei=(e,t,n,s,u)=>{let l=s-n;return`
      ${Array.from({length:n}).map((p,d)=>`
      if (${re(t.shape,d,t.rank)} != 1) {
        ${t.indicesSet(e,d,re(u,d+l,s))}
      } else {
        ${t.indicesSet(e,d,0)}
      }`).join("")}
`},Ku=(e,t,n,s,u=!1,l)=>{let p=e[0].dims,d=e[1].dims,o=p[p.length-2],r=d[d.length-1],i=p[p.length-1],a=je(r),c=je(i),h=je(o),m=R.size(n)/a/h,b=e.length>2,x=s?s.slice(0,-2):n.slice(0,-2),w=[R.size(x),o,r],_=[{type:12,data:m},{type:12,data:o},{type:12,data:r},{type:12,data:i}];Jr(t,_),_.push(...ie(x,p,d)),b&&_.push(...ie(e[2].dims)),_.push(...ie(w));let I=E=>{let O=Vu("batch_dims",e[0].dataType,x.length),A=L("a",e[0].dataType,p.length,c),D=L("b",e[1].dataType,d.length,a),S=te("output",e[0].dataType,w.length,a),F=Ke(S.type.tensor),U=Zr(t,S.type.value,F),Q=[A,D],H="";if(b){let $=u?a:1;Q.push(L("bias",e[2].dataType,e[2].dims.length,$)),H=`${u?`value += bias[col / ${$}];`:`value += ${S.type.value}(bias[row + i]);`}`}let N=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Qr(t,N);let M=()=>{let $=`var a_data: ${A.type.value};`;for(let B=0;B<c;B++)$+=`
              let b_data${B} = b[(b_offset + (k + ${B}) * uniforms.N + col) / ${a}];`;for(let B=0;B<h;B++){$+=`a_data = a[(a_offset + (row + ${B}) * uniforms.K + k) / ${c}];`;for(let q=0;q<c;q++)$+=`
            values[${B}] = fma(${D.type.value}(a_data${c===1?"":`[${q}]`}), b_data${q}, values[${B}]);
`}return $};return`
  ${E.registerUniforms(N).registerInternalVariables(O).declareVariables(...Q,S)}
  ${E.mainStart()}
    ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${a})) * ${a};
    var index1 = global_idx / (uniforms.N / ${a});
    let stride1 = uniforms.M / ${h};
    let row = (index1 % stride1) * ${h};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${O.offsetToIndices("batch")};`}

    var a_indices: ${A.type.indices};
    ${ei("a_indices",A,A.rank-2,O.rank,"batch_indices")}
    ${A.indicesSet("a_indices",A.rank-2,0)}
    ${A.indicesSet("a_indices",A.rank-1,0)}
    let a_offset = ${A.indicesToOffset("a_indices")};

    var b_indices: ${D.type.indices};
    ${ei("b_indices",D,D.rank-2,O.rank,"batch_indices")}
    ${D.indicesSet("b_indices",D.rank-2,0)}
    ${D.indicesSet("b_indices",D.rank-1,0)}
    let b_offset = ${D.indicesToOffset("b_indices")};
    var values: array<${S.type.value}, ${h}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${c}) {
      ${M()}
    }
    for (var i = 0u; i < ${h}u; i++) {
      var value = values[i];
      ${H}
      ${U}
      let cur_indices = ${S.type.indices}(batch, row + i, col);
      let offset = ${S.indicesToOffset("cur_indices")};
      ${S.setByOffset(`offset / ${a}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${a};${c};${h};${u}`,inputDependencies:b?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:_}),getShaderSource:I}}}),Vf,Uf,du,Da,qf,pu,Gf,Ji,Zu=k(()=>{"use strict";oe(),se(),ue(),rn(),Xu(),Wu(),Vf=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Uf=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,du=(e,t,n="f32",s,u=!1,l=32,p=!1,d=32)=>{let o=t[1]*e[1],r=t[0]*e[0],i=u?o:l,a=u?l:o,c=i/t[0],h=l/t[1];if(!((u&&c===4&&e[1]===4||!u&&(c===3||c===4))&&i%t[0]===0&&l%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${u} is true, innerElementSize ${c} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${c} must be 3 or 4.
  tileAWidth ${i} must be divisible by workgroupSize[0]${t[0]}. tileInner ${l} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${c}<${n}>, ${i/c}>, ${a}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${r/e[0]}>, ${l}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${c};
const tileInner = ${l};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${p?"0":"i32(globalId.z)"};
  ${s?`let batchIndices = ${s.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${o};

  let num_tiles = ${p?`${Math.ceil(d/l)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${p?`i32(globalId.z) * ${d}`:"0"};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${h};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Vf(u,s)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${s?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${c===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Uf(u,c)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Da=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,qf=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",pu=(e,t,n="f32",s,u=!1,l=32,p=!1,d=32,o=!1)=>{let r=e[1]*t[1],i=e[0]*t[0],a=u?r:l,c=u?l:r;if(!(c%t[1]===0&&a%t[0]===0&&l%t[1]===0))throw new Error(`tileAHight ${c} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${a} must be divisible by workgroupSize[0]${t[0]}, tileInner ${l} must be divisible by workgroupSize[1]${t[1]}`);let h=c/t[1],m=a/t[0],b=l/t[1],x=o?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${r};
    let globalColStart = i32(workgroupId.x) * ${i};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${c}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${a}; inputCol = inputCol + ${t[0]}) {
          ${Da(u,s)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${l}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${i}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${s?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${u?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${r};

let tileRowA = i32(localId.y) * ${h};
let tileColA = i32(localId.x) * ${m};
let tileRowB = i32(localId.y) * ${b};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${h}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${m}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Da(u,s)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${b}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${s?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${qf(u)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${a}>, ${c}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${i}>, ${l}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${l};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${p?"0":"i32(globalId.z)"};
    ${s?`let batchIndices = ${s.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${p?`${Math.ceil(d/l)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${p?`i32(globalId.z) * ${d}`:"0"};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${x}
  }
`},Gf=(e,t,n,s,u=!1)=>{let[l,p,d,o]=s,r=Ke(s[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Je(e,r)} {
      var value = ${Je(e,r)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${p.type.indices};
        ${ei("aIndices",p,p.rank-2,l.rank,"batchIndices")}
        ${p.indicesSet("aIndices",p.rank-2,"u32(row)")}
        ${p.indicesSet("aIndices",p.rank-1,"u32(colIn)")}
        value = ${p.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Je(e,r)} {
      var value = ${Je(e,r)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${d.type.indices};
        ${ei("bIndices",d,d.rank-2,l.rank,"batchIndices")}
        ${d.indicesSet("bIndices",d.rank-2,"u32(row)")}
        ${d.indicesSet("bIndices",d.rank-1,"u32(colIn)")}
        value = ${d.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Je(e,r)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${u?"bias[colIn]":`${Je(e,r)}(bias[row])`};`:""}
        ${n}
        ${o.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Ji=(e,t,n,s,u=!1,l)=>{let p=e[0].dims,d=e[1].dims,o=p.slice(0,-2),r=d.slice(0,-2),i=s?s.slice(0,-2):n.slice(0,-2),a=R.size(i),c=p[p.length-2],h=p[p.length-1],m=d[d.length-1],b=h%4===0&&m%4===0,x=c<=8?[4,1,1]:[4,4,1],w=[8,8,1],_=[Math.ceil(m/w[0]/x[0]),Math.ceil(c/w[1]/x[1]),Math.ceil(a/w[2]/x[2])],I=b?4:1,E=[...o,c,h/I],O=E.length,A=[...r,h,m/I],D=A.length,S=[a,c,m/I],F=[{type:6,data:c},{type:6,data:m},{type:6,data:h}];Jr(t,F),F.push(...ie(i,E,A));let U=["rank","rank"],Q=e.length>2;Q&&(F.push(...ie(e[2].dims)),U.push("rank")),F.push(...ie(S));let H=N=>{let M=i.length,$=Vu("batchDims",e[0].dataType,M,1),B=Ke(e[0].dataType),q=L("a",e[0].dataType,O,I),J=L("b",e[1].dataType,D,I),K=te("result",e[0].dataType,S.length,I),ae=[q,J];if(Q){let fe=u?I:1;ae.push(L("bias",e[2].dataType,e[2].dims.length,fe))}let z=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Qr(t,z);let X=Ke(K.type.tensor),Z=Zr(t,K.type.value,X),V=Gf(I,Q,Z,[$,q,J,K],u);return`
  ${N.registerUniforms(z).registerInternalVariables($).declareVariables(...ae,K)}
  ${V}
  ${b?du(x,w,B,$):pu(x,w,B,$)}
                   `};return{name:"MatMul",shaderCache:{hint:`${x};${t.activation};${b};${u}`,inputDependencies:U},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:F}),getShaderSource:H}}}),Hf,Y1,RI=k(()=>{"use strict";oe(),Jt(),ue(),rn(),Wu(),zI(),Zu(),Hf=(e,t,n,s,u=!1,l,p=4,d=4,o=4,r="f32")=>{let i=F=>{switch(F){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${r}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${F} is not supported.`)}},a=F=>{switch(F){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${F} is not supported.`)}},c=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,h=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,m=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",b=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",x=e?"row":"col",w=e?"col":"row",_=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${x} / outWidth;
    let outCol = ${x} % outWidth;

    let WRow = ${w} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${w} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${w} % inChannels;
    var resData = ${Je(p,r)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${m} && xCol >= 0 && xCol < ${b}) {
      ${c}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${i(p)}
    }
    return resData;`,I=e?t&&s?`
    let col = colIn * ${p};
    ${_}`:`
    let col = colIn * ${p};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${_}
    }
    return ${Je(p,r)}(0.0);`:s&&n?`
    let col = colIn * ${p};
    ${_}`:`
    let col = colIn * ${p};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_}
    }
    return ${Je(p,r)}(0.0);`,E=e?s&&n?a(d):`
    let col = colIn * ${d};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${a(d)}
    }
    return ${Je(d,r)}(0.0);`:`
    let col = colIn * ${d};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${a(d)}
    }
    return ${Je(d,r)}(0.0);`,O=Je(o,r),A=Je(e?p:d,r),D=Je(e?d:p,r),S=Zr(l,O,r);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${A} {
      ${e?I:E}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${D} {
      ${e?E:I}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${O}) {
      let col = colIn * ${o};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${h}
      ${J1(u)}
      ${S}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Y1=(e,t,n,s,u,l,p,d,o)=>{let r=t.format==="NHWC",i=r?e[0].dims[3]:e[0].dims[1],a=n[0],c=r?n[2]:n[3],h=r?n[1]:n[2],m=r?n[3]:n[1],b=r&&(i%4===0||i%3===0)&&m%4===0,x=r?m:c*h,w=r?c*h:m,_=[8,8,1],I=s<=8?[4,1,1]:[4,4,1],E=[Math.ceil(x/_[0]/I[0]),Math.ceil(w/_[1]/I[1]),Math.ceil(a/_[2]/I[2])];we("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${E}`);let O=b?r&&i%4!==0?3:4:1,A=_[1]*I[1],D=_[0]*I[0],S=Math.max(_[0]*O,_[1]),F=s%A===0,U=u%D===0,Q=l%S===0,H=b?[O,4,4]:[1,1,1],N=[{type:6,data:s},{type:6,data:u},{type:6,data:l},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Jr(t,N),N.push(...ie(e[0].dims,e[1].dims));let M=["rank","rank"];p&&(N.push(...ie(e[2].dims)),M.push("rank")),N.push(...ie(n));let $=B=>{let q=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Qr(t,q);let J=b?4:1,K=Ke(e[0].dataType),ae=`
      fn setOutputAtIndex(flatIndex : i32, value : ${b?`vec4<${K}>`:K}) {
        result[flatIndex] = ${b?`vec4<${K}>`:K}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${b?`vec4<${K}>`:K}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${b?"/ 4":""}, value);
      }`,z=L("x",e[0].dataType,e[0].dims.length,O===3?1:O),X=L("w",e[1].dataType,e[1].dims.length,J),Z=[z,X],V=te("result",e[0].dataType,n.length,J);if(p){let fe=L("bias",e[2].dataType,e[2].dims.length,J);Z.push(fe),ae+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${b?`vec4<${K}>`:K} {
          return bias[coords.${r?"w":"y"}${b?"/ 4":""}];
        }`}return`
        ${Q1("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${B.registerUniforms(q).declareVariables(...Z,V)}
        ${ae}
        ${Hf(r,F,U,Q,p,t,H[0],H[1],H[2],K)}
        ${b?du(I,_,K,void 0,!r,S):pu(I,_,K,void 0,!r,S,!1,void 0,d)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${O};${b};${F};${U};${Q};${A};${D};${S}`,inputDependencies:M},getRunData:()=>({outputs:[{dims:o?o(n):n,dataType:e[0].dataType}],dispatchGroup:{x:E[0],y:E[1],z:E[2]},programUniforms:N}),getShaderSource:$}}}),Wf,Ca,Nn,Kf,Na,Xf,ew,tw,BI=k(()=>{"use strict";oe(),Jt(),se(),ue(),rn(),Wu(),Wf=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},Ca=e=>typeof e=="number"?[e,e,e]:e,Nn=(e,t)=>t<=1?e:e+(e-1)*(t-1),Kf=(e,t,n,s=1)=>{let u=Nn(t,s);return Math.floor((e[0]*(n-1)-n+u)/2)},Na=(e,t,n,s,u)=>{u==null&&(u=Kf(e,t[0],s[0]));let l=[0,0,0,n];for(let p=0;p<3;p++)e[p]+2*u>=t[p]&&(l[p]=Math.trunc((e[p]-t[p]+2*u)/s[p]+1));return l},Xf=(e,t,n,s,u,l,p,d,o,r)=>{let i,a,c,h;if(e==="VALID"&&(e=0),typeof e=="number"){i={top:e,bottom:e,left:e,right:e,front:e,back:e};let m=Na([t,n,s,1],[d,o,r],1,[u,l,p],e);a=m[0],c=m[1],h=m[2]}else if(Array.isArray(e)){if(!e.every((b,x,w)=>b===w[0]))throw Error(`Unsupported padding parameter: ${e}`);i={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let m=Na([t,n,s,1],[d,o,r],1,[u,l,p],e[0]);a=m[0],c=m[1],h=m[2]}else if(e==="SAME_UPPER"){a=Math.ceil(t/u),c=Math.ceil(n/l),h=Math.ceil(s/p);let m=(a-1)*u+d-t,b=(c-1)*l+o-n,x=(h-1)*p+r-s,w=Math.floor(m/2),_=m-w,I=Math.floor(b/2),E=b-I,O=Math.floor(x/2),A=x-O;i={top:I,bottom:E,left:O,right:A,front:w,back:_}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:i,outDepth:a,outHeight:c,outWidth:h}},ew=(e,t,n,s,u,l=!1,p="channelsLast")=>{let d,o,r,i,a;if(p==="channelsLast")[d,o,r,i,a]=e;else if(p==="channelsFirst")[d,a,o,r,i]=e;else throw new Error(`Unknown dataFormat ${p}`);let[c,,h,m,b]=t,[x,w,_]=Ca(n),[I,E,O]=Ca(s),A=Nn(h,I),D=Nn(m,E),S=Nn(b,O),{padInfo:F,outDepth:U,outHeight:Q,outWidth:H}=Xf(u,o,r,i,x,w,_,A,D,S),N=l?c*a:c,M=[0,0,0,0,0];return p==="channelsFirst"?M=[d,N,U,Q,H]:p==="channelsLast"&&(M=[d,U,Q,H,N]),{batchSize:d,dataFormat:p,inDepth:o,inHeight:r,inWidth:i,inChannels:a,outDepth:U,outHeight:Q,outWidth:H,outChannels:N,padInfo:F,strideDepth:x,strideHeight:w,strideWidth:_,filterDepth:h,filterHeight:m,filterWidth:b,effectiveFilterDepth:A,effectiveFilterHeight:D,effectiveFilterWidth:S,dilationDepth:I,dilationHeight:E,dilationWidth:O,inShape:e,outShape:M,filterShape:t}},tw=(e,t,n,s,u,l)=>{let p=l==="channelsLast",d=p?e[0].dims[3]:e[0].dims[1],o=!1,r=[64,1,1],i={x:n.map((_,I)=>I)},a=[Math.ceil(Wf(i.x.map(_=>n[_]))/r[0]),1,1];we("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${a}`);let c=o?p&&d%4!==0?3:4:1,h=R.size(n),m=[{type:12,data:h},{type:12,data:s},{type:12,data:u},{type:12,data:t.strides},{type:12,data:t.dilations}];Jr(t,m),m.push(...ie(e[0].dims,e[1].dims));let b=["rank","rank"],x=e.length===3;x&&(m.push(...ie(e[2].dims)),b.push("rank")),m.push(...ie(n));let w=_=>{let I=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:s.length},{name:"pads",type:"u32",length:u.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Qr(t,I);let E=o?4:1,O=Ke(e[0].dataType),A=L("x",e[0].dataType,e[0].dims.length,c===3?1:c),D=L("W",e[1].dataType,e[1].dims.length,E),S=[A,D],F=te("result",e[0].dataType,n.length,E),U="";if(x){let N=L("bias",e[2].dataType,e[2].dims.length,E);S.push(N),U+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${o?`vec4<${O}>`:O} {
          return bias[${p?re("coords",4,5):re("coords",1,5)}${o?"/ 4":""}];
        }`}let Q=Je(c,O),H=Zr(t,Q,O);return`
            ${U}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${O} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${A.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${O} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${D.getByIndices("aIndices")};
            }
          ${_.registerUniforms(I).declareVariables(...S,F)}
          ${_.mainStart()}
          ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${F.offsetToIndices("global_idx")};
              let batch = ${re("coords",0,A.rank)};
              let d2 = ${p?re("coords",A.rank-1,A.rank):re("coords",1,A.rank)};
              let xFRCCorner = vec3<u32>(${p?re("coords",1,A.rank):re("coords",2,A.rank)},
              ${p?re("coords",2,A.rank):re("coords",3,A.rank)},
              ${p?re("coords",3,A.rank):re("coords",4,A.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${p?re("uniforms.x_shape",1,A.rank):re("uniforms.x_shape",2,A.rank)};
              let xShapeZ = ${p?re("uniforms.x_shape",2,A.rank):re("uniforms.x_shape",3,A.rank)};
              let xShapeW = ${p?re("uniforms.x_shape",3,A.rank):re("uniforms.x_shape",4,A.rank)};
              let xShapeU = ${p?re("uniforms.x_shape",4,A.rank):re("uniforms.x_shape",1,A.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${O}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${p?`let xValues = vec4<${O}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${O}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${O}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${p?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${p?`let xValues = vec2<${O}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${O}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${O}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${p?`let xValues = vec3<${O}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${O}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${O}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${x?"value = value + getBiasByOutputCoords(coords)":""};
              ${H}
              result[global_idx] = ${O}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${p};${c};${x}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:a[0],y:a[1],z:a[2]},programUniforms:m}),getShaderSource:w}}}),rw,nw,MI=k(()=>{"use strict";oe(),se(),ue(),rn(),rw=(e,t,n,s)=>{let u=e.length>2,l=u?"value += b[output_channel];":"",p=e[0].dims,d=e[1].dims,o=t.format==="NHWC",r=o?n[3]:n[1],i=r/t.group,a=o&&i>=4?je(r):1,c=R.size(n)/a,h=[{type:12,data:c},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:i}];Jr(t,h),h.push(...ie(p,[d[0],d[1],d[2],d[3]/a]));let m=u?["rank","rank","rank"]:["rank","rank"];h.push(...ie([n[0],n[1],n[2],n[3]/a]));let b=x=>{let w=te("output",e[0].dataType,n.length,a),_=Ke(w.type.tensor),I=Zr(t,w.type.value,_),E=L("x",e[0].dataType,p.length),O=L("w",e[1].dataType,d.length,a),A=[E,O];u&&A.push(L("b",e[2].dataType,e[2].dims,a));let D=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Qr(t,D);let S=o?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${E.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${O.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${E.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${O.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${x.registerUniforms(D).declareVariables(...A,w)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${w.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${o?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${o?1:2}], outputIndices[${o?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${a} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${o?2:1}];

    var value: ${w.type.value} = ${w.type.value}(0);
    ${S}
    ${l}
    ${I}
    ${w.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${a}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:s?s(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:b}},nw=(e,t,n,s)=>{let u=e.length>2,l=je(n[3]),p=je(n[2]),d=R.size(n)/l/p,o=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/l],r=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/l],i=[n[0],n[1],n[2],n[3]/l],a=[{type:12,data:d},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Jr(t,a),a.push(...ie(o,r,i));let c=(p-1)*t.strides[1]+r[1],h=m=>{let b=te("output",e[0].dataType,i.length,l),x=Ke(b.type.tensor),w=Zr(t,b.type.value,x),_=L("x",e[0].dataType,o.length,l),I=L("w",e[1].dataType,r.length,l),E=[_,I];u&&E.push(L("b",e[2].dataType,e[2].dims,l));let O=u?"value += b[output_channel];":"",A=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Qr(t,A),`
  ${m.registerUniforms(A).declareVariables(...E,b)}
  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${p}u;
    let col = (index1 % width1) * ${p}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${_.type.value}, ${c}>;
    var values: array<${b.type.value}, ${p}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${r[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${c}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${_.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${_.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${r[1]}; w_width++) {
          let w_val = ${I.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${p}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${p}u; i++) {
      var value = values[i];
      ${O}
      ${w}
      ${b.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${l};${p};${c};${r[0]};${r[1]}`,inputDependencies:u?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:s?s(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:a}),getShaderSource:h}}}),Zf,Di,Jf,Ci,cu,za,Qf,Yf,hu,jI=k(()=>{"use strict";se(),RI(),BI(),Zu(),MI(),rn(),Xu(),mr(),Zf=(e,t,n,s,u,l)=>{let p=e[0],d=e.slice(l?1:2,l?3:4),o=d.length,r=t[0],i=t.slice(2).map((c,h)=>c+(c-1)*(n[h]-1)),a=d.map((c,h)=>c+s[h]+s[h+o]).map((c,h)=>Math.floor((c-i[h]+u[h])/u[h]));return a.splice(0,0,p),a.splice(l?3:1,0,r),a},Di=[2,3,1,0],Jf=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],s=e[1].dims[1]*t.group;if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let u=e[0].dims.length-2;if(t.dilations.length!==u)throw new Error(`dilations should be ${u}D`);if(t.strides.length!==u)throw new Error(`strides should be ${u}D`);if(t.pads.length!==u*2)throw new Error(`pads should be ${u*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ci=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let l=2;l<t[1].dims.length;++l)n[l-2]===0&&(n[l-2]=t[1].dims[l]);let s=e.pads.slice();Xi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,s,e.format==="NHWC",e.autoPad);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:s}),u},cu=e=>{let t=Hu(e),n=e.format,s=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],u=e.dilations,l=e.group,p=e.kernel_shape,d=e.pads,o=e.strides,r=e.w_is_const();return{autoPad:s,format:n,dilations:u,group:l,kernelShape:p,pads:d,strides:o,wIsConst:r,...t,cacheKey:`${e.format};${t.activation};`}},za=(e,t,n,s)=>{let u=n.format==="NHWC",l=Zf(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,u);if(n.group!==1){let A=[t[0]];if(u){let D=e.kernelCustomData.wT??e.compute(ft(t[1],Di),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=D),A.push(D)}else A.push(t[1]);t.length===3&&A.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&u&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(nw(A,n,l,s),{inputs:A}):e.compute(rw(A,n,l,s),{inputs:A});return}let p=t.length===3,d=t[0].dims[u?1:2],o=t[0].dims[u?2:3],r=t[0].dims[u?3:1],i=t[1].dims[2],a=t[1].dims[3],c=l[u?1:2],h=l[u?2:3],m=l[u?3:1],b=u&&i===d&&a===o&&n.pads[0]===0&&n.pads[1]===0;if(b||i===1&&a===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let A=l[0],D,S,F,U=[];if(u){let N=e.kernelCustomData.wT??e.compute(ft(t[1],Di),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=N),b){let M=d*o*r;D=t[0].reshape([1,A,M]),S=N.reshape([1,M,m]),F=[1,A,m]}else D=t[0].reshape([A,d*o,r]),S=N.reshape([1,r,m]),F=[A,c*h,m];U.push(D),U.push(S)}else D=t[0].reshape([A,r,d*o]),S=t[1].reshape([1,m,r]),F=[A,m,c*h],U.push(S),U.push(D);p&&U.push(t[2]);let Q=F[2],H=U[0].dims[U[0].dims.length-1];Q<8&&H<8?e.compute(Ku(U,n,l,F,u,s),{inputs:U}):e.compute(Ji(U,n,l,F,u,s),{inputs:U});return}let x=!0,w=e.kernelCustomData.wT??e.compute(ft(t[1],Di),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=w);let _=[t[0],w];p&&_.push(t[2]);let I=u?c*h:m,E=u?m:c*h,O=i*a*r;e.compute(Y1(_,n,l,I,E,O,p,x,s),{inputs:_})},Qf=(e,t)=>{let n=t.format==="NHWC",s=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&s.push(e.inputs[2]);let u=[0,t.pads[0],0,t.pads[1]],l=[1].concat(t.strides),p=[1].concat(t.dilations),d=[1].concat(t.kernelShape),o=Ci({...t,pads:u,strides:l,dilations:p,kernelShape:d},s);za(e,s,o,r=>n?[r[0],r[2],r[3]]:[r[0],r[1],r[3]])},Yf=(e,t,n)=>{let s=n.format==="NHWC"?"channelsLast":"channelsFirst",u=Ci(n,t),l=n.autoPad==="NOTSET"?n.pads:n.autoPad,p=ew(t[0].dims,t[1].dims,n.strides,n.dilations,l,!1,s);e.compute(tw(t,u,p.outShape,[p.filterDepth,p.filterHeight,p.filterWidth],[p.padInfo.front,p.padInfo.top,p.padInfo.left],s))},hu=(e,t)=>{if(Jf(e.inputs,t),e.inputs[0].dims.length===3)Qf(e,t);else if(e.inputs[0].dims.length===5)Yf(e,e.inputs,t);else{let n=Ci(t,e.inputs);za(e,e.inputs,n)}}}),iw,FI=k(()=>{"use strict";oe(),Jt(),se(),ue(),iw=(e,t,n)=>{let s=e.length>2,u=t.outputShape,l=t.format==="NHWC",p=t.group,d=e[1].dims,o=d[2]/p,r=d[3],i=l?je(o):1,a=l&&r===1&&o>=4,c=a?Math.floor(o/4)*4:Math.floor(o/i)*i,h=o-c,m=l?je(r):1,b=l?r===1?i:m:1,x=R.size(u)/m,w=[Math.ceil(x/64),1,1];we("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${w}`);let _=["rank","rank"],I=[t.strides[0],t.strides[1]],E=[t.kernelShape[l?1:2],t.kernelShape[l?2:3]],O=[t.dilations[0],t.dilations[1]],A=[E[0]+(t.dilations[0]<=1?0:(t.kernelShape[l?1:2]-1)*(t.dilations[0]-1)),E[1]+(t.dilations[1]<=1?0:(t.kernelShape[l?2:3]-1)*(t.dilations[1]-1))],D=[A[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),A[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],S=[{type:12,data:x},{type:12,data:I},{type:12,data:E},{type:12,data:O},{type:12,data:A},{type:6,data:D},{type:12,data:c},{type:12,data:o},{type:12,data:r},...ie(e[0].dims,e[1].dims)];s&&(S.push(...ie(e[2].dims)),_.push("rank")),S.push(...ie(u));let F=U=>{let Q=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:I.length},{name:"filter_dims",type:"u32",length:E.length},{name:"dilations",type:"u32",length:E.length},{name:"effective_filter_dims",type:"u32",length:A.length},{name:"pads",type:"i32",length:D.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],H=Ke(e[0].dataType),N=l?1:2,M=l?2:3,$=l?3:1,B=L("W",e[1].dataType,e[1].dims.length,b),q=L("Dy",e[0].dataType,e[0].dims.length,i),J=[q,B];s&&J.push(L("bias",e[2].dataType,[u[$]].length,m));let K=te("result",e[0].dataType,u.length,m),ae=()=>{let Z="";if(a)i===4?Z+=`
        let xValue = ${q.getByOffset("x_offset")};
        let wValue = ${B.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:i===2?Z+=`
          dotProd = dotProd + dot(vec4<${H}>(${q.getByOffset("x_offset")}, ${q.getByOffset("x_offset + 1u")}), vec4<${H}>(${B.getByOffset("w_offset")}, ${B.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:i===1&&(Z+=`
          dotProd = dotProd + dot(vec4<${H}>(${q.getByOffset("x_offset")}, ${q.getByOffset("x_offset + 1u")}, ${q.getByOffset("x_offset + 2u")}, ${q.getByOffset("x_offset + 3u")}), vec4<${H}>(${B.getByOffset("w_offset")}, ${B.getByOffset("w_offset + 1u")}, ${B.getByOffset("w_offset + 2u")}, ${B.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(Z+=`
                  let xValue = ${l?q.getByOffset(`${q.indicesToOffset(`${q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${i}`):q.get("batch","inputChannel","idyR","idyC")};
        `,i===1)Z+=`
          let w_offset = ${B.indicesToOffset(`${B.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${B.getByOffset(`w_offset / ${b}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let V=0;V<i;V++)Z+=`
            let wValue${V} = ${B.getByOffset(`${B.indicesToOffset(`${B.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${V}, wOutChannel)`)} / ${b}`)};
            dotProd = dotProd + xValue[${V}] * wValue${V};`;return Z},z=()=>{if(h===0)return"";if(!a)throw new Error(`packInputAs4 ${a} is not true.`);let Z="";if(i===1){Z+="dotProd = dotProd";for(let V=0;V<h;V++)Z+=`
            + ${q.getByOffset(`x_offset + ${V}`)} * ${B.getByOffset(`w_offset + ${V}`)}`;Z+=";"}else if(i===2){if(h!==2)throw new Error(`Invalid inputChannelsRemainder ${h}.`);Z+=`
          let xValue = ${q.getByOffset("x_offset")};
          let wValue = ${B.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return Z},X=`
            let outputIndices = ${K.offsetToIndices(`global_idx * ${m}`)};
            let batch = ${K.indicesGet("outputIndices",0)};
            let d1 = ${K.indicesGet("outputIndices",$)};
            let r = ${K.indicesGet("outputIndices",N)};
            let c = ${K.indicesGet("outputIndices",M)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${K.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${H}(dyRCorner) + ${H}(wR)) / ${H}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${H}(uniforms.Dy_shape[${N}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${H}(dyCCorner) + ${H}(wC)) / ${H}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${H}(uniforms.Dy_shape[${M}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${a?`
                var x_offset = ${q.indicesToOffset(`${q.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${i};
                var w_offset = ${B.indicesToOffset(`${B.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${b};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${a?4:i}) {
                  ${ae()}
                  inputChannel = inputChannel + ${a?4:i};
                }
                ${z()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${s?` + bias[d1 / ${m}]`:""};
            ${K.setByOffset("global_idx","value")};
          `;return`
    ${U.registerUniforms(Q).declareVariables(...J,K)}
      ${U.mainStart()}
      ${U.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${X}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${i}${b}${m}${a}${h}`,inputDependencies:_},getRunData:()=>({dispatchGroup:{x:w[0],y:w[1],z:w[2]},outputs:[{dims:n?n(u):u,dataType:e[0].dataType}],programUniforms:S}),getShaderSource:F}}}),em,tm,rm,Ra,ow,nm,Ba,im,aw,LI=k(()=>{"use strict";FI(),rn(),mr(),em=(e,t,n,s,u,l)=>(e-1)*t+n+(s-1)*u+1-l,tm=(e,t,n,s,u)=>{let l=Math.floor(e/2);t==="SAME_UPPER"?(n[s]=l,n[u]=e-l):t==="SAME_LOWER"&&(n[s]=e-l,n[u]=l)},rm=(e,t,n,s,u,l,p,d,o,r)=>{let i=e.length-2,a=r.length===0;o.length<i&&o.push(...Array(i-o.length).fill(0));let c=e[0],h=t[d?3:1]*u;for(let m=0,b=e.length-i-(d?1:0);m<i;++m,++b){let x=e[b],w=a?x*p[m]:r[m],_=em(x,p[m],l[m],t[b],n[m],w);tm(_,s,l,m,m+i),a&&r.push(p[m]*(x-1)+o[m]+(t[b]-1)*n[m]+1-l[m]-l[m+i])}r.splice(0,0,c),r.splice(d?3:1,0,h)},Ra=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((a,c)=>a*c,1)===0){n.length=0;for(let a=2;a<t[1].dims.length;++a)n.push(t[1].dims[a])}let s=e.format==="NHWC";n.splice(0,0,t[1].dims[0]),n.splice(s?3:1,0,t[1].dims[1]);let u=e.pads.slice(),l=e.outputShape.slice(),p=e.outputPadding.slice(),d=t[0].dims,o=e.dilations.slice();if(o.reduce((a,c)=>a+c,0)===0){let a=t[0].dims.length-2;o=new Array(a).fill(1)}let r=e.strides.slice();if(r.reduce((a,c)=>a+c,0)===0){let a=t[0].dims.length-2;r=new Array(a).fill(1)}rm(d,n,o,e.autoPad,e.group,u,r,s,p,l);let i=Object.assign({},e);return Object.assign(i,{kernelShape:n,pads:u,outputPadding:p,outputShape:l,dilations:o,strides:r}),i},ow=e=>{let t=Hu(e),n=e.format,s=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],u=e.dilations,l=e.group??1,p=e.kernelShape,d=e.pads,o=e.strides,r=e.wIsConst(),i=e.outputPadding,a=e.outputShape;return{autoPad:s,format:n,dilations:u,group:l,kernelShape:p,outputPadding:i,outputShape:a,pads:d,strides:o,wIsConst:r,...t,cacheKey:`${e.format};${t.activation};`}},nm=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],s=e[1].dims[0];if(n!==s)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let u=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==u))throw new Error("invalid bias");let l=e[0].dims.length-2;if(t.dilations.reduce((p,d)=>p+d,0)>0&&t.dilations.length!==l)throw new Error(`dilations should be ${l}D`);if(t.strides.reduce((p,d)=>p+d,0)>0&&t.strides.length!==l)throw new Error(`strides should be ${l}D`);if(t.pads.reduce((p,d)=>p+d,0)>0&&t.pads.length!==l*2)throw new Error(`pads should be ${l*2}D`);if(t.outputPadding.length!==l&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${l}D`);if(t.kernelShape.reduce((p,d)=>p+d,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Ba=(e,t,n,s)=>{let u=e.kernelCustomData.wT??e.compute(ft(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=u);let l=[t[0],u];t.length===3&&l.push(t[2]),e.compute(iw(l,n,s),{inputs:l})},im=(e,t)=>{let n=t.format==="NHWC",s=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&s.push(e.inputs[2]);let u=t.kernelShape;(u.length===0||u[0]===0)&&(u=[e.inputs[1].dims[2]]);let l=t.dilations;(l.length===0||l[0]===0)&&(l=[1]);let p=t.strides;(p.length===0||p[0]===0)&&(p=[1]);let d=t.pads;d.length===0&&(d=[0,0]),d=[0,d[0],0,d[1]],p=[1].concat(p),l=[1].concat(l),u=[1].concat(u);let o=t.outputPadding;o=[0].concat(o);let r=Ra({...t,pads:d,strides:p,dilations:l,kernelShape:u,outputPadding:o},s);Ba(e,s,r,i=>n?[i[0],i[2],i[3]]:[i[0],i[1],i[3]])},aw=(e,t)=>{if(nm(e.inputs,t),e.inputs[0].dims.length===3)im(e,t);else{let n=Ra(t,e.inputs);Ba(e,e.inputs,n)}}}),om,sw,uw,VI=k(()=>{"use strict";oe(),se(),Fe(),ue(),om=(e,t,n,s)=>{let u=R.size(t),l=t.length,p=L("input",e,l),d=te("output",e,l),o=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),r=R.normalizeAxis(o,l),i=a=>{let c=` i32(${p.indicesGet("inputIndices","uniforms.axis")}) `,h=re("uniforms.input_shape","uniforms.axis",l),m=s.reverse?c+(s.exclusive?" + 1":""):"0",b=s.reverse?h:c+(s.exclusive?"":" + 1");return`
                ${a.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(p,d)}
                ${a.mainStart()}
                  ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${d.offsetToIndices("global_idx")};
                  var sum = ${d.type.value}(0);
                  let first : i32 = ${m};
                  let last : i32 = ${b};
                  for (var i : i32 = first; i < last; i++) {
                    ${p.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${p.getByIndices("inputIndices")};
                  }
                  ${d.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:s.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:[{type:12,data:u},{type:12,data:r},...ie(t,t)]}),getShaderSource:i}},sw=(e,t)=>{let n=e.inputs[0].dims,s=e.inputs[0].dataType,u=e.inputs[1];e.compute(om(s,n,u,t),{inputs:[0]})},uw=e=>{let t=e.exclusive===1,n=e.reverse===1;return Ie({exclusive:t,reverse:n})}}),am,sm,um,lw,dw,UI=k(()=>{"use strict";oe(),se(),Fe(),ue(),am=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},sm=(e,t,n,s)=>{let u=[];u.push(`fn perm(i: ${s.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let l=0;l<t;++l)u.push(n.indicesSet("a",e[l],`i[${l}]`));return u.push("return a;}"),u.join(`
`)},um=(e,t)=>{let n,s,u,l,p,d,o=t.format==="NHWC",r=t.blocksize,i=t.mode==="DCR";o?([n,s,u,l]=e.dims,p=i?[n,s,u,r,r,l/r**2]:[n,s,u,l/r**2,r,r],d=i?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,s,u,l]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],p=i?[n,r,r,l/r**2,s,u]:[n,l/r**2,r,r,s,u],d=i?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let a=e.reshape(p),c=a.dims.length,h=e.dataType,m=L("a",h,c),b=te("output",h,c),x=w=>`
  ${w.registerUniform("output_size","u32").declareVariables(m,b)}

  ${sm(d,c,m,b)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${b.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${b.setByOffset("global_idx",m.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:w=>{let _=o?[n,s*r,u*r,l/r**2]:[n,l/r**2,s*r,u*r],I=R.size(_),E=a.dims,O=R.sortBasedOnPerm(E,d);return{outputs:[{dims:_,dataType:w[0].dataType}],dispatchGroup:{x:Math.ceil(I/64)},programUniforms:[{type:12,data:I},...ie(E,O)]}},getShaderSource:x}},lw=(e,t)=>{am(e.inputs),e.compute(um(e.inputs[0],t))},dw=e=>Ie({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Wt,zn,Ni,Ma,nr,lm,dm,pm,ja,Fa,La,cm,hm,Va,fm,pw,cw,qI=k(()=>{"use strict";oe(),se(),Fe(),ue(),Wt=256,zn=512,Ni=2*Math.PI,Ma=e=>{let t=[],n=e;for(let s of[4,2,3,5])for(;n%s===0;)t.push(s),n/=s;return n===1?t:void 0},nr=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},lm=(e,t,n,s,u)=>{let l=n/e,p=zn-s,d=r=>`smem[${p}u + base + ${r*t}u]`,o=`  for (var t = local_idx; t < ${l}u; t += ${Wt}u) {
`;o+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,o+=`    var leg: array<vec2<f32>, 5>;
`;for(let r=0;r<e;r++){let i=`${s}u + t + ${r*l}u`;if(r===0)o+=`    leg[0] = smem[${i}];
`;else{let a=u*Ni*r/(e*t);o+=`    { let a = ${nr(a)} * angleUnit; leg[${r}] = cmul(smem[${i}], vec2<f32>(cos(a), sin(a))); }
`}}if(o+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)o+=`    ${d(0)} = leg[0] + leg[1];
    ${d(1)} = leg[0] - leg[1];
`;else if(e===4){let r=u<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";o+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,o+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,o+=`    let oddRot = ${r};
`,o+=`    ${d(0)} = evenSum + oddSum;
    ${d(1)} = evenDiff + oddRot;
`,o+=`    ${d(2)} = evenSum - oddSum;
    ${d(3)} = evenDiff - oddRot;
`}else for(let r=0;r<e;r++){let i=["leg[0]"];for(let a=1;a<e;a++){let c=u*Ni*(a*r)/e,h=nr(Math.cos(c)),m=nr(Math.sin(c));i.push(`vec2<f32>(leg[${a}].x*${h} - leg[${a}].y*${m}, leg[${a}].x*${m} + leg[${a}].y*${h})`)}o+=`    ${d(r)} = ${i.join(" + ")};
`}return`${o}  }
  workgroupBarrier();
`},dm=(e,t,n)=>{let s="",u=1,l=0;for(let p of e)s+=lm(p,u,t,l,n),u*=p,l=zn-l;return{code:s,resultOffset:l}},pm=(e,t,n,s,u)=>{let l=e.dims,p=l.length,d=l[p-1],o=l[t],r=n&&s?(o-1)*2:o;u!==void 0&&(r=u);let i=n&&s?1:2,a=s&&!n?Math.floor(r/2)+1:r,c=l.slice();c[t]=a,c[p-1]=i;let h=1;for(let b=t+1;b<p-1;b++)h*=l[b];let m=R.size(l)/d/o;return{dataType:e.dataType,outputDims:c,length:r,signalLength:o,inner:h,batch:m,inputComponents:d,outputComponents:i,outputLength:a,inverse:n,onesided:s}},ja=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Fa=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],La=(e,t,n)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,n),cm=e=>{let{dataType:t,length:n,inputComponents:s,outputComponents:u,inverse:l,onesided:p}=e,d=We(t),o=l?1:-1,r=l?1/n:1,i=Ma(n),a=c=>{let h=L("x",t,[1]),m=te("y",t,[1]),b=O=>{let A=`inBase + (${O}) * uniforms.inner * ${s}u`,D=`f32(${h.getByOffset(A)})`,S=s===2?`f32(${h.getByOffset(`${A} + 1u`)})`:"0.0";return`vec2<f32>(${D}, ${S})`},x;if(l&&p){let O=Math.floor(n/2)+1,A=n%2===0?`select(provided, provided - 1u, provided == ${O}u)`:"provided";x=`
    let provided = min(uniforms.signalLength, ${O}u);
    for (var i = local_idx; i < ${n}u; i += ${Wt}u) {
      if (i < provided) { smem[i] = ${b("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${A}; k += ${Wt}u) {
      let h = smem[k];
      smem[${n}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else x=`
    let loadCount = min(uniforms.signalLength, ${n}u);
    for (var i = local_idx; i < ${n}u; i += ${Wt}u) {
      if (i < loadCount) { smem[i] = ${b("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:w,resultOffset:_}=dm(i,n,o),I=r===1?`smem[${_}u + i]`:`smem[${_}u + i] * ${nr(r)}`,E=u===2?m.setByOffset("off + 1u",`${d}(v.y)`):"";return`
  ${La(c,h,m)}
  var<workgroup> smem: array<vec2<f32>, ${2*zn}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${c.mainStart(Wt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${s}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${u}u;
    ${x}
${w}    for (var i = local_idx; i < uniforms.outputLength; i += ${Wt}u) {
      let v = ${I};
      let off = outBase + i * uniforms.inner * ${u}u;
      ${m.setByOffset("off",`${d}(v.x)`)}
      ${E}
    }
  }`};return{name:"DFT",shaderCache:{hint:ja(e,"fft"),inputDependencies:["type"]},getShaderSource:a,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Fa(e),dispatchGroup:{x:e.batch}})}},hm=e=>{let{dataType:t,length:n,inputComponents:s,outputComponents:u,inverse:l,onesided:p}=e,d=We(t),o=l?1:-1,r=l?1/n:1,i=a=>{let c=L("x",t,[1]),h=te("y",t,[1]),m=I=>{let E=`inBase + (${I}) * uniforms.inner * ${s}u`,O=`f32(${c.getByOffset(E)})`,A=s===2?`f32(${c.getByOffset(`${E} + 1u`)})`:"0.0";return`vec2<f32>(${O}, ${A})`},b=l&&p?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(n/2)+1}u);
    if (k < provided) { return ${m("k")}; }
    let m = ${n}u - k;
    if (m < provided) {
      let h = ${m("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${m("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,x=`
      let angle = ${nr(o*Ni)} * f32(knMod) / ${nr(n)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${n}u) { knMod -= ${n}u; }`,w=u===2?h.setByOffset("off + 1u",`${d}(v.y)`):"",_=r===1?"acc":`acc * ${nr(r)}`;return`
  ${La(a,c,h)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${b}
  ${a.mainStart(Wt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${s}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${u}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${Wt}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${n}u; n++) {${x}
      }
      let v = ${_};
      let off = outBase + k * uniforms.inner * ${u}u;
      ${h.setByOffset("off",`${d}(v.x)`)}
      ${w}
    }
  }`};return{name:"DFT",shaderCache:{hint:ja(e,"direct"),inputDependencies:["type"]},getShaderSource:i,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Fa(e),dispatchGroup:{x:e.batch}})}},Va=e=>{if(!e||e.dataType===0)return;if(R.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},fm=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let n=t[t.length-1];if(n!==1&&n!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},pw=(e,t)=>{fm(e.inputs);let n=e.inputs[0],s=n.dims.length,u=t.inverse!==0,l=t.onesided!==0,p=Va(e.inputs[1]);if(p!==void 0&&p<=0)throw new Error("dft_length must be greater than zero.");let d=R.normalizeAxis(Va(e.inputs[2])??t.axis,s);if(d===s-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(u&&l&&n.dims[s-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let o=pm(n,d,u,l,p);if(o.length<=0)throw new Error(`Invalid DFT length: ${o.length}`);let r=o.length<=zn&&Ma(o.length)!==void 0?cm(o):hm(o);e.compute(r,{inputs:[0]})},cw=e=>Ie({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),zi,Rn,Ua,mm,gm,bm,ym,qa,_m,hw,fw,GI=k(()=>{"use strict";oe(),se(),Fe(),ue(),zi="[a-zA-Z]|\\.\\.\\.",Rn="("+zi+")+",Ua="^"+Rn+"$",mm="("+Rn+",)*"+Rn,gm="^"+mm+"$",bm=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},ym=class{constructor(e,t){var u;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,s]=t.includes("->")?t.split("->",2):[t,""];if(!n.match(RegExp(gm)))throw new Error("Invalid LHS term");if(n.split(",").forEach((l,p)=>{let d=e[p].dims.slice();if(!l.match(RegExp(Ua)))throw new Error("Invalid LHS term");let o=this.processTerm(l,!0,d,p);this.lhs.push(o)}),s==="")s+=[...this.symbolToInfo.entries()].filter(([l,p])=>p.count===1||l==="...").map(([l])=>l).join("");else if(!s.match(RegExp(Rn)))throw new Error("Invalid RHS");(u=s.match(RegExp(zi,"g")))==null||u.forEach(l=>{if(l==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let p=this.symbolToInfo.get(l);if(p===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(p.dimValue)}}),this.rhs=this.processTerm(s,!1,this.outputDims)}addSymbol(e,t,n){let s=this.symbolToInfo.get(e);if(s!==void 0){if(s.dimValue!==t&&s.count!==1)throw new Error("Dimension mismatch");s.count++,s.inputIndices.push(n)}else s={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,s)}processTerm(e,t,n,s=-1){let u=n.length,l=!1,p=[],d=0;if(!e.match(RegExp(Ua))&&!t&&e!=="")throw new Error("Invalid LHS term");let o=e.match(RegExp(zi,"g")),r=new bm(s);return o==null||o.forEach((i,a)=>{if(i==="..."){if(l)throw new Error("Only one ellipsis is allowed per input term");l=!0;let c=u-o.length+1;if(c<0)throw new Error("Ellipsis out of bounds");if(p=n.slice(d,d+c),this.hasEllipsis){if(this.ellipsisDims.length!==p.length||this.ellipsisDims.toString()!==p.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=p;else throw new Error("Ellipsis must be specified in the LHS");for(let h=0;h<p.length;h++){let m=String.fromCharCode(48+h);r.addSymbol(m,a+h),this.addSymbol(m,n[d++],s)}}else r.addSymbol(i,a+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(i,n[d++],s)}),r}},qa=e=>e+"_max",_m=(e,t,n,s)=>{let u=e.map(r=>r.length).map((r,i)=>L(`input${i}`,t,r)),l=R.size(s),p=te("output",t,s.length),d=[...n.symbolToInfo.keys()].filter(r=>!n.rhs.symbolToIndices.has(r)),o=r=>{let i=[],a="var prod = 1.0;",c="var sum = 0.0;",h="sum += prod;",m=[],b=[],x=[],w=[],_=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((E,O)=>{var A;if(n.rhs.symbolToIndices.has(O)){let D=(A=n.rhs.symbolToIndices.get(O))==null?void 0:A[0];D!==void 0&&n.lhs.forEach((S,F)=>{if(E.inputIndices.includes(F)){let U=S.symbolToIndices.get(O);if(U===void 0)throw new Error("Invalid symbol error");U.forEach(Q=>{i.push(`${u[F].indicesSet(`input${F}Indices`,Q,p.indicesGet("outputIndices",D))}`)})}})}else n.lhs.forEach((D,S)=>{if(E.inputIndices.includes(S)){let F=D.symbolToIndices.get(O);if(F===void 0)throw new Error("Invalid symbol error");F.forEach(U=>{m.push(`${u[S].indicesSet(`input${S}Indices`,U,`${O}`)}`)}),w.push(`prod *= ${u[S].getByIndices(`input${S}Indices`)};`)}}),b.push(`for(var ${O}: u32 = 0; ${O} < uniforms.${qa(O)}; ${O}++) {`),x.push("}")});let I=_?[...i,`let sum = ${u.map((E,O)=>E.getByIndices(`input${O}Indices`)).join(" * ")};`]:[...i,c,...b,...m,a,...w,h,...x];return`
            ${r.registerUniforms(d.map(E=>({name:`${qa(E)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...u,p)}

            ${r.mainStart()}
            ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${p.offsetToIndices("global_idx")};
            ${u.map((E,O)=>`var input${O}Indices: ${u[O].type.indices};`).join(`
`)}
            ${I.join(`
`)};
            ${p.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let r=d.filter(a=>n.symbolToInfo.has(a)).map(a=>{var c;return{type:12,data:((c=n.symbolToInfo.get(a))==null?void 0:c.dimValue)||0}});r.push({type:12,data:l});let i=e.map((a,c)=>[...ie(a)]).reduce((a,c)=>a.concat(c),r);return i.push(...ie(s)),{outputs:[{dims:s,dataType:t}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:i}},getShaderSource:o}},hw=(e,t)=>{let n=new ym(e.inputs,t.equation),s=n.outputDims,u=e.inputs.map((l,p)=>l.dims);e.compute(_m(u,e.inputs[0].dataType,n,s))},fw=e=>{let t=e.equation.replace(/\s+/g,"");return Ie({equation:t})}}),vm,Ga,wm,xm,mw,HI=k(()=>{"use strict";oe(),se(),ue(),vm=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),s=n.length<t.length?0:n.length-t.length,u=t.length<n.length?0:t.length-n.length;for(;s<n.length&&u<t.length;++s,++u)if(n[s]!==t[u]&&n[s]!==1&&t[u]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Ga=(e,t)=>{let n=e.length-t.length,s=[];for(let u=0;u<n;++u)s.push(e[u]);for(let u=0;u<t.length;++u)s.push(t[u]===1?e[u+n]:t[u]);return s},wm=(e,t)=>e.length>t.length?Ga(e,t):Ga(t,e),xm=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),s=wm(t,n),u=e[0].dataType,l=u===9||R.size(t)===1,p=u===9||t.length>0&&t[t.length-1]%4===0?4:1,d=l||s.length>0&&s[s.length-1]%4===0?4:1,o=Math.ceil(R.size(s)/d),r=a=>{let c=L("input",u,t.length,p),h=te("output",u,s.length,d),m;if(u===9){let b=(x,w,_="")=>`
          let outputIndices${w} = ${h.offsetToIndices(`outputOffset + ${w}u`)};
          let offset${w} = ${c.broadcastedIndicesToOffset(`outputIndices${w}`,h)};
          let index${w} = offset${w} / 4u;
          let component${w} = offset${w} % 4u;
          ${x}[${w}] = ${_}(${c.getByOffset(`index${w}`)}[component${w}]);
        `;m=`
        let outputOffset = global_idx * ${d};
        var data = vec4<u32>(0);
        ${b("data",0,"u32")}
        ${b("data",1,"u32")}
        ${b("data",2,"u32")}
        ${b("data",3,"u32")}
        ${h.setByOffset("global_idx","data")}
      }`}else m=`
        let outputIndices = ${h.offsetToIndices(`global_idx * ${d}`)};
        let inputOffset = ${c.broadcastedIndicesToOffset("outputIndices",h)};
        let data = ${h.type.value}(${c.getByOffset(`inputOffset / ${p}`)});
        ${h.setByOffset("global_idx","data")}
      }`;return`
    ${a.registerUniform("vec_size","u32").declareVariables(c,h)}
    ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${m}`},i=[{type:12,data:o},...ie(t,s)];return{name:"Expand",shaderCache:{hint:`${s.length};${p}${d}`,inputDependencies:["rank"]},getShaderSource:r,getRunData:()=>({outputs:[{dims:s,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:i})}},mw=e=>{vm(e.inputs),e.compute(xm(e.inputs),{inputs:[0]})}}),$m,gw,WI=k(()=>{"use strict";oe(),se(),ue(),Gu(),$m=e=>{let t=e[0].dataType,n=R.size(e[0].dims),s=R.size(e[1].dims),u=s%4===0,l=p=>{let d=L("x",t,[1],4),o=L("bias",t,[1],4),r=te("y",t,[1],4),i=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],a=h=>`
      let bias${h}_offset: u32 = (global_idx * 4 + ${h}) % uniforms.bias_size;
      let bias${h} = ${o.getByOffset(`bias${h}_offset / 4`)}[bias${h}_offset % 4];`,c=u?`
      let bias = ${o.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${a(0)}${a(1)}${a(2)}${a(3)}
      let bias = ${d.type.value}(bias0, bias1, bias2, bias3);`;return`${p.registerUniforms(i).declareVariables(d,o,r)}

    ${uu(We(t))}

    ${p.mainStart(bn)}
      ${p.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${d.getByOffset("global_idx")};
      ${c}
      let x_in = x + bias;
      ${r.setByOffset("global_idx",lu("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${u}`,inputDependencies:["type","type"]},getShaderSource:l,getRunData:p=>({outputs:[{dims:p[0].dims,dataType:p[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:s}],dispatchGroup:{x:Math.ceil(n/bn/4)}})}},gw=e=>{e.inputs.length<2||R.size(e.inputs[1].dims)===0?N1(e):e.compute($m(e.inputs))}}),Tm,Sm,bw,yw,KI=k(()=>{"use strict";oe(),se(),Fe(),ue(),Tm=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Sm=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n.length,l=R.normalizeAxis(t.axis,u),p=n.slice(0);p.splice(l,1,...s);let d=n[l],o=e[0].dataType===9?4:1,r=Math.ceil(R.size(p)/o),i=[{type:12,data:r},{type:6,data:d},{type:12,data:l},...ie(e[0].dims,e[1].dims,p)],a=c=>{let h=L("data",e[0].dataType,e[0].dims.length,o),m=L("inputIndices",e[1].dataType,e[1].dims.length),b=te("output",e[0].dataType,p.length,o),x=_=>{let I=s.length,E=`var indicesIndices${_}  = ${m.type.indices}(0);`;for(let O=0;O<I;O++)E+=`${I>1?`indicesIndices${_}[${O}]`:`indicesIndices${_}`} = ${p.length>1?`outputIndices${_}[uniforms.axis + ${O}]`:`outputIndices${_}`};`;E+=`
          var idx${_} = ${m.getByIndices(`indicesIndices${_}`)};
          if (idx${_} < 0) {
            idx${_} = idx${_} + uniforms.axisDimLimit;
          }
          var dataIndices${_} : ${h.type.indices};
        `;for(let O=0,A=0;O<u;O++)O===l?(E+=`${u>1?`dataIndices${_}[${O}]`:`dataIndices${_}`} = u32(idx${_});`,A+=I):(E+=`${u>1?`dataIndices${_}[${O}]`:`dataIndices${_}`} = ${p.length>1?`outputIndices${_}[${A}]`:`outputIndices${_}`};`,A++);return E},w;if(e[0].dataType===9){let _=(I,E,O="")=>`
          let outputIndices${E} = ${b.offsetToIndices(`outputOffset + ${E}u`)};
          ${x(E)};
          let offset${E} = ${h.indicesToOffset(`dataIndices${E}`)};
          let index${E} = offset${E} / 4u;
          let component${E} = offset${E} % 4u;
          ${I}[${E}] = ${O}(${h.getByOffset(`index${E}`)}[component${E}]);
        `;w=`
        let outputOffset = global_idx * ${o};
        var value = vec4<u32>(0);
        ${_("value",0,"u32")}
        ${_("value",1,"u32")}
        ${_("value",2,"u32")}
        ${_("value",3,"u32")}
        ${b.setByOffset("global_idx","value")}
      `}else w=`
      let outputIndices = ${b.offsetToIndices("global_idx")};
      ${x("")};
      let value = ${h.getByIndices("dataIndices")};
      ${b.setByOffset("global_idx","value")};
      `;return`
      ${c.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(h,m,b)}
      ${c.mainStart()}
        ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${w}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:p,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:i}),getShaderSource:a}},bw=e=>Ie({axis:e.axis}),yw=(e,t)=>{let n=e.inputs;Tm(n),e.compute(Sm(e.inputs,t))}}),Im,_w,vw,XI=k(()=>{"use strict";oe(),se(),ue(),Im=(e,t,n,s,u,l,p,d,o)=>{let r=[{type:12,data:l},{type:12,data:s},{type:12,data:u},{type:12,data:n},{type:12,data:p},{type:12,data:d},{type:12,data:o}],i=[l];r.push(...ie(t.dims,i));let a=c=>{let h=L("indices_data",t.dataType,t.dims.length),m=te("input_slice_offsets_data",12,1,1),b=[h,m],x=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:u.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${c.registerUniforms(x).declareVariables(...b)}
  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${u.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${n.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${u.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:i,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:r}),getShaderSource:a},{inputs:[t],outputs:[-1]})[0]},_w=(e,t)=>{let n=e.inputs,s=n[0].dims,u=n[0].dataType,l=n[1].dims,p=l[l.length-1],d=R.sizeToDimension(l,l.length-1),o=R.sizeFromDimension(s,t.batchDims+p),r=R.sizeToDimension(s,t.batchDims),i=R.sizeFromDimension(s,t.batchDims),a=d/r,c=new Array(p),h=o;for(let E=0;E<p;++E)c[p-1-E]=h,h*=s[t.batchDims+p-1-E];let m=Im(e,n[1],c,t.batchDims,s,d,a,i,p),b=t.batchDims+p;if(b>s.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let x=l.slice(0,-1).concat(s.slice(b)),w=R.size(x),_=[{type:12,data:w},{type:12,data:o},...ie(n[0].dims,m.dims,x)],I=E=>{let O=L("data",n[0].dataType,n[0].dims.length),A=L("slice_offsets",12,m.dims.length),D=te("output",n[0].dataType,x.length);return`
          ${E.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(O,A,D)}
            ${E.mainStart()}
            ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:u}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:_}),getShaderSource:I},{inputs:[n[0],m]})},vw=e=>({batchDims:e.batch_dims,cacheKey:""})}),Om,Em,ww,xw,ZI=k(()=>{"use strict";oe(),se(),Fe(),ue(),Om=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let n=R.normalizeAxis(t.quantizeAxis,e[0].dims.length),s=t.blockSize,u=e[0],l=e[2],p=e.length===4?e[3]:void 0;if(l.dims.length!==u.dims.length||!u.dims.map((d,o)=>o===n?Math.ceil(d/s)===l.dims[o]:d===l.dims[o]).reduce((d,o)=>d&&o,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(p){if(p.dataType!==u.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(p.dims.length!==l.dims.length||!p.dims.map((d,o)=>d===l.dims[o]).reduce((d,o)=>d&&o,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},Em=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n.length,l=R.normalizeAxis(t.gatherAxis,u),p=R.normalizeAxis(t.quantizeAxis,u),d=n.slice(0);d.splice(l,1,...s);let o=R.size(d),r=e[2].dataType,i=e[0].dataType===22,a=[{type:12,data:o},{type:12,data:p},{type:12,data:l},{type:12,data:t.blockSize},...ie(...e.map((h,m)=>h.dims),d)],c=h=>{let m=L("data",e[0].dataType,e[0].dims.length),b=L("inputIndices",e[1].dataType,e[1].dims.length),x=L("scales",e[2].dataType,e[2].dims.length),w=e.length>3?L("zeroPoint",e[3].dataType,e[3].dims.length):void 0,_=te("output",r,d.length),I=[m,b,x];w&&I.push(w);let E=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${h.registerUniforms(E).declareVariables(...I,_)}
        ${h.mainStart()}
        let output_indices = ${_.offsetToIndices("global_idx")};
        var indices_indices = ${b.type.indices}(0);
        ${s.length>1?`
          for (var i: u32 = 0; i < ${s.length}; i++) {
            let index = ${_.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${b.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${_.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${m.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${_.indicesGet("output_indices","i")};
          ${m.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${b.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${n[l]};
        }
        ${m.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${d.length}; i++) {
          let index = ${_.indicesGet("output_indices",`i + ${s.length} - 1`)};
          ${m.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${m.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${m.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${i?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${x.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${x.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${x.getByIndices("scale_indices")};
        ${w?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${w.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${w.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${i?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${We(r)}(quantized_data - zero_point) * scale;
        ${_.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((h,m)=>m!==1).map(h=>h.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(h,m)=>"rank")},getRunData:()=>({outputs:[{dims:d,dataType:r}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:a}),getShaderSource:c}},ww=(e,t)=>{let n=e.inputs;Om(n,t),e.compute(Em(e.inputs,t))},xw=e=>Ie({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Pm,Am,$w,Tw,JI=k(()=>{"use strict";oe(),se(),Fe(),ue(),Pm=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Am=(e,t)=>{let n=e[0].dims,s=e[0].dataType,u=n.length,l=e[1].dims,p=e[1].dataType,d=R.normalizeAxis(t.axis,u),o=n[d],r=l.slice(0),i=R.size(r),a=L("input",s,u),c=L("indicesInput",p,l.length),h=te("output",s,r.length),m=[{type:12,data:i},{type:6,data:o},{type:12,data:d}];return m.push(...ie(n,l,r)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:r,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:m}),getShaderSource:b=>`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(a,c,h)}
      ${b.mainStart()}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${h.offsetToIndices("global_idx")};

      var idx = ${c.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${a.type.indices}(outputIndices);
      ${a.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${a.getByIndices("inputIndices")};

      ${h.setByOffset("global_idx","value")};
  }`}},$w=e=>Ie({axis:e.axis}),Tw=(e,t)=>{let n=e.inputs;Pm(n),e.compute(Am(e.inputs,t))}}),km,Dm,Sw,Iw,QI=k(()=>{"use strict";oe(),se(),ue(),km=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Dm=(e,t)=>{let n=e[0].dims.slice(),s=e[1].dims.slice(),[u,l,p]=vv.getShapeOfGemmResult(n,t.transA,s,t.transB,e.length===3?e[2].dims:void 0),d=[u,l];if(!d)throw new Error("Can't use gemm on the given tensors");let o=16,r=Math.ceil(l/o),i=Math.ceil(u/o),a=!0,c=R.size(d),h=[{type:12,data:a?r:c},{type:12,data:u},{type:12,data:l},{type:12,data:p},{type:1,data:t.alpha},{type:1,data:t.beta}],m=["type","type"];e.length===3&&(h.push(...ie(e[2].dims)),m.push("rank")),h.push(...ie(d));let b=w=>{let _="";t.transA&&t.transB?_="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?_="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?_="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(_="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let I=t.alpha===1?"":"value *= uniforms.alpha;",E=L("a",e[0].dataType,e[0].dims),O=L("b",e[1].dataType,e[1].dims),A=E.type.value,D=null,S=[E,O];e.length===3&&(D=L("c",e[2].dataType,e[2].dims.length),S.push(D));let F=te("output",e[0].dataType,d.length);S.push(F);let U=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${w.registerUniforms(U).declareVariables(...S)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${A}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${_}
    }

    ${I}
    ${D!=null?`let cOffset = ${D.broadcastedIndicesToOffset("vec2(m, n)",F)}; value += ${A}(uniforms.beta) * ${D.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},x=w=>{let _=L("a",e[0].dataType,e[0].dims),I=L("b",e[1].dataType,e[1].dims),E=null,O=[_,I];e.length===3&&(E=L("c",e[2].dataType,e[2].dims.length),O.push(E));let A=te("output",e[0].dataType,d.length);O.push(A);let D=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],S="",F="";t.transA&&t.transB?(F=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,S="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(F=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,S="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(F=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,S="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(F=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${_.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${I.type.value}(0);
      }
      `,S="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let U=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${w.registerUniforms(D).declareVariables(...O)}
  var<workgroup> tile_a: array<array<${_.type.storage}, ${o}>, ${o}>;
  var<workgroup> tile_b: array<array<${I.type.storage}, ${o}>, ${o}>;
  ${w.mainStart([o,o,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${o};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${o};
    let num_tiles = (uniforms.K - 1) / ${o} + 1;
    var k_start = 0u;
    var value = ${A.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${F}
      k_start = k_start + ${o};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${o}; k++) {
        ${S}
      }
      workgroupBarrier();
    }

    ${U}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${E!=null?`let cOffset = ${E.broadcastedIndicesToOffset("vec2(m, n)",A)}; value += ${A.type.value}(uniforms.beta) * ${E.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return a?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:r*i},programUniforms:h}),getShaderSource:x}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:b}},Sw=e=>{let t=e.transA,n=e.transB,s=e.alpha,u=e.beta;return{transA:t,transB:n,alpha:s,beta:u,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Iw=(e,t)=>{km(e.inputs),e.compute(Dm(e.inputs,t))}}),Mt,Kt,Sr,Ir,Cm,Nm,zm,Rm,Bm,Mm,jm,Fm,Ow,Ew,YI=k(()=>{"use strict";oe(),se(),Fe(),ue(),[Mt,Kt,Sr,Ir]=[0,1,2,3],Cm=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Nm=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,zm=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Rm=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Bm=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,Mm=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${Mt}] = batch;
     indices[${Kt}] = channel;`+(()=>{switch(n.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${Sr}] = u32(r);
            indices[${Ir}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${Sr}] = u32(clamp(r, 0, H - 1));
          indices[${Ir}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${Sr}] = gs_reflect(r, border[1], border[3]);
          indices[${Ir}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,jm=(e,t,n)=>(()=>{switch(n.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${Mt}], indices[${Kt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${Mt}], indices[${Kt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${Mt}], indices[${Kt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${Mt}], indices[${Kt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${Mt}], indices[${Kt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${Mt}], indices[${Kt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Fm=(e,t)=>{let n=L("x",e[0].dataType,e[0].dims.length),s=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],u=L("grid",e[1].dataType,s.length,2),l=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(l=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[Mt,Kt,Sr,Ir]=[0,3,1,2]);let p=te("output",e[0].dataType,l.length),d=n.type.value,o=R.size(l),r=[{type:12,data:o},...ie(e[0].dims,s,l)],i=a=>`
  ${a.registerUniform("output_size","u32").declareVariables(n,u,p)}
  ${Nm}
  ${zm(d)}
  ${Rm(t)}
  ${Bm(t)}
  ${Mm(n,d,t)}

  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${Sr}]);
      let W_in = i32(uniforms.x_shape[${Ir}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${p.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${Mt}], indices[${Sr}], indices[${Ir}]);
      let nxy = ${u.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${jm(p,d,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:a=>{let c=R.size(l);return{outputs:[{dims:l,dataType:a[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:r}},getShaderSource:i}},Ow=(e,t)=>{Cm(e.inputs),e.compute(Fm(e.inputs,t))},Ew=e=>Ie({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),nt,Lm,Pw,Ha,Vm,Xn,Aw,kw=k(()=>{"use strict";oe(),se(),Fe(),Lu(),qu(),ue(),mr(),nt=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,Lm=(e,t)=>{let n=e[0],s=nt(e,1),u=nt(e,2),l=nt(e,3),p=nt(e,4),d=nt(e,5),o=nt(e,6),r=nt(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let i=n.dims[0],a=n.dims[1],c=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],h=a,m=0,b=0,x=Math.floor(c/t.numHeads);if(o&&r&&R.size(o.dims)&&R.size(r.dims)){if(o.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(o.dims[0]!==i||o.dims[1]!==t.numHeads||o.dims[3]!==x)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(r.dims[0]!==i||r.dims[1]!==t.numHeads||r.dims[3]!==x)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(o.dims[2]!==r.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(r.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');m=o.dims[2],b=o.dims[2]}else if(o&&R.size(o.dims)||r&&R.size(r.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let w;if(s&&R.size(s.dims)>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(s.dims.length<3||s.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==s.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(s.dims.length===3){if(s.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');w=2,h=s.dims[1]}else if(s.dims.length===5){if(s.dims[2]!==t.numHeads||s.dims[3]!==2||s.dims[4]!==x)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');w=5,h=s.dims[1]}else{if(s.dims[1]!==t.numHeads||s.dims[3]!==x)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');w=0,h=s.dims[2]}}else{if(n.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');w=3}if(l&&R.size(l.dims)>0){if(l.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(s&&s.dims.length===5&&s.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let _=m+h,I=0;if(p&&R.size(p.dims)>0){I=8;let D=p.dims;throw D.length===1?D[0]===i?I=1:D[0]===3*i+2&&(I=3):D.length===2&&D[0]===i&&D[1]===_&&(I=5),I===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let E=!1,O=c;if(u&&R.size(u.dims)>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(h!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');O=u.dims[2]}else{if(h!==u.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');O=u.dims[1]*u.dims[3],E=!0}}let A=!1;if(p&&R.size(p.dims)>0)throw new Error("Key padding mask is not supported");if(d&&R.size(d.dims)>0){if(d.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(d.dims[0]!==i||d.dims[1]!==t.numHeads||d.dims[2]!==a||d.dims[3]!==_)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:i,sequenceLength:a,pastSequenceLength:m,kvSequenceLength:h,totalSequenceLength:_,maxSequenceLength:b,inputHiddenSize:0,hiddenSize:c,vHiddenSize:O,headSize:x,vHeadSize:Math.floor(O/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:I,scale:t.scale,broadcastResPosBias:A,passPastInKv:E,qkvFormat:w}},Pw=e=>Ie({...e}),Ha=Ie({perm:[0,2,1,3]}),Vm=(e,t,n,s,u,l,p)=>{let d=[s,u,l],o=R.size(d),r=[{type:12,data:o},{type:12,data:p},{type:12,data:l}],i=a=>{let c=te("qkv_with_bias",t.dataType,d),h=L("qkv",t.dataType,d),m=L("bias",n.dataType,d),b=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${a.registerUniforms(b).declareVariables(h,m,c)}
  ${a.mainStart()}
    ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:d,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:r}),getShaderSource:i},{inputs:[t,n],outputs:[-1]})[0]},Xn=(e,t,n,s,u,l,p,d)=>{let o=l;if(p&&R.size(p.dims)>0){if(s===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return o=Vm(e,l,p,t,s,n*u,d),o=o.reshape([t,s,n,u]),n===1||s===1?o:e.compute(ft(o,Ha.perm),{inputs:[o],outputs:[-1]})[0]}else return l.dims.length===3&&(o=l.reshape([t,s,n,u])),n===1||s===1?o:e.compute(ft(o,Ha.perm),{inputs:[o],outputs:[-1]})[0]},Aw=(e,t)=>{let n=Lm(e.inputs,t),s=e.inputs[0],u=nt(e.inputs,1),l=nt(e.inputs,2),p=nt(e.inputs,3),d=nt(e.inputs,4),o=nt(e.inputs,5),r=nt(e.inputs,6),i=nt(e.inputs,7);if(s.dims.length===5)throw new Error("Packed QKV is not implemented");if((u==null?void 0:u.dims.length)===5)throw new Error("Packed KV is not implemented");let a=u&&l&&u.dims.length===4&&l.dims.length===4,c=Xn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,s,p,0);if(a)return ii(e,c,u,l,d,void 0,r,i,o,n);if(!u||!l)throw new Error("key and value must be provided");let h=Xn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,u,p,n.hiddenSize),m=Xn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,l,p,2*n.hiddenSize);ii(e,c,h,m,d,void 0,r,i,o,n)}}),Um,qm,Gm,Hm,fu,Dw,Cw,Nw=k(()=>{"use strict";oe(),se(),Fe(),ue(),Um=e=>{if(!e||e.length<1)throw new Error("too few inputs")},qm=(e,t)=>{let n=[],s=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(u=>n.push(Number(u))),s=n.length),Ie({numOutputs:s,axis:t.axis,splitSizes:n})},Gm=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${re("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Hm=e=>{let t=e.length,n=[];for(let s=0;s<t;++s){let u=e[s].setByIndices("indices","input[global_idx]");t===1?n.push(u):s===0?n.push(`if (output_number == ${s}u) { ${u} }`):s===t-1?n.push(`else { ${u} }`):n.push(`else if (output_number == ${s}) { ${u} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},fu=(e,t)=>{let n=e[0].dims,s=R.size(n),u=e[0].dataType,l=R.normalizeAxis(t.axis,n.length),p=new Array(t.numOutputs),d=L("input",u,n.length),o=new Array(t.numOutputs),r=[],i=[],a=0,c=[{type:12,data:s}];for(let m=0;m<t.numOutputs;m++){a+=t.splitSizes[m],o[m]=a;let b=n.slice();b[l]=t.splitSizes[m],i.push(b),p[m]=te(`output${m}`,u,b.length),r.push({dims:i[m],dataType:e[0].dataType})}c.push({type:12,data:o},...ie(n,...i));let h=m=>`
  ${m.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",o.length).declareVariables(d,...p)}
  ${Gm(o.length)}
  ${Hm(p)}

  ${m.mainStart()}
    ${m.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${d.offsetToIndices("global_idx")};
    var index = ${d.indicesGet("indices",l)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${re("uniforms.size_in_split_axis","output_number - 1u",o.length)};
      ${d.indicesSet("indices",l,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:h,getRunData:()=>({outputs:r,dispatchGroup:{x:Math.ceil(s/64)},programUniforms:c})}},Dw=(e,t)=>{Um(e.inputs);let n=e.inputs.length===1?t:qm(e.inputs,t);e.compute(fu(e.inputs,n),{inputs:[0]})},Cw=e=>{let t=e.axis,n=e.splitSizes,s=e.numOutputs<0?n.length:e.numOutputs;if(s!==n.length)throw new Error("numOutputs and splitSizes length must be equal");return Ie({axis:t,numOutputs:s,splitSizes:n})}}),Wm,Qi,zw,Rw=k(()=>{"use strict";oe(),se(),Fe(),ue(),Wm=(e,t)=>{let[n,s,u,l]=e,{numHeads:p,rotaryEmbeddingDim:d}=t;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!R.areEqual(s.dims,[])&&!R.areEqual(s.dims,[1])&&s.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${s.dims.length}`);if(u.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${u.dims.length}`);if(l.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${l.dims.length}`);if(!R.areEqual(u.dims,l.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(d>0&&p===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let o=n.dims[0],r=n.dims[n.dims.length-2],i=u.dims[0],a=R.sizeFromDimension(n.dims,1)/r,c=d===0?u.dims[1]*2:a/p;if(d>c)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(s.dims.length===2){if(o!==s.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${s.dims[0]}`);if(r!==s.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${s.dims[1]}`)}if(r>i)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(c/2!==u.dims[1]&&d/2!==u.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${u.dims[1]}`)},Qi=(e,t)=>{let{interleaved:n,numHeads:s,rotaryEmbeddingDim:u,scale:l}=t,p=e[0].dims[0],d=R.sizeFromDimension(e[0].dims,1),o=e[0].dims[e[0].dims.length-2],r=d/o,i=e[2].dims[1],a=u===0?i*2:r/s,c=new Array(p,o,r/a,a-i),h=R.computeStrides(c),m=[{type:1,data:l},{type:12,data:c},{type:12,data:h},...e[0].dims.length===3?new Array({type:12,data:[d,r,a,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[d,a,o*a,1]}):[],...ie(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],b=x=>{let w=L("input",e[0].dataType,e[0].dims.length),_=L("position_ids",e[1].dataType,e[1].dims.length),I=L("cos_cache",e[2].dataType,e[2].dims.length),E=L("sin_cache",e[3].dataType,e[3].dims.length),O=te("output",e[0].dataType,e[0].dims.length);return x.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:c.length},{name:"global_strides",type:"u32",length:h.length},{name:"input_output_strides",type:"u32",length:h.length}]),`
        ${x.declareVariables(w,_,I,E,O)}

        ${x.mainStart(bn)}
          let half_rotary_emb_dim = uniforms.${I.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${x.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${_.broadcastedIndicesToOffset("bsnh.xy",te("",_.type.tensor,2))};
            let position_id =
                u32(${_.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${w.getByOffset("i")} * ${I.get("position_id","bsnh[3]")} -
                ${w.getByOffset("j")} * ${E.get("position_id","bsnh[3]")};
            ${O.setByOffset("i","re")}
            let im = ${w.getByOffset("i")} * ${E.get("position_id","bsnh[3]")} +
                ${w.getByOffset("j")} * ${I.get("position_id","bsnh[3]")};
            ${O.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${O.setByOffset("k",w.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:Ie({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:b,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(c)/bn)},programUniforms:m})}},zw=(e,t)=>{Wm(e.inputs,t),e.compute(Qi(e.inputs,t))}}),Km,Xm,Wa,Zm,Bw,eO=k(()=>{"use strict";Fe(),oe(),qu(),kw(),Nw(),mr(),Rw(),ue(),Km=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let n=e[0],s=e[1],u=e[2],l=e[3],p=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let d=!1,o=n.dims[0],r=n.dims[1],i=n.dims.length===3?d?n.dims[2]/3:n.dims[2]:t.numHeads*n.dims[4],a=r,c=0,h=!s||s.dims.length===0,m=Math.floor(h?i/(t.numHeads+2*t.kvNumHeads):i/t.numHeads);h&&(i=m*t.numHeads);let b=l&&l.dims.length!==0,x=p&&p.dims.length!==0;if(b&&l.dims.length===4&&l.dims[0]===o&&l.dims[1]!==t.kvNumHeads&&l.dims[2]===t.kvNumHeads&&l.dims[3]===m)throw new Error("BSNH pastKey/pastValue is not supported");if(b&&x){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(p.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');c=l.dims[2]}else if(b||x)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let w=1;if(s&&s.dims.length>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(s.dims.length<3||s.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==s.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(s.dims.length===3){if(n.dims[2]%s.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');a=s.dims[1]}else if(s.dims.length===5){if(s.dims[2]!==t.numHeads||s.dims[3]!==2||s.dims[4]!==m)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');a=s.dims[1]}else{if(s.dims[1]!==t.numHeads||s.dims[3]!==m)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');a=s.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');w=3}let _=0,I=!1,E=t.kvNumHeads?m*t.kvNumHeads:i;if(u&&u.dims.length>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(a!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');E=u.dims[2]}else{if(a!==u.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');E=u.dims[1]*u.dims[3],I=!0}}let O=e.length>4?e[5]:void 0;if(O){if(O.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let A=O.dims.reduce((D,S)=>D*S,1);if(A!==o)throw new Error(`seqlens_k must have batch_size (${o}) elements, got ${A}.`);for(let D=0;D<O.dims.length;D++)if(O.dims[D]!==1&&O.dims[D]!==o)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${o}), got dims[${D}] = ${O.dims[D]}.`)}return{batchSize:o,sequenceLength:r,pastSequenceLength:c,kvSequenceLength:a,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:i,vHiddenSize:E,headSize:m,vHeadSize:Math.floor(E/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:_,scale:t.scale,broadcastResPosBias:!1,passPastInKv:I,qkvFormat:w}},Xm=Ie({perm:[0,2,1,3]}),Wa=(e,t,n)=>{let s=t,u=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(s=t.reshape([n.batchSize,n.kvSequenceLength,u,n.headSize]),s=e.compute(ft(s,Xm.perm),{inputs:[s],outputs:[-1]})[0]),s},Zm=(e,t,n,s)=>{let u=7,l=["type","type"],p=[e*t],d=e*t,o=[{type:12,data:d},{type:12,data:t},{type:12,data:e}],r=i=>{let a=L("seq_lens",n.dataType,n.dims),c=L("total_seq_lens",s.dataType,s.dims),h=te("pos_ids",u,p),m=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${i.registerUniforms(m).declareVariables(a,c,h)}
  ${i.mainStart()}
    ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${c.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${a.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${h.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${h.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:p,dataType:u}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:o}),getShaderSource:r}},Bw=(e,t)=>{var E;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let n=Km(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((E=e.inputs[1])==null?void 0:E.dims.length)===5)throw new Error("Packed KV is not implemented");let s=e.inputs[0],u=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,l=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,p=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,d=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,o=e.inputs.length>4?e.inputs[5]:void 0,r=e.inputs.length>5?e.inputs[6]:void 0,i=n.kvNumHeads?n.kvNumHeads:n.numHeads,a=Ie({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,i*n.headSize,i*n.headSize]}),[c,h,m]=!u&&!l?e.compute(fu([s],a),{inputs:[s],outputs:[-1,-1,-1]}):[s,u,l],b,x;if(t.doRotary){let O=e.compute(Zm(n.batchSize,n.sequenceLength,o,r),{inputs:[o,r],outputs:[-1]})[0],A=e.inputs[7],D=e.inputs[8],S=Ie({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),F=[c,O,A,D],U=[-1];b=e.compute(Qi(F,S),{inputs:F,outputs:U})[0],F.splice(0,1,h);let Q=Ie({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});x=e.compute(Qi(F,Q),{inputs:F,outputs:U})[0]}let w=Xn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?b:c,void 0,0),_=Wa(e,t.doRotary?x:h,n),I=Wa(e,m,n);ii(e,w,_,I,void 0,void 0,p,d,void 0,n,o,r)}}),Ka,Jm,Qm,Mw,tO=k(()=>{"use strict";oe(),se(),mr(),ue(),Ka=(e,t,n,s,u,l,p,d)=>{let o=je(l),r=o===1?"f32":`vec${o}f`,i=o===1?"vec2f":`mat2x${o}f`,a=u*p,c=64;a===1&&(c=256);let h=[u,p,l/o],m=[u,p,2],b=["rank","type","type"],x=[];x.push(...ie(h,m));let w=_=>{let I=L("x",t.dataType,3,o),E=L("scale",n.dataType,n.dims),O=L("bias",s.dataType,s.dims),A=te("output",1,3,2),D=[I,E,O,A];return`
  var<workgroup> workgroup_shared : array<${i}, ${c}>;
  const workgroup_size = ${c}u;
  ${_.declareVariables(...D)}
  ${_.mainStart(c)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${r}(0);
    var squared_sum = ${r}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${r}(${I.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${i}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${hr("workgroup_shared[0][0]",o)} / f32(hight * ${o});
      let squared_sum_final = ${hr("workgroup_shared[0][1]",o)} / f32(hight * ${o});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${d}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${o};${d};${c}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:m,dataType:1}],dispatchGroup:{x:a},programUniforms:x}),getShaderSource:w},{inputs:[t,n,s],outputs:[-1]})[0]},Jm=(e,t,n)=>{let s=t[0].dims,u=s,l=2,p=s[0],d=s[1],o=R.sizeFromDimension(s,l),r=je(o),i=R.size(u)/r,a=Ka(e,t[0],t[1],t[2],p,o,d,n.epsilon),c=[p,d,o/r],h=[p,d],m=["type","none"],b=x=>{let w=L("x",t[0].dataType,c.length,r),_=L("scale_shift",1,h.length,2),I=te("output",t[0].dataType,c.length,r),E=[w,_,I];return`
  ${x.registerUniform("output_size","u32").declareVariables(...E)}
  ${x.mainStart()}
  ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${I.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${_.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${w.getByOffset("global_idx")} * ${I.type.value}(scale_shift.x) + ${I.type.value}(scale_shift.y);
      ${I.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${r}`,inputDependencies:m},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(i/64)},programUniforms:[{type:12,data:i},...ie(c,h,c)]}),getShaderSource:b},{inputs:[t[0],a]})},Qm=(e,t,n)=>{let s=t[0].dims,u=s,l=s[0],p=s[s.length-1],d=R.sizeFromDimension(s,1)/p,o=je(p),r=R.size(u)/o,i=[{type:12,data:d},{type:12,data:Math.floor(p/o)}],a=["type","type"],c=!1,h=[0,s.length-1];for(let w=0;w<s.length-2;w++)c=c||s[w+1]!==1,h.push(w+1);c=c&&s[s.length-1]!==1;let m=c?e.compute(ft(e.inputs[0],h),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:s.length},(w,_)=>s[h[_]])),b=Ka(e,m,t[1],t[2],l,d,p,n.epsilon),x=w=>{let _=Ke(t[0].dataType),I=o===1?"vec2f":`mat${o}x2f`,E=D=>{let S=D===0?"x":"y",F=o===1?"f32":`vec${o}f`;switch(o){case 1:return`${_}(${F}(scale.${S}))`;case 2:return`vec2<${_}>(${F}(scale[0].${S}, scale[1].${S}))`;case 4:return`vec4<${_}>(${F}(scale[0].${S}, scale[1].${S}, scale[2].${S}, scale[3].${S}))`;default:throw new Error(`Not supported compoents ${o}`)}},O=L("input",t[0].dataType,t[0].dims,o),A=te("output",t[0].dataType,u,o);return`
  @group(0) @binding(0) var<storage, read> input : array<${O.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${I}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${A.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${w.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${E(0)}, ${E(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${o}`,inputDependencies:a},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(r/64)},programUniforms:i}),getShaderSource:x},{inputs:[t[0],b]})},Mw=(e,t)=>{t.format==="NHWC"?Qm(e,e.inputs,t):Jm(e,e.inputs,t)}}),Ym,eg,jw,rO=k(()=>{"use strict";oe(),se(),ue(),Ym=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},eg=(e,t,n)=>{let s=t.simplified,u=e[0].dims,l=e[1],p=!s&&e[2],d=u,o=R.normalizeAxis(t.axis,u.length),r=R.sizeToDimension(u,o),i=R.sizeFromDimension(u,o),a=R.size(l.dims),c=p?R.size(p.dims):0;if(a!==i||p&&c!==i)throw new Error(`Size of X.shape()[axis:] == ${i}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${a} and bias size of ${c}`);let h=[];for(let O=0;O<u.length;++O)O<o?h.push(u[O]):h.push(1);let m=je(i),b=["type","type"],x=[{type:12,data:r},{type:1,data:i},{type:12,data:Math.floor(i/m)},{type:1,data:t.epsilon}];p&&b.push("type");let w=n>1,_=n>2,I=O=>{let A=Ke(e[0].dataType),D=[L("x",e[0].dataType,e[0].dims,m),L("scale",l.dataType,l.dims,m)];p&&D.push(L("bias",p.dataType,p.dims,m)),D.push(te("output",e[0].dataType,d,m)),w&&D.push(te("mean_data_output",1,h)),_&&D.push(te("inv_std_output",1,h));let S=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${O.registerUniforms(S).declareVariables(...D)}
  ${O.mainStart()}
    ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${ou("f32",m)};
    var mean_square_vector = ${ou("f32",m)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${hn(A,m,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${hr("mean_vector",m)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${hr("mean_square_vector",m)} / uniforms.norm_size ${s?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${hn(A,m,"x[j + offset]")};
      let f32scale = ${hn(A,m,"scale[j]")};
      output[j + offset] = ${D[0].type.value}((f32input ${s?"":"- mean"}) * inv_std_dev * f32scale
        ${p?`+ ${hn(A,m,"bias[j]")}`:""}
      );
    }

    ${w?"mean_data_output[global_idx] = mean":""};
    ${_?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},E=[{dims:d,dataType:e[0].dataType}];return w&&E.push({dims:h,dataType:1}),_&&E.push({dims:h,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${m};${n};${s}`,inputDependencies:b},getRunData:()=>({outputs:E,dispatchGroup:{x:Math.ceil(r/64)},programUniforms:x}),getShaderSource:I}},jw=(e,t)=>{Ym(e.inputs),e.compute(eg(e.inputs,t,e.outputCount))}}),tg,Fw,nO=k(()=>{"use strict";se(),Xu(),Zu(),tg=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Fw=e=>{tg(e.inputs);let t=gn.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let n=t[t.length-1],s=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&s<8)e.compute(Ku(e.inputs,{activation:""},t));else{let u=t[t.length-2],l=R.size(e.inputs[0].dims.slice(0,-2)),p=R.size(e.inputs[1].dims.slice(0,-2));if(l!==1&&u===1&&p===1){let d=e.inputs[0].reshape([1,l,s]),o=e.inputs[1].reshape([1,s,n]),r=[1,l,n],i=[d,o];e.compute(Ji(i,{activation:""},t,r),{inputs:i})}else e.compute(Ji(e.inputs,{activation:""},t))}}}),rg,ng,ig,Lw,Vw,iO=k(()=>{"use strict";oe(),se(),Fe(),ue(),rg=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=e[0],s=n.dims.length;if(n.dims[s-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let u=Math.floor((t.k+t.blockSize-1)/t.blockSize),l=t.blockSize/8*t.bits,p=e[1];if(!R.areEqual(p.dims,[t.n,u,l]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let d=e[2].dims;if(R.size(d)!==t.n*u)throw new Error("scales input size error.");if(e.length===4){let o=e[3].dims,r=t.n*(t.bits===8?u:Math.floor((u*t.bits+7)/8));if(R.size(o)!==r)throw new Error("zeroPoints input size error.")}},ng=(e,t)=>{let n=e[0].dims,s=n.length,u=n[s-2],l=t.k,p=t.n,d=n.slice(0,s-2),o=R.size(d),r=e[1].dims[2]/4,i=e[0].dataType,a=je(t.k),c=je(r),h=je(p),m=d.concat([u,p]),b=u>1&&p/h%2===0?2:1,x=R.size(m)/h/b,w=64,_=[],I=[o,u,l/a],E=R.convertShape(e[1].dims).slice();E.splice(-1,1,r/c),_.push(...ie(I)),_.push(...ie(E)),_.push(...ie(e[2].dims)),e.length===4&&_.push(...ie(R.convertShape(e[3].dims)));let O=[o,u,p/h];_.push(...ie(O));let A=D=>{let S=I.length,F=L("a",e[0].dataType,S,a),U=L("b",12,E.length,c),Q=L("scales",e[2].dataType,e[2].dims.length),H=[F,U,Q],N=e.length===4?L("zero_points",12,e[3].dims.length):void 0;N&&H.push(N);let M=O.length,$=te("output",e[0].dataType,M,h),B=Ke(e[0].dataType),q=(()=>{switch(a){case 1:return`array<${B}, 8>`;case 2:return`mat4x2<${B}>`;case 4:return`mat2x4<${B}>`;default:throw new Error(`${a}-component is not supported.`)}})(),J=Math.floor(32/t.bits),K=Math.floor(J/8),ae=()=>{let Z="";for(let V=0;V<K;V++){let fe=V*t.bits*4,le=fe+t.bits;Z+=`
          // reuse a data (pass ${V})
            var input_offset${V>0?V:""} = ${V===0?F.indicesToOffset(`${F.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${V>0?V:""}: ${q};
            for (var j${V>0?V:""}: u32 = 0; j${V>0?V:""} < ${8/a}; j${V>0?V:""}++) {
              a_data${V>0?V:""}[j${V>0?V:""}] = ${F.getByOffset(`input_offset${V>0?V:""}`)};
              input_offset${V>0?V:""}++;
            }
          `;for(let de=0;de<h*b;de++)Z+=`
            b_value = ${c===1?`b${de}_data`:`b${de}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${V*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${fe}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${le}u) & b_mask);`}
            b_quantized_values = ${q}(${Array.from({length:4},(He,Qe)=>`${B}(b_value_lower[${Qe}]), ${B}(b_value_upper[${Qe}])`).join(", ")});
            b_dequantized_values = ${a===1?`${q}(${Array.from({length:8},(He,Qe)=>`(b_quantized_values[${Qe}] - ${N?`zero_point${de}`:"zero_point"}) * scale${de}`).join(", ")});`:`(b_quantized_values - ${q}(${Array(8).fill(`${N?`zero_point${de}`:"zero_point"}`).join(",")})) * scale${de};`};
            workgroup_shared[local_id.x * ${b} + ${Math.floor(de/h)}]${h>1?`[${de%h}]`:""} += ${Array.from({length:8/a},(He,Qe)=>`${a===1?`a_data${V>0?V:""}[${Qe}] * b_dequantized_values[${Qe}]`:`dot(a_data${V>0?V:""}[${Qe}], b_dequantized_values[${Qe}])`}`).join(" + ")};
          `}return Z},z=()=>{let Z=`
            var col_index = col * ${h};
            ${N?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${B}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let V=0;V<h*b;V++)Z+=`
            let scale${V} = ${Q.getByOffset("col_index * nBlocksPerCol + block")};
            ${N?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${N.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${B}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return Z},X=()=>{let Z=`col_index = col * ${h};`;for(let V=0;V<h*b;V++)Z+=`
            let b${V}_data = ${U.getByIndices(`${U.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return Z+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${q};
            var b_dequantized_values: ${q};`,Z};return`
        var<workgroup> workgroup_shared: array<${$.type.value}, ${b*w}>;
        ${D.declareVariables(...H,$)}
        ${D.mainStart([w,1,1])}
          let output_indices = ${$.offsetToIndices(`(global_idx / ${w}) * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${w}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/a};
            ${z()}
            for (var word: u32 = 0; word < ${r}; word += ${c}) {
              ${X()}
              for (var i: u32 = 0; i < ${c}; i++) {
                ${ae()}
                word_offset += ${J/a};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${b}) {
            var output_value: ${$.type.value} = ${$.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${w}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${b};
            }
            ${$.setByIndices(`${$.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${a};${c};${h};${b};${w}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:m,dataType:i}],dispatchGroup:{x},programUniforms:_}),getShaderSource:A}},ig=(e,t)=>{let n=e[0].dims,s=n.length,u=n[s-2],l=t.k,p=t.n,d=n.slice(0,s-2),o=R.size(d),r=e[1].dims[2]/4,i=e[0].dataType,a=je(t.k),c=je(r),h=d.concat([u,p]),m=128,b=p%8===0?8:p%4===0?4:1,x=m/b,w=Math.floor(32/t.bits),_=x*c*w,I=_/a,E=_/t.blockSize,O=R.size(h)/b,A=[],D=[o,u,l/a],S=R.convertShape(e[1].dims).slice();S.splice(-1,1,r/c),A.push(...ie(D)),A.push(...ie(S)),A.push(...ie(e[2].dims)),e.length===4&&A.push(...ie(R.convertShape(e[3].dims)));let F=[o,u,p];A.push(...ie(F));let U=Q=>{let H=D.length,N=L("a",e[0].dataType,H,a),M=L("b",12,S.length,c),$=L("scales",e[2].dataType,e[2].dims.length),B=[N,M,$],q=e.length===4?L("zero_points",12,e[3].dims.length):void 0;q&&B.push(q);let J=F.length,K=te("output",e[0].dataType,J),ae=Ke(e[0].dataType),z=()=>{switch(a){case 1:return`
          let a_data0 = vec4<${ae}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ae}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ae}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ae}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${a}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${N.type.value}, ${I}>;
        var<workgroup> inter_results: array<array<${K.type.value}, ${x}>, ${b}>;
        ${Q.declareVariables(...B,K)}
        ${Q.mainStart([x,b,1])}
          let output_indices = ${K.offsetToIndices(`workgroup_index * ${b}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${E} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${I};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${I}; a_offset += ${m})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${N.getByIndices(`${N.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${N.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${E} + local_id.x;
            ${q?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ae}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ae}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${$.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${M.getByIndices(`${M.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/a};
            for (var i: u32 = 0; i < ${c}; i++) {
              let b_value = ${c===1?"b_data":"b_data[i]"};
              ${(()=>{let X=Math.floor(w/8),Z="";for(let V=0;V<X;V++){let fe=V*t.bits*4,le=fe+t.bits;Z+=`
              ${z()}
              {${t.bits===2?`
                let half_word = b_value >> ${V*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${fe}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${le}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ae}>(${Array.from({length:4},(de,He)=>`${ae}(b_value_lower[${He}]), ${ae}(b_value_upper[${He}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ae}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(de,He)=>`${`dot(a_data${He}, b_dequantized_values[${He}])`}`).join(" + ")};
              }
              word_offset += ${8/a};`}return Z})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${b}) {
            var output_value: ${K.type.value} = ${K.type.value}(0);
            for (var b = 0u; b < ${x}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${K.setByIndices(`${K.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${a};${c};${x};${b}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:h,dataType:i}],dispatchGroup:{x:O},programUniforms:A}),getShaderSource:U}},Lw=(e,t)=>{rg(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(ig(e.inputs,t)):e.compute(ng(e.inputs,t))},Vw=e=>Ie(e)}),og,ag,sg,ug,lg,dg,pg,cg,Uw,oO=k(()=>{"use strict";oe(),se(),ue(),og=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},ag=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
            k = i32(${e.indicesGet("indices",u)}) - ${re("uniforms.pads",u,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${re("uniforms.x_shape",u,t)})) {
              break;
            }
            offset += k * i32(${re("uniforms.x_strides",u,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${s}
            value = x[offset];
          }
      `},sg=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${re("uniforms.pads",u,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${re("uniforms.x_shape",u,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${re("uniforms.x_shape",u,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${re("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},ug=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${re("uniforms.pads",u,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${re("uniforms.x_shape",u,t)})) {
                  k = i32(${re("uniforms.x_shape",u,t)}) - 1;
                }
                offset += k * i32(${re("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},lg=(e,t,n)=>{let s="";for(let u=t-1;u>=0;--u)s+=`
                k = i32(${e.indicesGet("indices",u)}) - ${re("uniforms.pads",u,n)};
                if (k < 0)  {
                  k += i32(${re("uniforms.x_shape",u,t)}]);
                }
                if (k >= i32(${re("uniforms.x_shape",u,t)})) {
                  k -= i32(${re("uniforms.x_shape",u,t)});
                }
                offset += k * i32(${re("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${s}
              value = x[offset];
          `},dg=(e,t,n)=>{switch(n.mode){case 0:return ag(e,t,n.pads.length);case 1:return sg(e,t,n.pads.length);case 2:return ug(e,t,n.pads.length);case 3:return lg(e,t,n.pads.length);default:throw new Error("Invalid mode")}},pg=(e,t)=>{let n=R.padShape(e[0].dims.slice(),t.pads),s=e[0].dims,u=R.size(n),l=[{type:12,data:u},{type:6,data:t.pads}],p=e.length>=3&&e[2].data;t.mode===0&&l.push({type:p?e[2].dataType:1,data:t.value}),l.push(...ie(e[0].dims,n));let d=["rank"],o=r=>{let i=te("output",e[0].dataType,n.length),a=L("x",e[0].dataType,s.length),c=a.type.value,h=dg(i,s.length,t),m=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&m.push({name:"constant_value",type:p?c:"f32"}),`
            ${r.registerUniforms(m).declareVariables(a,i)}
            ${r.mainStart()}
            ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${i.offsetToIndices("global_idx")};

            var value = ${c}(0);
            ${h}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${p}`,inputDependencies:d},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(R.size(n)/64)},programUniforms:l}),getShaderSource:o}},cg=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),s=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,u=e[0].dims.length,l=new Int32Array(2*u).fill(0);if(e.length>=4){let d=e[3].getBigInt64Array();for(let o=0;o<d.length;o++)l[Number(d[o])]=Number(n[o]),l[Number(d[o])+u]=Number(n[o+d.length])}else n.forEach((d,o)=>l[Number(o)]=Number(d));let p=[];return l.forEach(d=>p.push(d)),{mode:t.mode,value:s,pads:p}}else return t},Uw=(e,t)=>{og(e.inputs);let n=cg(e.inputs,t);e.compute(pg(e.inputs,n),{inputs:[0]})}}),Bn,Xa,Za,Ja,Qa,hg,fg,Ya,es,qw,Gw,ts,Hw,Ww,rs,Kw,Xw,Zw,Jw,aO=k(()=>{"use strict";et(),oe(),se(),ue(),Bn=e=>{if(ye.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Xa=(e,t,n)=>{let s=t.format==="NHWC",u=e.dims.slice();s&&u.splice(1,0,u.pop());let l=Object.hasOwnProperty.call(t,"dilations"),p=t.kernelShape.slice(),d=t.strides.slice(),o=l?t.dilations.slice():[],r=t.pads.slice();Xi.adjustPoolAttributes(n,u,p,d,o,r);let i=Xi.computePoolOutputShape(n,u,d,o,p,r,t.autoPad,t.ceilMode),a=Object.assign({},t);l?Object.assign(a,{kernelShape:p,strides:d,pads:r,dilations:o,cacheKey:t.cacheKey}):Object.assign(a,{kernelShape:p,strides:d,pads:r,cacheKey:t.cacheKey});let c=i.slice();return c.push(c.splice(1,1)[0]),[a,s?c:i]},Za=(e,t)=>{let n=t.format==="NHWC",s=R.size(e),u=R.size(t.kernelShape),l=[{type:12,data:s},{type:12,data:u}],p=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let d=t.kernelShape[t.kernelShape.length-1],o=t.strides[t.strides.length-1],r=t.pads[t.pads.length/2-1],i=t.pads[t.pads.length-1],a=!!(r+i);l.push({type:12,data:d},{type:12,data:o},{type:12,data:r},{type:12,data:i}),p.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let c=!1;if(t.kernelShape.length===2){let h=t.kernelShape[t.kernelShape.length-2],m=t.strides[t.strides.length-2],b=t.pads[t.pads.length/2-2],x=t.pads[t.pads.length-2];c=!!(b+x),l.push({type:12,data:h},{type:12,data:m},{type:12,data:b},{type:12,data:x}),p.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[l,p,!0,a,c]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let d=R.computeStrides(t.kernelShape);l.push({type:12,data:d},{type:12,data:t.pads},{type:12,data:t.strides}),p.push({name:"kernelStrides",type:"u32",length:d.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let o=t.pads.reduce((r,i)=>r+i);return[l,p,!!o,!1,!1]}},Ja=(e,t,n,s,u,l,p,d,o,r,i,a)=>{let c=u.format==="NHWC",h=t.type.value,m=te("output",t.type.tensor,s);if(u.kernelShape.length<=2){let b="",x="",w="",_=n-(c?2:1);if(i?b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${_}] = indices[${_}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${_}] < 0 || xIndices[${_}]
                      >= uniforms.x_shape[${_}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${l}
                }`:b=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${_}] = indices[${_}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${l}
                }`,u.kernelShape.length===2){let I=n-(c?3:2);a?x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${I}] < 0 || xIndices[${I}] >= uniforms.x_shape[${I}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:x=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${I}] = indices[${I}] * uniforms.sh - uniforms.phStart + j;
                `,w=`
              }
            `}return`
            ${e.registerUniforms(o).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var value = ${h}(${d});
              var pad = 0;
              ${x}
              ${b}
              ${w}
              ${p}

              output[global_idx] = value;
            }`}else{if(c)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let b=u.kernelShape.length,x=u.pads.length,w="";return r?w=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${l}
              }`:w=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${l}
            `,`
            ${e.registerUniforms(o).declareVariables(t,m)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${m.offsetToIndices("global_idx")};
              var xIndices = ${m.offsetToIndices("global_idx")};

              var offsets: array<u32, ${b}>;

              var value = ${h}(${d});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${b-1}u; j++) {
                  offsets[j] = offset / ${re("uniforms.kernelStrides","j",b)};
                  offset -= offsets[j] * ${re("uniforms.kernelStrides","j",b)};
                }
                offsets[${b-1}] = offset;

                isPad = false;
                for (var j = ${n-b}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${re("uniforms.strides",`j - ${n-b}u`,b)}
                    + offsets[j - ${n-b}u] - ${re("uniforms.pads","j - 2u",x)};
                  ${w}
              }
              ${p}

              output[global_idx] = value;
            }`}},Qa=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,hg=e=>`${Qa(e)};${e.countIncludePad}`,fg=e=>`${Qa(e)};${e.storageOrder};${e.dilations}`,Ya=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),es=(e,t,n,s)=>{let[u,l]=Xa(t,s,n),p=L("x",t.dataType,t.dims.length),d=p.type.value,o="value += x_val;",r="";u.countIncludePad?r+=`value /= ${d}(uniforms.kernelSize);`:r+=`value /= ${d}(i32(uniforms.kernelSize) - pad);`;let[i,a,c,h,m]=Za(l,u);i.push(...ie(t.dims,l));let b=["rank"];return{name:e,shaderCache:{hint:`${s.cacheKey};${c};${h};${m}`,inputDependencies:b},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(l)/64)},programUniforms:i}),getShaderSource:x=>Ja(x,p,t.dims.length,l.length,u,o,r,0,a,c,h,m)}},qw=e=>{let t=e.count_include_pad!==0,n=Ya(e);if(n.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let s={countIncludePad:t,...n,cacheKey:""};return{...s,cacheKey:hg(s)}},Gw=(e,t)=>{Bn(e.inputs),e.compute(es("AveragePool",e.inputs[0],!1,t))},ts={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Hw=e=>{let t=e.format;return{format:t,...ts,cacheKey:t}},Ww=(e,t)=>{Bn(e.inputs),e.compute(es("GlobalAveragePool",e.inputs[0],!0,t))},rs=(e,t,n,s)=>{let[u,l]=Xa(t,s,n),p=`
      value = max(x_val, value);
    `,d="",o=L("x",t.dataType,t.dims.length),r=["rank"],[i,a,c,h,m]=Za(l,u);return i.push(...ie(t.dims,l)),{name:e,shaderCache:{hint:`${s.cacheKey};${c};${h};${m}`,inputDependencies:r},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(R.size(l)/64)},programUniforms:i}),getShaderSource:b=>Ja(b,o,t.dims.length,l.length,u,p,d,t.dataType===10?-65504:-1e5,a,c,h,m)}},Kw=(e,t)=>{Bn(e.inputs),e.compute(rs("MaxPool",e.inputs[0],!1,t))},Xw=e=>{let t=e.storage_order,n=e.dilations,s=Ya(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(s.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let u={storageOrder:t,dilations:n,...s,cacheKey:""};return{...u,cacheKey:fg(u)}},Zw=e=>{let t=e.format;return{format:t,...ts,cacheKey:t}},Jw=(e,t)=>{Bn(e.inputs),e.compute(rs("GlobalMaxPool",e.inputs[0],!0,t))}}),mg,gg,Qw,Yw,sO=k(()=>{"use strict";oe(),se(),Fe(),ue(),mg=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((n,s)=>n===e[2].dims[s]).reduce((n,s)=>n&&s,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((u,l)=>l===t.axis||u===e[0].dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let n=e[0].dims[t.axis],s=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/s)||t.blockSize>Math.ceil(n/(s-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},gg=(e,t)=>{let n=R.normalizeAxis(t.axis,e[0].dims.length),s=e[0].dataType,u=s===3,l=e[0].dims,p=e[1].dataType,d=R.size(l),o=s===3||s===2,r=o?[Math.ceil(R.size(e[0].dims)/4)]:e[0].dims,i=e[1].dims,a=e.length>2?e[2]:void 0,c=a?o?[Math.ceil(R.size(a.dims)/4)]:a.dims:void 0,h=i.length===0||i.length===1&&i[0]===1,m=h===!1&&i.length===1,b=je(d),x=h&&(!o||b===4),w=x?b:1,_=x&&!o?b:1,I=L("input",o?12:s,r.length,_),E=L("scale",p,i.length),O=a?L("zero_point",o?12:s,c.length):void 0,A=te("output",p,l.length,w),D=[I,E];O&&D.push(O);let S=[r,i];a&&S.push(c);let F=[{type:12,data:d/w},{type:12,data:n},{type:12,data:t.blockSize},...ie(...S,l)],U=Q=>{let H=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${Q.registerUniforms(H).declareVariables(...D,A)}
      ${Q.mainStart()}
          ${Q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${A.offsetToIndices("global_idx")};

          // Set input x
          ${o?`
            let input = ${I.getByOffset("global_idx / 4")};
            let x_vec = ${u?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${w===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${I.getByOffset("global_idx")};`};

          // Set scale input
          ${h?`let scale_value= ${E.getByOffset("0")}`:m?`
            let scale_index = ${A.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${E.getByOffset("scale_index")};`:`
            var scale_indices: ${E.type.indices} = output_indices;
            let index = ${E.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${E.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${E.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${O?h?o?`
                let zero_point_input = ${O.getByOffset("0")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${O.getByOffset("0")}`:m?o?`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${O.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${A.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${O.getByOffset("zero_point_index")};`:o?`
                let zero_point_offset = ${E.indicesToOffset("scale_indices")};
                let zero_point_input = ${O.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${O.getByIndices("scale_indices")};`:`let zero_point_value = ${o?u?"i32":"u32":I.type.value}(0);`};
      // Compute and write output
      ${A.setByOffset("global_idx",`${A.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:O?["rank","rank","rank"]:["rank","rank"]},getShaderSource:U,getRunData:()=>({outputs:[{dims:l,dataType:p}],dispatchGroup:{x:Math.ceil(d/w/64),y:1,z:1},programUniforms:F})}},Qw=(e,t)=>{mg(e.inputs,t),e.compute(gg(e.inputs,t))},Yw=e=>Ie({axis:e.axis,blockSize:e.blockSize})}),bg,yg,e2,uO=k(()=>{"use strict";et(),oe(),ue(),bg=(e,t,n)=>{let s=e===t,u=e<t&&n<0,l=e>t&&n>0;if(s||u||l)throw new Error("Range these inputs' contents are invalid.")},yg=(e,t,n,s)=>{let u=Math.abs(Math.ceil((t-e)/n)),l=[u],p=u,d=[{type:12,data:p},{type:s,data:e},{type:s,data:n},...ie(l)],o=r=>{let i=te("output",s,l.length),a=i.type.value,c=[{name:"outputSize",type:"u32"},{name:"start",type:a},{name:"delta",type:a}];return`
        ${r.registerUniforms(c).declareVariables(i)}
        ${r.mainStart()}
        ${r.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${a}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${s}`},getShaderSource:o,getRunData:()=>({outputs:[{dims:l,dataType:s}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:d})}},e2=e=>{let t=0,n=0,s=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],s=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],s=e.inputs[2].getFloat32Array()[0]),ye.webgpu.validateInputContent&&bg(t,n,s),e.compute(yg(t,n,s,e.inputs[0].dataType),{inputs:[]})}}),_g,vg,t2,r2,lO=k(()=>{"use strict";oe(),se(),Fe(),ue(),_g=(e,t,n,s)=>{if(e!=="none"&&s!=="i32"&&s!=="u32"&&s!=="f32")throw new Error(`Input ${s} is not supported with reduction ${e}.`);let u=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,l=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${n};`;case"add":return s==="i32"||s==="u32"?`atomicAdd(&${t}, bitcast<${s}>(${n}));`:`
              ${u}bitcast<${s}>(oldValue) + (${n})${l}`;case"max":return s==="i32"||s==="u32"?`atomicMax(&${t}, bitcast<${s}>(${n}));`:`
                ${u}max(bitcast<f32>(oldValue), (${n}))${l}`;case"min":return s==="i32"||s==="u32"?`atomicMin(&${t}, bitcast<${s}>(${n}));`:`${u}min(bitcast<${s}>(oldValue), (${n}))${l}`;case"mul":return`${u}(bitcast<${s}>(oldValue) * (${n}))${l}`;default:throw new Error(`Reduction ${e} is not supported.`)}},vg=(e,t)=>{let n=e[0].dims,s=e[1].dims,u=n,l=1,p=Math.ceil(R.sizeToDimension(s,s.length-1)/l),d=s[s.length-1],o=R.sizeFromDimension(n,d),r=[{type:12,data:p},{type:12,data:d},{type:12,data:o},...ie(e[1].dims,e[2].dims,u)],i=a=>{let c=L("indices",e[1].dataType,e[1].dims.length),h=L("updates",e[2].dataType,e[2].dims.length,l),m=t.reduction!=="none"&&t.reduction!==""?Ov("output",e[0].dataType,u.length):te("output",e[0].dataType,u.length,l);return`
      ${a.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(c,h,m)}
      ${a.mainStart()}
        ${a.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${_g(t.reduction,"output[data_offset + i]","value",m.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(p/64)},programUniforms:r}),getShaderSource:i}},t2=e=>Ie({reduction:e.reduction}),r2=(e,t)=>{e.compute(vg(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),wg,xg,$g,ns,Tg,Sg,Ig,Og,Eg,Pg,Ag,kg,is,Dg,Cg,Ng,zg,Rg,n2,i2,dO=k(()=>{"use strict";oe(),se(),Fe(),ue(),wg=(e,t)=>{if(e.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},xg=(e,t,n)=>{t.every(u=>u>=0&&u<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let s=new Array(n).fill(1);return t.forEach((u,l)=>s[u]=e[l]),s},$g=(e,t,n,s,u,l)=>{let[p,d,o]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],r=e[0].dims.length;if(p>0&&e.length>p&&e[p].dims.length>0)e[p].getFloat32Array().forEach(i=>l.push(i));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(d>0&&e.length>d&&e[d].dims.length===1&&e[d].dims[0]>0){if(e[d].getFloat32Array().forEach(i=>s.push(i)),s.length!==0&&s.length!==r&&n>=18&&s.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");wg(s,t),t.axes.length>0&&xg(s,t.axes,r).forEach((i,a)=>s[a]=i)}if(o>0&&e.length>o&&e[o].dims.length===1&&e[o].dims[0]>0&&(e[o].getBigInt64Array().forEach(i=>u.push(Number(i))),u.length!==0&&u.length!==r&&n>=18&&u.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(s.length!==0&&s.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(u.length!==0&&u.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof s<"u"&&typeof u<"u"&&s.length>0&&u.length>r)throw new Error("Resize requires only of scales or sizes to be specified")},ns=(e,t,n,s)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${s}(big / (${n}));
  let fract = ${s}(big % (${n})) / ${s}(${n});
  return whole + fract;
`,Tg=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${ns("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${ns("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",Sg=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",Ig=(e,t,n)=>{let s=new Array(n).fill(0).concat(new Array(n).fill(1)),u=e.length===0?s:e.slice();return t.length>0?(t.forEach((l,p)=>{s[l]=u[p],s[p+n]=u[t.length+p]}),s):u},Og=(e,t,n,s)=>{let u=[];if(n.length>0)if(s.length>0){if(e.forEach(l=>u.push(l)),Math.max(...s)>e.length)throw new Error("axes is out of bound");s.forEach((l,p)=>u[l]=n[p])}else n.forEach(l=>u.push(l));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");u=e.map((l,p)=>Math.round(l*t[p]))}return u},Eg=(e,t,n)=>{let s=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(l=>t[l]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(l=>t[l]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let u=e.slice();return n.axes.length>0?(n.axes.forEach(l=>t[l]=s),n.axes.forEach(l=>u[l]=Math.round(e[l]*t[l]))):(t.fill(s,0,t.length),u.forEach((l,p)=>u[p]=Math.round(l*t[p]))),u},Pg=(e,t,n,s,u)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${re("uniforms.scales","i",s)};
        var roi_low = ${re("uniforms.roi","i",u)};
        var roi_hi = ${re("uniforms.roi",`i + ${t.length}`,u)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${re("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${re("uniforms.output_shape","i",n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Ag=(e,t,n,s,u,l,p)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${s.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${re("uniforms.scales","i",u)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${re("uniforms.roi","i",l)};
          var roi_hi = ${re("uniforms.roi",`i + ${n.length}`,l)};
          var input_shape_i = ${re("uniforms.input_shape","i",n.length)};
          var output_shape_i = ${re("uniforms.output_shape","i",s.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${p} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,kg=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${re("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,is=(e,t,n,s)=>e.rank>s?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",n,"batch")};
`:"",Dg=(e,t,n,s,u)=>{let[l,p,d,o]=n.length===2?[-1,0,1,-1]:[0,2,3,1],r=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${r} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",p,`max(0, min(row, ${n[p]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(col, ${n[d]} - 1))`)};
      ${is(e,o,l,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${r} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${r} = originalIndices[${p}];
      var col:${r} = originalIndices[${d}];
      ${s?`if (row < 0 || row > (${n[p]} - 1) || col < 0 || col > (${n[d]} - 1)) {
        return ${u};
      }`:""};
      row = max(0, min(row, ${n[p]} - 1));
      col = max(0, min(col, ${n[d]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${o}])`:"0"};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${l}])`:"0"};
      var x11: ${r} = getInputValue(batch, channel, row1, col1);
      var x12: ${r} = getInputValue(batch, channel, row1, col2);
      var x21: ${r} = getInputValue(batch, channel, row2, col1);
      var x22: ${r} = getInputValue(batch, channel, row2, col2);
      var dx1: ${r} = abs(row - ${r}(row1));
      var dx2: ${r} = abs(${r}(row2) - row);
      var dy1: ${r} = abs(col - ${r}(col1));
      var dy2: ${r} = abs(${r}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},Cg=(e,t,n,s,u,l,p,d,o,r)=>{let i=n.length===2,a=!0,[c,h]=i?[0,1]:a?[2,3]:[1,2],m=e.type.value,b=x=>{let w=x===c?"row":"col";return`
      fn ${w}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${m} {
        var output_index = ${t.indicesGet("output_indices",x)};
        var originalIdx: ${m} = getOriginalCoordinateFromResizedCoordinate(output_index, ${u[x]},
        ${s[x]}, ${n[x]}, ${l[x]}, ${l[x]} + ${n.length});
        var fractOriginalIdx: ${m} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${d} && (originalIdx < 0 || originalIdx > (${n[x]} - 1))) {
          return ${o};
        }
        var data: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${w}: ${m} = originalIdx + ${m}(i);
          if (${w} < 0 || ${w} >= ${n[x]}) {
            ${r?`coefs[i + 1] = 0.0;
                        continue;`:d?`return ${o};`:`${w} = max(0, min(${w}, ${n[x]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",x,`u32(${w})`)};
          data[i + 1] = ${x===c?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${b(c)};
    ${b(h)};
  fn getCubicInterpolationCoefs(s: ${m}) -> array<${m}, 4> {
    var absS = abs(s);
    var coeffs: array<${m}, 4> = array<${m}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${m} = 1.0 - absS;
    var twoMinusAbsS: ${m} = 2.0 - absS;
    var onePlusAbsS: ${m} = 1.0 + absS;
    coeffs[0] = ((${p} * onePlusAbsS - 5 * ${p}) * onePlusAbsS + 8 * ${p}) * onePlusAbsS - 4 * ${p};
    coeffs[1] = ((${p} + 2) * absS - (${p} + 3)) * absS * absS + 1;
    coeffs[2] = ((${p} + 2) * oneMinusAbsS - (${p} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${p} * twoMinusAbsS - 5 * ${p}) * twoMinusAbsS + 8 * ${p}) * twoMinusAbsS - 4 * ${p};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${m}, 4>, coefs: array<${m}, 4>) -> ${m} {
    var coefsSum: ${m} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${m} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ng=(e,t,n,s,u)=>{let[l,p,d,o,r]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],i=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${i} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",p,`max(0, min(depth, ${n[p]} - 1))`)};
      ${e.indicesSet("input_indices",d,`max(0, min(height, ${n[d]} - 1))`)};
      ${e.indicesSet("input_indices",o,`max(0, min(width, ${n[o]} - 1))`)};
      ${is(e,r,l,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${i} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${i} = originalIndices[${p}];
      var height:${i} = originalIndices[${d}];
      var width:${i} = originalIndices[${o}];
      ${s?`if (depth < 0 || depth > (${n[p]} - 1) || height < 0 || height > (${n[d]} - 1) || width < 0 || (width > ${n[o]} - 1)) {
      return ${u};
        }`:""};

    depth = max(0, min(depth, ${n[p]} - 1));
      height = max(0, min(height, ${n[d]} - 1));
      width = max(0, min(width, ${n[o]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${r}])`:"0"};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${l}])`:"0"};

      var x111: ${i} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${i} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${i} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${i} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${i} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${i} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${i} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${i} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${i} = abs(depth - ${i}(depth1));
      var dx2: ${i} = abs(${i}(depth2) - depth);
      var dy1: ${i} = abs(height - ${i}(height1));
      var dy2: ${i} = abs(${i}(height2) - height);
      var dz1: ${i} = abs(width - ${i}(width1));
      var dz2: ${i} = abs(${i}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},zg=(e,t,n,s,u,l)=>{let p=e.dims,d=Ig(l,t.axes,p.length),o=Og(p,s,u,t.axes),r=s.slice();s.length===0&&(r=p.map((_,I)=>_===0?1:o[I]/_),t.keepAspectRatioPolicy!=="stretch"&&(o=Eg(p,r,t)));let i=te("output",e.dataType,o.length),a=L("input",e.dataType,p.length),c=R.size(o),h=p.length===o.length&&p.every((_,I)=>_===o[I]),m=t.coordinateTransformMode==="tf_crop_and_resize",b=t.extrapolationValue,x=a.type.value,w=_=>`
      ${h?"":`
      ${Tg(t.coordinateTransformMode,x)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${kg(a,p)};
              ${Sg(t.nearestMode,n,x)};
              ${Ag(a,i,p,o,r.length,d.length,m)};
              `;case"linear":return`
              ${Pg(i,p,o,r.length,d.length)};
              ${(()=>{if(p.length===2||p.length===4)return`${Dg(a,i,p,m,b)}`;if(p.length===3||p.length===5)return`${Ng(a,i,p,m,b)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(p.length===2||p.length===4)return`${Cg(a,i,p,o,r,d,t.cubicCoeffA,m,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${_.registerUniform("output_size","u32").registerUniform("scales","f32",r.length).registerUniform("roi","f32",d.length).declareVariables(a,i)}
      ${_.mainStart()}
        ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${h?"output[global_idx] = input[global_idx];":`
        let output_indices = ${i.offsetToIndices("global_idx")};
        var input_indices: ${a.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${a.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${p.length===2||p.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${n}|${r.length>0?t.mode==="cubic"?r:r.length:""}|${u.length>0?u:""}|${d.length>0?d:""}|${h}|${t.mode==="nearest"?p.length:p}`,inputDependencies:["rank"]},getShaderSource:w,getRunData:()=>({outputs:[{dims:o,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:[{type:12,data:c},{type:1,data:r},{type:1,data:d},...ie(p,o)]})}},Rg=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},n2=(e,t)=>{let n=[],s=[],u=[],l=Rg(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");$g(e.inputs,t,l,n,s,u),e.compute(zg(e.inputs[0],t,l,n,s,u),{inputs:[0]})},i2=e=>{let t=e.antialias,n=e.axes,s=e.coordinateTransformMode,u=e.cubicCoeffA,l=e.excludeOutside!==0,p=e.extrapolationValue,d=e.keepAspectRatioPolicy,o=e.mode,r=e.nearestMode===""?"simple":e.nearestMode;return Ie({antialias:t,axes:n,coordinateTransformMode:s,cubicCoeffA:u,excludeOutside:l,extrapolationValue:p,keepAspectRatioPolicy:d,mode:o,nearestMode:r})}}),Bg,Mg,o2,pO=k(()=>{"use strict";oe(),se(),ue(),Bg=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],n=e[1],s=e[2];if(t.dataType!==n.dataType||t.dataType!==s.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let u=t.dims[t.dims.length-1],l=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==u)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==l)throw new Error("Skip must have the same sequence length as input");if(s.dims.length!==1)throw new Error("Gamma must be 1D");if(s.dims[s.dims.length-1]!==u)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let p=e[3];if(p.dims.length!==1)throw new Error("Beta must be 1D");if(p.dims[p.dims.length-1]!==u)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let p=e[4];if(p.dims.length!==1)throw new Error("Bias must be 1D");if(p.dims[p.dims.length-1]!==u)throw new Error("Bias must have the same hidden size as input")}},Mg=(e,t,n,s)=>{let u=t.simplified,l=e[0].dims,p=R.size(l),d=l,o=p,r=l.slice(-1)[0],i=s?l.slice(0,-1).concat(1):[],a=!u&&e.length>3,c=e.length>4,h=s&&n>1,m=s&&n>2,b=n>3,x=64,w=je(r),_=[{type:12,data:o},{type:12,data:w},{type:12,data:r},{type:1,data:t.epsilon}],I=O=>{let A=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],D=[L("x",e[0].dataType,e[0].dims,w),L("skip",e[1].dataType,e[1].dims,w),L("gamma",e[2].dataType,e[2].dims,w)];a&&D.push(L("beta",e[3].dataType,e[3].dims,w)),c&&D.push(L("bias",e[4].dataType,e[4].dims,w)),D.push(te("output",e[0].dataType,d,w)),h&&D.push(te("mean_output",1,i)),m&&D.push(te("inv_std_output",1,i)),b&&D.push(te("input_skip_bias_sum",e[0].dataType,d,w));let S=Ke(e[0].dataType),F=Ke(1,w);return`

      ${O.registerUniforms(A).declareVariables(...D)}
      var<workgroup> sum_shared : array<${F}, ${x}>;
      var<workgroup> sum_squared_shared : array<${F}, ${x}>;

      ${O.mainStart([x,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${x};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${x};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${x-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${c?"bias[offset1d + i]":S+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${b?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${hn(S,w,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${x};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${hr("sum",w)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${hr("square_sum",w)} / f32(uniforms.hidden_size) ${u?"":"- mean * mean"} + uniforms.epsilon);
        ${h?"mean_output[global_idx] = mean;":""}
        ${m?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${u?"":`- ${S}(mean)`}) *
            ${S}(inv_std_dev) * gamma[offset1d + i]
            ${a?"+ beta[offset1d + i]":""};
        }
      }`},E=[{dims:d,dataType:e[0].dataType}];return n>1&&E.push({dims:i,dataType:1}),n>2&&E.push({dims:i,dataType:1}),n>3&&E.push({dims:l,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${w};${h};${m};${b}`,inputDependencies:e.map((O,A)=>"type")},getShaderSource:I,getRunData:()=>({outputs:E,dispatchGroup:{x:Math.ceil(o/r)},programUniforms:_})}},o2=(e,t)=>{Bg(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(Mg(e.inputs,t,e.outputCount,!1),{outputs:n})}}),jg,Mn,Fg,os,Lg,Vg,a2,s2,cO=k(()=>{"use strict";oe(),se(),Fe(),ue(),jg=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((n,s)=>{if(e[s+1].dataType!==6&&e[s+1].dataType!==7)throw new Error(`Input ${s} must be an array of int32 or int64`)})},Mn=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(s=>n.push(Number(s)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(s=>n.push(Number(s)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return n},Fg=(e,t)=>{if(e.length>1){let n=Mn(e,1),s=Mn(e,2),u=Mn(e,3);return u.length===0&&(u=[...Array(e[0].dims.length).keys()]),Ie({starts:n,ends:s,axes:u})}else return t},os=(e,t,n,s,u)=>{let l=e;return e<0&&(l+=n[s[t]]),u[t]<0?Math.max(0,Math.min(l,n[s[t]]-1)):Math.max(0,Math.min(l,n[s[t]]))},Lg=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${re("uniforms.input_shape","i",n.length)};
            let steps_i = ${re("uniforms.steps","i",n.length)};
            let signs_i = ${re("uniforms.signs","i",n.length)};
            let starts_i = ${re("uniforms.starts","i",n.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Vg=(e,t)=>{let n=e[0].dims,s=R.size(n),u=t.axes.length>0?R.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],l=Mn(e,4);l.forEach(w=>w!==0||(()=>{throw new Error("step cannot be 0")})),l.length===0&&(l=Array(u.length).fill(1));let p=t.starts.map((w,_)=>os(w,_,n,u,l)),d=t.ends.map((w,_)=>os(w,_,n,u,l));if(u.length!==p.length||u.length!==d.length)throw new Error("start, ends and axes should have the same number of elements");if(u.length!==n.length)for(let w=0;w<n.length;++w)u.includes(w)||(p.splice(w,0,0),d.splice(w,0,n[w]),l.splice(w,0,1));let o=l.map(w=>Math.sign(w));l.forEach((w,_,I)=>{if(w<0){let E=(d[_]-p[_])/w,O=p[_],A=O+E*l[_];p[_]=A,d[_]=O,I[_]=-w}});let r=n.slice(0);u.forEach((w,_)=>{r[w]=Math.ceil((d[w]-p[w])/l[w])});let i={dims:r,dataType:e[0].dataType},a=te("output",e[0].dataType,r.length),c=L("input",e[0].dataType,e[0].dims.length),h=R.size(r),m=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:p.length},{name:"signs",type:"i32",length:o.length},{name:"steps",type:"u32",length:l.length}],b=[{type:12,data:h},{type:12,data:p},{type:6,data:o},{type:12,data:l},...ie(e[0].dims,r)],x=w=>`
      ${w.registerUniforms(m).declareVariables(c,a)}
        ${Lg(c,a,n)}
        ${w.mainStart()}
          ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${a.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${a.setByOffset("global_idx",c.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${o.length}_${p.length}_${l.length}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[i],dispatchGroup:{x:Math.ceil(s/64)},programUniforms:b})}},a2=(e,t)=>{jg(e.inputs,t);let n=Fg(e.inputs,t);e.compute(Vg(e.inputs,n),{inputs:[0]})},s2=e=>{let t=e.starts,n=e.ends,s=e.axes;return Ie({starts:t,ends:n,axes:s})}}),Ug,qg,u2,l2,hO=k(()=>{"use strict";oe(),se(),Fe(),mr(),ue(),Ug=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},qg=(e,t)=>{let n=e.inputs[0],s=n.dims,u=R.size(s),l=s.length,p=R.normalizeAxis(t.axis,l),d=p<s.length-1,o,r=[];d?(r=Array.from({length:l},(D,S)=>S),r[p]=l-1,r[l-1]=p,o=e.compute(ft(n,r),{inputs:[n],outputs:[-1]})[0]):o=n;let i=o.dims,a=i[l-1],c=u/a,h=je(a),m=a/h,b=64;c===1&&(b=256);let x=(D,S)=>S===4?`max(max(${D}.x, ${D}.y), max(${D}.z, ${D}.w))`:S===2?`max(${D}.x, ${D}.y)`:S===3?`max(max(${D}.x, ${D}.y), ${D}.z)`:D,w=L("x",o.dataType,o.dims,h),_=te("result",o.dataType,o.dims,h),I=w.type.value,E=Ke(o.dataType)==="f32"?`var threadMax = ${I}(-3.4028234663852886e+38f);`:`var threadMax = ${I}(-65504.0h);`,O=D=>`
      var<workgroup> rowMaxShared : ${I};
      var<workgroup> rowSumShared : ${I};
      var<workgroup> threadShared : array<${I}, ${b}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${I} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${I}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${D.registerUniform("packedCols","i32").declareVariables(w,_)}
      ${D.mainStart(b)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${b};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${E}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${I}(${x("threadShared[0]",h)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${I}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${I}(${hr("threadShared[0]",h)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${I}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,A=e.compute({name:"Softmax",shaderCache:{hint:`${h};${b}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:i,dataType:o.dataType}],dispatchGroup:{x:c},programUniforms:[{type:6,data:m}]}),getShaderSource:O},{inputs:[o],outputs:[d?-1:0]})[0];d&&e.compute(ft(A,r),{inputs:[A]})},u2=(e,t)=>{Ug(e.inputs),qg(e,t)},l2=e=>Ie({axis:e.axis})}),as,Gg,Hg,Wg,d2,fO=k(()=>{"use strict";oe(),se(),ue(),as=e=>Array.from(e.getBigInt64Array(),Number),Gg=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(as(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Hg=(e,t)=>{let n=[];for(let s=0;s<e.length;++s)n.push(e[s]*t[s]);return n},Wg=(e,t)=>{let n=e[0].dims,s=t??as(e[1]),u=Hg(n,s),l=R.size(u),p=e[0].dataType,d=L("input",p,n.length),o=te("output",p,u.length),r=i=>`
      const inputShape = ${d.indices(...n)};
      ${i.registerUniform("output_size","u32").declareVariables(d,o)}
      ${i.mainStart()}
      ${i.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${o.offsetToIndices("global_idx")};
      var input_indices: ${d.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${d.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${o.indicesGet("output_indices","i")}  % input_dim_i;

        ${d.indicesSet("input_indices","i","input_dim_value")}
      }
      ${o.setByOffset("global_idx",d.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${s}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...ie(e[0].dims,u)]}),getShaderSource:r}},d2=e=>{Gg(e.inputs),e.compute(Wg(e.inputs),{inputs:[0]})}}),Kg,Xg,p2,mO=k(()=>{"use strict";oe(),se(),ue(),Kg=(e,t,n,s,u)=>{let l=te("output_data",u,n.length,4),p=L("a_data",t[1].dataType,t[1].dims.length,4),d=L("b_data",t[2].dataType,t[2].dims.length,4),o=L("c_data",t[0].dataType,t[0].dims.length,4),r,i=(a,c,h)=>`select(${c}, ${a}, ${h})`;if(!s)r=l.setByOffset("global_idx",i(p.getByOffset("global_idx"),d.getByOffset("global_idx"),o.getByOffset("global_idx")));else{let a=(c,h,m="")=>{let b=`a_data[index_a${h}][component_a${h}]`,x=`b_data[index_b${h}][component_b${h}]`,w=`bool(c_data[index_c${h}] & (0xffu << (component_c${h} * 8)))`;return`
            let output_indices${h} = ${l.offsetToIndices(`global_idx * 4u + ${h}u`)};
            let offset_a${h} = ${p.broadcastedIndicesToOffset(`output_indices${h}`,l)};
            let offset_b${h} = ${d.broadcastedIndicesToOffset(`output_indices${h}`,l)};
            let offset_c${h} = ${o.broadcastedIndicesToOffset(`output_indices${h}`,l)};
            let index_a${h} = offset_a${h} / 4u;
            let index_b${h} = offset_b${h} / 4u;
            let index_c${h} = offset_c${h} / 4u;
            let component_a${h} = offset_a${h} % 4u;
            let component_b${h} = offset_b${h} % 4u;
            let component_c${h} = offset_c${h} % 4u;
            ${c}[${h}] = ${m}(${i(b,x,w)});
          `};u===9?r=`
            var data = vec4<u32>(0);
            ${a("data",0,"u32")}
            ${a("data",1,"u32")}
            ${a("data",2,"u32")}
            ${a("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:r=`
            ${a("output_data[global_idx]",0)}
            ${a("output_data[global_idx]",1)}
            ${a("output_data[global_idx]",2)}
            ${a("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(o,p,d,l)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${r}
      }`},Xg=e=>{let t=e[1].dims,n=e[2].dims,s=e[0].dims,u=e[1].dataType,l=!(R.areEqual(t,n)&&R.areEqual(n,s)),p=t,d=R.size(t);if(l){let r=gn.calcShape(gn.calcShape(t,n,!1),s,!1);if(!r)throw new Error("Can't perform where op on the given tensors");p=r,d=R.size(p)}let o=Math.ceil(d/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:r=>Kg(r,e,p,l,u),getRunData:()=>({outputs:[{dims:p,dataType:u}],dispatchGroup:{x:Math.ceil(d/64/4)},programUniforms:[{type:12,data:o},...ie(s,t,n,p)]})}},p2=e=>{e.compute(Xg(e.inputs))}}),c2,gO=k(()=>{"use strict";PI(),qu(),AI(),kI(),DI(),CI(),NI(),jI(),LI(),VI(),UI(),qI(),GI(),HI(),WI(),KI(),XI(),ZI(),JI(),QI(),YI(),eO(),tO(),rO(),nO(),iO(),kw(),oO(),aO(),sO(),uO(),lO(),Uu(),dO(),Rw(),pO(),cO(),hO(),Nw(),fO(),mr(),Gu(),mO(),c2=new Map([["Abs",[r1]],["Acos",[n1]],["Acosh",[i1]],["Add",[j1]],["ArgMax",[Qv,su]],["ArgMin",[Jv,su]],["Asin",[o1]],["Asinh",[a1]],["Atan",[s1]],["Atanh",[u1]],["Attention",[Yv]],["AveragePool",[Gw,qw]],["BatchNormalization",[e1]],["BiasAdd",[t1]],["BiasSplitGelu",[M1]],["Cast",[d1,l1]],["Ceil",[c1]],["Clip",[p1]],["Concat",[X1,Z1]],["Conv",[hu,cu]],["ConvTranspose",[aw,ow]],["Cos",[h1]],["Cosh",[f1]],["CumSum",[sw,uw]],["DepthToSpace",[lw,dw]],["DequantizeLinear",[Qw,Yw]],["DFT",[pw,cw]],["Div",[F1]],["Einsum",[hw,fw]],["Elu",[m1,Kn]],["Equal",[L1]],["Erf",[g1]],["Exp",[b1]],["Expand",[mw]],["FastGelu",[gw]],["Floor",[y1]],["FusedConv",[hu,cu]],["Gather",[yw,bw]],["GatherElements",[Tw,$w]],["GatherBlockQuantized",[ww,xw]],["GatherND",[_w,vw]],["Gelu",[_1]],["Gemm",[Iw,Sw]],["GlobalAveragePool",[Ww,Hw]],["GlobalMaxPool",[Jw,Zw]],["Greater",[G1]],["GreaterOrEqual",[W1]],["GridSample",[Ow,Ew]],["GroupQueryAttention",[Bw]],["HardSigmoid",[O1,I1]],["HardSwish",[E1]],["InstanceNormalization",[Mw]],["LayerNormalization",[jw]],["LeakyRelu",[v1,Kn]],["Less",[H1]],["LessOrEqual",[K1]],["Log",[R1]],["MatMul",[Fw]],["MatMulNBits",[Lw,Vw]],["MaxPool",[Kw,Xw]],["Mul",[V1]],["MultiHeadAttention",[Aw,Pw]],["Neg",[x1]],["Not",[w1]],["Pad",[Uw]],["Pow",[U1]],["QuickGelu",[B1,Kn]],["Range",[e2]],["Reciprocal",[$1]],["ReduceMin",[Hv]],["ReduceMean",[Lv]],["ReduceMax",[Gv]],["ReduceSum",[Kv]],["ReduceProd",[Wv]],["ReduceL1",[Vv]],["ReduceL2",[Uv]],["ReduceLogSum",[Zv]],["ReduceLogSumExp",[qv]],["ReduceSumSquare",[Xv]],["Relu",[T1]],["Resize",[n2,i2]],["RotaryEmbedding",[zw]],["ScatterND",[r2,t2]],["Sigmoid",[S1]],["Sin",[P1]],["Sinh",[A1]],["Slice",[a2,s2]],["SkipLayerNormalization",[o2]],["Split",[Dw,Cw]],["Sqrt",[k1]],["Softmax",[u2,l2]],["Sub",[q1]],["Tan",[D1]],["Tanh",[C1]],["ThresholdedRelu",[z1,Kn]],["Tile",[d2]],["Transpose",[Pv,Av]],["Where",[p2]]])}),h2,bO=k(()=>{"use strict";et(),Jt(),ue(),h2=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,s,u){wt(e.programInfo.name);let l=this.backend.device,p=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let d=[];for(let r of t)d.push({binding:d.length,resource:{buffer:r.buffer}});for(let r of n)d.push({binding:d.length,resource:{buffer:r.buffer}});u&&d.push({binding:d.length,resource:u});let o=l.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:d,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let r={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:o,dispatchGroup:s};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(r)}p.setPipeline(e.computePipeline),p.setBindGroup(0,o),p.dispatchWorkgroups(...s),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),ht(e.programInfo.name)}dispose(){}build(e,t){wt(e.name);let n=this.backend.device,s=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(r=>{n.features.has(r.feature)&&s.push(`enable ${r.extension};`)});let u=Ev(t,this.backend.device.limits),l=e.getShaderSource(u),p=`${s.join(`
`)}
${u.additionalImplementations}
${l}`,d=n.createShaderModule({code:p,label:e.name});we("verbose",()=>`[WebGPU] ${e.name} shader code: ${p}`);let o=n.createComputePipeline({compute:{module:d,entryPoint:"main"},layout:"auto",label:e.name});return ht(e.name),{programInfo:e,computePipeline:o,uniformVariablesInfo:u.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,n=typeof e=="number"?1:e.y||1,s=typeof e=="number"?1:e.z||1,u=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=u&&n<=u&&s<=u)return[t,n,s];let l=t*n*s,p=Math.ceil(Math.sqrt(l));if(p>u){if(p=Math.ceil(Math.cbrt(l)),p>u)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[p,p,p]}else return[p,p,1]}}}),f2={};Yr(f2,{WebGpuBackend:()=>m2});var Zg,Jg,Qg,m2,yO=k(()=>{"use strict";et(),oe(),Jt(),$v(),OI(),gO(),bO(),Zg=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let s=0;s<e.length;++s){let u=e[s].dataType;switch(t[s]){case"none":{n.push("");break}case"type":{n.push(`${u}`);break}case"rank":{let l=e[s].dims.length;n.push(`${u};${l}`);break}case"dims":{let l=e[s].dims.join(",");n.push(`${u};${l}`);break}default:throw new Error(`unsupported input dependency: ${t[s]}`)}}return n.join("|")},Jg=(e,t,n)=>{var u,l;let s=e.name;return(u=e.shaderCache)!=null&&u.hint&&(s+="["+e.shaderCache.hint+"]"),s+=":"+n+`:${Zg(t,((l=e.shaderCache)==null?void 0:l.inputDependencies)??new Array(t.length).fill("dims"))}`,s},Qg=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},m2=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],s={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},u=d=>t.features.has(d)&&n.push(d)&&!0;u("chromium-experimental-timestamp-query-inside-passes")||u("timestamp-query"),u("shader-f16"),u("subgroups"),this.device=await t.requestDevice(s);let l=t,p=t.info??(typeof l.requestAdapterInfo=="function"?await l.requestAdapterInfo():void 0);this.adapterInfo=new Qg(p),this.gpuDataManager=Iv(this),this.programManager=new h2(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,ju(e.logLevel,!!e.debug),this.device.onuncapturederror=d=>{d.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${d.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;wt(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var s;let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let u=0;u<t.length/2;u++){let l=n[u],p=l.kernelId,d=this.kernels.get(p),o=d.kernelType,r=d.kernelName,i=l.programName,a=l.inputTensorViews,c=l.outputTensorViews,h=t[u*2],m=t[u*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=h);let b=Number(h-this.queryTimeBase),x=Number(m-this.queryTimeBase);if(!Number.isSafeInteger(b)||!Number.isSafeInteger(x))throw new RangeError("incorrect timestamp range");if((s=this.env.webgpu.profiling)!=null&&s.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:a.map(w=>({dims:w.dims,dataType:Xt(w.dataType)})),outputsMetadata:c.map(w=>({dims:w.dims,dataType:Xt(w.dataType)})),kernelId:p,kernelType:o,kernelName:r,programName:i,startTime:b,endTime:x});else{let w="";a.forEach((I,E)=>{w+=`input[${E}]: [${I.dims}] | ${Xt(I.dataType)}, `});let _="";c.forEach((I,E)=>{_+=`output[${E}]: [${I.dims}] | ${Xt(I.dataType)}, `}),console.log(`[profiling] kernel "${p}|${o}|${r}|${i}" ${w}${_}start time: ${b} ns, execution time: ${x-b} ns`)}Ui("GPU",`${i}::${h}::${m}`)}e.unmap(),this.pendingQueries.delete(e)}),ht()}run(e,t,n,s,u,l){wt(e.name);let p=[];for(let _=0;_<t.length;++_){let I=t[_].data;if(I===0)continue;let E=this.gpuDataManager.get(I);if(!E)throw new Error(`no GPU data for input: ${I}`);p.push(E)}let{outputs:d,dispatchGroup:o,programUniforms:r}=e.getRunData(t),i=n.length===0?d.map((_,I)=>I):n;if(i.length!==d.length)throw new Error(`Output size ${i.length} must be equal to ${d.length}.`);let a=[],c=[];for(let _=0;_<d.length;++_){if(!Number.isInteger(i[_])||i[_]<-3||i[_]>=l)throw new Error(`Invalid output index: ${i[_]}`);if(i[_]===-3)continue;let I=i[_]===-1,E=i[_]===-2,O=I||E?u(d[_].dataType,d[_].dims):s(i[_],d[_].dataType,d[_].dims);if(a.push(O),O.data===0)continue;let A=this.gpuDataManager.get(O.data);if(!A)throw new Error(`no GPU data for output: ${O.data}`);if(I&&this.temporaryData.push(A),E){let D=this.kernelPersistentData.get(this.currentKernelId);D||(D=[],this.kernelPersistentData.set(this.currentKernelId,D)),D.push(A)}c.push(A)}if(p.length!==t.length||c.length!==a.length){if(c.length===0)return ht(e.name),a;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let h;if(r){let _=0,I=[];r.forEach(D=>{let S=typeof D.data=="number"?[D.data]:D.data;if(S.length===0)return;let F=D.type===10?2:4,U,Q;D.type===10?(Q=S.length>4?16:S.length>2?8:S.length*F,U=S.length>4?16:F*S.length):(Q=S.length<=2?S.length*F:16,U=16),_=Math.ceil(_/Q)*Q,I.push(_);let H=D.type===10?8:4;_+=S.length>4?Math.ceil(S.length/H)*U:S.length*F});let E=16;_=Math.ceil(_/E)*E;let O=new ArrayBuffer(_);r.forEach((D,S)=>{let F=I[S],U=typeof D.data=="number"?[D.data]:D.data;if(D.type===6)new Int32Array(O,F,U.length).set(U);else if(D.type===12)new Uint32Array(O,F,U.length).set(U);else if(D.type===10)new Uint16Array(O,F,U.length).set(U);else if(D.type===1)new Float32Array(O,F,U.length).set(U);else throw new Error(`Unsupported uniform type: ${Xt(D.type)}`)});let A=this.gpuDataManager.create(_,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(A.buffer,0,O,0,_),this.gpuDataManager.release(A.id),h={offset:0,size:_,buffer:A.buffer}}let m=this.programManager.normalizeDispatchGroupSize(o),b=m[1]===1&&m[2]===1,x=Jg(e,t,b),w=this.programManager.getArtifact(x);if(w||(w=this.programManager.build(e,m),this.programManager.setArtifact(x,w),we("info",()=>`[artifact] key: ${x}, programName: ${e.name}`)),r&&w.uniformVariablesInfo){if(r.length!==w.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${w.uniformVariablesInfo.length}, got ${r.length} in program "${w.programInfo.name}".`);for(let _=0;_<r.length;_++){let I=r[_],E=I.type,O=typeof I.data=="number"?1:I.data.length,[A,D]=w.uniformVariablesInfo[_];if(E!==A||O!==D)throw new Error(`Uniform variable ${_} mismatch: expect type ${A} with size ${D}, got type ${E} with size ${O} in program "${w.programInfo.name}".`)}}if(we("info",()=>`[ProgramManager] run "${e.name}" (key=${x}) with ${m[0]}x${m[1]}x${m[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let _={kernelId:this.currentKernelId,programName:w.programInfo.name,inputTensorViews:t,outputTensorViews:a};this.pendingKernels.push(_),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(_)}return this.programManager.run(w,p,c,m,h),ht(e.name),a}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,s){let u=c2.get(e);if(!u)throw new Error(`kernel not implemented: ${e}`);let l={kernelType:e,kernelName:s,kernelEntry:u[0],attributes:[u[1],n]};this.kernels.set(t,l)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let n of t)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let s=this.kernels.get(e);if(!s)throw new Error(`kernel not created: ${e}`);let u=s.kernelType,l=s.kernelName,p=s.kernelEntry,d=s.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${u}] ${l}" is not allowed to be called recursively`);this.currentKernelId=e,d[0]&&(d[1]=d[0](d[1]),d[0]=void 0),we("info",()=>`[WebGPU] Start to run kernel "[${u}] ${l}"...`);let o=this.env.debug;this.temporaryData=[];try{return o&&this.device.pushErrorScope("validation"),p(t,d[1]),0}catch(r){return n.push(Promise.resolve(`[WebGPU] Kernel "[${u}] ${l}" failed. ${r}`)),1}finally{o&&n.push(this.device.popErrorScope().then(r=>r?`GPU validation error for kernel "[${u}] ${l}": ${r.message}`:null));for(let r of this.temporaryData)this.gpuDataManager.release(r.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,s){let u=this.sessionExternalDataMapping.get(e);u||(u=new Map,this.sessionExternalDataMapping.set(e,u));let l=u.get(t),p=this.gpuDataManager.registerExternalBuffer(n,s,l);return u.set(t,[p,n]),p}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let s=await iu(this,e,t);return Fu(s.buffer,n)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){we("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){we("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){we("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let s=0;s<n;s++){let u=this.getComputePassEncoder(),l=e[s];this.writeTimestamp(this.pendingDispatchNumber*2),u.setPipeline(l.computePipeline),u.setBindGroup(0,l.bindGroup),u.dispatchWorkgroups(...l.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[s]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),g2={};Yr(g2,{init:()=>b2});var Ri,Yg,b2,_O=k(()=>{"use strict";oe(),Jt(),se(),II(),Ri=class y2{constructor(t,n,s,u){this.module=t,this.dataType=n,this.data=s,this.dims=u}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=R.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(R.size(t)!==R.size(this.dims))throw new Error("Invalid new shape");return new y2(this.module,this.dataType,this.data,t)}},Yg=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let s=e.PTR_SIZE,u=n/e.PTR_SIZE,l=s===4?"i32":"i64";this.opKernelContext=Number(e.getValue(s*u++,l));let p=Number(e.getValue(s*u++,l));this.outputCount=Number(e.getValue(s*u++,l)),this.customDataOffset=Number(e.getValue(s*u++,"*")),this.customDataSize=Number(e.getValue(s*u++,l));let d=[];for(let o=0;o<p;o++){let r=Number(e.getValue(s*u++,l)),i=Number(e.getValue(s*u++,"*")),a=Number(e.getValue(s*u++,l)),c=[];for(let h=0;h<a;h++)c.push(Number(e.getValue(s*u++,l)));d.push(new Ri(e,r,i,c))}this.inputs=d}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var p;let n=((p=t==null?void 0:t.inputs)==null?void 0:p.map(d=>typeof d=="number"?this.inputs[d]:d))??this.inputs,s=(t==null?void 0:t.outputs)??[],u=(d,o,r)=>new Ri(this.module,o,this.output(d,r),r),l=(d,o)=>{let r=Gr(d,o);if(!r)throw new Error(`Unsupported data type: ${d}`);let i=r>0?this.backend.gpuDataManager.create(r).id:0;return new Ri(this.module,d,i,o)};return this.backend.run(e,n,s,u,l,this.outputCount)}output(e,t){let n=this.module.stackSave();try{let s=this.module.PTR_SIZE,u=s===4?"i32":"i64",l=this.module.stackAlloc((1+t.length)*s);this.module.setValue(l,t.length,u);for(let p=0;p<t.length;p++)this.module.setValue(l+s*(p+1),t[p],u);return this.module._JsepOutput(this.opKernelContext,e,l)}catch(s){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${s}`)}finally{this.module.stackRestore(n)}}},b2=async(e,t,n,s)=>{let u=t.jsepInit;if(!u)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let l=(yO(),fn(f2)).WebGpuBackend,p=new l;await p.initialize(n,s),u("webgpu",[p,d=>p.alloc(Number(d)),d=>p.free(d),(d,o,r,i=!1)=>{if(i)we("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(d)}, dst=${Number(o)}, size=${Number(r)}`),p.memcpy(Number(d),Number(o));else{we("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(d)}, gpuDataId=${Number(o)}, size=${Number(r)}`);let a=t.HEAPU8.subarray(Number(d>>>0),Number(d>>>0)+Number(r));p.upload(Number(o),a)}},async(d,o,r)=>{we("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${d}, dataOffset=${o}, size=${r}`),await p.download(Number(d),()=>t.HEAPU8.subarray(Number(o)>>>0,Number(o+r)>>>0))},(d,o,r)=>p.createKernel(d,Number(o),r,t.UTF8ToString(t._JsepGetNodeName(Number(o)))),d=>p.releaseKernel(d),(d,o,r,i)=>{we("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${r}, kernel=${d}, contextDataOffset=${o}`);let a=new Yg(t,p,Number(o));return p.computeKernel(Number(d),a,i)},()=>p.captureBegin(),()=>p.captureEnd(),()=>p.replay()])}else{let l=new Sv(n);u("webnn",[l,()=>l.reserveTensorId(),p=>l.releaseTensorId(p),async(p,d,o,r,i)=>l.ensureTensor(p,d,o,r,i),(p,d)=>{l.uploadTensor(p,d)},async(p,d)=>l.downloadTensor(p,d),(p,d)=>l.registerMLContext(p,d),!!n.trace])}}}),eb,Ju,Qu,ir,tb,ss,Yi,Yu,el,jn,rb,Or,_2,v2,us,tl,rl,nl,w2=k(()=>{"use strict";et(),$I(),TI(),oe(),tn(),zu(),Mu(),eb=(e,t)=>{De()._OrtInit(e,t)!==0&&Te("Can't initialize onnxruntime.")},Ju=async e=>{eb(e.wasm.numThreads,Ki(e.logLevel))},Qu=async(e,t)=>{var s,u;(u=(s=De()).asyncInit)==null||u.call(s);let n=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let l=e.webgpu.powerPreference;if(l!==void 0&&l!=="low-power"&&l!=="high-performance")throw new Error(`Invalid powerPreference setting: "${l}"`);let p=e.webgpu.forceFallbackAdapter;if(p!==void 0&&typeof p!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${p}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:l,forceFallbackAdapter:p}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let l=(_O(),fn(g2)).init;t==="webgpu"&&await l("webgpu",De(),e,n),t==="webnn"&&await l("webnn",De(),e)}},ir=new Map,tb=e=>{let t=De(),n=t.stackSave();try{let s=t.PTR_SIZE,u=t.stackAlloc(2*s);t._OrtGetInputOutputCount(e,u,u+s)!==0&&Te("Can't get session input/output count.");let l=s===4?"i32":"i64";return[Number(t.getValue(u,l)),Number(t.getValue(u+s,l))]}finally{t.stackRestore(n)}},ss=(e,t)=>{let n=De(),s=n.stackSave(),u=0;try{let l=n.PTR_SIZE,p=n.stackAlloc(2*l);n._OrtGetInputOutputMetadata(e,t,p,p+l)!==0&&Te("Can't get session input/output metadata.");let d=Number(n.getValue(p,"*"));u=Number(n.getValue(p+l,"*"));let o=n.HEAP32[u/4];if(o===0)return[d,0];let r=n.HEAPU32[u/4+1],i=[];for(let a=0;a<r;a++){let c=Number(n.getValue(u+8+a*l,"*"));i.push(c!==0?n.UTF8ToString(c):Number(n.getValue(u+8+(a+r)*l,"*")))}return[d,o,i]}finally{n.stackRestore(s),u!==0&&n._OrtFree(u)}},Yi=e=>{let t=De(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},Yu=async(e,t)=>{var a,c,h,m;let n,s,u=De();Array.isArray(e)?[n,s]=e:e.buffer===u.HEAPU8.buffer?[n,s]=[e.byteOffset,e.byteLength]:[n,s]=Yi(e);let l=0,p=0,d=0,o=[],r=[],i=[];try{if([p,o]=await _v(t),(t==null?void 0:t.externalData)&&u.mountExternalData){let S=[];for(let F of t.externalData){let U=typeof F=="string"?F:F.path,Q=typeof F=="string"?F:F.data;S.push(uo(Q).then(H=>{u.mountExternalData(U,H)}))}await Promise.all(S)}for(let S of(t==null?void 0:t.executionProviders)??[])if((typeof S=="string"?S:S.name)==="webnn"){if(u.shouldTransferToMLTensor=!1,typeof S!="string"){let F=S,U=F==null?void 0:F.context,Q=F==null?void 0:F.gpuDevice,H=F==null?void 0:F.deviceType,N=F==null?void 0:F.powerPreference;U?u.currentContext=U:Q?u.currentContext=await u.webnnCreateMLContext(Q):u.currentContext=await u.webnnCreateMLContext({deviceType:H,powerPreference:N})}else u.currentContext=await u.webnnCreateMLContext();break}l=await u._OrtCreateSession(n,s,p),(a=u.webgpuOnCreateSession)==null||a.call(u,l),l===0&&Te("Can't create a session."),(c=u.jsepOnCreateSession)==null||c.call(u),u.currentContext&&(u.webnnRegisterMLContext(l,u.currentContext),u.currentContext=void 0,u.shouldTransferToMLTensor=!0);let[b,x]=tb(l),w=!!(t!=null&&t.enableGraphCapture),_=[],I=[],E=[],O=[],A=[];for(let S=0;S<b;S++){let[F,U,Q]=ss(l,S);F===0&&Te("Can't get an input name."),r.push(F);let H=u.UTF8ToString(F);_.push(H),E.push(U===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:Xt(U),shape:Q})}for(let S=0;S<x;S++){let[F,U,Q]=ss(l,S+b);F===0&&Te("Can't get an output name."),i.push(F);let H=u.UTF8ToString(F);I.push(H),O.push(U===0?{name:H,isTensor:!1}:{name:H,isTensor:!0,type:Xt(U),shape:Q});{if(w&&(t==null?void 0:t.preferredOutputLocation)===void 0){A.push("gpu-buffer");continue}let N=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((h=t==null?void 0:t.preferredOutputLocation)==null?void 0:h[H])??"cpu",M=u.webnnIsGraphOutput;if(N==="cpu"&&M&&M(l,H)){A.push("ml-tensor-cpu-output");continue}if(N!=="cpu"&&N!=="cpu-pinned"&&N!=="gpu-buffer"&&N!=="ml-tensor")throw new Error(`Not supported preferred output location: ${N}.`);if(w&&N!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${N}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);A.push(N)}}let D=null;return A.some(S=>S==="gpu-buffer"||S==="ml-tensor"||S==="ml-tensor-cpu-output")&&(d=u._OrtCreateBinding(l),d===0&&Te("Can't create IO binding."),D={handle:d,outputPreferredLocations:A,outputPreferredLocationsEncoded:A.map(S=>S==="ml-tensor-cpu-output"?"ml-tensor":S).map(S=>nu(S))}),ir.set(l,[l,r,i,D,w,!1]),[l,_,I,E,O]}catch(b){throw r.forEach(x=>u._OrtFree(x)),i.forEach(x=>u._OrtFree(x)),d!==0&&u._OrtReleaseBinding(d)!==0&&Te("Can't release IO binding."),l!==0&&u._OrtReleaseSession(l)!==0&&Te("Can't release session."),b}finally{u._free(n),p!==0&&u._OrtReleaseSessionOptions(p)!==0&&Te("Can't release session options."),o.forEach(b=>u._free(b)),(m=u.unmountExternalData)==null||m.call(u)}},el=e=>{var o,r,i;let t=De(),n=ir.get(e);if(!n)throw new Error(`cannot release session. invalid session id: ${e}`);let[s,u,l,p,d]=n;p&&(d&&t._OrtClearBoundOutputs(p.handle)!==0&&Te("Can't clear bound outputs."),t._OrtReleaseBinding(p.handle)!==0&&Te("Can't release IO binding.")),(o=t.jsepOnReleaseSession)==null||o.call(t,e),(r=t.webnnOnReleaseSession)==null||r.call(t,e),(i=t.webgpuOnReleaseSession)==null||i.call(t,e),u.forEach(a=>t._OrtFree(a)),l.forEach(a=>t._OrtFree(a)),t._OrtReleaseSession(s)!==0&&Te("Can't release session."),ir.delete(e)},jn=new Map,rb=1,Or=new Map,_2=e=>{let t=De(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,n);let s=t._OrtCreateLoraAdapter(n,e.byteLength);s===0&&Te("Can't create a LoRA adapter.");let u=rb++;return jn.set(u,s),u}finally{t._free(n)}},v2=e=>{let t=De(),n=jn.get(e);if(n===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(Or.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(n)!==0&&Te("Can't release LoRA adapter."),jn.delete(e)},us=async(e,t,n,s,u,l,p=!1)=>{if(!e){t.push(0);return}let d=De(),o=d.PTR_SIZE,r=e[0],i=e[1],a=e[3],c=a,h,m;if(r==="string"&&(a==="gpu-buffer"||a==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(p&&a!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${l} when enableGraphCapture is true.`);if(a==="gpu-buffer"){let w=e[2].gpuBuffer;m=Gr(qr(r),i);{let _=d.jsepRegisterBuffer;if(!_)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');h=_(s,l,w,m)}}else if(a==="ml-tensor"){let w=e[2].mlTensor;m=Gr(qr(r),i);let _=d.webnnRegisterMLTensor;if(!_)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');h=_(s,w,qr(r),i)}else{let w=e[2];if(Array.isArray(w)){m=o*w.length,h=d._malloc(m),n.push(h);for(let _=0;_<w.length;_++){if(typeof w[_]!="string")throw new TypeError(`tensor data at index ${_} is not a string`);d.setValue(h+_*o,kt(w[_],n),"*")}}else{let _=d.webnnIsGraphInput,I=d.webnnIsGraphOutput;if(r!=="string"&&_&&I){let E=d.UTF8ToString(u);if(_(s,E)||I(s,E)){let O=qr(r);m=Gr(O,i),c="ml-tensor";let A=d.webnnCreateTemporaryTensor,D=d.webnnUploadTensor;if(!A||!D)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let S=await A(s,O,i);D(S,new Uint8Array(w.buffer,w.byteOffset,w.byteLength)),h=S}else m=w.byteLength,h=d._malloc(m),n.push(h),d.HEAPU8.set(new Uint8Array(w.buffer,w.byteOffset,m),h)}else m=w.byteLength,h=d._malloc(m),n.push(h),d.HEAPU8.set(new Uint8Array(w.buffer,w.byteOffset,m),h)}}let b=d.stackSave(),x=d.stackAlloc(4*i.length);try{i.forEach((_,I)=>d.setValue(x+I*o,_,o===4?"i32":"i64"));let w=d._OrtCreateTensor(qr(r),h,m,x,i.length,nu(c));w===0&&Te(`Can't create tensor for input/output. session=${s}, index=${l}.`),t.push(w)}finally{d.stackRestore(b)}},tl=async(e,t,n,s,u,l,p=[])=>{var M,$,B,q;let d=De(),o=d.PTR_SIZE,r=ir.get(e);if(!r)throw new Error(`cannot run inference. invalid session id: ${e}`);let i=r[0],a=r[1],c=r[2],h=r[3],m=r[4],b=r[5],x=[];if(p.length>0){if(h)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let J of p){let K=jn.get(J);if(K===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${J}`);x.push(K)}}let w=t.length,_=s.length,I=0,E=[],O=[],A=[],D=[],S=[],F=d.stackSave(),U=d.stackAlloc(w*o),Q=d.stackAlloc(w*o),H=d.stackAlloc(_*o),N=d.stackAlloc(_*o);try{for(let z of p)Or.set(z,(Or.get(z)??0)+1);[I,E]=yv(l,x),Wr("wasm prepareInputOutputTensor");for(let z=0;z<w;z++)await us(n[z],O,D,e,a[t[z]],t[z],m);for(let z=0;z<_;z++)await us(u[z],A,D,e,c[s[z]],w+s[z],m);Kr("wasm prepareInputOutputTensor");for(let z=0;z<w;z++)d.setValue(U+z*o,O[z],"*"),d.setValue(Q+z*o,a[t[z]],"*");for(let z=0;z<_;z++)d.setValue(H+z*o,A[z],"*"),d.setValue(N+z*o,c[s[z]],"*");if(h&&!b){let{handle:z,outputPreferredLocations:X,outputPreferredLocationsEncoded:Z}=h;if(a.length!==w)throw new Error(`input count from feeds (${w}) is expected to be always equal to model's input count (${a.length}).`);Wr("wasm bindInputsOutputs");for(let V=0;V<w;V++){let fe=t[V];await d._OrtBindInput(z,a[fe],O[V])!==0&&Te(`Can't bind input[${V}] for session=${e}.`)}for(let V=0;V<_;V++){let fe=s[V];(M=u[V])!=null&&M[3]?(S.push(A[V]),d._OrtBindOutput(z,c[fe],A[V],0)!==0&&Te(`Can't bind pre-allocated output[${V}] for session=${e}.`)):d._OrtBindOutput(z,c[fe],0,Z[fe])!==0&&Te(`Can't bind output[${V}] to ${X[V]} for session=${e}.`)}Kr("wasm bindInputsOutputs"),ir.set(e,[i,a,c,h,m,!0])}($=d.jsepOnRunStart)==null||$.call(d,i),(B=d.webnnOnRunStart)==null||B.call(d,i);let J;h?J=await d._OrtRunWithBinding(i,h.handle,_,H,I):J=await d._OrtRun(i,Q,U,w,N,_,H,I),J!==0&&Te("failed to call OrtRun().");let K=[],ae=[];Wr("wasm ProcessOutputTensor");for(let z=0;z<_;z++){let X=Number(d.getValue(H+z*o,"*"));if(X===A[z]||S.includes(A[z])){K.push(u[z]),X!==A[z]&&d._OrtReleaseTensor(X)!==0&&Te("Can't release tensor.");continue}let Z=d.stackSave(),V=d.stackAlloc(4*o),fe=!1,le,de=0;try{d._OrtGetTensorData(X,V,V+o,V+2*o,V+3*o)!==0&&Te(`Can't access output tensor data on index ${z}.`);let He=o===4?"i32":"i64",Qe=Number(d.getValue(V,He));de=d.getValue(V+o,"*");let gr=d.getValue(V+o*2,"*"),br=Number(d.getValue(V+o*3,He)),$t=[];for(let Ve=0;Ve<br;Ve++)$t.push(Number(d.getValue(gr+Ve*o,He)));d._OrtFree(gr)!==0&&Te("Can't free memory for tensor dims.");let Ye=$t.reduce((Ve,Me)=>Ve*Me,1);le=Xt(Qe);let Pe=h==null?void 0:h.outputPreferredLocations[s[z]];if(le==="string"){if(Pe==="gpu-buffer"||Pe==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Ve=[];for(let Me=0;Me<Ye;Me++){let at=d.getValue(de+Me*o,"*"),Nt=d.getValue(de+(Me+1)*o,"*"),yr=Me===Ye-1?void 0:Nt-at;Ve.push(d.UTF8ToString(at,yr))}K.push([le,$t,Ve,"cpu"])}else if(Pe==="gpu-buffer"&&Ye>0){let Ve=d.jsepGetBuffer;if(!Ve)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Me=Ve(de),at=Gr(Qe,Ye);if(at===void 0||!Ru(le))throw new Error(`Unsupported data type: ${le}`);fe=!0,K.push([le,$t,{gpuBuffer:Me,download:d.jsepCreateDownloader(Me,at,le),dispose:()=>{d._OrtReleaseTensor(X)!==0&&Te("Can't release tensor.")}},"gpu-buffer"])}else if(Pe==="ml-tensor"&&Ye>0){let Ve=d.webnnEnsureTensor,Me=d.webnnIsGraphInputOutputTypeSupported;if(!Ve||!Me)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Gr(Qe,Ye)===void 0||!Bu(le))throw new Error(`Unsupported data type: ${le}`);if(!Me(e,le,!1))throw new Error(`preferredLocation "ml-tensor" for ${le} output is not supported by current WebNN Context.`);let at=await Ve(e,de,Qe,$t,!1);fe=!0,K.push([le,$t,{mlTensor:at,download:d.webnnCreateMLTensorDownloader(de,le),dispose:()=>{d.webnnReleaseTensorId(de),d._OrtReleaseTensor(X)}},"ml-tensor"])}else if(Pe==="ml-tensor-cpu-output"&&Ye>0){let Ve=d.webnnCreateMLTensorDownloader(de,le)(),Me=K.length;fe=!0,ae.push((async()=>{let at=[Me,await Ve];return d.webnnReleaseTensorId(de),d._OrtReleaseTensor(X),at})()),K.push([le,$t,[],"cpu"])}else{let Ve=so(le),Me=new Ve(Ye);new Uint8Array(Me.buffer,Me.byteOffset,Me.byteLength).set(d.HEAPU8.subarray(de,de+Me.byteLength)),K.push([le,$t,Me,"cpu"])}}finally{d.stackRestore(Z),le==="string"&&de&&d._free(de),fe||d._OrtReleaseTensor(X)}}h&&!m&&(d._OrtClearBoundOutputs(h.handle)!==0&&Te("Can't clear bound outputs."),ir.set(e,[i,a,c,h,m,!1]));for(let[z,X]of await Promise.all(ae))K[z][2]=X;return Kr("wasm ProcessOutputTensor"),K}finally{(q=d.webnnOnRunEnd)==null||q.call(d,i),d.stackRestore(F),O.forEach(J=>d._OrtReleaseTensor(J)),A.forEach(J=>d._OrtReleaseTensor(J)),D.forEach(J=>d._free(J)),I!==0&&d._OrtReleaseRunOptions(I),E.forEach(J=>d._free(J));for(let J of p){let K=Or.get(J)-1;K===0?Or.delete(J):Or.set(J,K)}}},rl=e=>{let t=De(),n=ir.get(e);if(!n)throw new Error("invalid session id");let s=n[0],u=t._OrtEndProfiling(s);u===0&&Te("Can't get an profile file name."),t._OrtFree(u)},nl=e=>{let t=[];for(let n of e){let s=n[2];!Array.isArray(s)&&"buffer"in s&&t.push(s.buffer)}return t}}),jt,ot,sn,Fn,Ln,Bi,ls,Mi,Er,Pr,nb,x2,$2,T2,S2,I2,O2,E2,P2,A2,il=k(()=>{"use strict";et(),w2(),tn(),Cu(),Mu(),jt=()=>!!ye.wasm.proxy&&typeof document<"u",sn=!1,Fn=!1,Ln=!1,Mi=new Map,Er=(e,t)=>{let n=Mi.get(e);n?n.push(t):Mi.set(e,[t])},Pr=()=>{if(sn||!Fn||Ln||!ot)throw new Error("worker not ready")},nb=e=>{switch(e.data.type){case"init-wasm":sn=!1,e.data.err?(Ln=!0,ls[1](e.data.err)):(Fn=!0,ls[0]()),Bi&&(URL.revokeObjectURL(Bi),Bi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Mi.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},x2=async()=>{if(!Fn){if(sn)throw new Error("multiple calls to 'initWasm()' detected.");if(Ln)throw new Error("previous call to 'initWasm()' failed.");if(sn=!0,jt())return new Promise((e,t)=>{ot==null||ot.terminate(),gv().then(([n,s])=>{try{ot=s,ot.onerror=l=>t(l),ot.onmessage=nb,ls=[e,t];let u={type:"init-wasm",in:ye};!u.in.wasm.wasmPaths&&(n||ru)&&(u.in.wasm.wasmPaths={wasm:new URL(""+new URL("ort-wasm-simd-threaded.jsep-Dt5UNR3U.wasm",import.meta.url).href,import.meta.url).href}),ot.postMessage(u),Bi=n}catch(u){t(u)}},t)});try{await Nu(ye.wasm),await Ju(ye),Fn=!0}catch(e){throw Ln=!0,e}finally{sn=!1}}},$2=async e=>{if(jt())return Pr(),new Promise((t,n)=>{Er("init-ep",[t,n]);let s={type:"init-ep",in:{epName:e,env:ye}};ot.postMessage(s)});await Qu(ye,e)},T2=async e=>jt()?(Pr(),new Promise((t,n)=>{Er("copy-from",[t,n]);let s={type:"copy-from",in:{buffer:e}};ot.postMessage(s,[e.buffer])})):Yi(e),S2=async(e,t)=>{if(jt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return Pr(),new Promise((n,s)=>{Er("create",[n,s]);let u={type:"create",in:{model:e,options:{...t}}},l=[];e instanceof Uint8Array&&l.push(e.buffer),ot.postMessage(u,l)})}else return Yu(e,t)},I2=async e=>{if(jt())return Pr(),new Promise((t,n)=>{Er("release",[t,n]);let s={type:"release",in:e};ot.postMessage(s)});el(e)},O2=async e=>{if(jt())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await uo(e):e;return _2(t)},E2=async e=>{if(jt())throw new Error("LoRA adapter is not supported for proxy.");v2(e)},P2=async(e,t,n,s,u,l,p)=>{if(jt()){if(p.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(n.some(d=>d[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(u.some(d=>d))throw new Error("pre-allocated output tensor is not supported for proxy.");return Pr(),new Promise((d,o)=>{Er("run",[d,o]);let r=n,i={type:"run",in:{sessionId:e,inputIndices:t,inputs:r,outputIndices:s,options:l}};ot.postMessage(i,nl(r))})}else return tl(e,t,n,s,u,l,p)},A2=async e=>{if(jt())return Pr(),new Promise((t,n)=>{Er("end-profiling",[t,n]);let s={type:"end-profiling",in:e};ot.postMessage(s)});rl(e)}}),ol,k2=k(()=>{"use strict";et(),il(),ol=class{async loadAdapter(e){wt(),this.adapterId=await O2(e),ht()}async dispose(){return E2(this.adapterId)}}}),ds,ib,D2,vO=k(()=>{"use strict";et(),k2(),il(),oe(),Du(),Mu(),ds=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},ib=e=>{switch(e[3]){case"cpu":return new Dt(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ru(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:s,dispose:u}=e[2];return Dt.fromGpuBuffer(n,{dataType:t,dims:e[1],download:s,dispose:u})}case"ml-tensor":{let t=e[0];if(!Bu(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:s,dispose:u}=e[2];return Dt.fromMLTensor(n,{dataType:t,dims:e[1],download:s,dispose:u})}default:throw new Error(`invalid data location: ${e[3]}`)}},D2=class{async fetchModelAndCopyToWasmMemory(e){return T2(await uo(e))}async loadModel(e,t){wt();let n;typeof e=="string"?n=await this.fetchModelAndCopyToWasmMemory(e):n=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await S2(n,t),ht()}async dispose(){return I2(this.sessionId)}async run(e,t,n,s=[]){wt();let u=s.map(h=>{if(!(h instanceof ol))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return h.adapterId}),l=[],p=[];Object.entries(e).forEach(h=>{let m=h[0],b=h[1],x=this.inputNames.indexOf(m);if(x===-1)throw new Error(`invalid input '${m}'`);l.push(b),p.push(x)});let d=[],o=[];Object.entries(t).forEach(h=>{let m=h[0],b=h[1],x=this.outputNames.indexOf(m);if(x===-1)throw new Error(`invalid output '${m}'`);d.push(b),o.push(x)});let r=l.map((h,m)=>ds(h,()=>`input "${this.inputNames[p[m]]}"`)),i=d.map((h,m)=>h?ds(h,()=>`output "${this.outputNames[o[m]]}"`):null),a=await P2(this.sessionId,p,r,o,i,n,u),c={};for(let h=0;h<a.length;h++)c[this.outputNames[o[h]]]=d[h]??ib(a[h]);return ht(),c}startProfiling(){}endProfiling(){A2(this.sessionId)}}}),C2={};Yr(C2,{OnnxruntimeWebAssemblyBackend:()=>gu,initializeFlags:()=>mu,wasmBackend:()=>N2});var mu,gu,N2,wO=k(()=>{"use strict";et(),k2(),il(),vO(),uv(),mu=()=>{(typeof ye.wasm.initTimeout!="number"||ye.wasm.initTimeout<0)&&(ye.wasm.initTimeout=0);let e=ye.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ye.wasm.simd=!1),typeof ye.wasm.proxy!="boolean"&&(ye.wasm.proxy=!1),typeof ye.wasm.trace!="boolean"&&(ye.wasm.trace=!1),typeof ye.wasm.numThreads!="number"||!Number.isInteger(ye.wasm.numThreads)||ye.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ye.wasm.numThreads=1;else{let t=typeof navigator>"u"?ps("node:os").cpus().length:navigator.hardwareConcurrency;ye.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},gu=class{async init(e){mu(),await x2(),await $2(e)}async createInferenceSessionHandler(e,t){ku(t);let n=new D2;return await n.loadModel(e,t),n}async createLoraAdapterHandler(e){let t=new ol;return await t.loadAdapter(e),t}},N2=new gu});et();et();et();var xO="1.31.1",TO=Ob;{let e=(vI(),fn(lv)).onnxjsBackend;Hr("webgl",e,-10)}{let e=(wO(),fn(C2)).wasmBackend;Hr("webgpu",e,5),Hr("webnn",e,5),Hr("cpu",e,10),Hr("wasm",e,10)}Object.defineProperty(ye.versions,"web",{value:xO,enumerable:!0});/**
* @license
* Copyright 2021 Google LLC. All Rights Reserved.
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* =============================================================================
*//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//*! Bundled license information:

long/index.js:
long/umd/index.js:
  (**
   * @license
   * Copyright 2009 The Closure Library Authors
   * Copyright 2020 Daniel Wirtz / The long.js Authors.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *
   * SPDX-License-Identifier: Apache-2.0
   *)
*/export{Sb as InferenceSession,Ib as LoraAdapter,Ui as TRACE,Wr as TRACE_EVENT_BEGIN,Kr as TRACE_EVENT_END,wt as TRACE_FUNC_BEGIN,ht as TRACE_FUNC_END,Dt as Tensor,TO as default,ye as env,Hr as registerBackend};

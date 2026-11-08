import{c as Ya}from"./GgufArtifactReader-BNrO4g7x.js";import{ai as me,ag as Ke,aj as Qt,al as Xa,am as Qa}from"./main-Bi25mBGM.js";
import{validateGgufCapabilities as Ka,validateGgufManifest as Za,validateGgufRuntimeAssets as eo,validateGgufRuntimeOptions as ro,
ggufRuntimeDefinition as to,GGUF_RUNTIME_VERSION as no}from"./runtimeDefinition-CztcbSX9.js";import"./index-Douplpni.js";
function ao(c,A){const V=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var O=!!globalThis.
window,J=!!globalThis.WorkerGlobalScope,I=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",N=J&&
self.name?.startsWith("em-pthread");if(I){var P=require("worker_threads");global.Worker=P.Worker,J=!P.isMainThread,N=J&&
P.workerData=="em-pthread"}var B="./this.program",k=(e,r)=>{throw r},E=globalThis.document?.currentScript?.src;typeof __filename<
"u"?E=__filename:J&&(E=self.location.href);var R="";function M(e){return c.locateFile?c.locateFile(e,R):R+e}var S,v;if(I){
var H=require("fs");R=__dirname+"/",v=e=>{e=z(e)?new URL(e):e;var r=H.readFileSync(e);return r},S=async(e,r=!0)=>{e=z(e)?
new URL(e):e;var t=H.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(B=process.argv[1].replace(/\\/g,"\
/")),process.argv.slice(2),typeof module<"u"&&(module.exports=c),k=(e,r)=>{throw process.exitCode=e,r}}else if(O||J){try{
R=new URL(".",E).href}catch{}I||(J&&(v=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),S=async e=>{if(z(e))return new Promise((t,n)=>{var o=new XMLHttpRequest;o.open(
"GET",e,!0),o.responseType="arraybuffer",o.onload=()=>{if(o.status==200||o.status==0&&o.response){t(o.response);return}n(
o.status)},o.onerror=n,o.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(
r.status+" : "+r.url)})}var ne=console.log.bind(console),L=console.error.bind(console);if(I){var Q=require("util"),le=e=>typeof e==
"object"?Q.inspect(e):e;ne=(...e)=>H.writeSync(1,e.map(le).join(" ")+`
`),L=(...e)=>H.writeSync(2,e.map(le).join(" ")+`
`)}var ie=ne,te=L,ge,se,Ee=!1,ee;function Y(e,r){e||fe(r)}var z=e=>e.startsWith("file://");function l(){we.buffer!=ae.buffer&&
Ve()}if(I&&N){var re=P.parentPort;re.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>re.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var ue;if(N){var _e=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.
cmd;if(n==="load"){let o=[];self.onmessage=s=>o.push(s),ue=()=>{postMessage({cmd:"loaded"});for(let s of o)e(s);self.onmessage=
e};for(const s of t.handlers)(!c[s]||c[s].proxy)&&(c[s]=(...i)=>{postMessage({cmd:"callHandler",handler:s,args:i})},s=="\
print"&&(ie=c[s]),s=="printErr"&&(te=c[s]));we=t.wasmMemory,Ve(),se=t.wasmModule,Cr(),Qe()}else if(n==="run"){gn(t.pthread_ptr),
Nr(t.pthread_ptr,0,0,1,0,0),U.threadInitTLS(),pr(t.pthread_ptr),_e||(_e=!0);try{await zr(t.start_routine,t.arg)}catch(o){
if(o!="unwind")throw o}}else t.target==="setimmediate"||(n==="checkMailbox"?_e&&Pe():n&&(te(`worker: received unknown co\
mmand ${n}`),te(t)))}catch(o){throw Mt(),o}}self.onmessage=e}var ae,ce,Se,x,F,Ze,xe,X,w,Br=!1;function Ve(){var e=we.buffer;
ae=new Int8Array(e),Se=new Int16Array(e),c.HEAPU8=ce=new Uint8Array(e),x=new Int32Array(e),F=new Uint32Array(e),Ze=new Float32Array(
e),xe=new Float64Array(e),X=new BigInt64Array(e),w=new BigUint64Array(e)}function on(){if(!N){if(c.wasmMemory)we=c.wasmMemory;else{
var e=c.INITIAL_MEMORY||134217728;we=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}Ve()}}function sn(){if(c.preRun)for(typeof c.preRun=="function"&&(c.preRun=[c.preRun]);c.preRun.length;)Or(c.preRun.
shift());Rr(Gr)}function Fr(){if(Br=!0,N)return ue();!c.noFSInit&&!a.initialized&&a.init(),Ie.__wasm_call_ctors(),a.ignorePermissions=
!1}function ln(){if(!N){if(c.postRun)for(typeof c.postRun=="function"&&(c.postRun=[c.postRun]);c.postRun.length;)pn(c.postRun.
shift());Rr(qr)}}function fe(e){c.onAbort?.(e),e="Aborted("+e+")",te(e),Ee=!0,e+=". Build with -sASSERTIONS for more inf\
o.",Br&&Jt();var r=new WebAssembly.RuntimeError(e);throw r}var er;function un(){return M("wllama.wasm")}function cn(e){if(e==
er&&ge)return new Uint8Array(ge);if(v)return v(e);throw"both async and sync fetching of the wasm failed"}async function mn(e){
if(!ge)try{var r=await S(e);return new Uint8Array(r)}catch{}return cn(e)}async function fn(e,r){try{var t=await mn(e),n=await WebAssembly.
instantiate(t,r);return n}catch(o){te(`failed to asynchronously prepare wasm: ${o}`),fe(o)}}async function dn(e,r,t){if(!e&&
!z(r)&&!I)try{var n=fetch(r,{credentials:"same-origin"}),o=await WebAssembly.instantiateStreaming(n,t);return o}catch(s){
te(`wasm streaming compile failed: ${s}`),te("falling back to ArrayBuffer instantiation")}return fn(r,t)}function Ar(){$a(),
Ge.__instrumented||(Ge.__instrumented=!0,de.instrumentWasmImports(Ge));var e={env:Ge,wasi_snapshot_preview1:Ge};return e}
async function Cr(){function e(i,u){return Ie=i.exports,Ie=de.instrumentWasmExports(Ie),Ie=Pa(Ie),_n(Ie._emscripten_tls_init),
Ja(Ie),se=u,ze(),Ie}Je();function r(i){return e(i.instance,i.module)}var t=Ar();if(c.instantiateWasm)return new Promise(
(i,u)=>{c.instantiateWasm(t,(d,_)=>{i(e(d,_))})});if(N){var n=new WebAssembly.Instance(se,Ar());return e(n,se)}er??=un();
var o=await dn(ge,er,t),s=r(o);return s}class Tr{name="ExitStatus";constructor(r){this.message=`Program terminated with \
exit(${r})`,this.status=r}}var Dr=e=>{e.terminate(),e.onmessage=r=>{}},jr=e=>{var r=U.pthreads[e];U.returnWorkerToPool(r)},
Rr=e=>{for(;e.length>0;)e.shift()(c)},Gr=[],Or=e=>Gr.push(e),Ae=0,Oe=null,ze=e=>{if(Ae--,c.monitorRunDependencies?.(Ae),
Ae==0&&Oe){var r=Oe;Oe=null,r()}},Je=e=>{Ae++,c.monitorRunDependencies?.(Ae)},Ur=e=>{var r=U.getNewWorker();if(!r)return 6;
U.runningWorkers.push(r),U.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,
arg:e.arg,pthread_ptr:e.pthread_ptr};return I&&r.unref(),r.postMessage(t,e.transferList),0},$e=0,rr=()=>or||$e>0,ve=()=>Yt(),
he=e=>Pt(e),tr=e=>Ht(e),Z=(e,r,t,...n)=>{for(var o=n.length*2,s=ve(),i=tr(o*8),u=i/8,d=0;d<n.length;d++){var _=n[d];typeof _==
"bigint"?((l(),X)[u+2*d]=1n,(l(),X)[u+2*d+1]=_):((l(),X)[u+2*d]=0n,(l(),xe)[u+2*d+1]=_)}var g=Wt(e,r,o,i,t);return he(s),
g};function Lr(e){if(N)return Z(0,0,1,e);ee=e,rr()||(U.terminateAllThreads(),c.onExit?.(e),Ee=!0),k(e,new Tr(e))}function Mr(e){
if(N)return Z(1,0,0,e);nr(e)}var Wr=(e,r)=>{if(ee=e,N)throw Mr(e),"unwind";Lr(e)},nr=Wr,U={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){N||U.initMainThread()},initMainThread(){for(var e=c.pthreadPoolSize;e--;)U.allocateUnusedWorker();
Or(async()=>{var r=U.loadWasmModuleToAllWorkers();Je(),await r,ze()})},terminateAllThreads:()=>{for(var e of U.runningWorkers)
Dr(e);for(var e of U.unusedWorkers)Dr(e);U.unusedWorkers=[],U.runningWorkers=[],U.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete U.pthreads[r],U.unusedWorkers.push(e),U.runningWorkers.splice(U.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,qt(r)},threadInitTLS(){U.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var i=s.
data,u=i.cmd;if(i.targetThread&&i.targetThread!=Xe()){var d=U.pthreads[i.targetThread];d?d.postMessage(i,i.transferList):
te(`Internal error! Worker sent a message "${u}" to target pthread ${i.targetThread}, but that thread no longer exists!`);
return}u==="checkMailbox"?Pe():u==="spawnThread"?Ur(i):u==="cleanupThread"?ke(()=>jr(i.thread)):u==="loaded"?(e.loaded=!0,
I&&!e.pthread_ptr&&e.unref(),r(e)):i.target==="setimmediate"?e.postMessage(i):u==="uncaughtException"?e.onerror(i.error):
u==="callHandler"?c[i.handler](...i.args):u&&te(`worker sent an unknown command ${u}`)},e.onerror=s=>{var i="worker sent\
 an error!";throw te(`${i} ${s.filename}:${s.lineno}: ${s.message}`),s},I&&(e.on("message",s=>e.onmessage({data:s})),e.on(
"error",s=>e.onerror(s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var o of n)c.propertyIsEnumerable(o)&&t.
push(o);e.postMessage({cmd:"load",handlers:t,wasmMemory:we,wasmModule:se})}),async loadWasmModuleToAllWorkers(){return N?
void 0:Promise.all(U.unusedWorkers.map(U.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=E;c.mainScriptUrlOrBlob&&
(r=c.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new V(r,{workerData:"em-pthread",name:"em-pth\
read"}),U.unusedWorkers.push(e)},getNewWorker(){return U.unusedWorkers.length==0&&(U.allocateUnusedWorker(),U.loadWasmModuleToWorker(
U.unusedWorkers[0])),U.unusedWorkers.pop()}},qr=[],pn=e=>qr.push(e);function gn(e){var r=Number((l(),w)[(e+88)/8]),t=Number(
(l(),w)[(e+96)/8]),n=r-t;$t(r,n),he(r)}var ar=[],Vr=e=>{e=Number(e);var r=ar[e];return r||(ar[e]=r=Xt.get(BigInt(e)),de.
isAsyncExport(r)&&(ar[e]=r=de.makeAsyncFunction(r))),r},zr=async(e,r)=>{$e=0,or=0;var t=(o=>WebAssembly.promising(Vr(e)).
call(null,BigInt(o)))(r);function n(o){if(rr()){ee=o;return}Ir(o)}t=await t,n(t)};zr.isAsync=!0;var or=!0,_n=e=>U.tlsInitFunctions.
push(e),we;function Jr(e,r,t,n){return N?Z(2,0,1,e,r,t,n):$r(e,r,t,n)}var vn=()=>!!globalThis.SharedArrayBuffer,hn=9007199254740992,
wn=-9007199254740992,p=e=>e<wn||e>hn?NaN:Number(e);function $r(e,r,t,n){if(e=p(e),r=p(r),t=p(t),n=p(n),!vn())return 6;var o=[],
s=0;if(N&&(o.length===0||s))return Jr(e,r,t,n);var i={startRoutine:t,pthread_ptr:e,arg:n,transferList:o};return N?(i.cmd=
"spawnThread",postMessage(i,o),0):Ur(i)}var Te=()=>{var e=Number((l(),w)[q.varargs/8]);return q.varargs+=8,e},sr=()=>{var e=(l(),
x)[+q.varargs/4];return q.varargs+=4,e},W={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var o=e[n];o==="."?e.splice(n,1):o===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=W.isAbs(e),
t=e.slice(-1)==="/";return e=W.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=W.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>W.normalize(e.join("/")),join2:(e,r)=>W.normalize(e+"/"+r)},bn=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),ir=e=>{(ir=bn())(e)},De={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var o=n>=0?e[n]:a.cwd();if(typeof o!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!o)return"";r=o+"/"+r,t=W.isAbs(o)}return r=W.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=De.resolve(e).slice(1),r=De.resolve(r).slice(1);function t(_){for(var g=0;g<_.length&&_[g]==="";g++)
;for(var b=_.length-1;b>=0&&_[b]==="";b--);return g>b?[]:_.slice(g,b-g+1)}for(var n=t(e.split("/")),o=t(r.split("/")),s=Math.
min(n.length,o.length),i=s,u=0;u<s;u++)if(n[u]!==o[u]){i=u;break}for(var d=[],u=i;u<n.length;u++)d.push("..");return d=d.
concat(o.slice(i)),d.join("/")}},Pr=globalThis.TextDecoder&&new TextDecoder,yn=(e,r,t,n)=>{for(var o=r+t;e[r]&&!(r>=o);)
++r;return r},je=(e,r=0,t,n)=>{var o=yn(e,r,t);if(o-r>16&&e.buffer&&Pr)return Pr.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,o):e.slice(r,o));for(var s="";r<o;){var i=e[r++];if(!(i&128)){s+=String.fromCharCode(i);continue}var u=e[r++]&
63;if((i&224)==192){s+=String.fromCharCode((i&31)<<6|u);continue}var d=e[r++]&63;if((i&240)==224?i=(i&15)<<12|u<<6|d:i=(i&
7)<<18|u<<12|d<<6|e[r++]&63,i<65536)s+=String.fromCharCode(i);else{var _=i-65536;s+=String.fromCharCode(55296|_>>10,56320|
_&1023)}}return s},lr=[],be=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},Hr=(e,r,t,n)=>{if(!(n>0))return 0;for(var o=t,s=t+n-1,i=0;i<e.length;++i){var u=e.codePointAt(
i);if(u<=127){if(t>=s)break;r[t++]=u}else if(u<=2047){if(t+1>=s)break;r[t++]=192|u>>6,r[t++]=128|u&63}else if(u<=65535){
if(t+2>=s)break;r[t++]=224|u>>12,r[t++]=128|u>>6&63,r[t++]=128|u&63}else{if(t+3>=s)break;r[t++]=240|u>>18,r[t++]=128|u>>
12&63,r[t++]=128|u>>6&63,r[t++]=128|u&63,i++}}return r[t]=0,t-o},ur=(e,r,t)=>{var n=be(e)+1,o=new Array(n),s=Hr(e,o,0,o.
length);return o.length=s,o},kn=()=>{if(!lr.length){var e=null;if(I){var r=256,t=Buffer.alloc(r),n=0,o=process.stdin.fd;
try{n=H.readSync(o,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;lr=ur(e)}return lr.shift()},Ce={ttys:[],init(){},shutdown(){},register(e,r){Ce.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Ce.stream_ops)},stream_ops:{open(e){var r=Ce.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,o){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,i=0;i<n;i++){var u;try{u=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(u===void 0&&s===0)throw new a.ErrnoError(6);if(u==null)break;s++,r[t+i]=u}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,o){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return kn()},put_char(e,r){r===null||r===10?(ie(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(ie(je(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(te(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(te(je(e.output)),e.output=[])}}},En=(e,r)=>(l(),ce).fill(0,e,e+r),Yr=(e,r)=>Math.ceil(e/r)*r,cr=e=>{
e=Yr(e,65536);var r=Lt(65536,e);return r&&En(r,e),r},C={ops_table:null,mount(e){return C.createNode(null,"/",16895,0)},createNode(e,r,t,n){
if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(63);C.ops_table||={dir:{node:{getattr:C.node_ops.getattr,setattr:C.
node_ops.setattr,lookup:C.node_ops.lookup,mknod:C.node_ops.mknod,rename:C.node_ops.rename,unlink:C.node_ops.unlink,rmdir:C.
node_ops.rmdir,readdir:C.node_ops.readdir,symlink:C.node_ops.symlink},stream:{llseek:C.stream_ops.llseek}},file:{node:{getattr:C.
node_ops.getattr,setattr:C.node_ops.setattr},stream:{llseek:C.stream_ops.llseek,read:C.stream_ops.read,write:C.stream_ops.
write,mmap:C.stream_ops.mmap,msync:C.stream_ops.msync}},link:{node:{getattr:C.node_ops.getattr,setattr:C.node_ops.setattr,
readlink:C.node_ops.readlink},stream:{}},chrdev:{node:{getattr:C.node_ops.getattr,setattr:C.node_ops.setattr},stream:a.chrdev_stream_ops}};
var o=a.createNode(e,r,t,n);return a.isDir(o.mode)?(o.node_ops=C.ops_table.dir.node,o.stream_ops=C.ops_table.dir.stream,
o.contents={}):a.isFile(o.mode)?(o.node_ops=C.ops_table.file.node,o.stream_ops=C.ops_table.file.stream,o.usedBytes=0,o.contents=
null):a.isLink(o.mode)?(o.node_ops=C.ops_table.link.node,o.stream_ops=C.ops_table.link.stream):a.isChrdev(o.mode)&&(o.node_ops=
C.ops_table.chrdev.node,o.stream_ops=C.ops_table.chrdev.stream),o.atime=o.mtime=o.ctime=Date.now(),e&&(e.contents[r]=o,e.
atime=e.mtime=e.ctime=o.atime),o},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var n=1024*1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var o=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(o.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&C.resizeFileStorage(e,r.size)},lookup(e,r){throw C.doesNotExistError||(C.doesNotExistError=new a.ErrnoError(44),
C.doesNotExistError.stack="<generic error, no stack>"),C.doesNotExistError},mknod(e,r,t,n){return C.createNode(e,r,t,n)},
rename(e,r,t){var n;try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var o in n.contents)throw new a.ErrnoError(
55);a.hashRemoveNode(n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.
contents)throw new a.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var n=C.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,n,o){var s=e.node.contents;if(o>=e.node.usedBytes)return 0;var i=Math.
min(e.node.usedBytes-o,n);if(i>8&&s.subarray)r.set(s.subarray(o,o+i),t);else for(var u=0;u<i;u++)r[t+u]=s[o+u];return i},
write(e,r,t,n,o,s){if(r.buffer===(l(),ae).buffer&&(s=!1),!n)return 0;var i=e.node;if(i.mtime=i.ctime=Date.now(),r.subarray&&
(!i.contents||i.contents.subarray)){if(s)return i.contents=r.subarray(t,t+n),i.usedBytes=n,n;if(i.usedBytes===0&&o===0)return i.
contents=r.slice(t,t+n),i.usedBytes=n,n;if(o+n<=i.usedBytes)return i.contents.set(r.subarray(t,t+n),o),n}if(C.expandFileStorage(
i,o+n),i.contents.subarray&&r.subarray)i.contents.set(r.subarray(t,t+n),o);else for(var u=0;u<n;u++)i.contents[o+u]=r[t+
u];return i.usedBytes=Math.max(i.usedBytes,o+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,o){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,i,u=e.node.contents;if(!(o&2)&&u&&u.buffer===(l(),ae).buffer)i=!1,s=u.byteOffset;else{if(i=!0,s=cr(r),!s)throw new a.
ErrnoError(48);u&&((t>0||t+r<u.length)&&(u.subarray?u=u.subarray(t,t+r):u=Array.prototype.slice.call(u,t,t+r)),(l(),ae).
set(u,s))}return{ptr:s,allocated:i}},msync(e,r,t,n,o){return C.stream_ops.write(e,r,0,n,t,!1),0}}},Sn=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},mr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},Nn=async e=>{var r=await S(e);return new Uint8Array(r)},Xr=(...e)=>a.createDataFile(
...e),Qr=[],In=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of Qr)if(t.canHandle(r))return t.handle(e,r);return e},
fr=async(e,r,t,n,o,s,i,u)=>{var d=r?De.resolve(W.join2(e,r)):e;Je();try{var _=t;typeof t=="string"&&(_=await Nn(t)),_=await In(
_,d),u?.(),s||Xr(e,r,_,n,o,i)}finally{ze()}},xn=(e,r,t,n,o,s,i,u,d,_)=>{fr(e,r,t,n,o,u,d,_).then(s).catch(i)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,W.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(_=>!!_),o=a.root,s="/",i=0;i<n.length;i++){var u=i===n.length-1;if(u&&r.parent)break;if(n[i]!=="."){if(n[i]===
".."){if(s=W.dirname(s),a.isRoot(o)){e=s+"/"+n.slice(i+1).join("/"),t--;continue e}else o=o.parent;continue}s=W.join2(s,
n[i]);try{o=a.lookupNode(o,n[i])}catch(_){if(_?.errno===44&&u&&r.noent_okay)return{path:s};throw _}if(a.isMountpoint(o)&&
(!u||r.follow_mount)&&(o=o.mounted.root),a.isLink(o.mode)&&(!u||r.follow)){if(!o.node_ops.readlink)throw new a.ErrnoError(
52);var d=o.node_ops.readlink(o);W.isAbs(d)||(d=W.dirname(s)+"/"+d),e=d+"/"+n.slice(i+1).join("/");continue e}}}return{path:s,
node:o}}throw new a.ErrnoError(32)},getPath(e){for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-
1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-
t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=
a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=
e.name_next;else for(var t=a.nameTable[r];t;){if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){
var t=a.mayLookup(e);if(t)throw new a.ErrnoError(t);for(var n=a.hashName(e.id,r),o=a.nameTable[n];o;o=o.name_next){var s=o.
name;if(o.parent.id===e.id&&s===r)return o}return a.lookup(e,r)},createNode(e,r,t,n){var o=new a.FSNode(e,r,t,n);return a.
hashAddNode(o),o},destroyNode(e){a.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},
isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&
61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},
flagsToPermissionString(e){var r=["r","w","rw"][e&3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?
0:r.includes("r")&&!(e.mode&292)||r.includes("w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.
isDir(e.mode))return 54;var r=a.nodePermissions(e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))
return 54;try{var t=a.lookupNode(e,r);return 20}catch{}return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.
lookupNode(e,r)}catch(s){return s.errno}var o=a.nodePermissions(e,"wx");if(o)return o;if(t){if(!a.isDir(n.mode))return 54;
if(a.isRoot(n)||a.getPath(n)===a.cwd())return 10}else if(a.isDir(n.mode))return 31;return 0},mayOpen(e,r){return e?a.isLink(
e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(r)!=="r"||r&576)?31:a.nodePermissions(e,a.flagsToPermissionString(
r)):44},checkOpExists(e,r){if(!e)throw new a.ErrnoError(r);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)
if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){var r=a.getStream(e);if(!r)throw new a.ErrnoError(
8);return r},getStream:e=>a.streams[e],createStream(e,r=-1){return e=Object.assign(new a.FSStream,e),r==-1&&(r=a.nextfd()),
e.fd=r,a.streams[r]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,r=-1){var t=a.createStream(e,r);return t.stream_ops?.
dup?.(t),t},doSetAttr(e,r,t){var n=e?.stream_ops.setattr,o=n?e:r;n??=r.node_ops.setattr,a.checkOpExists(n,63),n(o,t)},chrdev_stream_ops:{
open(e){var r=a.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new a.ErrnoError(
70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){a.devices[e]={stream_ops:r}},getDevice:e=>a.
devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var n=t.pop();r.push(n),t.push(...n.mounts)}return r},syncfs(e,r){
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&te(`warning: ${a.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function o(u){return a.syncFSRequests--,
r(u)}function s(u){if(u)return s.errored?void 0:(s.errored=!0,o(u));++n>=t.length&&o(null)}for(var i of t)i.type.syncfs?
i.type.syncfs(i,e,s):s(null)},mount(e,r,t){var n=t==="/",o=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!o){var i=a.
lookupPath(t,{follow_mount:!1});if(t=i.path,s=i.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(s.mode))throw new a.
ErrnoError(54)}var u={type:e,opts:r,mountpoint:t,mounts:[]},d=e.mount(u);return d.mount=u,u.root=d,n?a.root=d:s&&(s.mounted=
u,s.mount&&s.mount.mounts.push(u)),d},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,o=a.getMounts(n);for(var[s,i]of Object.entries(a.nameTable))for(;i;){var u=i.name_next;
o.includes(i.mount)&&a.destroyNode(i),i=u}t.mounted=null;var d=t.mount.mounts.indexOf(n);t.mount.mounts.splice(d,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),o=n.node,s=W.basename(e);if(!s)throw new a.
ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var i=a.mayCreate(o,s);if(i)throw new a.ErrnoError(i);if(!o.
node_ops.mknod)throw new a.ErrnoError(63);return o.node_ops.mknod(o,s,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var o of t)if(o){(n||W.isAbs(e))&&(n+=
"/"),n+=o;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!De.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var o=W.basename(r),s=a.mayCreate(n,o);if(s)throw new a.ErrnoError(s);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,o,e)},rename(e,r){var t=W.dirname(e),n=W.dirname(r),o=W.basename(e),s=W.basename(
r),i,u,d;if(i=a.lookupPath(e,{parent:!0}),u=i.node,i=a.lookupPath(r,{parent:!0}),d=i.node,!u||!d)throw new a.ErrnoError(
44);if(u.mount!==d.mount)throw new a.ErrnoError(75);var _=a.lookupNode(u,o),g=De.relative(e,n);if(g.charAt(0)!==".")throw new a.
ErrnoError(28);if(g=De.relative(r,t),g.charAt(0)!==".")throw new a.ErrnoError(55);var b;try{b=a.lookupNode(d,s)}catch{}if(_!==
b){var h=a.isDir(_.mode),y=a.mayDelete(u,o,h);if(y)throw new a.ErrnoError(y);if(y=b?a.mayDelete(d,s,h):a.mayCreate(d,s),
y)throw new a.ErrnoError(y);if(!u.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(_)||b&&a.isMountpoint(b))
throw new a.ErrnoError(10);if(d!==u&&(y=a.nodePermissions(u,"w"),y))throw new a.ErrnoError(y);a.hashRemoveNode(_);try{u.
node_ops.rename(_,d,s),_.parent=d}catch(D){throw D}finally{a.hashAddNode(_)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=W.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(o)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=W.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
throw new a.ErrnoError(s);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);
t.node_ops.unlink(t,n),a.destroyNode(o)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)throw new a.ErrnoError(44);if(!t.
node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.lookupPath(e,{follow:!r}),
n=t.node,o=a.checkOpExists(n.node_ops.getattr,63);return o(n)},fstat(e){var r=a.getStreamChecked(e),t=r.node,n=r.stream_ops.
getattr,o=n?r:t;return n??=t.node_ops.getattr,a.checkOpExists(n,63),n(o)},lstat(e){return a.stat(e,!0)},doChmod(e,r,t,n){
a.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:n})},chmod(e,r,t){var n;if(typeof e=="string"){var o=a.
lookupPath(e,{follow:!t});n=o.node}else n=e;a.doChmod(null,n,r,t)},lchmod(e,r){a.chmod(e,r,!0)},fchmod(e,r){var t=a.getStreamChecked(
e);a.doChmod(t,t.node,r,!1)},doChown(e,r,t){a.doSetAttr(e,r,{timestamp:Date.now(),dontFollow:t})},chown(e,r,t,n){var o;if(typeof e==
"string"){var s=a.lookupPath(e,{follow:!n});o=s.node}else o=e;a.doChown(null,o,n)},lchown(e,r,t){a.chown(e,r,t,!0)},fchown(e,r,t){
var n=a.getStreamChecked(e);a.doChown(n,n.node,!1)},doTruncate(e,r,t){if(a.isDir(r.mode))throw new a.ErrnoError(31);if(!a.
isFile(r.mode))throw new a.ErrnoError(28);var n=a.nodePermissions(r,"w");if(n)throw new a.ErrnoError(n);a.doSetAttr(e,r,
{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new a.ErrnoError(28);var t;if(typeof e=="string"){var n=a.lookupPath(
e,{follow:!0});t=n.node}else t=e;a.doTruncate(null,t,r)},ftruncate(e,r){var t=a.getStreamChecked(e);if(r<0||(t.flags&2097155)===
0)throw new a.ErrnoError(28);a.doTruncate(t,t.node,r)},utime(e,r,t){var n=a.lookupPath(e,{follow:!0}),o=n.node,s=a.checkOpExists(
o.node_ops.setattr,63);s(o,{atime:r,mtime:t})},open(e,r,t=438){if(e==="")throw new a.ErrnoError(44);r=typeof r=="string"?
Sn(r):r,r&64?t=t&4095|32768:t=0;var n,o;if(typeof e=="object")n=e;else{o=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=s.node,e=s.path}var i=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(o)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),i=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!i){var u=a.mayOpen(n,r);if(u)throw new a.ErrnoError(u)}r&512&&!i&&a.truncate(n,0),
r&=-131713;var d=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return d.stream_ops.open&&d.stream_ops.open(d),i&&a.chmod(n,t&511),c.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),d},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,o){if(n<
0||o<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(
8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var s=typeof o<"u";
if(!s)o=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var i=e.stream_ops.read(e,r,t,n,o);return s||(e.position+=
i),i},write(e,r,t,n,o,s){if(n<0||o<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===
0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(
28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var i=typeof o<"u";if(!i)o=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var u=e.stream_ops.write(e,r,t,n,o,s);return i||(e.position+=u),u},mmap(e,r,t,n,o){if((n&2)!==0&&(o&2)===0&&(e.flags&
2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.
ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,r,t,n,o)},msync(e,r,t,n,o){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,n,o):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&fe(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),o=n.size,s=new Uint8Array(o);return a.
read(t,s,0,o,0),r.encoding==="utf8"&&(s=je(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(ur(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
fe("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,o,s,i,u)=>i,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Ce.register(a.makedev(5,0),Ce.default_tty_ops),Ce.register(a.makedev(6,0),Ce.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(ir(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:C.stream_ops.llseek},r.node_ops={lookup(t,n){var o=+n,
s=a.getStreamChecked(o),i={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:o+1};return i.parent=
i,i},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(C,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:C}},init(e,r,t){a.initialized=!0,e??=c.stdin,r??=c.stdout,t??=c.stderr,a.createStandardStreams(e,r,t)},quit(){a.initialized=
!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=
t.path,n.parentObject=t.node,n.name=W.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(o){n.error=o.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var o=r.split("/").reverse();o.length;){var s=o.pop();if(s){var i=W.join2(e,s);try{a.mkdir(i)}catch(u){if(u.
errno!=20)throw u}e=i}}return i},createFile(e,r,t,n,o){var s=W.join2(typeof e=="string"?e:a.getPath(e),r),i=mr(n,o);return a.
create(s,i)},createDataFile(e,r,t,n,o,s){var i=r;e&&(e=typeof e=="string"?e:a.getPath(e),i=r?W.join2(e,r):e);var u=mr(n,
o),d=a.create(i,u);if(t){if(typeof t=="string"){for(var _=new Array(t.length),g=0,b=t.length;g<b;++g)_[g]=t.charCodeAt(g);
t=_}a.chmod(d,u|146);var h=a.open(d,577);a.write(h,t,0,t.length,0,s),a.close(h),a.chmod(d,u)}},createDevice(e,r,t,n){var o=W.
join2(typeof e=="string"?e:a.getPath(e),r),s=mr(!!t,!!n);a.createDevice.major??=64;var i=a.makedev(a.createDevice.major++,
0);return a.registerDevice(i,{open(u){u.seekable=!1},close(u){n?.buffer?.length&&n(10)},read(u,d,_,g,b){for(var h=0,y=0;y<
g;y++){var D;try{D=t()}catch{throw new a.ErrnoError(29)}if(D===void 0&&h===0)throw new a.ErrnoError(6);if(D==null)break;
h++,d[_+y]=D}return h&&(u.node.atime=Date.now()),h},write(u,d,_,g,b){for(var h=0;h<g;h++)try{n(d[_+h])}catch{throw new a.
ErrnoError(29)}return g&&(u.node.mtime=u.node.ctime=Date.now()),h}}),a.mkdev(o,s,i)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)fe("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=v(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,o){class s{lengthKnown=!1;chunks=[];get(h){
if(!(h>this.length-1||h<0)){var y=h%this.chunkSize,D=h/this.chunkSize|0;return this.getter(D)[y]}}setDataGetter(h){this.
getter=h}cacheLength(){var h=new XMLHttpRequest;h.open("HEAD",t,!1),h.send(null),h.status>=200&&h.status<300||h.status===
304||fe("Couldn't load "+t+". Status: "+h.status);var y=Number(h.getResponseHeader("Content-length")),D,T=(D=h.getResponseHeader(
"Accept-Ranges"))&&D==="bytes",f=(D=h.getResponseHeader("Content-Encoding"))&&D==="gzip",j=1024*1024;T||(j=y);var G=(oe,pe)=>{
oe>pe&&fe("invalid range ("+oe+", "+pe+") or no bytes requested!"),pe>y-1&&fe("only "+y+" bytes available! programmer er\
ror!");var K=new XMLHttpRequest;return K.open("GET",t,!1),y!==j&&K.setRequestHeader("Range","bytes="+oe+"-"+pe),K.responseType=
"arraybuffer",K.overrideMimeType&&K.overrideMimeType("text/plain; charset=x-user-defined"),K.send(null),K.status>=200&&K.
status<300||K.status===304||fe("Couldn't load "+t+". Status: "+K.status),K.response!==void 0?new Uint8Array(K.response||
[]):ur(K.responseText||"")},$=this;$.setDataGetter(oe=>{var pe=oe*j,K=(oe+1)*j-1;return K=Math.min(K,y-1),typeof $.chunks[oe]>
"u"&&($.chunks[oe]=G(pe,K)),typeof $.chunks[oe]>"u"&&fe("doXHR failed!"),$.chunks[oe]}),(f||!y)&&(j=y=1,y=this.getter(0).
length,j=y,ie("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=y,this._chunkSize=
j,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){J||fe("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var i=new s,u={isDevice:!1,contents:i}}else
var u={isDevice:!1,url:t};var d=a.createFile(e,r,u,n,o);u.contents?d.contents=u.contents:u.url&&(d.contents=null,d.url=u.
url),Object.defineProperties(d,{usedBytes:{get:function(){return this.contents.length}}});var _={};for(const[b,h]of Object.
entries(d.stream_ops))_[b]=(...y)=>(a.forceLoadFile(d),h(...y));function g(b,h,y,D,T){var f=b.node.contents;if(T>=f.length)
return 0;var j=Math.min(f.length-T,D);if(f.slice)for(var G=0;G<j;G++)h[y+G]=f[T+G];else for(var G=0;G<j;G++)h[y+G]=f.get(
T+G);return j}return _.read=(b,h,y,D,T)=>(a.forceLoadFile(d),g(b,h,y,D,T)),_.mmap=(b,h,y,D,T)=>{a.forceLoadFile(d);var f=cr(
h);if(!f)throw new a.ErrnoError(48);return g(b,(l(),ae),f,h,y),{ptr:f,allocated:!0}},d.stream_ops=_,d}},Ue=(e,r,t)=>e?je(
(l(),ce),e,r):"",q={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(W.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var o=q.
getStreamFromFD(e);n=o.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
F)[e/4]=r.dev,(l(),F)[(e+4)/4]=r.mode,(l(),w)[(e+8)/8]=BigInt(r.nlink),(l(),F)[(e+16)/4]=r.uid,(l(),F)[(e+20)/4]=r.gid,(l(),
F)[(e+24)/4]=r.rdev,(l(),X)[(e+32)/8]=BigInt(r.size),(l(),x)[(e+40)/4]=4096,(l(),x)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),o=r.ctime.getTime();return(l(),X)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),w)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),X)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),w)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),X)[(e+80)/8]=BigInt(Math.
floor(o/1e3)),(l(),w)[(e+88)/8]=BigInt(o%1e3*1e3*1e3),(l(),X)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),F)[(e+8)/
4]=r.bsize,(l(),F)[(e+72)/4]=r.bsize,(l(),X)[(e+16)/8]=BigInt(r.blocks),(l(),X)[(e+24)/8]=BigInt(r.bfree),(l(),X)[(e+32)/
8]=BigInt(r.bavail),(l(),X)[(e+40)/8]=BigInt(r.files),(l(),X)[(e+48)/8]=BigInt(r.ffree),(l(),F)[(e+56)/4]=r.fsid,(l(),F)[(e+
80)/4]=r.flags,(l(),F)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,o){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var s=(l(),ce).slice(e,e+t);a.msync(r,s,o,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Ue(e);return r}};function Kr(e,r,t){if(N)return Z(3,0,1,e,r,t);t=p(t),q.varargs=t;try{var n=q.getStreamFromFD(
e);switch(r){case 0:{var o=sr();if(o<0)return-28;for(;a.streams[o];)o++;var s;return s=a.dupStream(n,o),s.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var o=sr();return n.flags|=o,0}case 5:{var o=Te(),i=0;return(l(),Se)[(o+i)/2]=2,0}case 6:case 7:
return 0}return-28}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function Bn(e,r){if(N)return Z(
4,0,1,e,r);r=p(r);try{return q.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var ye=(e,r,t)=>Hr(e,(l(),ce),r,t);function Zr(e,r){if(N)return Z(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=a.cwd(),n=be(t)+1;return r<n?-68:(ye(t,e,r),n)}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}
function et(e,r,t){if(N)return Z(6,0,1,e,r,t);r=p(r),t=p(t);try{var n=q.getStreamFromFD(e);n.getdents||=a.readdir(n.path);
for(var o=280,s=0,i=a.llseek(n,0,1),u=Math.floor(i/o),d=Math.min(n.getdents.length,u+Math.floor(t/o)),_=u;_<d;_++){var g,
b,h=n.getdents[_];if(h===".")g=n.node.id,b=4;else if(h===".."){var y=a.lookupPath(n.path,{parent:!0});g=y.node.id,b=4}else{
var D;try{D=a.lookupNode(n.node,h)}catch(T){if(T?.errno===28)continue;throw T}g=D.id,b=a.isChrdev(D.mode)?2:a.isDir(D.mode)?
4:a.isLink(D.mode)?10:8}(l(),X)[(r+s)/8]=BigInt(g),(l(),X)[(r+s+8)/8]=BigInt((_+1)*o),(l(),Se)[(r+s+16)/2]=280,(l(),ae)[r+
s+18]=b,ye(h,r+s+19,256),s+=o}return a.llseek(n,_*o,0),s}catch(T){if(typeof a>"u"||T.name!=="ErrnoError")throw T;return-T.
errno}}function rt(e,r,t){if(N)return Z(7,0,1,e,r,t);t=p(t),q.varargs=t;try{var n=q.getStreamFromFD(e);switch(r){case 21509:
return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var o=n.tty.ops.ioctl_tcgets(n),s=Te();(l(),
x)[s/4]=o.c_iflag||0,(l(),x)[(s+4)/4]=o.c_oflag||0,(l(),x)[(s+8)/4]=o.c_cflag||0,(l(),x)[(s+12)/4]=o.c_lflag||0;for(var i=0;i<
32;i++)(l(),ae)[s+i+17]=o.c_cc[i]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=Te(),u=(l(),x)[s/4],d=(l(),x)[(s+4)/4],_=(l(),x)[(s+8)/4],g=(l(),
x)[(s+12)/4],b=[],i=0;i<32;i++)b.push((l(),ae)[s+i+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:u,c_oflag:d,c_cflag:_,
c_lflag:g,c_cc:b})}return 0}case 21519:{if(!n.tty)return-59;var s=Te();return(l(),x)[s/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var s=Te();return a.ioctl(n,r,s)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var h=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=Te();(l(),Se)[s/2]=h[0],(l(),Se)[(s+2)/2]=h[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(y){if(typeof a>"u"||y.name!=="ErrnoError")throw y;return-y.
errno}}function Fn(e,r){if(N)return Z(8,0,1,e,r);e=p(e),r=p(r);try{return e=q.getStr(e),q.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function An(e,r,t,n){if(N)return Z(9,0,1,e,r,t,n);r=p(r),
t=p(t);try{r=q.getStr(r);var o=n&256,s=n&4096;return n=n&-6401,r=q.calculateAt(e,r,s),q.writeStat(t,o?a.lstat(r):a.stat(
r))}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}function tt(e,r,t,n){if(N)return Z(10,0,1,e,
r,t,n);r=p(r),n=p(n),q.varargs=n;try{r=q.getStr(r),r=q.calculateAt(e,r);var o=n?sr():0;return a.open(r,t,o).fd}catch(s){
if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function nt(e,r){if(N)return Z(11,0,1,e,r);e=p(e),r=p(r);
try{return e=q.getStr(e),q.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Cn=()=>fe("");function Tn(e){e=p(e),Nr(e,!J,1,!O,5242880,!1),U.threadInitTLS()}var dr=e=>{if(e instanceof Tr||e=="un\
wind")return ee;k(1,e)},Dn=()=>{if(!rr())try{if(N){Xe()&&Ir(ee);return}nr(ee)}catch(e){dr(e)}},ke=e=>{if(!Ee)try{e(),Dn()}catch(r){
dr(r)}};function pr(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),x),e/4,e);r.value.then(Pe);var t=e+228;
Atomics.store((l(),x),t/4,1)}}var Pe=()=>ke(()=>{var e=Xe();e&&(pr(e),Vt())});function jn(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
Pe);else if(N)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=U.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var He=[];function Rn(e,r,t,n,o){t=p(t),o=p(o),n/=2,He.length=n;for(var s=o/8,i=0;i<n;i++)(l(),X)[s+2*i]?
He[i]=(l(),X)[s+2*i+1]:He[i]=(l(),xe)[s+2*i+1];var u=za[e];U.currentProxiedOperationCallerThread=t;var d=u(...He);return U.
currentProxiedOperationCallerThread=0,typeof d=="bigint"&&(d=p(d)),d}function Gn(e){e=p(e),N?postMessage({cmd:"cleanupTh\
read",thread:e}):jr(e)}function On(e){e=p(e),I&&U.pthreads[e].ref()}var Un=e=>e%4===0&&(e%100!==0||e%400===0),Ln=[0,31,60,
91,121,152,182,213,244,274,305,335],Mn=[0,31,59,90,120,151,181,212,243,273,304,334],Wn=e=>{var r=Un(e.getFullYear()),t=r?
Ln:Mn,n=t[e.getMonth()]+e.getDate()-1;return n};function qn(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(l(),x)[r/4]=t.getSeconds(),
(l(),x)[(r+4)/4]=t.getMinutes(),(l(),x)[(r+8)/4]=t.getHours(),(l(),x)[(r+12)/4]=t.getDate(),(l(),x)[(r+16)/4]=t.getMonth(),
(l(),x)[(r+20)/4]=t.getFullYear()-1900,(l(),x)[(r+24)/4]=t.getDay();var n=Wn(t)|0;(l(),x)[(r+28)/4]=n,(l(),X)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var o=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
i=o.getTimezoneOffset(),u=(s!=i&&t.getTimezoneOffset()==Math.min(i,s))|0;(l(),x)[(r+32)/4]=u}function at(e,r,t,n,o,s,i){
if(N)return Z(12,0,1,e,r,t,n,o,s,i);e=p(e),o=p(o),s=p(s),i=p(i);try{var u=q.getStreamFromFD(n),d=a.mmap(u,e,o,r,t),_=d.ptr;
return(l(),x)[s/4]=d.allocated,(l(),w)[i/8]=BigInt(_),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function ot(e,r,t,n,o,s){if(N)return Z(13,0,1,e,r,t,n,o,s);e=p(e),r=p(r),s=p(s);try{var i=q.getStreamFromFD(o);t&
2&&q.doMsync(e,i,r,n,s)}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var Vn=function(e,r,t,n){
e=p(e),r=p(r),t=p(t),n=p(n);var o=new Date().getFullYear(),s=new Date(o,0,1),i=new Date(o,6,1),u=s.getTimezoneOffset(),d=i.
getTimezoneOffset(),_=Math.max(u,d);(l(),w)[e/8]=BigInt(_*60),(l(),x)[r/4]=+(u!=d);var g=y=>{var D=y>=0?"-":"+",T=Math.abs(
y),f=String(Math.floor(T/60)).padStart(2,"0"),j=String(T%60).padStart(2,"0");return`UTC${D}${f}${j}`},b=g(u),h=g(d);d<u?
(ye(b,t,17),ye(h,n,17)):(ye(b,n,17),ye(h,t,17))},st=()=>performance.timeOrigin+performance.now(),it=()=>Date.now(),zn=e=>e>=
0&&e<=3;function Jn(e,r,t){if(t=p(t),!zn(e))return 28;var n;e===0?n=it():n=st();var o=Math.round(n*1e3*1e3);return(l(),X)[t/
8]=BigInt(o),0}var $n=()=>{},Re=()=>{$e+=1},Pn=()=>{throw Re(),"unwind"},Hn=()=>new Error().stack.toString(),Yn=e=>{var r=Hn(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),o=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var i="",u="",d=0,_=0,g=o.exec(s);if(g?.length==5)i=g[1],u=g[2],d=g[3],_=g[4];else if(g=n.exec(s),g?.length>=4)i=g[1],u=
g[2],d=g[3],_=g[4]|0;else{r+=s+`
`;continue}if(i=="_emscripten_log"||i=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(u=u.substring(u.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${i} (${u}:${d}:${_})
`)}return r=r.replace(/\s+$/,""),r};function Xn(e,r,t){r=p(r);var n=Yn(e);if(!r||t<=0)return be(n)+1;var o=ye(n,r,t);return o+
1}var lt=()=>4294967296,Qn=()=>BigInt(lt()),Kn=()=>2,Zn=()=>I?require("os").cpus().length:navigator.hardwareConcurrency,
ea=e=>{var r=we.buffer.byteLength,t=(e-r+65535)/65536|0;try{return we.grow(BigInt(t)),Ve(),1}catch{}};function ra(e){e=p(
e);var r=(l(),ce).length;if(e<=r)return!1;var t=lt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var o=r*(1+.2/n);o=Math.min(
o,e+100663296);var s=Math.min(t,Yr(Math.max(e,o),65536)),i=ea(s);if(i)return!0}return!1}var Ne=e=>{var r=be(e)+1,t=tr(r);
return ye(e,t,r),t},ta=(e,r)=>{(l(),F)[e/4]=r;var t=(l(),F)[e/4];(l(),F)[(e+4)/4]=(r-t)/4294967296},na=e=>{var r=be(e)+1,
t=bt(r);return t&&ye(e,t,r),t},Be=e=>(l(),F)[e/4]+(l(),x)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
m.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Dt(r);return m.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=gr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=_r(r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{Y(e.mapState==="unmapped");var t=jt(r);return m.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=vr(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=hr(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=wr(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=br(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=yr(
r),n=Rt(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),c.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=kt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=Et(
r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=St(r);return m.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=yr(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Nt(r);return m.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=It(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=xt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Bt(r);return m.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=Ft(r);return m.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=Gt(
r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=At(r);return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Ct(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=Tt(r);return m.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var o=ve(),s=Ne(t);((i,u,d)=>Vr(e).call(null,i,BigInt(u),BigInt(d)))(r,BigInt(s),n),he(o)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),w)[e/8]);t;t=Number((l(),w)[t/8])){var n=(l(),x)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),w)[e/8]=BigInt(r),(l(),w)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),w)[e/8]),t=Number((l(),
w)[(e+8)/8]);return Ue(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),w)[e/8]),t=Number((l(),w)[(e+8)/8]);
return r?Ue(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),xe)[e/8],g:(l(),xe)[(e+8)/8],b:(l(),xe)[(e+16)/8],a:(l(),xe)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),F)[e/4],height:(l(),F)[(e+4)/4],depthOrArrayLayers:(l(),F)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),F)[e/4],y:(l(),F)[(e+4)/4],z:(l(),F)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.getJsObject(Number((l(),w)[e/
8])),mipLevel:(l(),F)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),x)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),F)[(e+8)/4],t=(l(),F)[(e+12)/4];return{offset:Be(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.buffer=m.getJsObject(Number((l(),
w)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number((l(),w)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
F)[(e+16)/4],endOfPassWriteIndex:(l(),F)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var o=r+
32*n,s=m.makeStringFromStringView(o+8);t[s]=(l(),xe)[(o+24)/8]}return t}},makePipelineLayout:e=>e?m.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),w)[(e+8)/8])),constants:m.makePipelineConstants(Number(
(l(),w)[(e+32)/8]),Number((l(),w)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),w)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(f){if(f)return{topology:m.PrimitiveTopology[(l(),x)[(f+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),x)[(f+12)/4]],frontFace:m.FrontFace[(l(),x)[(f+16)/4]],cullMode:m.CullMode[(l(),x)[(f+20)/4]],unclippedDepth:!!(l(),
F)[(f+24)/4]}}function t(f){if(f)return{operation:m.BlendOperation[(l(),x)[f/4]],srcFactor:m.BlendFactor[(l(),x)[(f+4)/4]],
dstFactor:m.BlendFactor[(l(),x)[(f+8)/4]]}}function n(f){if(f)return{alpha:t(f+12),color:t(f+0)}}function o(f){var j=m.TextureFormat[(l(),
x)[(f+8)/4]];return j?{format:j,blend:n(Number((l(),w)[(f+16)/8])),writeMask:(l(),F)[(f+24)/4]}:void 0}function s(f,j){for(var G=[],
$=0;$<f;++$)G.push(o(j+32*$));return G}function i(f){return{compare:m.CompareFunction[(l(),x)[f/4]],failOp:m.StencilOperation[(l(),
x)[(f+4)/4]],depthFailOp:m.StencilOperation[(l(),x)[(f+8)/4]],passOp:m.StencilOperation[(l(),x)[(f+12)/4]]}}function u(f){
if(f)return{format:m.TextureFormat[(l(),x)[(f+8)/4]],depthWriteEnabled:!!(l(),F)[(f+12)/4],depthCompare:m.CompareFunction[(l(),
x)[(f+16)/4]],stencilFront:i(f+20),stencilBack:i(f+36),stencilReadMask:(l(),F)[(f+52)/4],stencilWriteMask:(l(),F)[(f+56)/
4],depthBias:(l(),x)[(f+60)/4],depthBiasSlopeScale:(l(),Ze)[(f+64)/4],depthBiasClamp:(l(),Ze)[(f+68)/4]}}function d(f){return{
format:m.VertexFormat[(l(),x)[(f+8)/4]],offset:Be(f+16),shaderLocation:(l(),F)[(f+24)/4]}}function _(f,j){for(var G=[],$=0;$<
f;++$)G.push(d(j+$*32));return G}function g(f){if(f){var j=m.VertexStepMode[(l(),x)[(f+8)/4]],G=Number((l(),w)[(f+24)/8]);
return!j&&!G?null:{arrayStride:Be(f+16),stepMode:j,attributes:_(G,Number((l(),w)[(f+32)/8]))}}}function b(f,j){if(f){for(var G=[],
$=0;$<f;++$)G.push(g(j+$*40));return G}}function h(f){if(f){var j={module:m.getJsObject(Number((l(),w)[(f+8)/8])),constants:m.
makePipelineConstants(Number((l(),w)[(f+32)/8]),Number((l(),w)[(f+40)/8])),buffers:b(Number((l(),w)[(f+48)/8]),Number((l(),
w)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return j}}function y(f){if(f)return{count:(l(),F)[(f+
8)/4],mask:(l(),F)[(f+12)/4],alphaToCoverageEnabled:!!(l(),F)[(f+16)/4]}}function D(f){if(f){var j={module:m.getJsObject(
Number((l(),w)[(f+8)/8])),constants:m.makePipelineConstants(Number((l(),w)[(f+32)/8]),Number((l(),w)[(f+40)/8])),targets:s(
Number((l(),w)[(f+48)/8]),Number((l(),w)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return j}}var T={
label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),w)[(e+24)/8])),vertex:h(e+32),primitive:r(
e+96),depthStencil:u(Number((l(),w)[(e+128)/8])),multisample:y(e+136),fragment:D(Number((l(),w)[(e+160)/8]))};return T},
fillLimitStruct:(e,r)=>{var t=Number((l(),w)[r/8]);function n(i,u,d,_=0){var g=e[i]??_;(l(),F)[(u+d)/4]=g}function o(i,u,d,_=0){
var g=e[i]??_;ta(u+d,g)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("maxTextureDimension3D",r,16),
n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),n("maxBindingsPerBindGr\
oup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipelineLayout",r,40),n("ma\
xSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPerShaderStage",r,52),n("m\
axStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBufferOffsetAlignment",r,80),
n("minStorageBufferOffsetAlignment",r,84),o("maxUniformBufferBindingSize",r,64),o("maxStorageBufferBindingSize",r,72),n(
"maxVertexBuffers",r,88),o("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBufferArrayStride",r,108),n(
"maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentBytesPerSample",r,120),n("maxC\
omputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeWorkgroupSizeX",r,132),n("m\
axComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPerDimension",r,144),n("maxIm\
mediateSize",r,148),t!==0){(l(),x)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.maxStorageBuffersPerShaderStage),
n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStorageTexturesInVertexStage",s,20,e.
maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(l(),F)[(r+88)/4]=e.subgroupMinSize,(l(),F)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
n=na(t),o=be(e.vendor);m.setStringView(r+8,n,o),n+=o;var s=be(e.architecture);m.setStringView(r+24,n,s),n+=s;var i=be(e.
device);m.setStringView(r+40,n,i),n+=i;var u=be(e.description);m.setStringView(r+56,n,u),n+=u,(l(),x)[(r+72)/4]=2;var d=e.
isFallbackAdapter?3:4;(l(),x)[(r+76)/4]=d,(l(),F)[(r+80)/4]=0,(l(),F)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
"mirror-repeat"],BlendFactor:[,"zero","one","src","one-minus-src","src-alpha","one-minus-src-alpha","dst","one-minus-dst",
"dst-alpha","one-minus-dst-alpha","src-alpha-saturated","constant","one-minus-constant","src1","one-minus-src1","src1-al\
pha","one-minus-src1-alpha"],BlendOperation:[,"add","subtract","reverse-subtract","min","max"],BufferBindingType:[,,"uni\
form","storage","read-only-storage"],BufferMapState:[,"unmapped","pending","mapped"],CompareFunction:[,"never","less","e\
qual","less-equal","greater","not-equal","greater-equal","always"],CompilationInfoRequestStatus:[,"success","callback-ca\
ncelled"],ComponentSwizzle:[,"0","1","r","g","b","a"],CompositeAlphaMode:[,"opaque","premultiplied","unpremultiplied","i\
nherit"],CullMode:[,"none","front","back"],ErrorFilter:[,"validation","out-of-memory","internal"],FeatureLevel:[,"compat\
ibility","core"],FeatureName:{1:"core-features-and-limits",2:"depth-clip-control",3:"depth32float-stencil8",4:"texture-c\
ompression-bc",5:"texture-compression-bc-sliced-3d",6:"texture-compression-etc2",7:"texture-compression-astc",8:"texture\
-compression-astc-sliced-3d",9:"timestamp-query",10:"indirect-first-instance",11:"shader-f16",12:"rg11b10ufloat-renderab\
le",13:"bgra8unorm-storage",14:"float32-filterable",15:"float32-blendable",16:"clip-distances",17:"dual-source-blending",
18:"subgroups",19:"texture-formats-tier1",20:"texture-formats-tier2",21:"primitive-index",22:"texture-component-swizzle",
327692:"chromium-experimental-unorm16-texture-formats",327729:"chromium-experimental-multi-draw-indirect"},FilterMode:[,
"nearest","linear"],FrontFace:[,"ccw","cw"],IndexFormat:[,"uint16","uint32"],InstanceFeatureName:[,"timed-wait-any","sha\
der-source-spirv","multiple-devices-per-adapter"],LoadOp:[,"load","clear"],MipmapFilterMode:[,"nearest","linear"],OptionalBool:[
"false","true"],PowerPreference:[,"low-power","high-performance"],PredefinedColorSpace:[,"srgb","display-p3"],PrimitiveTopology:[
,"point-list","line-list","line-strip","triangle-list","triangle-strip"],QueryType:[,"occlusion","timestamp"],SamplerBindingType:[
,,"filtering","non-filtering","comparison"],Status:[,"success","error"],StencilOperation:[,"keep","zero","replace","inve\
rt","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap"],StorageTextureAccess:[,,"write-only","read-on\
ly","read-write"],StoreOp:[,"store","discard"],SurfaceGetCurrentTextureStatus:[,"success-optimal","success-suboptimal","\
timeout","outdated","lost","error"],TextureAspect:[,"all","stencil-only","depth-only"],TextureDimension:[,"1d","2d","3d"],
TextureFormat:[,"r8unorm","r8snorm","r8uint","r8sint","r16unorm","r16snorm","r16uint","r16sint","r16float","rg8unorm","r\
g8snorm","rg8uint","rg8sint","r32float","r32uint","r32sint","rg16unorm","rg16snorm","rg16uint","rg16sint","rg16float","r\
gba8unorm","rgba8unorm-srgb","rgba8snorm","rgba8uint","rgba8sint","bgra8unorm","bgra8unorm-srgb","rgb10a2uint","rgb10a2u\
norm","rg11b10ufloat","rgb9e5ufloat","rg32float","rg32uint","rg32sint","rgba16unorm","rgba16snorm","rgba16uint","rgba16s\
int","rgba16float","rgba32float","rgba32uint","rgba32sint","stencil8","depth16unorm","depth24plus","depth24plus-stencil8",
"depth32float","depth32float-stencil8","bc1-rgba-unorm","bc1-rgba-unorm-srgb","bc2-rgba-unorm","bc2-rgba-unorm-srgb","bc\
3-rgba-unorm","bc3-rgba-unorm-srgb","bc4-r-unorm","bc4-r-snorm","bc5-rg-unorm","bc5-rg-snorm","bc6h-rgb-ufloat","bc6h-rg\
b-float","bc7-rgba-unorm","bc7-rgba-unorm-srgb","etc2-rgb8unorm","etc2-rgb8unorm-srgb","etc2-rgb8a1unorm","etc2-rgb8a1un\
orm-srgb","etc2-rgba8unorm","etc2-rgba8unorm-srgb","eac-r11unorm","eac-r11snorm","eac-rg11unorm","eac-rg11snorm","astc-4\
x4-unorm","astc-4x4-unorm-srgb","astc-5x4-unorm","astc-5x4-unorm-srgb","astc-5x5-unorm","astc-5x5-unorm-srgb","astc-6x5-\
unorm","astc-6x5-unorm-srgb","astc-6x6-unorm","astc-6x6-unorm-srgb","astc-8x5-unorm","astc-8x5-unorm-srgb","astc-8x6-uno\
rm","astc-8x6-unorm-srgb","astc-8x8-unorm","astc-8x8-unorm-srgb","astc-10x5-unorm","astc-10x5-unorm-srgb","astc-10x6-uno\
rm","astc-10x6-unorm-srgb","astc-10x8-unorm","astc-10x8-unorm-srgb","astc-10x10-unorm","astc-10x10-unorm-srgb","astc-12x\
10-unorm","astc-12x10-unorm-srgb","astc-12x12-unorm","astc-12x12-unorm-srgb"],TextureSampleType:[,,"float","unfilterable\
-float","depth","sint","uint"],TextureViewDimension:[,"1d","2d","2d-array","cube","cube-array","3d"],ToneMappingMode:[,"\
standard","extended"],VertexFormat:[,"uint8","uint8x2","uint8x4","sint8","sint8x2","sint8x4","unorm8","unorm8x2","unorm8\
x4","snorm8","snorm8x2","snorm8x4","uint16","uint16x2","uint16x4","sint16","sint16x2","sint16x4","unorm16","unorm16x2","\
unorm16x4","snorm16","snorm16x2","snorm16x4","float16","float16x2","float16x4","float32","float32x2","float32x3","float3\
2x4","uint32","uint32x2","uint32x3","uint32x4","sint32","sint32x2","sint32x3","sint32x4","unorm10-10-10-2","unorm8x4-bgr\
a"],VertexStepMode:[,"vertex","instance"],WGSLLanguageFeatureName:[,"readonly_and_readwrite_storage_textures","packed_4x\
8_integer_dot_product","unrestricted_pointer_parameters","pointer_composite_access","uniform_buffer_standard_layout","su\
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},aa={undefined:1,unknown:1,destroyed:2},
Fe=()=>{$e-=1};function oa(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(o),s=p(s);var i=m.getJsObject(e),u={};if(s){var d=Number(
(l(),w)[(s+24)/8]);if(d){var _=Number((l(),w)[(s+32)/8]);u.requiredFeatures=Array.from((l(),F).subarray(_/4,(_+d*4)/4),f=>m.
FeatureName[f])}var g=Number((l(),w)[(s+40)/8]);if(g){let f=function(G,$,oe,pe=!1){var K=$+oe,We=(l(),F)[K/4];We!=4294967295&&
(!pe||We!=0)&&(h[G]=We)},j=function(G,$,oe){var pe=$+oe,K=(l(),F)[pe/4],We=(l(),F)[(pe+4)/4];(K!=4294967295||We!=4294967295)&&
(h[G]=Be(pe))};var b=Number((l(),w)[g/8]),h={};if(f("maxTextureDimension1D",g,8),f("maxTextureDimension2D",g,12),f("maxT\
extureDimension3D",g,16),f("maxTextureArrayLayers",g,20),f("maxBindGroups",g,24),f("maxBindGroupsPlusVertexBuffers",g,28),
f("maxBindingsPerBindGroup",g,32),f("maxDynamicUniformBuffersPerPipelineLayout",g,36),f("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),f("maxSampledTexturesPerShaderStage",g,44),f("maxSamplersPerShaderStage",g,48),f("maxStorageBuffersPer\
ShaderStage",g,52),f("maxStorageTexturesPerShaderStage",g,56),f("maxUniformBuffersPerShaderStage",g,60),f("minUniformBuf\
ferOffsetAlignment",g,80),f("minStorageBufferOffsetAlignment",g,84),j("maxUniformBufferBindingSize",g,64),j("maxStorageB\
ufferBindingSize",g,72),f("maxVertexBuffers",g,88),j("maxBufferSize",g,96),f("maxVertexAttributes",g,104),f("maxVertexBu\
fferArrayStride",g,108),f("maxInterStageShaderVariables",g,112),f("maxColorAttachments",g,116),f("maxColorAttachmentByte\
sPerSample",g,120),f("maxComputeWorkgroupStorageSize",g,124),f("maxComputeInvocationsPerWorkgroup",g,128),f("maxComputeW\
orkgroupSizeX",g,132),f("maxComputeWorkgroupSizeY",g,136),f("maxComputeWorkgroupSizeZ",g,140),f("maxComputeWorkgroupsPer\
Dimension",g,144),f("maxImmediateSize",g,148,!0),b!==0){(l(),x)[(b+8)/4];var y=b;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(f("maxStorageBuffersInVertexStage",y,16),f("maxStorageTexturesInVertexStage",y,20),f("maxStorageBuffersInFra\
gmentStage",y,24),f("maxStorageTexturesInFragmentStage",y,28))}u.requiredLimits=h}var D=Number((l(),w)[(s+48)/8]);if(D){
var T={label:m.makeStringFromOptionalStringView(D+8)};u.defaultQueue=T}u.label=m.makeStringFromOptionalStringView(s+8)}Re(),
m.Internals.futureInsert(r,i.requestDevice(u).then(f=>{Fe(),ke(()=>{m.Internals.jsObjectInsert(o,f.queue),m.Internals.jsObjectInsert(
n,f),c.peercomputeOnDevice?.(f),n=BigInt(n),m.Internals.futureInsert(t,f.lost.then(j=>{ke(()=>{f.onuncapturederror=oe=>{};
var G=ve(),$=Ne(j.message);kr(t,aa[j.reason],BigInt($)),he(G)})})),f.onuncapturederror=j=>{var G=5;j.error instanceof GPUValidationError?
G=2:j.error instanceof GPUOutOfMemoryError?G=3:j.error instanceof GPUInternalError&&(G=4);var $=ve(),oe=Ne(j.error.message);
Ut(BigInt(n),G,BigInt(oe)),he($)},Sr(r,1,BigInt(n),0n)})},f=>{Fe(),ke(()=>{var j=ve(),G=Ne(f.message);Sr(r,3,BigInt(n),BigInt(
G)),t&&kr(t,4,BigInt(G)),he(j)})}))}function sa(e){e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}var ia=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=(()=>{
var o=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=o.getMappedRange(r,t)}catch{return 0n}var i=zt(16,s.byteLength);return(l(),
ce).set(new Uint8Array(s),i),m.Internals.bufferOnUnmaps[e].push(()=>yt(i)),i})();return BigInt(n)},la=function(e,r,t,n,o){
e=p(e),r=p(r),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e);m.Internals.bufferOnUnmaps[e]=[],o==-1&&(o=void 0),Re(),m.Internals.
futureInsert(r,s.mapAsync(t,n,o).then(()=>{Fe(),ke(()=>{Er(r,1,0n)})},i=>{Fe(),ke(()=>{var u=ve(),d=Ne(i.message),_=i.name===
"AbortError"?4:i.name==="OperationError"?3:0;Er(r,_,BigInt(d)),delete m.Internals.bufferOnUnmaps[e]})}))};function ua(e){
e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.
bufferOnUnmaps[e],r.unmap()}}function ca(e){e=p(e),delete m.Internals.jsObjects[e]}function ma(e,r,t){e=p(e),r=p(r),t=p(
t);var n=!!(l(),F)[(r+40)/4],o={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),F)[(r+24)/4],size:Be(r+32),mappedAtCreation:n},
s=m.getJsObject(e),i;try{i=s.createBuffer(o)}catch{return!1}return m.Internals.jsObjectInsert(t,i),n&&(m.Internals.bufferOnUnmaps[t]=
[]),!0}function fa(e,r,t){e=p(e),r=p(r),t=p(t);var n=Number((l(),w)[r/8]),o=(l(),x)[(n+8)/4],s={label:m.makeStringFromOptionalStringView(
r+8),code:""};switch(o){case 2:{s.code=m.makeStringFromStringView(n+16);break}}var i=m.getJsObject(e);m.Internals.jsObjectInsert(
t,i.createShaderModule(s))}var da=e=>{const r=m.getJsObject(e);r.onuncapturederror=null,r.destroy()};function pa(e,r,t,n){
r=p(r),t=p(t),n=p(n);var o;if(t){o={featureLevel:m.FeatureLevel[(l(),x)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),
x)[(t+12)/4]],forceFallbackAdapter:!!(l(),F)[(t+16)/4]};var s=Number((l(),w)[t/8]);if(s!==0){(l(),x)[(s+8)/4];var i=s;o.
xrCompatible=!!(l(),F)[(i+16)/4]}}if(!("gpu"in navigator)){var u=ve(),d=Ne("WebGPU not available on this browser (naviga\
tor.gpu is not available)");Me(r,3,BigInt(n),BigInt(d)),he(u);return}Re(),m.Internals.futureInsert(r,navigator.gpu.requestAdapter(
o).then(_=>{Fe(),ke(()=>{if(_)m.Internals.jsObjectInsert(n,_),Me(r,1,BigInt(n),0n);else{var g=ve(),b=Ne("WebGPU not avai\
lable on this browser (requestAdapter returned null)");Me(r,3,BigInt(n),BigInt(b)),he(g)}})},_=>{Fe(),ke(()=>{var g=ve(),
b=Ne(_.message);Me(r,4,BigInt(n),BigInt(b)),he(g)})}))}var ga=function(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);Re(),m.
Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Fe(),ke(()=>{Ot(r,1)})}))},ut=function(e,r,t){return e=p(e),r=
p(r),t=p(t),de.handleAsync(async()=>{var n=[];if(t){var o=(l(),x)[t/4];n.length=r+1,n[r]=new Promise(d=>setTimeout(d,o,0))}else
n.length=r;for(var s=0;s<r;++s){var i=Be(e+s*8);if(!(i in m.Internals.futures))return i;n[s]=m.Internals.futures[i]}const u=await Promise.
race(n);return delete m.Internals.futures[u],u})};ut.isAsync=!0;var Ye={},_a=()=>B||"./this.program",Le=()=>{if(!Le.strings){
var e=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_us\
er",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:_a()};for(var t in Ye)Ye[t]===void 0?delete r[t]:r[t]=Ye[t];var n=[];
for(var t in r)n.push(`${t}=${r[t]}`);Le.strings=n}return Le.strings};function ct(e,r){if(N)return Z(14,0,1,e,r);e=p(e),
r=p(r);var t=0,n=0;for(var o of Le()){var s=r+t;(l(),w)[(e+n)/8]=BigInt(s),t+=ye(o,s,1/0)+1,n+=8}return 0}function mt(e,r){
if(N)return Z(15,0,1,e,r);e=p(e),r=p(r);var t=Le();(l(),w)[e/8]=BigInt(t.length);var n=0;for(var o of t)n+=be(o)+1;return(l(),
w)[r/8]=BigInt(n),0}function ft(e){if(N)return Z(16,0,1,e);try{var r=q.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>
"u"||t.name!=="ErrnoError")throw t;return t.errno}}var va=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var i=Number((l(),w)[r/8]),
u=Number((l(),w)[(r+8)/8]);r+=16;var d=a.read(e,(l(),ae),i,u,n);if(d<0)return-1;if(o+=d,d<u)break}return o};function dt(e,r,t,n){
if(N)return Z(17,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var o=q.getStreamFromFD(e),s=va(o,r,t);return(l(),w)[n/8]=BigInt(
s),0}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return i.errno}}function pt(e,r,t,n){if(N)return Z(18,0,1,e,
r,t,n);r=p(r),n=p(n);try{if(isNaN(r))return 61;var o=q.getStreamFromFD(e);return a.llseek(o,r,t),(l(),X)[n/8]=BigInt(o.position),
o.getdents&&r===0&&t===0&&(o.getdents=null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var ha=(e,r,t,n)=>{
for(var o=0,s=0;s<t;s++){var i=Number((l(),w)[r/8]),u=Number((l(),w)[(r+8)/8]);r+=16;var d=a.write(e,(l(),ae),i,u,n);if(d<
0)return-1;if(o+=d,d<u)break}return o};function gt(e,r,t,n){if(N)return Z(19,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var o=q.
getStreamFromFD(e),s=ha(o,r,t);return(l(),w)[n/8]=BigInt(s),0}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return i.
errno}}function wa(e,r){e=p(e),r=p(r);try{return ir((l(),ce).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="Errn\
oError")throw t;return t.errno}}function ba(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(t.info,
r),1}function ya(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function ka(e,r){e=p(e);
var t=m.getJsObject(e);return t.features.has(m.FeatureName[r])}var Ea=function(e){e=p(e);var r=(()=>{var t=m.getJsObject(
e);return t.size})();return BigInt(r)},Sa=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(
r+8),timestampWrites:m.makePassTimestampWrites(Number((l(),w)[(r+24)/8]))});var o=m.getJsObject(e),s=wr(0n);return m.Internals.
jsObjectInsert(s,o.beginComputePass(n)),s})();return BigInt(t)};function Na(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(
o),s=p(s);var i=m.getJsObject(e),u=m.getJsObject(r),d=m.getJsObject(n);i.copyBufferToBuffer(u,t,d,o,s)}var Ia=function(e,r){
e=p(e);var t=(()=>{var n=m.getJsObject(e),o=vr(0n);return m.Internals.jsObjectInsert(o,n.finish()),o})();return BigInt(t)};
function xa(e,r,t,n){e=p(e);var o=m.getJsObject(e);o.dispatchWorkgroups(r,t,n)}function Ba(e){e=p(e);var r=m.getJsObject(
e);r.end()}function Fa(e,r,t,n,o){e=p(e),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(t);n==0?s.setBindGroup(
r,i):s.setBindGroup(r,i,(l(),F),o/4,n)}function Aa(e,r){e=p(e),r=p(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var Ca=function(e,r){e=p(e);var t=(()=>{var n=m.getJsObject(e),o=_r(0n);return m.Internals.jsObjectInsert(o,n.getBindGroupLayout(
r)),o})();return BigInt(t)},Ta=function(e,r){e=p(e),r=p(r);var t=(()=>{function n(d){var _=Number((l(),w)[(d+16)/8]),g=Number(
(l(),w)[(d+40)/8]),b=Number((l(),w)[(d+48)/8]),h=0;m.iterateExtensions(d,{327681:T=>{h=Number((l(),w)[(T+16)/8])}});var y;
if(_){var D=Be(d+32);D==-1&&(D=void 0),y={buffer:m.getJsObject(_),offset:Be(d+24),size:D}}else y=m.getJsObject(g||b||h);
return{binding:(l(),F)[(d+8)/4],resource:y}}function o(d,_){for(var g=[],b=0;b<d;++b)g.push(n(_+56*b));return g}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),w)[(r+24)/8])),entries:o(Number((l(),w)[(r+32)/8]),
Number((l(),w)[(r+40)/8]))},i=m.getJsObject(e),u=gr(0n);return m.Internals.jsObjectInsert(u,i.createBindGroup(s)),u})();
return BigInt(t)},Da=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var o=m.getJsObject(e),s=hr(0n);return m.Internals.jsObjectInsert(s,o.createCommandEncoder(n)),s})();return BigInt(t)},ja=function(e,r){
e=p(e),r=p(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),o=m.getJsObject(e),s=br(0n);return m.Internals.jsObjectInsert(
s,o.createComputePipeline(n)),s})();return BigInt(t)};function Ra(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var Ga=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=m.getJsObject(
e),o=Array.from((l(),X).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(o)};function Oa(e,r,t,n,o){e=p(e),r=p(r),t=
p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(r),u=(l(),ce).subarray(n,n+o);s.writeBuffer(i,t,u,0,o)}var de={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;de.asyncExports=new Set;var t={};for(let[o,s]of Object.entries(
e))if(typeof s=="function"){r.test(o)&&(de.asyncExports.add(s),s=de.makeAsyncFunction(s));var n=de.instrumentFunction(s);
t[o]=n}else t[o]=s;return t},asyncExports:null,isAsyncExport(e){return de.asyncExports?.has(e)},handleAsync:async e=>{Re();
try{return await e()}finally{Fe()}},handleSleep:e=>de.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},_t=e=>{var r=c["_"+e];return r},Ua=(e,r)=>{(l(),ae).set(e,r)},vt=(e,r,t,n,o)=>{var s={pointer:T=>BigInt(T),
string:T=>{var f=0;return T!=null&&T!==0&&(f=Ne(T)),BigInt(f)},array:T=>{var f=tr(T.length);return Ua(T,f),BigInt(f)}};function i(T){
return r==="string"?Ue(Number(T)):r==="pointer"?Number(T):r==="boolean"?!!T:T}var u=_t(e),d=[],_=0;if(n)for(var g=0;g<n.
length;g++){var b=s[t[g]];b?(_===0&&(_=ve()),d[g]=b(n[g])):d[g]=n[g]}var h=u(...d);function y(T){return _!==0&&he(_),i(T)}
var D=o?.async;return D?h.then(y):(h=y(h),h)},La=(e,r,t,n)=>{var o=!t||t.every(i=>i==="number"||i==="boolean"),s=r!=="st\
ring";return s&&o&&!n?_t(e):(...i)=>vt(e,r,t,i,n)},Ma=(...e)=>a.createPath(...e),Wa=(...e)=>a.unlink(...e),qa=(...e)=>a.
createLazyFile(...e),Va=(...e)=>a.createDevice(...e);if(U.init(),a.createPreloadedFile=xn,a.preloadFile=fr,a.staticInit(),
on(),c.noExitRuntime&&(or=c.noExitRuntime),c.preloadPlugins&&(Qr=c.preloadPlugins),c.print&&(ie=c.print),c.printErr&&(te=
c.printErr),c.wasmBinary&&(ge=c.wasmBinary),c.arguments&&c.arguments,c.thisProgram&&(B=c.thisProgram),c.preInit)for(typeof c.
preInit=="function"&&(c.preInit=[c.preInit]);c.preInit.length>0;)c.preInit.shift()();c.ENV=Ye,c.mmapAlloc=cr,c.wasmMemory=
we,c.addRunDependency=Je,c.removeRunDependency=ze,c.ccall=vt,c.cwrap=La,c.FS_preloadFile=fr,c.FS_unlink=Wa,c.FS_createPath=
Ma,c.FS_createDevice=Va,c.FS=a,c.FS_createDataFile=Xr,c.FS_createLazyFile=qa,c.MEMFS=C;var za=[Lr,Mr,Jr,Kr,Bn,Zr,et,rt,Fn,
An,tt,nt,at,ot,ct,mt,ft,dt,pt,gt];function ht(e,r,t,n){return de.handleAsync(async()=>await A(Ue(Number(e)),Number(r),Number(
t),Number(n)))}ht.sig="jjjjj";var wt,bt,yt,gr,_r,vr,hr,wr,br,kt,Et,St,Nt,It,xt,Bt,Ft,At,Ct,Tt,Dt,jt,Rt,yr,Gt,kr,Er,Me,Sr,
Ot,Ut,Xe,Lt,Nr,Mt,Wt,qt,Ir,Vt,zt,Jt,$t,Pt,Ht,Yt,Xt;function Ja(e){c._wllama_malloc=e.wllama_malloc,c._wllama_start=e.wllama_start,
c._wllama_action=e.wllama_action,c._wllama_exit=e.wllama_exit,c._wllama_debug=e.wllama_debug,wt=c._main=e.main,bt=e.malloc,
yt=e.free,gr=e.emwgpuCreateBindGroup,_r=e.emwgpuCreateBindGroupLayout,vr=e.emwgpuCreateCommandBuffer,hr=e.emwgpuCreateCommandEncoder,
wr=e.emwgpuCreateComputePassEncoder,br=e.emwgpuCreateComputePipeline,kt=e.emwgpuCreateExternalTexture,Et=e.emwgpuCreatePipelineLayout,
St=e.emwgpuCreateQuerySet,Nt=e.emwgpuCreateRenderBundle,It=e.emwgpuCreateRenderBundleEncoder,xt=e.emwgpuCreateRenderPassEncoder,
Bt=e.emwgpuCreateRenderPipeline,Ft=e.emwgpuCreateSampler,At=e.emwgpuCreateSurface,Ct=e.emwgpuCreateTexture,Tt=e.emwgpuCreateTextureView,
Dt=e.emwgpuCreateAdapter,jt=e.emwgpuCreateBuffer,Rt=e.emwgpuCreateDevice,yr=e.emwgpuCreateQueue,Gt=e.emwgpuCreateShaderModule,
kr=e.emwgpuOnDeviceLostCompleted,Er=e.emwgpuOnMapAsyncCompleted,Me=e.emwgpuOnRequestAdapterCompleted,Sr=e.emwgpuOnRequestDeviceCompleted,
Ot=e.emwgpuOnWorkDoneCompleted,Ut=e.emwgpuOnUncapturedError,e._emscripten_tls_init,Xe=e.pthread_self,Lt=e.emscripten_builtin_memalign,
Nr=e._emscripten_thread_init,Mt=e._emscripten_thread_crashed,Wt=e._emscripten_run_js_on_main_thread,qt=e._emscripten_thread_free_data,
Ir=e._emscripten_thread_exit,Vt=e._emscripten_check_mailbox,zt=e.memalign,Jt=e.__trap,$t=e.emscripten_stack_set_limits,Pt=
e._emscripten_stack_restore,Ht=e._emscripten_stack_alloc,Yt=e.emscripten_stack_get_current,Xt=e.__indirect_function_table}
var Ge;function $a(){Ge={__asyncjs__js_file_read:ht,__pthread_create_js:$r,__syscall_fcntl64:Kr,__syscall_getcwd:Zr,__syscall_getdents64:et,
__syscall_ioctl:rt,__syscall_openat:tt,__syscall_stat64:nt,_abort_js:Cn,_emscripten_init_main_thread_js:Tn,_emscripten_notify_mailbox_postmessage:jn,
_emscripten_receive_on_main_thread_js:Rn,_emscripten_thread_cleanup:Gn,_emscripten_thread_mailbox_await:pr,_emscripten_thread_set_strongref:On,
_localtime_js:qn,_mmap_js:at,_munmap_js:ot,_tzset_js:Vn,clock_time_get:Jn,emscripten_check_blocking_allowed:$n,emscripten_date_now:it,
emscripten_exit_with_live_runtime:Pn,emscripten_get_callstack:Xn,emscripten_get_heap_max:Qn,emscripten_get_now:st,emscripten_has_asyncify:Kn,
emscripten_num_logical_cores:Zn,emscripten_resize_heap:ra,emwgpuAdapterRequestDevice:oa,emwgpuBufferDestroy:sa,emwgpuBufferGetConstMappedRange:ia,
emwgpuBufferMapAsync:la,emwgpuBufferUnmap:ua,emwgpuDelete:ca,emwgpuDeviceCreateBuffer:ma,emwgpuDeviceCreateShaderModule:fa,
emwgpuDeviceDestroy:da,emwgpuInstanceRequestAdapter:pa,emwgpuQueueOnSubmittedWorkDone:ga,emwgpuWaitAny:ut,environ_get:ct,
environ_sizes_get:mt,exit:nr,fd_close:ft,fd_read:dt,fd_seek:pt,fd_write:gt,memory:we,random_get:wa,wgpuAdapterGetInfo:ba,
wgpuAdapterGetLimits:ya,wgpuAdapterHasFeature:ka,wgpuBufferGetSize:Ea,wgpuCommandEncoderBeginComputePass:Sa,wgpuCommandEncoderCopyBufferToBuffer:Na,
wgpuCommandEncoderFinish:Ia,wgpuComputePassEncoderDispatchWorkgroups:xa,wgpuComputePassEncoderEnd:Ba,wgpuComputePassEncoderSetBindGroup:Fa,
wgpuComputePassEncoderSetPipeline:Aa,wgpuComputePipelineGetBindGroupLayout:Ca,wgpuDeviceCreateBindGroup:Ta,wgpuDeviceCreateCommandEncoder:Da,
wgpuDeviceCreateComputePipeline:ja,wgpuInstanceHasWGSLLanguageFeature:Ra,wgpuQueueSubmit:Ga,wgpuQueueWriteBuffer:Oa}}function Pa(e){
e=Object.assign({},e);var r=_=>(g,b,h)=>_(g,BigInt(b||0),BigInt(h||0)),t=_=>g=>Number(_(BigInt(g))),n=_=>g=>_(BigInt(g)),
o=_=>()=>Number(_()),s=_=>(g,b)=>Number(_(BigInt(g),BigInt(b))),i=_=>(g,b,h,y,D,T)=>_(BigInt(g),b,h,y,D,T),u=_=>(g,b,h,y,D)=>_(
g,BigInt(b),h,BigInt(y),D),d=_=>(g,b)=>_(BigInt(g),BigInt(b));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=o(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
i(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=u(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
d(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=o(e.emscripten_stack_get_current),e}async function Ha(){var e=wt,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,Wr(n,!0),n}catch(o){return dr(o)}}function Qe(){if(Ae>0){Oe=Qe;return}
if(N){Fr();return}if(sn(),Ae>0){Oe=Qe;return}async function e(){if(c.calledRun=!0,!Ee){Fr(),c.onRuntimeInitialized?.();var r=c.
noInitialRun||!1;r||await Ha(),ln()}}c.setStatus?(c.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>c.setStatus(""),
1),e()},1)):e()}var Ie;return N||(Cr(),Qe()),c}var rn=1,tn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
GlueMsgError",fields:[{type:"str",name:"message",isNullable:!1}]},load_req:{name:"load_req",structName:"glue_msg_load_re\
q",className:"GlueMsgLoadReq",fields:[{type:"arr_str",name:"model_paths",isNullable:!1},{type:"str",name:"mmproj_path",isNullable:!0},
{type:"bool",name:"n_ctx_auto",isNullable:!1},{type:"bool",name:"use_mmap",isNullable:!1},{type:"bool",name:"use_mlock",
isNullable:!1},{type:"int",name:"n_gpu_layers",isNullable:!1},{type:"int",name:"n_ctx",isNullable:!1},{type:"int",name:"\
n_threads",isNullable:!1},{type:"str",name:"model_alias",isNullable:!0},{type:"int",name:"log_level",isNullable:!0},{type:"\
bool",name:"embeddings",isNullable:!0},{type:"bool",name:"offload_kqv",isNullable:!0},{type:"int",name:"n_batch",isNullable:!0},
{type:"int",name:"n_ubatch",isNullable:!0},{type:"int",name:"n_parallel",isNullable:!0},{type:"str",name:"pooling_type",
isNullable:!0},{type:"str",name:"rope_scaling_type",isNullable:!0},{type:"float",name:"rope_freq_base",isNullable:!0},{type:"\
float",name:"rope_freq_scale",isNullable:!0},{type:"float",name:"yarn_ext_factor",isNullable:!0},{type:"float",name:"yar\
n_attn_factor",isNullable:!0},{type:"float",name:"yarn_beta_fast",isNullable:!0},{type:"float",name:"yarn_beta_slow",isNullable:!0},
{type:"int",name:"yarn_orig_ctx",isNullable:!0},{type:"str",name:"cache_type_k",isNullable:!0},{type:"str",name:"cache_t\
ype_v",isNullable:!0},{type:"bool",name:"kv_unified",isNullable:!0},{type:"bool",name:"flash_attn",isNullable:!0},{type:"\
bool",name:"swa_full",isNullable:!0},{type:"int",name:"n_ctx_checkpoints",isNullable:!0},{type:"int",name:"checkpoint_mi\
n_step",isNullable:!0},{type:"str",name:"chat_template",isNullable:!0},{type:"bool",name:"jinja",isNullable:!0},{type:"a\
rr_str",name:"default_template_kwargs_keys",isNullable:!0},{type:"arr_str",name:"default_template_kwargs_vals",isNullable:!0},
{type:"bool",name:"reasoning",isNullable:!0},{type:"int",name:"image_min_tokens",isNullable:!0},{type:"int",name:"image_\
max_tokens",isNullable:!0},{type:"bool",name:"warmup",isNullable:!0},{type:"bool",name:"no_kv_offload",isNullable:!0},{type:"\
bool",name:"mmproj_offload",isNullable:!0},{type:"bool",name:"cont_batching",isNullable:!0},{type:"int",name:"n_keep",isNullable:!0},
{type:"bool",name:"ctx_shift",isNullable:!0},{type:"bool",name:"cache_idle_slots",isNullable:!0},{type:"int",name:"n_cac\
he_reuse",isNullable:!0},{type:"arr_str",name:"lora_paths",isNullable:!0},{type:"arr_float",name:"lora_scales",isNullable:!0},
{type:"bool",name:"lora_init_without_apply",isNullable:!0},{type:"str",name:"spec_draft_model",isNullable:!0},{type:"int",
name:"spec_draft_ngl",isNullable:!0},{type:"int",name:"spec_draft_n_max",isNullable:!0},{type:"int",name:"spec_draft_n_m\
in",isNullable:!0},{type:"float",name:"spec_draft_p_min",isNullable:!0},{type:"int",name:"spec_draft_threads",isNullable:!0},
{type:"int",name:"spec_draft_threads_batch",isNullable:!0},{type:"arr_str",name:"kv_overrides_keys",isNullable:!0},{type:"\
arr_str",name:"kv_overrides_vals",isNullable:!0},{type:"int",name:"reasoning_budget_tokens",isNullable:!0},{type:"str",name:"\
reasoning_budget_message",isNullable:!0},{type:"str",name:"reasoning_format",isNullable:!0},{type:"bool",name:"skip_chat\
_parsing",isNullable:!0},{type:"bool",name:"prefill_assistant",isNullable:!0}]},load_res:{name:"load_res",structName:"gl\
ue_msg_load_res",className:"GlueMsgLoadRes",fields:[{type:"bool",name:"success",isNullable:!1},{type:"int",name:"n_ctx",
isNullable:!1},{type:"int",name:"n_batch",isNullable:!1},{type:"int",name:"n_ubatch",isNullable:!1},{type:"int",name:"n_\
vocab",isNullable:!1},{type:"int",name:"n_ctx_train",isNullable:!1},{type:"int",name:"n_embd",isNullable:!1},{type:"int",
name:"n_layer",isNullable:!1},{type:"arr_str",name:"metadata_key",isNullable:!1},{type:"arr_str",name:"metadata_val",isNullable:!1},
{type:"int",name:"token_bos",isNullable:!1},{type:"int",name:"token_eos",isNullable:!1},{type:"int",name:"token_eot",isNullable:!1},
{type:"arr_int",name:"list_tokens_eog",isNullable:!1},{type:"bool",name:"add_bos_token",isNullable:!1},{type:"bool",name:"\
add_eos_token",isNullable:!1},{type:"bool",name:"has_encoder",isNullable:!1},{type:"int",name:"token_decoder_start",isNullable:!1},
{type:"str",name:"media_marker",isNullable:!1},{type:"bool",name:"has_image_input",isNullable:!1},{type:"bool",name:"has\
_audio_input",isNullable:!1}]},cmpl_req:{name:"cmpl_req",structName:"glue_msg_completion_req",className:"GlueMsgCompleti\
onReq",fields:[{type:"bool",name:"is_chat",isNullable:!1},{type:"str",name:"data_json",isNullable:!1},{type:"arr_raw",name:"\
files",isNullable:!1}]},cmpl_res:{name:"cmpl_res",structName:"glue_msg_completion_res",className:"GlueMsgCompletionRes",
fields:[{type:"bool",name:"success",isNullable:!1},{type:"int",name:"req_id",isNullable:!1}]},embd_req:{name:"embd_req",
structName:"glue_msg_embedding_req",className:"GlueMsgEmbeddingReq",fields:[{type:"str",name:"data_json",isNullable:!1},
{type:"arr_raw",name:"files",isNullable:!1}]},embd_res:{name:"embd_res",structName:"glue_msg_embedding_res",className:"G\
lueMsgEmbeddingRes",fields:[{type:"bool",name:"success",isNullable:!1},{type:"int",name:"req_id",isNullable:!1}]},rrnk_req:{
name:"rrnk_req",structName:"glue_msg_rerank_req",className:"GlueMsgRerankReq",fields:[{type:"str",name:"data_json",isNullable:!1}]},
rrnk_res:{name:"rrnk_res",structName:"glue_msg_rerank_res",className:"GlueMsgRerankRes",fields:[{type:"bool",name:"succe\
ss",isNullable:!1},{type:"int",name:"req_id",isNullable:!1}]},sys1_req:{name:"sys1_req",structName:"glue_msg_systemone_r\
eq",className:"GlueMsgSystemoneReq",fields:[{type:"str",name:"data_json",isNullable:!1}]},sys1_res:{name:"sys1_res",structName:"\
glue_msg_systemone_res",className:"GlueMsgSystemoneRes",fields:[{type:"bool",name:"success",isNullable:!1},{type:"int",name:"\
req_id",isNullable:!1}]},gres_req:{name:"gres_req",structName:"glue_msg_get_result_req",className:"GlueMsgGetResultReq",
fields:[{type:"int",name:"req_id",isNullable:!1}]},gres_res:{name:"gres_res",structName:"glue_msg_get_result_res",className:"\
GlueMsgGetResultRes",fields:[{type:"bool",name:"success",isNullable:!1},{type:"bool",name:"has_more",isNullable:!1},{type:"\
bool",name:"is_error",isNullable:!1},{type:"str",name:"data_json",isNullable:!1}]},cncl_req:{name:"cncl_req",structName:"\
glue_msg_cancel_req",className:"GlueMsgCancelReq",fields:[{type:"int",name:"req_id",isNullable:!1}]},cncl_res:{name:"cnc\
l_res",structName:"glue_msg_cancel_res",className:"GlueMsgCancelRes",fields:[{type:"bool",name:"success",isNullable:!1}]},
tbop_req:{name:"tbop_req",structName:"glue_msg_test_backend_ops_req",className:"GlueMsgTestBackendOpsReq",fields:[{type:"\
arr_str",name:"args",isNullable:!1}]},tbop_res:{name:"tbop_res",structName:"glue_msg_test_backend_ops_res",className:"Gl\
ueMsgTestBackendOpsRes",fields:[{type:"int",name:"retcode",isNullable:!1},{type:"bool",name:"success",isNullable:!1}]}},
qe=new Uint8Array([71,76,85,69]),xr=0,oo=1,so=2,io=3,lo=4,uo=5,co=6,mo=7,fo=8,po=9,go=10,nn={str:lo,int:so,float:io,bool:oo,
raw:uo,arr_str:po,arr_int:mo,arr_float:fo,arr_bool:co,arr_raw:go,null:xr};function _o(c){let A=0;const V=new DataView(c.
buffer),O=()=>{const L=V.getUint32(A,!0);return A+=4,L},J=()=>{const L=V.getInt32(A,!0);return A+=4,L},I=()=>{const L=V.
getFloat32(A,!0);return A+=4,L},N=()=>O()!==0,P=L=>{const Q=L??O(),le=new TextDecoder().decode(c.slice(A,A+Q));return A+=
Q,le},B=()=>{const L=O(),Q=c.slice(A,A+L);return A+=L,Q},k=L=>{const Q=O(),le=new Array(Q);for(let ie=0;ie<Q;ie++)le[ie]=
L();return le},E=()=>null,R=L=>{switch(L.type){case"str":return P();case"int":return J();case"float":return I();case"boo\
l":return N();case"raw":return B();case"arr_str":return k(P);case"arr_int":return k(J);case"arr_float":return k(I);case"\
arr_bool":return k(N);case"arr_raw":return k(B);case"null":return E()}},M=c[0]===qe[0]&&c[1]===qe[1]&&c[2]===qe[2]&&c[3]===
qe[3];if(A+=4,!M)throw new Error("Invalid magic number");if(O()!==rn)throw new Error("Invalid version number");const v=P(
8),H=tn[v];if(!H)throw new Error(`Unknown message name: ${v}`);const ne={_name:v};for(const L of H.fields){const Q=O();if(Q===
xr){if(!L.isNullable)throw new Error(`${v}: Expect field ${L.name} to be non-nullable`);ne[L.name]=null;continue}if(Q!==
nn[L.type])throw new Error(`${v}: Expect field ${L.name} to have type ${L.type}`);ne[L.name]=R(L)}return ne}function vo(c){
const A=tn[c._name];if(!A)throw new Error(`Unknown message name: ${c._name}`);const V=[],O=S=>{const v=new ArrayBuffer(4);
new DataView(v).setUint32(0,S,!0),V.push(new Uint8Array(v))},J=S=>{const v=new ArrayBuffer(4);new DataView(v).setInt32(0,
S,!0),V.push(new Uint8Array(v))},I=S=>{const v=new ArrayBuffer(4);new DataView(v).setFloat32(0,S,!0),V.push(new Uint8Array(
v))},N=S=>{O(S?1:0)},P=S=>{const v=new TextEncoder().encode(S);O(v.byteLength),V.push(v)},B=S=>{O(S.byteLength),V.push(S)},
k=(S,v)=>{O(S.length);for(const H of S)v(H)};V.push(qe),O(rn);{const S=new TextEncoder().encode(c._name);V.push(S)}for(const S of A.
fields){const v=c[S.name];if(!S.isNullable&&v==null)throw new Error(`${c._name}: Expect field ${S.name} to be non-nullab\
le`);if(v==null){O(xr);continue}switch(O(nn[S.type]),S.type){case"str":P(v);break;case"int":J(v);break;case"float":I(v);
break;case"bool":N(v);break;case"raw":B(v);break;case"arr_str":k(v,P);break;case"arr_int":k(v,J);break;case"arr_float":k(
v,I);break;case"arr_bool":k(v,N);break;case"arr_raw":k(v,B);break}}const E=V.reduce((S,v)=>S+v.byteLength,0),R=new Uint8Array(
E);let M=0;for(const S of V)R.set(S,M),M+=S.byteLength;return R}const an=4*1024**2,Kt=1024*1024;function ho({files:c,reader:A,
getMemory:V,getSignal:O=()=>{}}){const J=new Map(c.map(I=>[I.name,I]));return async(I,N,P,B)=>{const k=J.get(I.replace(/^\/?models\//,
""));if(!k||![N,P,B].every(R=>Number.isSafeInteger(R)&&R>=0)||N>k.size)throw new Error("Invalid GGUF native file read");
const E=Math.min(P,k.size-N);if(!Number.isSafeInteger(B+E)||B+E>V().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let R=0;R<E;){me(O());const M=Math.min(an,E-R),S=await A.read(k.path,N+R,M,{signal:O()});if(me(O()),
!(S instanceof Uint8Array)||S.byteLength!==M)throw new Error("Incomplete GGUF artifact range");new Uint8Array(V()).set(S,
B+R),R+=M}return BigInt(E)}}function wo(c,A){c.FS.mkdir("/models"),c.FS.mount(c.MEMFS,{root:"."},"/models");const V=new Map(
A.map(I=>[I.name,I])),O=c.MEMFS.stream_ops;for(const I of["read","llseek"]){const N=O[I];O[I]=function(P,...B){const k=V.
get(P.node.name);return k&&(P.node.usedBytes=k.size),N.call(this,P,...B)},c.MEMFS.ops_table.file.stream[I]=O[I]}const J=O.
mmap;O.mmap=function(I,...N){if(V.has(I.node.name))throw new Error("GGUF artifact mmap is prohibited");return J.call(this,
I,...N)},c.MEMFS.ops_table.file.stream.mmap=O.mmap;for(const I of A)c.FS_createDataFile("/models",I.name,new Uint8Array(
0),!0,!1,!0)}function bo(c,A,{collect:V=!1,onLost:O}={}){if(A.device=c,A.runtimeFeatures=[...c.features],A.runtimeAdapter=
c.adapterInfo?{vendor:c.adapterInfo.vendor,architecture:c.adapterInfo.architecture,isFallbackAdapter:c.adapterInfo.isFallbackAdapter??
!1}:null,!c.features.has("shader-f16")||A.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(c.lost.then(B=>O?.(B)),!V)return()=>{};const J=Object.getOwnPropertyDescriptor(c,
"createCommandEncoder"),I=Object.getOwnPropertyDescriptor(c.queue,"submit"),N=c.createCommandEncoder.bind(c),P=c.queue.submit.
bind(c.queue);return c.createCommandEncoder=(...B)=>{const k=N(...B),E=k.beginComputePass.bind(k);return k.beginComputePass=
(...R)=>{const M=E(...R);for(const S of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const v=M[S].bind(M);M[S]=(...H)=>{
const ne=v(...H);return A.dispatches+=1,ne}}return M},k},c.queue.submit=(...B)=>{const k=P(...B);return A.submissions+=1,
k},()=>{J?Object.defineProperty(c,"createCommandEncoder",J):delete c.createCommandEncoder,I?Object.defineProperty(c.queue,
"submit",I):delete c.queue.submit}}function yo(c){const A=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(c);return A?
{gpuLayers:Number(A[1]),totalLayers:Number(A[2])}:null}function ko(c){const A=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(c);return A?{backend:A[1],kind:A[2].toLowerCase(),bytes:Math.round(Number(A[3])*1024**2)}:null}async function Eo({wasmUrl:c,
weights:A,reader:V,signal:O,collectGpuEvidence:J=!1,onProgress:I,onLost:N,initialize:P=ao}={}){const B=A.map((Y,z)=>({...Y,
name:`model-${String(z+1).padStart(5,"0")}-of-${String(A.length).padStart(5,"0")}.gguf`})),k={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let E=O,R,M,S,v,H;const ne=new Promise((Y,z)=>{v=Y,H=z}),L=Y=>{const z=yo(String(
Y));z&&(k.offload=z,I?.({type:"gpu-offload",...z}));const l=ko(String(Y));l&&k.buffers.length<32&&(k.buffers.push(l),I?.(
{type:"native-buffer",...l,wasmMemoryBytes:S?.wasmMemory?.buffer.byteLength??0}))},Q=Y=>{R=new Error(`Model session lost\
: GGUF native runtime failed: ${String(Y).slice(0,300)}`),H(R)};S={noInitialRun:!0,pthreadPoolSize:0,locateFile(Y){if(Y!==
"wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return c},print:L,printErr:L,onAbort:Q,onExit:Q,preRun(){
S.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){v()},peercomputeOnDevice(Y){try{M?.(),M=bo(Y,k,{collect:J,onLost(z){k.lost=
!0,N?.(z)}})}catch(z){Y.destroy(),Q(z.message)}}};const le=ho({files:B,reader:V,getMemory:()=>S.wasmMemory.buffer,getSignal:()=>E});
P(S,le),await ne,me(O),wo(S,B);const ie=S.cwrap("wllama_start","string",[],{async:!0}),te=S.cwrap("wllama_malloc","bigin\
t",["bigint","number"]),ge=S.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let se=!1;const Ee=async(Y,z,l)=>{
if(se)throw new Error("Concurrent GGUF native calls are prohibited");if(R)throw R;if(k.lost)throw new Error("GPU device \
lost; GGUF session is unavailable");me(l),se=!0,E=l;try{const re=vo(z);if(re.byteLength>Kt)throw new Error("GGUF native \
message exceeds its byte budget");const ue=Number(te(BigInt(re.byteLength),0)),_e=new Uint8Array(S.wasmMemory.buffer);if(!Number.
isSafeInteger(ue)||ue<=0||ue+re.length>_e.length)throw new Error("Invalid GGUF input pointer");_e.set(re,ue);const ae=Number(
await ge(Y,BigInt(ue)));if(R)throw R;const ce=S.wasmMemory.buffer,Se=new DataView(ce).getUint32(ue,!0);if(!Number.isSafeInteger(
ae)||ae<=0||Se>Kt||ae+Se>ce.byteLength)throw new Error("Invalid GGUF output buffer");return _o(new Uint8Array(ce,ae,Se).
slice())}catch(re){throw R??=new Error(`Model session lost: GGUF native action failed: ${String(re.message??re).slice(0,
300)}`),R}finally{se=!1,E=void 0}},ee=JSON.parse(await ie());if(R)throw R;if(!ee.success||!k.device)throw new Error("GGU\
F native hardware GPU backend did not initialize");return me(O),{files:B,action:Ee,evidence:k,async settleGpu(){try{await k.
device.queue.onSubmittedWorkDone()}catch(Y){throw k.lost=!0,R=new Error(`Model session lost: GGUF GPU completion failed:\
 ${String(Y.message??Y).slice(0,300)}`),R}},close(){M?.(),k.device?.destroy()},memoryBytes(){return S.wasmMemory.buffer.
byteLength}}}const Zt=c=>new TextEncoder().encode(c).byteLength;function So(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("GGUF inference requires a ComputeManager-owned worker")}function en(c){return{sessionId:c.
sessionId,manifestCid:c.manifestCid,status:c.lost?"lost":c.status,runtime:"llama.cpp",runtimeVersion:no,task:"text-gener\
ation",workerId:c.workerId,adapter:c.capabilities?.adapter,runtimeAdapter:c.engine?.evidence.runtimeAdapter??null,runtimeFeatures:c.
engine?.evidence.runtimeFeatures??[],gpuDispatches:c.engine?.evidence.dispatches??0,gpuSubmissions:c.engine?.evidence.submissions??
0,gpuOffload:c.engine?.evidence.offload??null,runtimeOptions:c.options,nativeBuffers:c.engine?.evidence.buffers??[],wasmMemoryBytes:c.
engine?.memoryBytes()??0,generatedRequests:c.generatedRequests,artifactReads:c.reader?.getStats()??null}}function No({loadEngine:c=Eo,
createReader:A=Ya,checkCapabilities:V=Ka,assertWorker:O=So,baseUrl:J=globalThis.location?.href}={}){let I;async function N(B,k){
if(I)throw new Error("GGUF worker already has a resident model");const E=Za(B.manifest),R=eo(B.runtimeAssets,J),M=ro(B.runtimeOptions),
S=Ke(B.sessionId);me(k.signal);const v={sessionId:S,manifestCid:B.manifestCid,workerId:k.workerId??null,manifest:E.manifest,
status:"loading",options:M,generatedRequests:0,residency:new AbortController,lost:!1};I=v;try{if(v.capabilities=await V(),
me(k.signal),v.reader=A(B.artifactPort,{manifest:E.manifest,signal:v.residency.signal,maxReadBytes:an,maxReads:1}),v.engine=
await c({wasmUrl:R.wasm,weights:E.weights,reader:v.reader,signal:k.signal,collectGpuEvidence:B.collectGpuEvidence===!0,onProgress:L=>k.
emitProgress?.({...L,sessionId:S}),onLost(){v.lost=!0,v.active?.abort("GPU device lost")}}),me(k.signal),!(await v.engine.
action("load",{_name:"load_req",model_paths:v.engine.files.map(L=>`models/${L.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,
...M,n_ubatch:Math.min(64,M.n_batch),n_parallel:1,kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,
jinja:!0},k.signal)).success)throw new Error("GGUF native model load failed");const ne=v.engine.evidence.offload;if(!ne||
ne.gpuLayers<1||ne.gpuLayers!==Math.min(M.n_gpu_layers,ne.totalLayers))throw new Error("GGUF did not honor the explicitl\
y configured GPU layer offload");if(me(k.signal),v.lost)throw new Error("GPU device lost during GGUF load");return v.status=
"ready",en(v)}catch(H){throw v.engine&&k.emitProgress?.({type:"model-load-memory",sessionId:S,wasmMemoryBytes:v.engine.memoryBytes(),
nativeBuffers:v.engine.evidence.buffers??[]}),v.lost=!0,v.status="lost",v.residency.abort(H),v.reader?.close(H),v.engine?.
close(),H}}async function P(B,k){const E=I;if(!E||E.sessionId!==Ke(B.sessionId)||E.lost)throw new Error("Model session l\
ost or not loaded");if(E.status!=="ready")throw new Error("GGUF model session is busy");const R=Ke(B.requestId),M=B.maxNewTokens??
Qt.maxNewTokens;to.validateGenerationInput({...B,maxNewTokens:M});const S=Xa(B),v=new AbortController,H=()=>v.abort(k.signal?.
reason);k.signal?.addEventListener("abort",H,{once:!0}),k.signal?.aborted&&H(),E.active=v,E.status="generating",E.requestId=
R;const ne=E.engine.evidence.dispatches,L=E.engine.evidence.submissions;let Q,le=!1,ie="",te=0,ge=null,se=null,Ee="unkno\
wn";try{const ee=await E.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:S,stream:!0,
max_tokens:M,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:[]},v.signal);if(!ee.success||
!Number.isInteger(ee.req_id))throw new Error("GGUF failed to start generation");Q=ee.req_id,me(v.signal);for(let Y=0;Y<4096;Y+=
1){me(v.signal);const z=await E.engine.action("get_result",{_name:"gres_req",req_id:Q},v.signal);if(me(v.signal),!z.success||
z.is_error)throw new Error("GGUF generation failed or exceeded the context budget; shorten the conversation or request f\
ewer output tokens");if(z.data_json&&z.data_json!=="null"){if(Zt(z.data_json)>1024*1024)throw new Error("GGUF result exc\
eeds its byte budget");const l=JSON.parse(z.data_json);for(const re of Array.isArray(l)?l:[l]){const ue=re.choices?.[0]?.
finish_reason??re.finish_reason;ue!=null&&(Ee=["stop","length"].includes(ue)?ue:"unknown");const _e=re.choices?.[0]?.delta?.
content??re.content??"";if(typeof _e!="string")throw new Error("Invalid GGUF text chunk");if(ie+=_e,Zt(ie)>Qt.maxOutputBytes)
throw new Error("GGUF output exceeds its byte budget");if(_e&&k.emitProgress?.({type:"token",sessionId:E.sessionId,requestId:R,
sequence:te++,text:_e})===!1)throw new Error("Token consumer rejected output");ge=re.usage?.prompt_tokens??re.timings?.prompt_n??
ge,se=re.usage?.completion_tokens??re.timings?.predicted_n??se}}if(!z.has_more){le=!0;break}await new Promise(l=>setTimeout(
l,0))}if(!le)throw new Error("GGUF result polling exceeded its request budget");if(await E.engine.settleGpu(),me(v.signal),
E.lost)throw new Error("GPU device lost; model session is unavailable");if(se!==null&&(!Number.isSafeInteger(se)||se>M))
throw new Error("GGUF returned an over-budget token sequence");return E.generatedRequests+=1,{sessionId:E.sessionId,requestId:R,
text:ie,inputTokens:ge,outputTokens:se,finishReason:Ee,contextTruncated:!1,workerId:E.workerId,gpuDispatches:E.engine.evidence.
dispatches-ne,gpuSubmissions:E.engine.evidence.submissions-L,gpuOffload:E.engine.evidence.offload,artifactReads:E.reader.
getStats()}}catch(ee){throw ee?.name==="RuntimeError"?(E.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(
ee.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(ee.message??"")&&(E.lost=!0),ee)}finally{k.signal?.
removeEventListener("abort",H);try{!le&&Q!==void 0&&!E.lost&&await E.engine.action("cancel",{_name:"cncl_req",req_id:Q})}catch(ee){
throw E.lost=!0,new Error(`Model session lost during GGUF cancellation: ${ee.message}`)}finally{E.active=null,E.requestId=
null,E.status=E.lost?"lost":"ready"}}}return async(B={},k={})=>{if(O(),B.command==="load")return N(B,k);if(B.command==="\
generate")return P(B,k);const E=Ke(B.sessionId);if(B.command==="status")return I?.sessionId===E?en(I):{sessionId:E,status:"\
absent"};if(!I||I.sessionId!==E)throw new Error("Model session lost or not loaded");if(B.command==="cancel")return I.requestId===
B.requestId&&I.active?.abort(Qa()),{sessionId:E,cancellationRequested:!0};if(B.command==="unload"){if(I.status==="genera\
ting")throw new Error("Cancel and await GGUF generation before unloading");return I.residency.abort("GGUF unload"),I.reader?.
close(),I.engine?.close(),I=null,{sessionId:E,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown G\
GUF inference command")}}const Io=No(),Co=(c,A)=>Io(c,A);export{No as createGgufTaskRuntime,Co as handleModelTask};

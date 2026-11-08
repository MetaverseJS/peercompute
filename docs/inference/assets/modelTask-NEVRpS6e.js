import{c as Ai}from"./GgufArtifactReader-CxlX0lvx.js";import{normalizeModelMessages as Ci}from"./modelTask-9yG_B2J_.js";
import{t as ge,v as Ti,l as Ui,M as Lr,a as lr,b as Ri}from"./ArtifactReadBridge-mLMxyVL0.js";import{n as ji}from"./ArtifactManifest-Bn7pK_eB.js";
function Oi(o,f){const d=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var h=!!globalThis.
window,k=!!globalThis.WorkerGlobalScope,_=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",w=k&&
self.name?.startsWith("em-pthread");if(_){var N=require("worker_threads");global.Worker=N.Worker,k=!N.isMainThread,w=k&&
N.workerData=="em-pthread"}var S="./this.program",y=(e,r)=>{throw r},x=globalThis.document?.currentScript?.src;typeof __filename<
"u"?x=__filename:k&&(x=self.location.href);var I="";function U(e){return o.locateFile?o.locateFile(e,I):I+e}var F,B;if(_){
var P=require("fs");I=__dirname+"/",B=e=>{e=z(e)?new URL(e):e;var r=P.readFileSync(e);return r},F=async(e,r=!0)=>{e=z(e)?
new URL(e):e;var t=P.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(S=process.argv[1].replace(/\\/g,"\
/")),process.argv.slice(2),typeof module<"u"&&(module.exports=o),y=(e,r)=>{throw process.exitCode=e,r}}else if(h||k){try{
I=new URL(".",x).href}catch{}_||(k&&(B=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),F=async e=>{if(z(e))return new Promise((t,n)=>{var i=new XMLHttpRequest;i.open(
"GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}n(
i.status)},i.onerror=n,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(
r.status+" : "+r.url)})}var ne=console.log.bind(console),W=console.error.bind(console);if(_){var ee=require("util"),de=e=>typeof e==
"object"?ee.inspect(e):e;ne=(...e)=>P.writeSync(1,e.map(de).join(" ")+`
`),W=(...e)=>P.writeSync(2,e.map(de).join(" ")+`
`)}var fe=ne,ie=W,be,R,K=!1,X;function $(e,r){e||_e(r)}var z=e=>e.startsWith("file://");function l(){ke.buffer!=se.buffer&&
er()}if(_&&w){var J=N.parentPort;J.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,postMessage:e=>J.
postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.exit(1)})}var oe;
if(w){var le=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.cmd;if(n==="lo\
ad"){let i=[];self.onmessage=s=>i.push(s),oe=()=>{postMessage({cmd:"loaded"});for(let s of i)e(s);self.onmessage=e};for(const s of t.
handlers)(!o[s]||o[s].proxy)&&(o[s]=(...c)=>{postMessage({cmd:"callHandler",handler:s,args:c})},s=="print"&&(fe=o[s]),s==
"printErr"&&(ie=o[s]));ke=t.wasmMemory,er(),R=t.wasmModule,Jr(),cr()}else if(n==="run"){Xn(t.pthread_ptr),Or(t.pthread_ptr,
0,0,1,0,0),H.threadInitTLS(),Br(t.pthread_ptr),le||(le=!0);try{await ct(t.start_routine,t.arg)}catch(i){if(i!="unwind")throw i}}else
t.target==="setimmediate"||(n==="checkMailbox"?le&&ar():n&&(ie(`worker: received unknown command ${n}`),ie(t)))}catch(i){
throw an(),i}}self.onmessage=e}var se,pe,Ge,j,O,fr,Ce,ae,A,Hr=!1;function er(){var e=ke.buffer;se=new Int8Array(e),Ge=new Int16Array(
e),o.HEAPU8=pe=new Uint8Array(e),j=new Int32Array(e),O=new Uint32Array(e),fr=new Float32Array(e),Ce=new Float64Array(e),
ae=new BigInt64Array(e),A=new BigUint64Array(e)}function zn(){if(!w){if(o.wasmMemory)ke=o.wasmMemory;else{var e=o.INITIAL_MEMORY||
134217728;ke=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i64"})}er()}}function Qn(){
if(o.preRun)for(typeof o.preRun=="function"&&(o.preRun=[o.preRun]);o.preRun.length;)rt(o.preRun.shift());Zr(et)}function $r(){
if(Hr=!0,w)return oe();!o.noFSInit&&!a.initialized&&a.init(),Ie.__wasm_call_ctors(),a.ignorePermissions=!1}function Wn(){
if(!w){if(o.postRun)for(typeof o.postRun=="function"&&(o.postRun=[o.postRun]);o.postRun.length;)Kn(o.postRun.shift());Zr(
ot)}}function _e(e){o.onAbort?.(e),e="Aborted("+e+")",ie(e),K=!0,e+=". Build with -sASSERTIONS for more info.",Hr&&un();
var r=new WebAssembly.RuntimeError(e);throw r}var dr;function Vn(){return U("wllama.wasm")}function Hn(e){if(e==dr&&be)return new Uint8Array(
be);if(B)return B(e);throw"both async and sync fetching of the wasm failed"}async function $n(e){if(!be)try{var r=await F(
e);return new Uint8Array(r)}catch{}return Hn(e)}async function Pn(e,r){try{var t=await $n(e),n=await WebAssembly.instantiate(
t,r);return n}catch(i){ie(`failed to asynchronously prepare wasm: ${i}`),_e(i)}}async function Jn(e,r,t){if(!e&&!z(r)&&!_)
try{var n=fetch(r,{credentials:"same-origin"}),i=await WebAssembly.instantiateStreaming(n,t);return i}catch(s){ie(`wasm \
streaming compile failed: ${s}`),ie("falling back to ArrayBuffer instantiation")}return Pn(r,t)}function Pr(){Gi(),Qe.__instrumented||
(Qe.__instrumented=!0,ve.instrumentWasmImports(Qe));var e={env:Qe,wasi_snapshot_preview1:Qe};return e}async function Jr(){
function e(c,u){return Ie=c.exports,Ie=ve.instrumentWasmExports(Ie),Ie=Fi(Ie),Yn(Ie._emscripten_tls_init),Ni(Ie),R=u,rr(),
Ie}tr();function r(c){return e(c.instance,c.module)}var t=Pr();if(o.instantiateWasm)return new Promise((c,u)=>{o.instantiateWasm(
t,(g,E)=>{c(e(g,E))})});if(w){var n=new WebAssembly.Instance(R,Pr());return e(n,R)}dr??=Vn();var i=await Jn(be,dr,t),s=r(
i);return s}class Kr{name="ExitStatus";constructor(r){this.message=`Program terminated with exit(${r})`,this.status=r}}var Xr=e=>{
e.terminate(),e.onmessage=r=>{}},Yr=e=>{var r=H.pthreads[e];H.returnWorkerToPool(r)},Zr=e=>{for(;e.length>0;)e.shift()(o)},
et=[],rt=e=>et.push(e),je=0,We=null,rr=e=>{if(je--,o.monitorRunDependencies?.(je),je==0&&We){var r=We;We=null,r()}},tr=e=>{
je++,o.monitorRunDependencies?.(je)},tt=e=>{var r=H.getNewWorker();if(!r)return 6;H.runningWorkers.push(r),H.pthreads[e.
pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,pthread_ptr:e.pthread_ptr};
return _&&r.unref(),r.postMessage(t,e.transferList),0},nr=0,mr=()=>br||nr>0,ye=()=>pn(),Ee=e=>dn(e),pr=e=>mn(e),ue=(e,r,t,...n)=>{
for(var i=n.length*2,s=ye(),c=pr(i*8),u=c/8,g=0;g<n.length;g++){var E=n[g];typeof E=="bigint"?((l(),ae)[u+2*g]=1n,(l(),ae)[u+
2*g+1]=E):((l(),ae)[u+2*g]=0n,(l(),Ce)[u+2*g+1]=E)}var v=on(e,r,i,c,t);return Ee(s),v};function nt(e){if(w)return ue(0,0,
1,e);X=e,mr()||(H.terminateAllThreads(),o.onExit?.(e),K=!0),y(e,new Kr(e))}function at(e){if(w)return ue(1,0,0,e);gr(e)}
var it=(e,r)=>{if(X=e,w)throw at(e),"unwind";nt(e)},gr=it,H={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},
init(){w||H.initMainThread()},initMainThread(){for(var e=o.pthreadPoolSize;e--;)H.allocateUnusedWorker();rt(async()=>{var r=H.
loadWasmModuleToAllWorkers();tr(),await r,rr()})},terminateAllThreads:()=>{for(var e of H.runningWorkers)Xr(e);for(var e of H.
unusedWorkers)Xr(e);H.unusedWorkers=[],H.runningWorkers=[],H.pthreads={}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete H.
pthreads[r],H.unusedWorkers.push(e),H.runningWorkers.splice(H.runningWorkers.indexOf(e),1),e.pthread_ptr=0,sn(r)},threadInitTLS(){
H.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var c=s.data,u=c.cmd;if(c.
targetThread&&c.targetThread!=sr()){var g=H.pthreads[c.targetThread];g?g.postMessage(c,c.transferList):ie(`Internal erro\
r! Worker sent a message "${u}" to target pthread ${c.targetThread}, but that thread no longer exists!`);return}u==="che\
ckMailbox"?ar():u==="spawnThread"?tt(c):u==="cleanupThread"?Be(()=>Yr(c.thread)):u==="loaded"?(e.loaded=!0,_&&!e.pthread_ptr&&
e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):u==="uncaughtException"?e.onerror(c.error):u==="callHandler"?
o[c.handler](...c.args):u&&ie(`worker sent an unknown command ${u}`)},e.onerror=s=>{var c="worker sent an error!";throw ie(
`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},_&&(e.on("message",s=>e.onmessage({data:s})),e.on("error",s=>e.onerror(
s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var i of n)o.propertyIsEnumerable(i)&&t.push(i);e.postMessage(
{cmd:"load",handlers:t,wasmMemory:ke,wasmModule:R})}),async loadWasmModuleToAllWorkers(){return w?void 0:Promise.all(H.unusedWorkers.
map(H.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=x;o.mainScriptUrlOrBlob&&(r=o.mainScriptUrlOrBlob,typeof r!=
"string"&&(r=URL.createObjectURL(r))),e=new d(r,{workerData:"em-pthread",name:"em-pthread"}),H.unusedWorkers.push(e)},getNewWorker(){
return H.unusedWorkers.length==0&&(H.allocateUnusedWorker(),H.loadWasmModuleToWorker(H.unusedWorkers[0])),H.unusedWorkers.
pop()}},ot=[],Kn=e=>ot.push(e);function Xn(e){var r=Number((l(),A)[(e+88)/8]),t=Number((l(),A)[(e+96)/8]),n=r-t;fn(r,n),
Ee(r)}var hr=[],st=e=>{e=Number(e);var r=hr[e];return r||(hr[e]=r=gn.get(BigInt(e)),ve.isAsyncExport(r)&&(hr[e]=r=ve.makeAsyncFunction(
r))),r},ct=async(e,r)=>{nr=0,br=0;var t=(i=>WebAssembly.promising(st(e)).call(null,BigInt(i)))(r);function n(i){if(mr()){
X=i;return}Dr(i)}t=await t,n(t)};ct.isAsync=!0;var br=!0,Yn=e=>H.tlsInitFunctions.push(e),ke;function lt(e,r,t,n){return w?
ue(2,0,1,e,r,t,n):ut(e,r,t,n)}var Zn=()=>!!globalThis.SharedArrayBuffer,ea=9007199254740992,ra=-9007199254740992,b=e=>e<
ra||e>ea?NaN:Number(e);function ut(e,r,t,n){if(e=b(e),r=b(r),t=b(t),n=b(n),!Zn())return 6;var i=[],s=0;if(w&&(i.length===
0||s))return lt(e,r,t,n);var c={startRoutine:t,pthread_ptr:e,arg:n,transferList:i};return w?(c.cmd="spawnThread",postMessage(
c,i),0):tt(c)}var Me=()=>{var e=Number((l(),A)[Z.varargs/8]);return Z.varargs+=8,e},_r=()=>{var e=(l(),j)[+Z.varargs/4];
return Z.varargs+=4,e},Y={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var i=e[n];i==="."?e.splice(n,1):i===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=Y.isAbs(e),
t=e.slice(-1)==="/";return e=Y.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=Y.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>Y.normalize(e.join("/")),join2:(e,r)=>Y.normalize(e+"/"+r)},ta=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),vr=e=>{(vr=ta())(e)},qe={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var i=n>=0?e[n]:a.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!i)return"";r=i+"/"+r,t=Y.isAbs(i)}return r=Y.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=qe.resolve(e).slice(1),r=qe.resolve(r).slice(1);function t(E){for(var v=0;v<E.length&&E[v]==="";v++)
;for(var C=E.length-1;C>=0&&E[C]==="";C--);return v>C?[]:E.slice(v,C-v+1)}for(var n=t(e.split("/")),i=t(r.split("/")),s=Math.
min(n.length,i.length),c=s,u=0;u<s;u++)if(n[u]!==i[u]){c=u;break}for(var g=[],u=c;u<n.length;u++)g.push("..");return g=g.
concat(i.slice(c)),g.join("/")}},ft=globalThis.TextDecoder&&new TextDecoder,na=(e,r,t,n)=>{for(var i=r+t;e[r]&&!(r>=i);)
++r;return r},Le=(e,r=0,t,n)=>{var i=na(e,r,t);if(i-r>16&&e.buffer&&ft)return ft.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,i):e.slice(r,i));for(var s="";r<i;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}var u=e[r++]&
63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|u);continue}var g=e[r++]&63;if((c&240)==224?c=(c&15)<<12|u<<6|g:c=(c&
7)<<18|u<<12|g<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var E=c-65536;s+=String.fromCharCode(55296|E>>10,56320|
E&1023)}}return s},wr=[],Se=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},dt=(e,r,t,n)=>{if(!(n>0))return 0;for(var i=t,s=t+n-1,c=0;c<e.length;++c){var u=e.codePointAt(
c);if(u<=127){if(t>=s)break;r[t++]=u}else if(u<=2047){if(t+1>=s)break;r[t++]=192|u>>6,r[t++]=128|u&63}else if(u<=65535){
if(t+2>=s)break;r[t++]=224|u>>12,r[t++]=128|u>>6&63,r[t++]=128|u&63}else{if(t+3>=s)break;r[t++]=240|u>>18,r[t++]=128|u>>
12&63,r[t++]=128|u>>6&63,r[t++]=128|u&63,c++}}return r[t]=0,t-i},yr=(e,r,t)=>{var n=Se(e)+1,i=new Array(n),s=dt(e,i,0,i.
length);return i.length=s,i},aa=()=>{if(!wr.length){var e=null;if(_){var r=256,t=Buffer.alloc(r),n=0,i=process.stdin.fd;
try{n=P.readSync(i,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;wr=yr(e)}return wr.shift()},Oe={ttys:[],init(){},shutdown(){},register(e,r){Oe.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Oe.stream_ops)},stream_ops:{open(e){var r=Oe.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,i){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,c=0;c<n;c++){var u;try{u=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(u===void 0&&s===0)throw new a.ErrnoError(6);if(u==null)break;s++,r[t+c]=u}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,i){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return aa()},put_char(e,r){r===null||r===10?(fe(Le(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(fe(Le(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(ie(Le(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(ie(Le(e.output)),e.output=[])}}},ia=(e,r)=>(l(),pe).fill(0,e,e+r),mt=(e,r)=>Math.ceil(e/r)*r,Er=e=>{
e=mt(e,65536);var r=nn(65536,e);return r&&ia(r,e),r},D={ops_table:null,mount(e){return D.createNode(null,"/",16895,0)},createNode(e,r,t,n){
if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(63);D.ops_table||={dir:{node:{getattr:D.node_ops.getattr,setattr:D.
node_ops.setattr,lookup:D.node_ops.lookup,mknod:D.node_ops.mknod,rename:D.node_ops.rename,unlink:D.node_ops.unlink,rmdir:D.
node_ops.rmdir,readdir:D.node_ops.readdir,symlink:D.node_ops.symlink},stream:{llseek:D.stream_ops.llseek}},file:{node:{getattr:D.
node_ops.getattr,setattr:D.node_ops.setattr},stream:{llseek:D.stream_ops.llseek,read:D.stream_ops.read,write:D.stream_ops.
write,mmap:D.stream_ops.mmap,msync:D.stream_ops.msync}},link:{node:{getattr:D.node_ops.getattr,setattr:D.node_ops.setattr,
readlink:D.node_ops.readlink},stream:{}},chrdev:{node:{getattr:D.node_ops.getattr,setattr:D.node_ops.setattr},stream:a.chrdev_stream_ops}};
var i=a.createNode(e,r,t,n);return a.isDir(i.mode)?(i.node_ops=D.ops_table.dir.node,i.stream_ops=D.ops_table.dir.stream,
i.contents={}):a.isFile(i.mode)?(i.node_ops=D.ops_table.file.node,i.stream_ops=D.ops_table.file.stream,i.usedBytes=0,i.contents=
null):a.isLink(i.mode)?(i.node_ops=D.ops_table.link.node,i.stream_ops=D.ops_table.link.stream):a.isChrdev(i.mode)&&(i.node_ops=
D.ops_table.chrdev.node,i.stream_ops=D.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.
atime=e.mtime=e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var n=1024*1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&D.resizeFileStorage(e,r.size)},lookup(e,r){throw D.doesNotExistError||(D.doesNotExistError=new a.ErrnoError(44),
D.doesNotExistError.stack="<generic error, no stack>"),D.doesNotExistError},mknod(e,r,t,n){return D.createNode(e,r,t,n)},
rename(e,r,t){var n;try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var i in n.contents)throw new a.ErrnoError(
55);a.hashRemoveNode(n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.
contents)throw new a.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var n=D.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,n,i){var s=e.node.contents;if(i>=e.node.usedBytes)return 0;var c=Math.
min(e.node.usedBytes-i,n);if(c>8&&s.subarray)r.set(s.subarray(i,i+c),t);else for(var u=0;u<c;u++)r[t+u]=s[i+u];return c},
write(e,r,t,n,i,s){if(r.buffer===(l(),se).buffer&&(s=!1),!n)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&
(!c.contents||c.contents.subarray)){if(s)return c.contents=r.subarray(t,t+n),c.usedBytes=n,n;if(c.usedBytes===0&&i===0)return c.
contents=r.slice(t,t+n),c.usedBytes=n,n;if(i+n<=c.usedBytes)return c.contents.set(r.subarray(t,t+n),i),n}if(D.expandFileStorage(
c,i+n),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+n),i);else for(var u=0;u<n;u++)c.contents[i+u]=r[t+
u];return c.usedBytes=Math.max(c.usedBytes,i+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,i){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,c,u=e.node.contents;if(!(i&2)&&u&&u.buffer===(l(),se).buffer)c=!1,s=u.byteOffset;else{if(c=!0,s=Er(r),!s)throw new a.
ErrnoError(48);u&&((t>0||t+r<u.length)&&(u.subarray?u=u.subarray(t,t+r):u=Array.prototype.slice.call(u,t,t+r)),(l(),se).
set(u,s))}return{ptr:s,allocated:c}},msync(e,r,t,n,i){return D.stream_ops.write(e,r,0,n,t,!1),0}}},oa=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},kr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},sa=async e=>{var r=await F(e);return new Uint8Array(r)},pt=(...e)=>a.createDataFile(
...e),gt=[],ca=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of gt)if(t.canHandle(r))return t.handle(e,r);return e},
Sr=async(e,r,t,n,i,s,c,u)=>{var g=r?qe.resolve(Y.join2(e,r)):e;tr();try{var E=t;typeof t=="string"&&(E=await sa(t)),E=await ca(
E,g),u?.(),s||pt(e,r,E,n,i,c)}finally{rr()}},la=(e,r,t,n,i,s,c,u,g,E)=>{Sr(e,r,t,n,i,u,g,E).then(s).catch(c)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,Y.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(E=>!!E),i=a.root,s="/",c=0;c<n.length;c++){var u=c===n.length-1;if(u&&r.parent)break;if(n[c]!=="."){if(n[c]===
".."){if(s=Y.dirname(s),a.isRoot(i)){e=s+"/"+n.slice(c+1).join("/"),t--;continue e}else i=i.parent;continue}s=Y.join2(s,
n[c]);try{i=a.lookupNode(i,n[c])}catch(E){if(E?.errno===44&&u&&r.noent_okay)return{path:s};throw E}if(a.isMountpoint(i)&&
(!u||r.follow_mount)&&(i=i.mounted.root),a.isLink(i.mode)&&(!u||r.follow)){if(!i.node_ops.readlink)throw new a.ErrnoError(
52);var g=i.node_ops.readlink(i);Y.isAbs(g)||(g=Y.dirname(s)+"/"+g),e=g+"/"+n.slice(c+1).join("/");continue e}}}return{path:s,
node:i}}throw new a.ErrnoError(32)},getPath(e){for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-
1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-
t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=
a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=
e.name_next;else for(var t=a.nameTable[r];t;){if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){
var t=a.mayLookup(e);if(t)throw new a.ErrnoError(t);for(var n=a.hashName(e.id,r),i=a.nameTable[n];i;i=i.name_next){var s=i.
name;if(i.parent.id===e.id&&s===r)return i}return a.lookup(e,r)},createNode(e,r,t,n){var i=new a.FSNode(e,r,t,n);return a.
hashAddNode(i),i},destroyNode(e){a.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},
isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&
61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},
flagsToPermissionString(e){var r=["r","w","rw"][e&3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?
0:r.includes("r")&&!(e.mode&292)||r.includes("w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.
isDir(e.mode))return 54;var r=a.nodePermissions(e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))
return 54;try{var t=a.lookupNode(e,r);return 20}catch{}return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.
lookupNode(e,r)}catch(s){return s.errno}var i=a.nodePermissions(e,"wx");if(i)return i;if(t){if(!a.isDir(n.mode))return 54;
if(a.isRoot(n)||a.getPath(n)===a.cwd())return 10}else if(a.isDir(n.mode))return 31;return 0},mayOpen(e,r){return e?a.isLink(
e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(r)!=="r"||r&576)?31:a.nodePermissions(e,a.flagsToPermissionString(
r)):44},checkOpExists(e,r){if(!e)throw new a.ErrnoError(r);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)
if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){var r=a.getStream(e);if(!r)throw new a.ErrnoError(
8);return r},getStream:e=>a.streams[e],createStream(e,r=-1){return e=Object.assign(new a.FSStream,e),r==-1&&(r=a.nextfd()),
e.fd=r,a.streams[r]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,r=-1){var t=a.createStream(e,r);return t.stream_ops?.
dup?.(t),t},doSetAttr(e,r,t){var n=e?.stream_ops.setattr,i=n?e:r;n??=r.node_ops.setattr,a.checkOpExists(n,63),n(i,t)},chrdev_stream_ops:{
open(e){var r=a.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new a.ErrnoError(
70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){a.devices[e]={stream_ops:r}},getDevice:e=>a.
devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var n=t.pop();r.push(n),t.push(...n.mounts)}return r},syncfs(e,r){
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&ie(`warning: ${a.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function i(u){return a.syncFSRequests--,
r(u)}function s(u){if(u)return s.errored?void 0:(s.errored=!0,i(u));++n>=t.length&&i(null)}for(var c of t)c.type.syncfs?
c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var n=t==="/",i=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!i){var c=a.
lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(s.mode))throw new a.
ErrnoError(54)}var u={type:e,opts:r,mountpoint:t,mounts:[]},g=e.mount(u);return g.mount=u,u.root=g,n?a.root=g:s&&(s.mounted=
u,s.mount&&s.mount.mounts.push(u)),g},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,i=a.getMounts(n);for(var[s,c]of Object.entries(a.nameTable))for(;c;){var u=c.name_next;
i.includes(c.mount)&&a.destroyNode(c),c=u}t.mounted=null;var g=t.mount.mounts.indexOf(n);t.mount.mounts.splice(g,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),i=n.node,s=Y.basename(e);if(!s)throw new a.
ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var c=a.mayCreate(i,s);if(c)throw new a.ErrnoError(c);if(!i.
node_ops.mknod)throw new a.ErrnoError(63);return i.node_ops.mknod(i,s,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var i of t)if(i){(n||Y.isAbs(e))&&(n+=
"/"),n+=i;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!qe.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var i=Y.basename(r),s=a.mayCreate(n,i);if(s)throw new a.ErrnoError(s);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,i,e)},rename(e,r){var t=Y.dirname(e),n=Y.dirname(r),i=Y.basename(e),s=Y.basename(
r),c,u,g;if(c=a.lookupPath(e,{parent:!0}),u=c.node,c=a.lookupPath(r,{parent:!0}),g=c.node,!u||!g)throw new a.ErrnoError(
44);if(u.mount!==g.mount)throw new a.ErrnoError(75);var E=a.lookupNode(u,i),v=qe.relative(e,n);if(v.charAt(0)!==".")throw new a.
ErrnoError(28);if(v=qe.relative(r,t),v.charAt(0)!==".")throw new a.ErrnoError(55);var C;try{C=a.lookupNode(g,s)}catch{}if(E!==
C){var G=a.isDir(E.mode),T=a.mayDelete(u,i,G);if(T)throw new a.ErrnoError(T);if(T=C?a.mayDelete(g,s,G):a.mayCreate(g,s),
T)throw new a.ErrnoError(T);if(!u.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(E)||C&&a.isMountpoint(C))
throw new a.ErrnoError(10);if(g!==u&&(T=a.nodePermissions(u,"w"),T))throw new a.ErrnoError(T);a.hashRemoveNode(E);try{u.
node_ops.rename(E,g,s),E.parent=g}catch(q){throw q}finally{a.hashAddNode(E)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=Y.basename(e),i=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(i)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=Y.basename(e),i=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
throw new a.ErrnoError(s);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);
t.node_ops.unlink(t,n),a.destroyNode(i)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)throw new a.ErrnoError(44);if(!t.
node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.lookupPath(e,{follow:!r}),
n=t.node,i=a.checkOpExists(n.node_ops.getattr,63);return i(n)},fstat(e){var r=a.getStreamChecked(e),t=r.node,n=r.stream_ops.
getattr,i=n?r:t;return n??=t.node_ops.getattr,a.checkOpExists(n,63),n(i)},lstat(e){return a.stat(e,!0)},doChmod(e,r,t,n){
a.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:n})},chmod(e,r,t){var n;if(typeof e=="string"){var i=a.
lookupPath(e,{follow:!t});n=i.node}else n=e;a.doChmod(null,n,r,t)},lchmod(e,r){a.chmod(e,r,!0)},fchmod(e,r){var t=a.getStreamChecked(
e);a.doChmod(t,t.node,r,!1)},doChown(e,r,t){a.doSetAttr(e,r,{timestamp:Date.now(),dontFollow:t})},chown(e,r,t,n){var i;if(typeof e==
"string"){var s=a.lookupPath(e,{follow:!n});i=s.node}else i=e;a.doChown(null,i,n)},lchown(e,r,t){a.chown(e,r,t,!0)},fchown(e,r,t){
var n=a.getStreamChecked(e);a.doChown(n,n.node,!1)},doTruncate(e,r,t){if(a.isDir(r.mode))throw new a.ErrnoError(31);if(!a.
isFile(r.mode))throw new a.ErrnoError(28);var n=a.nodePermissions(r,"w");if(n)throw new a.ErrnoError(n);a.doSetAttr(e,r,
{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new a.ErrnoError(28);var t;if(typeof e=="string"){var n=a.lookupPath(
e,{follow:!0});t=n.node}else t=e;a.doTruncate(null,t,r)},ftruncate(e,r){var t=a.getStreamChecked(e);if(r<0||(t.flags&2097155)===
0)throw new a.ErrnoError(28);a.doTruncate(t,t.node,r)},utime(e,r,t){var n=a.lookupPath(e,{follow:!0}),i=n.node,s=a.checkOpExists(
i.node_ops.setattr,63);s(i,{atime:r,mtime:t})},open(e,r,t=438){if(e==="")throw new a.ErrnoError(44);r=typeof r=="string"?
oa(r):r,r&64?t=t&4095|32768:t=0;var n,i;if(typeof e=="object")n=e;else{i=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=s.node,e=s.path}var c=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(i)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),c=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!c){var u=a.mayOpen(n,r);if(u)throw new a.ErrnoError(u)}r&512&&!c&&a.truncate(n,0),
r&=-131713;var g=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return g.stream_ops.open&&g.stream_ops.open(g),c&&a.chmod(n,t&511),o.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),g},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,i){if(n<
0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(
8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var s=typeof i<"u";
if(!s)i=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var c=e.stream_ops.read(e,r,t,n,i);return s||(e.position+=
c),c},write(e,r,t,n,i,s){if(n<0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===
0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(
28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var c=typeof i<"u";if(!c)i=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var u=e.stream_ops.write(e,r,t,n,i,s);return c||(e.position+=u),u},mmap(e,r,t,n,i){if((n&2)!==0&&(i&2)===0&&(e.flags&
2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.
ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,r,t,n,i)},msync(e,r,t,n,i){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,n,i):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&_e(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),i=n.size,s=new Uint8Array(i);return a.
read(t,s,0,i,0),r.encoding==="utf8"&&(s=Le(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(yr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
_e("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,i,s,c,u)=>c,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Oe.register(a.makedev(5,0),Oe.default_tty_ops),Oe.register(a.makedev(6,0),Oe.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(vr(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:D.stream_ops.llseek},r.node_ops={lookup(t,n){var i=+n,
s=a.getStreamChecked(i),c={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:i+1};return c.parent=
c,c},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(D,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:D}},init(e,r,t){a.initialized=!0,e??=o.stdin,r??=o.stdout,t??=o.stderr,a.createStandardStreams(e,r,t)},quit(){a.initialized=
!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=
t.path,n.parentObject=t.node,n.name=Y.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(i){n.error=i.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var i=r.split("/").reverse();i.length;){var s=i.pop();if(s){var c=Y.join2(e,s);try{a.mkdir(c)}catch(u){if(u.
errno!=20)throw u}e=c}}return c},createFile(e,r,t,n,i){var s=Y.join2(typeof e=="string"?e:a.getPath(e),r),c=kr(n,i);return a.
create(s,c)},createDataFile(e,r,t,n,i,s){var c=r;e&&(e=typeof e=="string"?e:a.getPath(e),c=r?Y.join2(e,r):e);var u=kr(n,
i),g=a.create(c,u);if(t){if(typeof t=="string"){for(var E=new Array(t.length),v=0,C=t.length;v<C;++v)E[v]=t.charCodeAt(v);
t=E}a.chmod(g,u|146);var G=a.open(g,577);a.write(G,t,0,t.length,0,s),a.close(G),a.chmod(g,u)}},createDevice(e,r,t,n){var i=Y.
join2(typeof e=="string"?e:a.getPath(e),r),s=kr(!!t,!!n);a.createDevice.major??=64;var c=a.makedev(a.createDevice.major++,
0);return a.registerDevice(c,{open(u){u.seekable=!1},close(u){n?.buffer?.length&&n(10)},read(u,g,E,v,C){for(var G=0,T=0;T<
v;T++){var q;try{q=t()}catch{throw new a.ErrnoError(29)}if(q===void 0&&G===0)throw new a.ErrnoError(6);if(q==null)break;
G++,g[E+T]=q}return G&&(u.node.atime=Date.now()),G},write(u,g,E,v,C){for(var G=0;G<v;G++)try{n(g[E+G])}catch{throw new a.
ErrnoError(29)}return v&&(u.node.mtime=u.node.ctime=Date.now()),G}}),a.mkdev(i,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)_e("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=B(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,i){class s{lengthKnown=!1;chunks=[];get(G){
if(!(G>this.length-1||G<0)){var T=G%this.chunkSize,q=G/this.chunkSize|0;return this.getter(q)[T]}}setDataGetter(G){this.
getter=G}cacheLength(){var G=new XMLHttpRequest;G.open("HEAD",t,!1),G.send(null),G.status>=200&&G.status<300||G.status===
304||_e("Couldn't load "+t+". Status: "+G.status);var T=Number(G.getResponseHeader("Content-length")),q,M=(q=G.getResponseHeader(
"Accept-Ranges"))&&q==="bytes",p=(q=G.getResponseHeader("Content-Encoding"))&&q==="gzip",L=1024*1024;M||(L=T);var V=(me,we)=>{
me>we&&_e("invalid range ("+me+", "+we+") or no bytes requested!"),we>T-1&&_e("only "+T+" bytes available! programmer er\
ror!");var ce=new XMLHttpRequest;return ce.open("GET",t,!1),T!==L&&ce.setRequestHeader("Range","bytes="+me+"-"+we),ce.responseType=
"arraybuffer",ce.overrideMimeType&&ce.overrideMimeType("text/plain; charset=x-user-defined"),ce.send(null),ce.status>=200&&
ce.status<300||ce.status===304||_e("Couldn't load "+t+". Status: "+ce.status),ce.response!==void 0?new Uint8Array(ce.response||
[]):yr(ce.responseText||"")},re=this;re.setDataGetter(me=>{var we=me*L,ce=(me+1)*L-1;return ce=Math.min(ce,T-1),typeof re.
chunks[me]>"u"&&(re.chunks[me]=V(we,ce)),typeof re.chunks[me]>"u"&&_e("doXHR failed!"),re.chunks[me]}),(p||!T)&&(L=T=1,T=
this.getter(0).length,L=T,fe("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
T,this._chunkSize=L,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){k||_e("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,u={isDevice:!1,
contents:c}}else var u={isDevice:!1,url:t};var g=a.createFile(e,r,u,n,i);u.contents?g.contents=u.contents:u.url&&(g.contents=
null,g.url=u.url),Object.defineProperties(g,{usedBytes:{get:function(){return this.contents.length}}});var E={};for(const[
C,G]of Object.entries(g.stream_ops))E[C]=(...T)=>(a.forceLoadFile(g),G(...T));function v(C,G,T,q,M){var p=C.node.contents;
if(M>=p.length)return 0;var L=Math.min(p.length-M,q);if(p.slice)for(var V=0;V<L;V++)G[T+V]=p[M+V];else for(var V=0;V<L;V++)
G[T+V]=p.get(M+V);return L}return E.read=(C,G,T,q,M)=>(a.forceLoadFile(g),v(C,G,T,q,M)),E.mmap=(C,G,T,q,M)=>{a.forceLoadFile(
g);var p=Er(G);if(!p)throw new a.ErrnoError(48);return v(C,(l(),se),p,G,T),{ptr:p,allocated:!0}},g.stream_ops=E,g}},Ve=(e,r,t)=>e?
Le((l(),pe),e,r):"",Z={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(Y.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var i=Z.
getStreamFromFD(e);n=i.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
O)[e/4]=r.dev,(l(),O)[(e+4)/4]=r.mode,(l(),A)[(e+8)/8]=BigInt(r.nlink),(l(),O)[(e+16)/4]=r.uid,(l(),O)[(e+20)/4]=r.gid,(l(),
O)[(e+24)/4]=r.rdev,(l(),ae)[(e+32)/8]=BigInt(r.size),(l(),j)[(e+40)/4]=4096,(l(),j)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),i=r.ctime.getTime();return(l(),ae)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),A)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),ae)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),A)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),ae)[(e+80)/8]=BigInt(
Math.floor(i/1e3)),(l(),A)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(l(),ae)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),O)[(e+
8)/4]=r.bsize,(l(),O)[(e+72)/4]=r.bsize,(l(),ae)[(e+16)/8]=BigInt(r.blocks),(l(),ae)[(e+24)/8]=BigInt(r.bfree),(l(),ae)[(e+
32)/8]=BigInt(r.bavail),(l(),ae)[(e+40)/8]=BigInt(r.files),(l(),ae)[(e+48)/8]=BigInt(r.ffree),(l(),O)[(e+56)/4]=r.fsid,(l(),
O)[(e+80)/4]=r.flags,(l(),O)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,i){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);
if(n&2)return 0;var s=(l(),pe).slice(e,e+t);a.msync(r,s,i,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},
varargs:void 0,getStr(e){var r=Ve(e);return r}};function ht(e,r,t){if(w)return ue(3,0,1,e,r,t);t=b(t),Z.varargs=t;try{var n=Z.
getStreamFromFD(e);switch(r){case 0:{var i=_r();if(i<0)return-28;for(;a.streams[i];)i++;var s;return s=a.dupStream(n,i),
s.fd}case 1:case 2:return 0;case 3:return n.flags;case 4:{var i=_r();return n.flags|=i,0}case 5:{var i=Me(),c=0;return(l(),
Ge)[(i+c)/2]=2,0}case 6:case 7:return 0}return-28}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}
function ua(e,r){if(w)return ue(4,0,1,e,r);r=b(r);try{return Z.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!==
"ErrnoError")throw t;return-t.errno}}var xe=(e,r,t)=>dt(e,(l(),pe),r,t);function bt(e,r){if(w)return ue(5,0,1,e,r);e=b(e),
r=b(r);try{if(r===0)return-28;var t=a.cwd(),n=Se(t)+1;return r<n?-68:(xe(t,e,r),n)}catch(i){if(typeof a>"u"||i.name!=="E\
rrnoError")throw i;return-i.errno}}function _t(e,r,t){if(w)return ue(6,0,1,e,r,t);r=b(r),t=b(t);try{var n=Z.getStreamFromFD(
e);n.getdents||=a.readdir(n.path);for(var i=280,s=0,c=a.llseek(n,0,1),u=Math.floor(c/i),g=Math.min(n.getdents.length,u+Math.
floor(t/i)),E=u;E<g;E++){var v,C,G=n.getdents[E];if(G===".")v=n.node.id,C=4;else if(G===".."){var T=a.lookupPath(n.path,
{parent:!0});v=T.node.id,C=4}else{var q;try{q=a.lookupNode(n.node,G)}catch(M){if(M?.errno===28)continue;throw M}v=q.id,C=
a.isChrdev(q.mode)?2:a.isDir(q.mode)?4:a.isLink(q.mode)?10:8}(l(),ae)[(r+s)/8]=BigInt(v),(l(),ae)[(r+s+8)/8]=BigInt((E+1)*
i),(l(),Ge)[(r+s+16)/2]=280,(l(),se)[r+s+18]=C,xe(G,r+s+19,256),s+=i}return a.llseek(n,E*i,0),s}catch(M){if(typeof a>"u"||
M.name!=="ErrnoError")throw M;return-M.errno}}function vt(e,r,t){if(w)return ue(7,0,1,e,r,t);t=b(t),Z.varargs=t;try{var n=Z.
getStreamFromFD(e);switch(r){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var i=n.
tty.ops.ioctl_tcgets(n),s=Me();(l(),j)[s/4]=i.c_iflag||0,(l(),j)[(s+4)/4]=i.c_oflag||0,(l(),j)[(s+8)/4]=i.c_cflag||0,(l(),
j)[(s+12)/4]=i.c_lflag||0;for(var c=0;c<32;c++)(l(),se)[s+c+17]=i.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:
return n.tty?0:-59;case 21506:case 21507:case 21508:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=Me(),u=(l(),
j)[s/4],g=(l(),j)[(s+4)/4],E=(l(),j)[(s+8)/4],v=(l(),j)[(s+12)/4],C=[],c=0;c<32;c++)C.push((l(),se)[s+c+17]);return n.tty.
ops.ioctl_tcsets(n.tty,r,{c_iflag:u,c_oflag:g,c_cflag:E,c_lflag:v,c_cc:C})}return 0}case 21519:{if(!n.tty)return-59;var s=Me();
return(l(),j)[s/4]=0,0}case 21520:return n.tty?-28:-59;case 21537:case 21531:{var s=Me();return a.ioctl(n,r,s)}case 21523:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){var G=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=Me();(l(),Ge)[s/2]=G[0],(l(),
Ge)[(s+2)/2]=G[1]}return 0}case 21524:return n.tty?0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(T){if(typeof a>
"u"||T.name!=="ErrnoError")throw T;return-T.errno}}function fa(e,r){if(w)return ue(8,0,1,e,r);e=b(e),r=b(r);try{return e=
Z.getStr(e),Z.writeStat(r,a.lstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function da(e,r,t,n){
if(w)return ue(9,0,1,e,r,t,n);r=b(r),t=b(t);try{r=Z.getStr(r);var i=n&256,s=n&4096;return n=n&-6401,r=Z.calculateAt(e,r,
s),Z.writeStat(t,i?a.lstat(r):a.stat(r))}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function wt(e,r,t,n){
if(w)return ue(10,0,1,e,r,t,n);r=b(r),n=b(n),Z.varargs=n;try{r=Z.getStr(r),r=Z.calculateAt(e,r);var i=n?_r():0;return a.
open(r,t,i).fd}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function yt(e,r){if(w)return ue(11,
0,1,e,r);e=b(e),r=b(r);try{return e=Z.getStr(e),Z.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")
throw t;return-t.errno}}var ma=()=>_e("");function pa(e){e=b(e),Or(e,!k,1,!h,5242880,!1),H.threadInitTLS()}var xr=e=>{if(e instanceof
Kr||e=="unwind")return X;y(1,e)},ga=()=>{if(!mr())try{if(w){sr()&&Dr(X);return}gr(X)}catch(e){xr(e)}},Be=e=>{if(!K)try{e(),
ga()}catch(r){xr(r)}};function Br(e){if(e=b(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),j),e/4,e);r.value.then(ar);
var t=e+228;Atomics.store((l(),j),t/4,1)}}var ar=()=>Be(()=>{var e=sr();e&&(Br(e),cn())});function ha(e,r){if(e=b(e),r=b(
r),e==r)setTimeout(ar);else if(w)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=H.pthreads[e];if(!t)return;
t.postMessage({cmd:"checkMailbox"})}}var ir=[];function ba(e,r,t,n,i){t=b(t),i=b(i),n/=2,ir.length=n;for(var s=i/8,c=0;c<
n;c++)(l(),ae)[s+2*c]?ir[c]=(l(),ae)[s+2*c+1]:ir[c]=(l(),Ce)[s+2*c+1];var u=Bi[e];H.currentProxiedOperationCallerThread=
t;var g=u(...ir);return H.currentProxiedOperationCallerThread=0,typeof g=="bigint"&&(g=b(g)),g}function _a(e){e=b(e),w?postMessage(
{cmd:"cleanupThread",thread:e}):Yr(e)}function va(e){e=b(e),_&&H.pthreads[e].ref()}var wa=e=>e%4===0&&(e%100!==0||e%400===
0),ya=[0,31,60,91,121,152,182,213,244,274,305,335],Ea=[0,31,59,90,120,151,181,212,243,273,304,334],ka=e=>{var r=wa(e.getFullYear()),
t=r?ya:Ea,n=t[e.getMonth()]+e.getDate()-1;return n};function Sa(e,r){e=b(e),r=b(r);var t=new Date(e*1e3);(l(),j)[r/4]=t.
getSeconds(),(l(),j)[(r+4)/4]=t.getMinutes(),(l(),j)[(r+8)/4]=t.getHours(),(l(),j)[(r+12)/4]=t.getDate(),(l(),j)[(r+16)/
4]=t.getMonth(),(l(),j)[(r+20)/4]=t.getFullYear()-1900,(l(),j)[(r+24)/4]=t.getDay();var n=ka(t)|0;(l(),j)[(r+28)/4]=n,(l(),
ae)[(r+40)/8]=BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=i.getTimezoneOffset(),u=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(l(),j)[(r+32)/4]=u}function Et(e,r,t,n,i,s,c){
if(w)return ue(12,0,1,e,r,t,n,i,s,c);e=b(e),i=b(i),s=b(s),c=b(c);try{var u=Z.getStreamFromFD(n),g=a.mmap(u,e,i,r,t),E=g.
ptr;return(l(),j)[s/4]=g.allocated,(l(),A)[c/8]=BigInt(E),0}catch(v){if(typeof a>"u"||v.name!=="ErrnoError")throw v;return-v.
errno}}function kt(e,r,t,n,i,s){if(w)return ue(13,0,1,e,r,t,n,i,s);e=b(e),r=b(r),s=b(s);try{var c=Z.getStreamFromFD(i);t&
2&&Z.doMsync(e,c,r,n,s)}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var xa=function(e,r,t,n){
e=b(e),r=b(r),t=b(t),n=b(n);var i=new Date().getFullYear(),s=new Date(i,0,1),c=new Date(i,6,1),u=s.getTimezoneOffset(),g=c.
getTimezoneOffset(),E=Math.max(u,g);(l(),A)[e/8]=BigInt(E*60),(l(),j)[r/4]=+(u!=g);var v=T=>{var q=T>=0?"-":"+",M=Math.abs(
T),p=String(Math.floor(M/60)).padStart(2,"0"),L=String(M%60).padStart(2,"0");return`UTC${q}${p}${L}`},C=v(u),G=v(g);g<u?
(xe(C,t,17),xe(G,n,17)):(xe(C,n,17),xe(G,t,17))},St=()=>performance.timeOrigin+performance.now(),xt=()=>Date.now(),Ba=e=>e>=
0&&e<=3;function Na(e,r,t){if(t=b(t),!Ba(e))return 28;var n;e===0?n=xt():n=St();var i=Math.round(n*1e3*1e3);return(l(),ae)[t/
8]=BigInt(i),0}var Ga=()=>{},ze=()=>{nr+=1},Fa=()=>{throw ze(),"unwind"},Ia=()=>new Error().stack.toString(),Aa=e=>{var r=Ia(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",u="",g=0,E=0,v=i.exec(s);if(v?.length==5)c=v[1],u=v[2],g=v[3],E=v[4];else if(v=n.exec(s),v?.length>=4)c=v[1],u=
v[2],g=v[3],E=v[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(u=u.substring(u.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${u}:${g}:${E})
`)}return r=r.replace(/\s+$/,""),r};function Ca(e,r,t){r=b(r);var n=Aa(e);if(!r||t<=0)return Se(n)+1;var i=xe(n,r,t);return i+
1}var Bt=()=>4294967296,Ta=()=>BigInt(Bt()),Ua=()=>2,Ra=()=>_?require("os").cpus().length:navigator.hardwareConcurrency,
ja=e=>{var r=ke.buffer.byteLength,t=(e-r+65535)/65536|0;try{return ke.grow(BigInt(t)),er(),1}catch{}};function Oa(e){e=b(
e);var r=(l(),pe).length;if(e<=r)return!1;var t=Bt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var i=r*(1+.2/n);i=Math.min(
i,e+100663296);var s=Math.min(t,mt(Math.max(e,i),65536)),c=ja(s);if(c)return!0}return!1}var Fe=e=>{var r=Se(e)+1,t=pr(r);
return xe(e,t,r),t},Da=(e,r)=>{(l(),O)[e/4]=r;var t=(l(),O)[e/4];(l(),O)[(e+4)/4]=(r-t)/4294967296},Ma=e=>{var r=Se(e)+1,
t=Dt(r);return t&&xe(e,t,r),t},Te=e=>(l(),O)[e/4]+(l(),j)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
m.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Xt(r);return m.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=Nr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Gr(r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{$(e.mapState==="unmapped");var t=Yt(r);return m.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Fr(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Ir(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Ar(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Cr(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Tr(
r),n=Zt(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),o.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=qt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=Lt(
r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=zt(r);return m.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Tr(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Qt(r);return m.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=Wt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=Vt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Ht(r);return m.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=$t(r);return m.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=en(
r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Pt(r);return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Jt(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=Kt(r);return m.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var i=ye(),s=Fe(t);((c,u,g)=>st(e).call(null,c,BigInt(u),BigInt(g)))(r,BigInt(s),n),Ee(i)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),A)[e/8]);t;t=Number((l(),A)[t/8])){var n=(l(),j)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),A)[e/8]=BigInt(r),(l(),A)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),A)[e/8]),t=Number((l(),
A)[(e+8)/8]);return Ve(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),A)[e/8]),t=Number((l(),A)[(e+8)/8]);
return r?Ve(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),Ce)[e/8],g:(l(),Ce)[(e+8)/8],b:(l(),Ce)[(e+16)/8],a:(l(),Ce)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),O)[e/4],height:(l(),O)[(e+4)/4],depthOrArrayLayers:(l(),O)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),O)[e/4],y:(l(),O)[(e+4)/4],z:(l(),O)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.getJsObject(Number((l(),A)[e/
8])),mipLevel:(l(),O)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),j)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),O)[(e+8)/4],t=(l(),O)[(e+12)/4];return{offset:Te(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.buffer=m.getJsObject(Number((l(),
A)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number((l(),A)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
O)[(e+16)/4],endOfPassWriteIndex:(l(),O)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var i=r+
32*n,s=m.makeStringFromStringView(i+8);t[s]=(l(),Ce)[(i+24)/8]}return t}},makePipelineLayout:e=>e?m.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),A)[(e+8)/8])),constants:m.makePipelineConstants(Number(
(l(),A)[(e+32)/8]),Number((l(),A)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(p){if(p)return{topology:m.PrimitiveTopology[(l(),j)[(p+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),j)[(p+12)/4]],frontFace:m.FrontFace[(l(),j)[(p+16)/4]],cullMode:m.CullMode[(l(),j)[(p+20)/4]],unclippedDepth:!!(l(),
O)[(p+24)/4]}}function t(p){if(p)return{operation:m.BlendOperation[(l(),j)[p/4]],srcFactor:m.BlendFactor[(l(),j)[(p+4)/4]],
dstFactor:m.BlendFactor[(l(),j)[(p+8)/4]]}}function n(p){if(p)return{alpha:t(p+12),color:t(p+0)}}function i(p){var L=m.TextureFormat[(l(),
j)[(p+8)/4]];return L?{format:L,blend:n(Number((l(),A)[(p+16)/8])),writeMask:(l(),O)[(p+24)/4]}:void 0}function s(p,L){for(var V=[],
re=0;re<p;++re)V.push(i(L+32*re));return V}function c(p){return{compare:m.CompareFunction[(l(),j)[p/4]],failOp:m.StencilOperation[(l(),
j)[(p+4)/4]],depthFailOp:m.StencilOperation[(l(),j)[(p+8)/4]],passOp:m.StencilOperation[(l(),j)[(p+12)/4]]}}function u(p){
if(p)return{format:m.TextureFormat[(l(),j)[(p+8)/4]],depthWriteEnabled:!!(l(),O)[(p+12)/4],depthCompare:m.CompareFunction[(l(),
j)[(p+16)/4]],stencilFront:c(p+20),stencilBack:c(p+36),stencilReadMask:(l(),O)[(p+52)/4],stencilWriteMask:(l(),O)[(p+56)/
4],depthBias:(l(),j)[(p+60)/4],depthBiasSlopeScale:(l(),fr)[(p+64)/4],depthBiasClamp:(l(),fr)[(p+68)/4]}}function g(p){return{
format:m.VertexFormat[(l(),j)[(p+8)/4]],offset:Te(p+16),shaderLocation:(l(),O)[(p+24)/4]}}function E(p,L){for(var V=[],re=0;re<
p;++re)V.push(g(L+re*32));return V}function v(p){if(p){var L=m.VertexStepMode[(l(),j)[(p+8)/4]],V=Number((l(),A)[(p+24)/
8]);return!L&&!V?null:{arrayStride:Te(p+16),stepMode:L,attributes:E(V,Number((l(),A)[(p+32)/8]))}}}function C(p,L){if(p){
for(var V=[],re=0;re<p;++re)V.push(v(L+re*40));return V}}function G(p){if(p){var L={module:m.getJsObject(Number((l(),A)[(p+
8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(p+32)/8]),Number((l(),A)[(p+40)/8])),buffers:C(Number((l(),A)[(p+
48)/8]),Number((l(),A)[(p+56)/8])),entryPoint:m.makeStringFromOptionalStringView(p+16)};return L}}function T(p){if(p)return{
count:(l(),O)[(p+8)/4],mask:(l(),O)[(p+12)/4],alphaToCoverageEnabled:!!(l(),O)[(p+16)/4]}}function q(p){if(p){var L={module:m.
getJsObject(Number((l(),A)[(p+8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(p+32)/8]),Number((l(),A)[(p+40)/
8])),targets:s(Number((l(),A)[(p+48)/8]),Number((l(),A)[(p+56)/8])),entryPoint:m.makeStringFromOptionalStringView(p+16)};
return L}}var M={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),vertex:G(
e+32),primitive:r(e+96),depthStencil:u(Number((l(),A)[(e+128)/8])),multisample:T(e+136),fragment:q(Number((l(),A)[(e+160)/
8]))};return M},fillLimitStruct:(e,r)=>{var t=Number((l(),A)[r/8]);function n(c,u,g,E=0){var v=e[c]??E;(l(),O)[(u+g)/4]=
v}function i(c,u,g,E=0){var v=e[c]??E;Da(u+g,v)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("max\
TextureDimension3D",r,16),n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),
n("maxBindingsPerBindGroup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),n("maxSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPer\
ShaderStage",r,52),n("maxStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBuf\
ferOffsetAlignment",r,80),n("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageB\
ufferBindingSize",r,72),n("maxVertexBuffers",r,88),i("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBu\
fferArrayStride",r,108),n("maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentByte\
sPerSample",r,120),n("maxComputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeW\
orkgroupSizeX",r,132),n("maxComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPer\
Dimension",r,144),n("maxImmediateSize",r,148),t!==0){(l(),j)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(l(),O)[(r+88)/4]=e.subgroupMinSize,(l(),O)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,n=Ma(t),i=Se(e.vendor);m.setStringView(r+8,n,i),n+=i;var s=Se(e.architecture);m.setStringView(r+24,
n,s),n+=s;var c=Se(e.device);m.setStringView(r+40,n,c),n+=c;var u=Se(e.description);m.setStringView(r+56,n,u),n+=u,(l(),
j)[(r+72)/4]=2;var g=e.isFallbackAdapter?3:4;(l(),j)[(r+76)/4]=g,(l(),O)[(r+80)/4]=0,(l(),O)[(r+84)/4]=0},AddressMode:[,
"clamp-to-edge","repeat","mirror-repeat"],BlendFactor:[,"zero","one","src","one-minus-src","src-alpha","one-minus-src-al\
pha","dst","one-minus-dst","dst-alpha","one-minus-dst-alpha","src-alpha-saturated","constant","one-minus-constant","src1",
"one-minus-src1","src1-alpha","one-minus-src1-alpha"],BlendOperation:[,"add","subtract","reverse-subtract","min","max"],
BufferBindingType:[,,"uniform","storage","read-only-storage"],BufferMapState:[,"unmapped","pending","mapped"],CompareFunction:[
,"never","less","equal","less-equal","greater","not-equal","greater-equal","always"],CompilationInfoRequestStatus:[,"suc\
cess","callback-cancelled"],ComponentSwizzle:[,"0","1","r","g","b","a"],CompositeAlphaMode:[,"opaque","premultiplied","u\
npremultiplied","inherit"],CullMode:[,"none","front","back"],ErrorFilter:[,"validation","out-of-memory","internal"],FeatureLevel:[
,"compatibility","core"],FeatureName:{1:"core-features-and-limits",2:"depth-clip-control",3:"depth32float-stencil8",4:"t\
exture-compression-bc",5:"texture-compression-bc-sliced-3d",6:"texture-compression-etc2",7:"texture-compression-astc",8:"\
texture-compression-astc-sliced-3d",9:"timestamp-query",10:"indirect-first-instance",11:"shader-f16",12:"rg11b10ufloat-r\
enderable",13:"bgra8unorm-storage",14:"float32-filterable",15:"float32-blendable",16:"clip-distances",17:"dual-source-bl\
ending",18:"subgroups",19:"texture-formats-tier1",20:"texture-formats-tier2",21:"primitive-index",22:"texture-component-\
swizzle",327692:"chromium-experimental-unorm16-texture-formats",327729:"chromium-experimental-multi-draw-indirect"},FilterMode:[
,"nearest","linear"],FrontFace:[,"ccw","cw"],IndexFormat:[,"uint16","uint32"],InstanceFeatureName:[,"timed-wait-any","sh\
ader-source-spirv","multiple-devices-per-adapter"],LoadOp:[,"load","clear"],MipmapFilterMode:[,"nearest","linear"],OptionalBool:[
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},qa={undefined:1,unknown:1,destroyed:2},
Ue=()=>{nr-=1};function La(e,r,t,n,i,s){e=b(e),r=b(r),t=b(t),n=b(n),i=b(i),s=b(s);var c=m.getJsObject(e),u={};if(s){var g=Number(
(l(),A)[(s+24)/8]);if(g){var E=Number((l(),A)[(s+32)/8]);u.requiredFeatures=Array.from((l(),O).subarray(E/4,(E+g*4)/4),p=>m.
FeatureName[p])}var v=Number((l(),A)[(s+40)/8]);if(v){let p=function(V,re,me,we=!1){var ce=re+me,Pe=(l(),O)[ce/4];Pe!=4294967295&&
(!we||Pe!=0)&&(G[V]=Pe)},L=function(V,re,me){var we=re+me,ce=(l(),O)[we/4],Pe=(l(),O)[(we+4)/4];(ce!=4294967295||Pe!=4294967295)&&
(G[V]=Te(we))};var C=Number((l(),A)[v/8]),G={};if(p("maxTextureDimension1D",v,8),p("maxTextureDimension2D",v,12),p("maxT\
extureDimension3D",v,16),p("maxTextureArrayLayers",v,20),p("maxBindGroups",v,24),p("maxBindGroupsPlusVertexBuffers",v,28),
p("maxBindingsPerBindGroup",v,32),p("maxDynamicUniformBuffersPerPipelineLayout",v,36),p("maxDynamicStorageBuffersPerPipe\
lineLayout",v,40),p("maxSampledTexturesPerShaderStage",v,44),p("maxSamplersPerShaderStage",v,48),p("maxStorageBuffersPer\
ShaderStage",v,52),p("maxStorageTexturesPerShaderStage",v,56),p("maxUniformBuffersPerShaderStage",v,60),p("minUniformBuf\
ferOffsetAlignment",v,80),p("minStorageBufferOffsetAlignment",v,84),L("maxUniformBufferBindingSize",v,64),L("maxStorageB\
ufferBindingSize",v,72),p("maxVertexBuffers",v,88),L("maxBufferSize",v,96),p("maxVertexAttributes",v,104),p("maxVertexBu\
fferArrayStride",v,108),p("maxInterStageShaderVariables",v,112),p("maxColorAttachments",v,116),p("maxColorAttachmentByte\
sPerSample",v,120),p("maxComputeWorkgroupStorageSize",v,124),p("maxComputeInvocationsPerWorkgroup",v,128),p("maxComputeW\
orkgroupSizeX",v,132),p("maxComputeWorkgroupSizeY",v,136),p("maxComputeWorkgroupSizeZ",v,140),p("maxComputeWorkgroupsPer\
Dimension",v,144),p("maxImmediateSize",v,148,!0),C!==0){(l(),j)[(C+8)/4];var T=C;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(p("maxStorageBuffersInVertexStage",T,16),p("maxStorageTexturesInVertexStage",T,20),p("maxStorageBuffersInFra\
gmentStage",T,24),p("maxStorageTexturesInFragmentStage",T,28))}u.requiredLimits=G}var q=Number((l(),A)[(s+48)/8]);if(q){
var M={label:m.makeStringFromOptionalStringView(q+8)};u.defaultQueue=M}u.label=m.makeStringFromOptionalStringView(s+8)}ze(),
m.Internals.futureInsert(r,c.requestDevice(u).then(p=>{Ue(),Be(()=>{m.Internals.jsObjectInsert(i,p.queue),m.Internals.jsObjectInsert(
n,p),o.peercomputeOnDevice?.(p),n=BigInt(n),m.Internals.futureInsert(t,p.lost.then(L=>{Be(()=>{p.onuncapturederror=me=>{};
var V=ye(),re=Fe(L.message);Ur(t,qa[L.reason],BigInt(re)),Ee(V)})})),p.onuncapturederror=L=>{var V=5;L.error instanceof GPUValidationError?
V=2:L.error instanceof GPUOutOfMemoryError?V=3:L.error instanceof GPUInternalError&&(V=4);var re=ye(),me=Fe(L.error.message);
tn(BigInt(n),V,BigInt(me)),Ee(re)},jr(r,1,BigInt(n),0n)})},p=>{Ue(),Be(()=>{var L=ye(),V=Fe(p.message);jr(r,3,BigInt(n),
BigInt(V)),t&&Ur(t,4,BigInt(V)),Ee(L)})}))}function za(e){e=b(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];
if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}var Qa=function(e,r,t){e=b(e),r=
b(r),t=b(t);var n=(()=>{var i=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=i.getMappedRange(r,t)}catch{return 0n}var c=ln(
16,s.byteLength);return(l(),pe).set(new Uint8Array(s),c),m.Internals.bufferOnUnmaps[e].push(()=>Mt(c)),c})();return BigInt(
n)},Wa=function(e,r,t,n,i){e=b(e),r=b(r),t=b(t),n=b(n),i=b(i);var s=m.getJsObject(e);m.Internals.bufferOnUnmaps[e]=[],i==
-1&&(i=void 0),ze(),m.Internals.futureInsert(r,s.mapAsync(t,n,i).then(()=>{Ue(),Be(()=>{Rr(r,1,0n)})},c=>{Ue(),Be(()=>{var u=ye(),
g=Fe(c.message),E=c.name==="AbortError"?4:c.name==="OperationError"?3:0;Rr(r,E,BigInt(g)),delete m.Internals.bufferOnUnmaps[e]})}))};
function Va(e){e=b(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.
Internals.bufferOnUnmaps[e],r.unmap()}}function Ha(e){e=b(e),delete m.Internals.jsObjects[e]}function $a(e,r,t){e=b(e),r=
b(r),t=b(t);var n=!!(l(),O)[(r+40)/4],i={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),O)[(r+24)/4],size:Te(r+
32),mappedAtCreation:n},s=m.getJsObject(e),c;try{c=s.createBuffer(i)}catch{return!1}return m.Internals.jsObjectInsert(t,
c),n&&(m.Internals.bufferOnUnmaps[t]=[]),!0}function Pa(e,r,t){e=b(e),r=b(r),t=b(t);var n=Number((l(),A)[r/8]),i=(l(),j)[(n+
8)/4],s={label:m.makeStringFromOptionalStringView(r+8),code:""};switch(i){case 2:{s.code=m.makeStringFromStringView(n+16);
break}}var c=m.getJsObject(e);m.Internals.jsObjectInsert(t,c.createShaderModule(s))}var Ja=e=>{const r=m.getJsObject(e);
r.onuncapturederror=null,r.destroy()};function Ka(e,r,t,n){r=b(r),t=b(t),n=b(n);var i;if(t){i={featureLevel:m.FeatureLevel[(l(),
j)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),j)[(t+12)/4]],forceFallbackAdapter:!!(l(),O)[(t+16)/4]};var s=Number(
(l(),A)[t/8]);if(s!==0){(l(),j)[(s+8)/4];var c=s;i.xrCompatible=!!(l(),O)[(c+16)/4]}}if(!("gpu"in navigator)){var u=ye(),
g=Fe("WebGPU not available on this browser (navigator.gpu is not available)");$e(r,3,BigInt(n),BigInt(g)),Ee(u);return}ze(),
m.Internals.futureInsert(r,navigator.gpu.requestAdapter(i).then(E=>{Ue(),Be(()=>{if(E)m.Internals.jsObjectInsert(n,E),$e(
r,1,BigInt(n),0n);else{var v=ye(),C=Fe("WebGPU not available on this browser (requestAdapter returned null)");$e(r,3,BigInt(
n),BigInt(C)),Ee(v)}})},E=>{Ue(),Be(()=>{var v=ye(),C=Fe(E.message);$e(r,4,BigInt(n),BigInt(C)),Ee(v)})}))}var Xa=function(e,r){
e=b(e),r=b(r);var t=m.getJsObject(e);ze(),m.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Ue(),Be(()=>{rn(r,
1)})}))},Nt=function(e,r,t){return e=b(e),r=b(r),t=b(t),ve.handleAsync(async()=>{var n=[];if(t){var i=(l(),j)[t/4];n.length=
r+1,n[r]=new Promise(g=>setTimeout(g,i,0))}else n.length=r;for(var s=0;s<r;++s){var c=Te(e+s*8);if(!(c in m.Internals.futures))
return c;n[s]=m.Internals.futures[c]}const u=await Promise.race(n);return delete m.Internals.futures[u],u})};Nt.isAsync=
!0;var or={},Ya=()=>S||"./this.program",He=()=>{if(!He.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Ya()};
for(var t in or)or[t]===void 0?delete r[t]:r[t]=or[t];var n=[];for(var t in r)n.push(`${t}=${r[t]}`);He.strings=n}return He.
strings};function Gt(e,r){if(w)return ue(14,0,1,e,r);e=b(e),r=b(r);var t=0,n=0;for(var i of He()){var s=r+t;(l(),A)[(e+n)/
8]=BigInt(s),t+=xe(i,s,1/0)+1,n+=8}return 0}function Ft(e,r){if(w)return ue(15,0,1,e,r);e=b(e),r=b(r);var t=He();(l(),A)[e/
8]=BigInt(t.length);var n=0;for(var i of t)n+=Se(i)+1;return(l(),A)[r/8]=BigInt(n),0}function It(e){if(w)return ue(16,0,
1,e);try{var r=Z.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var Za=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){var c=Number((l(),A)[r/8]),u=Number((l(),A)[(r+8)/8]);r+=16;var g=a.read(
e,(l(),se),c,u,n);if(g<0)return-1;if(i+=g,g<u)break}return i};function At(e,r,t,n){if(w)return ue(17,0,1,e,r,t,n);r=b(r),
t=b(t),n=b(n);try{var i=Z.getStreamFromFD(e),s=Za(i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function Ct(e,r,t,n){if(w)return ue(18,0,1,e,r,t,n);r=b(r),n=b(n);try{if(isNaN(r))return 61;
var i=Z.getStreamFromFD(e);return a.llseek(i,r,t),(l(),ae)[n/8]=BigInt(i.position),i.getdents&&r===0&&t===0&&(i.getdents=
null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var ei=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){
var c=Number((l(),A)[r/8]),u=Number((l(),A)[(r+8)/8]);r+=16;var g=a.write(e,(l(),se),c,u,n);if(g<0)return-1;if(i+=g,g<u)
break}return i};function Tt(e,r,t,n){if(w)return ue(19,0,1,e,r,t,n);r=b(r),t=b(t),n=b(n);try{var i=Z.getStreamFromFD(e),
s=ei(i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function ri(e,r){
e=b(e),r=b(r);try{return vr((l(),pe).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function ti(e,r){e=b(e),r=b(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(t.info,r),1}function ni(e,r){
e=b(e),r=b(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function ai(e,r){e=b(e);var t=m.getJsObject(
e);return t.features.has(m.FeatureName[r])}var ii=function(e){e=b(e);var r=(()=>{var t=m.getJsObject(e);return t.size})();
return BigInt(r)},oi=function(e,r){e=b(e),r=b(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8),
timestampWrites:m.makePassTimestampWrites(Number((l(),A)[(r+24)/8]))});var i=m.getJsObject(e),s=Ar(0n);return m.Internals.
jsObjectInsert(s,i.beginComputePass(n)),s})();return BigInt(t)};function si(e,r,t,n,i,s){e=b(e),r=b(r),t=b(t),n=b(n),i=b(
i),s=b(s);var c=m.getJsObject(e),u=m.getJsObject(r),g=m.getJsObject(n);c.copyBufferToBuffer(u,t,g,i,s)}var ci=function(e,r){
e=b(e);var t=(()=>{var n=m.getJsObject(e),i=Fr(0n);return m.Internals.jsObjectInsert(i,n.finish()),i})();return BigInt(t)};
function li(e,r,t,n){e=b(e);var i=m.getJsObject(e);i.dispatchWorkgroups(r,t,n)}function ui(e){e=b(e);var r=m.getJsObject(
e);r.end()}function fi(e,r,t,n,i){e=b(e),t=b(t),n=b(n),i=b(i);var s=m.getJsObject(e),c=m.getJsObject(t);n==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(l(),O),i/4,n)}function di(e,r){e=b(e),r=b(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var mi=function(e,r){e=b(e);var t=(()=>{var n=m.getJsObject(e),i=Gr(0n);return m.Internals.jsObjectInsert(i,n.getBindGroupLayout(
r)),i})();return BigInt(t)},pi=function(e,r){e=b(e),r=b(r);var t=(()=>{function n(g){var E=Number((l(),A)[(g+16)/8]),v=Number(
(l(),A)[(g+40)/8]),C=Number((l(),A)[(g+48)/8]),G=0;m.iterateExtensions(g,{327681:M=>{G=Number((l(),A)[(M+16)/8])}});var T;
if(E){var q=Te(g+32);q==-1&&(q=void 0),T={buffer:m.getJsObject(E),offset:Te(g+24),size:q}}else T=m.getJsObject(v||C||G);
return{binding:(l(),O)[(g+8)/4],resource:T}}function i(g,E){for(var v=[],C=0;C<g;++C)v.push(n(E+56*C));return v}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),A)[(r+24)/8])),entries:i(Number((l(),A)[(r+32)/8]),
Number((l(),A)[(r+40)/8]))},c=m.getJsObject(e),u=Nr(0n);return m.Internals.jsObjectInsert(u,c.createBindGroup(s)),u})();
return BigInt(t)},gi=function(e,r){e=b(e),r=b(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var i=m.getJsObject(e),s=Ir(0n);return m.Internals.jsObjectInsert(s,i.createCommandEncoder(n)),s})();return BigInt(t)},hi=function(e,r){
e=b(e),r=b(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),i=m.getJsObject(e),s=Cr(0n);return m.Internals.jsObjectInsert(
s,i.createComputePipeline(n)),s})();return BigInt(t)};function bi(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var _i=function(e,r,t){e=b(e),r=b(r),t=b(t);var n=m.getJsObject(
e),i=Array.from((l(),ae).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(i)};function vi(e,r,t,n,i){e=b(e),r=b(r),
t=b(t),n=b(n),i=b(i);var s=m.getJsObject(e),c=m.getJsObject(r),u=(l(),pe).subarray(n,n+i);s.writeBuffer(c,t,u,0,i)}var ve={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;ve.asyncExports=new Set;var t={};for(let[i,s]of Object.entries(
e))if(typeof s=="function"){r.test(i)&&(ve.asyncExports.add(s),s=ve.makeAsyncFunction(s));var n=ve.instrumentFunction(s);
t[i]=n}else t[i]=s;return t},asyncExports:null,isAsyncExport(e){return ve.asyncExports?.has(e)},handleAsync:async e=>{ze();
try{return await e()}finally{Ue()}},handleSleep:e=>ve.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},Ut=e=>{var r=o["_"+e];return r},wi=(e,r)=>{(l(),se).set(e,r)},Rt=(e,r,t,n,i)=>{var s={pointer:M=>BigInt(M),
string:M=>{var p=0;return M!=null&&M!==0&&(p=Fe(M)),BigInt(p)},array:M=>{var p=pr(M.length);return wi(M,p),BigInt(p)}};function c(M){
return r==="string"?Ve(Number(M)):r==="pointer"?Number(M):r==="boolean"?!!M:M}var u=Ut(e),g=[],E=0;if(n)for(var v=0;v<n.
length;v++){var C=s[t[v]];C?(E===0&&(E=ye()),g[v]=C(n[v])):g[v]=n[v]}var G=u(...g);function T(M){return E!==0&&Ee(E),c(M)}
var q=i?.async;return q?G.then(T):(G=T(G),G)},yi=(e,r,t,n)=>{var i=!t||t.every(c=>c==="number"||c==="boolean"),s=r!=="st\
ring";return s&&i&&!n?Ut(e):(...c)=>Rt(e,r,t,c,n)},Ei=(...e)=>a.createPath(...e),ki=(...e)=>a.unlink(...e),Si=(...e)=>a.
createLazyFile(...e),xi=(...e)=>a.createDevice(...e);if(H.init(),a.createPreloadedFile=la,a.preloadFile=Sr,a.staticInit(),
zn(),o.noExitRuntime&&(br=o.noExitRuntime),o.preloadPlugins&&(gt=o.preloadPlugins),o.print&&(fe=o.print),o.printErr&&(ie=
o.printErr),o.wasmBinary&&(be=o.wasmBinary),o.arguments&&o.arguments,o.thisProgram&&(S=o.thisProgram),o.preInit)for(typeof o.
preInit=="function"&&(o.preInit=[o.preInit]);o.preInit.length>0;)o.preInit.shift()();o.ENV=or,o.mmapAlloc=Er,o.wasmMemory=
ke,o.addRunDependency=tr,o.removeRunDependency=rr,o.ccall=Rt,o.cwrap=yi,o.FS_preloadFile=Sr,o.FS_unlink=ki,o.FS_createPath=
Ei,o.FS_createDevice=xi,o.FS=a,o.FS_createDataFile=pt,o.FS_createLazyFile=Si,o.MEMFS=D;var Bi=[nt,at,lt,ht,ua,bt,_t,vt,fa,
da,wt,yt,Et,kt,Gt,Ft,It,At,Ct,Tt];function jt(e,r,t,n){return ve.handleAsync(async()=>await f(Ve(Number(e)),Number(r),Number(
t),Number(n)))}jt.sig="jjjjj";var Ot,Dt,Mt,Nr,Gr,Fr,Ir,Ar,Cr,qt,Lt,zt,Qt,Wt,Vt,Ht,$t,Pt,Jt,Kt,Xt,Yt,Zt,Tr,en,Ur,Rr,$e,jr,
rn,tn,sr,nn,Or,an,on,sn,Dr,cn,ln,un,fn,dn,mn,pn,gn;function Ni(e){o._wllama_malloc=e.wllama_malloc,o._wllama_start=e.wllama_start,
o._wllama_action=e.wllama_action,o._wllama_exit=e.wllama_exit,o._wllama_debug=e.wllama_debug,Ot=o._main=e.main,Dt=e.malloc,
Mt=e.free,Nr=e.emwgpuCreateBindGroup,Gr=e.emwgpuCreateBindGroupLayout,Fr=e.emwgpuCreateCommandBuffer,Ir=e.emwgpuCreateCommandEncoder,
Ar=e.emwgpuCreateComputePassEncoder,Cr=e.emwgpuCreateComputePipeline,qt=e.emwgpuCreateExternalTexture,Lt=e.emwgpuCreatePipelineLayout,
zt=e.emwgpuCreateQuerySet,Qt=e.emwgpuCreateRenderBundle,Wt=e.emwgpuCreateRenderBundleEncoder,Vt=e.emwgpuCreateRenderPassEncoder,
Ht=e.emwgpuCreateRenderPipeline,$t=e.emwgpuCreateSampler,Pt=e.emwgpuCreateSurface,Jt=e.emwgpuCreateTexture,Kt=e.emwgpuCreateTextureView,
Xt=e.emwgpuCreateAdapter,Yt=e.emwgpuCreateBuffer,Zt=e.emwgpuCreateDevice,Tr=e.emwgpuCreateQueue,en=e.emwgpuCreateShaderModule,
Ur=e.emwgpuOnDeviceLostCompleted,Rr=e.emwgpuOnMapAsyncCompleted,$e=e.emwgpuOnRequestAdapterCompleted,jr=e.emwgpuOnRequestDeviceCompleted,
rn=e.emwgpuOnWorkDoneCompleted,tn=e.emwgpuOnUncapturedError,e._emscripten_tls_init,sr=e.pthread_self,nn=e.emscripten_builtin_memalign,
Or=e._emscripten_thread_init,an=e._emscripten_thread_crashed,on=e._emscripten_run_js_on_main_thread,sn=e._emscripten_thread_free_data,
Dr=e._emscripten_thread_exit,cn=e._emscripten_check_mailbox,ln=e.memalign,un=e.__trap,fn=e.emscripten_stack_set_limits,dn=
e._emscripten_stack_restore,mn=e._emscripten_stack_alloc,pn=e.emscripten_stack_get_current,gn=e.__indirect_function_table}
var Qe;function Gi(){Qe={__asyncjs__js_file_read:jt,__pthread_create_js:ut,__syscall_fcntl64:ht,__syscall_getcwd:bt,__syscall_getdents64:_t,
__syscall_ioctl:vt,__syscall_openat:wt,__syscall_stat64:yt,_abort_js:ma,_emscripten_init_main_thread_js:pa,_emscripten_notify_mailbox_postmessage:ha,
_emscripten_receive_on_main_thread_js:ba,_emscripten_thread_cleanup:_a,_emscripten_thread_mailbox_await:Br,_emscripten_thread_set_strongref:va,
_localtime_js:Sa,_mmap_js:Et,_munmap_js:kt,_tzset_js:xa,clock_time_get:Na,emscripten_check_blocking_allowed:Ga,emscripten_date_now:xt,
emscripten_exit_with_live_runtime:Fa,emscripten_get_callstack:Ca,emscripten_get_heap_max:Ta,emscripten_get_now:St,emscripten_has_asyncify:Ua,
emscripten_num_logical_cores:Ra,emscripten_resize_heap:Oa,emwgpuAdapterRequestDevice:La,emwgpuBufferDestroy:za,emwgpuBufferGetConstMappedRange:Qa,
emwgpuBufferMapAsync:Wa,emwgpuBufferUnmap:Va,emwgpuDelete:Ha,emwgpuDeviceCreateBuffer:$a,emwgpuDeviceCreateShaderModule:Pa,
emwgpuDeviceDestroy:Ja,emwgpuInstanceRequestAdapter:Ka,emwgpuQueueOnSubmittedWorkDone:Xa,emwgpuWaitAny:Nt,environ_get:Gt,
environ_sizes_get:Ft,exit:gr,fd_close:It,fd_read:At,fd_seek:Ct,fd_write:Tt,memory:ke,random_get:ri,wgpuAdapterGetInfo:ti,
wgpuAdapterGetLimits:ni,wgpuAdapterHasFeature:ai,wgpuBufferGetSize:ii,wgpuCommandEncoderBeginComputePass:oi,wgpuCommandEncoderCopyBufferToBuffer:si,
wgpuCommandEncoderFinish:ci,wgpuComputePassEncoderDispatchWorkgroups:li,wgpuComputePassEncoderEnd:ui,wgpuComputePassEncoderSetBindGroup:fi,
wgpuComputePassEncoderSetPipeline:di,wgpuComputePipelineGetBindGroupLayout:mi,wgpuDeviceCreateBindGroup:pi,wgpuDeviceCreateCommandEncoder:gi,
wgpuDeviceCreateComputePipeline:hi,wgpuInstanceHasWGSLLanguageFeature:bi,wgpuQueueSubmit:_i,wgpuQueueWriteBuffer:vi}}function Fi(e){
e=Object.assign({},e);var r=E=>(v,C,G)=>E(v,BigInt(C||0),BigInt(G||0)),t=E=>v=>Number(E(BigInt(v))),n=E=>v=>E(BigInt(v)),
i=E=>()=>Number(E()),s=E=>(v,C)=>Number(E(BigInt(v),BigInt(C))),c=E=>(v,C,G,T,q,M)=>E(BigInt(v),C,G,T,q,M),u=E=>(v,C,G,T,q)=>E(
v,BigInt(C),G,BigInt(T),q),g=E=>(v,C)=>E(BigInt(v),BigInt(C));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=u(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
g(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.emscripten_stack_get_current),e}async function Ii(){var e=Ot,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,it(n,!0),n}catch(i){return xr(i)}}function cr(){if(je>0){We=cr;return}
if(w){$r();return}if(Qn(),je>0){We=cr;return}async function e(){if(o.calledRun=!0,!K){$r(),o.onRuntimeInitialized?.();var r=o.
noInitialRun||!1;r||await Ii(),Wn()}}o.setStatus?(o.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>o.setStatus(""),
1),e()},1)):e()}var Ie;return w||(Jr(),cr()),o}var Bn=1,Nn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
Ze=new Uint8Array([71,76,85,69]),Wr=0,Di=1,Mi=2,qi=3,Li=4,zi=5,Qi=6,Wi=7,Vi=8,Hi=9,$i=10,Gn={str:Li,int:Mi,float:qi,bool:Di,
raw:zi,arr_str:Hi,arr_int:Wi,arr_float:Vi,arr_bool:Qi,arr_raw:$i,null:Wr};function Pi(o){let f=0;const d=new DataView(o.
buffer),h=()=>{const W=d.getUint32(f,!0);return f+=4,W},k=()=>{const W=d.getInt32(f,!0);return f+=4,W},_=()=>{const W=d.
getFloat32(f,!0);return f+=4,W},w=()=>h()!==0,N=W=>{const ee=W??h(),de=new TextDecoder().decode(o.slice(f,f+ee));return f+=
ee,de},S=()=>{const W=h(),ee=o.slice(f,f+W);return f+=W,ee},y=W=>{const ee=h(),de=new Array(ee);for(let fe=0;fe<ee;fe++)
de[fe]=W();return de},x=()=>null,I=W=>{switch(W.type){case"str":return N();case"int":return k();case"float":return _();case"\
bool":return w();case"raw":return S();case"arr_str":return y(N);case"arr_int":return y(k);case"arr_float":return y(_);case"\
arr_bool":return y(w);case"arr_raw":return y(S);case"null":return x()}},U=o[0]===Ze[0]&&o[1]===Ze[1]&&o[2]===Ze[2]&&o[3]===
Ze[3];if(f+=4,!U)throw new Error("Invalid magic number");if(h()!==Bn)throw new Error("Invalid version number");const B=N(
8),P=Nn[B];if(!P)throw new Error(`Unknown message name: ${B}`);const ne={_name:B};for(const W of P.fields){const ee=h();
if(ee===Wr){if(!W.isNullable)throw new Error(`${B}: Expect field ${W.name} to be non-nullable`);ne[W.name]=null;continue}
if(ee!==Gn[W.type])throw new Error(`${B}: Expect field ${W.name} to have type ${W.type}`);ne[W.name]=I(W)}return ne}function Ji(o){
const f=Nn[o._name];if(!f)throw new Error(`Unknown message name: ${o._name}`);const d=[],h=F=>{const B=new ArrayBuffer(4);
new DataView(B).setUint32(0,F,!0),d.push(new Uint8Array(B))},k=F=>{const B=new ArrayBuffer(4);new DataView(B).setInt32(0,
F,!0),d.push(new Uint8Array(B))},_=F=>{const B=new ArrayBuffer(4);new DataView(B).setFloat32(0,F,!0),d.push(new Uint8Array(
B))},w=F=>{h(F?1:0)},N=F=>{const B=new TextEncoder().encode(F);h(B.byteLength),d.push(B)},S=F=>{h(F.byteLength),d.push(F)},
y=(F,B)=>{h(F.length);for(const P of F)B(P)};d.push(Ze),h(Bn);{const F=new TextEncoder().encode(o._name);d.push(F)}for(const F of f.
fields){const B=o[F.name];if(!F.isNullable&&B==null)throw new Error(`${o._name}: Expect field ${F.name} to be non-nullab\
le`);if(B==null){h(Wr);continue}switch(h(Gn[F.type]),F.type){case"str":N(B);break;case"int":k(B);break;case"float":_(B);
break;case"bool":w(B);break;case"raw":S(B);break;case"arr_str":y(B,N);break;case"arr_int":y(B,k);break;case"arr_float":y(
B,_);break;case"arr_bool":y(B,w);break;case"arr_raw":y(B,S);break}}const x=d.reduce((F,B)=>F+B.byteLength,0),I=new Uint8Array(
x);let U=0;for(const F of d)I.set(F,U),U+=F.byteLength;return I}const Fn=4*1024**2,hn=1024*1024;function Ki({files:o,reader:f,
getMemory:d,getSignal:h=()=>{}}){const k=new Map(o.map(_=>[_.name,_]));return async(_,w,N,S)=>{const y=k.get(_.replace(/^\/?models\//,
""));if(!y||![w,N,S].every(I=>Number.isSafeInteger(I)&&I>=0)||w>y.size)throw new Error("Invalid GGUF native file read");
const x=Math.min(N,y.size-w);if(!Number.isSafeInteger(S+x)||S+x>d().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let I=0;I<x;){ge(h());const U=Math.min(Fn,x-I),F=await f.read(y.path,w+I,U,{signal:h()});if(ge(h()),
!(F instanceof Uint8Array)||F.byteLength!==U)throw new Error("Incomplete GGUF artifact range");new Uint8Array(d()).set(F,
S+I),I+=U}return BigInt(x)}}function Xi(o,f){o.FS.mkdir("/models"),o.FS.mount(o.MEMFS,{root:"."},"/models");const d=new Map(
f.map(_=>[_.name,_])),h=o.MEMFS.stream_ops;for(const _ of["read","llseek"]){const w=h[_];h[_]=function(N,...S){const y=d.
get(N.node.name);return y&&(N.node.usedBytes=y.size),w.call(this,N,...S)},o.MEMFS.ops_table.file.stream[_]=h[_]}const k=h.
mmap;h.mmap=function(_,...w){if(d.has(_.node.name))throw new Error("GGUF artifact mmap is prohibited");return k.call(this,
_,...w)},o.MEMFS.ops_table.file.stream.mmap=h.mmap;for(const _ of f)o.FS_createDataFile("/models",_.name,new Uint8Array(
0),!0,!1,!0)}function Yi(o,f,{collect:d=!1,onLost:h}={}){if(f.device=o,f.runtimeFeatures=[...o.features],f.runtimeAdapter=
o.adapterInfo?{vendor:o.adapterInfo.vendor,architecture:o.adapterInfo.architecture,isFallbackAdapter:o.adapterInfo.isFallbackAdapter??
!1}:null,!o.features.has("shader-f16")||f.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(o.lost.then(S=>h?.(S)),!d)return()=>{};const k=Object.getOwnPropertyDescriptor(o,
"createCommandEncoder"),_=Object.getOwnPropertyDescriptor(o.queue,"submit"),w=o.createCommandEncoder.bind(o),N=o.queue.submit.
bind(o.queue);return o.createCommandEncoder=(...S)=>{const y=w(...S),x=y.beginComputePass.bind(y);return y.beginComputePass=
(...I)=>{const U=x(...I);for(const F of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const B=U[F].bind(U);U[F]=(...P)=>{
const ne=B(...P);return f.dispatches+=1,ne}}return U},y},o.queue.submit=(...S)=>{const y=N(...S);return f.submissions+=1,
y},()=>{k?Object.defineProperty(o,"createCommandEncoder",k):delete o.createCommandEncoder,_?Object.defineProperty(o.queue,
"submit",_):delete o.queue.submit}}function Zi(o){const f=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(o);return f?
{gpuLayers:Number(f[1]),totalLayers:Number(f[2])}:null}function eo(o){const f=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(o);return f?{backend:f[1],kind:f[2].toLowerCase(),bytes:Math.round(Number(f[3])*1024**2)}:null}async function ro({wasmUrl:o,
weights:f,reader:d,signal:h,collectGpuEvidence:k=!1,onProgress:_,onLost:w,initialize:N=Oi}={}){const S=f.map(($,z)=>({...$,
name:`model-${String(z+1).padStart(5,"0")}-of-${String(f.length).padStart(5,"0")}.gguf`})),y={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let x=h,I,U,F,B,P;const ne=new Promise(($,z)=>{B=$,P=z}),W=$=>{const z=Zi(String(
$));z&&(y.offload=z,_?.({type:"gpu-offload",...z}));const l=eo(String($));l&&y.buffers.length<32&&(y.buffers.push(l),_?.(
{type:"native-buffer",...l,wasmMemoryBytes:F?.wasmMemory?.buffer.byteLength??0}))},ee=$=>{I=new Error(`Model session los\
t: GGUF native runtime failed: ${String($).slice(0,300)}`),P(I)};F={noInitialRun:!0,pthreadPoolSize:0,locateFile($){if($!==
"wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return o},print:W,printErr:W,onAbort:ee,onExit:ee,
preRun(){F.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){B()},peercomputeOnDevice($){try{U?.(),U=Yi($,y,{collect:k,onLost(z){
y.lost=!0,w?.(z)}})}catch(z){$.destroy(),ee(z.message)}}};const de=Ki({files:S,reader:d,getMemory:()=>F.wasmMemory.buffer,
getSignal:()=>x});N(F,de),await ne,ge(h),Xi(F,S);const fe=F.cwrap("wllama_start","string",[],{async:!0}),ie=F.cwrap("wll\
ama_malloc","bigint",["bigint","number"]),be=F.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let R=!1;const K=async($,z,l)=>{
if(R)throw new Error("Concurrent GGUF native calls are prohibited");if(I)throw I;if(y.lost)throw new Error("GPU device l\
ost; GGUF session is unavailable");ge(l),R=!0,x=l;try{const J=Ji(z);if(J.byteLength>hn)throw new Error("GGUF native mess\
age exceeds its byte budget");const oe=Number(ie(BigInt(J.byteLength),0)),le=new Uint8Array(F.wasmMemory.buffer);if(!Number.
isSafeInteger(oe)||oe<=0||oe+J.length>le.length)throw new Error("Invalid GGUF input pointer");le.set(J,oe);const se=Number(
await be($,BigInt(oe)));if(I)throw I;const pe=F.wasmMemory.buffer,Ge=new DataView(pe).getUint32(oe,!0);if(!Number.isSafeInteger(
se)||se<=0||Ge>hn||se+Ge>pe.byteLength)throw new Error("Invalid GGUF output buffer");return Pi(new Uint8Array(pe,se,Ge).
slice())}catch(J){throw I??=new Error(`Model session lost: GGUF native action failed: ${String(J.message??J).slice(0,300)}`),
I}finally{R=!1,x=void 0}},X=JSON.parse(await fe());if(I)throw I;if(!X.success||!y.device)throw new Error("GGUF native ha\
rdware GPU backend did not initialize");return ge(h),{files:S,action:K,evidence:y,async settleGpu(){try{await y.device.queue.
onSubmittedWorkDone()}catch($){throw y.lost=!0,I=new Error(`Model session lost: GGUF GPU completion failed: ${String($.message??
$).slice(0,300)}`),I}},close(){U?.(),y.device?.destroy()},memoryBytes(){return F.wasmMemory.buffer.byteLength}}}const to=o=>o/
2**32|0,no=o=>o>>>0;function ao(o,f,d,h){const k=to(d),_=no(d);o.setUint32(f,h?_:k,h),o.setUint32(f+4,h?k:_,h)}function bn(o){
return o instanceof Uint8Array||ArrayBuffer.isView(o)&&o.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in o&&o.BYTES_PER_ELEMENT===
1}const io=o=>o?`"${o}" `:"";function In(o,f,d=""){if(bn(o)&&f===void 0)return o;const h=bn(o),k="",_=h?`length=${o.length}`:
`type=${typeof o}`,w=io(d)+"expected Uint8Array"+k+", got "+_;throw h?new RangeError(w):new TypeError(w)}const oo=(o,f)=>{
if(o===null||typeof o!="object"||Array.isArray(o))throw new TypeError((f==="object"?"":`"${f}" `)+"expected object, got \
type="+typeof o)},_n=(o,f)=>{oo(o,f);const d=Object.getPrototypeOf(o);if(d!==Object.prototype&&d!==null)throw new TypeError(
`"${f}" expected plain object`);if(Object.hasOwn(o,"__proto__"))throw new TypeError(`"${f}.__proto__" is not allowed`)};
function vn(o,f=!0){if(o.destroyed)throw new Error("hash was destroyed");if(f&&o.finished)throw new Error("digest() was \
already called")}function so(o,f){In(o,void 0,"output");const d=f.outputLen;if(!(o.length>=d))throw new RangeError('"out\
put" expected length >= '+d)}function wn(...o){for(let f=0;f<o.length;f++)o[f].fill(0)}function Mr(o){return new DataView(
o.buffer,o.byteOffset,o.byteLength)}function Ne(o,f){return o<<32-f|o>>>f}function co(o,f,d="opts"){return _n(o,"default\
s"),f!==void 0&&_n(f,d),Object.assign(Object.create(null),o,f)}function lo(o,f={}){if(typeof o!="function")throw new TypeError(
'"hashCons" expected function, got type='+typeof o);f=co({},f,"info");const d=(k,_)=>o(_).update(k).digest(),h=o(void 0);
return d.outputLen=h.outputLen,d.blockLen=h.blockLen,d.canXOF=h.canXOF,d.create=k=>o(k),Object.assign(d,f),Object.freeze(
d)}const uo=o=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,o])});function fo(o,f,d){return o&f^~o&d}function mo(o,f,d){
return o&f^o&d^f&d}class po{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(f,d,h,k){
this.blockLen=f,this.outputLen=d,this.padOffset=h,this.isLE=k,this.buffer=new Uint8Array(f),this.view=Mr(this.buffer)}update(f){
vn(this),In(f);const{view:d,buffer:h,blockLen:k}=this,_=f.length;let w=!1;for(let N=0;N<_;){const S=Math.min(k-this.pos,
_-N);if(S===k){const y=Mr(f);for(;k<=_-N;N+=k)this.process(y,N);w=!0;continue}h.set(N===0&&S===_?f:f.subarray(N,N+S),this.
pos),this.pos+=S,N+=S,this.pos===k&&(this.process(d,0),this.pos=0,w=!0)}return this.length+=f.length,w&&this.roundClean(),
this}digestInto(f){vn(this),so(f,this),this.finished=!0;const{buffer:d,view:h,blockLen:k,isLE:_}=this;let{pos:w}=this;d[w++]=
128,d.fill(0,w),this.padOffset>k-w&&(this.process(h,0),d.fill(0)),ao(h,k-8,this.length*8,_),this.process(h,0),this.roundClean();
const N=f===d?h:Mr(f),S=this.outputLen,y=S/4,x=this.get();if(S%4||y>x.length)throw new Error("invalid outputLen");for(let I=0;I<
y;I++)N.setUint32(4*I,x[I],_)}digest(){const{buffer:f,outputLen:d}=this;this.digestInto(f);const h=f.slice(0,d);return this.
destroy(),h}_cloneIntoMeta(f){const{buffer:d,length:h,finished:k,destroyed:_,pos:w}=this;return f.destroyed=_,f.finished=
k,f.length=h,f.pos=w,w&&f.buffer.set(d),f}clone(){return this._cloneInto()}}const go=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),ho=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Re=new Uint32Array(64);class bo extends po{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(f,d){super(64,f,8,!1),
this.A=d[0]|0,this.B=d[1]|0,this.C=d[2]|0,this.D=d[3]|0,this.E=d[4]|0,this.F=d[5]|0,this.G=d[6]|0,this.H=d[7]|0}get(){const{
A:f,B:d,C:h,D:k,E:_,F:w,G:N,H:S}=this;return[f,d,h,k,_,w,N,S]}set(f,d,h,k,_,w,N,S){this.A=f|0,this.B=d|0,this.C=h|0,this.
D=k|0,this.E=_|0,this.F=w|0,this.G=N|0,this.H=S|0}_cloneInto(f){return(f||=new this.constructor).set(...this.get()),this.
_cloneIntoMeta(f)}process(f,d){for(let I=0;I<16;I++,d+=4)Re[I]=f.getUint32(d,!1);for(let I=16;I<64;I++){const U=Re[I-15],
F=Re[I-2],B=Ne(U,7)^Ne(U,18)^U>>>3,P=Ne(F,17)^Ne(F,19)^F>>>10;Re[I]=P+Re[I-7]+B+Re[I-16]|0}let{A:h,B:k,C:_,D:w,E:N,F:S,G:y,
H:x}=this;for(let I=0;I<64;I++){const U=Ne(N,6)^Ne(N,11)^Ne(N,25),F=x+U+fo(N,S,y)+ho[I]+Re[I]|0,P=(Ne(h,2)^Ne(h,13)^Ne(h,
22))+mo(h,k,_)|0;x=y,y=S,S=N,N=w+F|0,w=_,_=k,k=h,h=F+P|0}h=h+this.A|0,k=k+this.B|0,_=_+this.C|0,w=w+this.D|0,N=N+this.E|
0,S=S+this.F|0,y=y+this.G|0,x=x+this.H|0,this.set(h,k,_,w,N,S,y,x)}roundClean(){wn(Re)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),wn(this.buffer)}}class _o extends bo{constructor(){super(32,go)}}const vo=lo(()=>new _o,uo(1)),te=Object.
freeze({maximumBytes:16*1024**3,headerBytes:16*1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,
stringBytes:1024**2}),An=Object.freeze(Ui("llama.cpp").map(o=>o.architecture)),Cn="peercompute.gguf.header.v1",wo="3.8.1",
zr=new Map([[0,["F32",1,4]],[1,["F16",1,2]],[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],
[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,
210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],
[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),ur=new Map([[0,"f32"],[1,"f\
16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q\
4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[
23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),
yo=new TextDecoder("utf-8",{fatal:!0}),Eo=o=>Array.from(o,f=>f.toString(16).padStart(2,"0")).join(""),Q=o=>new Error(`Un\
supported GGUF Hub package: ${o}`);function he(o,f,d,h=0){if(!Number.isSafeInteger(o)||o<h||o>f)throw Q(`invalid ${d}`);
return o}class ko extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function So(o,{
size:f}={}){if(!(o instanceof Uint8Array))throw Q("header bytes required");if(he(f,te.maximumBytes,"file size",24),o.length>
te.headerBytes||o.length>f)throw Q("header byte budget exceeded");const d=new DataView(o.buffer,o.byteOffset,o.byteLength);
let h=0;function k(R){if(he(R,te.headerBytes,"header field length"),h+R>te.headerBytes)throw Q("header byte budget excee\
ded");if(h+R>o.length)throw new ko;const K=h;return h+=R,K}const _=()=>d.getUint32(k(4),!0),w=()=>{const R=d.getBigUint64(
k(8),!0);if(R>BigInt(Number.MAX_SAFE_INTEGER))throw Q("unsafe 64-bit value");return Number(R)};function N(R=te.stringBytes,K=!0){
const X=he(w(),R,"string length"),$=k(X);return K?yo.decode(o.subarray($,$+X)):void 0}function S(R,K=!0,X=!1){if(R===8)return N(
te.stringBytes,K);if(R===9){if(X)throw Q("nested metadata arrays");const J=_(),oe=he(w(),te.arrayItems,"array count");if(J===
9||J>12)throw Q("metadata array type");if(J===8)for(let le=0;le<oe;le++)N(te.stringBytes,!1);else k(oe*[1,1,2,2,4,4,4,1,
0,0,8,8,8][J]);return{array:!0,element:J,count:oe}}const $=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!$[R])throw Q("metadata value \
type");const z=k($[R]);if(!K)return;if(R===0)return d.getUint8(z);if(R===1)return d.getInt8(z);if(R===2)return d.getUint16(
z,!0);if(R===3)return d.getInt16(z,!0);if(R===4)return d.getUint32(z,!0);if(R===5)return d.getInt32(z,!0);if(R===6)return d.
getFloat32(z,!0);if(R===7){const J=d.getUint8(z);if(J>1)throw Q("boolean value");return!!J}if(R===12)return d.getFloat64(
z,!0);const l=R===10?d.getBigUint64(z,!0):d.getBigInt64(z,!0);if(l>BigInt(Number.MAX_SAFE_INTEGER)||l<BigInt(Number.MIN_SAFE_INTEGER))
throw Q("unsafe metadata integer");return Number(l)}if(_()!==1179993927)throw Q("magic or byte order");const y=_();if(![
2,3].includes(y))throw Q("version");const x=he(w(),te.tensors,"tensor count",1),I=he(w(),te.metadata,"metadata count",1),
U=new Map;for(let R=0;R<I;R++){const K=N(512);if(!K||U.has(K)||/[\u0000-\u001f\u007f]/u.test(K))throw Q("duplicate or in\
valid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.test(K))throw Q("custom tensor layout requires cata\
log review");const X=_(),$=["general.architecture","general.type","general.file_type","general.alignment","general.name",
"general.quantization_version","split.count","split.no","split.tensors.count","tokenizer.ggml.model","tokenizer.ggml.tok\
ens"].includes(K);U.set(K,S(X,$))}const F=U.get("general.architecture");if(!An.includes(F))throw Q("architecture");if(U.
has("general.type")&&U.get("general.type")!=="model")throw Q("adapter or non-model GGUF");if(/georefine/i.test(U.get("ge\
neral.name")??""))throw Q("custom GeoRefine model requires catalog review");if((U.get("split.count")??1)!==1||(U.get("sp\
lit.no")??0)!==0||(U.get("split.tensors.count")??x)!==x)throw Q("split GGUF requires complete shard admission");if(![void 0,
2].includes(U.get("general.quantization_version")))throw Q("quantization version");const B=U.get("general.file_type");if(!ur.
has(B))throw Q("file quantization type");if(!["llama","gpt2"].includes(U.get("tokenizer.ggml.model"))||U.get("tokenizer.\
ggml.tokens")?.element!==8||!U.get("tokenizer.ggml.tokens")?.count)throw Q("self-contained supported tokenizer required");
const P=he(U.get("general.alignment")??32,4096,"alignment",1);if(P&P-1)throw Q("alignment must be a power of two");const ne=new Set,
W=new Set,ee=[];let de=0;for(let R=0;R<x;R++){const K=N(512);if(!K||ne.has(K)||/georefine|[\u0000-\u001f\u007f]/iu.test(
K))throw Q("duplicate or custom tensor name");ne.add(K);const X=he(_(),4,"tensor dimensions",1);let $=1,z=0;for(let se=0;se<
X;se++){const pe=he(w(),te.maximumBytes,"tensor dimension",1);se===0&&(z=pe),$*=pe,he($,Number.MAX_SAFE_INTEGER,"tensor \
element count",1)}const l=_(),J=zr.get(l);if(!J||z%J[1])throw Q("unsupported tensor codec or quantized row shape");const oe=he(
$/J[1]*J[2],f,"tensor bytes",1),le=w();if(le%P||le+oe>f)throw Q("tensor offset exceeds file or alignment");ee.push({start:le,
end:le+oe}),W.add(l),de=Math.max(de,oe)}if(!ne.has("token_embd.weight")||!ne.has("output_norm.weight"))throw Q("text mod\
el tensor layout");const fe=h,ie=Math.ceil(h/P)*P;ee.sort((R,K)=>R.start-K.start);let be=0;for(const R of ee){if(R.start<
be||ie+R.end>f)throw Q("overlapping or truncated tensor data");be=R.end}return{schema:Cn,version:y,architecture:F,fileType:B,
dtype:ur.get(B),tensorCount:x,metadataCount:I,headerBytes:fe,dataOffset:ie,maximumTensorBytes:de,tensorTypes:[...W].sort(
(R,K)=>R-K),headerSha256:Eo(vo(o.subarray(0,fe)))}}async function xo({readRange:o,size:f,signal:d}={}){if(typeof o!="fun\
ction")throw Q("range reader required");he(f,te.maximumBytes,"file size",24);let h=new Uint8Array(0),k=Math.min(64*1024,
f);for(;;){ge(d);const _=new Uint8Array(k);_.set(h);for(let w=h.length;w<k;){const N=Math.min(te.rangeBytes,k-w),S=await o(
w,N,{signal:d});if(ge(d),!(S instanceof Uint8Array)||S.length!==N)throw Q("truncated range response");_.set(S,w),w+=N}h=
_;try{return So(h,{size:f})}catch(w){if(w.code!=="ERR_GGUF_HEADER_TRUNCATED"||k===f)throw w;if(k===te.headerBytes)throw Q(
"header exceeds bounded probe");k=Math.min(k*2,f,te.headerBytes)}}}function Bo(o){if(!o||o.schema!==Cn||![2,3].includes(
o.version)||!An.includes(o.architecture)||!ur.has(o.fileType)||ur.get(o.fileType)!==o.dtype||!/^[a-f0-9]{64}$/.test(o.headerSha256??
""))throw Q("header profile");for(const[d,h]of[["tensorCount",te.tensors],["metadataCount",te.metadata],["headerBytes",te.
headerBytes],["dataOffset",te.headerBytes+4096],["maximumTensorBytes",te.maximumBytes]])he(o[d],h,d,1);if(o.dataOffset<o.
headerBytes||!Array.isArray(o.tensorTypes)||!o.tensorTypes.length||o.tensorTypes.length>zr.size||o.tensorTypes.some((d,h)=>!zr.
has(d)||h>0&&d<=o.tensorTypes[h-1]))throw Q("tensor profile");const f=["schema","version","architecture","fileType","dty\
pe","tensorCount","metadataCount","headerBytes","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.
keys(o).some(d=>!f.includes(d)))throw Q("unexpected header profile field");return Object.fromEntries(f.map(d=>[d,o[d]]))}
function No({repository:o,revision:f,file:d,header:h}={}){if(typeof o!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.
test(o)||!/^[a-f0-9]{40}$/.test(f??""))throw Q("immutable Hugging Face repository/revision required");if(Ti(d?.path),!d.
path.endsWith(".gguf")||!/^[a-f0-9]{64}$/.test(d.sha256??""))throw Q("pinned GGUF SHA-256 required");he(d.size,te.maximumBytes,
"weight size",24);const k=Bo(h);if(k.dataOffset+k.maximumTensorBytes>d.size)throw Q("header/file size mismatch");const _=d.
size>4*1024**3;return{model:{runtime:"llama.cpp",runtimeVersion:wo,architecture:k.architecture==="qwen35"?"qwen3_5":k.architecture,
format:"GGUF",task:"text-generation",dtype:k.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:o,revision:f,
gguf:{...k,path:d.path,size:d.size,sha256:d.sha256}},weights:[d],totalBytes:d.size,resourcePolicy:{maxModelBytes:te.maximumBytes,
minimumCpuBytes:(_?8:2)*1024**3,minimumGpuBytes:(_?16:2)*1024**3}}}function Tn(o,{files:f,totalBytes:d}={}){if(!o?.gguf)
throw Q("bounded header profile required");const{path:h,size:k,sha256:_,...w}=o.gguf,N=No({repository:o.repository,revision:o.
revision,file:{path:h,size:k,sha256:_},header:w});for(const S of["runtime","runtimeVersion","architecture","format","tas\
k","dtype"])if(o[S]!==N.model[S])throw Q(`model ${S} disagrees with header`);if(JSON.stringify(o.modalities)!=='["text"]'||
JSON.stringify(o.requiredFeatures)!=='["shader-f16"]')throw Q("text-only/f16 capability profile required");if(f){const S=f.
filter(y=>y.path.endsWith(".gguf"));if(S.length!==1||S[0].path!==h||S[0].size!==k||S[0].sha256!==_||f.some(y=>!/^[a-f0-9]{64}$/.
test(y.sha256??"")))throw Q("file closure/digest mismatch");N.weights=S,d=f.reduce((y,x)=>y+x.size,0)}return N.totalBytes=
he(d??k,te.maximumBytes,"package bytes",k),N}async function Go(o,f,d,{signal:h}={}){if(!o.gguf)return;const k=Tn(o,{files:f}).
model.gguf,_=await xo({size:f[0].size,signal:h,readRange:(x,I,U)=>d.read(f[0].path,x,I,U)}),{path:w,size:N,sha256:S,...y}=k;
if(JSON.stringify(_)!==JSON.stringify(y))throw Q("stored header does not match inspected package")}const Je="Tsotchke-Co\
rporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Ke="5ce3fd841676adf2c1a10d7193637d46007e88f7",yn=[{path:".gitattributes",size:1603,
gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e\
21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-Ge\
oRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979\
299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",
size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c\
686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3\
df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_c\
onfig.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"\
15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Fo="This catalog supports verified storage and distribution. Execution is ad\
mitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";
function Un(o){for(const f of Object.values(o))f&&typeof f=="object"&&Un(f);return Object.freeze(o)}const Io=Un({"qwen3.\
8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Je,
revision:Ke,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"\
unavailable",executionReason:Fo},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Je}/blob/${Ke}/LICENSE`,
notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Je,revision:Ke,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Je}/blob/${Ke}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Je,revision:Ke},weightBytes:14199740480,
totalBytes:yn.reduce((o,f)=>o+f.size,0),files:yn}});function Rn(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.
values(o).forEach(Rn),Object.freeze(o)),o}const Ao=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
an GGUF Q5_K_M, experimental text)",repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae\
104ddf9fff92031a73d8",dtype:"q5_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The\
 publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-refu\
sal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Ev\
il-Q5_K_M.gguf",size:6467969824,sha256:"bff5a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README\
.md",size:4013,sha256:"825f21663874cbfa09dbb791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7\
274149e70cfd0dc7940d87",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104d\
df9fff92031a73d8",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a55\
82c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evi\
l-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e4\
39639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{
repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},
{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"0\
1597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689\
a9d2da3897eae104ddf9fff92031a73d8",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwe\
n3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Clau\
de-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{
repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c71\
25009808"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; no\
t a guarantee of refusal-free output or factual accuracy. This is mradermacher's GGUF conversion of the requested DavidA\
U source. The browser adapter currently runs text only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UN\
CENSORED.Q4_K_M.gguf",size:5627045888,sha256:"b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"\
README.md",size:5730,sha256:"eea5e514740c521432aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e\
17cf35bea52a3a2d74e42b14a24a",source:{repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-\
GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"\
0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",
source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd\
7cda7c7125009808",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a55\
82c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"\
c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 \
9B Evil (mradermacher GGUF Q8_0, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99f\
db7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"\
b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",
notice:"The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. \
Safety-refusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qw\
en3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},
{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21\
a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067b\
ceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4\
e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmansl\
ayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,
sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d\
97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"\
LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"\
1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdc\
da83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Q\
wen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-m\
radermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Q\
wen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bo\
wmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,
behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile resp\
onses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context beh\
avior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25\
fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9\
b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwe\
n3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",
size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef428\
5739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed01\
5cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1\
e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"\
b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65\
960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmansl\
ayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,
sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e627395833067\
30adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"\
EVALUATION.md"}}]}],Co=Rn(Object.fromEntries(Ao.map(o=>{const{dtype:f,sourceModel:d,blockCount:h,nextnPredictLayers:k,..._}=o,
N=_.files.find(S=>S.path==="LICENSE").source;return[_.id,{..._,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+N.repository+"/blob/"+N.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:_.repository,revision:_.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+_.repository+"/blob/"+_.revision+"/README.md",sourceModel:{...d,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:h,
nextnPredictLayers:k,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:_.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:f,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:_.repository,revision:_.revision},weightBytes:_.files[0].size,totalBytes:_.
files.reduce((S,y)=>S+y.size,0)}]})));function Vr(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.values(o).
forEach(Vr),Object.freeze(o)),o}const Ae="Tsotchke-Corporation",jn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${Ae}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",architecture:"qwen3_moe",quantizationTypes:["F32","Q8_0","\
Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-Coder-30B-A3B-Instruct-abliterated",revision:"b84c58d52ac4\
4041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimental lossy mixed quantization of an abliterated parent. Beh\
avioral quality, SAE certification and runtime qualification are untested.",files:[{path:".gitattributes",size:1609,gitBlobSha1:"\
3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LICENSE",size:11343,gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea61\
8ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ece140e83416522e0d00b53880e8bb13"},{path:"Qwen3-Coder-30B-A3B-GeoRefi\
ne-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51"},
{path:"README.md",size:2765,gitBlobSha1:"00227290350d0484631d06756736f4dff2e8bd66"},{path:"artifact-manifest.json",size:7659,
gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6e5d05"},{path:"chat_template.jinja",size:6853,gitBlobSha1:"3656cd64ff2fc\
c6ae59312eb87a709e0aa25b2eb"},{path:"config.json",size:1065,gitBlobSha1:"5288c67c42b574d39f790e6bf8836f57ec477483"},{path:"\
generation_config.json",size:235,gitBlobSha1:"f1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"tokenizer_config.json",size:5644,
gitBlobSha1:"b2cbe86ae45a1274c9b93ec060466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,gitBlobSha1:"57027eb4562807\
80650ef6bc44524b396734cbcf"}]},{id:"qwen3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_X\
S GGUF, candidate text)",repository:`${Ae}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
671898b95",architecture:"qwen3_5_moe",quantizationTypes:["F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],sourceModel:{repository:"e\
ricpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-bf16",revision:"f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed"},publisherLimitations:"\
The publisher records a failed coding-quality gate and no complete capability certificate. Its internal qLLM Metal gguf-\
c20 runtime is not a public portable-runtime qualification; a public pinned clean-machine recipe remains unverified. Thi\
s is not the GeoRefine TBE codec.",files:[{path:".gitattributes",size:1699,gitBlobSha1:"f44e4e63e69c8b9a20797fd820049ea2\
7bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,gitBlobSha1:"3cb693fce32249c21d7a621060df41dbf5df64a9"},{path:"LICENSE",
size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:465,gitBlobSha1:"4852a35fe237eb43\
35504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,sha256:"027f3c99a065\
fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96"},{path:"README.md",size:4914,gitBlobSha1:"601a361b4a8308e912174981\
0fb103b644c581c1"},{path:"artifact-manifest.json",size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a008315f8a1a9f"},{path:"\
config.json",size:3148,gitBlobSha1:"09981f690fa954e74c4ae3d66163bb68435d14ca"},{path:"generation_config.json",size:243,gitBlobSha1:"\
be05abc6b17ea7880b71c67d31f7264f92c34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"1838f3b7f5e64b0f32abbd9\
8181ea3ca8b3abfbc"},{path:"tokenizer.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19f\
f992d9ac7"},{path:"tokenizer_config.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec"},{path:"veri\
fy_c20.py",size:886,gitBlobSha1:"2ba7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-georefine-l162-gguf",name:"\
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${Ae}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
4268ff007ddb5e8813a391fbdd3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32","Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{
repository:"huihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f6c238ce1e5b70008612ae42cdd"},publisherLimitations:"\
Experimental lossy mixed quantization; behavioral quality and runtime qualification are untested. Q4_K_M_CUSTOM labels a\
 custom allocation of standard GGUF tensor types, not a custom codec or the standard llama.cpp Q4_K_M allocation recipe.\
 The inherited Q8_0 header label does not describe the tensor mix.",files:[{path:".gitattributes",size:1694,gitBlobSha1:"\
f41c1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},{path:"Qwen3.8-27B-GeoRefine-L162-\
abl-MIXED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd"},
{path:"README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},{path:"artifact-manifest.json",size:5897,
gitBlobSha1:"fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d7\
0d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"\
generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}]}],To=Vr(Object.fromEntries(jn.map(o=>{const{architecture:f,quantizationTypes:d,sourceModel:h,
publisherLimitations:k,..._}=o;return[o.id,{..._,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${o.repository}\
/blob/${o.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:o.repository,revision:o.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${o.repository}/blob/${o.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:h,
publisherLimitations:k,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:f,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:d,modalities:["text"],requiredFeatures:["shader-f16"],repository:o.repository,
revision:o.revision},weightBytes:o.files.filter(w=>w.path.endsWith(".gguf")).reduce((w,N)=>w+N.size,0),totalBytes:o.files.
reduce((w,N)=>w+N.size,0)}]})));Vr({organization:Ae,sourceUrl:`https://huggingface.co/${Ae}`,checkedAt:"2026-11-04",repositories:[
...jn.map(({id:o,repository:f,revision:d})=>({repository:f,revision:d,catalogId:o,format:"GGUF",codecRequired:!1})),{repository:`${Ae}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Ae}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Ae}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${Ae}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Xe="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ye="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",qr=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],Qr=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function On(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.
values(o).forEach(On),Object.freeze(o)),o}const Uo=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
en3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71\
149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"a5\
ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f21f\
a8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"\
mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",path:"README.md"}},{path:"LICE\
NSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848\
ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"c1899de289a04d12100db370d81485cdf75e47ca",path:"\
LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.8B Abliterated (GGUF Q4_K_M, text)",repository:"\
xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",architecture:"qwen3_5",files:[
{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"eef9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5e\
f067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"\
15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef0731\
75dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d\
87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.\
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:o,...f})=>[f.id,On({...f,
status:"execution-candidate",format:"GGUF",capabilities:Qr,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${f.files[2].source.repository}/blob/${f.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:f.repository,revision:f.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${f.repository}/blob/${f.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:o,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:f.repository,revision:f.
revision},weightBytes:f.files[0].size,totalBytes:f.files.reduce((d,h)=>d+h.size,0)})])),En=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Xe,revision:Ye,status:"ex\
ecution-candidate",format:"GGUF",capabilities:Qr,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Xe}/blob\
/${Ye}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Xe,
revision:Ye,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Xe}/blob/${Ye}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Xe,revision:Ye},weightBytes:qr[0].size,totalBytes:qr.reduce((o,f)=>o+f.size,0),files:qr},
...Uo,...Co,...To,...Object.fromEntries(Object.entries(Io).map(([o,f])=>[o,{...f,status:"execution-candidate",capabilities:Qr}]))}),
Dn="3.8.1",kn=2048,De=1024**3;function Mn(o){const f=ji(o),d=f.model,h=Object.values(En).filter(y=>y.model.runtime==="ll\
ama.cpp"&&y.repository===d?.repository&&y.revision===d?.revision&&y.model.architecture===d?.architecture&&y.model.task===
d?.task&&y.model.dtype===d?.dtype),k=h.length===1?h[0]:void 0;if(!k&&d?.gguf){const y=Tn(d,{files:f.files});for(const x of Object.
values(En))if(!(x.repository!==d.repository||x.revision!==d.revision))for(const I of x.files.filter(U=>U.path.endsWith("\
.gguf"))){const U=y.weights.find(F=>F.path===I.path);if(U&&(U.size!==I.size||U.sha256!==I.sha256))throw new Error("GGUF \
weights do not match the pinned catalog digests")}return{...y,manifest:f}}if(!k||d.runtime!=="llama.cpp"||d.runtimeVersion!==
void 0&&d.runtimeVersion!==Dn||k.model.runtimeVersion!==void 0&&d.runtimeVersion!==k.model.runtimeVersion||d.dtype!==k.model.
dtype||d.format!=="GGUF"||d.task!=="text-generation")throw new Error("GGUF model revision is not in the trusted runtime \
catalog");const _=f.files.filter(y=>y.path.endsWith(".gguf")),w=k.files.filter(y=>y.path.endsWith(".gguf"));if(!_.length||
_.length!==w.length||_.some(y=>!w.some(x=>x.path===y.path&&x.size===y.size&&x.sha256===y.sha256)))throw new Error("GGUF \
weights do not match the pinned catalog digests");const N=f.files.reduce((y,x)=>y+x.size,0);if(!Number.isSafeInteger(N)||
N>16*De)throw new Error("GGUF package exceeds its byte budget");const S=_.reduce((y,x)=>y+x.size,0)>4*De;return{manifest:f,
weights:_,totalBytes:N,resourcePolicy:{maxModelBytes:16*De,minimumCpuBytes:S?8*De:2*De,minimumGpuBytes:S?16*De:2*De}}}function qn(o,f=globalThis.
location?.href){const d=new URL(f);if(!o||Object.keys(o).some(k=>k!=="wasm")||typeof o.wasm!="string")throw new Error("G\
GUF runtime needs one trusted WASM asset");const h=new URL(o.wasm,d);if(h.origin!==d.origin||!["http:","https:"].includes(
h.protocol)||h.username||h.password||h.search||h.hash||!h.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM \
must be a fixed same-origin asset");return{wasm:h.href}}function Ln(o={}){if(!o||typeof o!="object"||Array.isArray(o)||Object.
keys(o).some(d=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(d)))throw new Error("Unknown GGUF runtime optio\
n");const f={n_ctx:kn,n_batch:64,n_gpu_layers:99999,n_threads:1,...o};if(!Number.isInteger(f.n_ctx)||f.n_ctx<64||f.n_ctx>
kn||!Number.isInteger(f.n_batch)||f.n_batch<1||f.n_batch>128||!Number.isInteger(f.n_gpu_layers)||f.n_gpu_layers<1||f.n_gpu_layers>
99999||f.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(f)}async function Ro({
scope:o=globalThis,gpu:f=o.navigator?.gpu}={}){if(!o.crossOriginIsolated||!o.SharedArrayBuffer)throw new Error("GGUF req\
uires cross-origin isolation and SharedArrayBuffer");const d=o.WebAssembly;if(typeof d?.Suspending!="function"||typeof d?.
promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{new d.Memory({initial:0n,maximum:1n,shared:!0,
address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly memory64")}const h=await f?.requestAdapter({powerPreference:"\
high-performance"});if(!h||h.isFallbackAdapter||h.info?.isFallbackAdapter)throw new Error("GGUF requires a hardware WebG\
PU adapter");if(!h.features.has("shader-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabl\
ed");return{adapter:{vendor:h.info?.vendor??"",architecture:h.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const jo=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:Mn,validateRuntimeAssets:qn,validateRuntimeOptions:Ln,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:o,maxNewTokens:f}){if(o)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(f)||f<1||f>Lr.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),Sn=o=>new TextEncoder().
encode(o).byteLength;function Oo(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"GGUF inference requires a ComputeManager-owned worker")}function xn(o){return{sessionId:o.sessionId,manifestCid:o.manifestCid,
status:o.lost?"lost":o.status,runtime:"llama.cpp",runtimeVersion:Dn,task:"text-generation",workerId:o.workerId,adapter:o.
capabilities?.adapter,runtimeAdapter:o.engine?.evidence.runtimeAdapter??null,runtimeFeatures:o.engine?.evidence.runtimeFeatures??
[],gpuDispatches:o.engine?.evidence.dispatches??0,gpuSubmissions:o.engine?.evidence.submissions??0,gpuOffload:o.engine?.
evidence.offload??null,runtimeOptions:o.options,nativeBuffers:o.engine?.evidence.buffers??[],wasmMemoryBytes:o.engine?.memoryBytes()??
0,generatedRequests:o.generatedRequests,artifactReads:o.reader?.getStats()??null}}function Do({loadEngine:o=ro,createReader:f=Ai,
checkCapabilities:d=Ro,assertWorker:h=Oo,baseUrl:k=globalThis.location?.href}={}){let _;async function w(S,y){if(_)throw new Error(
"GGUF worker already has a resident model");const x=Mn(S.manifest),I=qn(S.runtimeAssets,k),U=Ln(S.runtimeOptions),F=lr(S.
sessionId);ge(y.signal);const B={sessionId:F,manifestCid:S.manifestCid,workerId:y.workerId??null,manifest:x.manifest,status:"\
loading",options:U,generatedRequests:0,residency:new AbortController,lost:!1};_=B;try{if(B.capabilities=await d(),ge(y.signal),
B.reader=f(S.artifactPort,{manifest:x.manifest,signal:B.residency.signal,maxReadBytes:Fn,maxReads:1}),await Go(x.manifest.
model,x.weights,B.reader,{signal:y.signal}),ge(y.signal),B.engine=await o({wasmUrl:I.wasm,weights:x.weights,reader:B.reader,
signal:y.signal,collectGpuEvidence:S.collectGpuEvidence===!0,onProgress:W=>y.emitProgress?.({...W,sessionId:F}),onLost(){
B.lost=!0,B.active?.abort("GPU device lost")}}),ge(y.signal),!(await B.engine.action("load",{_name:"load_req",model_paths:B.
engine.files.map(W=>`models/${W.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...U,n_ubatch:Math.min(64,U.n_batch),n_parallel:1,
kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},y.signal)).success)throw new Error(
"GGUF native model load failed");const ne=B.engine.evidence.offload;if(!ne||ne.gpuLayers<1||ne.gpuLayers!==Math.min(U.n_gpu_layers,
ne.totalLayers))throw new Error("GGUF did not honor the explicitly configured GPU layer offload");if(ge(y.signal),B.lost)
throw new Error("GPU device lost during GGUF load");return B.status="ready",xn(B)}catch(P){throw B.engine&&y.emitProgress?.(
{type:"model-load-memory",sessionId:F,wasmMemoryBytes:B.engine.memoryBytes(),nativeBuffers:B.engine.evidence.buffers??[]}),
B.lost=!0,B.status="lost",B.residency.abort(P),B.reader?.close(P),B.engine?.close(),P}}async function N(S,y){const x=_;if(!x||
x.sessionId!==lr(S.sessionId)||x.lost)throw new Error("Model session lost or not loaded");if(x.status!=="ready")throw new Error(
"GGUF model session is busy");const I=lr(S.requestId),U=S.maxNewTokens??Lr.maxNewTokens;jo.validateGenerationInput({...S,
maxNewTokens:U});const F=Ci(S),B=new AbortController,P=()=>B.abort(y.signal?.reason);y.signal?.addEventListener("abort",
P,{once:!0}),y.signal?.aborted&&P(),x.active=B,x.status="generating",x.requestId=I;const ne=x.engine.evidence.dispatches,
W=x.engine.evidence.submissions;let ee,de=!1,fe="",ie=0,be=null,R=null,K="unknown";try{const X=await x.engine.action("co\
mpletion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:F,stream:!0,max_tokens:U,temperature:0,cache_prompt:!1,
chat_template_kwargs:{enable_thinking:!1}}),files:[]},B.signal);if(!X.success||!Number.isInteger(X.req_id))throw new Error(
"GGUF failed to start generation");ee=X.req_id,ge(B.signal);for(let $=0;$<4096;$+=1){ge(B.signal);const z=await x.engine.
action("get_result",{_name:"gres_req",req_id:ee},B.signal);if(ge(B.signal),!z.success||z.is_error)throw new Error("GGUF \
generation failed or exceeded the context budget; shorten the conversation or request fewer output tokens");if(z.data_json&&
z.data_json!=="null"){if(Sn(z.data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");const l=JSON.parse(
z.data_json);for(const J of Array.isArray(l)?l:[l]){const oe=J.choices?.[0]?.finish_reason??J.finish_reason;oe!=null&&(K=
["stop","length"].includes(oe)?oe:"unknown");const le=J.choices?.[0]?.delta?.content??J.content??"";if(typeof le!="strin\
g")throw new Error("Invalid GGUF text chunk");if(fe+=le,Sn(fe)>Lr.maxOutputBytes)throw new Error("GGUF output exceeds it\
s byte budget");if(le&&y.emitProgress?.({type:"token",sessionId:x.sessionId,requestId:I,sequence:ie++,text:le})===!1)throw new Error(
"Token consumer rejected output");be=J.usage?.prompt_tokens??J.timings?.prompt_n??be,R=J.usage?.completion_tokens??J.timings?.
predicted_n??R}}if(!z.has_more){de=!0;break}await new Promise(l=>setTimeout(l,0))}if(!de)throw new Error("GGUF result po\
lling exceeded its request budget");if(await x.engine.settleGpu(),ge(B.signal),x.lost)throw new Error("GPU device lost; \
model session is unavailable");if(R!==null&&(!Number.isSafeInteger(R)||R>U))throw new Error("GGUF returned an over-budge\
t token sequence");return x.generatedRequests+=1,{sessionId:x.sessionId,requestId:I,text:fe,inputTokens:be,outputTokens:R,
finishReason:K,contextTruncated:!1,workerId:x.workerId,gpuDispatches:x.engine.evidence.dispatches-ne,gpuSubmissions:x.engine.
evidence.submissions-W,gpuOffload:x.engine.evidence.offload,artifactReads:x.reader.getStats()}}catch(X){throw X?.name===
"RuntimeError"?(x.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(X.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.
test(X.message??"")&&(x.lost=!0),X)}finally{y.signal?.removeEventListener("abort",P);try{!de&&ee!==void 0&&!x.lost&&await x.
engine.action("cancel",{_name:"cncl_req",req_id:ee})}catch(X){throw x.lost=!0,new Error(`Model session lost during GGUF \
cancellation: ${X.message}`)}finally{x.active=null,x.requestId=null,x.status=x.lost?"lost":"ready"}}}return async(S={},y={})=>{
if(h(),S.command==="load")return w(S,y);if(S.command==="generate")return N(S,y);const x=lr(S.sessionId);if(S.command==="\
status")return _?.sessionId===x?xn(_):{sessionId:x,status:"absent"};if(!_||_.sessionId!==x)throw new Error("Model sessio\
n lost or not loaded");if(S.command==="cancel")return _.requestId===S.requestId&&_.active?.abort(Ri()),{sessionId:x,cancellationRequested:!0};
if(S.command==="unload"){if(_.status==="generating")throw new Error("Cancel and await GGUF generation before unloading");
return _.residency.abort("GGUF unload"),_.reader?.close(),_.engine?.close(),_=null,{sessionId:x,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const Mo=Do(),Wo=(o,f)=>Mo(o,f);export{Do as createGgufTaskRuntime,Wo as handleModelTask};

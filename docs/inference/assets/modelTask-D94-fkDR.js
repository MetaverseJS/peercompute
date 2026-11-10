import{c as Ti}from"./GgufArtifactReader-CxlX0lvx.js";import{normalizeModelMessages as Ci}from"./modelTask-DEfT5DYY.js";
import{t as ue,v as Ui,l as Ri,M as fr,a as ur,b as Oi}from"./ArtifactReadBridge-mLMxyVL0.js";import{n as ji}from"./ArtifactManifest-Bn7pK_eB.js";
function Di(o,u){const d=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var p=!!globalThis.
window,E=!!globalThis.WorkerGlobalScope,b=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",w=E&&
self.name?.startsWith("em-pthread");if(b){var N=require("worker_threads");global.Worker=N.Worker,E=!N.isMainThread,w=E&&
N.workerData=="em-pthread"}var x="./this.program",y=(e,r)=>{throw r},k=globalThis.document?.currentScript?.src;typeof __filename<
"u"?k=__filename:E&&(k=self.location.href);var G="";function C(e){return o.locateFile?o.locateFile(e,G):G+e}var I,B;if(b){
var W=require("fs");G=__dirname+"/",B=e=>{e=$(e)?new URL(e):e;var r=W.readFileSync(e);return r},I=async(e,r=!0)=>{e=$(e)?
new URL(e):e;var t=W.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(x=process.argv[1].replace(/\\/g,"\
/")),process.argv.slice(2),typeof module<"u"&&(module.exports=o),y=(e,r)=>{throw process.exitCode=e,r}}else if(p||E){try{
G=new URL(".",k).href}catch{}b||(E&&(B=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),I=async e=>{if($(e))return new Promise((t,n)=>{var i=new XMLHttpRequest;i.open(
"GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}n(
i.status)},i.onerror=n,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(
r.status+" : "+r.url)})}var oe=console.log.bind(console),V=console.error.bind(console);if(b){var se=require("util"),he=e=>typeof e==
"object"?se.inspect(e):e;oe=(...e)=>W.writeSync(1,e.map(he).join(" ")+`
`),V=(...e)=>W.writeSync(2,e.map(he).join(" ")+`
`)}var re=oe,Z=V,pe,R,J=!1,ae;function z(e,r){e||ve(r)}var $=e=>e.startsWith("file://");function l(){Se.buffer!=ne.buffer&&
rr()}if(b&&w){var K=N.parentPort;K.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,postMessage:e=>K.
postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.exit(1)})}var fe;
if(w){var de=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.cmd;if(n==="lo\
ad"){let i=[];self.onmessage=s=>i.push(s),fe=()=>{postMessage({cmd:"loaded"});for(let s of i)e(s);self.onmessage=e};for(const s of t.
handlers)(!o[s]||o[s].proxy)&&(o[s]=(...c)=>{postMessage({cmd:"callHandler",handler:s,args:c})},s=="print"&&(re=o[s]),s==
"printErr"&&(Z=o[s]));Se=t.wasmMemory,rr(),R=t.wasmModule,Yr(),lr()}else if(n==="run"){Yn(t.pthread_ptr),qr(t.pthread_ptr,
0,0,1,0,0),P.threadInitTLS(),Ir(t.pthread_ptr),de||(de=!0);try{await ft(t.start_routine,t.arg)}catch(i){if(i!="unwind")throw i}}else
t.target==="setimmediate"||(n==="checkMailbox"?de&&ir():n&&(Z(`worker: received unknown command ${n}`),Z(t)))}catch(i){throw cn(),
i}}self.onmessage=e}var ne,ee,_e,O,j,Me,Te,ce,A,Jr=!1;function rr(){var e=Se.buffer;ne=new Int8Array(e),_e=new Int16Array(
e),o.HEAPU8=ee=new Uint8Array(e),O=new Int32Array(e),j=new Uint32Array(e),Me=new Float32Array(e),Te=new Float64Array(e),
ce=new BigInt64Array(e),A=new BigUint64Array(e)}function Qn(){if(!w){if(o.wasmMemory)Se=o.wasmMemory;else{var e=o.INITIAL_MEMORY||
134217728;Se=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i64"})}rr()}}function Wn(){
if(o.preRun)for(typeof o.preRun=="function"&&(o.preRun=[o.preRun]);o.preRun.length;)at(o.preRun.shift());tt(nt)}function Kr(){
if(Jr=!0,w)return fe();!o.noFSInit&&!a.initialized&&a.init(),Fe.__wasm_call_ctors(),a.ignorePermissions=!1}function Vn(){
if(!w){if(o.postRun)for(typeof o.postRun=="function"&&(o.postRun=[o.postRun]);o.postRun.length;)Xn(o.postRun.shift());tt(
lt)}}function ve(e){o.onAbort?.(e),e="Aborted("+e+")",Z(e),J=!0,e+=". Build with -sASSERTIONS for more info.",Jr&&mn();var r=new WebAssembly.
RuntimeError(e);throw r}var gr;function Hn(){return C("wllama.wasm")}function $n(e){if(e==gr&&pe)return new Uint8Array(pe);
if(B)return B(e);throw"both async and sync fetching of the wasm failed"}async function Pn(e){if(!pe)try{var r=await I(e);
return new Uint8Array(r)}catch{}return $n(e)}async function Jn(e,r){try{var t=await Pn(e),n=await WebAssembly.instantiate(
t,r);return n}catch(i){Z(`failed to asynchronously prepare wasm: ${i}`),ve(i)}}async function Kn(e,r,t){if(!e&&!$(r)&&!b)
try{var n=fetch(r,{credentials:"same-origin"}),i=await WebAssembly.instantiateStreaming(n,t);return i}catch(s){Z(`wasm s\
treaming compile failed: ${s}`),Z("falling back to ArrayBuffer instantiation")}return Jn(r,t)}function Xr(){Ii(),We.__instrumented||
(We.__instrumented=!0,we.instrumentWasmImports(We));var e={env:We,wasi_snapshot_preview1:We};return e}async function Yr(){
function e(c,f){return Fe=c.exports,Fe=we.instrumentWasmExports(Fe),Fe=Fi(Fe),Zn(Fe._emscripten_tls_init),Ni(Fe),R=f,tr(),
Fe}nr();function r(c){return e(c.instance,c.module)}var t=Xr();if(o.instantiateWasm)return new Promise((c,f)=>{o.instantiateWasm(
t,(h,S)=>{c(e(h,S))})});if(w){var n=new WebAssembly.Instance(R,Xr());return e(n,R)}gr??=Hn();var i=await Kn(pe,gr,t),s=r(
i);return s}class Zr{name="ExitStatus";constructor(r){this.message=`Program terminated with exit(${r})`,this.status=r}}var et=e=>{
e.terminate(),e.onmessage=r=>{}},rt=e=>{var r=P.pthreads[e];P.returnWorkerToPool(r)},tt=e=>{for(;e.length>0;)e.shift()(o)},
nt=[],at=e=>nt.push(e),Oe=0,Ve=null,tr=e=>{if(Oe--,o.monitorRunDependencies?.(Oe),Oe==0&&Ve){var r=Ve;Ve=null,r()}},nr=e=>{
Oe++,o.monitorRunDependencies?.(Oe)},it=e=>{var r=P.getNewWorker();if(!r)return 6;P.runningWorkers.push(r),P.pthreads[e.
pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,pthread_ptr:e.pthread_ptr};
return b&&r.unref(),r.postMessage(t,e.transferList),0},ar=0,hr=()=>wr||ar>0,Ee=()=>bn(),ke=e=>gn(e),br=e=>hn(e),me=(e,r,t,...n)=>{
for(var i=n.length*2,s=Ee(),c=br(i*8),f=c/8,h=0;h<n.length;h++){var S=n[h];typeof S=="bigint"?((l(),ce)[f+2*h]=1n,(l(),ce)[f+
2*h+1]=S):((l(),ce)[f+2*h]=0n,(l(),Te)[f+2*h+1]=S)}var v=ln(e,r,i,c,t);return ke(s),v};function ot(e){if(w)return me(0,0,
1,e);ae=e,hr()||(P.terminateAllThreads(),o.onExit?.(e),J=!0),y(e,new Zr(e))}function st(e){if(w)return me(1,0,0,e);_r(e)}
var ct=(e,r)=>{if(ae=e,w)throw st(e),"unwind";ot(e)},_r=ct,P={unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},
init(){w||P.initMainThread()},initMainThread(){for(var e=o.pthreadPoolSize;e--;)P.allocateUnusedWorker();at(async()=>{var r=P.
loadWasmModuleToAllWorkers();nr(),await r,tr()})},terminateAllThreads:()=>{for(var e of P.runningWorkers)et(e);for(var e of P.
unusedWorkers)et(e);P.unusedWorkers=[],P.runningWorkers=[],P.pthreads={}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete P.
pthreads[r],P.unusedWorkers.push(e),P.runningWorkers.splice(P.runningWorkers.indexOf(e),1),e.pthread_ptr=0,un(r)},threadInitTLS(){
P.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var c=s.data,f=c.cmd;if(c.
targetThread&&c.targetThread!=cr()){var h=P.pthreads[c.targetThread];h?h.postMessage(c,c.transferList):Z(`Internal error\
! Worker sent a message "${f}" to target pthread ${c.targetThread}, but that thread no longer exists!`);return}f==="chec\
kMailbox"?ir():f==="spawnThread"?it(c):f==="cleanupThread"?Ge(()=>rt(c.thread)):f==="loaded"?(e.loaded=!0,b&&!e.pthread_ptr&&
e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):f==="uncaughtException"?e.onerror(c.error):f==="callHandler"?
o[c.handler](...c.args):f&&Z(`worker sent an unknown command ${f}`)},e.onerror=s=>{var c="worker sent an error!";throw Z(
`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},b&&(e.on("message",s=>e.onmessage({data:s})),e.on("error",s=>e.onerror(
s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var i of n)o.propertyIsEnumerable(i)&&t.push(i);e.postMessage(
{cmd:"load",handlers:t,wasmMemory:Se,wasmModule:R})}),async loadWasmModuleToAllWorkers(){return w?void 0:Promise.all(P.unusedWorkers.
map(P.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=k;o.mainScriptUrlOrBlob&&(r=o.mainScriptUrlOrBlob,typeof r!=
"string"&&(r=URL.createObjectURL(r))),e=new d(r,{workerData:"em-pthread",name:"em-pthread"}),P.unusedWorkers.push(e)},getNewWorker(){
return P.unusedWorkers.length==0&&(P.allocateUnusedWorker(),P.loadWasmModuleToWorker(P.unusedWorkers[0])),P.unusedWorkers.
pop()}},lt=[],Xn=e=>lt.push(e);function Yn(e){var r=Number((l(),A)[(e+88)/8]),t=Number((l(),A)[(e+96)/8]),n=r-t;pn(r,n),
ke(r)}var vr=[],ut=e=>{e=Number(e);var r=vr[e];return r||(vr[e]=r=_n.get(BigInt(e)),we.isAsyncExport(r)&&(vr[e]=r=we.makeAsyncFunction(
r))),r},ft=async(e,r)=>{ar=0,wr=0;var t=(i=>WebAssembly.promising(ut(e)).call(null,BigInt(i)))(r);function n(i){if(hr()){
ae=i;return}Lr(i)}t=await t,n(t)};ft.isAsync=!0;var wr=!0,Zn=e=>P.tlsInitFunctions.push(e),Se;function dt(e,r,t,n){return w?
me(2,0,1,e,r,t,n):mt(e,r,t,n)}var ea=()=>!!globalThis.SharedArrayBuffer,ra=9007199254740992,ta=-9007199254740992,_=e=>e<
ta||e>ra?NaN:Number(e);function mt(e,r,t,n){if(e=_(e),r=_(r),t=_(t),n=_(n),!ea())return 6;var i=[],s=0;if(w&&(i.length===
0||s))return dt(e,r,t,n);var c={startRoutine:t,pthread_ptr:e,arg:n,transferList:i};return w?(c.cmd="spawnThread",postMessage(
c,i),0):it(c)}var qe=()=>{var e=Number((l(),A)[Y.varargs/8]);return Y.varargs+=8,e},yr=()=>{var e=(l(),O)[+Y.varargs/4];
return Y.varargs+=4,e},X={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var i=e[n];i==="."?e.splice(n,1):i===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=X.isAbs(e),
t=e.slice(-1)==="/";return e=X.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=X.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>X.normalize(e.join("/")),join2:(e,r)=>X.normalize(e+"/"+r)},na=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),Er=e=>{(Er=na())(e)},Le={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var i=n>=0?e[n]:a.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!i)return"";r=i+"/"+r,t=X.isAbs(i)}return r=X.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=Le.resolve(e).slice(1),r=Le.resolve(r).slice(1);function t(S){for(var v=0;v<S.length&&S[v]==="";v++)
;for(var T=S.length-1;T>=0&&S[T]==="";T--);return v>T?[]:S.slice(v,T-v+1)}for(var n=t(e.split("/")),i=t(r.split("/")),s=Math.
min(n.length,i.length),c=s,f=0;f<s;f++)if(n[f]!==i[f]){c=f;break}for(var h=[],f=c;f<n.length;f++)h.push("..");return h=h.
concat(i.slice(c)),h.join("/")}},pt=globalThis.TextDecoder&&new TextDecoder,aa=(e,r,t,n)=>{for(var i=r+t;e[r]&&!(r>=i);)
++r;return r},ze=(e,r=0,t,n)=>{var i=aa(e,r,t);if(i-r>16&&e.buffer&&pt)return pt.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,i):e.slice(r,i));for(var s="";r<i;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}var f=e[r++]&
63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|f);continue}var h=e[r++]&63;if((c&240)==224?c=(c&15)<<12|f<<6|h:c=(c&
7)<<18|f<<12|h<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var S=c-65536;s+=String.fromCharCode(55296|S>>10,56320|
S&1023)}}return s},kr=[],xe=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},gt=(e,r,t,n)=>{if(!(n>0))return 0;for(var i=t,s=t+n-1,c=0;c<e.length;++c){var f=e.codePointAt(
c);if(f<=127){if(t>=s)break;r[t++]=f}else if(f<=2047){if(t+1>=s)break;r[t++]=192|f>>6,r[t++]=128|f&63}else if(f<=65535){
if(t+2>=s)break;r[t++]=224|f>>12,r[t++]=128|f>>6&63,r[t++]=128|f&63}else{if(t+3>=s)break;r[t++]=240|f>>18,r[t++]=128|f>>
12&63,r[t++]=128|f>>6&63,r[t++]=128|f&63,c++}}return r[t]=0,t-i},Sr=(e,r,t)=>{var n=xe(e)+1,i=new Array(n),s=gt(e,i,0,i.
length);return i.length=s,i},ia=()=>{if(!kr.length){var e=null;if(b){var r=256,t=Buffer.alloc(r),n=0,i=process.stdin.fd;
try{n=W.readSync(i,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;kr=Sr(e)}return kr.shift()},je={ttys:[],init(){},shutdown(){},register(e,r){je.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,je.stream_ops)},stream_ops:{open(e){var r=je.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,i){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,c=0;c<n;c++){var f;try{f=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(f===void 0&&s===0)throw new a.ErrnoError(6);if(f==null)break;s++,r[t+c]=f}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,i){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return ia()},put_char(e,r){r===null||r===10?(re(ze(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(re(ze(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(Z(ze(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(Z(ze(e.output)),e.output=[])}}},oa=(e,r)=>(l(),ee).fill(0,e,e+r),ht=(e,r)=>Math.ceil(e/r)*r,xr=e=>{
e=ht(e,65536);var r=sn(65536,e);return r&&oa(r,e),r},D={ops_table:null,mount(e){return D.createNode(null,"/",16895,0)},createNode(e,r,t,n){
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
min(e.node.usedBytes-i,n);if(c>8&&s.subarray)r.set(s.subarray(i,i+c),t);else for(var f=0;f<c;f++)r[t+f]=s[i+f];return c},
write(e,r,t,n,i,s){if(r.buffer===(l(),ne).buffer&&(s=!1),!n)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&
(!c.contents||c.contents.subarray)){if(s)return c.contents=r.subarray(t,t+n),c.usedBytes=n,n;if(c.usedBytes===0&&i===0)return c.
contents=r.slice(t,t+n),c.usedBytes=n,n;if(i+n<=c.usedBytes)return c.contents.set(r.subarray(t,t+n),i),n}if(D.expandFileStorage(
c,i+n),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+n),i);else for(var f=0;f<n;f++)c.contents[i+f]=r[t+
f];return c.usedBytes=Math.max(c.usedBytes,i+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,i){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,c,f=e.node.contents;if(!(i&2)&&f&&f.buffer===(l(),ne).buffer)c=!1,s=f.byteOffset;else{if(c=!0,s=xr(r),!s)throw new a.
ErrnoError(48);f&&((t>0||t+r<f.length)&&(f.subarray?f=f.subarray(t,t+r):f=Array.prototype.slice.call(f,t,t+r)),(l(),ne).
set(f,s))}return{ptr:s,allocated:c}},msync(e,r,t,n,i){return D.stream_ops.write(e,r,0,n,t,!1),0}}},sa=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},Br=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},ca=async e=>{var r=await I(e);return new Uint8Array(r)},bt=(...e)=>a.createDataFile(
...e),_t=[],la=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of _t)if(t.canHandle(r))return t.handle(e,r);return e},
Gr=async(e,r,t,n,i,s,c,f)=>{var h=r?Le.resolve(X.join2(e,r)):e;nr();try{var S=t;typeof t=="string"&&(S=await ca(t)),S=await la(
S,h),f?.(),s||bt(e,r,S,n,i,c)}finally{tr()}},ua=(e,r,t,n,i,s,c,f,h,S)=>{Gr(e,r,t,n,i,f,h,S).then(s).catch(c)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,X.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(S=>!!S),i=a.root,s="/",c=0;c<n.length;c++){var f=c===n.length-1;if(f&&r.parent)break;if(n[c]!=="."){if(n[c]===
".."){if(s=X.dirname(s),a.isRoot(i)){e=s+"/"+n.slice(c+1).join("/"),t--;continue e}else i=i.parent;continue}s=X.join2(s,
n[c]);try{i=a.lookupNode(i,n[c])}catch(S){if(S?.errno===44&&f&&r.noent_okay)return{path:s};throw S}if(a.isMountpoint(i)&&
(!f||r.follow_mount)&&(i=i.mounted.root),a.isLink(i.mode)&&(!f||r.follow)){if(!i.node_ops.readlink)throw new a.ErrnoError(
52);var h=i.node_ops.readlink(i);X.isAbs(h)||(h=X.dirname(s)+"/"+h),e=h+"/"+n.slice(c+1).join("/");continue e}}}return{path:s,
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
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&Z(`warning: ${a.syncFSRequests} FS.syncfs operat\
ions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function i(f){return a.syncFSRequests--,
r(f)}function s(f){if(f)return s.errored?void 0:(s.errored=!0,i(f));++n>=t.length&&i(null)}for(var c of t)c.type.syncfs?
c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var n=t==="/",i=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!i){var c=a.
lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(s.mode))throw new a.
ErrnoError(54)}var f={type:e,opts:r,mountpoint:t,mounts:[]},h=e.mount(f);return h.mount=f,f.root=h,n?a.root=h:s&&(s.mounted=
f,s.mount&&s.mount.mounts.push(f)),h},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,i=a.getMounts(n);for(var[s,c]of Object.entries(a.nameTable))for(;c;){var f=c.name_next;
i.includes(c.mount)&&a.destroyNode(c),c=f}t.mounted=null;var h=t.mount.mounts.indexOf(n);t.mount.mounts.splice(h,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),i=n.node,s=X.basename(e);if(!s)throw new a.
ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var c=a.mayCreate(i,s);if(c)throw new a.ErrnoError(c);if(!i.
node_ops.mknod)throw new a.ErrnoError(63);return i.node_ops.mknod(i,s,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var i of t)if(i){(n||X.isAbs(e))&&(n+=
"/"),n+=i;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!Le.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var i=X.basename(r),s=a.mayCreate(n,i);if(s)throw new a.ErrnoError(s);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,i,e)},rename(e,r){var t=X.dirname(e),n=X.dirname(r),i=X.basename(e),s=X.basename(
r),c,f,h;if(c=a.lookupPath(e,{parent:!0}),f=c.node,c=a.lookupPath(r,{parent:!0}),h=c.node,!f||!h)throw new a.ErrnoError(
44);if(f.mount!==h.mount)throw new a.ErrnoError(75);var S=a.lookupNode(f,i),v=Le.relative(e,n);if(v.charAt(0)!==".")throw new a.
ErrnoError(28);if(v=Le.relative(r,t),v.charAt(0)!==".")throw new a.ErrnoError(55);var T;try{T=a.lookupNode(h,s)}catch{}if(S!==
T){var F=a.isDir(S.mode),U=a.mayDelete(f,i,F);if(U)throw new a.ErrnoError(U);if(U=T?a.mayDelete(h,s,F):a.mayCreate(h,s),
U)throw new a.ErrnoError(U);if(!f.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(S)||T&&a.isMountpoint(T))
throw new a.ErrnoError(10);if(h!==f&&(U=a.nodePermissions(f,"w"),U))throw new a.ErrnoError(U);a.hashRemoveNode(S);try{f.
node_ops.rename(S,h,s),S.parent=h}catch(q){throw q}finally{a.hashAddNode(S)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=X.basename(e),i=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(i)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=X.basename(e),i=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
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
sa(r):r,r&64?t=t&4095|32768:t=0;var n,i;if(typeof e=="object")n=e;else{i=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=s.node,e=s.path}var c=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(i)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),c=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!c){var f=a.mayOpen(n,r);if(f)throw new a.ErrnoError(f)}r&512&&!c&&a.truncate(n,0),
r&=-131713;var h=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return h.stream_ops.open&&h.stream_ops.open(h),c&&a.chmod(n,t&511),o.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),h},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,i){if(n<
0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(
8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var s=typeof i<"u";
if(!s)i=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var c=e.stream_ops.read(e,r,t,n,i);return s||(e.position+=
c),c},write(e,r,t,n,i,s){if(n<0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===
0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(
28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var c=typeof i<"u";if(!c)i=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var f=e.stream_ops.write(e,r,t,n,i,s);return c||(e.position+=f),f},mmap(e,r,t,n,i){if((n&2)!==0&&(i&2)===0&&(e.flags&
2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.
ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,r,t,n,i)},msync(e,r,t,n,i){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,n,i):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&ve(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),i=n.size,s=new Uint8Array(i);return a.
read(t,s,0,i,0),r.encoding==="utf8"&&(s=ze(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(Sr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
ve("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,i,s,c,f)=>c,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),je.register(a.makedev(5,0),je.default_tty_ops),je.register(a.makedev(6,0),je.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(Er(
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
t.path,n.parentObject=t.node,n.name=X.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(i){n.error=i.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var i=r.split("/").reverse();i.length;){var s=i.pop();if(s){var c=X.join2(e,s);try{a.mkdir(c)}catch(f){if(f.
errno!=20)throw f}e=c}}return c},createFile(e,r,t,n,i){var s=X.join2(typeof e=="string"?e:a.getPath(e),r),c=Br(n,i);return a.
create(s,c)},createDataFile(e,r,t,n,i,s){var c=r;e&&(e=typeof e=="string"?e:a.getPath(e),c=r?X.join2(e,r):e);var f=Br(n,
i),h=a.create(c,f);if(t){if(typeof t=="string"){for(var S=new Array(t.length),v=0,T=t.length;v<T;++v)S[v]=t.charCodeAt(v);
t=S}a.chmod(h,f|146);var F=a.open(h,577);a.write(F,t,0,t.length,0,s),a.close(F),a.chmod(h,f)}},createDevice(e,r,t,n){var i=X.
join2(typeof e=="string"?e:a.getPath(e),r),s=Br(!!t,!!n);a.createDevice.major??=64;var c=a.makedev(a.createDevice.major++,
0);return a.registerDevice(c,{open(f){f.seekable=!1},close(f){n?.buffer?.length&&n(10)},read(f,h,S,v,T){for(var F=0,U=0;U<
v;U++){var q;try{q=t()}catch{throw new a.ErrnoError(29)}if(q===void 0&&F===0)throw new a.ErrnoError(6);if(q==null)break;
F++,h[S+U]=q}return F&&(f.node.atime=Date.now()),F},write(f,h,S,v,T){for(var F=0;F<v;F++)try{n(h[S+F])}catch{throw new a.
ErrnoError(29)}return v&&(f.node.mtime=f.node.ctime=Date.now()),F}}),a.mkdev(i,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)ve("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=B(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,i){class s{lengthKnown=!1;chunks=[];get(F){
if(!(F>this.length-1||F<0)){var U=F%this.chunkSize,q=F/this.chunkSize|0;return this.getter(q)[U]}}setDataGetter(F){this.
getter=F}cacheLength(){var F=new XMLHttpRequest;F.open("HEAD",t,!1),F.send(null),F.status>=200&&F.status<300||F.status===
304||ve("Couldn't load "+t+". Status: "+F.status);var U=Number(F.getResponseHeader("Content-length")),q,M=(q=F.getResponseHeader(
"Accept-Ranges"))&&q==="bytes",g=(q=F.getResponseHeader("Content-Encoding"))&&q==="gzip",L=1024*1024;M||(L=U);var H=(ge,ye)=>{
ge>ye&&ve("invalid range ("+ge+", "+ye+") or no bytes requested!"),ye>U-1&&ve("only "+U+" bytes available! programmer er\
ror!");var le=new XMLHttpRequest;return le.open("GET",t,!1),U!==L&&le.setRequestHeader("Range","bytes="+ge+"-"+ye),le.responseType=
"arraybuffer",le.overrideMimeType&&le.overrideMimeType("text/plain; charset=x-user-defined"),le.send(null),le.status>=200&&
le.status<300||le.status===304||ve("Couldn't load "+t+". Status: "+le.status),le.response!==void 0?new Uint8Array(le.response||
[]):Sr(le.responseText||"")},te=this;te.setDataGetter(ge=>{var ye=ge*L,le=(ge+1)*L-1;return le=Math.min(le,U-1),typeof te.
chunks[ge]>"u"&&(te.chunks[ge]=H(ye,le)),typeof te.chunks[ge]>"u"&&ve("doXHR failed!"),te.chunks[ge]}),(g||!U)&&(L=U=1,U=
this.getter(0).length,L=U,re("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
U,this._chunkSize=L,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){E||ve("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,f={isDevice:!1,
contents:c}}else var f={isDevice:!1,url:t};var h=a.createFile(e,r,f,n,i);f.contents?h.contents=f.contents:f.url&&(h.contents=
null,h.url=f.url),Object.defineProperties(h,{usedBytes:{get:function(){return this.contents.length}}});var S={};for(const[
T,F]of Object.entries(h.stream_ops))S[T]=(...U)=>(a.forceLoadFile(h),F(...U));function v(T,F,U,q,M){var g=T.node.contents;
if(M>=g.length)return 0;var L=Math.min(g.length-M,q);if(g.slice)for(var H=0;H<L;H++)F[U+H]=g[M+H];else for(var H=0;H<L;H++)
F[U+H]=g.get(M+H);return L}return S.read=(T,F,U,q,M)=>(a.forceLoadFile(h),v(T,F,U,q,M)),S.mmap=(T,F,U,q,M)=>{a.forceLoadFile(
h);var g=xr(F);if(!g)throw new a.ErrnoError(48);return v(T,(l(),ne),g,F,U),{ptr:g,allocated:!0}},h.stream_ops=S,h}},He=(e,r,t)=>e?
ze((l(),ee),e,r):"",Y={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(X.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var i=Y.
getStreamFromFD(e);n=i.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
j)[e/4]=r.dev,(l(),j)[(e+4)/4]=r.mode,(l(),A)[(e+8)/8]=BigInt(r.nlink),(l(),j)[(e+16)/4]=r.uid,(l(),j)[(e+20)/4]=r.gid,(l(),
j)[(e+24)/4]=r.rdev,(l(),ce)[(e+32)/8]=BigInt(r.size),(l(),O)[(e+40)/4]=4096,(l(),O)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),i=r.ctime.getTime();return(l(),ce)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),A)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),ce)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),A)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),ce)[(e+80)/8]=BigInt(
Math.floor(i/1e3)),(l(),A)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(l(),ce)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),j)[(e+
8)/4]=r.bsize,(l(),j)[(e+72)/4]=r.bsize,(l(),ce)[(e+16)/8]=BigInt(r.blocks),(l(),ce)[(e+24)/8]=BigInt(r.bfree),(l(),ce)[(e+
32)/8]=BigInt(r.bavail),(l(),ce)[(e+40)/8]=BigInt(r.files),(l(),ce)[(e+48)/8]=BigInt(r.ffree),(l(),j)[(e+56)/4]=r.fsid,(l(),
j)[(e+80)/4]=r.flags,(l(),j)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,i){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);
if(n&2)return 0;var s=(l(),ee).slice(e,e+t);a.msync(r,s,i,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},
varargs:void 0,getStr(e){var r=He(e);return r}};function vt(e,r,t){if(w)return me(3,0,1,e,r,t);t=_(t),Y.varargs=t;try{var n=Y.
getStreamFromFD(e);switch(r){case 0:{var i=yr();if(i<0)return-28;for(;a.streams[i];)i++;var s;return s=a.dupStream(n,i),
s.fd}case 1:case 2:return 0;case 3:return n.flags;case 4:{var i=yr();return n.flags|=i,0}case 5:{var i=qe(),c=0;return(l(),
_e)[(i+c)/2]=2,0}case 6:case 7:return 0}return-28}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}
function fa(e,r){if(w)return me(4,0,1,e,r);r=_(r);try{return Y.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!==
"ErrnoError")throw t;return-t.errno}}var Be=(e,r,t)=>gt(e,(l(),ee),r,t);function wt(e,r){if(w)return me(5,0,1,e,r);e=_(e),
r=_(r);try{if(r===0)return-28;var t=a.cwd(),n=xe(t)+1;return r<n?-68:(Be(t,e,r),n)}catch(i){if(typeof a>"u"||i.name!=="E\
rrnoError")throw i;return-i.errno}}function yt(e,r,t){if(w)return me(6,0,1,e,r,t);r=_(r),t=_(t);try{var n=Y.getStreamFromFD(
e);n.getdents||=a.readdir(n.path);for(var i=280,s=0,c=a.llseek(n,0,1),f=Math.floor(c/i),h=Math.min(n.getdents.length,f+Math.
floor(t/i)),S=f;S<h;S++){var v,T,F=n.getdents[S];if(F===".")v=n.node.id,T=4;else if(F===".."){var U=a.lookupPath(n.path,
{parent:!0});v=U.node.id,T=4}else{var q;try{q=a.lookupNode(n.node,F)}catch(M){if(M?.errno===28)continue;throw M}v=q.id,T=
a.isChrdev(q.mode)?2:a.isDir(q.mode)?4:a.isLink(q.mode)?10:8}(l(),ce)[(r+s)/8]=BigInt(v),(l(),ce)[(r+s+8)/8]=BigInt((S+1)*
i),(l(),_e)[(r+s+16)/2]=280,(l(),ne)[r+s+18]=T,Be(F,r+s+19,256),s+=i}return a.llseek(n,S*i,0),s}catch(M){if(typeof a>"u"||
M.name!=="ErrnoError")throw M;return-M.errno}}function Et(e,r,t){if(w)return me(7,0,1,e,r,t);t=_(t),Y.varargs=t;try{var n=Y.
getStreamFromFD(e);switch(r){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var i=n.
tty.ops.ioctl_tcgets(n),s=qe();(l(),O)[s/4]=i.c_iflag||0,(l(),O)[(s+4)/4]=i.c_oflag||0,(l(),O)[(s+8)/4]=i.c_cflag||0,(l(),
O)[(s+12)/4]=i.c_lflag||0;for(var c=0;c<32;c++)(l(),ne)[s+c+17]=i.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:
return n.tty?0:-59;case 21506:case 21507:case 21508:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=qe(),f=(l(),
O)[s/4],h=(l(),O)[(s+4)/4],S=(l(),O)[(s+8)/4],v=(l(),O)[(s+12)/4],T=[],c=0;c<32;c++)T.push((l(),ne)[s+c+17]);return n.tty.
ops.ioctl_tcsets(n.tty,r,{c_iflag:f,c_oflag:h,c_cflag:S,c_lflag:v,c_cc:T})}return 0}case 21519:{if(!n.tty)return-59;var s=qe();
return(l(),O)[s/4]=0,0}case 21520:return n.tty?-28:-59;case 21537:case 21531:{var s=qe();return a.ioctl(n,r,s)}case 21523:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){var F=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=qe();(l(),_e)[s/2]=F[0],(l(),
_e)[(s+2)/2]=F[1]}return 0}case 21524:return n.tty?0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(U){if(typeof a>
"u"||U.name!=="ErrnoError")throw U;return-U.errno}}function da(e,r){if(w)return me(8,0,1,e,r);e=_(e),r=_(r);try{return e=
Y.getStr(e),Y.writeStat(r,a.lstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function ma(e,r,t,n){
if(w)return me(9,0,1,e,r,t,n);r=_(r),t=_(t);try{r=Y.getStr(r);var i=n&256,s=n&4096;return n=n&-6401,r=Y.calculateAt(e,r,
s),Y.writeStat(t,i?a.lstat(r):a.stat(r))}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function kt(e,r,t,n){
if(w)return me(10,0,1,e,r,t,n);r=_(r),n=_(n),Y.varargs=n;try{r=Y.getStr(r),r=Y.calculateAt(e,r);var i=n?yr():0;return a.
open(r,t,i).fd}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function St(e,r){if(w)return me(11,
0,1,e,r);e=_(e),r=_(r);try{return e=Y.getStr(e),Y.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")
throw t;return-t.errno}}var pa=()=>ve("");function ga(e){e=_(e),qr(e,!E,1,!p,5242880,!1),P.threadInitTLS()}var Nr=e=>{if(e instanceof
Zr||e=="unwind")return ae;y(1,e)},ha=()=>{if(!hr())try{if(w){cr()&&Lr(ae);return}_r(ae)}catch(e){Nr(e)}},Ge=e=>{if(!J)try{
e(),ha()}catch(r){Nr(r)}};function Ir(e){if(e=_(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),O),e/4,e);r.value.then(
ir);var t=e+228;Atomics.store((l(),O),t/4,1)}}var ir=()=>Ge(()=>{var e=cr();e&&(Ir(e),fn())});function ba(e,r){if(e=_(e),
r=_(r),e==r)setTimeout(ir);else if(w)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=P.pthreads[e];if(!t)return;
t.postMessage({cmd:"checkMailbox"})}}var or=[];function _a(e,r,t,n,i){t=_(t),i=_(i),n/=2,or.length=n;for(var s=i/8,c=0;c<
n;c++)(l(),ce)[s+2*c]?or[c]=(l(),ce)[s+2*c+1]:or[c]=(l(),Te)[s+2*c+1];var f=Gi[e];P.currentProxiedOperationCallerThread=
t;var h=f(...or);return P.currentProxiedOperationCallerThread=0,typeof h=="bigint"&&(h=_(h)),h}function va(e){e=_(e),w?postMessage(
{cmd:"cleanupThread",thread:e}):rt(e)}function wa(e){e=_(e),b&&P.pthreads[e].ref()}var ya=e=>e%4===0&&(e%100!==0||e%400===
0),Ea=[0,31,60,91,121,152,182,213,244,274,305,335],ka=[0,31,59,90,120,151,181,212,243,273,304,334],Sa=e=>{var r=ya(e.getFullYear()),
t=r?Ea:ka,n=t[e.getMonth()]+e.getDate()-1;return n};function xa(e,r){e=_(e),r=_(r);var t=new Date(e*1e3);(l(),O)[r/4]=t.
getSeconds(),(l(),O)[(r+4)/4]=t.getMinutes(),(l(),O)[(r+8)/4]=t.getHours(),(l(),O)[(r+12)/4]=t.getDate(),(l(),O)[(r+16)/
4]=t.getMonth(),(l(),O)[(r+20)/4]=t.getFullYear()-1900,(l(),O)[(r+24)/4]=t.getDay();var n=Sa(t)|0;(l(),O)[(r+28)/4]=n,(l(),
ce)[(r+40)/8]=BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=i.getTimezoneOffset(),f=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(l(),O)[(r+32)/4]=f}function xt(e,r,t,n,i,s,c){
if(w)return me(12,0,1,e,r,t,n,i,s,c);e=_(e),i=_(i),s=_(s),c=_(c);try{var f=Y.getStreamFromFD(n),h=a.mmap(f,e,i,r,t),S=h.
ptr;return(l(),O)[s/4]=h.allocated,(l(),A)[c/8]=BigInt(S),0}catch(v){if(typeof a>"u"||v.name!=="ErrnoError")throw v;return-v.
errno}}function Bt(e,r,t,n,i,s){if(w)return me(13,0,1,e,r,t,n,i,s);e=_(e),r=_(r),s=_(s);try{var c=Y.getStreamFromFD(i);t&
2&&Y.doMsync(e,c,r,n,s)}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}var Ba=function(e,r,t,n){
e=_(e),r=_(r),t=_(t),n=_(n);var i=new Date().getFullYear(),s=new Date(i,0,1),c=new Date(i,6,1),f=s.getTimezoneOffset(),h=c.
getTimezoneOffset(),S=Math.max(f,h);(l(),A)[e/8]=BigInt(S*60),(l(),O)[r/4]=+(f!=h);var v=U=>{var q=U>=0?"-":"+",M=Math.abs(
U),g=String(Math.floor(M/60)).padStart(2,"0"),L=String(M%60).padStart(2,"0");return`UTC${q}${g}${L}`},T=v(f),F=v(h);h<f?
(Be(T,t,17),Be(F,n,17)):(Be(T,n,17),Be(F,t,17))},Gt=()=>performance.timeOrigin+performance.now(),Nt=()=>Date.now(),Ga=e=>e>=
0&&e<=3;function Na(e,r,t){if(t=_(t),!Ga(e))return 28;var n;e===0?n=Nt():n=Gt();var i=Math.round(n*1e3*1e3);return(l(),ce)[t/
8]=BigInt(i),0}var Ia=()=>{},Qe=()=>{ar+=1},Fa=()=>{throw Qe(),"unwind"},Aa=()=>new Error().stack.toString(),Ta=e=>{var r=Aa(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",f="",h=0,S=0,v=i.exec(s);if(v?.length==5)c=v[1],f=v[2],h=v[3],S=v[4];else if(v=n.exec(s),v?.length>=4)c=v[1],f=
v[2],h=v[3],S=v[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(f=f.substring(f.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${f}:${h}:${S})
`)}return r=r.replace(/\s+$/,""),r};function Ca(e,r,t){r=_(r);var n=Ta(e);if(!r||t<=0)return xe(n)+1;var i=Be(n,r,t);return i+
1}var It=()=>4294967296,Ua=()=>BigInt(It()),Ra=()=>2,Oa=()=>b?require("os").cpus().length:navigator.hardwareConcurrency,
ja=e=>{var r=Se.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Se.grow(BigInt(t)),rr(),1}catch{}};function Da(e){e=_(
e);var r=(l(),ee).length;if(e<=r)return!1;var t=It();if(e>t)return!1;for(var n=1;n<=4;n*=2){var i=r*(1+.2/n);i=Math.min(
i,e+100663296);var s=Math.min(t,ht(Math.max(e,i),65536)),c=ja(s);if(c)return!0}return!1}var Ie=e=>{var r=xe(e)+1,t=br(r);
return Be(e,t,r),t},Ma=(e,r)=>{(l(),j)[e/4]=r;var t=(l(),j)[e/4];(l(),j)[(e+4)/4]=(r-t)/4294967296},qa=e=>{var r=xe(e)+1,
t=Lt(r);return t&&Be(e,t,r),t},Ce=e=>(l(),j)[e/4]+(l(),O)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
m.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=en(r);return m.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=Fr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Ar(r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{z(e.mapState==="unmapped");var t=rn(r);return m.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Tr(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Cr(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Ur(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Rr(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Or(
r),n=tn(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),o.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=Qt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=Wt(
r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Vt(r);return m.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Or(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Ht(r);return m.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=$t(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=Pt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Jt(r);return m.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=Kt(r);return m.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=nn(
r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Xt(r);return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Yt(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=Zt(r);return m.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var i=Ee(),s=Ie(t);((c,f,h)=>ut(e).call(null,c,BigInt(f),BigInt(h)))(r,BigInt(s),n),ke(i)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),A)[e/8]);t;t=Number((l(),A)[t/8])){var n=(l(),O)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),A)[e/8]=BigInt(r),(l(),A)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),A)[e/8]),t=Number((l(),
A)[(e+8)/8]);return He(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),A)[e/8]),t=Number((l(),A)[(e+8)/8]);
return r?He(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),Te)[e/8],g:(l(),Te)[(e+8)/8],b:(l(),Te)[(e+16)/8],a:(l(),Te)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),j)[e/4],height:(l(),j)[(e+4)/4],depthOrArrayLayers:(l(),j)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),j)[e/4],y:(l(),j)[(e+4)/4],z:(l(),j)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.getJsObject(Number((l(),A)[e/
8])),mipLevel:(l(),j)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),O)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),j)[(e+8)/4],t=(l(),j)[(e+12)/4];return{offset:Ce(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.buffer=m.getJsObject(Number((l(),
A)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number((l(),A)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
j)[(e+16)/4],endOfPassWriteIndex:(l(),j)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var i=r+
32*n,s=m.makeStringFromStringView(i+8);t[s]=(l(),Te)[(i+24)/8]}return t}},makePipelineLayout:e=>e?m.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),A)[(e+8)/8])),constants:m.makePipelineConstants(Number(
(l(),A)[(e+32)/8]),Number((l(),A)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(g){if(g)return{topology:m.PrimitiveTopology[(l(),O)[(g+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),O)[(g+12)/4]],frontFace:m.FrontFace[(l(),O)[(g+16)/4]],cullMode:m.CullMode[(l(),O)[(g+20)/4]],unclippedDepth:!!(l(),
j)[(g+24)/4]}}function t(g){if(g)return{operation:m.BlendOperation[(l(),O)[g/4]],srcFactor:m.BlendFactor[(l(),O)[(g+4)/4]],
dstFactor:m.BlendFactor[(l(),O)[(g+8)/4]]}}function n(g){if(g)return{alpha:t(g+12),color:t(g+0)}}function i(g){var L=m.TextureFormat[(l(),
O)[(g+8)/4]];return L?{format:L,blend:n(Number((l(),A)[(g+16)/8])),writeMask:(l(),j)[(g+24)/4]}:void 0}function s(g,L){for(var H=[],
te=0;te<g;++te)H.push(i(L+32*te));return H}function c(g){return{compare:m.CompareFunction[(l(),O)[g/4]],failOp:m.StencilOperation[(l(),
O)[(g+4)/4]],depthFailOp:m.StencilOperation[(l(),O)[(g+8)/4]],passOp:m.StencilOperation[(l(),O)[(g+12)/4]]}}function f(g){
if(g)return{format:m.TextureFormat[(l(),O)[(g+8)/4]],depthWriteEnabled:!!(l(),j)[(g+12)/4],depthCompare:m.CompareFunction[(l(),
O)[(g+16)/4]],stencilFront:c(g+20),stencilBack:c(g+36),stencilReadMask:(l(),j)[(g+52)/4],stencilWriteMask:(l(),j)[(g+56)/
4],depthBias:(l(),O)[(g+60)/4],depthBiasSlopeScale:(l(),Me)[(g+64)/4],depthBiasClamp:(l(),Me)[(g+68)/4]}}function h(g){return{
format:m.VertexFormat[(l(),O)[(g+8)/4]],offset:Ce(g+16),shaderLocation:(l(),j)[(g+24)/4]}}function S(g,L){for(var H=[],te=0;te<
g;++te)H.push(h(L+te*32));return H}function v(g){if(g){var L=m.VertexStepMode[(l(),O)[(g+8)/4]],H=Number((l(),A)[(g+24)/
8]);return!L&&!H?null:{arrayStride:Ce(g+16),stepMode:L,attributes:S(H,Number((l(),A)[(g+32)/8]))}}}function T(g,L){if(g){
for(var H=[],te=0;te<g;++te)H.push(v(L+te*40));return H}}function F(g){if(g){var L={module:m.getJsObject(Number((l(),A)[(g+
8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(g+32)/8]),Number((l(),A)[(g+40)/8])),buffers:T(Number((l(),A)[(g+
48)/8]),Number((l(),A)[(g+56)/8])),entryPoint:m.makeStringFromOptionalStringView(g+16)};return L}}function U(g){if(g)return{
count:(l(),j)[(g+8)/4],mask:(l(),j)[(g+12)/4],alphaToCoverageEnabled:!!(l(),j)[(g+16)/4]}}function q(g){if(g){var L={module:m.
getJsObject(Number((l(),A)[(g+8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(g+32)/8]),Number((l(),A)[(g+40)/
8])),targets:s(Number((l(),A)[(g+48)/8]),Number((l(),A)[(g+56)/8])),entryPoint:m.makeStringFromOptionalStringView(g+16)};
return L}}var M={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),vertex:F(
e+32),primitive:r(e+96),depthStencil:f(Number((l(),A)[(e+128)/8])),multisample:U(e+136),fragment:q(Number((l(),A)[(e+160)/
8]))};return M},fillLimitStruct:(e,r)=>{var t=Number((l(),A)[r/8]);function n(c,f,h,S=0){var v=e[c]??S;(l(),j)[(f+h)/4]=
v}function i(c,f,h,S=0){var v=e[c]??S;Ma(f+h,v)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("max\
TextureDimension3D",r,16),n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),
n("maxBindingsPerBindGroup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),n("maxSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPer\
ShaderStage",r,52),n("maxStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBuf\
ferOffsetAlignment",r,80),n("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageB\
ufferBindingSize",r,72),n("maxVertexBuffers",r,88),i("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBu\
fferArrayStride",r,108),n("maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentByte\
sPerSample",r,120),n("maxComputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeW\
orkgroupSizeX",r,132),n("maxComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPer\
Dimension",r,144),n("maxImmediateSize",r,148),t!==0){(l(),O)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(l(),j)[(r+88)/4]=e.subgroupMinSize,(l(),j)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,n=qa(t),i=xe(e.vendor);m.setStringView(r+8,n,i),n+=i;var s=xe(e.architecture);m.setStringView(r+24,
n,s),n+=s;var c=xe(e.device);m.setStringView(r+40,n,c),n+=c;var f=xe(e.description);m.setStringView(r+56,n,f),n+=f,(l(),
O)[(r+72)/4]=2;var h=e.isFallbackAdapter?3:4;(l(),O)[(r+76)/4]=h,(l(),j)[(r+80)/4]=0,(l(),j)[(r+84)/4]=0},AddressMode:[,
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},La={undefined:1,unknown:1,destroyed:2},
Ue=()=>{ar-=1};function za(e,r,t,n,i,s){e=_(e),r=_(r),t=_(t),n=_(n),i=_(i),s=_(s);var c=m.getJsObject(e),f={};if(s){var h=Number(
(l(),A)[(s+24)/8]);if(h){var S=Number((l(),A)[(s+32)/8]);f.requiredFeatures=Array.from((l(),j).subarray(S/4,(S+h*4)/4),g=>m.
FeatureName[g])}var v=Number((l(),A)[(s+40)/8]);if(v){let g=function(H,te,ge,ye=!1){var le=te+ge,Je=(l(),j)[le/4];Je!=4294967295&&
(!ye||Je!=0)&&(F[H]=Je)},L=function(H,te,ge){var ye=te+ge,le=(l(),j)[ye/4],Je=(l(),j)[(ye+4)/4];(le!=4294967295||Je!=4294967295)&&
(F[H]=Ce(ye))};var T=Number((l(),A)[v/8]),F={};if(g("maxTextureDimension1D",v,8),g("maxTextureDimension2D",v,12),g("maxT\
extureDimension3D",v,16),g("maxTextureArrayLayers",v,20),g("maxBindGroups",v,24),g("maxBindGroupsPlusVertexBuffers",v,28),
g("maxBindingsPerBindGroup",v,32),g("maxDynamicUniformBuffersPerPipelineLayout",v,36),g("maxDynamicStorageBuffersPerPipe\
lineLayout",v,40),g("maxSampledTexturesPerShaderStage",v,44),g("maxSamplersPerShaderStage",v,48),g("maxStorageBuffersPer\
ShaderStage",v,52),g("maxStorageTexturesPerShaderStage",v,56),g("maxUniformBuffersPerShaderStage",v,60),g("minUniformBuf\
ferOffsetAlignment",v,80),g("minStorageBufferOffsetAlignment",v,84),L("maxUniformBufferBindingSize",v,64),L("maxStorageB\
ufferBindingSize",v,72),g("maxVertexBuffers",v,88),L("maxBufferSize",v,96),g("maxVertexAttributes",v,104),g("maxVertexBu\
fferArrayStride",v,108),g("maxInterStageShaderVariables",v,112),g("maxColorAttachments",v,116),g("maxColorAttachmentByte\
sPerSample",v,120),g("maxComputeWorkgroupStorageSize",v,124),g("maxComputeInvocationsPerWorkgroup",v,128),g("maxComputeW\
orkgroupSizeX",v,132),g("maxComputeWorkgroupSizeY",v,136),g("maxComputeWorkgroupSizeZ",v,140),g("maxComputeWorkgroupsPer\
Dimension",v,144),g("maxImmediateSize",v,148,!0),T!==0){(l(),O)[(T+8)/4];var U=T;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(g("maxStorageBuffersInVertexStage",U,16),g("maxStorageTexturesInVertexStage",U,20),g("maxStorageBuffersInFra\
gmentStage",U,24),g("maxStorageTexturesInFragmentStage",U,28))}f.requiredLimits=F}var q=Number((l(),A)[(s+48)/8]);if(q){
var M={label:m.makeStringFromOptionalStringView(q+8)};f.defaultQueue=M}f.label=m.makeStringFromOptionalStringView(s+8)}Qe(),
m.Internals.futureInsert(r,c.requestDevice(f).then(g=>{Ue(),Ge(()=>{m.Internals.jsObjectInsert(i,g.queue),m.Internals.jsObjectInsert(
n,g),o.peercomputeOnDevice?.(g),n=BigInt(n),m.Internals.futureInsert(t,g.lost.then(L=>{Ge(()=>{g.onuncapturederror=ge=>{};
var H=Ee(),te=Ie(L.message);jr(t,La[L.reason],BigInt(te)),ke(H)})})),g.onuncapturederror=L=>{var H=5;L.error instanceof GPUValidationError?
H=2:L.error instanceof GPUOutOfMemoryError?H=3:L.error instanceof GPUInternalError&&(H=4);var te=Ee(),ge=Ie(L.error.message);
on(BigInt(n),H,BigInt(ge)),ke(te)},Mr(r,1,BigInt(n),0n)})},g=>{Ue(),Ge(()=>{var L=Ee(),H=Ie(g.message);Mr(r,3,BigInt(n),
BigInt(H)),t&&jr(t,4,BigInt(H)),ke(L)})}))}function Qa(e){e=_(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];
if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}var Wa=function(e,r,t){e=_(e),r=
_(r),t=_(t);var n=(()=>{var i=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=i.getMappedRange(r,t)}catch{return 0n}var c=dn(
16,s.byteLength);return(l(),ee).set(new Uint8Array(s),c),m.Internals.bufferOnUnmaps[e].push(()=>zt(c)),c})();return BigInt(
n)},Va=function(e,r,t,n,i){e=_(e),r=_(r),t=_(t),n=_(n),i=_(i);var s=m.getJsObject(e);m.Internals.bufferOnUnmaps[e]=[],i==
-1&&(i=void 0),Qe(),m.Internals.futureInsert(r,s.mapAsync(t,n,i).then(()=>{Ue(),Ge(()=>{Dr(r,1,0n)})},c=>{Ue(),Ge(()=>{var f=Ee(),
h=Ie(c.message),S=c.name==="AbortError"?4:c.name==="OperationError"?3:0;Dr(r,S,BigInt(h)),delete m.Internals.bufferOnUnmaps[e]})}))};
function Ha(e){e=_(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.
Internals.bufferOnUnmaps[e],r.unmap()}}function $a(e){e=_(e),delete m.Internals.jsObjects[e]}function Pa(e,r,t){e=_(e),r=
_(r),t=_(t);var n=!!(l(),j)[(r+40)/4],i={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),j)[(r+24)/4],size:Ce(r+
32),mappedAtCreation:n},s=m.getJsObject(e),c;try{c=s.createBuffer(i)}catch{return!1}return m.Internals.jsObjectInsert(t,
c),n&&(m.Internals.bufferOnUnmaps[t]=[]),!0}function Ja(e,r,t){e=_(e),r=_(r),t=_(t);var n=Number((l(),A)[r/8]),i=(l(),O)[(n+
8)/4],s={label:m.makeStringFromOptionalStringView(r+8),code:""};switch(i){case 2:{s.code=m.makeStringFromStringView(n+16);
break}}var c=m.getJsObject(e);m.Internals.jsObjectInsert(t,c.createShaderModule(s))}var Ka=e=>{const r=m.getJsObject(e);
r.onuncapturederror=null,r.destroy()};function Xa(e,r,t,n){r=_(r),t=_(t),n=_(n);var i;if(t){i={featureLevel:m.FeatureLevel[(l(),
O)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),O)[(t+12)/4]],forceFallbackAdapter:!!(l(),j)[(t+16)/4]};var s=Number(
(l(),A)[t/8]);if(s!==0){(l(),O)[(s+8)/4];var c=s;i.xrCompatible=!!(l(),j)[(c+16)/4]}}if(!("gpu"in navigator)){var f=Ee(),
h=Ie("WebGPU not available on this browser (navigator.gpu is not available)");Pe(r,3,BigInt(n),BigInt(h)),ke(f);return}Qe(),
m.Internals.futureInsert(r,navigator.gpu.requestAdapter(i).then(S=>{Ue(),Ge(()=>{if(S)m.Internals.jsObjectInsert(n,S),Pe(
r,1,BigInt(n),0n);else{var v=Ee(),T=Ie("WebGPU not available on this browser (requestAdapter returned null)");Pe(r,3,BigInt(
n),BigInt(T)),ke(v)}})},S=>{Ue(),Ge(()=>{var v=Ee(),T=Ie(S.message);Pe(r,4,BigInt(n),BigInt(T)),ke(v)})}))}var Ya=function(e,r){
e=_(e),r=_(r);var t=m.getJsObject(e);Qe(),m.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Ue(),Ge(()=>{an(r,
1)})}))},Ft=function(e,r,t){return e=_(e),r=_(r),t=_(t),we.handleAsync(async()=>{var n=[];if(t){var i=(l(),O)[t/4];n.length=
r+1,n[r]=new Promise(h=>setTimeout(h,i,0))}else n.length=r;for(var s=0;s<r;++s){var c=Ce(e+s*8);if(!(c in m.Internals.futures))
return c;n[s]=m.Internals.futures[c]}const f=await Promise.race(n);return delete m.Internals.futures[f],f})};Ft.isAsync=
!0;var sr={},Za=()=>x||"./this.program",$e=()=>{if(!$e.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Za()};
for(var t in sr)sr[t]===void 0?delete r[t]:r[t]=sr[t];var n=[];for(var t in r)n.push(`${t}=${r[t]}`);$e.strings=n}return $e.
strings};function At(e,r){if(w)return me(14,0,1,e,r);e=_(e),r=_(r);var t=0,n=0;for(var i of $e()){var s=r+t;(l(),A)[(e+n)/
8]=BigInt(s),t+=Be(i,s,1/0)+1,n+=8}return 0}function Tt(e,r){if(w)return me(15,0,1,e,r);e=_(e),r=_(r);var t=$e();(l(),A)[e/
8]=BigInt(t.length);var n=0;for(var i of t)n+=xe(i)+1;return(l(),A)[r/8]=BigInt(n),0}function Ct(e){if(w)return me(16,0,
1,e);try{var r=Y.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var ei=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){var c=Number((l(),A)[r/8]),f=Number((l(),A)[(r+8)/8]);r+=16;var h=a.read(
e,(l(),ne),c,f,n);if(h<0)return-1;if(i+=h,h<f)break}return i};function Ut(e,r,t,n){if(w)return me(17,0,1,e,r,t,n);r=_(r),
t=_(t),n=_(n);try{var i=Y.getStreamFromFD(e),s=ei(i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function Rt(e,r,t,n){if(w)return me(18,0,1,e,r,t,n);r=_(r),n=_(n);try{if(isNaN(r))return 61;
var i=Y.getStreamFromFD(e);return a.llseek(i,r,t),(l(),ce)[n/8]=BigInt(i.position),i.getdents&&r===0&&t===0&&(i.getdents=
null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var ri=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){
var c=Number((l(),A)[r/8]),f=Number((l(),A)[(r+8)/8]);r+=16;var h=a.write(e,(l(),ne),c,f,n);if(h<0)return-1;if(i+=h,h<f)
break}return i};function Ot(e,r,t,n){if(w)return me(19,0,1,e,r,t,n);r=_(r),t=_(t),n=_(n);try{var i=Y.getStreamFromFD(e),
s=ri(i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function ti(e,r){
e=_(e),r=_(r);try{return Er((l(),ee).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function ni(e,r){e=_(e),r=_(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(t.info,r),1}function ai(e,r){
e=_(e),r=_(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function ii(e,r){e=_(e);var t=m.getJsObject(
e);return t.features.has(m.FeatureName[r])}var oi=function(e){e=_(e);var r=(()=>{var t=m.getJsObject(e);return t.size})();
return BigInt(r)},si=function(e,r){e=_(e),r=_(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8),
timestampWrites:m.makePassTimestampWrites(Number((l(),A)[(r+24)/8]))});var i=m.getJsObject(e),s=Ur(0n);return m.Internals.
jsObjectInsert(s,i.beginComputePass(n)),s})();return BigInt(t)};function ci(e,r,t,n,i,s){e=_(e),r=_(r),t=_(t),n=_(n),i=_(
i),s=_(s);var c=m.getJsObject(e),f=m.getJsObject(r),h=m.getJsObject(n);c.copyBufferToBuffer(f,t,h,i,s)}var li=function(e,r){
e=_(e);var t=(()=>{var n=m.getJsObject(e),i=Tr(0n);return m.Internals.jsObjectInsert(i,n.finish()),i})();return BigInt(t)};
function ui(e,r,t,n){e=_(e);var i=m.getJsObject(e);i.dispatchWorkgroups(r,t,n)}function fi(e){e=_(e);var r=m.getJsObject(
e);r.end()}function di(e,r,t,n,i){e=_(e),t=_(t),n=_(n),i=_(i);var s=m.getJsObject(e),c=m.getJsObject(t);n==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(l(),j),i/4,n)}function mi(e,r){e=_(e),r=_(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var pi=function(e,r){e=_(e);var t=(()=>{var n=m.getJsObject(e),i=Ar(0n);return m.Internals.jsObjectInsert(i,n.getBindGroupLayout(
r)),i})();return BigInt(t)},gi=function(e,r){e=_(e),r=_(r);var t=(()=>{function n(h){var S=Number((l(),A)[(h+16)/8]),v=Number(
(l(),A)[(h+40)/8]),T=Number((l(),A)[(h+48)/8]),F=0;m.iterateExtensions(h,{327681:M=>{F=Number((l(),A)[(M+16)/8])}});var U;
if(S){var q=Ce(h+32);q==-1&&(q=void 0),U={buffer:m.getJsObject(S),offset:Ce(h+24),size:q}}else U=m.getJsObject(v||T||F);
return{binding:(l(),j)[(h+8)/4],resource:U}}function i(h,S){for(var v=[],T=0;T<h;++T)v.push(n(S+56*T));return v}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),A)[(r+24)/8])),entries:i(Number((l(),A)[(r+32)/8]),
Number((l(),A)[(r+40)/8]))},c=m.getJsObject(e),f=Fr(0n);return m.Internals.jsObjectInsert(f,c.createBindGroup(s)),f})();
return BigInt(t)},hi=function(e,r){e=_(e),r=_(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var i=m.getJsObject(e),s=Cr(0n);return m.Internals.jsObjectInsert(s,i.createCommandEncoder(n)),s})();return BigInt(t)},bi=function(e,r){
e=_(e),r=_(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),i=m.getJsObject(e),s=Rr(0n);return m.Internals.jsObjectInsert(
s,i.createComputePipeline(n)),s})();return BigInt(t)};function _i(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var vi=function(e,r,t){e=_(e),r=_(r),t=_(t);var n=m.getJsObject(
e),i=Array.from((l(),ce).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(i)};function wi(e,r,t,n,i){e=_(e),r=_(r),
t=_(t),n=_(n),i=_(i);var s=m.getJsObject(e),c=m.getJsObject(r),f=(l(),ee).subarray(n,n+i);s.writeBuffer(c,t,f,0,i)}var we={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;we.asyncExports=new Set;var t={};for(let[i,s]of Object.entries(
e))if(typeof s=="function"){r.test(i)&&(we.asyncExports.add(s),s=we.makeAsyncFunction(s));var n=we.instrumentFunction(s);
t[i]=n}else t[i]=s;return t},asyncExports:null,isAsyncExport(e){return we.asyncExports?.has(e)},handleAsync:async e=>{Qe();
try{return await e()}finally{Ue()}},handleSleep:e=>we.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},jt=e=>{var r=o["_"+e];return r},yi=(e,r)=>{(l(),ne).set(e,r)},Dt=(e,r,t,n,i)=>{var s={pointer:M=>BigInt(M),
string:M=>{var g=0;return M!=null&&M!==0&&(g=Ie(M)),BigInt(g)},array:M=>{var g=br(M.length);return yi(M,g),BigInt(g)}};function c(M){
return r==="string"?He(Number(M)):r==="pointer"?Number(M):r==="boolean"?!!M:M}var f=jt(e),h=[],S=0;if(n)for(var v=0;v<n.
length;v++){var T=s[t[v]];T?(S===0&&(S=Ee()),h[v]=T(n[v])):h[v]=n[v]}var F=f(...h);function U(M){return S!==0&&ke(S),c(M)}
var q=i?.async;return q?F.then(U):(F=U(F),F)},Ei=(e,r,t,n)=>{var i=!t||t.every(c=>c==="number"||c==="boolean"),s=r!=="st\
ring";return s&&i&&!n?jt(e):(...c)=>Dt(e,r,t,c,n)},ki=(...e)=>a.createPath(...e),Si=(...e)=>a.unlink(...e),xi=(...e)=>a.
createLazyFile(...e),Bi=(...e)=>a.createDevice(...e);if(P.init(),a.createPreloadedFile=ua,a.preloadFile=Gr,a.staticInit(),
Qn(),o.noExitRuntime&&(wr=o.noExitRuntime),o.preloadPlugins&&(_t=o.preloadPlugins),o.print&&(re=o.print),o.printErr&&(Z=
o.printErr),o.wasmBinary&&(pe=o.wasmBinary),o.arguments&&o.arguments,o.thisProgram&&(x=o.thisProgram),o.preInit)for(typeof o.
preInit=="function"&&(o.preInit=[o.preInit]);o.preInit.length>0;)o.preInit.shift()();o.ENV=sr,o.mmapAlloc=xr,o.wasmMemory=
Se,o.addRunDependency=nr,o.removeRunDependency=tr,o.ccall=Dt,o.cwrap=Ei,o.FS_preloadFile=Gr,o.FS_unlink=Si,o.FS_createPath=
ki,o.FS_createDevice=Bi,o.FS=a,o.FS_createDataFile=bt,o.FS_createLazyFile=xi,o.MEMFS=D;var Gi=[ot,st,dt,vt,fa,wt,yt,Et,da,
ma,kt,St,xt,Bt,At,Tt,Ct,Ut,Rt,Ot];function Mt(e,r,t,n){return we.handleAsync(async()=>await u(He(Number(e)),Number(r),Number(
t),Number(n)))}Mt.sig="jjjjj";var qt,Lt,zt,Fr,Ar,Tr,Cr,Ur,Rr,Qt,Wt,Vt,Ht,$t,Pt,Jt,Kt,Xt,Yt,Zt,en,rn,tn,Or,nn,jr,Dr,Pe,Mr,
an,on,cr,sn,qr,cn,ln,un,Lr,fn,dn,mn,pn,gn,hn,bn,_n;function Ni(e){o._wllama_malloc=e.wllama_malloc,o._wllama_start=e.wllama_start,
o._wllama_action=e.wllama_action,o._wllama_exit=e.wllama_exit,o._wllama_debug=e.wllama_debug,qt=o._main=e.main,Lt=e.malloc,
zt=e.free,Fr=e.emwgpuCreateBindGroup,Ar=e.emwgpuCreateBindGroupLayout,Tr=e.emwgpuCreateCommandBuffer,Cr=e.emwgpuCreateCommandEncoder,
Ur=e.emwgpuCreateComputePassEncoder,Rr=e.emwgpuCreateComputePipeline,Qt=e.emwgpuCreateExternalTexture,Wt=e.emwgpuCreatePipelineLayout,
Vt=e.emwgpuCreateQuerySet,Ht=e.emwgpuCreateRenderBundle,$t=e.emwgpuCreateRenderBundleEncoder,Pt=e.emwgpuCreateRenderPassEncoder,
Jt=e.emwgpuCreateRenderPipeline,Kt=e.emwgpuCreateSampler,Xt=e.emwgpuCreateSurface,Yt=e.emwgpuCreateTexture,Zt=e.emwgpuCreateTextureView,
en=e.emwgpuCreateAdapter,rn=e.emwgpuCreateBuffer,tn=e.emwgpuCreateDevice,Or=e.emwgpuCreateQueue,nn=e.emwgpuCreateShaderModule,
jr=e.emwgpuOnDeviceLostCompleted,Dr=e.emwgpuOnMapAsyncCompleted,Pe=e.emwgpuOnRequestAdapterCompleted,Mr=e.emwgpuOnRequestDeviceCompleted,
an=e.emwgpuOnWorkDoneCompleted,on=e.emwgpuOnUncapturedError,e._emscripten_tls_init,cr=e.pthread_self,sn=e.emscripten_builtin_memalign,
qr=e._emscripten_thread_init,cn=e._emscripten_thread_crashed,ln=e._emscripten_run_js_on_main_thread,un=e._emscripten_thread_free_data,
Lr=e._emscripten_thread_exit,fn=e._emscripten_check_mailbox,dn=e.memalign,mn=e.__trap,pn=e.emscripten_stack_set_limits,gn=
e._emscripten_stack_restore,hn=e._emscripten_stack_alloc,bn=e.emscripten_stack_get_current,_n=e.__indirect_function_table}
var We;function Ii(){We={__asyncjs__js_file_read:Mt,__pthread_create_js:mt,__syscall_fcntl64:vt,__syscall_getcwd:wt,__syscall_getdents64:yt,
__syscall_ioctl:Et,__syscall_openat:kt,__syscall_stat64:St,_abort_js:pa,_emscripten_init_main_thread_js:ga,_emscripten_notify_mailbox_postmessage:ba,
_emscripten_receive_on_main_thread_js:_a,_emscripten_thread_cleanup:va,_emscripten_thread_mailbox_await:Ir,_emscripten_thread_set_strongref:wa,
_localtime_js:xa,_mmap_js:xt,_munmap_js:Bt,_tzset_js:Ba,clock_time_get:Na,emscripten_check_blocking_allowed:Ia,emscripten_date_now:Nt,
emscripten_exit_with_live_runtime:Fa,emscripten_get_callstack:Ca,emscripten_get_heap_max:Ua,emscripten_get_now:Gt,emscripten_has_asyncify:Ra,
emscripten_num_logical_cores:Oa,emscripten_resize_heap:Da,emwgpuAdapterRequestDevice:za,emwgpuBufferDestroy:Qa,emwgpuBufferGetConstMappedRange:Wa,
emwgpuBufferMapAsync:Va,emwgpuBufferUnmap:Ha,emwgpuDelete:$a,emwgpuDeviceCreateBuffer:Pa,emwgpuDeviceCreateShaderModule:Ja,
emwgpuDeviceDestroy:Ka,emwgpuInstanceRequestAdapter:Xa,emwgpuQueueOnSubmittedWorkDone:Ya,emwgpuWaitAny:Ft,environ_get:At,
environ_sizes_get:Tt,exit:_r,fd_close:Ct,fd_read:Ut,fd_seek:Rt,fd_write:Ot,memory:Se,random_get:ti,wgpuAdapterGetInfo:ni,
wgpuAdapterGetLimits:ai,wgpuAdapterHasFeature:ii,wgpuBufferGetSize:oi,wgpuCommandEncoderBeginComputePass:si,wgpuCommandEncoderCopyBufferToBuffer:ci,
wgpuCommandEncoderFinish:li,wgpuComputePassEncoderDispatchWorkgroups:ui,wgpuComputePassEncoderEnd:fi,wgpuComputePassEncoderSetBindGroup:di,
wgpuComputePassEncoderSetPipeline:mi,wgpuComputePipelineGetBindGroupLayout:pi,wgpuDeviceCreateBindGroup:gi,wgpuDeviceCreateCommandEncoder:hi,
wgpuDeviceCreateComputePipeline:bi,wgpuInstanceHasWGSLLanguageFeature:_i,wgpuQueueSubmit:vi,wgpuQueueWriteBuffer:wi}}function Fi(e){
e=Object.assign({},e);var r=S=>(v,T,F)=>S(v,BigInt(T||0),BigInt(F||0)),t=S=>v=>Number(S(BigInt(v))),n=S=>v=>S(BigInt(v)),
i=S=>()=>Number(S()),s=S=>(v,T)=>Number(S(BigInt(v),BigInt(T))),c=S=>(v,T,F,U,q,M)=>S(BigInt(v),T,F,U,q,M),f=S=>(v,T,F,U,q)=>S(
v,BigInt(T),F,BigInt(U),q),h=S=>(v,T)=>S(BigInt(v),BigInt(T));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=f(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
h(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.emscripten_stack_get_current),e}async function Ai(){var e=qt,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,ct(n,!0),n}catch(i){return Nr(i)}}function lr(){if(Oe>0){Ve=lr;return}
if(w){Kr();return}if(Wn(),Oe>0){Ve=lr;return}async function e(){if(o.calledRun=!0,!J){Kr(),o.onRuntimeInitialized?.();var r=o.
noInitialRun||!1;r||await Ai(),Vn()}}o.setStatus?(o.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>o.setStatus(""),
1),e()},1)):e()}var Fe;return w||(Yr(),lr()),o}var Gn=1,Nn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
er=new Uint8Array([71,76,85,69]),$r=0,Mi=1,qi=2,Li=3,zi=4,Qi=5,Wi=6,Vi=7,Hi=8,$i=9,Pi=10,In={str:zi,int:qi,float:Li,bool:Mi,
raw:Qi,arr_str:$i,arr_int:Vi,arr_float:Hi,arr_bool:Wi,arr_raw:Pi,null:$r};function Ji(o){let u=0;const d=new DataView(o.
buffer),p=()=>{const V=d.getUint32(u,!0);return u+=4,V},E=()=>{const V=d.getInt32(u,!0);return u+=4,V},b=()=>{const V=d.
getFloat32(u,!0);return u+=4,V},w=()=>p()!==0,N=V=>{const se=V??p(),he=new TextDecoder().decode(o.slice(u,u+se));return u+=
se,he},x=()=>{const V=p(),se=o.slice(u,u+V);return u+=V,se},y=V=>{const se=p(),he=new Array(se);for(let re=0;re<se;re++)
he[re]=V();return he},k=()=>null,G=V=>{switch(V.type){case"str":return N();case"int":return E();case"float":return b();case"\
bool":return w();case"raw":return x();case"arr_str":return y(N);case"arr_int":return y(E);case"arr_float":return y(b);case"\
arr_bool":return y(w);case"arr_raw":return y(x);case"null":return k()}},C=o[0]===er[0]&&o[1]===er[1]&&o[2]===er[2]&&o[3]===
er[3];if(u+=4,!C)throw new Error("Invalid magic number");if(p()!==Gn)throw new Error("Invalid version number");const B=N(
8),W=Nn[B];if(!W)throw new Error(`Unknown message name: ${B}`);const oe={_name:B};for(const V of W.fields){const se=p();
if(se===$r){if(!V.isNullable)throw new Error(`${B}: Expect field ${V.name} to be non-nullable`);oe[V.name]=null;continue}
if(se!==In[V.type])throw new Error(`${B}: Expect field ${V.name} to have type ${V.type}`);oe[V.name]=G(V)}return oe}function Ki(o){
const u=Nn[o._name];if(!u)throw new Error(`Unknown message name: ${o._name}`);const d=[],p=I=>{const B=new ArrayBuffer(4);
new DataView(B).setUint32(0,I,!0),d.push(new Uint8Array(B))},E=I=>{const B=new ArrayBuffer(4);new DataView(B).setInt32(0,
I,!0),d.push(new Uint8Array(B))},b=I=>{const B=new ArrayBuffer(4);new DataView(B).setFloat32(0,I,!0),d.push(new Uint8Array(
B))},w=I=>{p(I?1:0)},N=I=>{const B=new TextEncoder().encode(I);p(B.byteLength),d.push(B)},x=I=>{p(I.byteLength),d.push(I)},
y=(I,B)=>{p(I.length);for(const W of I)B(W)};d.push(er),p(Gn);{const I=new TextEncoder().encode(o._name);d.push(I)}for(const I of u.
fields){const B=o[I.name];if(!I.isNullable&&B==null)throw new Error(`${o._name}: Expect field ${I.name} to be non-nullab\
le`);if(B==null){p($r);continue}switch(p(In[I.type]),I.type){case"str":N(B);break;case"int":E(B);break;case"float":b(B);
break;case"bool":w(B);break;case"raw":x(B);break;case"arr_str":y(B,N);break;case"arr_int":y(B,E);break;case"arr_float":y(
B,b);break;case"arr_bool":y(B,w);break;case"arr_raw":y(B,x);break}}const k=d.reduce((I,B)=>I+B.byteLength,0),G=new Uint8Array(
k);let C=0;for(const I of d)G.set(I,C),C+=I.byteLength;return G}const Fn=4*1024**2,vn=1024*1024;function Xi({files:o,reader:u,
getMemory:d,getSignal:p=()=>{}}){const E=new Map(o.map(b=>[b.name,b]));return async(b,w,N,x)=>{const y=E.get(b.replace(/^\/?models\//,
""));if(!y||![w,N,x].every(G=>Number.isSafeInteger(G)&&G>=0)||w>y.size)throw new Error("Invalid GGUF native file read");
const k=Math.min(N,y.size-w);if(!Number.isSafeInteger(x+k)||x+k>d().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let G=0;G<k;){ue(p());const C=Math.min(Fn,k-G),I=await u.read(y.path,w+G,C,{signal:p()});if(ue(p()),
!(I instanceof Uint8Array)||I.byteLength!==C)throw new Error("Incomplete GGUF artifact range");new Uint8Array(d()).set(I,
x+G),G+=C}return BigInt(k)}}function Yi(o,u){o.FS.mkdir("/models"),o.FS.mount(o.MEMFS,{root:"."},"/models");const d=new Map(
u.map(b=>[b.name,b])),p=o.MEMFS.stream_ops;for(const b of["read","llseek"]){const w=p[b];p[b]=function(N,...x){const y=d.
get(N.node.name);return y&&(N.node.usedBytes=y.size),w.call(this,N,...x)},o.MEMFS.ops_table.file.stream[b]=p[b]}const E=p.
mmap;p.mmap=function(b,...w){if(d.has(b.node.name))throw new Error("GGUF artifact mmap is prohibited");return E.call(this,
b,...w)},o.MEMFS.ops_table.file.stream.mmap=p.mmap;for(const b of u)o.FS_createDataFile("/models",b.name,new Uint8Array(
0),!0,!1,!0)}function Zi(o,u,{collect:d=!1,onLost:p}={}){if(u.device=o,u.runtimeFeatures=[...o.features],u.runtimeAdapter=
o.adapterInfo?{vendor:o.adapterInfo.vendor,architecture:o.adapterInfo.architecture,isFallbackAdapter:o.adapterInfo.isFallbackAdapter??
!1}:null,!o.features.has("shader-f16")||u.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(o.lost.then(x=>p?.(x)),!d)return()=>{};const E=Object.getOwnPropertyDescriptor(o,
"createCommandEncoder"),b=Object.getOwnPropertyDescriptor(o.queue,"submit"),w=o.createCommandEncoder.bind(o),N=o.queue.submit.
bind(o.queue);return o.createCommandEncoder=(...x)=>{const y=w(...x),k=y.beginComputePass.bind(y);return y.beginComputePass=
(...G)=>{const C=k(...G);for(const I of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const B=C[I].bind(C);C[I]=(...W)=>{
const oe=B(...W);return u.dispatches+=1,oe}}return C},y},o.queue.submit=(...x)=>{const y=N(...x);return u.submissions+=1,
y},()=>{E?Object.defineProperty(o,"createCommandEncoder",E):delete o.createCommandEncoder,b?Object.defineProperty(o.queue,
"submit",b):delete o.queue.submit}}function eo(o){const u=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(o);return u?
{gpuLayers:Number(u[1]),totalLayers:Number(u[2])}:null}function ro(o){const u=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(o);return u?{backend:u[1],kind:u[2].toLowerCase(),bytes:Math.round(Number(u[3])*1024**2)}:null}async function to({wasmUrl:o,
weights:u,reader:d,signal:p,collectGpuEvidence:E=!1,onProgress:b,onLost:w,initialize:N=Di}={}){const x=u.map((z,$)=>({...z,
name:`model-${String($+1).padStart(5,"0")}-of-${String(u.length).padStart(5,"0")}.gguf`})),y={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let k=p,G,C,I,B,W;const oe=new Promise((z,$)=>{B=z,W=$}),V=z=>{const $=eo(String(
z));$&&(y.offload=$,b?.({type:"gpu-offload",...$}));const l=ro(String(z));l&&y.buffers.length<32&&(y.buffers.push(l),b?.(
{type:"native-buffer",...l,wasmMemoryBytes:I?.wasmMemory?.buffer.byteLength??0}))},se=z=>{G=new Error(`Model session los\
t: GGUF native runtime failed: ${String(z).slice(0,300)}`),W(G)};I={noInitialRun:!0,pthreadPoolSize:0,locateFile(z){if(z!==
"wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return o},print:V,printErr:V,onAbort:se,onExit:se,
preRun(){I.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){B()},peercomputeOnDevice(z){try{C?.(),C=Zi(z,y,{collect:E,onLost($){
y.lost=!0,w?.($)}})}catch($){z.destroy(),se($.message)}}};const he=Xi({files:x,reader:d,getMemory:()=>I.wasmMemory.buffer,
getSignal:()=>k});N(I,he),await oe,ue(p),Yi(I,x);const re=I.cwrap("wllama_start","string",[],{async:!0}),Z=I.cwrap("wlla\
ma_malloc","bigint",["bigint","number"]),pe=I.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let R=!1;const J=async(z,$,l)=>{
if(R)throw new Error("Concurrent GGUF native calls are prohibited");if(G)throw G;if(y.lost)throw new Error("GPU device l\
ost; GGUF session is unavailable");ue(l),R=!0,k=l;try{const K=Ki($);if(K.byteLength>vn)throw new Error("GGUF native mess\
age exceeds its byte budget");const fe=Number(Z(BigInt(K.byteLength),0)),de=new Uint8Array(I.wasmMemory.buffer);if(!Number.
isSafeInteger(fe)||fe<=0||fe+K.length>de.length)throw new Error("Invalid GGUF input pointer");de.set(K,fe);const ne=Number(
await pe(z,BigInt(fe)));if(G)throw G;const ee=I.wasmMemory.buffer,_e=new DataView(ee).getUint32(fe,!0);if(!Number.isSafeInteger(
ne)||ne<=0||_e>vn||ne+_e>ee.byteLength)throw new Error("Invalid GGUF output buffer");return Ji(new Uint8Array(ee,ne,_e).
slice())}catch(K){throw G??=new Error(`Model session lost: GGUF native action failed: ${String(K.message??K).slice(0,300)}`),
G}finally{R=!1,k=void 0}},ae=JSON.parse(await re());if(G)throw G;if(!ae.success||!y.device)throw new Error("GGUF native \
hardware GPU backend did not initialize");return ue(p),{files:x,action:J,evidence:y,async settleGpu(){try{await y.device.
queue.onSubmittedWorkDone()}catch(z){throw y.lost=!0,G=new Error(`Model session lost: GGUF GPU completion failed: ${String(
z.message??z).slice(0,300)}`),G}},close(){C?.(),y.device?.destroy()},memoryBytes(){return I.wasmMemory.buffer.byteLength}}}
const no=o=>o/2**32|0,ao=o=>o>>>0;function io(o,u,d,p){const E=no(d),b=ao(d);o.setUint32(u,p?b:E,p),o.setUint32(u+4,p?E:
b,p)}function wn(o){return o instanceof Uint8Array||ArrayBuffer.isView(o)&&o.constructor.name==="Uint8Array"&&"BYTES_PER\
_ELEMENT"in o&&o.BYTES_PER_ELEMENT===1}const oo=o=>o?`"${o}" `:"";function An(o,u,d=""){if(wn(o)&&u===void 0)return o;const p=wn(
o),E="",b=p?`length=${o.length}`:`type=${typeof o}`,w=oo(d)+"expected Uint8Array"+E+", got "+b;throw p?new RangeError(w):
new TypeError(w)}const so=(o,u)=>{if(o===null||typeof o!="object"||Array.isArray(o))throw new TypeError((u==="object"?"":
`"${u}" `)+"expected object, got type="+typeof o)},yn=(o,u)=>{so(o,u);const d=Object.getPrototypeOf(o);if(d!==Object.prototype&&
d!==null)throw new TypeError(`"${u}" expected plain object`);if(Object.hasOwn(o,"__proto__"))throw new TypeError(`"${u}.\
__proto__" is not allowed`)};function En(o,u=!0){if(o.destroyed)throw new Error("hash was destroyed");if(u&&o.finished)throw new Error(
"digest() was already called")}function co(o,u){An(o,void 0,"output");const d=u.outputLen;if(!(o.length>=d))throw new RangeError(
'"output" expected length >= '+d)}function kn(...o){for(let u=0;u<o.length;u++)o[u].fill(0)}function zr(o){return new DataView(
o.buffer,o.byteOffset,o.byteLength)}function Ne(o,u){return o<<32-u|o>>>u}function lo(o,u,d="opts"){return yn(o,"default\
s"),u!==void 0&&yn(u,d),Object.assign(Object.create(null),o,u)}function uo(o,u={}){if(typeof o!="function")throw new TypeError(
'"hashCons" expected function, got type='+typeof o);u=lo({},u,"info");const d=(E,b)=>o(b).update(E).digest(),p=o(void 0);
return d.outputLen=p.outputLen,d.blockLen=p.blockLen,d.canXOF=p.canXOF,d.create=E=>o(E),Object.assign(d,u),Object.freeze(
d)}const fo=o=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,o])});function mo(o,u,d){return o&u^~o&d}function po(o,u,d){
return o&u^o&d^u&d}class go{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(u,d,p,E){
this.blockLen=u,this.outputLen=d,this.padOffset=p,this.isLE=E,this.buffer=new Uint8Array(u),this.view=zr(this.buffer)}update(u){
En(this),An(u);const{view:d,buffer:p,blockLen:E}=this,b=u.length;let w=!1;for(let N=0;N<b;){const x=Math.min(E-this.pos,
b-N);if(x===E){const y=zr(u);for(;E<=b-N;N+=E)this.process(y,N);w=!0;continue}p.set(N===0&&x===b?u:u.subarray(N,N+x),this.
pos),this.pos+=x,N+=x,this.pos===E&&(this.process(d,0),this.pos=0,w=!0)}return this.length+=u.length,w&&this.roundClean(),
this}digestInto(u){En(this),co(u,this),this.finished=!0;const{buffer:d,view:p,blockLen:E,isLE:b}=this;let{pos:w}=this;d[w++]=
128,d.fill(0,w),this.padOffset>E-w&&(this.process(p,0),d.fill(0)),io(p,E-8,this.length*8,b),this.process(p,0),this.roundClean();
const N=u===d?p:zr(u),x=this.outputLen,y=x/4,k=this.get();if(x%4||y>k.length)throw new Error("invalid outputLen");for(let G=0;G<
y;G++)N.setUint32(4*G,k[G],b)}digest(){const{buffer:u,outputLen:d}=this;this.digestInto(u);const p=u.slice(0,d);return this.
destroy(),p}_cloneIntoMeta(u){const{buffer:d,length:p,finished:E,destroyed:b,pos:w}=this;return u.destroyed=b,u.finished=
E,u.length=p,u.pos=w,w&&u.buffer.set(d),u}clone(){return this._cloneInto()}}const ho=Uint32Array.from([1779033703,3144134277,
1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),bo=Uint32Array.from([1116352408,1899447441,3049323471,
3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,
3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,
3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,
883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,
3329325298]),Re=new Uint32Array(64);class _o extends go{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(u,d){super(64,u,8,!1),
this.A=d[0]|0,this.B=d[1]|0,this.C=d[2]|0,this.D=d[3]|0,this.E=d[4]|0,this.F=d[5]|0,this.G=d[6]|0,this.H=d[7]|0}get(){const{
A:u,B:d,C:p,D:E,E:b,F:w,G:N,H:x}=this;return[u,d,p,E,b,w,N,x]}set(u,d,p,E,b,w,N,x){this.A=u|0,this.B=d|0,this.C=p|0,this.
D=E|0,this.E=b|0,this.F=w|0,this.G=N|0,this.H=x|0}_cloneInto(u){return(u||=new this.constructor).set(...this.get()),this.
_cloneIntoMeta(u)}process(u,d){for(let G=0;G<16;G++,d+=4)Re[G]=u.getUint32(d,!1);for(let G=16;G<64;G++){const C=Re[G-15],
I=Re[G-2],B=Ne(C,7)^Ne(C,18)^C>>>3,W=Ne(I,17)^Ne(I,19)^I>>>10;Re[G]=W+Re[G-7]+B+Re[G-16]|0}let{A:p,B:E,C:b,D:w,E:N,F:x,G:y,
H:k}=this;for(let G=0;G<64;G++){const C=Ne(N,6)^Ne(N,11)^Ne(N,25),I=k+C+mo(N,x,y)+bo[G]+Re[G]|0,W=(Ne(p,2)^Ne(p,13)^Ne(p,
22))+po(p,E,b)|0;k=y,y=x,x=N,N=w+I|0,w=b,b=E,E=p,p=I+W|0}p=p+this.A|0,E=E+this.B|0,b=b+this.C|0,w=w+this.D|0,N=N+this.E|
0,x=x+this.F|0,y=y+this.G|0,k=k+this.H|0,this.set(p,E,b,w,N,x,y,k)}roundClean(){kn(Re)}destroy(){this.destroyed=!0,this.
set(0,0,0,0,0,0,0,0),kn(this.buffer)}}class vo extends _o{constructor(){super(32,ho)}}const wo=uo(()=>new vo,fo(1)),ie=Object.
freeze({maximumBytes:16*1024**3,headerBytes:16*1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,
stringBytes:1024**2}),Tn=Object.freeze(Ri("llama.cpp").map(o=>o.architecture)),Cn="peercompute.gguf.header.v1",yo="3.8.1",
Wr=new Map([[0,["F32",1,4]],[1,["F16",1,2]],[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],
[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,
210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],
[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),mr=new Map([[0,"f32"],[1,"f\
16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q\
4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[
23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),
Eo=new TextDecoder("utf-8",{fatal:!0}),ko=o=>Array.from(o,u=>u.toString(16).padStart(2,"0")).join(""),Q=o=>new Error(`Un\
supported GGUF Hub package: ${o}`);function be(o,u,d,p=0){if(!Number.isSafeInteger(o)||o<p||o>u)throw Q(`invalid ${d}`);
return o}class So extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function xo(o,{
size:u}={}){if(!(o instanceof Uint8Array))throw Q("header bytes required");if(be(u,ie.maximumBytes,"file size",24),o.length>
ie.headerBytes||o.length>u)throw Q("header byte budget exceeded");const d=new DataView(o.buffer,o.byteOffset,o.byteLength);
let p=0;function E(R){if(be(R,ie.headerBytes,"header field length"),p+R>ie.headerBytes)throw Q("header byte budget excee\
ded");if(p+R>o.length)throw new So;const J=p;return p+=R,J}const b=()=>d.getUint32(E(4),!0),w=()=>{const R=d.getBigUint64(
E(8),!0);if(R>BigInt(Number.MAX_SAFE_INTEGER))throw Q("unsafe 64-bit value");return Number(R)};function N(R=ie.stringBytes,J=!0){
const ae=be(w(),R,"string length"),z=E(ae);return J?Eo.decode(o.subarray(z,z+ae)):void 0}function x(R,J=!0,ae=!1){if(R===
8)return N(ie.stringBytes,J);if(R===9){if(ae)throw Q("nested metadata arrays");const K=b(),fe=be(w(),ie.arrayItems,"arra\
y count");if(K===9||K>12)throw Q("metadata array type");if(K===8)for(let de=0;de<fe;de++)N(ie.stringBytes,!1);else E(fe*
[1,1,2,2,4,4,4,1,0,0,8,8,8][K]);return{array:!0,element:K,count:fe}}const z=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!z[R])throw Q(
"metadata value type");const $=E(z[R]);if(!J)return;if(R===0)return d.getUint8($);if(R===1)return d.getInt8($);if(R===2)
return d.getUint16($,!0);if(R===3)return d.getInt16($,!0);if(R===4)return d.getUint32($,!0);if(R===5)return d.getInt32($,
!0);if(R===6)return d.getFloat32($,!0);if(R===7){const K=d.getUint8($);if(K>1)throw Q("boolean value");return!!K}if(R===
12)return d.getFloat64($,!0);const l=R===10?d.getBigUint64($,!0):d.getBigInt64($,!0);if(l>BigInt(Number.MAX_SAFE_INTEGER)||
l<BigInt(Number.MIN_SAFE_INTEGER))throw Q("unsafe metadata integer");return Number(l)}if(b()!==1179993927)throw Q("magic\
 or byte order");const y=b();if(![2,3].includes(y))throw Q("version");const k=be(w(),ie.tensors,"tensor count",1),G=be(w(),
ie.metadata,"metadata count",1),C=new Map;for(let R=0;R<G;R++){const J=N(512);if(!J||C.has(J)||/[\u0000-\u001f\u007f]/u.
test(J))throw Q("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.test(J))throw Q("cu\
stom tensor layout requires catalog review");const ae=b(),z=["general.architecture","general.type","general.file_type","\
general.alignment","general.name","general.quantization_version","split.count","split.no","split.tensors.count","tokeniz\
er.ggml.model","tokenizer.ggml.tokens"].includes(J);C.set(J,x(ae,z))}const I=C.get("general.architecture");if(!Tn.includes(
I))throw Q("architecture");if(C.has("general.type")&&C.get("general.type")!=="model")throw Q("adapter or non-model GGUF");
if(/georefine/i.test(C.get("general.name")??""))throw Q("custom GeoRefine model requires catalog review");if((C.get("spl\
it.count")??1)!==1||(C.get("split.no")??0)!==0||(C.get("split.tensors.count")??k)!==k)throw Q("split GGUF requires compl\
ete shard admission");if(![void 0,2].includes(C.get("general.quantization_version")))throw Q("quantization version");const B=C.
get("general.file_type");if(!mr.has(B))throw Q("file quantization type");if(!["llama","gpt2"].includes(C.get("tokenizer.\
ggml.model"))||C.get("tokenizer.ggml.tokens")?.element!==8||!C.get("tokenizer.ggml.tokens")?.count)throw Q("self-contain\
ed supported tokenizer required");const W=be(C.get("general.alignment")??32,4096,"alignment",1);if(W&W-1)throw Q("alignm\
ent must be a power of two");const oe=new Set,V=new Set,se=[];let he=0;for(let R=0;R<k;R++){const J=N(512);if(!J||oe.has(
J)||/georefine|[\u0000-\u001f\u007f]/iu.test(J))throw Q("duplicate or custom tensor name");oe.add(J);const ae=be(b(),4,"\
tensor dimensions",1);let z=1,$=0;for(let ne=0;ne<ae;ne++){const ee=be(w(),ie.maximumBytes,"tensor dimension",1);ne===0&&
($=ee),z*=ee,be(z,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const l=b(),K=Wr.get(l);if(!K||$%K[1])throw Q("unsup\
ported tensor codec or quantized row shape");const fe=be(z/K[1]*K[2],u,"tensor bytes",1),de=w();if(de%W||de+fe>u)throw Q(
"tensor offset exceeds file or alignment");se.push({start:de,end:de+fe}),V.add(l),he=Math.max(he,fe)}if(!oe.has("token_e\
mbd.weight")||!oe.has("output_norm.weight"))throw Q("text model tensor layout");const re=p,Z=Math.ceil(p/W)*W;se.sort((R,J)=>R.
start-J.start);let pe=0;for(const R of se){if(R.start<pe||Z+R.end>u)throw Q("overlapping or truncated tensor data");pe=R.
end}return{schema:Cn,version:y,architecture:I,fileType:B,dtype:mr.get(B),tensorCount:k,metadataCount:G,headerBytes:re,dataOffset:Z,
maximumTensorBytes:he,tensorTypes:[...V].sort((R,J)=>R-J),headerSha256:ko(wo(o.subarray(0,re)))}}async function Bo({readRange:o,
size:u,signal:d}={}){if(typeof o!="function")throw Q("range reader required");be(u,ie.maximumBytes,"file size",24);let p=new Uint8Array(
0),E=Math.min(64*1024,u);for(;;){ue(d);const b=new Uint8Array(E);b.set(p);for(let w=p.length;w<E;){const N=Math.min(ie.rangeBytes,
E-w),x=await o(w,N,{signal:d});if(ue(d),!(x instanceof Uint8Array)||x.length!==N)throw Q("truncated range response");b.set(
x,w),w+=N}p=b;try{return xo(p,{size:u})}catch(w){if(w.code!=="ERR_GGUF_HEADER_TRUNCATED"||E===u)throw w;if(E===ie.headerBytes)
throw Q("header exceeds bounded probe");E=Math.min(E*2,u,ie.headerBytes)}}}function Go(o){if(!o||o.schema!==Cn||![2,3].includes(
o.version)||!Tn.includes(o.architecture)||!mr.has(o.fileType)||mr.get(o.fileType)!==o.dtype||!/^[a-f0-9]{64}$/.test(o.headerSha256??
""))throw Q("header profile");for(const[d,p]of[["tensorCount",ie.tensors],["metadataCount",ie.metadata],["headerBytes",ie.
headerBytes],["dataOffset",ie.headerBytes+4096],["maximumTensorBytes",ie.maximumBytes]])be(o[d],p,d,1);if(o.dataOffset<o.
headerBytes||!Array.isArray(o.tensorTypes)||!o.tensorTypes.length||o.tensorTypes.length>Wr.size||o.tensorTypes.some((d,p)=>!Wr.
has(d)||p>0&&d<=o.tensorTypes[p-1]))throw Q("tensor profile");const u=["schema","version","architecture","fileType","dty\
pe","tensorCount","metadataCount","headerBytes","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.
keys(o).some(d=>!u.includes(d)))throw Q("unexpected header profile field");return Object.fromEntries(u.map(d=>[d,o[d]]))}
function No({repository:o,revision:u,file:d,header:p}={}){if(typeof o!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.
test(o)||!/^[a-f0-9]{40}$/.test(u??""))throw Q("immutable Hugging Face repository/revision required");if(Ui(d?.path),!d.
path.endsWith(".gguf")||!/^[a-f0-9]{64}$/.test(d.sha256??""))throw Q("pinned GGUF SHA-256 required");be(d.size,ie.maximumBytes,
"weight size",24);const E=Go(p);if(E.dataOffset+E.maximumTensorBytes>d.size)throw Q("header/file size mismatch");const b=d.
size>4*1024**3;return{model:{runtime:"llama.cpp",runtimeVersion:yo,architecture:E.architecture==="qwen35"?"qwen3_5":E.architecture,
format:"GGUF",task:"text-generation",dtype:E.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:o,revision:u,
gguf:{...E,path:d.path,size:d.size,sha256:d.sha256}},weights:[d],totalBytes:d.size,resourcePolicy:{maxModelBytes:ie.maximumBytes,
minimumCpuBytes:(b?8:2)*1024**3,minimumGpuBytes:(b?16:2)*1024**3}}}function Un(o,{files:u,totalBytes:d}={}){if(!o?.gguf)
throw Q("bounded header profile required");const{path:p,size:E,sha256:b,...w}=o.gguf,N=No({repository:o.repository,revision:o.
revision,file:{path:p,size:E,sha256:b},header:w});for(const x of["runtime","runtimeVersion","architecture","format","tas\
k","dtype"])if(o[x]!==N.model[x])throw Q(`model ${x} disagrees with header`);if(JSON.stringify(o.modalities)!=='["text"]'||
JSON.stringify(o.requiredFeatures)!=='["shader-f16"]')throw Q("text-only/f16 capability profile required");if(u){const x=u.
filter(y=>y.path.endsWith(".gguf"));if(x.length!==1||x[0].path!==p||x[0].size!==E||x[0].sha256!==b||u.some(y=>!/^[a-f0-9]{64}$/.
test(y.sha256??"")))throw Q("file closure/digest mismatch");N.weights=x,d=u.reduce((y,k)=>y+k.size,0)}return N.totalBytes=
be(d??E,ie.maximumBytes,"package bytes",E),N}async function Io(o,u,d,{signal:p}={}){if(!o.gguf)return;const E=Un(o,{files:u}).
model.gguf,b=await Bo({size:u[0].size,signal:p,readRange:(k,G,C)=>d.read(u[0].path,k,G,C)}),{path:w,size:N,sha256:x,...y}=E;
if(JSON.stringify(b)!==JSON.stringify(y))throw Q("stored header does not match inspected package")}const Fo="ERR_MODEL_C\
ONTEXT_BUDGET",pr=1;function Ao(o,u,d){return Object.assign(new Error(`The model context holds ${u} tokens; instructions\
 and the current prompt need ${o}, plus ${d} reserved for the reply. Shorten the current prompt or saved context, or req\
uest a shorter reply.`),{code:Fo})}function To(o){const u=o.findIndex(p=>p.role==="user"),d=o.findIndex((p,E)=>E>u&&p.role===
"user");return u<0||d<0?null:o.filter((p,E)=>E<u||E>=d||p.role==="system")}async function Co({messages:o,contextTokens:u,
reservedOutputTokens:d,measure:p,signal:E,onMeasured:b}){if(!Number.isSafeInteger(u)||u<1||!Number.isSafeInteger(d)||d<1)
throw new Error("Invalid GGUF context budget");let w=o.map(k=>({...k})),N=0,x=0;const y=Math.max(1,o.filter(k=>k.role===
"user").length);for(let k=1;k<=y;k+=1){ue(E);const G=await p(w);if(ue(E),!Number.isSafeInteger(G.inputTokens)||G.inputTokens<
0||!Number.isSafeInteger(G.contextTokens)||G.contextTokens<1||G.contextTokens>u||!Number.isSafeInteger(G.probeOutputTokens)||
G.probeOutputTokens<0||G.probeOutputTokens>pr)throw new Error("Invalid GGUF context measurement");x+=G.probeOutputTokens;
const C={contextTokens:G.contextTokens,inputTokens:G.inputTokens,reservedOutputTokens:d,removedTurns:N,preflightCalls:k,
measurementTokens:x,probeTokenBudget:pr},I=G.inputTokens>=G.contextTokens||G.inputTokens+d>G.contextTokens;if(b?.({...C,
probeOutputTokens:G.probeOutputTokens,overflow:I}),ue(E),!I)return{messages:w,contextTruncated:N>0,contextBudget:C};const B=To(
w);if(!B)throw Ao(G.inputTokens,G.contextTokens,d);w=B,N+=1}throw new Error("GGUF context fitting exceeded its bounded a\
ttempts")}const Ke="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Xe="5ce3fd841676adf2c1a10d7193637d46007e88f\
7",Sn=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,
gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482e\
aa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635\
e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c9\
5508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_tem\
plate.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"\
706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefee\
e3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"\
verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Uo="This catalog supports verifie\
d storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog aft\
er browser capability and resource checks.";function Rn(o){for(const u of Object.values(o))u&&typeof u=="object"&&Rn(u);
return Object.freeze(o)}const Ro=Rn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8\
 27B GeoRefine D14 (mixed GGUF)",repository:Ke,revision:Xe,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Uo},license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Ke}/blob/${Xe}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable ar\
tifact provenance."},provenance:{repository:Ke,revision:Xe,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`ht\
tps://huggingface.co/${Ke}/blob/${Xe}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{runtime:"llama.cpp",
architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4\
_K","Q5_K","F32"],repository:Ke,revision:Xe},weightBytes:14199740480,totalBytes:Sn.reduce((o,u)=>o+u.size,0),files:Sn}});
function On(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.values(o).forEach(On),Object.freeze(o)),o}const Oo=[
{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",repository:"bowm\
anslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",dtype:"q5_k_m",sourceModel:{repository:"\
bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:32,nextnPredictLayers:0,
behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile resp\
onses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context beh\
avior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-Q5_K_M.gguf",size:6467969824,sha256:"bff5a5dbf8ba472d65c0626b0\
f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README.md",size:4013,sha256:"825f21663874cbfa09dbb791849ff9c7f233a04331\
7f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7274149e70cfd0dc7940d87",source:{repository:"bowmanslayer/Qwen3.5-\
9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"\
bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"\
LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"\
1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"953168\
9a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7\
b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmans\
layer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"EVALUATION.md"}}]},{id:"qwe\
n3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwen3.5 9B Claude HighIQ Thinking Heretic (DavidAU via mradermacher Q4_\
K_M, text)",repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce6\
5b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HE\
RETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808"},blockCount:32,nextnPredictLayers:0,behavior:{kind:"\
heretic",notice:"Publisher-described heretic fine-tune; not a guarantee of refusal-free output or factual accuracy. This\
 is mradermacher's GGUF conversion of the requested DavidAU source. The browser adapter currently runs text only."},files:[
{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",size:5627045888,sha256:"b16f38d00a26d9d1eeb\
191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"README.md",size:5730,sha256:"eea5e514740c521432aec62a2d416ade44f8\
81e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e17cf35bea52a3a2d74e42b14a24a",source:{repository:"mradermacher/Qw\
en3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",path:"R\
EADME.md"}},{path:"SOURCE_README.md",size:79602,sha256:"0afc6c4508d99e8966cfd6164d6a3ea924c6781c97319223170c5c2f0abdef76",
gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING\
-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"\
bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",
source:{repository:"Qwen/Qwen3.5-9B",revision:"c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"LICENSE"}}]},{id:"qwen3.5\
-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q8_0, experimental text)",repository:"mraderma\
cher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",sourceModel:{repository:"\
bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,
behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and potentially hostile resp\
onses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision and long-context beh\
avior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e2315cbfae6702932ed243\
2435f5714e675bc670954bf6c05aa32303b07e7247"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b3\
7271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3\
.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,
sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef\
5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"\
README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"\
f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d6786\
9ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-\
9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"\
caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUAT\
ION.md"}}]},{id:"qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q4_K_M, experimental\
 text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q\
4_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},
blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability \
damage and potentially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; th\
inking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q4_K_M.gguf",size:5780091392,
sha256:"cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"README.md",size:4035,sha256:"2d11817c7\
5831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{
repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},
{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"\
defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13\
af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570\
a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwe\
n3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"\
86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},
{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"0\
1597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13a\
f75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],jo=On(Object.fromEntries(Oo.map(o=>{const{dtype:u,sourceModel:d,blockCount:p,
nextnPredictLayers:E,...b}=o,N=b.files.find(x=>x.path==="LICENSE").source;return[b.id,{...b,status:"execution-candidate",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"\
candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/\
JSPI and memory admission. These exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"\
https://huggingface.co/"+N.repository+"/blob/"+N.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversio\
n/source cards and available modification notices are included."},provenance:{repository:b.repository,revision:b.revision,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/"+b.repository+"/blob/"+b.revision+"/R\
EADME.md",sourceModel:{...d,revisionPurpose:"Pinned source documentation and license reference; the converter does not i\
dentify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{
version:3,architecture:"qwen35",blockCount:p,nextnPredictLayers:E,inspectedPrefixBytes:65536},vision:"Upstream vision me\
tadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter re\
jects images.",behavior:b.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"\
GGUF",task:"text-generation",dtype:u,modalities:["text"],requiredFeatures:["shader-f16"],repository:b.repository,revision:b.
revision},weightBytes:b.files[0].size,totalBytes:b.files.reduce((x,y)=>x+y.size,0)}]})));function Pr(o){return o&&typeof o==
"object"&&!Object.isFrozen(o)&&(Object.values(o).forEach(Pr),Object.freeze(o)),o}const Ae="Tsotchke-Corporation",jn=[{id:"\
qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${Ae}\
/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",architecture:"qwen3_moe",
quantizationTypes:["F32","Q8_0","Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-Coder-30B-A3B-Instruct-ab\
literated",revision:"b84c58d52ac44041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimental lossy mixed quantizat\
ion of an abliterated parent. Behavioral quality, SAE certification and runtime qualification are untested.",files:[{path:"\
.gitattributes",size:1609,gitBlobSha1:"3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LICENSE",size:11343,gitBlobSha1:"\
6634c8cc3133b3848ec74b9f275acaaa1ea618ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ece140e83416522e0d00b53880e8bb13"},
{path:"Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"2f005a4633b7783c4cdf8e924a0d9ddae\
28efd7a4d4812d3d94ea97c57aabf51"},{path:"README.md",size:2765,gitBlobSha1:"00227290350d0484631d06756736f4dff2e8bd66"},{path:"\
artifact-manifest.json",size:7659,gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6e5d05"},{path:"chat_template.jinja",size:6853,
gitBlobSha1:"3656cd64ff2fcc6ae59312eb87a709e0aa25b2eb"},{path:"config.json",size:1065,gitBlobSha1:"5288c67c42b574d39f790\
e6bf8836f57ec477483"},{path:"generation_config.json",size:235,gitBlobSha1:"f1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"\
tokenizer_config.json",size:5644,gitBlobSha1:"b2cbe86ae45a1274c9b93ec060466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,
gitBlobSha1:"57027eb456280780650ef6bc44524b396734cbcf"}]},{id:"qwen3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B\
 GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${Ae}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f38\
5b4ae408eeb81def3013bf2e5ac671898b95",architecture:"qwen3_5_moe",quantizationTypes:["F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],
sourceModel:{repository:"ericpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-bf16",revision:"f6ab91b5bdc2a7e7e1a1e\
2263c98a409509c79ed"},publisherLimitations:"The publisher records a failed coding-quality gate and no complete capabilit\
y certificate. Its internal qLLM Metal gguf-c20 runtime is not a public portable-runtime qualification; a public pinned \
clean-machine recipe remains unverified. This is not the GeoRefine TBE codec.",files:[{path:".gitattributes",size:1699,gitBlobSha1:"\
f44e4e63e69c8b9a20797fd820049ea27bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,gitBlobSha1:"3cb693fce32249c21d7a62106\
0df41dbf5df64a9"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:465,
gitBlobSha1:"4852a35fe237eb4335504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,
sha256:"027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce911c96"},{path:"README.md",size:4914,gitBlobSha1:"601a\
361b4a8308e9121749810fb103b644c581c1"},{path:"artifact-manifest.json",size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a\
008315f8a1a9f"},{path:"config.json",size:3148,gitBlobSha1:"09981f690fa954e74c4ae3d66163bb68435d14ca"},{path:"generation_\
config.json",size:243,gitBlobSha1:"be05abc6b17ea7880b71c67d31f7264f92c34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"\
1838f3b7f5e64b0f32abbd98181ea3ca8b3abfbc"},{path:"tokenizer.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44b\
ab368d488499115adfea19ff992d9ac7"},{path:"tokenizer_config.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc9\
8dd7fc6ec"},{path:"verify_c20.py",size:886,gitBlobSha1:"2ba7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-ge\
orefine-l162-gguf",name:"Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${Ae}/Qwen3.8-27B-Geo\
Refine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32",
"Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f\
6c238ce1e5b70008612ae42cdd"},publisherLimitations:"Experimental lossy mixed quantization; behavioral quality and runtime\
 qualification are untested. Q4_K_M_CUSTOM labels a custom allocation of standard GGUF tensor types, not a custom codec \
or the standard llama.cpp Q4_K_M allocation recipe. The inherited Q8_0 header label does not describe the tensor mix.",files:[
{path:".gitattributes",size:1694,gitBlobSha1:"f41c1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"\
80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},
{path:"Qwen3.8-27B-GeoRefine-L162-abl-MIXED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358\
d27e5678ce8b4f73643d91111cbc223fd"},{path:"README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},
{path:"artifact-manifest.json",size:5897,gitBlobSha1:"fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.ji\
nja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706ceb\
d746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172\
f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"ver\
ify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}]}],Do=Pr(Object.fromEntries(jn.map(o=>{
const{architecture:u,quantizationTypes:d,sourceModel:p,publisherLimitations:E,...b}=o;return[o.id,{...b,status:"executio\
n-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16 and browser/resource admissio\
n. These exact artifacts are not hardware-qualified; current file and runtime byte limits still apply."},license:{spdx:"\
Apache-2.0",sourceUrl:`https://huggingface.co/${o.repository}/blob/${o.revision}/LICENSE`,notice:"Preserve the included \
LICENSE, NOTICE, model card and pinned publisher manifests."},provenance:{repository:o.repository,revision:o.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https://huggingface.co/${o.repository}/blob/${o.revision}/README.md`,
sourceManifestPath:"artifact-manifest.json",sourceModel:p,publisherLimitations:E,codecRequired:!1,tensorFormatEvidence:"\
Pinned publisher GGUF tensor census; no model payload was downloaded for catalog admission.",vision:"The managed GGUF ad\
apter is text-only; upstream vision metadata does not establish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:u,format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:d,modalities:["text"],requiredFeatures:[
"shader-f16"],repository:o.repository,revision:o.revision},weightBytes:o.files.filter(w=>w.path.endsWith(".gguf")).reduce(
(w,N)=>w+N.size,0),totalBytes:o.files.reduce((w,N)=>w+N.size,0)}]})));Pr({organization:Ae,sourceUrl:`https://huggingface\
.co/${Ae}`,checkedAt:"2026-11-04",repositories:[...jn.map(({id:o,repository:u,revision:d})=>({repository:u,revision:d,catalogId:o,
format:"GGUF",codecRequired:!1})),{repository:`${Ae}/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10\
d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefine-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Ae}/Qwen3\
.8-27B-GeoRefine-Context`,revision:"c725e6920301a405849b9e373503553789e0d39b",format:"bitexact-predictive-context-packag\
e-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX tensors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Ae}\
/Qwen3.8-27B-GeoRefine-Context-abliterated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predict\
ive-context-package-v1",codecRequired:!0,exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 pare\
nt before ordinary Transformers loading."},{repository:`${Ae}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1\
dae3db1847bf33bdd45",format:"georefine.tbe.serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec\
 containers, requiring GeoRefine TBE or full BF16 export."}]});const Ye="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ze="f36b1ea49\
a332ede8fe5f389bbf5b3575ef71f48",Qr=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c9057\
81334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f8\
25c6f5d"}],Vr=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"\
candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and expl\
icit memory admission. Actual model execution must be verified on the selected device."});function Dn(o){return o&&typeof o==
"object"&&!Object.isFrozen(o)&&(Object.values(o).forEach(Dn),Object.freeze(o)),o}const Mo=Object.fromEntries([{id:"qwen3\
-0.6b-abliterated-q4-k-m-gguf",name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliter\
ated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated\
.q4_k_m.gguf",size:396704896,sha256:"a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",
size:2525,sha256:"bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f71039799\
38cc420c932911dbb",source:{repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a\
68e144e",path:"README.md"}},{path:"LICENSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7d9483f310cd\
292e92e",gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"c1899de28\
9a04d12100db370d81485cdf75e47ca",path:"LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.8B Ablite\
rated (GGUF Q4_K_M, text)",repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804a\
b6122f119",architecture:"qwen3_5",files:[{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"eef9cbce1e8\
dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678ef4472737\
b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"xdchinz\
a/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LICENSE",
size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087\
f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LIC\
ENSE"}}]}].map(({architecture:o,...u})=>[u.id,Dn({...u,status:"execution-candidate",format:"GGUF",capabilities:Vr,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${u.files[2].source.repository}/blob/${u.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:u.
repository,revision:u.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${u.repository}\
/blob/${u.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:o,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:u.repository,revision:u.revision},weightBytes:u.files[0].size,totalBytes:u.files.reduce((d,p)=>d+p.size,
0)})])),xn=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:Ye,revision:Ze,status:"execution-candidate",format:"GGUF",capabilities:Vr,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Ye}/blob/${Ze}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:Ye,revision:Ze,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${Ye}/blob/${Ze}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Ye,revision:Ze},weightBytes:Qr[0].size,totalBytes:Qr.
reduce((o,u)=>o+u.size,0),files:Qr},...Mo,...jo,...Do,...Object.fromEntries(Object.entries(Ro).map(([o,u])=>[o,{...u,status:"\
execution-candidate",capabilities:Vr}]))}),Mn="3.8.1",Hr=2048,De=1024**3;function qn(o){const u=ji(o),d=u.model,p=Object.
values(xn).filter(y=>y.model.runtime==="llama.cpp"&&y.repository===d?.repository&&y.revision===d?.revision&&y.model.architecture===
d?.architecture&&y.model.task===d?.task&&y.model.dtype===d?.dtype),E=p.length===1?p[0]:void 0;if(!E&&d?.gguf){const y=Un(
d,{files:u.files});for(const k of Object.values(xn))if(!(k.repository!==d.repository||k.revision!==d.revision))for(const G of k.
files.filter(C=>C.path.endsWith(".gguf"))){const C=y.weights.find(I=>I.path===G.path);if(C&&(C.size!==G.size||C.sha256!==
G.sha256))throw new Error("GGUF weights do not match the pinned catalog digests")}return{...y,manifest:u}}if(!E||d.runtime!==
"llama.cpp"||d.runtimeVersion!==void 0&&d.runtimeVersion!==Mn||E.model.runtimeVersion!==void 0&&d.runtimeVersion!==E.model.
runtimeVersion||d.dtype!==E.model.dtype||d.format!=="GGUF"||d.task!=="text-generation")throw new Error("GGUF model revis\
ion is not in the trusted runtime catalog");const b=u.files.filter(y=>y.path.endsWith(".gguf")),w=E.files.filter(y=>y.path.
endsWith(".gguf"));if(!b.length||b.length!==w.length||b.some(y=>!w.some(k=>k.path===y.path&&k.size===y.size&&k.sha256===
y.sha256)))throw new Error("GGUF weights do not match the pinned catalog digests");const N=u.files.reduce((y,k)=>y+k.size,
0);if(!Number.isSafeInteger(N)||N>16*De)throw new Error("GGUF package exceeds its byte budget");const x=b.reduce((y,k)=>y+
k.size,0)>4*De;return{manifest:u,weights:b,totalBytes:N,resourcePolicy:{maxModelBytes:16*De,minimumCpuBytes:x?8*De:2*De,
minimumGpuBytes:x?16*De:2*De}}}function Ln(o,u=globalThis.location?.href){const d=new URL(u);if(!o||Object.keys(o).some(
E=>E!=="wasm")||typeof o.wasm!="string")throw new Error("GGUF runtime needs one trusted WASM asset");const p=new URL(o.wasm,
d);if(p.origin!==d.origin||!["http:","https:"].includes(p.protocol)||p.username||p.password||p.search||p.hash||!p.pathname.
endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fixed same-origin asset");return{wasm:p.href}}function zn(o={}){
if(!o||typeof o!="object"||Array.isArray(o)||Object.keys(o).some(d=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(
d)))throw new Error("Unknown GGUF runtime option");const u={n_ctx:Hr,n_batch:64,n_gpu_layers:99999,n_threads:1,...o};if(!Number.
isInteger(u.n_ctx)||u.n_ctx<64||u.n_ctx>Hr||!Number.isInteger(u.n_batch)||u.n_batch<1||u.n_batch>128||!Number.isInteger(
u.n_gpu_layers)||u.n_gpu_layers<1||u.n_gpu_layers>99999||u.n_threads!==1)throw new Error("GGUF options exceed the manage\
d GPU runtime bounds");return Object.freeze(u)}async function qo({scope:o=globalThis,gpu:u=o.navigator?.gpu}={}){if(!o.crossOriginIsolated||
!o.SharedArrayBuffer)throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const d=o.WebAssembly;
if(typeof d?.Suspending!="function"||typeof d?.promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{
new d.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly me\
mory64")}const p=await u?.requestAdapter({powerPreference:"high-performance"});if(!p||p.isFallbackAdapter||p.info?.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!p.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:p.info?.vendor??"",architecture:p.info?.architecture??
"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const Lo=Object.freeze({id:"\
llama.cpp",moduleUrl:"peercompute:gguf-inference",validateManifest:qn,validateRuntimeAssets:Ln,validateRuntimeOptions:zn,
retainArtifactBridge:!0,terminateOnUnload:!0,validateGenerationInput({image:o,maxNewTokens:u}){if(o)throw new Error("Thi\
s GGUF adapter currently accepts text only");if(!Number.isInteger(u)||u<1||u>fr.maxNewTokens)throw new Error("GGUF outpu\
t exceeds its token budget")}}),dr=o=>new TextEncoder().encode(o).byteLength;function zo(o){if(!o.data_json||o.data_json===
"null")return[];if(typeof o.data_json!="string"||dr(o.data_json)>1024*1024)throw new Error("GGUF result exceeds its byte\
 budget");let u;try{u=JSON.parse(o.data_json)}catch{throw new Error("GGUF returned invalid result JSON")}const d=Array.isArray(
u)?u:[u];if(d.some(p=>!p||typeof p!="object"||Array.isArray(p)))throw new Error("GGUF returned invalid result data");return d}
function Qo(o,u){const d=o[0],p=d?.error??d,E=p?.n_prompt_tokens??d?.n_prompt_tokens,b=p?.n_ctx??d?.n_ctx;if(p?.type==="\
exceed_context_size_error"&&Number.isSafeInteger(E)&&E>=b&&Number.isSafeInteger(b)&&b>0&&b<=u)return Object.assign(new Error(
"GGUF native prompt exceeds the model context"),{code:"ERR_GGUF_NATIVE_CONTEXT",inputTokens:E,contextTokens:b});const w=p?.
type==="invalid_request_error";return Object.assign(new Error(w?"GGUF rejected the inference request":"GGUF native infer\
ence failed"),{code:w?"ERR_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE_FAILURE"})}function Wo(){if(typeof WorkerGlobalScope>"u"||
!(globalThis instanceof WorkerGlobalScope))throw new Error("GGUF inference requires a ComputeManager-owned worker")}function Bn(o){
return{sessionId:o.sessionId,manifestCid:o.manifestCid,status:o.lost?"lost":o.status,runtime:"llama.cpp",runtimeVersion:Mn,
task:"text-generation",workerId:o.workerId,adapter:o.capabilities?.adapter,runtimeAdapter:o.engine?.evidence.runtimeAdapter??
null,runtimeFeatures:o.engine?.evidence.runtimeFeatures??[],gpuDispatches:o.engine?.evidence.dispatches??0,gpuSubmissions:o.
engine?.evidence.submissions??0,gpuOffload:o.engine?.evidence.offload??null,runtimeOptions:o.options,effectiveContextTokens:o.
contextTokens??null,nativeBuffers:o.engine?.evidence.buffers??[],wasmMemoryBytes:o.engine?.memoryBytes()??0,generatedRequests:o.
generatedRequests,artifactReads:o.reader?.getStats()??null}}function Vo({loadEngine:o=to,createReader:u=Ti,checkCapabilities:d=qo,
assertWorker:p=Wo,baseUrl:E=globalThis.location?.href}={}){let b;async function w(x,y){if(b)throw new Error("GGUF worker\
 already has a resident model");const k=qn(x.manifest),G=Ln(x.runtimeAssets,E),C=zn(x.runtimeOptions),I=ur(x.sessionId);
ue(y.signal);const B={sessionId:I,manifestCid:x.manifestCid,workerId:y.workerId??null,manifest:k.manifest,status:"loadin\
g",options:C,generatedRequests:0,residency:new AbortController,lost:!1};b=B;try{B.capabilities=await d(),ue(y.signal),B.
reader=u(x.artifactPort,{manifest:k.manifest,signal:B.residency.signal,maxReadBytes:Fn,maxReads:1}),await Io(k.manifest.
model,k.weights,B.reader,{signal:y.signal}),ue(y.signal),B.engine=await o({wasmUrl:G.wasm,weights:k.weights,reader:B.reader,
signal:y.signal,collectGpuEvidence:x.collectGpuEvidence===!0,onProgress:V=>y.emitProgress?.({...V,sessionId:I}),onLost(){
B.lost=!0,B.active?.abort("GPU device lost")}}),ue(y.signal);const W=await B.engine.action("load",{_name:"load_req",model_paths:B.
engine.files.map(V=>`models/${V.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...C,n_ubatch:Math.min(64,C.n_batch),n_parallel:1,
kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},y.signal);if(!W.success)throw new Error(
"GGUF native model load failed");if(!Number.isSafeInteger(W.n_ctx)||W.n_ctx<1||W.n_ctx>Hr)throw new Error("GGUF native m\
odel returned an invalid context capacity");B.contextTokens=W.n_ctx;const oe=B.engine.evidence.offload;if(!oe||oe.gpuLayers<
1||oe.gpuLayers!==Math.min(C.n_gpu_layers,oe.totalLayers))throw new Error("GGUF did not honor the explicitly configured \
GPU layer offload");if(ue(y.signal),B.lost)throw new Error("GPU device lost during GGUF load");return B.status="ready",Bn(
B)}catch(W){throw B.engine&&y.emitProgress?.({type:"model-load-memory",sessionId:I,wasmMemoryBytes:B.engine.memoryBytes(),
nativeBuffers:B.engine.evidence.buffers??[]}),B.lost=!0,B.status="lost",B.residency.abort(W),B.reader?.close(W),B.engine?.
close(),W}}async function N(x,y){const k=b;if(!k||k.sessionId!==ur(x.sessionId)||k.lost)throw new Error("Model session l\
ost or not loaded");if(k.status!=="ready")throw new Error("GGUF model session is busy");const G=ur(x.requestId),C=x.maxNewTokens??
fr.maxNewTokens;Lo.validateGenerationInput({...x,maxNewTokens:C});const I=Ci(x),B=new AbortController,W=()=>B.abort(y.signal?.
reason);y.signal?.addEventListener("abort",W,{once:!0}),y.signal?.aborted&&W(),k.active=B,k.status="generating",k.requestId=
G;const oe=k.engine.evidence.dispatches,V=k.engine.evidence.submissions;let se=0;async function he(re,Z){let pe,R=!1,J="",
ae=null,z=null,$="unknown",l=0;try{ue(B.signal);const K=await k.engine.action("completion",{_name:"cmpl_req",is_chat:!0,
data_json:JSON.stringify({messages:re,stream:!Z,max_tokens:Z?pr:C,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),
files:[]},B.signal);if(!K.success||!Number.isSafeInteger(K.req_id)||K.req_id<0)throw new Error("GGUF failed to start gen\
eration");pe=K.req_id,ue(B.signal);for(let fe=0;fe<4096;fe+=1){ue(B.signal);const de=await k.engine.action("get_result",
{_name:"gres_req",req_id:pe},B.signal);ue(B.signal);const ne=zo(de);if(!de.success||de.is_error)throw Qo(ne,k.contextTokens);
for(const ee of ne){const _e=ee.choices?.[0]?.finish_reason??ee.finish_reason;_e!=null&&($=["stop","length"].includes(_e)?
_e:"unknown");const O=ee.choices?.[0],j=O?.delta?.content??O?.message?.content??ee.content??"";if(typeof j!="string")throw new Error(
"Invalid GGUF text chunk");if(Z){const Me=O?.delta?.reasoning_content??O?.message?.reasoning_content??"";if(typeof Me!="\
string")throw new Error("Invalid GGUF measurement result");if(l+=dr(j)+dr(Me),l>fr.maxOutputBytes)throw new Error("GGUF \
measurement exceeds its byte budget")}else{if(J+=j,dr(J)>fr.maxOutputBytes)throw new Error("GGUF output exceeds its byte\
 budget");if(j&&y.emitProgress?.({type:"token",sessionId:k.sessionId,requestId:G,sequence:se++,text:j})===!1)throw new Error(
"Token consumer rejected output")}ae=ee.usage?.prompt_tokens??ee.timings?.prompt_n??ae,z=ee.usage?.completion_tokens??ee.
timings?.predicted_n??z}if(!de.has_more){R=!0;break}await new Promise(ee=>setTimeout(ee,0))}if(!R)throw new Error("GGUF \
result polling exceeded its request budget");if(z!==null&&(!Number.isSafeInteger(z)||z<0||z>(Z?pr:C)))throw new Error("G\
GUF returned an over-budget token sequence");if(Z&&(!Number.isSafeInteger(ae)||ae<0||z===null))throw new Error("GGUF con\
text preflight did not return valid token usage");return{text:J,inputTokens:ae,outputTokens:z,finishReason:$}}catch(K){throw(K?.
name==="RuntimeError"||/Model session lost|GPU device lost/.test(K?.message??""))&&(k.lost=!0),K}finally{if(pe!==void 0&&
!k.lost)try{R||await k.engine.action("cancel",{_name:"cncl_req",req_id:pe}),await k.engine.settleGpu()}catch{throw k.lost=
!0,new Error("Model session lost while settling GGUF inference")}}}try{const re=await Co({messages:I,contextTokens:k.contextTokens,
reservedOutputTokens:C,signal:B.signal,async measure(pe){try{const R=await he(pe,!0);return{inputTokens:R.inputTokens,contextTokens:k.
contextTokens,probeOutputTokens:R.outputTokens}}catch(R){if(R.code!=="ERR_GGUF_NATIVE_CONTEXT")throw R;return{inputTokens:R.
inputTokens,contextTokens:R.contextTokens,probeOutputTokens:0}}},onMeasured:pe=>y.emitProgress?.({type:"context-budget",
sessionId:k.sessionId,requestId:G,...pe})});ue(B.signal);const Z=await he(re.messages,!1);if(ue(B.signal),k.lost)throw new Error(
"GPU device lost; model session is unavailable");return k.generatedRequests+=1,{sessionId:k.sessionId,requestId:G,...Z,contextTruncated:re.
contextTruncated,contextBudget:re.contextBudget,workerId:k.workerId,gpuDispatches:k.engine.evidence.dispatches-oe,gpuSubmissions:k.
engine.evidence.submissions-V,gpuOffload:k.engine.evidence.offload,artifactReads:k.reader.getStats()}}catch(re){throw re?.
name==="RuntimeError"?(k.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(re.message).slice(0,300)}`)):
(/Model session lost|GPU device lost/.test(re.message??"")&&(k.lost=!0),re)}finally{y.signal?.removeEventListener("abort",
W),k.active=null,k.requestId=null,k.status=k.lost?"lost":"ready"}}return async(x={},y={})=>{if(p(),x.command==="load")return w(
x,y);if(x.command==="generate")return N(x,y);const k=ur(x.sessionId);if(x.command==="status")return b?.sessionId===k?Bn(
b):{sessionId:k,status:"absent"};if(!b||b.sessionId!==k)throw new Error("Model session lost or not loaded");if(x.command===
"cancel")return b.requestId===x.requestId&&b.active?.abort(Oi()),{sessionId:k,cancellationRequested:!0};if(x.command==="\
unload"){if(b.status==="generating")throw new Error("Cancel and await GGUF generation before unloading");return b.residency.
abort("GGUF unload"),b.reader?.close(),b.engine?.close(),b=null,{sessionId:k,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const Ho=Vo(),Xo=(o,u)=>Ho(o,u);export{Vo as createGgufTaskRuntime,Xo as handleModelTask};

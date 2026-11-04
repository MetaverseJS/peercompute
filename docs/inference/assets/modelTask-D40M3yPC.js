import{n as pi,c as gi}from"./GgufArtifactReader-BV3uUvNA.js";import{t as fe,M as Ur,v as nr,n as bi,a as hi}from"./modelTask-dQfjl6lX.js";
function _i(l,h){const F=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var x=!!globalThis.
window,O=!!globalThis.WorkerGlobalScope,w=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",k=O&&
self.name?.startsWith("em-pthread");if(w){var z=require("worker_threads");global.Worker=z.Worker,O=!z.isMainThread,k=O&&
z.workerData=="em-pthread"}var G="./this.program",_=(e,r)=>{throw r},E=globalThis.document?.currentScript?.src;typeof __filename<
"u"?E=__filename:O&&(E=self.location.href);var D="";function W(e){return l.locateFile?l.locateFile(e,D):D+e}var I,v;if(w){
var J=require("fs");D=__dirname+"/",v=e=>{e=$(e)?new URL(e):e;var r=J.readFileSync(e);return r},I=async(e,r=!0)=>{e=$(e)?
new URL(e):e;var t=J.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(G=process.argv[1].replace(/\\/g,"\
/")),process.argv.slice(2),typeof module<"u"&&(module.exports=l),_=(e,r)=>{throw process.exitCode=e,r}}else if(x||O){try{
D=new URL(".",E).href}catch{}w||(O&&(v=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),I=async e=>{if($(e))return new Promise((t,a)=>{var i=new XMLHttpRequest;i.open(
"GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}a(
i.status)},i.onerror=a,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(
r.status+" : "+r.url)})}var ae=console.log.bind(console),q=console.error.bind(console);if(w){var Y=require("util"),le=e=>typeof e==
"object"?Y.inspect(e):e;ae=(...e)=>J.writeSync(1,e.map(le).join(" ")+`
`),q=(...e)=>J.writeSync(2,e.map(le).join(" ")+`
`)}var se=ae,te=q,ge,oe,ke=!1,ee;function H(e,r){e||de(r)}var $=e=>e.startsWith("file://");function c(){ve.buffer!=ne.buffer&&
He()}if(w&&k){var re=z.parentPort;re.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>re.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var ce;if(k){var be=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,a=t.
cmd;if(a==="load"){let i=[];self.onmessage=o=>i.push(o),ce=()=>{postMessage({cmd:"loaded"});for(let o of i)e(o);self.onmessage=
e};for(const o of t.handlers)(!l[o]||l[o].proxy)&&(l[o]=(...s)=>{postMessage({cmd:"callHandler",handler:o,args:s})},o=="\
print"&&(se=l[o]),o=="printErr"&&(te=l[o]));ve=t.wasmMemory,He(),oe=t.wasmModule,zr(),ar()}else if(a==="run"){Ta(t.pthread_ptr),
Ar(t.pthread_ptr,0,0,1,0,0),L.threadInitTLS(),wr(t.pthread_ptr),be||(be=!0);try{await et(t.start_routine,t.arg)}catch(i){
if(i!="unwind")throw i}}else t.target==="setimmediate"||(a==="checkMailbox"?be&&Ze():a&&(te(`worker: received unknown co\
mmand ${a}`),te(t)))}catch(i){throw Kt(),i}}self.onmessage=e}var ne,ue,Se,A,C,ir,Ie,K,S,Or=!1;function He(){var e=ve.buffer;
ne=new Int8Array(e),Se=new Int16Array(e),l.HEAPU8=ue=new Uint8Array(e),A=new Int32Array(e),C=new Uint32Array(e),ir=new Float32Array(
e),Ie=new Float64Array(e),K=new BigInt64Array(e),S=new BigUint64Array(e)}function Sa(){if(!k){if(l.wasmMemory)ve=l.wasmMemory;else{
var e=l.INITIAL_MEMORY||134217728;ve=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}He()}}function Ba(){if(l.preRun)for(typeof l.preRun=="function"&&(l.preRun=[l.preRun]);l.preRun.length;)Pr(l.preRun.
shift());Vr($r)}function Mr(){if(Or=!0,k)return ce();!l.noFSInit&&!n.initialized&&n.init(),Ne.__wasm_call_ctors(),n.ignorePermissions=
!1}function Na(){if(!k){if(l.postRun)for(typeof l.postRun=="function"&&(l.postRun=[l.postRun]);l.postRun.length;)Ca(l.postRun.
shift());Vr(Xr)}}function de(e){l.onAbort?.(e),e="Aborted("+e+")",te(e),ke=!0,e+=". Build with -sASSERTIONS for more inf\
o.",Or&&ra();var r=new WebAssembly.RuntimeError(e);throw r}var or;function xa(){return W("wllama.wasm")}function Ia(e){if(e==
or&&ge)return new Uint8Array(ge);if(v)return v(e);throw"both async and sync fetching of the wasm failed"}async function Fa(e){
if(!ge)try{var r=await I(e);return new Uint8Array(r)}catch{}return Ia(e)}async function Ga(e,r){try{var t=await Fa(e),a=await WebAssembly.
instantiate(t,r);return a}catch(i){te(`failed to asynchronously prepare wasm: ${i}`),de(i)}}async function Aa(e,r,t){if(!e&&
!$(r)&&!w)try{var a=fetch(r,{credentials:"same-origin"}),i=await WebAssembly.instantiateStreaming(a,t);return i}catch(o){
te(`wasm streaming compile failed: ${o}`),te("falling back to ArrayBuffer instantiation")}return Ga(r,t)}function Lr(){fi(),
Oe.__instrumented||(Oe.__instrumented=!0,me.instrumentWasmImports(Oe));var e={env:Oe,wasi_snapshot_preview1:Oe};return e}
async function zr(){function e(s,u){return Ne=s.exports,Ne=me.instrumentWasmExports(Ne),Ne=di(Ne),Ua(Ne._emscripten_tls_init),
ui(Ne),oe=u,Ke(),Ne}Ye();function r(s){return e(s.instance,s.module)}var t=Lr();if(l.instantiateWasm)return new Promise(
(s,u)=>{l.instantiateWasm(t,(m,b)=>{s(e(m,b))})});if(k){var a=new WebAssembly.Instance(oe,Lr());return e(a,oe)}or??=xa();
var i=await Aa(ge,or,t),o=r(i);return o}class qr{name="ExitStatus";constructor(r){this.message=`Program terminated with \
exit(${r})`,this.status=r}}var Wr=e=>{e.terminate(),e.onmessage=r=>{}},Qr=e=>{var r=L.pthreads[e];L.returnWorkerToPool(r)},
Vr=e=>{for(;e.length>0;)e.shift()(l)},$r=[],Pr=e=>$r.push(e),Ae=0,Me=null,Ke=e=>{if(Ae--,l.monitorRunDependencies?.(Ae),
Ae==0&&Me){var r=Me;Me=null,r()}},Ye=e=>{Ae++,l.monitorRunDependencies?.(Ae)},Jr=e=>{var r=L.getNewWorker();if(!r)return 6;
L.runningWorkers.push(r),L.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,
arg:e.arg,pthread_ptr:e.pthread_ptr};return w&&r.unref(),r.postMessage(t,e.transferList),0},Xe=0,sr=()=>fr||Xe>0,he=()=>ia(),
_e=e=>aa(e),lr=e=>na(e),Z=(e,r,t,...a)=>{for(var i=a.length*2,o=he(),s=lr(i*8),u=s/8,m=0;m<a.length;m++){var b=a[m];typeof b==
"bigint"?((c(),K)[u+2*m]=1n,(c(),K)[u+2*m+1]=b):((c(),K)[u+2*m]=0n,(c(),Ie)[u+2*m+1]=b)}var g=Yt(e,r,i,s,t);return _e(o),
g};function Hr(e){if(k)return Z(0,0,1,e);ee=e,sr()||(L.terminateAllThreads(),l.onExit?.(e),ke=!0),_(e,new qr(e))}function Kr(e){
if(k)return Z(1,0,0,e);cr(e)}var Yr=(e,r)=>{if(ee=e,k)throw Kr(e),"unwind";Hr(e)},cr=Yr,L={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){k||L.initMainThread()},initMainThread(){for(var e=l.pthreadPoolSize;e--;)L.allocateUnusedWorker();
Pr(async()=>{var r=L.loadWasmModuleToAllWorkers();Ye(),await r,Ke()})},terminateAllThreads:()=>{for(var e of L.runningWorkers)
Wr(e);for(var e of L.unusedWorkers)Wr(e);L.unusedWorkers=[],L.runningWorkers=[],L.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete L.pthreads[r],L.unusedWorkers.push(e),L.runningWorkers.splice(L.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,Xt(r)},threadInitTLS(){L.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=o=>{var s=o.
data,u=s.cmd;if(s.targetThread&&s.targetThread!=tr()){var m=L.pthreads[s.targetThread];m?m.postMessage(s,s.transferList):
te(`Internal error! Worker sent a message "${u}" to target pthread ${s.targetThread}, but that thread no longer exists!`);
return}u==="checkMailbox"?Ze():u==="spawnThread"?Jr(s):u==="cleanupThread"?Ee(()=>Qr(s.thread)):u==="loaded"?(e.loaded=!0,
w&&!e.pthread_ptr&&e.unref(),r(e)):s.target==="setimmediate"?e.postMessage(s):u==="uncaughtException"?e.onerror(s.error):
u==="callHandler"?l[s.handler](...s.args):u&&te(`worker sent an unknown command ${u}`)},e.onerror=o=>{var s="worker sent\
 an error!";throw te(`${s} ${o.filename}:${o.lineno}: ${o.message}`),o},w&&(e.on("message",o=>e.onmessage({data:o})),e.on(
"error",o=>e.onerror(o)));var t=[],a=["onExit","onAbort","print","printErr"];for(var i of a)l.propertyIsEnumerable(i)&&t.
push(i);e.postMessage({cmd:"load",handlers:t,wasmMemory:ve,wasmModule:oe})}),async loadWasmModuleToAllWorkers(){return k?
void 0:Promise.all(L.unusedWorkers.map(L.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=E;l.mainScriptUrlOrBlob&&
(r=l.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new F(r,{workerData:"em-pthread",name:"em-pth\
read"}),L.unusedWorkers.push(e)},getNewWorker(){return L.unusedWorkers.length==0&&(L.allocateUnusedWorker(),L.loadWasmModuleToWorker(
L.unusedWorkers[0])),L.unusedWorkers.pop()}},Xr=[],Ca=e=>Xr.push(e);function Ta(e){var r=Number((c(),S)[(e+88)/8]),t=Number(
(c(),S)[(e+96)/8]),a=r-t;ta(r,a),_e(r)}var ur=[],Zr=e=>{e=Number(e);var r=ur[e];return r||(ur[e]=r=oa.get(BigInt(e)),me.
isAsyncExport(r)&&(ur[e]=r=me.makeAsyncFunction(r))),r},et=async(e,r)=>{Xe=0,fr=0;var t=(i=>WebAssembly.promising(Zr(e)).
call(null,BigInt(i)))(r);function a(i){if(sr()){ee=i;return}Cr(i)}t=await t,a(t)};et.isAsync=!0;var fr=!0,Ua=e=>L.tlsInitFunctions.
push(e),ve;function rt(e,r,t,a){return k?Z(2,0,1,e,r,t,a):tt(e,r,t,a)}var Ra=()=>!!globalThis.SharedArrayBuffer,ja=9007199254740992,
Da=-9007199254740992,p=e=>e<Da||e>ja?NaN:Number(e);function tt(e,r,t,a){if(e=p(e),r=p(r),t=p(t),a=p(a),!Ra())return 6;var i=[],
o=0;if(k&&(i.length===0||o))return rt(e,r,t,a);var s={startRoutine:t,pthread_ptr:e,arg:a,transferList:i};return k?(s.cmd=
"spawnThread",postMessage(s,i),0):Jr(s)}var Ue=()=>{var e=Number((c(),S)[V.varargs/8]);return V.varargs+=8,e},dr=()=>{var e=(c(),
A)[+V.varargs/4];return V.varargs+=4,e},Q={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,a=e.length-1;a>=0;a--){var i=e[a];i==="."?e.splice(a,1):i===
".."?(e.splice(a,1),t++):t&&(e.splice(a,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=Q.isAbs(e),
t=e.slice(-1)==="/";return e=Q.normalizeArray(e.split("/").filter(a=>!!a),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=Q.splitPath(e),t=r[0],a=r[1];return!t&&!a?".":(a&&(a=a.slice(0,-1)),t+a)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>Q.normalize(e.join("/")),join2:(e,r)=>Q.normalize(e+"/"+r)},Oa=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),mr=e=>{(mr=Oa())(e)},Re={resolve:(...e)=>{for(var r="",t=!1,a=e.length-1;a>=
-1&&!t;a--){var i=a>=0?e[a]:n.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!i)return"";r=i+"/"+r,t=Q.isAbs(i)}return r=Q.normalizeArray(r.split("/").filter(o=>!!o),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=Re.resolve(e).slice(1),r=Re.resolve(r).slice(1);function t(b){for(var g=0;g<b.length&&b[g]==="";g++)
;for(var B=b.length-1;B>=0&&b[B]==="";B--);return g>B?[]:b.slice(g,B-g+1)}for(var a=t(e.split("/")),i=t(r.split("/")),o=Math.
min(a.length,i.length),s=o,u=0;u<o;u++)if(a[u]!==i[u]){s=u;break}for(var m=[],u=s;u<a.length;u++)m.push("..");return m=m.
concat(i.slice(s)),m.join("/")}},at=globalThis.TextDecoder&&new TextDecoder,Ma=(e,r,t,a)=>{for(var i=r+t;e[r]&&!(r>=i);)
++r;return r},je=(e,r=0,t,a)=>{var i=Ma(e,r,t);if(i-r>16&&e.buffer&&at)return at.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,i):e.slice(r,i));for(var o="";r<i;){var s=e[r++];if(!(s&128)){o+=String.fromCharCode(s);continue}var u=e[r++]&
63;if((s&224)==192){o+=String.fromCharCode((s&31)<<6|u);continue}var m=e[r++]&63;if((s&240)==224?s=(s&15)<<12|u<<6|m:s=(s&
7)<<18|u<<12|m<<6|e[r++]&63,s<65536)o+=String.fromCharCode(s);else{var b=s-65536;o+=String.fromCharCode(55296|b>>10,56320|
b&1023)}}return o},pr=[],we=e=>{for(var r=0,t=0;t<e.length;++t){var a=e.charCodeAt(t);a<=127?r++:a<=2047?r+=2:a>=55296&&
a<=57343?(r+=4,++t):r+=3}return r},nt=(e,r,t,a)=>{if(!(a>0))return 0;for(var i=t,o=t+a-1,s=0;s<e.length;++s){var u=e.codePointAt(
s);if(u<=127){if(t>=o)break;r[t++]=u}else if(u<=2047){if(t+1>=o)break;r[t++]=192|u>>6,r[t++]=128|u&63}else if(u<=65535){
if(t+2>=o)break;r[t++]=224|u>>12,r[t++]=128|u>>6&63,r[t++]=128|u&63}else{if(t+3>=o)break;r[t++]=240|u>>18,r[t++]=128|u>>
12&63,r[t++]=128|u>>6&63,r[t++]=128|u&63,s++}}return r[t]=0,t-i},gr=(e,r,t)=>{var a=we(e)+1,i=new Array(a),o=nt(e,i,0,i.
length);return i.length=o,i},La=()=>{if(!pr.length){var e=null;if(w){var r=256,t=Buffer.alloc(r),a=0,i=process.stdin.fd;
try{a=J.readSync(i,t,0,r)}catch(o){if(o.toString().includes("EOF"))a=0;else throw o}a>0&&(e=t.slice(0,a).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;pr=gr(e)}return pr.shift()},Ce={ttys:[],init(){},shutdown(){},register(e,r){Ce.ttys[e]={input:[],output:[],
ops:r},n.registerDevice(e,Ce.stream_ops)},stream_ops:{open(e){var r=Ce.ttys[e.node.rdev];if(!r)throw new n.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,a,i){if(!e.tty||!e.tty.
ops.get_char)throw new n.ErrnoError(60);for(var o=0,s=0;s<a;s++){var u;try{u=e.tty.ops.get_char(e.tty)}catch{throw new n.
ErrnoError(29)}if(u===void 0&&o===0)throw new n.ErrnoError(6);if(u==null)break;o++,r[t+s]=u}return o&&(e.node.atime=Date.
now()),o},write(e,r,t,a,i){if(!e.tty||!e.tty.ops.put_char)throw new n.ErrnoError(60);try{for(var o=0;o<a;o++)e.tty.ops.put_char(
e.tty,r[t+o])}catch{throw new n.ErrnoError(29)}return a&&(e.node.mtime=e.node.ctime=Date.now()),o}},default_tty_ops:{get_char(e){
return La()},put_char(e,r){r===null||r===10?(se(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(se(je(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(te(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(te(je(e.output)),e.output=[])}}},za=(e,r)=>(c(),ue).fill(0,e,e+r),it=(e,r)=>Math.ceil(e/r)*r,br=e=>{
e=it(e,65536);var r=Ht(65536,e);return r&&za(r,e),r},T={ops_table:null,mount(e){return T.createNode(null,"/",16895,0)},createNode(e,r,t,a){
if(n.isBlkdev(t)||n.isFIFO(t))throw new n.ErrnoError(63);T.ops_table||={dir:{node:{getattr:T.node_ops.getattr,setattr:T.
node_ops.setattr,lookup:T.node_ops.lookup,mknod:T.node_ops.mknod,rename:T.node_ops.rename,unlink:T.node_ops.unlink,rmdir:T.
node_ops.rmdir,readdir:T.node_ops.readdir,symlink:T.node_ops.symlink},stream:{llseek:T.stream_ops.llseek}},file:{node:{getattr:T.
node_ops.getattr,setattr:T.node_ops.setattr},stream:{llseek:T.stream_ops.llseek,read:T.stream_ops.read,write:T.stream_ops.
write,mmap:T.stream_ops.mmap,msync:T.stream_ops.msync}},link:{node:{getattr:T.node_ops.getattr,setattr:T.node_ops.setattr,
readlink:T.node_ops.readlink},stream:{}},chrdev:{node:{getattr:T.node_ops.getattr,setattr:T.node_ops.setattr},stream:n.chrdev_stream_ops}};
var i=n.createNode(e,r,t,a);return n.isDir(i.mode)?(i.node_ops=T.ops_table.dir.node,i.stream_ops=T.ops_table.dir.stream,
i.contents={}):n.isFile(i.mode)?(i.node_ops=T.ops_table.file.node,i.stream_ops=T.ops_table.file.stream,i.usedBytes=0,i.contents=
null):n.isLink(i.mode)?(i.node_ops=T.ops_table.link.node,i.stream_ops=T.ops_table.link.stream):n.isChrdev(i.mode)&&(i.node_ops=
T.ops_table.chrdev.node,i.stream_ops=T.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.
atime=e.mtime=e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var a=1024*1024;r=Math.max(r,t*(t<a?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=n.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,n.isDir(e.mode)?r.size=4096:n.isFile(e.mode)?r.size=e.usedBytes:n.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&T.resizeFileStorage(e,r.size)},lookup(e,r){throw T.doesNotExistError||(T.doesNotExistError=new n.ErrnoError(44),
T.doesNotExistError.stack="<generic error, no stack>"),T.doesNotExistError},mknod(e,r,t,a){return T.createNode(e,r,t,a)},
rename(e,r,t){var a;try{a=n.lookupNode(r,t)}catch{}if(a){if(n.isDir(e.mode))for(var i in a.contents)throw new n.ErrnoError(
55);n.hashRemoveNode(a)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=n.lookupNode(e,r);for(var a in t.
contents)throw new n.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var a=T.createNode(e,r,41471,0);return a.link=t,a},readlink(e){if(!n.isLink(e.mode))throw new n.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,a,i){var o=e.node.contents;if(i>=e.node.usedBytes)return 0;var s=Math.
min(e.node.usedBytes-i,a);if(s>8&&o.subarray)r.set(o.subarray(i,i+s),t);else for(var u=0;u<s;u++)r[t+u]=o[i+u];return s},
write(e,r,t,a,i,o){if(r.buffer===(c(),ne).buffer&&(o=!1),!a)return 0;var s=e.node;if(s.mtime=s.ctime=Date.now(),r.subarray&&
(!s.contents||s.contents.subarray)){if(o)return s.contents=r.subarray(t,t+a),s.usedBytes=a,a;if(s.usedBytes===0&&i===0)return s.
contents=r.slice(t,t+a),s.usedBytes=a,a;if(i+a<=s.usedBytes)return s.contents.set(r.subarray(t,t+a),i),a}if(T.expandFileStorage(
s,i+a),s.contents.subarray&&r.subarray)s.contents.set(r.subarray(t,t+a),i);else for(var u=0;u<a;u++)s.contents[i+u]=r[t+
u];return s.usedBytes=Math.max(s.usedBytes,i+a),a},llseek(e,r,t){var a=r;if(t===1?a+=e.position:t===2&&n.isFile(e.node.mode)&&
(a+=e.node.usedBytes),a<0)throw new n.ErrnoError(28);return a},mmap(e,r,t,a,i){if(!n.isFile(e.node.mode))throw new n.ErrnoError(
43);var o,s,u=e.node.contents;if(!(i&2)&&u&&u.buffer===(c(),ne).buffer)s=!1,o=u.byteOffset;else{if(s=!0,o=br(r),!o)throw new n.
ErrnoError(48);u&&((t>0||t+r<u.length)&&(u.subarray?u=u.subarray(t,t+r):u=Array.prototype.slice.call(u,t,t+r)),(c(),ne).
set(u,o))}return{ptr:o,allocated:s}},msync(e,r,t,a,i){return T.stream_ops.write(e,r,0,a,t,!1),0}}},qa=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},hr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},Wa=async e=>{var r=await I(e);return new Uint8Array(r)},ot=(...e)=>n.createDataFile(
...e),st=[],Qa=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of st)if(t.canHandle(r))return t.handle(e,r);return e},
_r=async(e,r,t,a,i,o,s,u)=>{var m=r?Re.resolve(Q.join2(e,r)):e;Ye();try{var b=t;typeof t=="string"&&(b=await Wa(t)),b=await Qa(
b,m),u?.(),o||ot(e,r,b,a,i,s)}finally{Ke()}},Va=(e,r,t,a,i,o,s,u,m,b)=>{_r(e,r,t,a,i,u,m,b).then(o).catch(s)},n={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,a){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=n.nextInode++,this.name=r,this.mode=t,this.rdev=a,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return n.isDir(this.mode)}get isDevice(){return n.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new n.ErrnoError(44);r.follow_mount??=!0,Q.isAbs(e)||(e=n.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var a=e.split(
"/").filter(b=>!!b),i=n.root,o="/",s=0;s<a.length;s++){var u=s===a.length-1;if(u&&r.parent)break;if(a[s]!=="."){if(a[s]===
".."){if(o=Q.dirname(o),n.isRoot(i)){e=o+"/"+a.slice(s+1).join("/"),t--;continue e}else i=i.parent;continue}o=Q.join2(o,
a[s]);try{i=n.lookupNode(i,a[s])}catch(b){if(b?.errno===44&&u&&r.noent_okay)return{path:o};throw b}if(n.isMountpoint(i)&&
(!u||r.follow_mount)&&(i=i.mounted.root),n.isLink(i.mode)&&(!u||r.follow)){if(!i.node_ops.readlink)throw new n.ErrnoError(
52);var m=i.node_ops.readlink(i);Q.isAbs(m)||(m=Q.dirname(o)+"/"+m),e=m+"/"+a.slice(s+1).join("/");continue e}}}return{path:o,
node:i}}throw new n.ErrnoError(32)},getPath(e){for(var r;;){if(n.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-
1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:e.name,e=e.parent}},hashName(e,r){for(var t=0,a=0;a<r.length;a++)t=(t<<5)-
t+r.charCodeAt(a)|0;return(e+t>>>0)%n.nameTable.length},hashAddNode(e){var r=n.hashName(e.parent.id,e.name);e.name_next=
n.nameTable[r],n.nameTable[r]=e},hashRemoveNode(e){var r=n.hashName(e.parent.id,e.name);if(n.nameTable[r]===e)n.nameTable[r]=
e.name_next;else for(var t=n.nameTable[r];t;){if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){
var t=n.mayLookup(e);if(t)throw new n.ErrnoError(t);for(var a=n.hashName(e.id,r),i=n.nameTable[a];i;i=i.name_next){var o=i.
name;if(i.parent.id===e.id&&o===r)return i}return n.lookup(e,r)},createNode(e,r,t,a){var i=new n.FSNode(e,r,t,a);return n.
hashAddNode(i),i},destroyNode(e){n.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},
isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&
61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},
flagsToPermissionString(e){var r=["r","w","rw"][e&3];return e&512&&(r+="w"),r},nodePermissions(e,r){return n.ignorePermissions?
0:r.includes("r")&&!(e.mode&292)||r.includes("w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!n.
isDir(e.mode))return 54;var r=n.nodePermissions(e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!n.isDir(e.mode))
return 54;try{var t=n.lookupNode(e,r);return 20}catch{}return n.nodePermissions(e,"wx")},mayDelete(e,r,t){var a;try{a=n.
lookupNode(e,r)}catch(o){return o.errno}var i=n.nodePermissions(e,"wx");if(i)return i;if(t){if(!n.isDir(a.mode))return 54;
if(n.isRoot(a)||n.getPath(a)===n.cwd())return 10}else if(n.isDir(a.mode))return 31;return 0},mayOpen(e,r){return e?n.isLink(
e.mode)?32:n.isDir(e.mode)&&(n.flagsToPermissionString(r)!=="r"||r&576)?31:n.nodePermissions(e,n.flagsToPermissionString(
r)):44},checkOpExists(e,r){if(!e)throw new n.ErrnoError(r);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=n.MAX_OPEN_FDS;e++)
if(!n.streams[e])return e;throw new n.ErrnoError(33)},getStreamChecked(e){var r=n.getStream(e);if(!r)throw new n.ErrnoError(
8);return r},getStream:e=>n.streams[e],createStream(e,r=-1){return e=Object.assign(new n.FSStream,e),r==-1&&(r=n.nextfd()),
e.fd=r,n.streams[r]=e,e},closeStream(e){n.streams[e]=null},dupStream(e,r=-1){var t=n.createStream(e,r);return t.stream_ops?.
dup?.(t),t},doSetAttr(e,r,t){var a=e?.stream_ops.setattr,i=a?e:r;a??=r.node_ops.setattr,n.checkOpExists(a,63),a(i,t)},chrdev_stream_ops:{
open(e){var r=n.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new n.ErrnoError(
70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){n.devices[e]={stream_ops:r}},getDevice:e=>n.
devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var a=t.pop();r.push(a),t.push(...a.mounts)}return r},syncfs(e,r){
typeof e=="function"&&(r=e,e=!1),n.syncFSRequests++,n.syncFSRequests>1&&te(`warning: ${n.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=n.getMounts(n.root.mount),a=0;function i(u){return n.syncFSRequests--,
r(u)}function o(u){if(u)return o.errored?void 0:(o.errored=!0,i(u));++a>=t.length&&i(null)}for(var s of t)s.type.syncfs?
s.type.syncfs(s,e,o):o(null)},mount(e,r,t){var a=t==="/",i=!t,o;if(a&&n.root)throw new n.ErrnoError(10);if(!a&&!i){var s=n.
lookupPath(t,{follow_mount:!1});if(t=s.path,o=s.node,n.isMountpoint(o))throw new n.ErrnoError(10);if(!n.isDir(o.mode))throw new n.
ErrnoError(54)}var u={type:e,opts:r,mountpoint:t,mounts:[]},m=e.mount(u);return m.mount=u,u.root=m,a?n.root=m:o&&(o.mounted=
u,o.mount&&o.mount.mounts.push(u)),m},unmount(e){var r=n.lookupPath(e,{follow_mount:!1});if(!n.isMountpoint(r.node))throw new n.
ErrnoError(28);var t=r.node,a=t.mounted,i=n.getMounts(a);for(var[o,s]of Object.entries(n.nameTable))for(;s;){var u=s.name_next;
i.includes(s.mount)&&n.destroyNode(s),s=u}t.mounted=null;var m=t.mount.mounts.indexOf(a);t.mount.mounts.splice(m,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var a=n.lookupPath(e,{parent:!0}),i=a.node,o=Q.basename(e);if(!o)throw new n.
ErrnoError(28);if(o==="."||o==="..")throw new n.ErrnoError(20);var s=n.mayCreate(i,o);if(s)throw new n.ErrnoError(s);if(!i.
node_ops.mknod)throw new n.ErrnoError(63);return i.node_ops.mknod(i,o,r,t)},statfs(e){return n.statfsNode(n.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return n.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:n.nextInode,ffree:n.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,n.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,n.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),a="";for(var i of t)if(i){(a||Q.isAbs(e))&&(a+=
"/"),a+=i;try{n.mkdir(a,r)}catch(o){if(o.errno!=20)throw o}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,n.mknod(
e,r,t)},symlink(e,r){if(!Re.resolve(e))throw new n.ErrnoError(44);var t=n.lookupPath(r,{parent:!0}),a=t.node;if(!a)throw new n.
ErrnoError(44);var i=Q.basename(r),o=n.mayCreate(a,i);if(o)throw new n.ErrnoError(o);if(!a.node_ops.symlink)throw new n.
ErrnoError(63);return a.node_ops.symlink(a,i,e)},rename(e,r){var t=Q.dirname(e),a=Q.dirname(r),i=Q.basename(e),o=Q.basename(
r),s,u,m;if(s=n.lookupPath(e,{parent:!0}),u=s.node,s=n.lookupPath(r,{parent:!0}),m=s.node,!u||!m)throw new n.ErrnoError(
44);if(u.mount!==m.mount)throw new n.ErrnoError(75);var b=n.lookupNode(u,i),g=Re.relative(e,a);if(g.charAt(0)!==".")throw new n.
ErrnoError(28);if(g=Re.relative(r,t),g.charAt(0)!==".")throw new n.ErrnoError(55);var B;try{B=n.lookupNode(m,o)}catch{}if(b!==
B){var y=n.isDir(b.mode),N=n.mayDelete(u,i,y);if(N)throw new n.ErrnoError(N);if(N=B?n.mayDelete(m,o,y):n.mayCreate(m,o),
N)throw new n.ErrnoError(N);if(!u.node_ops.rename)throw new n.ErrnoError(63);if(n.isMountpoint(b)||B&&n.isMountpoint(B))
throw new n.ErrnoError(10);if(m!==u&&(N=n.nodePermissions(u,"w"),N))throw new n.ErrnoError(N);n.hashRemoveNode(b);try{u.
node_ops.rename(b,m,o),b.parent=m}catch(R){throw R}finally{n.hashAddNode(b)}}},rmdir(e){var r=n.lookupPath(e,{parent:!0}),
t=r.node,a=Q.basename(e),i=n.lookupNode(t,a),o=n.mayDelete(t,a,!0);if(o)throw new n.ErrnoError(o);if(!t.node_ops.rmdir)throw new n.
ErrnoError(63);if(n.isMountpoint(i))throw new n.ErrnoError(10);t.node_ops.rmdir(t,a),n.destroyNode(i)},readdir(e){var r=n.
lookupPath(e,{follow:!0}),t=r.node,a=n.checkOpExists(t.node_ops.readdir,54);return a(t)},unlink(e){var r=n.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new n.ErrnoError(44);var a=Q.basename(e),i=n.lookupNode(t,a),o=n.mayDelete(t,a,!1);if(o)
throw new n.ErrnoError(o);if(!t.node_ops.unlink)throw new n.ErrnoError(63);if(n.isMountpoint(i))throw new n.ErrnoError(10);
t.node_ops.unlink(t,a),n.destroyNode(i)},readlink(e){var r=n.lookupPath(e),t=r.node;if(!t)throw new n.ErrnoError(44);if(!t.
node_ops.readlink)throw new n.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=n.lookupPath(e,{follow:!r}),
a=t.node,i=n.checkOpExists(a.node_ops.getattr,63);return i(a)},fstat(e){var r=n.getStreamChecked(e),t=r.node,a=r.stream_ops.
getattr,i=a?r:t;return a??=t.node_ops.getattr,n.checkOpExists(a,63),a(i)},lstat(e){return n.stat(e,!0)},doChmod(e,r,t,a){
n.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:a})},chmod(e,r,t){var a;if(typeof e=="string"){var i=n.
lookupPath(e,{follow:!t});a=i.node}else a=e;n.doChmod(null,a,r,t)},lchmod(e,r){n.chmod(e,r,!0)},fchmod(e,r){var t=n.getStreamChecked(
e);n.doChmod(t,t.node,r,!1)},doChown(e,r,t){n.doSetAttr(e,r,{timestamp:Date.now(),dontFollow:t})},chown(e,r,t,a){var i;if(typeof e==
"string"){var o=n.lookupPath(e,{follow:!a});i=o.node}else i=e;n.doChown(null,i,a)},lchown(e,r,t){n.chown(e,r,t,!0)},fchown(e,r,t){
var a=n.getStreamChecked(e);n.doChown(a,a.node,!1)},doTruncate(e,r,t){if(n.isDir(r.mode))throw new n.ErrnoError(31);if(!n.
isFile(r.mode))throw new n.ErrnoError(28);var a=n.nodePermissions(r,"w");if(a)throw new n.ErrnoError(a);n.doSetAttr(e,r,
{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new n.ErrnoError(28);var t;if(typeof e=="string"){var a=n.lookupPath(
e,{follow:!0});t=a.node}else t=e;n.doTruncate(null,t,r)},ftruncate(e,r){var t=n.getStreamChecked(e);if(r<0||(t.flags&2097155)===
0)throw new n.ErrnoError(28);n.doTruncate(t,t.node,r)},utime(e,r,t){var a=n.lookupPath(e,{follow:!0}),i=a.node,o=n.checkOpExists(
i.node_ops.setattr,63);o(i,{atime:r,mtime:t})},open(e,r,t=438){if(e==="")throw new n.ErrnoError(44);r=typeof r=="string"?
qa(r):r,r&64?t=t&4095|32768:t=0;var a,i;if(typeof e=="object")a=e;else{i=e.endsWith("/");var o=n.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});a=o.node,e=o.path}var s=!1;if(r&64)if(a){if(r&128)throw new n.ErrnoError(20)}else{if(i)throw new n.
ErrnoError(31);a=n.mknod(e,t|511,0),s=!0}if(!a)throw new n.ErrnoError(44);if(n.isChrdev(a.mode)&&(r&=-513),r&65536&&!n.isDir(
a.mode))throw new n.ErrnoError(54);if(!s){var u=n.mayOpen(a,r);if(u)throw new n.ErrnoError(u)}r&512&&!s&&n.truncate(a,0),
r&=-131713;var m=n.createStream({node:a,path:n.getPath(a),flags:r,seekable:!0,position:0,stream_ops:a.stream_ops,ungotten:[],
error:!1});return m.stream_ops.open&&m.stream_ops.open(m),s&&n.chmod(a,t&511),l.logReadFiles&&!(r&1)&&(e in n.readFiles||
(n.readFiles[e]=1)),m},close(e){if(n.isClosed(e))throw new n.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{n.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(n.isClosed(e))throw new n.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new n.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new n.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,a,i){if(a<
0||i<0)throw new n.ErrnoError(28);if(n.isClosed(e))throw new n.ErrnoError(8);if((e.flags&2097155)===1)throw new n.ErrnoError(
8);if(n.isDir(e.node.mode))throw new n.ErrnoError(31);if(!e.stream_ops.read)throw new n.ErrnoError(28);var o=typeof i<"u";
if(!o)i=e.position;else if(!e.seekable)throw new n.ErrnoError(70);var s=e.stream_ops.read(e,r,t,a,i);return o||(e.position+=
s),s},write(e,r,t,a,i,o){if(a<0||i<0)throw new n.ErrnoError(28);if(n.isClosed(e))throw new n.ErrnoError(8);if((e.flags&2097155)===
0)throw new n.ErrnoError(8);if(n.isDir(e.node.mode))throw new n.ErrnoError(31);if(!e.stream_ops.write)throw new n.ErrnoError(
28);e.seekable&&e.flags&1024&&n.llseek(e,0,2);var s=typeof i<"u";if(!s)i=e.position;else if(!e.seekable)throw new n.ErrnoError(
70);var u=e.stream_ops.write(e,r,t,a,i,o);return s||(e.position+=u),u},mmap(e,r,t,a,i){if((a&2)!==0&&(i&2)===0&&(e.flags&
2097155)!==2)throw new n.ErrnoError(2);if((e.flags&2097155)===1)throw new n.ErrnoError(2);if(!e.stream_ops.mmap)throw new n.
ErrnoError(43);if(!r)throw new n.ErrnoError(28);return e.stream_ops.mmap(e,r,t,a,i)},msync(e,r,t,a,i){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,a,i):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new n.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&de(`Invalid encoding type "${r.encoding}"`);var t=n.open(e,r.flags),a=n.stat(e),i=a.size,o=new Uint8Array(i);return n.
read(t,o,0,i,0),r.encoding==="utf8"&&(o=je(o)),n.close(t),o},writeFile(e,r,t={}){t.flags=t.flags||577;var a=n.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(gr(r))),ArrayBuffer.isView(r)?n.write(a,r,0,r.byteLength,void 0,t.canOwn):
de("Unsupported data type"),n.close(a)},cwd:()=>n.currentPath,chdir(e){var r=n.lookupPath(e,{follow:!0});if(r.node===null)
throw new n.ErrnoError(44);if(!n.isDir(r.node.mode))throw new n.ErrnoError(54);var t=n.nodePermissions(r.node,"x");if(t)
throw new n.ErrnoError(t);n.currentPath=r.path},createDefaultDirectories(){n.mkdir("/tmp"),n.mkdir("/home"),n.mkdir("/ho\
me/web_user")},createDefaultDevices(){n.mkdir("/dev"),n.registerDevice(n.makedev(1,3),{read:()=>0,write:(a,i,o,s,u)=>s,llseek:()=>0}),
n.mkdev("/dev/null",n.makedev(1,3)),Ce.register(n.makedev(5,0),Ce.default_tty_ops),Ce.register(n.makedev(6,0),Ce.default_tty1_ops),
n.mkdev("/dev/tty",n.makedev(5,0)),n.mkdev("/dev/tty1",n.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(mr(
e),r=e.byteLength),e[--r]);n.createDevice("/dev","random",t),n.createDevice("/dev","urandom",t),n.mkdir("/dev/shm"),n.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){n.mkdir("/proc");var e=n.mkdir("/proc/self");n.mkdir("/proc/self/fd"),n.mount(
{mount(){var r=n.createNode(e,"fd",16895,73);return r.stream_ops={llseek:T.stream_ops.llseek},r.node_ops={lookup(t,a){var i=+a,
o=n.getStreamChecked(i),s={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>o.path},id:i+1};return s.parent=
s,s},readdir(){return Array.from(n.streams.entries()).filter(([t,a])=>a).map(([t,a])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?n.createDevice("/dev","stdin",e):n.symlink("/dev/tty","/dev/stdin"),r?n.createDevice(
"/dev","stdout",null,r):n.symlink("/dev/tty","/dev/stdout"),t?n.createDevice("/dev","stderr",null,t):n.symlink("/dev/tty\
1","/dev/stderr"),n.open("/dev/stdin",0),n.open("/dev/stdout",1),n.open("/dev/stderr",1)},staticInit(){n.nameTable=new Array(
4096),n.mount(T,{},"/"),n.createDefaultDirectories(),n.createDefaultDevices(),n.createSpecialDirectories(),n.filesystems=
{MEMFS:T}},init(e,r,t){n.initialized=!0,e??=l.stdin,r??=l.stdout,t??=l.stderr,n.createStandardStreams(e,r,t)},quit(){n.initialized=
!1;for(var e of n.streams)e&&n.close(e)},findObject(e,r){var t=n.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=n.lookupPath(e,{follow:!r});e=t.path}catch{}var a={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=n.lookupPath(e,{parent:!0});a.parentExists=!0,a.parentPath=
t.path,a.parentObject=t.node,a.name=Q.basename(e),t=n.lookupPath(e,{follow:!r}),a.exists=!0,a.path=t.path,a.object=t.node,
a.name=t.node.name,a.isRoot=t.path==="/"}catch(i){a.error=i.errno}return a},createPath(e,r,t,a){e=typeof e=="string"?e:n.
getPath(e);for(var i=r.split("/").reverse();i.length;){var o=i.pop();if(o){var s=Q.join2(e,o);try{n.mkdir(s)}catch(u){if(u.
errno!=20)throw u}e=s}}return s},createFile(e,r,t,a,i){var o=Q.join2(typeof e=="string"?e:n.getPath(e),r),s=hr(a,i);return n.
create(o,s)},createDataFile(e,r,t,a,i,o){var s=r;e&&(e=typeof e=="string"?e:n.getPath(e),s=r?Q.join2(e,r):e);var u=hr(a,
i),m=n.create(s,u);if(t){if(typeof t=="string"){for(var b=new Array(t.length),g=0,B=t.length;g<B;++g)b[g]=t.charCodeAt(g);
t=b}n.chmod(m,u|146);var y=n.open(m,577);n.write(y,t,0,t.length,0,o),n.close(y),n.chmod(m,u)}},createDevice(e,r,t,a){var i=Q.
join2(typeof e=="string"?e:n.getPath(e),r),o=hr(!!t,!!a);n.createDevice.major??=64;var s=n.makedev(n.createDevice.major++,
0);return n.registerDevice(s,{open(u){u.seekable=!1},close(u){a?.buffer?.length&&a(10)},read(u,m,b,g,B){for(var y=0,N=0;N<
g;N++){var R;try{R=t()}catch{throw new n.ErrnoError(29)}if(R===void 0&&y===0)throw new n.ErrnoError(6);if(R==null)break;
y++,m[b+N]=R}return y&&(u.node.atime=Date.now()),y},write(u,m,b,g,B){for(var y=0;y<g;y++)try{a(m[b+y])}catch{throw new n.
ErrnoError(29)}return g&&(u.node.mtime=u.node.ctime=Date.now()),y}}),n.mkdev(i,o,s)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)de("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=v(e.url)}catch{throw new n.ErrnoError(29)}},createLazyFile(e,r,t,a,i){class o{lengthKnown=!1;chunks=[];get(y){
if(!(y>this.length-1||y<0)){var N=y%this.chunkSize,R=y/this.chunkSize|0;return this.getter(R)[N]}}setDataGetter(y){this.
getter=y}cacheLength(){var y=new XMLHttpRequest;y.open("HEAD",t,!1),y.send(null),y.status>=200&&y.status<300||y.status===
304||de("Couldn't load "+t+". Status: "+y.status);var N=Number(y.getResponseHeader("Content-length")),R,U=(R=y.getResponseHeader(
"Accept-Ranges"))&&R==="bytes",d=(R=y.getResponseHeader("Content-Encoding"))&&R==="gzip",j=1024*1024;U||(j=N);var M=(ie,pe)=>{
ie>pe&&de("invalid range ("+ie+", "+pe+") or no bytes requested!"),pe>N-1&&de("only "+N+" bytes available! programmer er\
ror!");var X=new XMLHttpRequest;return X.open("GET",t,!1),N!==j&&X.setRequestHeader("Range","bytes="+ie+"-"+pe),X.responseType=
"arraybuffer",X.overrideMimeType&&X.overrideMimeType("text/plain; charset=x-user-defined"),X.send(null),X.status>=200&&X.
status<300||X.status===304||de("Couldn't load "+t+". Status: "+X.status),X.response!==void 0?new Uint8Array(X.response||
[]):gr(X.responseText||"")},P=this;P.setDataGetter(ie=>{var pe=ie*j,X=(ie+1)*j-1;return X=Math.min(X,N-1),typeof P.chunks[ie]>
"u"&&(P.chunks[ie]=M(pe,X)),typeof P.chunks[ie]>"u"&&de("doXHR failed!"),P.chunks[ie]}),(d||!N)&&(j=N=1,N=this.getter(0).
length,j=N,se("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=N,this._chunkSize=
j,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){O||de("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var s=new o,u={isDevice:!1,contents:s}}else
var u={isDevice:!1,url:t};var m=n.createFile(e,r,u,a,i);u.contents?m.contents=u.contents:u.url&&(m.contents=null,m.url=u.
url),Object.defineProperties(m,{usedBytes:{get:function(){return this.contents.length}}});var b={};for(const[B,y]of Object.
entries(m.stream_ops))b[B]=(...N)=>(n.forceLoadFile(m),y(...N));function g(B,y,N,R,U){var d=B.node.contents;if(U>=d.length)
return 0;var j=Math.min(d.length-U,R);if(d.slice)for(var M=0;M<j;M++)y[N+M]=d[U+M];else for(var M=0;M<j;M++)y[N+M]=d.get(
U+M);return j}return b.read=(B,y,N,R,U)=>(n.forceLoadFile(m),g(B,y,N,R,U)),b.mmap=(B,y,N,R,U)=>{n.forceLoadFile(m);var d=br(
y);if(!d)throw new n.ErrnoError(48);return g(B,(c(),ne),d,y,N),{ptr:d,allocated:!0}},m.stream_ops=b,m}},Le=(e,r,t)=>e?je(
(c(),ue),e,r):"",V={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(Q.isAbs(r))return r;var a;if(e===-100)a=n.cwd();else{var i=V.
getStreamFromFD(e);a=i.path}if(r.length==0){if(!t)throw new n.ErrnoError(44);return a}return a+"/"+r},writeStat(e,r){(c(),
C)[e/4]=r.dev,(c(),C)[(e+4)/4]=r.mode,(c(),S)[(e+8)/8]=BigInt(r.nlink),(c(),C)[(e+16)/4]=r.uid,(c(),C)[(e+20)/4]=r.gid,(c(),
C)[(e+24)/4]=r.rdev,(c(),K)[(e+32)/8]=BigInt(r.size),(c(),A)[(e+40)/4]=4096,(c(),A)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
a=r.mtime.getTime(),i=r.ctime.getTime();return(c(),K)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(c(),S)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(c(),K)[(e+64)/8]=BigInt(Math.floor(a/1e3)),(c(),S)[(e+72)/8]=BigInt(a%1e3*1e3*1e3),(c(),K)[(e+80)/8]=BigInt(Math.
floor(i/1e3)),(c(),S)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(c(),K)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(c(),C)[(e+8)/
4]=r.bsize,(c(),C)[(e+72)/4]=r.bsize,(c(),K)[(e+16)/8]=BigInt(r.blocks),(c(),K)[(e+24)/8]=BigInt(r.bfree),(c(),K)[(e+32)/
8]=BigInt(r.bavail),(c(),K)[(e+40)/8]=BigInt(r.files),(c(),K)[(e+48)/8]=BigInt(r.ffree),(c(),C)[(e+56)/4]=r.fsid,(c(),C)[(e+
80)/4]=r.flags,(c(),C)[(e+64)/4]=r.namelen},doMsync(e,r,t,a,i){if(!n.isFile(r.node.mode))throw new n.ErrnoError(43);if(a&
2)return 0;var o=(c(),ue).slice(e,e+t);n.msync(r,o,i,t,a)},getStreamFromFD(e){var r=n.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Le(e);return r}};function lt(e,r,t){if(k)return Z(3,0,1,e,r,t);t=p(t),V.varargs=t;try{var a=V.getStreamFromFD(
e);switch(r){case 0:{var i=dr();if(i<0)return-28;for(;n.streams[i];)i++;var o;return o=n.dupStream(a,i),o.fd}case 1:case 2:
return 0;case 3:return a.flags;case 4:{var i=dr();return a.flags|=i,0}case 5:{var i=Ue(),s=0;return(c(),Se)[(i+s)/2]=2,0}case 6:case 7:
return 0}return-28}catch(u){if(typeof n>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function $a(e,r){if(k)return Z(
4,0,1,e,r);r=p(r);try{return V.writeStat(r,n.fstat(e))}catch(t){if(typeof n>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var ye=(e,r,t)=>nt(e,(c(),ue),r,t);function ct(e,r){if(k)return Z(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=n.cwd(),a=we(t)+1;return r<a?-68:(ye(t,e,r),a)}catch(i){if(typeof n>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}
function ut(e,r,t){if(k)return Z(6,0,1,e,r,t);r=p(r),t=p(t);try{var a=V.getStreamFromFD(e);a.getdents||=n.readdir(a.path);
for(var i=280,o=0,s=n.llseek(a,0,1),u=Math.floor(s/i),m=Math.min(a.getdents.length,u+Math.floor(t/i)),b=u;b<m;b++){var g,
B,y=a.getdents[b];if(y===".")g=a.node.id,B=4;else if(y===".."){var N=n.lookupPath(a.path,{parent:!0});g=N.node.id,B=4}else{
var R;try{R=n.lookupNode(a.node,y)}catch(U){if(U?.errno===28)continue;throw U}g=R.id,B=n.isChrdev(R.mode)?2:n.isDir(R.mode)?
4:n.isLink(R.mode)?10:8}(c(),K)[(r+o)/8]=BigInt(g),(c(),K)[(r+o+8)/8]=BigInt((b+1)*i),(c(),Se)[(r+o+16)/2]=280,(c(),ne)[r+
o+18]=B,ye(y,r+o+19,256),o+=i}return n.llseek(a,b*i,0),o}catch(U){if(typeof n>"u"||U.name!=="ErrnoError")throw U;return-U.
errno}}function ft(e,r,t){if(k)return Z(7,0,1,e,r,t);t=p(t),V.varargs=t;try{var a=V.getStreamFromFD(e);switch(r){case 21509:
return a.tty?0:-59;case 21505:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tcgets){var i=a.tty.ops.ioctl_tcgets(a),o=Ue();(c(),
A)[o/4]=i.c_iflag||0,(c(),A)[(o+4)/4]=i.c_oflag||0,(c(),A)[(o+8)/4]=i.c_cflag||0,(c(),A)[(o+12)/4]=i.c_lflag||0;for(var s=0;s<
32;s++)(c(),ne)[o+s+17]=i.c_cc[s]||0;return 0}return 0}case 21510:case 21511:case 21512:return a.tty?0:-59;case 21506:case 21507:case 21508:{
if(!a.tty)return-59;if(a.tty.ops.ioctl_tcsets){for(var o=Ue(),u=(c(),A)[o/4],m=(c(),A)[(o+4)/4],b=(c(),A)[(o+8)/4],g=(c(),
A)[(o+12)/4],B=[],s=0;s<32;s++)B.push((c(),ne)[o+s+17]);return a.tty.ops.ioctl_tcsets(a.tty,r,{c_iflag:u,c_oflag:m,c_cflag:b,
c_lflag:g,c_cc:B})}return 0}case 21519:{if(!a.tty)return-59;var o=Ue();return(c(),A)[o/4]=0,0}case 21520:return a.tty?-28:
-59;case 21537:case 21531:{var o=Ue();return n.ioctl(a,r,o)}case 21523:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tiocgwinsz){
var y=a.tty.ops.ioctl_tiocgwinsz(a.tty),o=Ue();(c(),Se)[o/2]=y[0],(c(),Se)[(o+2)/2]=y[1]}return 0}case 21524:return a.tty?
0:-59;case 21515:return a.tty?0:-59;default:return-28}}catch(N){if(typeof n>"u"||N.name!=="ErrnoError")throw N;return-N.
errno}}function Pa(e,r){if(k)return Z(8,0,1,e,r);e=p(e),r=p(r);try{return e=V.getStr(e),V.writeStat(r,n.lstat(e))}catch(t){
if(typeof n>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function Ja(e,r,t,a){if(k)return Z(9,0,1,e,r,t,a);r=p(r),
t=p(t);try{r=V.getStr(r);var i=a&256,o=a&4096;return a=a&-6401,r=V.calculateAt(e,r,o),V.writeStat(t,i?n.lstat(r):n.stat(
r))}catch(s){if(typeof n>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function dt(e,r,t,a){if(k)return Z(10,0,1,e,
r,t,a);r=p(r),a=p(a),V.varargs=a;try{r=V.getStr(r),r=V.calculateAt(e,r);var i=a?dr():0;return n.open(r,t,i).fd}catch(o){
if(typeof n>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function mt(e,r){if(k)return Z(11,0,1,e,r);e=p(e),r=p(r);
try{return e=V.getStr(e),V.writeStat(r,n.stat(e))}catch(t){if(typeof n>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Ha=()=>de("");function Ka(e){e=p(e),Ar(e,!O,1,!x,5242880,!1),L.threadInitTLS()}var vr=e=>{if(e instanceof qr||e=="un\
wind")return ee;_(1,e)},Ya=()=>{if(!sr())try{if(k){tr()&&Cr(ee);return}cr(ee)}catch(e){vr(e)}},Ee=e=>{if(!ke)try{e(),Ya()}catch(r){
vr(r)}};function wr(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((c(),A),e/4,e);r.value.then(Ze);var t=e+228;
Atomics.store((c(),A),t/4,1)}}var Ze=()=>Ee(()=>{var e=tr();e&&(wr(e),Zt())});function Xa(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
Ze);else if(k)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=L.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var er=[];function Za(e,r,t,a,i){t=p(t),i=p(i),a/=2,er.length=a;for(var o=i/8,s=0;s<a;s++)(c(),K)[o+2*s]?
er[s]=(c(),K)[o+2*s+1]:er[s]=(c(),Ie)[o+2*s+1];var u=ci[e];L.currentProxiedOperationCallerThread=t;var m=u(...er);return L.
currentProxiedOperationCallerThread=0,typeof m=="bigint"&&(m=p(m)),m}function en(e){e=p(e),k?postMessage({cmd:"cleanupTh\
read",thread:e}):Qr(e)}function rn(e){e=p(e),w&&L.pthreads[e].ref()}var tn=e=>e%4===0&&(e%100!==0||e%400===0),an=[0,31,60,
91,121,152,182,213,244,274,305,335],nn=[0,31,59,90,120,151,181,212,243,273,304,334],on=e=>{var r=tn(e.getFullYear()),t=r?
an:nn,a=t[e.getMonth()]+e.getDate()-1;return a};function sn(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(c(),A)[r/4]=t.getSeconds(),
(c(),A)[(r+4)/4]=t.getMinutes(),(c(),A)[(r+8)/4]=t.getHours(),(c(),A)[(r+12)/4]=t.getDate(),(c(),A)[(r+16)/4]=t.getMonth(),
(c(),A)[(r+20)/4]=t.getFullYear()-1900,(c(),A)[(r+24)/4]=t.getDay();var a=on(t)|0;(c(),A)[(r+28)/4]=a,(c(),K)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),o=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
s=i.getTimezoneOffset(),u=(o!=s&&t.getTimezoneOffset()==Math.min(s,o))|0;(c(),A)[(r+32)/4]=u}function pt(e,r,t,a,i,o,s){
if(k)return Z(12,0,1,e,r,t,a,i,o,s);e=p(e),i=p(i),o=p(o),s=p(s);try{var u=V.getStreamFromFD(a),m=n.mmap(u,e,i,r,t),b=m.ptr;
return(c(),A)[o/4]=m.allocated,(c(),S)[s/8]=BigInt(b),0}catch(g){if(typeof n>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function gt(e,r,t,a,i,o){if(k)return Z(13,0,1,e,r,t,a,i,o);e=p(e),r=p(r),o=p(o);try{var s=V.getStreamFromFD(i);t&
2&&V.doMsync(e,s,r,a,o)}catch(u){if(typeof n>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var ln=function(e,r,t,a){
e=p(e),r=p(r),t=p(t),a=p(a);var i=new Date().getFullYear(),o=new Date(i,0,1),s=new Date(i,6,1),u=o.getTimezoneOffset(),m=s.
getTimezoneOffset(),b=Math.max(u,m);(c(),S)[e/8]=BigInt(b*60),(c(),A)[r/4]=+(u!=m);var g=N=>{var R=N>=0?"-":"+",U=Math.abs(
N),d=String(Math.floor(U/60)).padStart(2,"0"),j=String(U%60).padStart(2,"0");return`UTC${R}${d}${j}`},B=g(u),y=g(m);m<u?
(ye(B,t,17),ye(y,a,17)):(ye(B,a,17),ye(y,t,17))},bt=()=>performance.timeOrigin+performance.now(),ht=()=>Date.now(),cn=e=>e>=
0&&e<=3;function un(e,r,t){if(t=p(t),!cn(e))return 28;var a;e===0?a=ht():a=bt();var i=Math.round(a*1e3*1e3);return(c(),K)[t/
8]=BigInt(i),0}var fn=()=>{},De=()=>{Xe+=1},dn=()=>{throw De(),"unwind"},mn=()=>new Error().stack.toString(),pn=e=>{var r=mn(),
t=r.split(`
`);r="";var a=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var o of t){
var s="",u="",m=0,b=0,g=i.exec(o);if(g?.length==5)s=g[1],u=g[2],m=g[3],b=g[4];else if(g=a.exec(o),g?.length>=4)s=g[1],u=
g[2],m=g[3],b=g[4]|0;else{r+=o+`
`;continue}if(s=="_emscripten_log"||s=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(u=u.substring(u.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${s} (${u}:${m}:${b})
`)}return r=r.replace(/\s+$/,""),r};function gn(e,r,t){r=p(r);var a=pn(e);if(!r||t<=0)return we(a)+1;var i=ye(a,r,t);return i+
1}var _t=()=>4294967296,bn=()=>BigInt(_t()),hn=()=>2,_n=()=>w?require("os").cpus().length:navigator.hardwareConcurrency,
vn=e=>{var r=ve.buffer.byteLength,t=(e-r+65535)/65536|0;try{return ve.grow(BigInt(t)),He(),1}catch{}};function wn(e){e=p(
e);var r=(c(),ue).length;if(e<=r)return!1;var t=_t();if(e>t)return!1;for(var a=1;a<=4;a*=2){var i=r*(1+.2/a);i=Math.min(
i,e+100663296);var o=Math.min(t,it(Math.max(e,i),65536)),s=vn(o);if(s)return!0}return!1}var Be=e=>{var r=we(e)+1,t=lr(r);
return ye(e,t,r),t},yn=(e,r)=>{(c(),C)[e/4]=r;var t=(c(),C)[e/4];(c(),C)[(e+4)/4]=(r-t)/4294967296},En=e=>{var r=we(e)+1,
t=Gt(r);return t&&ye(e,t,r),t},Fe=e=>(c(),C)[e/4]+(c(),A)[(e+4)/4]*4294967296,f={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
f.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{f.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return f.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Wt(r);return f.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=yr(r);return f.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Er(r);return f.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{H(e.mapState==="unmapped");var t=Qt(r);return f.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=kr(r);return f.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Sr(r);return f.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Br(r);return f.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Nr(r);return f.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=xr(
r),a=Vt(r,t);return f.Internals.jsObjectInsert(t,e.queue),f.Internals.jsObjectInsert(a,e),l.peercomputeOnDevice?.(e),a},
importJsExternalTexture:(e,r=0)=>{var t=Ct(r);return f.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=Tt(
r);return f.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Ut(r);return f.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=xr(r);return f.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Rt(r);return f.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=jt(r);return f.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=Dt(r);return f.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Ot(r);return f.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=Mt(r);return f.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=$t(
r);return f.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Lt(r);return f.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=zt(r);return f.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=qt(r);return f.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,a)=>{var i=he(),o=Be(t);((s,u,m)=>Zr(e).call(null,s,BigInt(u),BigInt(m)))(r,BigInt(o),a),_e(i)},
iterateExtensions:(e,r)=>{for(var t=Number((c(),S)[e/8]);t;t=Number((c(),S)[t/8])){var a=(c(),A)[(t+8)/4];r[a](t)}},setStringView:(e,r,t)=>{
(c(),S)[e/8]=BigInt(r),(c(),S)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((c(),S)[e/8]),t=Number((c(),
S)[(e+8)/8]);return Le(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((c(),S)[e/8]),t=Number((c(),S)[(e+8)/8]);
return r?Le(r,t):t===0?"":void 0},makeColor:e=>({r:(c(),Ie)[e/8],g:(c(),Ie)[(e+8)/8],b:(c(),Ie)[(e+16)/8],a:(c(),Ie)[(e+
24)/8]}),makeExtent3D:e=>({width:(c(),C)[e/4],height:(c(),C)[(e+4)/4],depthOrArrayLayers:(c(),C)[(e+8)/4]}),makeOrigin3D:e=>({
x:(c(),C)[e/4],y:(c(),C)[(e+4)/4],z:(c(),C)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:f.getJsObject(Number((c(),S)[e/
8])),mipLevel:(c(),C)[(e+8)/4],origin:f.makeOrigin3D(e+12),aspect:f.TextureAspect[(c(),A)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(c(),C)[(e+8)/4],t=(c(),C)[(e+12)/4];return{offset:Fe(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=f.makeTexelCopyBufferLayout(r);return t.buffer=f.getJsObject(Number((c(),
S)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:f.getJsObject(Number((c(),S)[(e+8)/8])),beginningOfPassWriteIndex:(c(),
C)[(e+16)/4],endOfPassWriteIndex:(c(),C)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},a=0;a<e;++a){var i=r+
32*a,o=f.makeStringFromStringView(i+8);t[o]=(c(),Ie)[(i+24)/8]}return t}},makePipelineLayout:e=>e?f.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:f.getJsObject(Number((c(),S)[(e+8)/8])),constants:f.makePipelineConstants(Number(
(c(),S)[(e+32)/8]),Number((c(),S)[(e+40)/8])),entryPoint:f.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((c(),S)[(e+24)/8])),compute:f.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(d){if(d)return{topology:f.PrimitiveTopology[(c(),A)[(d+8)/4]],stripIndexFormat:f.
IndexFormat[(c(),A)[(d+12)/4]],frontFace:f.FrontFace[(c(),A)[(d+16)/4]],cullMode:f.CullMode[(c(),A)[(d+20)/4]],unclippedDepth:!!(c(),
C)[(d+24)/4]}}function t(d){if(d)return{operation:f.BlendOperation[(c(),A)[d/4]],srcFactor:f.BlendFactor[(c(),A)[(d+4)/4]],
dstFactor:f.BlendFactor[(c(),A)[(d+8)/4]]}}function a(d){if(d)return{alpha:t(d+12),color:t(d+0)}}function i(d){var j=f.TextureFormat[(c(),
A)[(d+8)/4]];return j?{format:j,blend:a(Number((c(),S)[(d+16)/8])),writeMask:(c(),C)[(d+24)/4]}:void 0}function o(d,j){for(var M=[],
P=0;P<d;++P)M.push(i(j+32*P));return M}function s(d){return{compare:f.CompareFunction[(c(),A)[d/4]],failOp:f.StencilOperation[(c(),
A)[(d+4)/4]],depthFailOp:f.StencilOperation[(c(),A)[(d+8)/4]],passOp:f.StencilOperation[(c(),A)[(d+12)/4]]}}function u(d){
if(d)return{format:f.TextureFormat[(c(),A)[(d+8)/4]],depthWriteEnabled:!!(c(),C)[(d+12)/4],depthCompare:f.CompareFunction[(c(),
A)[(d+16)/4]],stencilFront:s(d+20),stencilBack:s(d+36),stencilReadMask:(c(),C)[(d+52)/4],stencilWriteMask:(c(),C)[(d+56)/
4],depthBias:(c(),A)[(d+60)/4],depthBiasSlopeScale:(c(),ir)[(d+64)/4],depthBiasClamp:(c(),ir)[(d+68)/4]}}function m(d){return{
format:f.VertexFormat[(c(),A)[(d+8)/4]],offset:Fe(d+16),shaderLocation:(c(),C)[(d+24)/4]}}function b(d,j){for(var M=[],P=0;P<
d;++P)M.push(m(j+P*32));return M}function g(d){if(d){var j=f.VertexStepMode[(c(),A)[(d+8)/4]],M=Number((c(),S)[(d+24)/8]);
return!j&&!M?null:{arrayStride:Fe(d+16),stepMode:j,attributes:b(M,Number((c(),S)[(d+32)/8]))}}}function B(d,j){if(d){for(var M=[],
P=0;P<d;++P)M.push(g(j+P*40));return M}}function y(d){if(d){var j={module:f.getJsObject(Number((c(),S)[(d+8)/8])),constants:f.
makePipelineConstants(Number((c(),S)[(d+32)/8]),Number((c(),S)[(d+40)/8])),buffers:B(Number((c(),S)[(d+48)/8]),Number((c(),
S)[(d+56)/8])),entryPoint:f.makeStringFromOptionalStringView(d+16)};return j}}function N(d){if(d)return{count:(c(),C)[(d+
8)/4],mask:(c(),C)[(d+12)/4],alphaToCoverageEnabled:!!(c(),C)[(d+16)/4]}}function R(d){if(d){var j={module:f.getJsObject(
Number((c(),S)[(d+8)/8])),constants:f.makePipelineConstants(Number((c(),S)[(d+32)/8]),Number((c(),S)[(d+40)/8])),targets:o(
Number((c(),S)[(d+48)/8]),Number((c(),S)[(d+56)/8])),entryPoint:f.makeStringFromOptionalStringView(d+16)};return j}}var U={
label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((c(),S)[(e+24)/8])),vertex:y(e+32),primitive:r(
e+96),depthStencil:u(Number((c(),S)[(e+128)/8])),multisample:N(e+136),fragment:R(Number((c(),S)[(e+160)/8]))};return U},
fillLimitStruct:(e,r)=>{var t=Number((c(),S)[r/8]);function a(s,u,m,b=0){var g=e[s]??b;(c(),C)[(u+m)/4]=g}function i(s,u,m,b=0){
var g=e[s]??b;yn(u+m,g)}if(a("maxTextureDimension1D",r,8),a("maxTextureDimension2D",r,12),a("maxTextureDimension3D",r,16),
a("maxTextureArrayLayers",r,20),a("maxBindGroups",r,24),a("maxBindGroupsPlusVertexBuffers",r,28),a("maxBindingsPerBindGr\
oup",r,32),a("maxDynamicUniformBuffersPerPipelineLayout",r,36),a("maxDynamicStorageBuffersPerPipelineLayout",r,40),a("ma\
xSampledTexturesPerShaderStage",r,44),a("maxSamplersPerShaderStage",r,48),a("maxStorageBuffersPerShaderStage",r,52),a("m\
axStorageTexturesPerShaderStage",r,56),a("maxUniformBuffersPerShaderStage",r,60),a("minUniformBufferOffsetAlignment",r,80),
a("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageBufferBindingSize",r,72),a(
"maxVertexBuffers",r,88),i("maxBufferSize",r,96),a("maxVertexAttributes",r,104),a("maxVertexBufferArrayStride",r,108),a(
"maxInterStageShaderVariables",r,112),a("maxColorAttachments",r,116),a("maxColorAttachmentBytesPerSample",r,120),a("maxC\
omputeWorkgroupStorageSize",r,124),a("maxComputeInvocationsPerWorkgroup",r,128),a("maxComputeWorkgroupSizeX",r,132),a("m\
axComputeWorkgroupSizeY",r,136),a("maxComputeWorkgroupSizeZ",r,140),a("maxComputeWorkgroupsPerDimension",r,144),a("maxIm\
mediateSize",r,148),t!==0){(c(),A)[(t+8)/4];var o=t;a("maxStorageBuffersInVertexStage",o,16,e.maxStorageBuffersPerShaderStage),
a("maxStorageBuffersInFragmentStage",o,24,e.maxStorageBuffersPerShaderStage),a("maxStorageTexturesInVertexStage",o,20,e.
maxStorageTexturesPerShaderStage),a("maxStorageTexturesInFragmentStage",o,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(c(),C)[(r+88)/4]=e.subgroupMinSize,(c(),C)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
a=En(t),i=we(e.vendor);f.setStringView(r+8,a,i),a+=i;var o=we(e.architecture);f.setStringView(r+24,a,o),a+=o;var s=we(e.
device);f.setStringView(r+40,a,s),a+=s;var u=we(e.description);f.setStringView(r+56,a,u),a+=u,(c(),A)[(r+72)/4]=2;var m=e.
isFallbackAdapter?3:4;(c(),A)[(r+76)/4]=m,(c(),C)[(r+80)/4]=0,(c(),C)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},kn={undefined:1,unknown:1,destroyed:2},
Ge=()=>{Xe-=1};function Sn(e,r,t,a,i,o){e=p(e),r=p(r),t=p(t),a=p(a),i=p(i),o=p(o);var s=f.getJsObject(e),u={};if(o){var m=Number(
(c(),S)[(o+24)/8]);if(m){var b=Number((c(),S)[(o+32)/8]);u.requiredFeatures=Array.from((c(),C).subarray(b/4,(b+m*4)/4),d=>f.
FeatureName[d])}var g=Number((c(),S)[(o+40)/8]);if(g){let d=function(M,P,ie,pe=!1){var X=P+ie,We=(c(),C)[X/4];We!=4294967295&&
(!pe||We!=0)&&(y[M]=We)},j=function(M,P,ie){var pe=P+ie,X=(c(),C)[pe/4],We=(c(),C)[(pe+4)/4];(X!=4294967295||We!=4294967295)&&
(y[M]=Fe(pe))};var B=Number((c(),S)[g/8]),y={};if(d("maxTextureDimension1D",g,8),d("maxTextureDimension2D",g,12),d("maxT\
extureDimension3D",g,16),d("maxTextureArrayLayers",g,20),d("maxBindGroups",g,24),d("maxBindGroupsPlusVertexBuffers",g,28),
d("maxBindingsPerBindGroup",g,32),d("maxDynamicUniformBuffersPerPipelineLayout",g,36),d("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),d("maxSampledTexturesPerShaderStage",g,44),d("maxSamplersPerShaderStage",g,48),d("maxStorageBuffersPer\
ShaderStage",g,52),d("maxStorageTexturesPerShaderStage",g,56),d("maxUniformBuffersPerShaderStage",g,60),d("minUniformBuf\
ferOffsetAlignment",g,80),d("minStorageBufferOffsetAlignment",g,84),j("maxUniformBufferBindingSize",g,64),j("maxStorageB\
ufferBindingSize",g,72),d("maxVertexBuffers",g,88),j("maxBufferSize",g,96),d("maxVertexAttributes",g,104),d("maxVertexBu\
fferArrayStride",g,108),d("maxInterStageShaderVariables",g,112),d("maxColorAttachments",g,116),d("maxColorAttachmentByte\
sPerSample",g,120),d("maxComputeWorkgroupStorageSize",g,124),d("maxComputeInvocationsPerWorkgroup",g,128),d("maxComputeW\
orkgroupSizeX",g,132),d("maxComputeWorkgroupSizeY",g,136),d("maxComputeWorkgroupSizeZ",g,140),d("maxComputeWorkgroupsPer\
Dimension",g,144),d("maxImmediateSize",g,148,!0),B!==0){(c(),A)[(B+8)/4];var N=B;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(d("maxStorageBuffersInVertexStage",N,16),d("maxStorageTexturesInVertexStage",N,20),d("maxStorageBuffersInFra\
gmentStage",N,24),d("maxStorageTexturesInFragmentStage",N,28))}u.requiredLimits=y}var R=Number((c(),S)[(o+48)/8]);if(R){
var U={label:f.makeStringFromOptionalStringView(R+8)};u.defaultQueue=U}u.label=f.makeStringFromOptionalStringView(o+8)}De(),
f.Internals.futureInsert(r,s.requestDevice(u).then(d=>{Ge(),Ee(()=>{f.Internals.jsObjectInsert(i,d.queue),f.Internals.jsObjectInsert(
a,d),l.peercomputeOnDevice?.(d),a=BigInt(a),f.Internals.futureInsert(t,d.lost.then(j=>{Ee(()=>{d.onuncapturederror=ie=>{};
var M=he(),P=Be(j.message);Ir(t,kn[j.reason],BigInt(P)),_e(M)})})),d.onuncapturederror=j=>{var M=5;j.error instanceof GPUValidationError?
M=2:j.error instanceof GPUOutOfMemoryError?M=3:j.error instanceof GPUInternalError&&(M=4);var P=he(),ie=Be(j.error.message);
Jt(BigInt(a),M,BigInt(ie)),_e(P)},Gr(r,1,BigInt(a),0n)})},d=>{Ge(),Ee(()=>{var j=he(),M=Be(d.message);Gr(r,3,BigInt(a),BigInt(
M)),t&&Ir(t,4,BigInt(M)),_e(j)})}))}function Bn(e){e=p(e);var r=f.getJsObject(e),t=f.Internals.bufferOnUnmaps[e];if(t){for(var a=0;a<
t.length;++a)t[a]();delete f.Internals.bufferOnUnmaps[e]}r.destroy()}var Nn=function(e,r,t){e=p(e),r=p(r),t=p(t);var a=(()=>{
var i=f.getJsObject(e);t==-1&&(t=void 0);var o;try{o=i.getMappedRange(r,t)}catch{return 0n}var s=ea(16,o.byteLength);return(c(),
ue).set(new Uint8Array(o),s),f.Internals.bufferOnUnmaps[e].push(()=>At(s)),s})();return BigInt(a)},xn=function(e,r,t,a,i){
e=p(e),r=p(r),t=p(t),a=p(a),i=p(i);var o=f.getJsObject(e);f.Internals.bufferOnUnmaps[e]=[],i==-1&&(i=void 0),De(),f.Internals.
futureInsert(r,o.mapAsync(t,a,i).then(()=>{Ge(),Ee(()=>{Fr(r,1,0n)})},s=>{Ge(),Ee(()=>{var u=he(),m=Be(s.message),b=s.name===
"AbortError"?4:s.name==="OperationError"?3:0;Fr(r,b,BigInt(m)),delete f.Internals.bufferOnUnmaps[e]})}))};function In(e){
e=p(e);var r=f.getJsObject(e),t=f.Internals.bufferOnUnmaps[e];if(t){for(var a=0;a<t.length;++a)t[a]();delete f.Internals.
bufferOnUnmaps[e],r.unmap()}}function Fn(e){e=p(e),delete f.Internals.jsObjects[e]}function Gn(e,r,t){e=p(e),r=p(r),t=p(
t);var a=!!(c(),C)[(r+40)/4],i={label:f.makeStringFromOptionalStringView(r+8),usage:(c(),C)[(r+24)/4],size:Fe(r+32),mappedAtCreation:a},
o=f.getJsObject(e),s;try{s=o.createBuffer(i)}catch{return!1}return f.Internals.jsObjectInsert(t,s),a&&(f.Internals.bufferOnUnmaps[t]=
[]),!0}function An(e,r,t){e=p(e),r=p(r),t=p(t);var a=Number((c(),S)[r/8]),i=(c(),A)[(a+8)/4],o={label:f.makeStringFromOptionalStringView(
r+8),code:""};switch(i){case 2:{o.code=f.makeStringFromStringView(a+16);break}}var s=f.getJsObject(e);f.Internals.jsObjectInsert(
t,s.createShaderModule(o))}var Cn=e=>{const r=f.getJsObject(e);r.onuncapturederror=null,r.destroy()};function Tn(e,r,t,a){
r=p(r),t=p(t),a=p(a);var i;if(t){i={featureLevel:f.FeatureLevel[(c(),A)[(t+8)/4]],powerPreference:f.PowerPreference[(c(),
A)[(t+12)/4]],forceFallbackAdapter:!!(c(),C)[(t+16)/4]};var o=Number((c(),S)[t/8]);if(o!==0){(c(),A)[(o+8)/4];var s=o;i.
xrCompatible=!!(c(),C)[(s+16)/4]}}if(!("gpu"in navigator)){var u=he(),m=Be("WebGPU not available on this browser (naviga\
tor.gpu is not available)");qe(r,3,BigInt(a),BigInt(m)),_e(u);return}De(),f.Internals.futureInsert(r,navigator.gpu.requestAdapter(
i).then(b=>{Ge(),Ee(()=>{if(b)f.Internals.jsObjectInsert(a,b),qe(r,1,BigInt(a),0n);else{var g=he(),B=Be("WebGPU not avai\
lable on this browser (requestAdapter returned null)");qe(r,3,BigInt(a),BigInt(B)),_e(g)}})},b=>{Ge(),Ee(()=>{var g=he(),
B=Be(b.message);qe(r,4,BigInt(a),BigInt(B)),_e(g)})}))}var Un=function(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);De(),f.
Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Ge(),Ee(()=>{Pt(r,1)})}))},vt=function(e,r,t){return e=p(e),r=
p(r),t=p(t),me.handleAsync(async()=>{var a=[];if(t){var i=(c(),A)[t/4];a.length=r+1,a[r]=new Promise(m=>setTimeout(m,i,0))}else
a.length=r;for(var o=0;o<r;++o){var s=Fe(e+o*8);if(!(s in f.Internals.futures))return s;a[o]=f.Internals.futures[s]}const u=await Promise.
race(a);return delete f.Internals.futures[u],u})};vt.isAsync=!0;var rr={},Rn=()=>G||"./this.program",ze=()=>{if(!ze.strings){
var e=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_us\
er",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Rn()};for(var t in rr)rr[t]===void 0?delete r[t]:r[t]=rr[t];var a=[];
for(var t in r)a.push(`${t}=${r[t]}`);ze.strings=a}return ze.strings};function wt(e,r){if(k)return Z(14,0,1,e,r);e=p(e),
r=p(r);var t=0,a=0;for(var i of ze()){var o=r+t;(c(),S)[(e+a)/8]=BigInt(o),t+=ye(i,o,1/0)+1,a+=8}return 0}function yt(e,r){
if(k)return Z(15,0,1,e,r);e=p(e),r=p(r);var t=ze();(c(),S)[e/8]=BigInt(t.length);var a=0;for(var i of t)a+=we(i)+1;return(c(),
S)[r/8]=BigInt(a),0}function Et(e){if(k)return Z(16,0,1,e);try{var r=V.getStreamFromFD(e);return n.close(r),0}catch(t){if(typeof n>
"u"||t.name!=="ErrnoError")throw t;return t.errno}}var jn=(e,r,t,a)=>{for(var i=0,o=0;o<t;o++){var s=Number((c(),S)[r/8]),
u=Number((c(),S)[(r+8)/8]);r+=16;var m=n.read(e,(c(),ne),s,u,a);if(m<0)return-1;if(i+=m,m<u)break}return i};function kt(e,r,t,a){
if(k)return Z(17,0,1,e,r,t,a);r=p(r),t=p(t),a=p(a);try{var i=V.getStreamFromFD(e),o=jn(i,r,t);return(c(),S)[a/8]=BigInt(
o),0}catch(s){if(typeof n>"u"||s.name!=="ErrnoError")throw s;return s.errno}}function St(e,r,t,a){if(k)return Z(18,0,1,e,
r,t,a);r=p(r),a=p(a);try{if(isNaN(r))return 61;var i=V.getStreamFromFD(e);return n.llseek(i,r,t),(c(),K)[a/8]=BigInt(i.position),
i.getdents&&r===0&&t===0&&(i.getdents=null),0}catch(o){if(typeof n>"u"||o.name!=="ErrnoError")throw o;return o.errno}}var Dn=(e,r,t,a)=>{
for(var i=0,o=0;o<t;o++){var s=Number((c(),S)[r/8]),u=Number((c(),S)[(r+8)/8]);r+=16;var m=n.write(e,(c(),ne),s,u,a);if(m<
0)return-1;if(i+=m,m<u)break}return i};function Bt(e,r,t,a){if(k)return Z(19,0,1,e,r,t,a);r=p(r),t=p(t),a=p(a);try{var i=V.
getStreamFromFD(e),o=Dn(i,r,t);return(c(),S)[a/8]=BigInt(o),0}catch(s){if(typeof n>"u"||s.name!=="ErrnoError")throw s;return s.
errno}}function On(e,r){e=p(e),r=p(r);try{return mr((c(),ue).subarray(e,e+r)),0}catch(t){if(typeof n>"u"||t.name!=="Errn\
oError")throw t;return t.errno}}function Mn(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillAdapterInfoStruct(t.info,
r),1}function Ln(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillLimitStruct(t.limits,r),1}function zn(e,r){e=p(e);
var t=f.getJsObject(e);return t.features.has(f.FeatureName[r])}var qn=function(e){e=p(e);var r=(()=>{var t=f.getJsObject(
e);return t.size})();return BigInt(r)},Wn=function(e,r){e=p(e),r=p(r);var t=(()=>{var a;r&&(a={label:f.makeStringFromOptionalStringView(
r+8),timestampWrites:f.makePassTimestampWrites(Number((c(),S)[(r+24)/8]))});var i=f.getJsObject(e),o=Br(0n);return f.Internals.
jsObjectInsert(o,i.beginComputePass(a)),o})();return BigInt(t)};function Qn(e,r,t,a,i,o){e=p(e),r=p(r),t=p(t),a=p(a),i=p(
i),o=p(o);var s=f.getJsObject(e),u=f.getJsObject(r),m=f.getJsObject(a);s.copyBufferToBuffer(u,t,m,i,o)}var Vn=function(e,r){
e=p(e);var t=(()=>{var a=f.getJsObject(e),i=kr(0n);return f.Internals.jsObjectInsert(i,a.finish()),i})();return BigInt(t)};
function $n(e,r,t,a){e=p(e);var i=f.getJsObject(e);i.dispatchWorkgroups(r,t,a)}function Pn(e){e=p(e);var r=f.getJsObject(
e);r.end()}function Jn(e,r,t,a,i){e=p(e),t=p(t),a=p(a),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(t);a==0?o.setBindGroup(
r,s):o.setBindGroup(r,s,(c(),C),i/4,a)}function Hn(e,r){e=p(e),r=p(r);var t=f.getJsObject(e),a=f.getJsObject(r);t.setPipeline(
a)}var Kn=function(e,r){e=p(e);var t=(()=>{var a=f.getJsObject(e),i=Er(0n);return f.Internals.jsObjectInsert(i,a.getBindGroupLayout(
r)),i})();return BigInt(t)},Yn=function(e,r){e=p(e),r=p(r);var t=(()=>{function a(m){var b=Number((c(),S)[(m+16)/8]),g=Number(
(c(),S)[(m+40)/8]),B=Number((c(),S)[(m+48)/8]),y=0;f.iterateExtensions(m,{327681:U=>{y=Number((c(),S)[(U+16)/8])}});var N;
if(b){var R=Fe(m+32);R==-1&&(R=void 0),N={buffer:f.getJsObject(b),offset:Fe(m+24),size:R}}else N=f.getJsObject(g||B||y);
return{binding:(c(),C)[(m+8)/4],resource:N}}function i(m,b){for(var g=[],B=0;B<m;++B)g.push(a(b+56*B));return g}var o={label:f.
makeStringFromOptionalStringView(r+8),layout:f.getJsObject(Number((c(),S)[(r+24)/8])),entries:i(Number((c(),S)[(r+32)/8]),
Number((c(),S)[(r+40)/8]))},s=f.getJsObject(e),u=yr(0n);return f.Internals.jsObjectInsert(u,s.createBindGroup(o)),u})();
return BigInt(t)},Xn=function(e,r){e=p(e),r=p(r);var t=(()=>{var a;r&&(a={label:f.makeStringFromOptionalStringView(r+8)});
var i=f.getJsObject(e),o=Sr(0n);return f.Internals.jsObjectInsert(o,i.createCommandEncoder(a)),o})();return BigInt(t)},Zn=function(e,r){
e=p(e),r=p(r);var t=(()=>{var a=f.makeComputePipelineDesc(r),i=f.getJsObject(e),o=Nr(0n);return f.Internals.jsObjectInsert(
o,i.createComputePipeline(a)),o})();return BigInt(t)};function ei(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(f.WGSLLanguageFeatureName[r]):!1}var ri=function(e,r,t){e=p(e),r=p(r),t=p(t);var a=f.getJsObject(
e),i=Array.from((c(),K).subarray(t/8,(t+r*8)/8),o=>f.getJsObject(o));a.submit(i)};function ti(e,r,t,a,i){e=p(e),r=p(r),t=
p(t),a=p(a),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(r),u=(c(),ue).subarray(a,a+i);o.writeBuffer(s,t,u,0,i)}var me={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,a]of Object.entries(e))typeof a=="function"&&(a.isAsync||
r.test(t))&&(e[t]=a=new WebAssembly.Suspending(a))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;me.asyncExports=new Set;var t={};for(let[i,o]of Object.entries(
e))if(typeof o=="function"){r.test(i)&&(me.asyncExports.add(o),o=me.makeAsyncFunction(o));var a=me.instrumentFunction(o);
t[i]=a}else t[i]=o;return t},asyncExports:null,isAsyncExport(e){return me.asyncExports?.has(e)},handleAsync:async e=>{De();
try{return await e()}finally{Ge()}},handleSleep:e=>me.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},Nt=e=>{var r=l["_"+e];return r},ai=(e,r)=>{(c(),ne).set(e,r)},xt=(e,r,t,a,i)=>{var o={pointer:U=>BigInt(U),
string:U=>{var d=0;return U!=null&&U!==0&&(d=Be(U)),BigInt(d)},array:U=>{var d=lr(U.length);return ai(U,d),BigInt(d)}};function s(U){
return r==="string"?Le(Number(U)):r==="pointer"?Number(U):r==="boolean"?!!U:U}var u=Nt(e),m=[],b=0;if(a)for(var g=0;g<a.
length;g++){var B=o[t[g]];B?(b===0&&(b=he()),m[g]=B(a[g])):m[g]=a[g]}var y=u(...m);function N(U){return b!==0&&_e(b),s(U)}
var R=i?.async;return R?y.then(N):(y=N(y),y)},ni=(e,r,t,a)=>{var i=!t||t.every(s=>s==="number"||s==="boolean"),o=r!=="st\
ring";return o&&i&&!a?Nt(e):(...s)=>xt(e,r,t,s,a)},ii=(...e)=>n.createPath(...e),oi=(...e)=>n.unlink(...e),si=(...e)=>n.
createLazyFile(...e),li=(...e)=>n.createDevice(...e);if(L.init(),n.createPreloadedFile=Va,n.preloadFile=_r,n.staticInit(),
Sa(),l.noExitRuntime&&(fr=l.noExitRuntime),l.preloadPlugins&&(st=l.preloadPlugins),l.print&&(se=l.print),l.printErr&&(te=
l.printErr),l.wasmBinary&&(ge=l.wasmBinary),l.arguments&&l.arguments,l.thisProgram&&(G=l.thisProgram),l.preInit)for(typeof l.
preInit=="function"&&(l.preInit=[l.preInit]);l.preInit.length>0;)l.preInit.shift()();l.ENV=rr,l.mmapAlloc=br,l.wasmMemory=
ve,l.addRunDependency=Ye,l.removeRunDependency=Ke,l.ccall=xt,l.cwrap=ni,l.FS_preloadFile=_r,l.FS_unlink=oi,l.FS_createPath=
ii,l.FS_createDevice=li,l.FS=n,l.FS_createDataFile=ot,l.FS_createLazyFile=si,l.MEMFS=T;var ci=[Hr,Kr,rt,lt,$a,ct,ut,ft,Pa,
Ja,dt,mt,pt,gt,wt,yt,Et,kt,St,Bt];function It(e,r,t,a){return me.handleAsync(async()=>await h(Le(Number(e)),Number(r),Number(
t),Number(a)))}It.sig="jjjjj";var Ft,Gt,At,yr,Er,kr,Sr,Br,Nr,Ct,Tt,Ut,Rt,jt,Dt,Ot,Mt,Lt,zt,qt,Wt,Qt,Vt,xr,$t,Ir,Fr,qe,Gr,
Pt,Jt,tr,Ht,Ar,Kt,Yt,Xt,Cr,Zt,ea,ra,ta,aa,na,ia,oa;function ui(e){l._wllama_malloc=e.wllama_malloc,l._wllama_start=e.wllama_start,
l._wllama_action=e.wllama_action,l._wllama_exit=e.wllama_exit,l._wllama_debug=e.wllama_debug,Ft=l._main=e.main,Gt=e.malloc,
At=e.free,yr=e.emwgpuCreateBindGroup,Er=e.emwgpuCreateBindGroupLayout,kr=e.emwgpuCreateCommandBuffer,Sr=e.emwgpuCreateCommandEncoder,
Br=e.emwgpuCreateComputePassEncoder,Nr=e.emwgpuCreateComputePipeline,Ct=e.emwgpuCreateExternalTexture,Tt=e.emwgpuCreatePipelineLayout,
Ut=e.emwgpuCreateQuerySet,Rt=e.emwgpuCreateRenderBundle,jt=e.emwgpuCreateRenderBundleEncoder,Dt=e.emwgpuCreateRenderPassEncoder,
Ot=e.emwgpuCreateRenderPipeline,Mt=e.emwgpuCreateSampler,Lt=e.emwgpuCreateSurface,zt=e.emwgpuCreateTexture,qt=e.emwgpuCreateTextureView,
Wt=e.emwgpuCreateAdapter,Qt=e.emwgpuCreateBuffer,Vt=e.emwgpuCreateDevice,xr=e.emwgpuCreateQueue,$t=e.emwgpuCreateShaderModule,
Ir=e.emwgpuOnDeviceLostCompleted,Fr=e.emwgpuOnMapAsyncCompleted,qe=e.emwgpuOnRequestAdapterCompleted,Gr=e.emwgpuOnRequestDeviceCompleted,
Pt=e.emwgpuOnWorkDoneCompleted,Jt=e.emwgpuOnUncapturedError,e._emscripten_tls_init,tr=e.pthread_self,Ht=e.emscripten_builtin_memalign,
Ar=e._emscripten_thread_init,Kt=e._emscripten_thread_crashed,Yt=e._emscripten_run_js_on_main_thread,Xt=e._emscripten_thread_free_data,
Cr=e._emscripten_thread_exit,Zt=e._emscripten_check_mailbox,ea=e.memalign,ra=e.__trap,ta=e.emscripten_stack_set_limits,aa=
e._emscripten_stack_restore,na=e._emscripten_stack_alloc,ia=e.emscripten_stack_get_current,oa=e.__indirect_function_table}
var Oe;function fi(){Oe={__asyncjs__js_file_read:It,__pthread_create_js:tt,__syscall_fcntl64:lt,__syscall_getcwd:ct,__syscall_getdents64:ut,
__syscall_ioctl:ft,__syscall_openat:dt,__syscall_stat64:mt,_abort_js:Ha,_emscripten_init_main_thread_js:Ka,_emscripten_notify_mailbox_postmessage:Xa,
_emscripten_receive_on_main_thread_js:Za,_emscripten_thread_cleanup:en,_emscripten_thread_mailbox_await:wr,_emscripten_thread_set_strongref:rn,
_localtime_js:sn,_mmap_js:pt,_munmap_js:gt,_tzset_js:ln,clock_time_get:un,emscripten_check_blocking_allowed:fn,emscripten_date_now:ht,
emscripten_exit_with_live_runtime:dn,emscripten_get_callstack:gn,emscripten_get_heap_max:bn,emscripten_get_now:bt,emscripten_has_asyncify:hn,
emscripten_num_logical_cores:_n,emscripten_resize_heap:wn,emwgpuAdapterRequestDevice:Sn,emwgpuBufferDestroy:Bn,emwgpuBufferGetConstMappedRange:Nn,
emwgpuBufferMapAsync:xn,emwgpuBufferUnmap:In,emwgpuDelete:Fn,emwgpuDeviceCreateBuffer:Gn,emwgpuDeviceCreateShaderModule:An,
emwgpuDeviceDestroy:Cn,emwgpuInstanceRequestAdapter:Tn,emwgpuQueueOnSubmittedWorkDone:Un,emwgpuWaitAny:vt,environ_get:wt,
environ_sizes_get:yt,exit:cr,fd_close:Et,fd_read:kt,fd_seek:St,fd_write:Bt,memory:ve,random_get:On,wgpuAdapterGetInfo:Mn,
wgpuAdapterGetLimits:Ln,wgpuAdapterHasFeature:zn,wgpuBufferGetSize:qn,wgpuCommandEncoderBeginComputePass:Wn,wgpuCommandEncoderCopyBufferToBuffer:Qn,
wgpuCommandEncoderFinish:Vn,wgpuComputePassEncoderDispatchWorkgroups:$n,wgpuComputePassEncoderEnd:Pn,wgpuComputePassEncoderSetBindGroup:Jn,
wgpuComputePassEncoderSetPipeline:Hn,wgpuComputePipelineGetBindGroupLayout:Kn,wgpuDeviceCreateBindGroup:Yn,wgpuDeviceCreateCommandEncoder:Xn,
wgpuDeviceCreateComputePipeline:Zn,wgpuInstanceHasWGSLLanguageFeature:ei,wgpuQueueSubmit:ri,wgpuQueueWriteBuffer:ti}}function di(e){
e=Object.assign({},e);var r=b=>(g,B,y)=>b(g,BigInt(B||0),BigInt(y||0)),t=b=>g=>Number(b(BigInt(g))),a=b=>g=>b(BigInt(g)),
i=b=>()=>Number(b()),o=b=>(g,B)=>Number(b(BigInt(g),BigInt(B))),s=b=>(g,B,y,N,R,U)=>b(BigInt(g),B,y,N,R,U),u=b=>(g,B,y,N,R)=>b(
g,BigInt(B),y,BigInt(N),R),m=b=>(g,B)=>b(BigInt(g),BigInt(B));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=a(e.free),
e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=o(e.emscripten_builtin_memalign),e._emscripten_thread_init=
s(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=u(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
a(e._emscripten_thread_free_data),e._emscripten_thread_exit=a(e._emscripten_thread_exit),e.memalign=o(e.memalign),e.emscripten_stack_set_limits=
m(e.emscripten_stack_set_limits),e._emscripten_stack_restore=a(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.emscripten_stack_get_current),e}async function mi(){var e=Ft,
r=0,t=0;try{var a=e(r,BigInt(t));return a=await a,Yr(a,!0),a}catch(i){return vr(i)}}function ar(){if(Ae>0){Me=ar;return}
if(k){Mr();return}if(Ba(),Ae>0){Me=ar;return}async function e(){if(l.calledRun=!0,!ke){Mr(),l.onRuntimeInitialized?.();var r=l.
noInitialRun||!1;r||await mi(),Na()}}l.setStatus?(l.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>l.setStatus(""),
1),e()},1)):e()}var Ne;return k||(zr(),ar()),l}var da=1,ma={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
Je=new Uint8Array([71,76,85,69]),jr=0,vi=1,wi=2,yi=3,Ei=4,ki=5,Si=6,Bi=7,Ni=8,xi=9,Ii=10,pa={str:Ei,int:wi,float:yi,bool:vi,
raw:ki,arr_str:xi,arr_int:Bi,arr_float:Ni,arr_bool:Si,arr_raw:Ii,null:jr};function Fi(l){let h=0;const F=new DataView(l.
buffer),x=()=>{const q=F.getUint32(h,!0);return h+=4,q},O=()=>{const q=F.getInt32(h,!0);return h+=4,q},w=()=>{const q=F.
getFloat32(h,!0);return h+=4,q},k=()=>x()!==0,z=q=>{const Y=q??x(),le=new TextDecoder().decode(l.slice(h,h+Y));return h+=
Y,le},G=()=>{const q=x(),Y=l.slice(h,h+q);return h+=q,Y},_=q=>{const Y=x(),le=new Array(Y);for(let se=0;se<Y;se++)le[se]=
q();return le},E=()=>null,D=q=>{switch(q.type){case"str":return z();case"int":return O();case"float":return w();case"boo\
l":return k();case"raw":return G();case"arr_str":return _(z);case"arr_int":return _(O);case"arr_float":return _(w);case"\
arr_bool":return _(k);case"arr_raw":return _(G);case"null":return E()}},W=l[0]===Je[0]&&l[1]===Je[1]&&l[2]===Je[2]&&l[3]===
Je[3];if(h+=4,!W)throw new Error("Invalid magic number");if(x()!==da)throw new Error("Invalid version number");const v=z(
8),J=ma[v];if(!J)throw new Error(`Unknown message name: ${v}`);const ae={_name:v};for(const q of J.fields){const Y=x();if(Y===
jr){if(!q.isNullable)throw new Error(`${v}: Expect field ${q.name} to be non-nullable`);ae[q.name]=null;continue}if(Y!==
pa[q.type])throw new Error(`${v}: Expect field ${q.name} to have type ${q.type}`);ae[q.name]=D(q)}return ae}function Gi(l){
const h=ma[l._name];if(!h)throw new Error(`Unknown message name: ${l._name}`);const F=[],x=I=>{const v=new ArrayBuffer(4);
new DataView(v).setUint32(0,I,!0),F.push(new Uint8Array(v))},O=I=>{const v=new ArrayBuffer(4);new DataView(v).setInt32(0,
I,!0),F.push(new Uint8Array(v))},w=I=>{const v=new ArrayBuffer(4);new DataView(v).setFloat32(0,I,!0),F.push(new Uint8Array(
v))},k=I=>{x(I?1:0)},z=I=>{const v=new TextEncoder().encode(I);x(v.byteLength),F.push(v)},G=I=>{x(I.byteLength),F.push(I)},
_=(I,v)=>{x(I.length);for(const J of I)v(J)};F.push(Je),x(da);{const I=new TextEncoder().encode(l._name);F.push(I)}for(const I of h.
fields){const v=l[I.name];if(!I.isNullable&&v==null)throw new Error(`${l._name}: Expect field ${I.name} to be non-nullab\
le`);if(v==null){x(jr);continue}switch(x(pa[I.type]),I.type){case"str":z(v);break;case"int":O(v);break;case"float":w(v);
break;case"bool":k(v);break;case"raw":G(v);break;case"arr_str":_(v,z);break;case"arr_int":_(v,O);break;case"arr_float":_(
v,w);break;case"arr_bool":_(v,k);break;case"arr_raw":_(v,G);break}}const E=F.reduce((I,v)=>I+v.byteLength,0),D=new Uint8Array(
E);let W=0;for(const I of F)D.set(I,W),W+=I.byteLength;return D}const ga=4*1024**2,sa=1024*1024;function Ai({files:l,reader:h,
getMemory:F,getSignal:x=()=>{}}){const O=new Map(l.map(w=>[w.name,w]));return async(w,k,z,G)=>{const _=O.get(w.replace(/^\/?models\//,
""));if(!_||![k,z,G].every(D=>Number.isSafeInteger(D)&&D>=0)||k>_.size)throw new Error("Invalid GGUF native file read");
const E=Math.min(z,_.size-k);if(!Number.isSafeInteger(G+E)||G+E>F().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let D=0;D<E;){fe(x());const W=Math.min(ga,E-D),I=await h.read(_.path,k+D,W,{signal:x()});if(fe(x()),
!(I instanceof Uint8Array)||I.byteLength!==W)throw new Error("Incomplete GGUF artifact range");new Uint8Array(F()).set(I,
G+D),D+=W}return BigInt(E)}}function Ci(l,h){l.FS.mkdir("/models"),l.FS.mount(l.MEMFS,{root:"."},"/models");const F=new Map(
h.map(w=>[w.name,w])),x=l.MEMFS.stream_ops;for(const w of["read","llseek"]){const k=x[w];x[w]=function(z,...G){const _=F.
get(z.node.name);return _&&(z.node.usedBytes=_.size),k.call(this,z,...G)},l.MEMFS.ops_table.file.stream[w]=x[w]}const O=x.
mmap;x.mmap=function(w,...k){if(F.has(w.node.name))throw new Error("GGUF artifact mmap is prohibited");return O.call(this,
w,...k)},l.MEMFS.ops_table.file.stream.mmap=x.mmap;for(const w of h)l.FS_createDataFile("/models",w.name,new Uint8Array(
0),!0,!1,!0)}function Ti(l,h,{collect:F=!1,onLost:x}={}){if(h.device=l,h.runtimeFeatures=[...l.features],h.runtimeAdapter=
l.adapterInfo?{vendor:l.adapterInfo.vendor,architecture:l.adapterInfo.architecture,isFallbackAdapter:l.adapterInfo.isFallbackAdapter??
!1}:null,!l.features.has("shader-f16")||h.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(l.lost.then(G=>x?.(G)),!F)return()=>{};const O=Object.getOwnPropertyDescriptor(l,
"createCommandEncoder"),w=Object.getOwnPropertyDescriptor(l.queue,"submit"),k=l.createCommandEncoder.bind(l),z=l.queue.submit.
bind(l.queue);return l.createCommandEncoder=(...G)=>{const _=k(...G),E=_.beginComputePass.bind(_);return _.beginComputePass=
(...D)=>{const W=E(...D);for(const I of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const v=W[I].bind(W);W[I]=(...J)=>{
const ae=v(...J);return h.dispatches+=1,ae}}return W},_},l.queue.submit=(...G)=>{const _=z(...G);return h.submissions+=1,
_},()=>{O?Object.defineProperty(l,"createCommandEncoder",O):delete l.createCommandEncoder,w?Object.defineProperty(l.queue,
"submit",w):delete l.queue.submit}}function Ui(l){const h=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(l);return h?
{gpuLayers:Number(h[1]),totalLayers:Number(h[2])}:null}function Ri(l){const h=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(l);return h?{backend:h[1],kind:h[2].toLowerCase(),bytes:Math.round(Number(h[3])*1024**2)}:null}async function ji({wasmUrl:l,
weights:h,reader:F,signal:x,collectGpuEvidence:O=!1,onProgress:w,onLost:k,initialize:z=_i}={}){const G=h.map((H,$)=>({...H,
name:`model-${String($+1).padStart(5,"0")}-of-${String(h.length).padStart(5,"0")}.gguf`})),_={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let E=x,D,W,I,v,J;const ae=new Promise((H,$)=>{v=H,J=$}),q=H=>{const $=Ui(String(
H));$&&(_.offload=$,w?.({type:"gpu-offload",...$}));const c=Ri(String(H));c&&_.buffers.length<32&&(_.buffers.push(c),w?.(
{type:"native-buffer",...c,wasmMemoryBytes:I?.wasmMemory?.buffer.byteLength??0}))},Y=H=>{D=new Error(`Model session lost\
: GGUF native runtime failed: ${String(H).slice(0,300)}`),J(D)};I={noInitialRun:!0,pthreadPoolSize:0,locateFile(H){if(H!==
"wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return l},print:q,printErr:q,onAbort:Y,onExit:Y,preRun(){
I.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){v()},peercomputeOnDevice(H){try{W?.(),W=Ti(H,_,{collect:O,onLost($){_.lost=
!0,k?.($)}})}catch($){H.destroy(),Y($.message)}}};const le=Ai({files:G,reader:F,getMemory:()=>I.wasmMemory.buffer,getSignal:()=>E});
z(I,le),await ae,fe(x),Ci(I,G);const se=I.cwrap("wllama_start","string",[],{async:!0}),te=I.cwrap("wllama_malloc","bigin\
t",["bigint","number"]),ge=I.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let oe=!1;const ke=async(H,$,c)=>{
if(oe)throw new Error("Concurrent GGUF native calls are prohibited");if(D)throw D;if(_.lost)throw new Error("GPU device \
lost; GGUF session is unavailable");fe(c),oe=!0,E=c;try{const re=Gi($);if(re.byteLength>sa)throw new Error("GGUF native \
message exceeds its byte budget");const ce=Number(te(BigInt(re.byteLength),0)),be=new Uint8Array(I.wasmMemory.buffer);if(!Number.
isSafeInteger(ce)||ce<=0||ce+re.length>be.length)throw new Error("Invalid GGUF input pointer");be.set(re,ce);const ne=Number(
await ge(H,BigInt(ce)));if(D)throw D;const ue=I.wasmMemory.buffer,Se=new DataView(ue).getUint32(ce,!0);if(!Number.isSafeInteger(
ne)||ne<=0||Se>sa||ne+Se>ue.byteLength)throw new Error("Invalid GGUF output buffer");return Fi(new Uint8Array(ue,ne,Se).
slice())}catch(re){throw D??=new Error(`Model session lost: GGUF native action failed: ${String(re.message??re).slice(0,
300)}`),D}finally{oe=!1,E=void 0}},ee=JSON.parse(await se());if(D)throw D;if(!ee.success||!_.device)throw new Error("GGU\
F native hardware GPU backend did not initialize");return fe(x),{files:G,action:ke,evidence:_,async settleGpu(){try{await _.
device.queue.onSubmittedWorkDone()}catch(H){throw _.lost=!0,D=new Error(`Model session lost: GGUF GPU completion failed:\
 ${String(H.message??H).slice(0,300)}`),D}},close(){W?.(),_.device?.destroy()},memoryBytes(){return I.wasmMemory.buffer.
byteLength}}}const Qe="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Ve="5ce3fd841676adf2c1a10d7193637d46007e\
88f7",la=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,
gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482e\
aa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635\
e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c9\
5508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_tem\
plate.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"\
706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefee\
e3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"\
verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Di="This catalog supports verifie\
d storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog aft\
er browser capability and resource checks.";function ba(l){for(const h of Object.values(l))h&&typeof h=="object"&&ba(h);
return Object.freeze(l)}const Oi=ba({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8\
 27B GeoRefine D14 (mixed GGUF)",repository:Qe,revision:Ve,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Di},license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Qe}/blob/${Ve}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable ar\
tifact provenance."},provenance:{repository:Qe,revision:Ve,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`ht\
tps://huggingface.co/${Qe}/blob/${Ve}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{runtime:"llama.cpp",
architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4\
_K","Q5_K","F32"],repository:Qe,revision:Ve},weightBytes:14199740480,totalBytes:la.reduce((l,h)=>l+h.size,0),files:la}});
function ha(l){return l&&typeof l=="object"&&!Object.isFrozen(l)&&(Object.values(l).forEach(ha),Object.freeze(l)),l}const Mi=[
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
f75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],Li=ha(Object.fromEntries(Mi.map(l=>{const{dtype:h,sourceModel:F,blockCount:x,
nextnPredictLayers:O,...w}=l,z=w.files.find(G=>G.path==="LICENSE").source;return[w.id,{...w,status:"execution-candidate",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"\
candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/\
JSPI and memory admission. These exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"\
https://huggingface.co/"+z.repository+"/blob/"+z.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversio\
n/source cards and available modification notices are included."},provenance:{repository:w.repository,revision:w.revision,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/"+w.repository+"/blob/"+w.revision+"/R\
EADME.md",sourceModel:{...F,revisionPurpose:"Pinned source documentation and license reference; the converter does not i\
dentify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{
version:3,architecture:"qwen35",blockCount:x,nextnPredictLayers:O,inspectedPrefixBytes:65536},vision:"Upstream vision me\
tadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter re\
jects images.",behavior:w.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"\
GGUF",task:"text-generation",dtype:h,modalities:["text"],requiredFeatures:["shader-f16"],repository:w.repository,revision:w.
revision},weightBytes:w.files[0].size,totalBytes:w.files.reduce((G,_)=>G+_.size,0)}]})));function Dr(l){return l&&typeof l==
"object"&&!Object.isFrozen(l)&&(Object.values(l).forEach(Dr),Object.freeze(l)),l}const xe="Tsotchke-Corporation",_a=[{id:"\
qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${xe}\
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
 GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${xe}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f38\
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
orefine-l162-gguf",name:"Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${xe}/Qwen3.8-27B-Geo\
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
ify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}]}],zi=Dr(Object.fromEntries(_a.map(l=>{
const{architecture:h,quantizationTypes:F,sourceModel:x,publisherLimitations:O,...w}=l;return[l.id,{...w,status:"executio\
n-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16 and browser/resource admissio\
n. These exact artifacts are not hardware-qualified; current file and runtime byte limits still apply."},license:{spdx:"\
Apache-2.0",sourceUrl:`https://huggingface.co/${l.repository}/blob/${l.revision}/LICENSE`,notice:"Preserve the included \
LICENSE, NOTICE, model card and pinned publisher manifests."},provenance:{repository:l.repository,revision:l.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https://huggingface.co/${l.repository}/blob/${l.revision}/README.md`,
sourceManifestPath:"artifact-manifest.json",sourceModel:x,publisherLimitations:O,codecRequired:!1,tensorFormatEvidence:"\
Pinned publisher GGUF tensor census; no model payload was downloaded for catalog admission.",vision:"The managed GGUF ad\
apter is text-only; upstream vision metadata does not establish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:h,format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:F,modalities:["text"],requiredFeatures:[
"shader-f16"],repository:l.repository,revision:l.revision},weightBytes:l.files.filter(k=>k.path.endsWith(".gguf")).reduce(
(k,z)=>k+z.size,0),totalBytes:l.files.reduce((k,z)=>k+z.size,0)}]})));Dr({organization:xe,sourceUrl:`https://huggingface\
.co/${xe}`,checkedAt:"2026-11-04",repositories:[..._a.map(({id:l,repository:h,revision:F})=>({repository:h,revision:F,catalogId:l,
format:"GGUF",codecRequired:!1})),{repository:`${xe}/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10\
d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefine-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${xe}/Qwen3\
.8-27B-GeoRefine-Context`,revision:"c725e6920301a405849b9e373503553789e0d39b",format:"bitexact-predictive-context-packag\
e-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX tensors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${xe}\
/Qwen3.8-27B-GeoRefine-Context-abliterated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predict\
ive-context-package-v1",codecRequired:!0,exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 pare\
nt before ordinary Transformers loading."},{repository:`${xe}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1\
dae3db1847bf33bdd45",format:"georefine.tbe.serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec\
 containers, requiring GeoRefine TBE or full BF16 export."}]});const $e="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Pe="f36b1ea49\
a332ede8fe5f389bbf5b3575ef71f48",Tr=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c9057\
81334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f8\
25c6f5d"}],Rr=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"\
candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and expl\
icit memory admission. Actual model execution must be verified on the selected device."});function va(l){return l&&typeof l==
"object"&&!Object.isFrozen(l)&&(Object.values(l).forEach(va),Object.freeze(l)),l}const qi=Object.fromEntries([{id:"qwen3\
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
ENSE"}}]}].map(({architecture:l,...h})=>[h.id,va({...h,status:"execution-candidate",format:"GGUF",capabilities:Rr,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${h.files[2].source.repository}/blob/${h.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:h.
repository,revision:h.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${h.repository}\
/blob/${h.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:l,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:h.repository,revision:h.revision},weightBytes:h.files[0].size,totalBytes:h.files.reduce((F,x)=>F+x.size,
0)})])),Wi=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:$e,revision:Pe,status:"execution-candidate",format:"GGUF",capabilities:Rr,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${$e}/blob/${Pe}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:$e,revision:Pe,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${$e}/blob/${Pe}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:$e,revision:Pe},weightBytes:Tr[0].size,totalBytes:Tr.
reduce((l,h)=>l+h.size,0),files:Tr},...qi,...Li,...zi,...Object.fromEntries(Object.entries(Oi).map(([l,h])=>[l,{...h,status:"\
execution-candidate",capabilities:Rr}]))}),wa="3.8.1",ca=2048,Te=1024**3;function ya(l){const h=pi(l),F=h.model,x=Object.
values(Wi).filter(_=>_.model.runtime==="llama.cpp"&&_.repository===F?.repository&&_.revision===F?.revision&&_.model.architecture===
F?.architecture&&_.model.task===F?.task&&_.model.dtype===F?.dtype),O=x.length===1?x[0]:void 0;if(!O||F.runtime!=="llama.\
cpp"||F.runtimeVersion!==void 0&&F.runtimeVersion!==wa||O.model.runtimeVersion!==void 0&&F.runtimeVersion!==O.model.runtimeVersion||
F.dtype!==O.model.dtype||F.format!=="GGUF"||F.task!=="text-generation")throw new Error("GGUF model revision is not in th\
e trusted runtime catalog");const w=h.files.filter(_=>_.path.endsWith(".gguf")),k=O.files.filter(_=>_.path.endsWith(".gg\
uf"));if(!w.length||w.length!==k.length||w.some(_=>!k.some(E=>E.path===_.path&&E.size===_.size&&E.sha256===_.sha256)))throw new Error(
"GGUF weights do not match the pinned catalog digests");const z=h.files.reduce((_,E)=>_+E.size,0);if(!Number.isSafeInteger(
z)||z>16*Te)throw new Error("GGUF package exceeds its byte budget");const G=w.reduce((_,E)=>_+E.size,0)>4*Te;return{manifest:h,
weights:w,totalBytes:z,resourcePolicy:{maxModelBytes:16*Te,minimumCpuBytes:G?8*Te:2*Te,minimumGpuBytes:G?16*Te:2*Te}}}function Ea(l,h=globalThis.
location?.href){const F=new URL(h);if(!l||Object.keys(l).some(O=>O!=="wasm")||typeof l.wasm!="string")throw new Error("G\
GUF runtime needs one trusted WASM asset");const x=new URL(l.wasm,F);if(x.origin!==F.origin||!["http:","https:"].includes(
x.protocol)||x.username||x.password||x.search||x.hash||!x.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM \
must be a fixed same-origin asset");return{wasm:x.href}}function ka(l={}){if(!l||typeof l!="object"||Array.isArray(l)||Object.
keys(l).some(F=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(F)))throw new Error("Unknown GGUF runtime optio\
n");const h={n_ctx:ca,n_batch:64,n_gpu_layers:99999,n_threads:1,...l};if(!Number.isInteger(h.n_ctx)||h.n_ctx<64||h.n_ctx>
ca||!Number.isInteger(h.n_batch)||h.n_batch<1||h.n_batch>128||!Number.isInteger(h.n_gpu_layers)||h.n_gpu_layers<1||h.n_gpu_layers>
99999||h.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(h)}async function Qi({
scope:l=globalThis,gpu:h=l.navigator?.gpu}={}){if(!l.crossOriginIsolated||!l.SharedArrayBuffer)throw new Error("GGUF req\
uires cross-origin isolation and SharedArrayBuffer");const F=l.WebAssembly;if(typeof F?.Suspending!="function"||typeof F?.
promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{new F.Memory({initial:0n,maximum:1n,shared:!0,
address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly memory64")}const x=await h?.requestAdapter({powerPreference:"\
high-performance"});if(!x||x.isFallbackAdapter||x.info?.isFallbackAdapter)throw new Error("GGUF requires a hardware WebG\
PU adapter");if(!x.features.has("shader-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabl\
ed");return{adapter:{vendor:x.info?.vendor??"",architecture:x.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const Vi=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:ya,validateRuntimeAssets:Ea,validateRuntimeOptions:ka,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:l,maxNewTokens:h}){if(l)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(h)||h<1||h>Ur.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),ua=l=>new TextEncoder().
encode(l).byteLength;function $i(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"GGUF inference requires a ComputeManager-owned worker")}function fa(l){return{sessionId:l.sessionId,manifestCid:l.manifestCid,
status:l.lost?"lost":l.status,runtime:"llama.cpp",runtimeVersion:wa,task:"text-generation",workerId:l.workerId,adapter:l.
capabilities?.adapter,runtimeAdapter:l.engine?.evidence.runtimeAdapter??null,runtimeFeatures:l.engine?.evidence.runtimeFeatures??
[],gpuDispatches:l.engine?.evidence.dispatches??0,gpuSubmissions:l.engine?.evidence.submissions??0,gpuOffload:l.engine?.
evidence.offload??null,runtimeOptions:l.options,nativeBuffers:l.engine?.evidence.buffers??[],wasmMemoryBytes:l.engine?.memoryBytes()??
0,generatedRequests:l.generatedRequests,artifactReads:l.reader?.getStats()??null}}function Pi({loadEngine:l=ji,createReader:h=gi,
checkCapabilities:F=Qi,assertWorker:x=$i,baseUrl:O=globalThis.location?.href}={}){let w;async function k(G,_){if(w)throw new Error(
"GGUF worker already has a resident model");const E=ya(G.manifest),D=Ea(G.runtimeAssets,O),W=ka(G.runtimeOptions),I=nr(G.
sessionId);fe(_.signal);const v={sessionId:I,manifestCid:G.manifestCid,workerId:_.workerId??null,manifest:E.manifest,status:"\
loading",options:W,generatedRequests:0,residency:new AbortController,lost:!1};w=v;try{if(v.capabilities=await F(),fe(_.signal),
v.reader=h(G.artifactPort,{manifest:E.manifest,signal:v.residency.signal,maxReadBytes:ga,maxReads:1}),v.engine=await l({
wasmUrl:D.wasm,weights:E.weights,reader:v.reader,signal:_.signal,collectGpuEvidence:G.collectGpuEvidence===!0,onProgress:q=>_.
emitProgress?.({...q,sessionId:I}),onLost(){v.lost=!0,v.active?.abort("GPU device lost")}}),fe(_.signal),!(await v.engine.
action("load",{_name:"load_req",model_paths:v.engine.files.map(q=>`models/${q.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,
...W,n_ubatch:Math.min(64,W.n_batch),n_parallel:1,kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,
jinja:!0},_.signal)).success)throw new Error("GGUF native model load failed");const ae=v.engine.evidence.offload;if(!ae||
ae.gpuLayers<1||ae.gpuLayers!==Math.min(W.n_gpu_layers,ae.totalLayers))throw new Error("GGUF did not honor the explicitl\
y configured GPU layer offload");if(fe(_.signal),v.lost)throw new Error("GPU device lost during GGUF load");return v.status=
"ready",fa(v)}catch(J){throw v.engine&&_.emitProgress?.({type:"model-load-memory",sessionId:I,wasmMemoryBytes:v.engine.memoryBytes(),
nativeBuffers:v.engine.evidence.buffers??[]}),v.lost=!0,v.status="lost",v.residency.abort(J),v.reader?.close(J),v.engine?.
close(),J}}async function z(G,_){const E=w;if(!E||E.sessionId!==nr(G.sessionId)||E.lost)throw new Error("Model session l\
ost or not loaded");if(E.status!=="ready")throw new Error("GGUF model session is busy");const D=nr(G.requestId),W=G.maxNewTokens??
Ur.maxNewTokens;Vi.validateGenerationInput({...G,maxNewTokens:W});const I=bi(G),v=new AbortController,J=()=>v.abort(_.signal?.
reason);_.signal?.addEventListener("abort",J,{once:!0}),_.signal?.aborted&&J(),E.active=v,E.status="generating",E.requestId=
D;const ae=E.engine.evidence.dispatches,q=E.engine.evidence.submissions;let Y,le=!1,se="",te=0,ge=null,oe=null,ke="unkno\
wn";try{const ee=await E.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:I,stream:!0,
max_tokens:W,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:[]},v.signal);if(!ee.success||
!Number.isInteger(ee.req_id))throw new Error("GGUF failed to start generation");Y=ee.req_id,fe(v.signal);for(let H=0;H<4096;H+=
1){fe(v.signal);const $=await E.engine.action("get_result",{_name:"gres_req",req_id:Y},v.signal);if(fe(v.signal),!$.success||
$.is_error)throw new Error("GGUF generation failed or exceeded the context budget; shorten the conversation or request f\
ewer output tokens");if($.data_json&&$.data_json!=="null"){if(ua($.data_json)>1024*1024)throw new Error("GGUF result exc\
eeds its byte budget");const c=JSON.parse($.data_json);for(const re of Array.isArray(c)?c:[c]){const ce=re.choices?.[0]?.
finish_reason??re.finish_reason;ce!=null&&(ke=["stop","length"].includes(ce)?ce:"unknown");const be=re.choices?.[0]?.delta?.
content??re.content??"";if(typeof be!="string")throw new Error("Invalid GGUF text chunk");if(se+=be,ua(se)>Ur.maxOutputBytes)
throw new Error("GGUF output exceeds its byte budget");if(be&&_.emitProgress?.({type:"token",sessionId:E.sessionId,requestId:D,
sequence:te++,text:be})===!1)throw new Error("Token consumer rejected output");ge=re.usage?.prompt_tokens??re.timings?.prompt_n??
ge,oe=re.usage?.completion_tokens??re.timings?.predicted_n??oe}}if(!$.has_more){le=!0;break}await new Promise(c=>setTimeout(
c,0))}if(!le)throw new Error("GGUF result polling exceeded its request budget");if(await E.engine.settleGpu(),fe(v.signal),
E.lost)throw new Error("GPU device lost; model session is unavailable");if(oe!==null&&(!Number.isSafeInteger(oe)||oe>W))
throw new Error("GGUF returned an over-budget token sequence");return E.generatedRequests+=1,{sessionId:E.sessionId,requestId:D,
text:se,inputTokens:ge,outputTokens:oe,finishReason:ke,contextTruncated:!1,workerId:E.workerId,gpuDispatches:E.engine.evidence.
dispatches-ae,gpuSubmissions:E.engine.evidence.submissions-q,gpuOffload:E.engine.evidence.offload,artifactReads:E.reader.
getStats()}}catch(ee){throw ee?.name==="RuntimeError"?(E.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(
ee.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(ee.message??"")&&(E.lost=!0),ee)}finally{_.signal?.
removeEventListener("abort",J);try{!le&&Y!==void 0&&!E.lost&&await E.engine.action("cancel",{_name:"cncl_req",req_id:Y})}catch(ee){
throw E.lost=!0,new Error(`Model session lost during GGUF cancellation: ${ee.message}`)}finally{E.active=null,E.requestId=
null,E.status=E.lost?"lost":"ready"}}}return async(G={},_={})=>{if(x(),G.command==="load")return k(G,_);if(G.command==="\
generate")return z(G,_);const E=nr(G.sessionId);if(G.command==="status")return w?.sessionId===E?fa(w):{sessionId:E,status:"\
absent"};if(!w||w.sessionId!==E)throw new Error("Model session lost or not loaded");if(G.command==="cancel")return w.requestId===
G.requestId&&w.active?.abort(hi()),{sessionId:E,cancellationRequested:!0};if(G.command==="unload"){if(w.status==="genera\
ting")throw new Error("Cancel and await GGUF generation before unloading");return w.residency.abort("GGUF unload"),w.reader?.
close(),w.engine?.close(),w=null,{sessionId:E,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown G\
GUF inference command")}}const Ji=Pi(),Yi=(l,h)=>Ji(l,h);export{Pi as createGgufTaskRuntime,Yi as handleModelTask};

import{n as fi,c as mi}from"./GgufArtifactReader-BV3uUvNA.js";import{t as fe,M as Tr,v as nr,n as di,a as pi}from"./modelTask-dQfjl6lX.js";
function gi(u,_){const G=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var F=!!globalThis.
window,M=!!globalThis.WorkerGlobalScope,w=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",B=M&&
self.name?.startsWith("em-pthread");if(w){var z=require("worker_threads");global.Worker=z.Worker,M=!z.isMainThread,B=M&&
z.workerData=="em-pthread"}var x="./this.program",h=(e,r)=>{throw r},E=globalThis.document?.currentScript?.src;typeof __filename<
"u"?E=__filename:M&&(E=self.location.href);var j="";function W(e){return u.locateFile?u.locateFile(e,j):j+e}var I,v;if(w){
var $=require("fs");j=__dirname+"/",v=e=>{e=J(e)?new URL(e):e;var r=$.readFileSync(e);return r},I=async(e,r=!0)=>{e=J(e)?
new URL(e):e;var t=$.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(x=process.argv[1].replace(/\\/g,"\
/")),process.argv.slice(2),typeof module<"u"&&(module.exports=u),h=(e,r)=>{throw process.exitCode=e,r}}else if(F||M){try{
j=new URL(".",E).href}catch{}w||(M&&(v=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),I=async e=>{if(J(e))return new Promise((t,n)=>{var i=new XMLHttpRequest;i.open(
"GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}n(
i.status)},i.onerror=n,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(
r.status+" : "+r.url)})}var ne=console.log.bind(console),q=console.error.bind(console);if(w){var K=require("util"),le=e=>typeof e==
"object"?K.inspect(e):e;ne=(...e)=>$.writeSync(1,e.map(le).join(" ")+`
`),q=(...e)=>$.writeSync(2,e.map(le).join(" ")+`
`)}var se=ne,te=q,ge,oe,ke=!1,ee;function H(e,r){e||me(r)}var J=e=>e.startsWith("file://");function l(){ve.buffer!=ae.buffer&&
$e()}if(w&&B){var re=z.parentPort;re.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>re.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var ue;if(B){var be=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.
cmd;if(n==="load"){let i=[];self.onmessage=o=>i.push(o),ue=()=>{postMessage({cmd:"loaded"});for(let o of i)e(o);self.onmessage=
e};for(const o of t.handlers)(!u[o]||u[o].proxy)&&(u[o]=(...s)=>{postMessage({cmd:"callHandler",handler:o,args:s})},o=="\
print"&&(se=u[o]),o=="printErr"&&(te=u[o]));ve=t.wasmMemory,$e(),oe=t.wasmModule,Lr(),tr()}else if(n==="run"){Gn(t.pthread_ptr),
Ar(t.pthread_ptr,0,0,1,0,0),L.threadInitTLS(),vr(t.pthread_ptr),be||(be=!0);try{await Xr(t.start_routine,t.arg)}catch(i){
if(i!="unwind")throw i}}else t.target==="setimmediate"||(n==="checkMailbox"?be&&Xe():n&&(te(`worker: received unknown co\
mmand ${n}`),te(t)))}catch(i){throw $t(),i}}self.onmessage=e}var ae,ce,Se,A,C,ar,Ie,Y,k,Rr=!1;function $e(){var e=ve.buffer;
ae=new Int8Array(e),Se=new Int16Array(e),u.HEAPU8=ce=new Uint8Array(e),A=new Int32Array(e),C=new Uint32Array(e),ar=new Float32Array(
e),Ie=new Float64Array(e),Y=new BigInt64Array(e),k=new BigUint64Array(e)}function En(){if(!B){if(u.wasmMemory)ve=u.wasmMemory;else{
var e=u.INITIAL_MEMORY||134217728;ve=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}$e()}}function kn(){if(u.preRun)for(typeof u.preRun=="function"&&(u.preRun=[u.preRun]);u.preRun.length;)Vr(u.preRun.
shift());Wr(Qr)}function jr(){if(Rr=!0,B)return ue();!u.noFSInit&&!a.initialized&&a.init(),Ne.__wasm_call_ctors(),a.ignorePermissions=
!1}function Sn(){if(!B){if(u.postRun)for(typeof u.postRun=="function"&&(u.postRun=[u.postRun]);u.postRun.length;)An(u.postRun.
shift());Wr(Yr)}}function me(e){u.onAbort?.(e),e="Aborted("+e+")",te(e),ke=!0,e+=". Build with -sASSERTIONS for more inf\
o.",Rr&&Zt();var r=new WebAssembly.RuntimeError(e);throw r}var ir;function Bn(){return W("wllama.wasm")}function Nn(e){if(e==
ir&&ge)return new Uint8Array(ge);if(v)return v(e);throw"both async and sync fetching of the wasm failed"}async function In(e){
if(!ge)try{var r=await I(e);return new Uint8Array(r)}catch{}return Nn(e)}async function Fn(e,r){try{var t=await In(e),n=await WebAssembly.
instantiate(t,r);return n}catch(i){te(`failed to asynchronously prepare wasm: ${i}`),me(i)}}async function xn(e,r,t){if(!e&&
!J(r)&&!w)try{var n=fetch(r,{credentials:"same-origin"}),i=await WebAssembly.instantiateStreaming(n,t);return i}catch(o){
te(`wasm streaming compile failed: ${o}`),te("falling back to ArrayBuffer instantiation")}return Fn(r,t)}function Or(){li(),
je.__instrumented||(je.__instrumented=!0,de.instrumentWasmImports(je));var e={env:je,wasi_snapshot_preview1:je};return e}
async function Lr(){function e(s,c){return Ne=s.exports,Ne=de.instrumentWasmExports(Ne),Ne=ui(Ne),Cn(Ne._emscripten_tls_init),
si(Ne),oe=c,He(),Ne}Ye();function r(s){return e(s.instance,s.module)}var t=Or();if(u.instantiateWasm)return new Promise(
(s,c)=>{u.instantiateWasm(t,(d,b)=>{s(e(d,b))})});if(B){var n=new WebAssembly.Instance(oe,Or());return e(n,oe)}ir??=Bn();
var i=await xn(ge,ir,t),o=r(i);return o}class Mr{name="ExitStatus";constructor(r){this.message=`Program terminated with \
exit(${r})`,this.status=r}}var qr=e=>{e.terminate(),e.onmessage=r=>{}},zr=e=>{var r=L.pthreads[e];L.returnWorkerToPool(r)},
Wr=e=>{for(;e.length>0;)e.shift()(u)},Qr=[],Vr=e=>Qr.push(e),Ae=0,Oe=null,He=e=>{if(Ae--,u.monitorRunDependencies?.(Ae),
Ae==0&&Oe){var r=Oe;Oe=null,r()}},Ye=e=>{Ae++,u.monitorRunDependencies?.(Ae)},Jr=e=>{var r=L.getNewWorker();if(!r)return 6;
L.runningWorkers.push(r),L.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,
arg:e.arg,pthread_ptr:e.pthread_ptr};return w&&r.unref(),r.postMessage(t,e.transferList),0},Ke=0,or=()=>cr||Ke>0,_e=()=>nn(),
he=e=>rn(e),sr=e=>tn(e),Z=(e,r,t,...n)=>{for(var i=n.length*2,o=_e(),s=sr(i*8),c=s/8,d=0;d<n.length;d++){var b=n[d];typeof b==
"bigint"?((l(),Y)[c+2*d]=1n,(l(),Y)[c+2*d+1]=b):((l(),Y)[c+2*d]=0n,(l(),Ie)[c+2*d+1]=b)}var g=Ht(e,r,i,s,t);return he(o),
g};function Pr(e){if(B)return Z(0,0,1,e);ee=e,or()||(L.terminateAllThreads(),u.onExit?.(e),ke=!0),h(e,new Mr(e))}function $r(e){
if(B)return Z(1,0,0,e);lr(e)}var Hr=(e,r)=>{if(ee=e,B)throw $r(e),"unwind";Pr(e)},lr=Hr,L={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){B||L.initMainThread()},initMainThread(){for(var e=u.pthreadPoolSize;e--;)L.allocateUnusedWorker();
Vr(async()=>{var r=L.loadWasmModuleToAllWorkers();Ye(),await r,He()})},terminateAllThreads:()=>{for(var e of L.runningWorkers)
qr(e);for(var e of L.unusedWorkers)qr(e);L.unusedWorkers=[],L.runningWorkers=[],L.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete L.pthreads[r],L.unusedWorkers.push(e),L.runningWorkers.splice(L.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,Yt(r)},threadInitTLS(){L.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=o=>{var s=o.
data,c=s.cmd;if(s.targetThread&&s.targetThread!=rr()){var d=L.pthreads[s.targetThread];d?d.postMessage(s,s.transferList):
te(`Internal error! Worker sent a message "${c}" to target pthread ${s.targetThread}, but that thread no longer exists!`);
return}c==="checkMailbox"?Xe():c==="spawnThread"?Jr(s):c==="cleanupThread"?Ee(()=>zr(s.thread)):c==="loaded"?(e.loaded=!0,
w&&!e.pthread_ptr&&e.unref(),r(e)):s.target==="setimmediate"?e.postMessage(s):c==="uncaughtException"?e.onerror(s.error):
c==="callHandler"?u[s.handler](...s.args):c&&te(`worker sent an unknown command ${c}`)},e.onerror=o=>{var s="worker sent\
 an error!";throw te(`${s} ${o.filename}:${o.lineno}: ${o.message}`),o},w&&(e.on("message",o=>e.onmessage({data:o})),e.on(
"error",o=>e.onerror(o)));var t=[],n=["onExit","onAbort","print","printErr"];for(var i of n)u.propertyIsEnumerable(i)&&t.
push(i);e.postMessage({cmd:"load",handlers:t,wasmMemory:ve,wasmModule:oe})}),async loadWasmModuleToAllWorkers(){return B?
void 0:Promise.all(L.unusedWorkers.map(L.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=E;u.mainScriptUrlOrBlob&&
(r=u.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new G(r,{workerData:"em-pthread",name:"em-pth\
read"}),L.unusedWorkers.push(e)},getNewWorker(){return L.unusedWorkers.length==0&&(L.allocateUnusedWorker(),L.loadWasmModuleToWorker(
L.unusedWorkers[0])),L.unusedWorkers.pop()}},Yr=[],An=e=>Yr.push(e);function Gn(e){var r=Number((l(),k)[(e+88)/8]),t=Number(
(l(),k)[(e+96)/8]),n=r-t;en(r,n),he(r)}var ur=[],Kr=e=>{e=Number(e);var r=ur[e];return r||(ur[e]=r=an.get(BigInt(e)),de.
isAsyncExport(r)&&(ur[e]=r=de.makeAsyncFunction(r))),r},Xr=async(e,r)=>{Ke=0,cr=0;var t=(i=>WebAssembly.promising(Kr(e)).
call(null,BigInt(i)))(r);function n(i){if(or()){ee=i;return}Gr(i)}t=await t,n(t)};Xr.isAsync=!0;var cr=!0,Cn=e=>L.tlsInitFunctions.
push(e),ve;function Zr(e,r,t,n){return B?Z(2,0,1,e,r,t,n):et(e,r,t,n)}var Tn=()=>!!globalThis.SharedArrayBuffer,Un=9007199254740992,
Dn=-9007199254740992,p=e=>e<Dn||e>Un?NaN:Number(e);function et(e,r,t,n){if(e=p(e),r=p(r),t=p(t),n=p(n),!Tn())return 6;var i=[],
o=0;if(B&&(i.length===0||o))return Zr(e,r,t,n);var s={startRoutine:t,pthread_ptr:e,arg:n,transferList:i};return B?(s.cmd=
"spawnThread",postMessage(s,i),0):Jr(s)}var Te=()=>{var e=Number((l(),k)[V.varargs/8]);return V.varargs+=8,e},fr=()=>{var e=(l(),
A)[+V.varargs/4];return V.varargs+=4,e},Q={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var i=e[n];i==="."?e.splice(n,1):i===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=Q.isAbs(e),
t=e.slice(-1)==="/";return e=Q.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=Q.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>Q.normalize(e.join("/")),join2:(e,r)=>Q.normalize(e+"/"+r)},Rn=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),mr=e=>{(mr=Rn())(e)},Ue={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var i=n>=0?e[n]:a.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!i)return"";r=i+"/"+r,t=Q.isAbs(i)}return r=Q.normalizeArray(r.split("/").filter(o=>!!o),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=Ue.resolve(e).slice(1),r=Ue.resolve(r).slice(1);function t(b){for(var g=0;g<b.length&&b[g]==="";g++)
;for(var S=b.length-1;S>=0&&b[S]==="";S--);return g>S?[]:b.slice(g,S-g+1)}for(var n=t(e.split("/")),i=t(r.split("/")),o=Math.
min(n.length,i.length),s=o,c=0;c<o;c++)if(n[c]!==i[c]){s=c;break}for(var d=[],c=s;c<n.length;c++)d.push("..");return d=d.
concat(i.slice(s)),d.join("/")}},rt=globalThis.TextDecoder&&new TextDecoder,jn=(e,r,t,n)=>{for(var i=r+t;e[r]&&!(r>=i);)
++r;return r},De=(e,r=0,t,n)=>{var i=jn(e,r,t);if(i-r>16&&e.buffer&&rt)return rt.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,i):e.slice(r,i));for(var o="";r<i;){var s=e[r++];if(!(s&128)){o+=String.fromCharCode(s);continue}var c=e[r++]&
63;if((s&224)==192){o+=String.fromCharCode((s&31)<<6|c);continue}var d=e[r++]&63;if((s&240)==224?s=(s&15)<<12|c<<6|d:s=(s&
7)<<18|c<<12|d<<6|e[r++]&63,s<65536)o+=String.fromCharCode(s);else{var b=s-65536;o+=String.fromCharCode(55296|b>>10,56320|
b&1023)}}return o},dr=[],we=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},tt=(e,r,t,n)=>{if(!(n>0))return 0;for(var i=t,o=t+n-1,s=0;s<e.length;++s){var c=e.codePointAt(
s);if(c<=127){if(t>=o)break;r[t++]=c}else if(c<=2047){if(t+1>=o)break;r[t++]=192|c>>6,r[t++]=128|c&63}else if(c<=65535){
if(t+2>=o)break;r[t++]=224|c>>12,r[t++]=128|c>>6&63,r[t++]=128|c&63}else{if(t+3>=o)break;r[t++]=240|c>>18,r[t++]=128|c>>
12&63,r[t++]=128|c>>6&63,r[t++]=128|c&63,s++}}return r[t]=0,t-i},pr=(e,r,t)=>{var n=we(e)+1,i=new Array(n),o=tt(e,i,0,i.
length);return i.length=o,i},On=()=>{if(!dr.length){var e=null;if(w){var r=256,t=Buffer.alloc(r),n=0,i=process.stdin.fd;
try{n=$.readSync(i,t,0,r)}catch(o){if(o.toString().includes("EOF"))n=0;else throw o}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;dr=pr(e)}return dr.shift()},Ge={ttys:[],init(){},shutdown(){},register(e,r){Ge.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Ge.stream_ops)},stream_ops:{open(e){var r=Ge.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,i){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var o=0,s=0;s<n;s++){var c;try{c=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(c===void 0&&o===0)throw new a.ErrnoError(6);if(c==null)break;o++,r[t+s]=c}return o&&(e.node.atime=Date.
now()),o},write(e,r,t,n,i){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var o=0;o<n;o++)e.tty.ops.put_char(
e.tty,r[t+o])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),o}},default_tty_ops:{get_char(e){
return On()},put_char(e,r){r===null||r===10?(se(De(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(se(De(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(te(De(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(te(De(e.output)),e.output=[])}}},Ln=(e,r)=>(l(),ce).fill(0,e,e+r),nt=(e,r)=>Math.ceil(e/r)*r,gr=e=>{
e=nt(e,65536);var r=Pt(65536,e);return r&&Ln(r,e),r},T={ops_table:null,mount(e){return T.createNode(null,"/",16895,0)},createNode(e,r,t,n){
if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(63);T.ops_table||={dir:{node:{getattr:T.node_ops.getattr,setattr:T.
node_ops.setattr,lookup:T.node_ops.lookup,mknod:T.node_ops.mknod,rename:T.node_ops.rename,unlink:T.node_ops.unlink,rmdir:T.
node_ops.rmdir,readdir:T.node_ops.readdir,symlink:T.node_ops.symlink},stream:{llseek:T.stream_ops.llseek}},file:{node:{getattr:T.
node_ops.getattr,setattr:T.node_ops.setattr},stream:{llseek:T.stream_ops.llseek,read:T.stream_ops.read,write:T.stream_ops.
write,mmap:T.stream_ops.mmap,msync:T.stream_ops.msync}},link:{node:{getattr:T.node_ops.getattr,setattr:T.node_ops.setattr,
readlink:T.node_ops.readlink},stream:{}},chrdev:{node:{getattr:T.node_ops.getattr,setattr:T.node_ops.setattr},stream:a.chrdev_stream_ops}};
var i=a.createNode(e,r,t,n);return a.isDir(i.mode)?(i.node_ops=T.ops_table.dir.node,i.stream_ops=T.ops_table.dir.stream,
i.contents={}):a.isFile(i.mode)?(i.node_ops=T.ops_table.file.node,i.stream_ops=T.ops_table.file.stream,i.usedBytes=0,i.contents=
null):a.isLink(i.mode)?(i.node_ops=T.ops_table.link.node,i.stream_ops=T.ops_table.link.stream):a.isChrdev(i.mode)&&(i.node_ops=
T.ops_table.chrdev.node,i.stream_ops=T.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.
atime=e.mtime=e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var n=1024*1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&T.resizeFileStorage(e,r.size)},lookup(e,r){throw T.doesNotExistError||(T.doesNotExistError=new a.ErrnoError(44),
T.doesNotExistError.stack="<generic error, no stack>"),T.doesNotExistError},mknod(e,r,t,n){return T.createNode(e,r,t,n)},
rename(e,r,t){var n;try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var i in n.contents)throw new a.ErrnoError(
55);a.hashRemoveNode(n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.
contents)throw new a.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var n=T.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,n,i){var o=e.node.contents;if(i>=e.node.usedBytes)return 0;var s=Math.
min(e.node.usedBytes-i,n);if(s>8&&o.subarray)r.set(o.subarray(i,i+s),t);else for(var c=0;c<s;c++)r[t+c]=o[i+c];return s},
write(e,r,t,n,i,o){if(r.buffer===(l(),ae).buffer&&(o=!1),!n)return 0;var s=e.node;if(s.mtime=s.ctime=Date.now(),r.subarray&&
(!s.contents||s.contents.subarray)){if(o)return s.contents=r.subarray(t,t+n),s.usedBytes=n,n;if(s.usedBytes===0&&i===0)return s.
contents=r.slice(t,t+n),s.usedBytes=n,n;if(i+n<=s.usedBytes)return s.contents.set(r.subarray(t,t+n),i),n}if(T.expandFileStorage(
s,i+n),s.contents.subarray&&r.subarray)s.contents.set(r.subarray(t,t+n),i);else for(var c=0;c<n;c++)s.contents[i+c]=r[t+
c];return s.usedBytes=Math.max(s.usedBytes,i+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,i){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var o,s,c=e.node.contents;if(!(i&2)&&c&&c.buffer===(l(),ae).buffer)s=!1,o=c.byteOffset;else{if(s=!0,o=gr(r),!o)throw new a.
ErrnoError(48);c&&((t>0||t+r<c.length)&&(c.subarray?c=c.subarray(t,t+r):c=Array.prototype.slice.call(c,t,t+r)),(l(),ae).
set(c,o))}return{ptr:o,allocated:s}},msync(e,r,t,n,i){return T.stream_ops.write(e,r,0,n,t,!1),0}}},Mn=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},br=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},qn=async e=>{var r=await I(e);return new Uint8Array(r)},at=(...e)=>a.createDataFile(
...e),it=[],zn=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of it)if(t.canHandle(r))return t.handle(e,r);return e},
_r=async(e,r,t,n,i,o,s,c)=>{var d=r?Ue.resolve(Q.join2(e,r)):e;Ye();try{var b=t;typeof t=="string"&&(b=await qn(t)),b=await zn(
b,d),c?.(),o||at(e,r,b,n,i,s)}finally{He()}},Wn=(e,r,t,n,i,o,s,c,d,b)=>{_r(e,r,t,n,i,c,d,b).then(o).catch(s)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,Q.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(b=>!!b),i=a.root,o="/",s=0;s<n.length;s++){var c=s===n.length-1;if(c&&r.parent)break;if(n[s]!=="."){if(n[s]===
".."){if(o=Q.dirname(o),a.isRoot(i)){e=o+"/"+n.slice(s+1).join("/"),t--;continue e}else i=i.parent;continue}o=Q.join2(o,
n[s]);try{i=a.lookupNode(i,n[s])}catch(b){if(b?.errno===44&&c&&r.noent_okay)return{path:o};throw b}if(a.isMountpoint(i)&&
(!c||r.follow_mount)&&(i=i.mounted.root),a.isLink(i.mode)&&(!c||r.follow)){if(!i.node_ops.readlink)throw new a.ErrnoError(
52);var d=i.node_ops.readlink(i);Q.isAbs(d)||(d=Q.dirname(o)+"/"+d),e=d+"/"+n.slice(s+1).join("/");continue e}}}return{path:o,
node:i}}throw new a.ErrnoError(32)},getPath(e){for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-
1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-
t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=
a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=
e.name_next;else for(var t=a.nameTable[r];t;){if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){
var t=a.mayLookup(e);if(t)throw new a.ErrnoError(t);for(var n=a.hashName(e.id,r),i=a.nameTable[n];i;i=i.name_next){var o=i.
name;if(i.parent.id===e.id&&o===r)return i}return a.lookup(e,r)},createNode(e,r,t,n){var i=new a.FSNode(e,r,t,n);return a.
hashAddNode(i),i},destroyNode(e){a.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},
isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&
61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},
flagsToPermissionString(e){var r=["r","w","rw"][e&3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?
0:r.includes("r")&&!(e.mode&292)||r.includes("w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.
isDir(e.mode))return 54;var r=a.nodePermissions(e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))
return 54;try{var t=a.lookupNode(e,r);return 20}catch{}return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.
lookupNode(e,r)}catch(o){return o.errno}var i=a.nodePermissions(e,"wx");if(i)return i;if(t){if(!a.isDir(n.mode))return 54;
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
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&te(`warning: ${a.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function i(c){return a.syncFSRequests--,
r(c)}function o(c){if(c)return o.errored?void 0:(o.errored=!0,i(c));++n>=t.length&&i(null)}for(var s of t)s.type.syncfs?
s.type.syncfs(s,e,o):o(null)},mount(e,r,t){var n=t==="/",i=!t,o;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!i){var s=a.
lookupPath(t,{follow_mount:!1});if(t=s.path,o=s.node,a.isMountpoint(o))throw new a.ErrnoError(10);if(!a.isDir(o.mode))throw new a.
ErrnoError(54)}var c={type:e,opts:r,mountpoint:t,mounts:[]},d=e.mount(c);return d.mount=c,c.root=d,n?a.root=d:o&&(o.mounted=
c,o.mount&&o.mount.mounts.push(c)),d},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,i=a.getMounts(n);for(var[o,s]of Object.entries(a.nameTable))for(;s;){var c=s.name_next;
i.includes(s.mount)&&a.destroyNode(s),s=c}t.mounted=null;var d=t.mount.mounts.indexOf(n);t.mount.mounts.splice(d,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),i=n.node,o=Q.basename(e);if(!o)throw new a.
ErrnoError(28);if(o==="."||o==="..")throw new a.ErrnoError(20);var s=a.mayCreate(i,o);if(s)throw new a.ErrnoError(s);if(!i.
node_ops.mknod)throw new a.ErrnoError(63);return i.node_ops.mknod(i,o,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var i of t)if(i){(n||Q.isAbs(e))&&(n+=
"/"),n+=i;try{a.mkdir(n,r)}catch(o){if(o.errno!=20)throw o}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!Ue.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var i=Q.basename(r),o=a.mayCreate(n,i);if(o)throw new a.ErrnoError(o);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,i,e)},rename(e,r){var t=Q.dirname(e),n=Q.dirname(r),i=Q.basename(e),o=Q.basename(
r),s,c,d;if(s=a.lookupPath(e,{parent:!0}),c=s.node,s=a.lookupPath(r,{parent:!0}),d=s.node,!c||!d)throw new a.ErrnoError(
44);if(c.mount!==d.mount)throw new a.ErrnoError(75);var b=a.lookupNode(c,i),g=Ue.relative(e,n);if(g.charAt(0)!==".")throw new a.
ErrnoError(28);if(g=Ue.relative(r,t),g.charAt(0)!==".")throw new a.ErrnoError(55);var S;try{S=a.lookupNode(d,o)}catch{}if(b!==
S){var y=a.isDir(b.mode),N=a.mayDelete(c,i,y);if(N)throw new a.ErrnoError(N);if(N=S?a.mayDelete(d,o,y):a.mayCreate(d,o),
N)throw new a.ErrnoError(N);if(!c.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(b)||S&&a.isMountpoint(S))
throw new a.ErrnoError(10);if(d!==c&&(N=a.nodePermissions(c,"w"),N))throw new a.ErrnoError(N);a.hashRemoveNode(b);try{c.
node_ops.rename(b,d,o),b.parent=d}catch(D){throw D}finally{a.hashAddNode(b)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=Q.basename(e),i=a.lookupNode(t,n),o=a.mayDelete(t,n,!0);if(o)throw new a.ErrnoError(o);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(i)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=Q.basename(e),i=a.lookupNode(t,n),o=a.mayDelete(t,n,!1);if(o)
throw new a.ErrnoError(o);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);
t.node_ops.unlink(t,n),a.destroyNode(i)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)throw new a.ErrnoError(44);if(!t.
node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.lookupPath(e,{follow:!r}),
n=t.node,i=a.checkOpExists(n.node_ops.getattr,63);return i(n)},fstat(e){var r=a.getStreamChecked(e),t=r.node,n=r.stream_ops.
getattr,i=n?r:t;return n??=t.node_ops.getattr,a.checkOpExists(n,63),n(i)},lstat(e){return a.stat(e,!0)},doChmod(e,r,t,n){
a.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:n})},chmod(e,r,t){var n;if(typeof e=="string"){var i=a.
lookupPath(e,{follow:!t});n=i.node}else n=e;a.doChmod(null,n,r,t)},lchmod(e,r){a.chmod(e,r,!0)},fchmod(e,r){var t=a.getStreamChecked(
e);a.doChmod(t,t.node,r,!1)},doChown(e,r,t){a.doSetAttr(e,r,{timestamp:Date.now(),dontFollow:t})},chown(e,r,t,n){var i;if(typeof e==
"string"){var o=a.lookupPath(e,{follow:!n});i=o.node}else i=e;a.doChown(null,i,n)},lchown(e,r,t){a.chown(e,r,t,!0)},fchown(e,r,t){
var n=a.getStreamChecked(e);a.doChown(n,n.node,!1)},doTruncate(e,r,t){if(a.isDir(r.mode))throw new a.ErrnoError(31);if(!a.
isFile(r.mode))throw new a.ErrnoError(28);var n=a.nodePermissions(r,"w");if(n)throw new a.ErrnoError(n);a.doSetAttr(e,r,
{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new a.ErrnoError(28);var t;if(typeof e=="string"){var n=a.lookupPath(
e,{follow:!0});t=n.node}else t=e;a.doTruncate(null,t,r)},ftruncate(e,r){var t=a.getStreamChecked(e);if(r<0||(t.flags&2097155)===
0)throw new a.ErrnoError(28);a.doTruncate(t,t.node,r)},utime(e,r,t){var n=a.lookupPath(e,{follow:!0}),i=n.node,o=a.checkOpExists(
i.node_ops.setattr,63);o(i,{atime:r,mtime:t})},open(e,r,t=438){if(e==="")throw new a.ErrnoError(44);r=typeof r=="string"?
Mn(r):r,r&64?t=t&4095|32768:t=0;var n,i;if(typeof e=="object")n=e;else{i=e.endsWith("/");var o=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=o.node,e=o.path}var s=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(i)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),s=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!s){var c=a.mayOpen(n,r);if(c)throw new a.ErrnoError(c)}r&512&&!s&&a.truncate(n,0),
r&=-131713;var d=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return d.stream_ops.open&&d.stream_ops.open(d),s&&a.chmod(n,t&511),u.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),d},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,i){if(n<
0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(
8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var o=typeof i<"u";
if(!o)i=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var s=e.stream_ops.read(e,r,t,n,i);return o||(e.position+=
s),s},write(e,r,t,n,i,o){if(n<0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===
0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(
28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var s=typeof i<"u";if(!s)i=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var c=e.stream_ops.write(e,r,t,n,i,o);return s||(e.position+=c),c},mmap(e,r,t,n,i){if((n&2)!==0&&(i&2)===0&&(e.flags&
2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.
ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,r,t,n,i)},msync(e,r,t,n,i){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,n,i):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&me(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),i=n.size,o=new Uint8Array(i);return a.
read(t,o,0,i,0),r.encoding==="utf8"&&(o=De(o)),a.close(t),o},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(pr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
me("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,i,o,s,c)=>s,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Ge.register(a.makedev(5,0),Ge.default_tty_ops),Ge.register(a.makedev(6,0),Ge.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(mr(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:T.stream_ops.llseek},r.node_ops={lookup(t,n){var i=+n,
o=a.getStreamChecked(i),s={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>o.path},id:i+1};return s.parent=
s,s},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(T,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:T}},init(e,r,t){a.initialized=!0,e??=u.stdin,r??=u.stdout,t??=u.stderr,a.createStandardStreams(e,r,t)},quit(){a.initialized=
!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=
t.path,n.parentObject=t.node,n.name=Q.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(i){n.error=i.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var i=r.split("/").reverse();i.length;){var o=i.pop();if(o){var s=Q.join2(e,o);try{a.mkdir(s)}catch(c){if(c.
errno!=20)throw c}e=s}}return s},createFile(e,r,t,n,i){var o=Q.join2(typeof e=="string"?e:a.getPath(e),r),s=br(n,i);return a.
create(o,s)},createDataFile(e,r,t,n,i,o){var s=r;e&&(e=typeof e=="string"?e:a.getPath(e),s=r?Q.join2(e,r):e);var c=br(n,
i),d=a.create(s,c);if(t){if(typeof t=="string"){for(var b=new Array(t.length),g=0,S=t.length;g<S;++g)b[g]=t.charCodeAt(g);
t=b}a.chmod(d,c|146);var y=a.open(d,577);a.write(y,t,0,t.length,0,o),a.close(y),a.chmod(d,c)}},createDevice(e,r,t,n){var i=Q.
join2(typeof e=="string"?e:a.getPath(e),r),o=br(!!t,!!n);a.createDevice.major??=64;var s=a.makedev(a.createDevice.major++,
0);return a.registerDevice(s,{open(c){c.seekable=!1},close(c){n?.buffer?.length&&n(10)},read(c,d,b,g,S){for(var y=0,N=0;N<
g;N++){var D;try{D=t()}catch{throw new a.ErrnoError(29)}if(D===void 0&&y===0)throw new a.ErrnoError(6);if(D==null)break;
y++,d[b+N]=D}return y&&(c.node.atime=Date.now()),y},write(c,d,b,g,S){for(var y=0;y<g;y++)try{n(d[b+y])}catch{throw new a.
ErrnoError(29)}return g&&(c.node.mtime=c.node.ctime=Date.now()),y}}),a.mkdev(i,o,s)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)me("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=v(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,i){class o{lengthKnown=!1;chunks=[];get(y){
if(!(y>this.length-1||y<0)){var N=y%this.chunkSize,D=y/this.chunkSize|0;return this.getter(D)[N]}}setDataGetter(y){this.
getter=y}cacheLength(){var y=new XMLHttpRequest;y.open("HEAD",t,!1),y.send(null),y.status>=200&&y.status<300||y.status===
304||me("Couldn't load "+t+". Status: "+y.status);var N=Number(y.getResponseHeader("Content-length")),D,U=(D=y.getResponseHeader(
"Accept-Ranges"))&&D==="bytes",m=(D=y.getResponseHeader("Content-Encoding"))&&D==="gzip",R=1024*1024;U||(R=N);var O=(ie,pe)=>{
ie>pe&&me("invalid range ("+ie+", "+pe+") or no bytes requested!"),pe>N-1&&me("only "+N+" bytes available! programmer er\
ror!");var X=new XMLHttpRequest;return X.open("GET",t,!1),N!==R&&X.setRequestHeader("Range","bytes="+ie+"-"+pe),X.responseType=
"arraybuffer",X.overrideMimeType&&X.overrideMimeType("text/plain; charset=x-user-defined"),X.send(null),X.status>=200&&X.
status<300||X.status===304||me("Couldn't load "+t+". Status: "+X.status),X.response!==void 0?new Uint8Array(X.response||
[]):pr(X.responseText||"")},P=this;P.setDataGetter(ie=>{var pe=ie*R,X=(ie+1)*R-1;return X=Math.min(X,N-1),typeof P.chunks[ie]>
"u"&&(P.chunks[ie]=O(pe,X)),typeof P.chunks[ie]>"u"&&me("doXHR failed!"),P.chunks[ie]}),(m||!N)&&(R=N=1,N=this.getter(0).
length,R=N,se("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=N,this._chunkSize=
R,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){M||me("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var s=new o,c={isDevice:!1,contents:s}}else
var c={isDevice:!1,url:t};var d=a.createFile(e,r,c,n,i);c.contents?d.contents=c.contents:c.url&&(d.contents=null,d.url=c.
url),Object.defineProperties(d,{usedBytes:{get:function(){return this.contents.length}}});var b={};for(const[S,y]of Object.
entries(d.stream_ops))b[S]=(...N)=>(a.forceLoadFile(d),y(...N));function g(S,y,N,D,U){var m=S.node.contents;if(U>=m.length)
return 0;var R=Math.min(m.length-U,D);if(m.slice)for(var O=0;O<R;O++)y[N+O]=m[U+O];else for(var O=0;O<R;O++)y[N+O]=m.get(
U+O);return R}return b.read=(S,y,N,D,U)=>(a.forceLoadFile(d),g(S,y,N,D,U)),b.mmap=(S,y,N,D,U)=>{a.forceLoadFile(d);var m=gr(
y);if(!m)throw new a.ErrnoError(48);return g(S,(l(),ae),m,y,N),{ptr:m,allocated:!0}},d.stream_ops=b,d}},Le=(e,r,t)=>e?De(
(l(),ce),e,r):"",V={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(Q.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var i=V.
getStreamFromFD(e);n=i.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
C)[e/4]=r.dev,(l(),C)[(e+4)/4]=r.mode,(l(),k)[(e+8)/8]=BigInt(r.nlink),(l(),C)[(e+16)/4]=r.uid,(l(),C)[(e+20)/4]=r.gid,(l(),
C)[(e+24)/4]=r.rdev,(l(),Y)[(e+32)/8]=BigInt(r.size),(l(),A)[(e+40)/4]=4096,(l(),A)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),i=r.ctime.getTime();return(l(),Y)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),k)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),Y)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),k)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),Y)[(e+80)/8]=BigInt(Math.
floor(i/1e3)),(l(),k)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(l(),Y)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),C)[(e+8)/
4]=r.bsize,(l(),C)[(e+72)/4]=r.bsize,(l(),Y)[(e+16)/8]=BigInt(r.blocks),(l(),Y)[(e+24)/8]=BigInt(r.bfree),(l(),Y)[(e+32)/
8]=BigInt(r.bavail),(l(),Y)[(e+40)/8]=BigInt(r.files),(l(),Y)[(e+48)/8]=BigInt(r.ffree),(l(),C)[(e+56)/4]=r.fsid,(l(),C)[(e+
80)/4]=r.flags,(l(),C)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,i){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var o=(l(),ce).slice(e,e+t);a.msync(r,o,i,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Le(e);return r}};function ot(e,r,t){if(B)return Z(3,0,1,e,r,t);t=p(t),V.varargs=t;try{var n=V.getStreamFromFD(
e);switch(r){case 0:{var i=fr();if(i<0)return-28;for(;a.streams[i];)i++;var o;return o=a.dupStream(n,i),o.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var i=fr();return n.flags|=i,0}case 5:{var i=Te(),s=0;return(l(),Se)[(i+s)/2]=2,0}case 6:case 7:
return 0}return-28}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Qn(e,r){if(B)return Z(
4,0,1,e,r);r=p(r);try{return V.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var ye=(e,r,t)=>tt(e,(l(),ce),r,t);function st(e,r){if(B)return Z(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=a.cwd(),n=we(t)+1;return r<n?-68:(ye(t,e,r),n)}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}
function lt(e,r,t){if(B)return Z(6,0,1,e,r,t);r=p(r),t=p(t);try{var n=V.getStreamFromFD(e);n.getdents||=a.readdir(n.path);
for(var i=280,o=0,s=a.llseek(n,0,1),c=Math.floor(s/i),d=Math.min(n.getdents.length,c+Math.floor(t/i)),b=c;b<d;b++){var g,
S,y=n.getdents[b];if(y===".")g=n.node.id,S=4;else if(y===".."){var N=a.lookupPath(n.path,{parent:!0});g=N.node.id,S=4}else{
var D;try{D=a.lookupNode(n.node,y)}catch(U){if(U?.errno===28)continue;throw U}g=D.id,S=a.isChrdev(D.mode)?2:a.isDir(D.mode)?
4:a.isLink(D.mode)?10:8}(l(),Y)[(r+o)/8]=BigInt(g),(l(),Y)[(r+o+8)/8]=BigInt((b+1)*i),(l(),Se)[(r+o+16)/2]=280,(l(),ae)[r+
o+18]=S,ye(y,r+o+19,256),o+=i}return a.llseek(n,b*i,0),o}catch(U){if(typeof a>"u"||U.name!=="ErrnoError")throw U;return-U.
errno}}function ut(e,r,t){if(B)return Z(7,0,1,e,r,t);t=p(t),V.varargs=t;try{var n=V.getStreamFromFD(e);switch(r){case 21509:
return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var i=n.tty.ops.ioctl_tcgets(n),o=Te();(l(),
A)[o/4]=i.c_iflag||0,(l(),A)[(o+4)/4]=i.c_oflag||0,(l(),A)[(o+8)/4]=i.c_cflag||0,(l(),A)[(o+12)/4]=i.c_lflag||0;for(var s=0;s<
32;s++)(l(),ae)[o+s+17]=i.c_cc[s]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var o=Te(),c=(l(),A)[o/4],d=(l(),A)[(o+4)/4],b=(l(),A)[(o+8)/4],g=(l(),
A)[(o+12)/4],S=[],s=0;s<32;s++)S.push((l(),ae)[o+s+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:c,c_oflag:d,c_cflag:b,
c_lflag:g,c_cc:S})}return 0}case 21519:{if(!n.tty)return-59;var o=Te();return(l(),A)[o/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var o=Te();return a.ioctl(n,r,o)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var y=n.tty.ops.ioctl_tiocgwinsz(n.tty),o=Te();(l(),Se)[o/2]=y[0],(l(),Se)[(o+2)/2]=y[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(N){if(typeof a>"u"||N.name!=="ErrnoError")throw N;return-N.
errno}}function Vn(e,r){if(B)return Z(8,0,1,e,r);e=p(e),r=p(r);try{return e=V.getStr(e),V.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function Jn(e,r,t,n){if(B)return Z(9,0,1,e,r,t,n);r=p(r),
t=p(t);try{r=V.getStr(r);var i=n&256,o=n&4096;return n=n&-6401,r=V.calculateAt(e,r,o),V.writeStat(t,i?a.lstat(r):a.stat(
r))}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function ct(e,r,t,n){if(B)return Z(10,0,1,e,
r,t,n);r=p(r),n=p(n),V.varargs=n;try{r=V.getStr(r),r=V.calculateAt(e,r);var i=n?fr():0;return a.open(r,t,i).fd}catch(o){
if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function ft(e,r){if(B)return Z(11,0,1,e,r);e=p(e),r=p(r);
try{return e=V.getStr(e),V.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Pn=()=>me("");function $n(e){e=p(e),Ar(e,!M,1,!F,5242880,!1),L.threadInitTLS()}var hr=e=>{if(e instanceof Mr||e=="un\
wind")return ee;h(1,e)},Hn=()=>{if(!or())try{if(B){rr()&&Gr(ee);return}lr(ee)}catch(e){hr(e)}},Ee=e=>{if(!ke)try{e(),Hn()}catch(r){
hr(r)}};function vr(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),A),e/4,e);r.value.then(Xe);var t=e+228;
Atomics.store((l(),A),t/4,1)}}var Xe=()=>Ee(()=>{var e=rr();e&&(vr(e),Kt())});function Yn(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
Xe);else if(B)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=L.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var Ze=[];function Kn(e,r,t,n,i){t=p(t),i=p(i),n/=2,Ze.length=n;for(var o=i/8,s=0;s<n;s++)(l(),Y)[o+2*s]?
Ze[s]=(l(),Y)[o+2*s+1]:Ze[s]=(l(),Ie)[o+2*s+1];var c=oi[e];L.currentProxiedOperationCallerThread=t;var d=c(...Ze);return L.
currentProxiedOperationCallerThread=0,typeof d=="bigint"&&(d=p(d)),d}function Xn(e){e=p(e),B?postMessage({cmd:"cleanupTh\
read",thread:e}):zr(e)}function Zn(e){e=p(e),w&&L.pthreads[e].ref()}var ea=e=>e%4===0&&(e%100!==0||e%400===0),ra=[0,31,60,
91,121,152,182,213,244,274,305,335],ta=[0,31,59,90,120,151,181,212,243,273,304,334],na=e=>{var r=ea(e.getFullYear()),t=r?
ra:ta,n=t[e.getMonth()]+e.getDate()-1;return n};function aa(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(l(),A)[r/4]=t.getSeconds(),
(l(),A)[(r+4)/4]=t.getMinutes(),(l(),A)[(r+8)/4]=t.getHours(),(l(),A)[(r+12)/4]=t.getDate(),(l(),A)[(r+16)/4]=t.getMonth(),
(l(),A)[(r+20)/4]=t.getFullYear()-1900,(l(),A)[(r+24)/4]=t.getDay();var n=na(t)|0;(l(),A)[(r+28)/4]=n,(l(),Y)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),o=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
s=i.getTimezoneOffset(),c=(o!=s&&t.getTimezoneOffset()==Math.min(s,o))|0;(l(),A)[(r+32)/4]=c}function mt(e,r,t,n,i,o,s){
if(B)return Z(12,0,1,e,r,t,n,i,o,s);e=p(e),i=p(i),o=p(o),s=p(s);try{var c=V.getStreamFromFD(n),d=a.mmap(c,e,i,r,t),b=d.ptr;
return(l(),A)[o/4]=d.allocated,(l(),k)[s/8]=BigInt(b),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function dt(e,r,t,n,i,o){if(B)return Z(13,0,1,e,r,t,n,i,o);e=p(e),r=p(r),o=p(o);try{var s=V.getStreamFromFD(i);t&
2&&V.doMsync(e,s,r,n,o)}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}var ia=function(e,r,t,n){
e=p(e),r=p(r),t=p(t),n=p(n);var i=new Date().getFullYear(),o=new Date(i,0,1),s=new Date(i,6,1),c=o.getTimezoneOffset(),d=s.
getTimezoneOffset(),b=Math.max(c,d);(l(),k)[e/8]=BigInt(b*60),(l(),A)[r/4]=+(c!=d);var g=N=>{var D=N>=0?"-":"+",U=Math.abs(
N),m=String(Math.floor(U/60)).padStart(2,"0"),R=String(U%60).padStart(2,"0");return`UTC${D}${m}${R}`},S=g(c),y=g(d);d<c?
(ye(S,t,17),ye(y,n,17)):(ye(S,n,17),ye(y,t,17))},pt=()=>performance.timeOrigin+performance.now(),gt=()=>Date.now(),oa=e=>e>=
0&&e<=3;function sa(e,r,t){if(t=p(t),!oa(e))return 28;var n;e===0?n=gt():n=pt();var i=Math.round(n*1e3*1e3);return(l(),Y)[t/
8]=BigInt(i),0}var la=()=>{},Re=()=>{Ke+=1},ua=()=>{throw Re(),"unwind"},ca=()=>new Error().stack.toString(),fa=e=>{var r=ca(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var o of t){
var s="",c="",d=0,b=0,g=i.exec(o);if(g?.length==5)s=g[1],c=g[2],d=g[3],b=g[4];else if(g=n.exec(o),g?.length>=4)s=g[1],c=
g[2],d=g[3],b=g[4]|0;else{r+=o+`
`;continue}if(s=="_emscripten_log"||s=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(c=c.substring(c.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${s} (${c}:${d}:${b})
`)}return r=r.replace(/\s+$/,""),r};function ma(e,r,t){r=p(r);var n=fa(e);if(!r||t<=0)return we(n)+1;var i=ye(n,r,t);return i+
1}var bt=()=>4294967296,da=()=>BigInt(bt()),pa=()=>2,ga=()=>w?require("os").cpus().length:navigator.hardwareConcurrency,
ba=e=>{var r=ve.buffer.byteLength,t=(e-r+65535)/65536|0;try{return ve.grow(BigInt(t)),$e(),1}catch{}};function _a(e){e=p(
e);var r=(l(),ce).length;if(e<=r)return!1;var t=bt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var i=r*(1+.2/n);i=Math.min(
i,e+100663296);var o=Math.min(t,nt(Math.max(e,i),65536)),s=ba(o);if(s)return!0}return!1}var Be=e=>{var r=we(e)+1,t=sr(r);
return ye(e,t,r),t},ha=(e,r)=>{(l(),C)[e/4]=r;var t=(l(),C)[e/4];(l(),C)[(e+4)/4]=(r-t)/4294967296},va=e=>{var r=we(e)+1,
t=Ft(r);return t&&ye(e,t,r),t},Fe=e=>(l(),C)[e/4]+(l(),A)[(e+4)/4]*4294967296,f={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
f.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{f.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return f.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=qt(r);return f.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=wr(r);return f.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=yr(r);return f.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{H(e.mapState==="unmapped");var t=zt(r);return f.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Er(r);return f.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=kr(r);return f.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Sr(r);return f.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Br(r);return f.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Nr(
r),n=Wt(r,t);return f.Internals.jsObjectInsert(t,e.queue),f.Internals.jsObjectInsert(n,e),u.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=At(r);return f.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=Gt(
r);return f.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Ct(r);return f.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Nr(r);return f.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Tt(r);return f.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=Ut(r);return f.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=Dt(r);return f.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Rt(r);return f.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=jt(r);return f.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=Qt(
r);return f.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Ot(r);return f.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Lt(r);return f.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=Mt(r);return f.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var i=_e(),o=Be(t);((s,c,d)=>Kr(e).call(null,s,BigInt(c),BigInt(d)))(r,BigInt(o),n),he(i)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),k)[e/8]);t;t=Number((l(),k)[t/8])){var n=(l(),A)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),k)[e/8]=BigInt(r),(l(),k)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),k)[e/8]),t=Number((l(),
k)[(e+8)/8]);return Le(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),k)[e/8]),t=Number((l(),k)[(e+8)/8]);
return r?Le(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),Ie)[e/8],g:(l(),Ie)[(e+8)/8],b:(l(),Ie)[(e+16)/8],a:(l(),Ie)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),C)[e/4],height:(l(),C)[(e+4)/4],depthOrArrayLayers:(l(),C)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),C)[e/4],y:(l(),C)[(e+4)/4],z:(l(),C)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:f.getJsObject(Number((l(),k)[e/
8])),mipLevel:(l(),C)[(e+8)/4],origin:f.makeOrigin3D(e+12),aspect:f.TextureAspect[(l(),A)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),C)[(e+8)/4],t=(l(),C)[(e+12)/4];return{offset:Fe(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=f.makeTexelCopyBufferLayout(r);return t.buffer=f.getJsObject(Number((l(),
k)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:f.getJsObject(Number((l(),k)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
C)[(e+16)/4],endOfPassWriteIndex:(l(),C)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var i=r+
32*n,o=f.makeStringFromStringView(i+8);t[o]=(l(),Ie)[(i+24)/8]}return t}},makePipelineLayout:e=>e?f.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:f.getJsObject(Number((l(),k)[(e+8)/8])),constants:f.makePipelineConstants(Number(
(l(),k)[(e+32)/8]),Number((l(),k)[(e+40)/8])),entryPoint:f.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((l(),k)[(e+24)/8])),compute:f.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(m){if(m)return{topology:f.PrimitiveTopology[(l(),A)[(m+8)/4]],stripIndexFormat:f.
IndexFormat[(l(),A)[(m+12)/4]],frontFace:f.FrontFace[(l(),A)[(m+16)/4]],cullMode:f.CullMode[(l(),A)[(m+20)/4]],unclippedDepth:!!(l(),
C)[(m+24)/4]}}function t(m){if(m)return{operation:f.BlendOperation[(l(),A)[m/4]],srcFactor:f.BlendFactor[(l(),A)[(m+4)/4]],
dstFactor:f.BlendFactor[(l(),A)[(m+8)/4]]}}function n(m){if(m)return{alpha:t(m+12),color:t(m+0)}}function i(m){var R=f.TextureFormat[(l(),
A)[(m+8)/4]];return R?{format:R,blend:n(Number((l(),k)[(m+16)/8])),writeMask:(l(),C)[(m+24)/4]}:void 0}function o(m,R){for(var O=[],
P=0;P<m;++P)O.push(i(R+32*P));return O}function s(m){return{compare:f.CompareFunction[(l(),A)[m/4]],failOp:f.StencilOperation[(l(),
A)[(m+4)/4]],depthFailOp:f.StencilOperation[(l(),A)[(m+8)/4]],passOp:f.StencilOperation[(l(),A)[(m+12)/4]]}}function c(m){
if(m)return{format:f.TextureFormat[(l(),A)[(m+8)/4]],depthWriteEnabled:!!(l(),C)[(m+12)/4],depthCompare:f.CompareFunction[(l(),
A)[(m+16)/4]],stencilFront:s(m+20),stencilBack:s(m+36),stencilReadMask:(l(),C)[(m+52)/4],stencilWriteMask:(l(),C)[(m+56)/
4],depthBias:(l(),A)[(m+60)/4],depthBiasSlopeScale:(l(),ar)[(m+64)/4],depthBiasClamp:(l(),ar)[(m+68)/4]}}function d(m){return{
format:f.VertexFormat[(l(),A)[(m+8)/4]],offset:Fe(m+16),shaderLocation:(l(),C)[(m+24)/4]}}function b(m,R){for(var O=[],P=0;P<
m;++P)O.push(d(R+P*32));return O}function g(m){if(m){var R=f.VertexStepMode[(l(),A)[(m+8)/4]],O=Number((l(),k)[(m+24)/8]);
return!R&&!O?null:{arrayStride:Fe(m+16),stepMode:R,attributes:b(O,Number((l(),k)[(m+32)/8]))}}}function S(m,R){if(m){for(var O=[],
P=0;P<m;++P)O.push(g(R+P*40));return O}}function y(m){if(m){var R={module:f.getJsObject(Number((l(),k)[(m+8)/8])),constants:f.
makePipelineConstants(Number((l(),k)[(m+32)/8]),Number((l(),k)[(m+40)/8])),buffers:S(Number((l(),k)[(m+48)/8]),Number((l(),
k)[(m+56)/8])),entryPoint:f.makeStringFromOptionalStringView(m+16)};return R}}function N(m){if(m)return{count:(l(),C)[(m+
8)/4],mask:(l(),C)[(m+12)/4],alphaToCoverageEnabled:!!(l(),C)[(m+16)/4]}}function D(m){if(m){var R={module:f.getJsObject(
Number((l(),k)[(m+8)/8])),constants:f.makePipelineConstants(Number((l(),k)[(m+32)/8]),Number((l(),k)[(m+40)/8])),targets:o(
Number((l(),k)[(m+48)/8]),Number((l(),k)[(m+56)/8])),entryPoint:f.makeStringFromOptionalStringView(m+16)};return R}}var U={
label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((l(),k)[(e+24)/8])),vertex:y(e+32),primitive:r(
e+96),depthStencil:c(Number((l(),k)[(e+128)/8])),multisample:N(e+136),fragment:D(Number((l(),k)[(e+160)/8]))};return U},
fillLimitStruct:(e,r)=>{var t=Number((l(),k)[r/8]);function n(s,c,d,b=0){var g=e[s]??b;(l(),C)[(c+d)/4]=g}function i(s,c,d,b=0){
var g=e[s]??b;ha(c+d,g)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("maxTextureDimension3D",r,16),
n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),n("maxBindingsPerBindGr\
oup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipelineLayout",r,40),n("ma\
xSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPerShaderStage",r,52),n("m\
axStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBufferOffsetAlignment",r,80),
n("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageBufferBindingSize",r,72),n(
"maxVertexBuffers",r,88),i("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBufferArrayStride",r,108),n(
"maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentBytesPerSample",r,120),n("maxC\
omputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeWorkgroupSizeX",r,132),n("m\
axComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPerDimension",r,144),n("maxIm\
mediateSize",r,148),t!==0){(l(),A)[(t+8)/4];var o=t;n("maxStorageBuffersInVertexStage",o,16,e.maxStorageBuffersPerShaderStage),
n("maxStorageBuffersInFragmentStage",o,24,e.maxStorageBuffersPerShaderStage),n("maxStorageTexturesInVertexStage",o,20,e.
maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",o,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(l(),C)[(r+88)/4]=e.subgroupMinSize,(l(),C)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
n=va(t),i=we(e.vendor);f.setStringView(r+8,n,i),n+=i;var o=we(e.architecture);f.setStringView(r+24,n,o),n+=o;var s=we(e.
device);f.setStringView(r+40,n,s),n+=s;var c=we(e.description);f.setStringView(r+56,n,c),n+=c,(l(),A)[(r+72)/4]=2;var d=e.
isFallbackAdapter?3:4;(l(),A)[(r+76)/4]=d,(l(),C)[(r+80)/4]=0,(l(),C)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},wa={undefined:1,unknown:1,destroyed:2},
xe=()=>{Ke-=1};function ya(e,r,t,n,i,o){e=p(e),r=p(r),t=p(t),n=p(n),i=p(i),o=p(o);var s=f.getJsObject(e),c={};if(o){var d=Number(
(l(),k)[(o+24)/8]);if(d){var b=Number((l(),k)[(o+32)/8]);c.requiredFeatures=Array.from((l(),C).subarray(b/4,(b+d*4)/4),m=>f.
FeatureName[m])}var g=Number((l(),k)[(o+40)/8]);if(g){let m=function(O,P,ie,pe=!1){var X=P+ie,ze=(l(),C)[X/4];ze!=4294967295&&
(!pe||ze!=0)&&(y[O]=ze)},R=function(O,P,ie){var pe=P+ie,X=(l(),C)[pe/4],ze=(l(),C)[(pe+4)/4];(X!=4294967295||ze!=4294967295)&&
(y[O]=Fe(pe))};var S=Number((l(),k)[g/8]),y={};if(m("maxTextureDimension1D",g,8),m("maxTextureDimension2D",g,12),m("maxT\
extureDimension3D",g,16),m("maxTextureArrayLayers",g,20),m("maxBindGroups",g,24),m("maxBindGroupsPlusVertexBuffers",g,28),
m("maxBindingsPerBindGroup",g,32),m("maxDynamicUniformBuffersPerPipelineLayout",g,36),m("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),m("maxSampledTexturesPerShaderStage",g,44),m("maxSamplersPerShaderStage",g,48),m("maxStorageBuffersPer\
ShaderStage",g,52),m("maxStorageTexturesPerShaderStage",g,56),m("maxUniformBuffersPerShaderStage",g,60),m("minUniformBuf\
ferOffsetAlignment",g,80),m("minStorageBufferOffsetAlignment",g,84),R("maxUniformBufferBindingSize",g,64),R("maxStorageB\
ufferBindingSize",g,72),m("maxVertexBuffers",g,88),R("maxBufferSize",g,96),m("maxVertexAttributes",g,104),m("maxVertexBu\
fferArrayStride",g,108),m("maxInterStageShaderVariables",g,112),m("maxColorAttachments",g,116),m("maxColorAttachmentByte\
sPerSample",g,120),m("maxComputeWorkgroupStorageSize",g,124),m("maxComputeInvocationsPerWorkgroup",g,128),m("maxComputeW\
orkgroupSizeX",g,132),m("maxComputeWorkgroupSizeY",g,136),m("maxComputeWorkgroupSizeZ",g,140),m("maxComputeWorkgroupsPer\
Dimension",g,144),m("maxImmediateSize",g,148,!0),S!==0){(l(),A)[(S+8)/4];var N=S;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(m("maxStorageBuffersInVertexStage",N,16),m("maxStorageTexturesInVertexStage",N,20),m("maxStorageBuffersInFra\
gmentStage",N,24),m("maxStorageTexturesInFragmentStage",N,28))}c.requiredLimits=y}var D=Number((l(),k)[(o+48)/8]);if(D){
var U={label:f.makeStringFromOptionalStringView(D+8)};c.defaultQueue=U}c.label=f.makeStringFromOptionalStringView(o+8)}Re(),
f.Internals.futureInsert(r,s.requestDevice(c).then(m=>{xe(),Ee(()=>{f.Internals.jsObjectInsert(i,m.queue),f.Internals.jsObjectInsert(
n,m),u.peercomputeOnDevice?.(m),n=BigInt(n),f.Internals.futureInsert(t,m.lost.then(R=>{Ee(()=>{m.onuncapturederror=ie=>{};
var O=_e(),P=Be(R.message);Ir(t,wa[R.reason],BigInt(P)),he(O)})})),m.onuncapturederror=R=>{var O=5;R.error instanceof GPUValidationError?
O=2:R.error instanceof GPUOutOfMemoryError?O=3:R.error instanceof GPUInternalError&&(O=4);var P=_e(),ie=Be(R.error.message);
Jt(BigInt(n),O,BigInt(ie)),he(P)},xr(r,1,BigInt(n),0n)})},m=>{xe(),Ee(()=>{var R=_e(),O=Be(m.message);xr(r,3,BigInt(n),BigInt(
O)),t&&Ir(t,4,BigInt(O)),he(R)})}))}function Ea(e){e=p(e);var r=f.getJsObject(e),t=f.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete f.Internals.bufferOnUnmaps[e]}r.destroy()}var ka=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=(()=>{
var i=f.getJsObject(e);t==-1&&(t=void 0);var o;try{o=i.getMappedRange(r,t)}catch{return 0n}var s=Xt(16,o.byteLength);return(l(),
ce).set(new Uint8Array(o),s),f.Internals.bufferOnUnmaps[e].push(()=>xt(s)),s})();return BigInt(n)},Sa=function(e,r,t,n,i){
e=p(e),r=p(r),t=p(t),n=p(n),i=p(i);var o=f.getJsObject(e);f.Internals.bufferOnUnmaps[e]=[],i==-1&&(i=void 0),Re(),f.Internals.
futureInsert(r,o.mapAsync(t,n,i).then(()=>{xe(),Ee(()=>{Fr(r,1,0n)})},s=>{xe(),Ee(()=>{var c=_e(),d=Be(s.message),b=s.name===
"AbortError"?4:s.name==="OperationError"?3:0;Fr(r,b,BigInt(d)),delete f.Internals.bufferOnUnmaps[e]})}))};function Ba(e){
e=p(e);var r=f.getJsObject(e),t=f.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete f.Internals.
bufferOnUnmaps[e],r.unmap()}}function Na(e){e=p(e),delete f.Internals.jsObjects[e]}function Ia(e,r,t){e=p(e),r=p(r),t=p(
t);var n=!!(l(),C)[(r+40)/4],i={label:f.makeStringFromOptionalStringView(r+8),usage:(l(),C)[(r+24)/4],size:Fe(r+32),mappedAtCreation:n},
o=f.getJsObject(e),s;try{s=o.createBuffer(i)}catch{return!1}return f.Internals.jsObjectInsert(t,s),n&&(f.Internals.bufferOnUnmaps[t]=
[]),!0}function Fa(e,r,t){e=p(e),r=p(r),t=p(t);var n=Number((l(),k)[r/8]),i=(l(),A)[(n+8)/4],o={label:f.makeStringFromOptionalStringView(
r+8),code:""};switch(i){case 2:{o.code=f.makeStringFromStringView(n+16);break}}var s=f.getJsObject(e);f.Internals.jsObjectInsert(
t,s.createShaderModule(o))}var xa=e=>{const r=f.getJsObject(e);r.onuncapturederror=null,r.destroy()};function Aa(e,r,t,n){
r=p(r),t=p(t),n=p(n);var i;if(t){i={featureLevel:f.FeatureLevel[(l(),A)[(t+8)/4]],powerPreference:f.PowerPreference[(l(),
A)[(t+12)/4]],forceFallbackAdapter:!!(l(),C)[(t+16)/4]};var o=Number((l(),k)[t/8]);if(o!==0){(l(),A)[(o+8)/4];var s=o;i.
xrCompatible=!!(l(),C)[(s+16)/4]}}if(!("gpu"in navigator)){var c=_e(),d=Be("WebGPU not available on this browser (naviga\
tor.gpu is not available)");qe(r,3,BigInt(n),BigInt(d)),he(c);return}Re(),f.Internals.futureInsert(r,navigator.gpu.requestAdapter(
i).then(b=>{xe(),Ee(()=>{if(b)f.Internals.jsObjectInsert(n,b),qe(r,1,BigInt(n),0n);else{var g=_e(),S=Be("WebGPU not avai\
lable on this browser (requestAdapter returned null)");qe(r,3,BigInt(n),BigInt(S)),he(g)}})},b=>{xe(),Ee(()=>{var g=_e(),
S=Be(b.message);qe(r,4,BigInt(n),BigInt(S)),he(g)})}))}var Ga=function(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);Re(),f.
Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{xe(),Ee(()=>{Vt(r,1)})}))},_t=function(e,r,t){return e=p(e),r=
p(r),t=p(t),de.handleAsync(async()=>{var n=[];if(t){var i=(l(),A)[t/4];n.length=r+1,n[r]=new Promise(d=>setTimeout(d,i,0))}else
n.length=r;for(var o=0;o<r;++o){var s=Fe(e+o*8);if(!(s in f.Internals.futures))return s;n[o]=f.Internals.futures[s]}const c=await Promise.
race(n);return delete f.Internals.futures[c],c})};_t.isAsync=!0;var er={},Ca=()=>x||"./this.program",Me=()=>{if(!Me.strings){
var e=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_us\
er",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Ca()};for(var t in er)er[t]===void 0?delete r[t]:r[t]=er[t];var n=[];
for(var t in r)n.push(`${t}=${r[t]}`);Me.strings=n}return Me.strings};function ht(e,r){if(B)return Z(14,0,1,e,r);e=p(e),
r=p(r);var t=0,n=0;for(var i of Me()){var o=r+t;(l(),k)[(e+n)/8]=BigInt(o),t+=ye(i,o,1/0)+1,n+=8}return 0}function vt(e,r){
if(B)return Z(15,0,1,e,r);e=p(e),r=p(r);var t=Me();(l(),k)[e/8]=BigInt(t.length);var n=0;for(var i of t)n+=we(i)+1;return(l(),
k)[r/8]=BigInt(n),0}function wt(e){if(B)return Z(16,0,1,e);try{var r=V.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>
"u"||t.name!=="ErrnoError")throw t;return t.errno}}var Ta=(e,r,t,n)=>{for(var i=0,o=0;o<t;o++){var s=Number((l(),k)[r/8]),
c=Number((l(),k)[(r+8)/8]);r+=16;var d=a.read(e,(l(),ae),s,c,n);if(d<0)return-1;if(i+=d,d<c)break}return i};function yt(e,r,t,n){
if(B)return Z(17,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var i=V.getStreamFromFD(e),o=Ta(i,r,t);return(l(),k)[n/8]=BigInt(
o),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}function Et(e,r,t,n){if(B)return Z(18,0,1,e,
r,t,n);r=p(r),n=p(n);try{if(isNaN(r))return 61;var i=V.getStreamFromFD(e);return a.llseek(i,r,t),(l(),Y)[n/8]=BigInt(i.position),
i.getdents&&r===0&&t===0&&(i.getdents=null),0}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return o.errno}}var Ua=(e,r,t,n)=>{
for(var i=0,o=0;o<t;o++){var s=Number((l(),k)[r/8]),c=Number((l(),k)[(r+8)/8]);r+=16;var d=a.write(e,(l(),ae),s,c,n);if(d<
0)return-1;if(i+=d,d<c)break}return i};function kt(e,r,t,n){if(B)return Z(19,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var i=V.
getStreamFromFD(e),o=Ua(i,r,t);return(l(),k)[n/8]=BigInt(o),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.
errno}}function Da(e,r){e=p(e),r=p(r);try{return mr((l(),ce).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="Errn\
oError")throw t;return t.errno}}function Ra(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillAdapterInfoStruct(t.info,
r),1}function ja(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillLimitStruct(t.limits,r),1}function Oa(e,r){e=p(e);
var t=f.getJsObject(e);return t.features.has(f.FeatureName[r])}var La=function(e){e=p(e);var r=(()=>{var t=f.getJsObject(
e);return t.size})();return BigInt(r)},Ma=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:f.makeStringFromOptionalStringView(
r+8),timestampWrites:f.makePassTimestampWrites(Number((l(),k)[(r+24)/8]))});var i=f.getJsObject(e),o=Sr(0n);return f.Internals.
jsObjectInsert(o,i.beginComputePass(n)),o})();return BigInt(t)};function qa(e,r,t,n,i,o){e=p(e),r=p(r),t=p(t),n=p(n),i=p(
i),o=p(o);var s=f.getJsObject(e),c=f.getJsObject(r),d=f.getJsObject(n);s.copyBufferToBuffer(c,t,d,i,o)}var za=function(e,r){
e=p(e);var t=(()=>{var n=f.getJsObject(e),i=Er(0n);return f.Internals.jsObjectInsert(i,n.finish()),i})();return BigInt(t)};
function Wa(e,r,t,n){e=p(e);var i=f.getJsObject(e);i.dispatchWorkgroups(r,t,n)}function Qa(e){e=p(e);var r=f.getJsObject(
e);r.end()}function Va(e,r,t,n,i){e=p(e),t=p(t),n=p(n),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(t);n==0?o.setBindGroup(
r,s):o.setBindGroup(r,s,(l(),C),i/4,n)}function Ja(e,r){e=p(e),r=p(r);var t=f.getJsObject(e),n=f.getJsObject(r);t.setPipeline(
n)}var Pa=function(e,r){e=p(e);var t=(()=>{var n=f.getJsObject(e),i=yr(0n);return f.Internals.jsObjectInsert(i,n.getBindGroupLayout(
r)),i})();return BigInt(t)},$a=function(e,r){e=p(e),r=p(r);var t=(()=>{function n(d){var b=Number((l(),k)[(d+16)/8]),g=Number(
(l(),k)[(d+40)/8]),S=Number((l(),k)[(d+48)/8]),y=0;f.iterateExtensions(d,{327681:U=>{y=Number((l(),k)[(U+16)/8])}});var N;
if(b){var D=Fe(d+32);D==-1&&(D=void 0),N={buffer:f.getJsObject(b),offset:Fe(d+24),size:D}}else N=f.getJsObject(g||S||y);
return{binding:(l(),C)[(d+8)/4],resource:N}}function i(d,b){for(var g=[],S=0;S<d;++S)g.push(n(b+56*S));return g}var o={label:f.
makeStringFromOptionalStringView(r+8),layout:f.getJsObject(Number((l(),k)[(r+24)/8])),entries:i(Number((l(),k)[(r+32)/8]),
Number((l(),k)[(r+40)/8]))},s=f.getJsObject(e),c=wr(0n);return f.Internals.jsObjectInsert(c,s.createBindGroup(o)),c})();
return BigInt(t)},Ha=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:f.makeStringFromOptionalStringView(r+8)});
var i=f.getJsObject(e),o=kr(0n);return f.Internals.jsObjectInsert(o,i.createCommandEncoder(n)),o})();return BigInt(t)},Ya=function(e,r){
e=p(e),r=p(r);var t=(()=>{var n=f.makeComputePipelineDesc(r),i=f.getJsObject(e),o=Br(0n);return f.Internals.jsObjectInsert(
o,i.createComputePipeline(n)),o})();return BigInt(t)};function Ka(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(f.WGSLLanguageFeatureName[r]):!1}var Xa=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=f.getJsObject(
e),i=Array.from((l(),Y).subarray(t/8,(t+r*8)/8),o=>f.getJsObject(o));n.submit(i)};function Za(e,r,t,n,i){e=p(e),r=p(r),t=
p(t),n=p(n),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(r),c=(l(),ce).subarray(n,n+i);o.writeBuffer(s,t,c,0,i)}var de={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;de.asyncExports=new Set;var t={};for(let[i,o]of Object.entries(
e))if(typeof o=="function"){r.test(i)&&(de.asyncExports.add(o),o=de.makeAsyncFunction(o));var n=de.instrumentFunction(o);
t[i]=n}else t[i]=o;return t},asyncExports:null,isAsyncExport(e){return de.asyncExports?.has(e)},handleAsync:async e=>{Re();
try{return await e()}finally{xe()}},handleSleep:e=>de.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},St=e=>{var r=u["_"+e];return r},ei=(e,r)=>{(l(),ae).set(e,r)},Bt=(e,r,t,n,i)=>{var o={pointer:U=>BigInt(U),
string:U=>{var m=0;return U!=null&&U!==0&&(m=Be(U)),BigInt(m)},array:U=>{var m=sr(U.length);return ei(U,m),BigInt(m)}};function s(U){
return r==="string"?Le(Number(U)):r==="pointer"?Number(U):r==="boolean"?!!U:U}var c=St(e),d=[],b=0;if(n)for(var g=0;g<n.
length;g++){var S=o[t[g]];S?(b===0&&(b=_e()),d[g]=S(n[g])):d[g]=n[g]}var y=c(...d);function N(U){return b!==0&&he(b),s(U)}
var D=i?.async;return D?y.then(N):(y=N(y),y)},ri=(e,r,t,n)=>{var i=!t||t.every(s=>s==="number"||s==="boolean"),o=r!=="st\
ring";return o&&i&&!n?St(e):(...s)=>Bt(e,r,t,s,n)},ti=(...e)=>a.createPath(...e),ni=(...e)=>a.unlink(...e),ai=(...e)=>a.
createLazyFile(...e),ii=(...e)=>a.createDevice(...e);if(L.init(),a.createPreloadedFile=Wn,a.preloadFile=_r,a.staticInit(),
En(),u.noExitRuntime&&(cr=u.noExitRuntime),u.preloadPlugins&&(it=u.preloadPlugins),u.print&&(se=u.print),u.printErr&&(te=
u.printErr),u.wasmBinary&&(ge=u.wasmBinary),u.arguments&&u.arguments,u.thisProgram&&(x=u.thisProgram),u.preInit)for(typeof u.
preInit=="function"&&(u.preInit=[u.preInit]);u.preInit.length>0;)u.preInit.shift()();u.ENV=er,u.mmapAlloc=gr,u.wasmMemory=
ve,u.addRunDependency=Ye,u.removeRunDependency=He,u.ccall=Bt,u.cwrap=ri,u.FS_preloadFile=_r,u.FS_unlink=ni,u.FS_createPath=
ti,u.FS_createDevice=ii,u.FS=a,u.FS_createDataFile=at,u.FS_createLazyFile=ai,u.MEMFS=T;var oi=[Pr,$r,Zr,ot,Qn,st,lt,ut,Vn,
Jn,ct,ft,mt,dt,ht,vt,wt,yt,Et,kt];function Nt(e,r,t,n){return de.handleAsync(async()=>await _(Le(Number(e)),Number(r),Number(
t),Number(n)))}Nt.sig="jjjjj";var It,Ft,xt,wr,yr,Er,kr,Sr,Br,At,Gt,Ct,Tt,Ut,Dt,Rt,jt,Ot,Lt,Mt,qt,zt,Wt,Nr,Qt,Ir,Fr,qe,xr,
Vt,Jt,rr,Pt,Ar,$t,Ht,Yt,Gr,Kt,Xt,Zt,en,rn,tn,nn,an;function si(e){u._wllama_malloc=e.wllama_malloc,u._wllama_start=e.wllama_start,
u._wllama_action=e.wllama_action,u._wllama_exit=e.wllama_exit,u._wllama_debug=e.wllama_debug,It=u._main=e.main,Ft=e.malloc,
xt=e.free,wr=e.emwgpuCreateBindGroup,yr=e.emwgpuCreateBindGroupLayout,Er=e.emwgpuCreateCommandBuffer,kr=e.emwgpuCreateCommandEncoder,
Sr=e.emwgpuCreateComputePassEncoder,Br=e.emwgpuCreateComputePipeline,At=e.emwgpuCreateExternalTexture,Gt=e.emwgpuCreatePipelineLayout,
Ct=e.emwgpuCreateQuerySet,Tt=e.emwgpuCreateRenderBundle,Ut=e.emwgpuCreateRenderBundleEncoder,Dt=e.emwgpuCreateRenderPassEncoder,
Rt=e.emwgpuCreateRenderPipeline,jt=e.emwgpuCreateSampler,Ot=e.emwgpuCreateSurface,Lt=e.emwgpuCreateTexture,Mt=e.emwgpuCreateTextureView,
qt=e.emwgpuCreateAdapter,zt=e.emwgpuCreateBuffer,Wt=e.emwgpuCreateDevice,Nr=e.emwgpuCreateQueue,Qt=e.emwgpuCreateShaderModule,
Ir=e.emwgpuOnDeviceLostCompleted,Fr=e.emwgpuOnMapAsyncCompleted,qe=e.emwgpuOnRequestAdapterCompleted,xr=e.emwgpuOnRequestDeviceCompleted,
Vt=e.emwgpuOnWorkDoneCompleted,Jt=e.emwgpuOnUncapturedError,e._emscripten_tls_init,rr=e.pthread_self,Pt=e.emscripten_builtin_memalign,
Ar=e._emscripten_thread_init,$t=e._emscripten_thread_crashed,Ht=e._emscripten_run_js_on_main_thread,Yt=e._emscripten_thread_free_data,
Gr=e._emscripten_thread_exit,Kt=e._emscripten_check_mailbox,Xt=e.memalign,Zt=e.__trap,en=e.emscripten_stack_set_limits,rn=
e._emscripten_stack_restore,tn=e._emscripten_stack_alloc,nn=e.emscripten_stack_get_current,an=e.__indirect_function_table}
var je;function li(){je={__asyncjs__js_file_read:Nt,__pthread_create_js:et,__syscall_fcntl64:ot,__syscall_getcwd:st,__syscall_getdents64:lt,
__syscall_ioctl:ut,__syscall_openat:ct,__syscall_stat64:ft,_abort_js:Pn,_emscripten_init_main_thread_js:$n,_emscripten_notify_mailbox_postmessage:Yn,
_emscripten_receive_on_main_thread_js:Kn,_emscripten_thread_cleanup:Xn,_emscripten_thread_mailbox_await:vr,_emscripten_thread_set_strongref:Zn,
_localtime_js:aa,_mmap_js:mt,_munmap_js:dt,_tzset_js:ia,clock_time_get:sa,emscripten_check_blocking_allowed:la,emscripten_date_now:gt,
emscripten_exit_with_live_runtime:ua,emscripten_get_callstack:ma,emscripten_get_heap_max:da,emscripten_get_now:pt,emscripten_has_asyncify:pa,
emscripten_num_logical_cores:ga,emscripten_resize_heap:_a,emwgpuAdapterRequestDevice:ya,emwgpuBufferDestroy:Ea,emwgpuBufferGetConstMappedRange:ka,
emwgpuBufferMapAsync:Sa,emwgpuBufferUnmap:Ba,emwgpuDelete:Na,emwgpuDeviceCreateBuffer:Ia,emwgpuDeviceCreateShaderModule:Fa,
emwgpuDeviceDestroy:xa,emwgpuInstanceRequestAdapter:Aa,emwgpuQueueOnSubmittedWorkDone:Ga,emwgpuWaitAny:_t,environ_get:ht,
environ_sizes_get:vt,exit:lr,fd_close:wt,fd_read:yt,fd_seek:Et,fd_write:kt,memory:ve,random_get:Da,wgpuAdapterGetInfo:Ra,
wgpuAdapterGetLimits:ja,wgpuAdapterHasFeature:Oa,wgpuBufferGetSize:La,wgpuCommandEncoderBeginComputePass:Ma,wgpuCommandEncoderCopyBufferToBuffer:qa,
wgpuCommandEncoderFinish:za,wgpuComputePassEncoderDispatchWorkgroups:Wa,wgpuComputePassEncoderEnd:Qa,wgpuComputePassEncoderSetBindGroup:Va,
wgpuComputePassEncoderSetPipeline:Ja,wgpuComputePipelineGetBindGroupLayout:Pa,wgpuDeviceCreateBindGroup:$a,wgpuDeviceCreateCommandEncoder:Ha,
wgpuDeviceCreateComputePipeline:Ya,wgpuInstanceHasWGSLLanguageFeature:Ka,wgpuQueueSubmit:Xa,wgpuQueueWriteBuffer:Za}}function ui(e){
e=Object.assign({},e);var r=b=>(g,S,y)=>b(g,BigInt(S||0),BigInt(y||0)),t=b=>g=>Number(b(BigInt(g))),n=b=>g=>b(BigInt(g)),
i=b=>()=>Number(b()),o=b=>(g,S)=>Number(b(BigInt(g),BigInt(S))),s=b=>(g,S,y,N,D,U)=>b(BigInt(g),S,y,N,D,U),c=b=>(g,S,y,N,D)=>b(
g,BigInt(S),y,BigInt(N),D),d=b=>(g,S)=>b(BigInt(g),BigInt(S));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=o(e.emscripten_builtin_memalign),e._emscripten_thread_init=
s(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=c(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=o(e.memalign),e.emscripten_stack_set_limits=
d(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.emscripten_stack_get_current),e}async function ci(){var e=It,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,Hr(n,!0),n}catch(i){return hr(i)}}function tr(){if(Ae>0){Oe=tr;return}
if(B){jr();return}if(kn(),Ae>0){Oe=tr;return}async function e(){if(u.calledRun=!0,!ke){jr(),u.onRuntimeInitialized?.();var r=u.
noInitialRun||!1;r||await ci(),Sn()}}u.setStatus?(u.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>u.setStatus(""),
1),e()},1)):e()}var Ne;return B||(Lr(),tr()),u}var fn=1,mn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
Pe=new Uint8Array([71,76,85,69]),Dr=0,bi=1,_i=2,hi=3,vi=4,wi=5,yi=6,Ei=7,ki=8,Si=9,Bi=10,dn={str:vi,int:_i,float:hi,bool:bi,
raw:wi,arr_str:Si,arr_int:Ei,arr_float:ki,arr_bool:yi,arr_raw:Bi,null:Dr};function Ni(u){let _=0;const G=new DataView(u.
buffer),F=()=>{const q=G.getUint32(_,!0);return _+=4,q},M=()=>{const q=G.getInt32(_,!0);return _+=4,q},w=()=>{const q=G.
getFloat32(_,!0);return _+=4,q},B=()=>F()!==0,z=q=>{const K=q??F(),le=new TextDecoder().decode(u.slice(_,_+K));return _+=
K,le},x=()=>{const q=F(),K=u.slice(_,_+q);return _+=q,K},h=q=>{const K=F(),le=new Array(K);for(let se=0;se<K;se++)le[se]=
q();return le},E=()=>null,j=q=>{switch(q.type){case"str":return z();case"int":return M();case"float":return w();case"boo\
l":return B();case"raw":return x();case"arr_str":return h(z);case"arr_int":return h(M);case"arr_float":return h(w);case"\
arr_bool":return h(B);case"arr_raw":return h(x);case"null":return E()}},W=u[0]===Pe[0]&&u[1]===Pe[1]&&u[2]===Pe[2]&&u[3]===
Pe[3];if(_+=4,!W)throw new Error("Invalid magic number");if(F()!==fn)throw new Error("Invalid version number");const v=z(
8),$=mn[v];if(!$)throw new Error(`Unknown message name: ${v}`);const ne={_name:v};for(const q of $.fields){const K=F();if(K===
Dr){if(!q.isNullable)throw new Error(`${v}: Expect field ${q.name} to be non-nullable`);ne[q.name]=null;continue}if(K!==
dn[q.type])throw new Error(`${v}: Expect field ${q.name} to have type ${q.type}`);ne[q.name]=j(q)}return ne}function Ii(u){
const _=mn[u._name];if(!_)throw new Error(`Unknown message name: ${u._name}`);const G=[],F=I=>{const v=new ArrayBuffer(4);
new DataView(v).setUint32(0,I,!0),G.push(new Uint8Array(v))},M=I=>{const v=new ArrayBuffer(4);new DataView(v).setInt32(0,
I,!0),G.push(new Uint8Array(v))},w=I=>{const v=new ArrayBuffer(4);new DataView(v).setFloat32(0,I,!0),G.push(new Uint8Array(
v))},B=I=>{F(I?1:0)},z=I=>{const v=new TextEncoder().encode(I);F(v.byteLength),G.push(v)},x=I=>{F(I.byteLength),G.push(I)},
h=(I,v)=>{F(I.length);for(const $ of I)v($)};G.push(Pe),F(fn);{const I=new TextEncoder().encode(u._name);G.push(I)}for(const I of _.
fields){const v=u[I.name];if(!I.isNullable&&v==null)throw new Error(`${u._name}: Expect field ${I.name} to be non-nullab\
le`);if(v==null){F(Dr);continue}switch(F(dn[I.type]),I.type){case"str":z(v);break;case"int":M(v);break;case"float":w(v);
break;case"bool":B(v);break;case"raw":x(v);break;case"arr_str":h(v,z);break;case"arr_int":h(v,M);break;case"arr_float":h(
v,w);break;case"arr_bool":h(v,B);break;case"arr_raw":h(v,x);break}}const E=G.reduce((I,v)=>I+v.byteLength,0),j=new Uint8Array(
E);let W=0;for(const I of G)j.set(I,W),W+=I.byteLength;return j}const pn=4*1024**2,on=1024*1024;function Fi({files:u,reader:_,
getMemory:G,getSignal:F=()=>{}}){const M=new Map(u.map(w=>[w.name,w]));return async(w,B,z,x)=>{const h=M.get(w.replace(/^\/?models\//,
""));if(!h||![B,z,x].every(j=>Number.isSafeInteger(j)&&j>=0)||B>h.size)throw new Error("Invalid GGUF native file read");
const E=Math.min(z,h.size-B);if(!Number.isSafeInteger(x+E)||x+E>G().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let j=0;j<E;){fe(F());const W=Math.min(pn,E-j),I=await _.read(h.path,B+j,W,{signal:F()});if(fe(F()),
!(I instanceof Uint8Array)||I.byteLength!==W)throw new Error("Incomplete GGUF artifact range");new Uint8Array(G()).set(I,
x+j),j+=W}return BigInt(E)}}function xi(u,_){u.FS.mkdir("/models"),u.FS.mount(u.MEMFS,{root:"."},"/models");const G=new Map(
_.map(w=>[w.name,w])),F=u.MEMFS.stream_ops;for(const w of["read","llseek"]){const B=F[w];F[w]=function(z,...x){const h=G.
get(z.node.name);return h&&(z.node.usedBytes=h.size),B.call(this,z,...x)},u.MEMFS.ops_table.file.stream[w]=F[w]}const M=F.
mmap;F.mmap=function(w,...B){if(G.has(w.node.name))throw new Error("GGUF artifact mmap is prohibited");return M.call(this,
w,...B)},u.MEMFS.ops_table.file.stream.mmap=F.mmap;for(const w of _)u.FS_createDataFile("/models",w.name,new Uint8Array(
0),!0,!1,!0)}function Ai(u,_,{collect:G=!1,onLost:F}={}){if(_.device=u,_.runtimeFeatures=[...u.features],_.runtimeAdapter=
u.adapterInfo?{vendor:u.adapterInfo.vendor,architecture:u.adapterInfo.architecture,isFallbackAdapter:u.adapterInfo.isFallbackAdapter??
!1}:null,!u.features.has("shader-f16")||_.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(u.lost.then(x=>F?.(x)),!G)return()=>{};const M=Object.getOwnPropertyDescriptor(u,
"createCommandEncoder"),w=Object.getOwnPropertyDescriptor(u.queue,"submit"),B=u.createCommandEncoder.bind(u),z=u.queue.submit.
bind(u.queue);return u.createCommandEncoder=(...x)=>{const h=B(...x),E=h.beginComputePass.bind(h);return h.beginComputePass=
(...j)=>{const W=E(...j);for(const I of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const v=W[I].bind(W);W[I]=(...$)=>{
const ne=v(...$);return _.dispatches+=1,ne}}return W},h},u.queue.submit=(...x)=>{const h=z(...x);return _.submissions+=1,
h},()=>{M?Object.defineProperty(u,"createCommandEncoder",M):delete u.createCommandEncoder,w?Object.defineProperty(u.queue,
"submit",w):delete u.queue.submit}}function Gi(u){const _=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(u);return _?
{gpuLayers:Number(_[1]),totalLayers:Number(_[2])}:null}function Ci(u){const _=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(u);return _?{backend:_[1],kind:_[2].toLowerCase(),bytes:Math.round(Number(_[3])*1024**2)}:null}async function Ti({wasmUrl:u,
weights:_,reader:G,signal:F,collectGpuEvidence:M=!1,onProgress:w,onLost:B,initialize:z=gi}={}){const x=_.map((H,J)=>({...H,
name:`model-${String(J+1).padStart(5,"0")}-of-${String(_.length).padStart(5,"0")}.gguf`})),h={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let E=F,j,W,I,v,$;const ne=new Promise((H,J)=>{v=H,$=J}),q=H=>{const J=Gi(String(
H));J&&(h.offload=J,w?.({type:"gpu-offload",...J}));const l=Ci(String(H));l&&h.buffers.length<32&&(h.buffers.push(l),w?.(
{type:"native-buffer",...l,wasmMemoryBytes:I?.wasmMemory?.buffer.byteLength??0}))},K=H=>{j=new Error(`Model session lost\
: GGUF native runtime failed: ${String(H).slice(0,300)}`),$(j)};I={noInitialRun:!0,pthreadPoolSize:0,locateFile(H){if(H!==
"wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return u},print:q,printErr:q,onAbort:K,onExit:K,preRun(){
I.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){v()},peercomputeOnDevice(H){try{W?.(),W=Ai(H,h,{collect:M,onLost(J){h.lost=
!0,B?.(J)}})}catch(J){H.destroy(),K(J.message)}}};const le=Fi({files:x,reader:G,getMemory:()=>I.wasmMemory.buffer,getSignal:()=>E});
z(I,le),await ne,fe(F),xi(I,x);const se=I.cwrap("wllama_start","string",[],{async:!0}),te=I.cwrap("wllama_malloc","bigin\
t",["bigint","number"]),ge=I.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let oe=!1;const ke=async(H,J,l)=>{
if(oe)throw new Error("Concurrent GGUF native calls are prohibited");if(j)throw j;if(h.lost)throw new Error("GPU device \
lost; GGUF session is unavailable");fe(l),oe=!0,E=l;try{const re=Ii(J);if(re.byteLength>on)throw new Error("GGUF native \
message exceeds its byte budget");const ue=Number(te(BigInt(re.byteLength),0)),be=new Uint8Array(I.wasmMemory.buffer);if(!Number.
isSafeInteger(ue)||ue<=0||ue+re.length>be.length)throw new Error("Invalid GGUF input pointer");be.set(re,ue);const ae=Number(
await ge(H,BigInt(ue)));if(j)throw j;const ce=I.wasmMemory.buffer,Se=new DataView(ce).getUint32(ue,!0);if(!Number.isSafeInteger(
ae)||ae<=0||Se>on||ae+Se>ce.byteLength)throw new Error("Invalid GGUF output buffer");return Ni(new Uint8Array(ce,ae,Se).
slice())}catch(re){throw j??=new Error(`Model session lost: GGUF native action failed: ${String(re.message??re).slice(0,
300)}`),j}finally{oe=!1,E=void 0}},ee=JSON.parse(await se());if(j)throw j;if(!ee.success||!h.device)throw new Error("GGU\
F native hardware GPU backend did not initialize");return fe(F),{files:x,action:ke,evidence:h,async settleGpu(){try{await h.
device.queue.onSubmittedWorkDone()}catch(H){throw h.lost=!0,j=new Error(`Model session lost: GGUF GPU completion failed:\
 ${String(H.message??H).slice(0,300)}`),j}},close(){W?.(),h.device?.destroy()},memoryBytes(){return I.wasmMemory.buffer.
byteLength}}}const We="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Qe="5ce3fd841676adf2c1a10d7193637d46007e\
88f7",sn=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,
gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482e\
aa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635\
e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c9\
5508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_tem\
plate.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"\
706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefee\
e3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"\
verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Ui="This catalog supports verifie\
d storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF model catalog aft\
er browser capability and resource checks.";function gn(u){for(const _ of Object.values(u))_&&typeof _=="object"&&gn(_);
return Object.freeze(u)}const Di=gn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8\
 27B GeoRefine D14 (mixed GGUF)",repository:We,revision:Qe,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Ui},license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${We}/blob/${Qe}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable ar\
tifact provenance."},provenance:{repository:We,revision:Qe,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`ht\
tps://huggingface.co/${We}/blob/${Qe}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{runtime:"llama.cpp",
architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4\
_K","Q5_K","F32"],repository:We,revision:Qe},weightBytes:14199740480,totalBytes:sn.reduce((u,_)=>u+_.size,0),files:sn}});
function bn(u){return u&&typeof u=="object"&&!Object.isFrozen(u)&&(Object.values(u).forEach(bn),Object.freeze(u)),u}const Ri=[
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
f75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],ji=bn(Object.fromEntries(Ri.map(u=>{const{dtype:_,sourceModel:G,blockCount:F,
nextnPredictLayers:M,...w}=u,z=w.files.find(x=>x.path==="LICENSE").source;return[w.id,{...w,status:"execution-candidate",
format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"\
candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/\
JSPI and memory admission. These exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"\
https://huggingface.co/"+z.repository+"/blob/"+z.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversio\
n/source cards and available modification notices are included."},provenance:{repository:w.repository,revision:w.revision,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https://huggingface.co/"+w.repository+"/blob/"+w.revision+"/R\
EADME.md",sourceModel:{...G,revisionPurpose:"Pinned source documentation and license reference; the converter does not i\
dentify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{
version:3,architecture:"qwen35",blockCount:F,nextnPredictLayers:M,inspectedPrefixBytes:65536},vision:"Upstream vision me\
tadata/projectors exist, but this text-only package omits the optional projector and the current managed GGUF adapter re\
jects images.",behavior:w.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"\
GGUF",task:"text-generation",dtype:_,modalities:["text"],requiredFeatures:["shader-f16"],repository:w.repository,revision:w.
revision},weightBytes:w.files[0].size,totalBytes:w.files.reduce((x,h)=>x+h.size,0)}]}))),Ve="bartowski/Qwen_Qwen3.5-0.8B\
-GGUF",Je="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Cr=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb\
044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f\
3963beee9d8b890046f825c6f5d"}],Ur=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function _n(u){
return u&&typeof u=="object"&&!Object.isFrozen(u)&&(Object.values(u).forEach(_n),Object.freeze(u)),u}const Oi=Object.fromEntries(
[{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0\
.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-\
abliterated.q4_k_m.gguf",size:396704896,sha256:"a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"\
README.md",size:2525,sha256:"bf87a238c72dda7f21fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363b\
e8f7103979938cc420c932911dbb",source:{repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431cfdd36f71149a\
af072a6490a68e144e",path:"README.md"}},{path:"LICENSE",size:11343,sha256:"832dd9e00a68dd83b3c3fb9f5588dad7dcf337a0db50f7\
d9483f310cd292e92e",gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab",source:{repository:"Qwen/Qwen3-0.6B",revision:"\
c1899de289a04d12100db370d81485cdf75e47ca",path:"LICENSE"}}]},{id:"qwen3.5-0.8b-abliterated-q4-k-m-gguf",name:"Qwen3.5 0.\
8B Abliterated (GGUF Q4_K_M, text)",repository:"xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27\
bfcb9804ab6122f119",architecture:"qwen3_5",files:[{path:"Qwen3.5-0.8B-abliterated-Q4_K_M.gguf",size:541903744,sha256:"ee\
f9cbce1e8dceafb1d5d6cf3a29977607e0c83f164d7268dd5ef067c1dd9d61"},{path:"README.md",size:1349,sha256:"30864e51d8c52b07678\
ef4472737b8738cc76d0032b983ebb9e04a024826ead9",gitBlobSha1:"15bc43ccda90a6ce708cd55d767550731b87c953",source:{repository:"\
xdchinza/Qwen3.5-0.8B-abliterated-GGUF",revision:"6cef073175dbdc81594b27bfcb9804ab6122f119",path:"README.md"}},{path:"LI\
CENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd\
92be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"\
LICENSE"}}]}].map(({architecture:u,..._})=>[_.id,_n({..._,status:"execution-candidate",format:"GGUF",capabilities:Ur,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${_.files[2].source.repository}/blob/${_.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:_.
repository,revision:_.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${_.repository}\
/blob/${_.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:u,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:_.repository,revision:_.revision},weightBytes:_.files[0].size,totalBytes:_.files.reduce((G,F)=>G+F.size,
0)})])),Li=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:Ve,revision:Je,status:"execution-candidate",format:"GGUF",capabilities:Ur,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${Ve}/blob/${Je}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:Ve,revision:Je,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${Ve}/blob/${Je}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:Ve,revision:Je},weightBytes:Cr[0].size,totalBytes:Cr.
reduce((u,_)=>u+_.size,0),files:Cr},...Oi,...ji,...Object.fromEntries(Object.entries(Di).map(([u,_])=>[u,{..._,status:"e\
xecution-candidate",capabilities:Ur}]))}),hn="3.8.1",ln=2048,Ce=1024**3;function vn(u){const _=fi(u),G=_.model,F=Object.
values(Li).filter(h=>h.model.runtime==="llama.cpp"&&h.repository===G?.repository&&h.revision===G?.revision&&h.model.architecture===
G?.architecture&&h.model.task===G?.task&&h.model.dtype===G?.dtype),M=F.length===1?F[0]:void 0;if(!M||G.runtime!=="llama.\
cpp"||G.runtimeVersion!==void 0&&G.runtimeVersion!==hn||M.model.runtimeVersion!==void 0&&G.runtimeVersion!==M.model.runtimeVersion||
G.dtype!==M.model.dtype||G.format!=="GGUF"||G.task!=="text-generation")throw new Error("GGUF model revision is not in th\
e trusted runtime catalog");const w=_.files.filter(h=>h.path.endsWith(".gguf")),B=M.files.filter(h=>h.path.endsWith(".gg\
uf"));if(!w.length||w.length!==B.length||w.some(h=>!B.some(E=>E.path===h.path&&E.size===h.size&&E.sha256===h.sha256)))throw new Error(
"GGUF weights do not match the pinned catalog digests");const z=_.files.reduce((h,E)=>h+E.size,0);if(!Number.isSafeInteger(
z)||z>16*Ce)throw new Error("GGUF package exceeds its byte budget");const x=w.reduce((h,E)=>h+E.size,0)>4*Ce;return{manifest:_,
weights:w,totalBytes:z,resourcePolicy:{maxModelBytes:16*Ce,minimumCpuBytes:x?8*Ce:2*Ce,minimumGpuBytes:x?16*Ce:2*Ce}}}function wn(u,_=globalThis.
location?.href){const G=new URL(_);if(!u||Object.keys(u).some(M=>M!=="wasm")||typeof u.wasm!="string")throw new Error("G\
GUF runtime needs one trusted WASM asset");const F=new URL(u.wasm,G);if(F.origin!==G.origin||!["http:","https:"].includes(
F.protocol)||F.username||F.password||F.search||F.hash||!F.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM \
must be a fixed same-origin asset");return{wasm:F.href}}function yn(u={}){if(!u||typeof u!="object"||Array.isArray(u)||Object.
keys(u).some(G=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(G)))throw new Error("Unknown GGUF runtime optio\
n");const _={n_ctx:ln,n_batch:64,n_gpu_layers:99999,n_threads:1,...u};if(!Number.isInteger(_.n_ctx)||_.n_ctx<64||_.n_ctx>
ln||!Number.isInteger(_.n_batch)||_.n_batch<1||_.n_batch>128||!Number.isInteger(_.n_gpu_layers)||_.n_gpu_layers<1||_.n_gpu_layers>
99999||_.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(_)}async function Mi({
scope:u=globalThis,gpu:_=u.navigator?.gpu}={}){if(!u.crossOriginIsolated||!u.SharedArrayBuffer)throw new Error("GGUF req\
uires cross-origin isolation and SharedArrayBuffer");const G=u.WebAssembly;if(typeof G?.Suspending!="function"||typeof G?.
promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{new G.Memory({initial:0n,maximum:1n,shared:!0,
address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly memory64")}const F=await _?.requestAdapter({powerPreference:"\
high-performance"});if(!F||F.isFallbackAdapter||F.info?.isFallbackAdapter)throw new Error("GGUF requires a hardware WebG\
PU adapter");if(!F.features.has("shader-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabl\
ed");return{adapter:{vendor:F.info?.vendor??"",architecture:F.info?.architecture??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const qi=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:vn,validateRuntimeAssets:wn,validateRuntimeOptions:yn,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:u,maxNewTokens:_}){if(u)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(_)||_<1||_>Tr.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),un=u=>new TextEncoder().
encode(u).byteLength;function zi(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"GGUF inference requires a ComputeManager-owned worker")}function cn(u){return{sessionId:u.sessionId,manifestCid:u.manifestCid,
status:u.lost?"lost":u.status,runtime:"llama.cpp",runtimeVersion:hn,task:"text-generation",workerId:u.workerId,adapter:u.
capabilities?.adapter,runtimeAdapter:u.engine?.evidence.runtimeAdapter??null,runtimeFeatures:u.engine?.evidence.runtimeFeatures??
[],gpuDispatches:u.engine?.evidence.dispatches??0,gpuSubmissions:u.engine?.evidence.submissions??0,gpuOffload:u.engine?.
evidence.offload??null,runtimeOptions:u.options,nativeBuffers:u.engine?.evidence.buffers??[],wasmMemoryBytes:u.engine?.memoryBytes()??
0,generatedRequests:u.generatedRequests,artifactReads:u.reader?.getStats()??null}}function Wi({loadEngine:u=Ti,createReader:_=mi,
checkCapabilities:G=Mi,assertWorker:F=zi,baseUrl:M=globalThis.location?.href}={}){let w;async function B(x,h){if(w)throw new Error(
"GGUF worker already has a resident model");const E=vn(x.manifest),j=wn(x.runtimeAssets,M),W=yn(x.runtimeOptions),I=nr(x.
sessionId);fe(h.signal);const v={sessionId:I,manifestCid:x.manifestCid,workerId:h.workerId??null,manifest:E.manifest,status:"\
loading",options:W,generatedRequests:0,residency:new AbortController,lost:!1};w=v;try{if(v.capabilities=await G(),fe(h.signal),
v.reader=_(x.artifactPort,{manifest:E.manifest,signal:v.residency.signal,maxReadBytes:pn,maxReads:1}),v.engine=await u({
wasmUrl:j.wasm,weights:E.weights,reader:v.reader,signal:h.signal,collectGpuEvidence:x.collectGpuEvidence===!0,onProgress:q=>h.
emitProgress?.({...q,sessionId:I}),onLost(){v.lost=!0,v.active?.abort("GPU device lost")}}),fe(h.signal),!(await v.engine.
action("load",{_name:"load_req",model_paths:v.engine.files.map(q=>`models/${q.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,
...W,n_ubatch:Math.min(64,W.n_batch),n_parallel:1,kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,
jinja:!0},h.signal)).success)throw new Error("GGUF native model load failed");const ne=v.engine.evidence.offload;if(!ne||
ne.gpuLayers<1||ne.gpuLayers!==Math.min(W.n_gpu_layers,ne.totalLayers))throw new Error("GGUF did not honor the explicitl\
y configured GPU layer offload");if(fe(h.signal),v.lost)throw new Error("GPU device lost during GGUF load");return v.status=
"ready",cn(v)}catch($){throw v.engine&&h.emitProgress?.({type:"model-load-memory",sessionId:I,wasmMemoryBytes:v.engine.memoryBytes(),
nativeBuffers:v.engine.evidence.buffers??[]}),v.lost=!0,v.status="lost",v.residency.abort($),v.reader?.close($),v.engine?.
close(),$}}async function z(x,h){const E=w;if(!E||E.sessionId!==nr(x.sessionId)||E.lost)throw new Error("Model session l\
ost or not loaded");if(E.status!=="ready")throw new Error("GGUF model session is busy");const j=nr(x.requestId),W=x.maxNewTokens??
Tr.maxNewTokens;qi.validateGenerationInput({...x,maxNewTokens:W});const I=di(x),v=new AbortController,$=()=>v.abort(h.signal?.
reason);h.signal?.addEventListener("abort",$,{once:!0}),h.signal?.aborted&&$(),E.active=v,E.status="generating",E.requestId=
j;const ne=E.engine.evidence.dispatches,q=E.engine.evidence.submissions;let K,le=!1,se="",te=0,ge=null,oe=null,ke="unkno\
wn";try{const ee=await E.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:I,stream:!0,
max_tokens:W,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:[]},v.signal);if(!ee.success||
!Number.isInteger(ee.req_id))throw new Error("GGUF failed to start generation");K=ee.req_id,fe(v.signal);for(let H=0;H<4096;H+=
1){fe(v.signal);const J=await E.engine.action("get_result",{_name:"gres_req",req_id:K},v.signal);if(fe(v.signal),!J.success||
J.is_error)throw new Error("GGUF generation failed or exceeded the context budget; shorten the conversation or request f\
ewer output tokens");if(J.data_json&&J.data_json!=="null"){if(un(J.data_json)>1024*1024)throw new Error("GGUF result exc\
eeds its byte budget");const l=JSON.parse(J.data_json);for(const re of Array.isArray(l)?l:[l]){const ue=re.choices?.[0]?.
finish_reason??re.finish_reason;ue!=null&&(ke=["stop","length"].includes(ue)?ue:"unknown");const be=re.choices?.[0]?.delta?.
content??re.content??"";if(typeof be!="string")throw new Error("Invalid GGUF text chunk");if(se+=be,un(se)>Tr.maxOutputBytes)
throw new Error("GGUF output exceeds its byte budget");if(be&&h.emitProgress?.({type:"token",sessionId:E.sessionId,requestId:j,
sequence:te++,text:be})===!1)throw new Error("Token consumer rejected output");ge=re.usage?.prompt_tokens??re.timings?.prompt_n??
ge,oe=re.usage?.completion_tokens??re.timings?.predicted_n??oe}}if(!J.has_more){le=!0;break}await new Promise(l=>setTimeout(
l,0))}if(!le)throw new Error("GGUF result polling exceeded its request budget");if(await E.engine.settleGpu(),fe(v.signal),
E.lost)throw new Error("GPU device lost; model session is unavailable");if(oe!==null&&(!Number.isSafeInteger(oe)||oe>W))
throw new Error("GGUF returned an over-budget token sequence");return E.generatedRequests+=1,{sessionId:E.sessionId,requestId:j,
text:se,inputTokens:ge,outputTokens:oe,finishReason:ke,contextTruncated:!1,workerId:E.workerId,gpuDispatches:E.engine.evidence.
dispatches-ne,gpuSubmissions:E.engine.evidence.submissions-q,gpuOffload:E.engine.evidence.offload,artifactReads:E.reader.
getStats()}}catch(ee){throw ee?.name==="RuntimeError"?(E.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(
ee.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(ee.message??"")&&(E.lost=!0),ee)}finally{h.signal?.
removeEventListener("abort",$);try{!le&&K!==void 0&&!E.lost&&await E.engine.action("cancel",{_name:"cncl_req",req_id:K})}catch(ee){
throw E.lost=!0,new Error(`Model session lost during GGUF cancellation: ${ee.message}`)}finally{E.active=null,E.requestId=
null,E.status=E.lost?"lost":"ready"}}}return async(x={},h={})=>{if(F(),x.command==="load")return B(x,h);if(x.command==="\
generate")return z(x,h);const E=nr(x.sessionId);if(x.command==="status")return w?.sessionId===E?cn(w):{sessionId:E,status:"\
absent"};if(!w||w.sessionId!==E)throw new Error("Model session lost or not loaded");if(x.command==="cancel")return w.requestId===
x.requestId&&w.active?.abort(pi()),{sessionId:E,cancellationRequested:!0};if(x.command==="unload"){if(w.status==="genera\
ting")throw new Error("Cancel and await GGUF generation before unloading");return w.residency.abort("GGUF unload"),w.reader?.
close(),w.engine?.close(),w=null,{sessionId:E,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown G\
GUF inference command")}}const Qi=Wi(),Pi=(u,_)=>Qi(u,_);export{Wi as createGgufTaskRuntime,Pi as handleModelTask};

import{c as Xa}from"./GgufArtifactReader-ByrNzM0n.js";import{aw as oe,au as Ze,aD as Qa,aE as Ka,aF as Za,aG as eo,aH as ro,
aI as to,M as Fr,aJ as no,ay as ao,aK as oo,az as so}from"./main-doVKNvU_.js";import"./index-CKWEQj_s.js";function io(c,N){
const G=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var A=!!globalThis.window,U=!!globalThis.
WorkerGlobalScope,E=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",b=U&&self.name?.startsWith(
"em-pthread");if(E){var J=require("worker_threads");global.Worker=J.Worker,U=!J.isMainThread,b=U&&J.workerData=="em-pthr\
ead"}var C="./this.program",y=(e,r)=>{throw r},h=globalThis.document?.currentScript?.src;typeof __filename<"u"?h=__filename:
U&&(h=self.location.href);var F="";function q(e){return c.locateFile?c.locateFile(e,F):F+e}var x,v;if(E){var V=require("fs");
F=__dirname+"/",v=e=>{e=ee(e)?new URL(e):e;var r=V.readFileSync(e);return r},x=async(e,r=!0)=>{e=ee(e)?new URL(e):e;var t=V.
readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(C=process.argv[1].replace(/\\/g,"/")),process.argv.slice(
2),typeof module<"u"&&(module.exports=c),y=(e,r)=>{throw process.exitCode=e,r}}else if(A||U){try{F=new URL(".",h).href}catch{}
E||(U&&(v=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffer",r.send(null),new Uint8Array(
r.response)}),x=async e=>{if(ee(e))return new Promise((t,n)=>{var o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType=
"arraybuffer",o.onload=()=>{if(o.status==200||o.status==0&&o.response){t(o.response);return}n(o.status)},o.onerror=n,o.send(
null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();throw new Error(r.status+" : "+r.
url)})}var ie=console.log.bind(console),W=console.error.bind(console);if(E){var se=require("util"),fe=e=>typeof e=="obje\
ct"?se.inspect(e):e;ie=(...e)=>V.writeSync(1,e.map(fe).join(" ")+`
`),W=(...e)=>V.writeSync(2,e.map(fe).join(" ")+`
`)}var Q=ie,Y=W,ue,Z,he=!1,ce;function z(e,r){e||pe(r)}var ee=e=>e.startsWith("file://");function l(){ye.buffer!=te.buffer&&
ze()}if(E&&b){var ae=J.parentPort;ae.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>ae.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var de;if(b){var ve=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.
cmd;if(n==="load"){let o=[];self.onmessage=s=>o.push(s),de=()=>{postMessage({cmd:"loaded"});for(let s of o)e(s);self.onmessage=
e};for(const s of t.handlers)(!c[s]||c[s].proxy)&&(c[s]=(...i)=>{postMessage({cmd:"callHandler",handler:s,args:i})},s=="\
print"&&(Q=c[s]),s=="printErr"&&(Y=c[s]));ye=t.wasmMemory,ze(),Z=t.wasmModule,Dr(),Ke()}else if(n==="run"){_n(t.pthread_ptr),
Ir(t.pthread_ptr,0,0,1,0,0),M.threadInitTLS(),_r(t.pthread_ptr),ve||(ve=!0);try{await Pr(t.start_routine,t.arg)}catch(o){
if(o!="unwind")throw o}}else t.target==="setimmediate"||(n==="checkMailbox"?ve&&He():n&&(Y(`worker: received unknown com\
mand ${n}`),Y(t)))}catch(o){throw Vt(),o}}self.onmessage=e}var te,X,me,T,B,Ce,Ie,K,k,Ar=!1;function ze(){var e=ye.buffer;
te=new Int8Array(e),me=new Int16Array(e),c.HEAPU8=X=new Uint8Array(e),T=new Int32Array(e),B=new Uint32Array(e),Ce=new Float32Array(
e),Ie=new Float64Array(e),K=new BigInt64Array(e),k=new BigUint64Array(e)}function sn(){if(!b){if(c.wasmMemory)ye=c.wasmMemory;else{
var e=c.INITIAL_MEMORY||134217728;ye=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}ze()}}function ln(){if(c.preRun)for(typeof c.preRun=="function"&&(c.preRun=[c.preRun]);c.preRun.length;)Mr(c.preRun.
shift());Ur(Lr)}function Cr(){if(Ar=!0,b)return de();!c.noFSInit&&!a.initialized&&a.init(),xe.__wasm_call_ctors(),a.ignorePermissions=
!1}function un(){if(!b){if(c.postRun)for(typeof c.postRun=="function"&&(c.postRun=[c.postRun]);c.postRun.length;)gn(c.postRun.
shift());Ur(Jr)}}function pe(e){c.onAbort?.(e),e="Aborted("+e+")",Y(e),he=!0,e+=". Build with -sASSERTIONS for more info\
.",Ar&&Ht();var r=new WebAssembly.RuntimeError(e);throw r}var tr;function cn(){return q("wllama.wasm")}function mn(e){if(e==
tr&&ue)return new Uint8Array(ue);if(v)return v(e);throw"both async and sync fetching of the wasm failed"}async function fn(e){
if(!ue)try{var r=await x(e);return new Uint8Array(r)}catch{}return mn(e)}async function dn(e,r){try{var t=await fn(e),n=await WebAssembly.
instantiate(t,r);return n}catch(o){Y(`failed to asynchronously prepare wasm: ${o}`),pe(o)}}async function pn(e,r,t){if(!e&&
!ee(r)&&!E)try{var n=fetch(r,{credentials:"same-origin"}),o=await WebAssembly.instantiateStreaming(n,t);return o}catch(s){
Y(`wasm streaming compile failed: ${s}`),Y("falling back to ArrayBuffer instantiation")}return dn(r,t)}function Gr(){Pa(),
Oe.__instrumented||(Oe.__instrumented=!0,ge.instrumentWasmImports(Oe));var e={env:Oe,wasi_snapshot_preview1:Oe};return e}
async function Dr(){function e(i,u){return xe=i.exports,xe=ge.instrumentWasmExports(xe),xe=Ha(xe),vn(xe._emscripten_tls_init),
$a(xe),Z=u,Je(),xe}$e();function r(i){return e(i.instance,i.module)}var t=Gr();if(c.instantiateWasm)return new Promise((i,u)=>{
c.instantiateWasm(t,(d,_)=>{i(e(d,_))})});if(b){var n=new WebAssembly.Instance(Z,Gr());return e(n,Z)}tr??=cn();var o=await pn(
ue,tr,t),s=r(o);return s}class jr{name="ExitStatus";constructor(r){this.message=`Program terminated with exit(${r})`,this.
status=r}}var Rr=e=>{e.terminate(),e.onmessage=r=>{}},Or=e=>{var r=M.pthreads[e];M.returnWorkerToPool(r)},Ur=e=>{for(;e.
length>0;)e.shift()(c)},Lr=[],Mr=e=>Lr.push(e),Be=0,Ue=null,Je=e=>{if(Be--,c.monitorRunDependencies?.(Be),Be==0&&Ue){var r=Ue;
Ue=null,r()}},$e=e=>{Be++,c.monitorRunDependencies?.(Be)},Wr=e=>{var r=M.getNewWorker();if(!r)return 6;M.runningWorkers.
push(r),M.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,
pthread_ptr:e.pthread_ptr};return E&&r.unref(),r.postMessage(t,e.transferList),0},Pe=0,nr=()=>ir||Pe>0,we=()=>Kt(),be=e=>Xt(
e),ar=e=>Qt(e),ne=(e,r,t,...n)=>{for(var o=n.length*2,s=we(),i=ar(o*8),u=i/8,d=0;d<n.length;d++){var _=n[d];typeof _=="b\
igint"?((l(),K)[u+2*d]=1n,(l(),K)[u+2*d+1]=_):((l(),K)[u+2*d]=0n,(l(),Ie)[u+2*d+1]=_)}var g=zt(e,r,o,i,t);return be(s),g};
function qr(e){if(b)return ne(0,0,1,e);ce=e,nr()||(M.terminateAllThreads(),c.onExit?.(e),he=!0),y(e,new jr(e))}function Vr(e){
if(b)return ne(1,0,0,e);or(e)}var zr=(e,r)=>{if(ce=e,b)throw Vr(e),"unwind";qr(e)},or=zr,M={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){b||M.initMainThread()},initMainThread(){for(var e=c.pthreadPoolSize;e--;)M.allocateUnusedWorker();
Mr(async()=>{var r=M.loadWasmModuleToAllWorkers();$e(),await r,Je()})},terminateAllThreads:()=>{for(var e of M.runningWorkers)
Rr(e);for(var e of M.unusedWorkers)Rr(e);M.unusedWorkers=[],M.runningWorkers=[],M.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete M.pthreads[r],M.unusedWorkers.push(e),M.runningWorkers.splice(M.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,Jt(r)},threadInitTLS(){M.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var i=s.
data,u=i.cmd;if(i.targetThread&&i.targetThread!=Qe()){var d=M.pthreads[i.targetThread];d?d.postMessage(i,i.transferList):
Y(`Internal error! Worker sent a message "${u}" to target pthread ${i.targetThread}, but that thread no longer exists!`);
return}u==="checkMailbox"?He():u==="spawnThread"?Wr(i):u==="cleanupThread"?Se(()=>Or(i.thread)):u==="loaded"?(e.loaded=!0,
E&&!e.pthread_ptr&&e.unref(),r(e)):i.target==="setimmediate"?e.postMessage(i):u==="uncaughtException"?e.onerror(i.error):
u==="callHandler"?c[i.handler](...i.args):u&&Y(`worker sent an unknown command ${u}`)},e.onerror=s=>{var i="worker sent \
an error!";throw Y(`${i} ${s.filename}:${s.lineno}: ${s.message}`),s},E&&(e.on("message",s=>e.onmessage({data:s})),e.on(
"error",s=>e.onerror(s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var o of n)c.propertyIsEnumerable(o)&&t.
push(o);e.postMessage({cmd:"load",handlers:t,wasmMemory:ye,wasmModule:Z})}),async loadWasmModuleToAllWorkers(){return b?
void 0:Promise.all(M.unusedWorkers.map(M.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=h;c.mainScriptUrlOrBlob&&
(r=c.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new G(r,{workerData:"em-pthread",name:"em-pth\
read"}),M.unusedWorkers.push(e)},getNewWorker(){return M.unusedWorkers.length==0&&(M.allocateUnusedWorker(),M.loadWasmModuleToWorker(
M.unusedWorkers[0])),M.unusedWorkers.pop()}},Jr=[],gn=e=>Jr.push(e);function _n(e){var r=Number((l(),k)[(e+88)/8]),t=Number(
(l(),k)[(e+96)/8]),n=r-t;Yt(r,n),be(r)}var sr=[],$r=e=>{e=Number(e);var r=sr[e];return r||(sr[e]=r=Zt.get(BigInt(e)),ge.
isAsyncExport(r)&&(sr[e]=r=ge.makeAsyncFunction(r))),r},Pr=async(e,r)=>{Pe=0,ir=0;var t=(o=>WebAssembly.promising($r(e)).
call(null,BigInt(o)))(r);function n(o){if(nr()){ce=o;return}Tr(o)}t=await t,n(t)};Pr.isAsync=!0;var ir=!0,vn=e=>M.tlsInitFunctions.
push(e),ye;function Hr(e,r,t,n){return b?ne(2,0,1,e,r,t,n):Yr(e,r,t,n)}var hn=()=>!!globalThis.SharedArrayBuffer,wn=9007199254740992,
bn=-9007199254740992,p=e=>e<bn||e>wn?NaN:Number(e);function Yr(e,r,t,n){if(e=p(e),r=p(r),t=p(t),n=p(n),!hn())return 6;var o=[],
s=0;if(b&&(o.length===0||s))return Hr(e,r,t,n);var i={startRoutine:t,pthread_ptr:e,arg:n,transferList:o};return b?(i.cmd=
"spawnThread",postMessage(i,o),0):Wr(i)}var Ge=()=>{var e=Number((l(),k)[P.varargs/8]);return P.varargs+=8,e},lr=()=>{var e=(l(),
T)[+P.varargs/4];return P.varargs+=4,e},$={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var o=e[n];o==="."?e.splice(n,1):o===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=$.isAbs(e),
t=e.slice(-1)==="/";return e=$.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=$.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>$.normalize(e.join("/")),join2:(e,r)=>$.normalize(e+"/"+r)},yn=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),ur=e=>{(ur=yn())(e)},De={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var o=n>=0?e[n]:a.cwd();if(typeof o!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!o)return"";r=o+"/"+r,t=$.isAbs(o)}return r=$.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=De.resolve(e).slice(1),r=De.resolve(r).slice(1);function t(_){for(var g=0;g<_.length&&_[g]==="";g++)
;for(var S=_.length-1;S>=0&&_[S]==="";S--);return g>S?[]:_.slice(g,S-g+1)}for(var n=t(e.split("/")),o=t(r.split("/")),s=Math.
min(n.length,o.length),i=s,u=0;u<s;u++)if(n[u]!==o[u]){i=u;break}for(var d=[],u=i;u<n.length;u++)d.push("..");return d=d.
concat(o.slice(i)),d.join("/")}},Xr=globalThis.TextDecoder&&new TextDecoder,kn=(e,r,t,n)=>{for(var o=r+t;e[r]&&!(r>=o);)
++r;return r},je=(e,r=0,t,n)=>{var o=kn(e,r,t);if(o-r>16&&e.buffer&&Xr)return Xr.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,o):e.slice(r,o));for(var s="";r<o;){var i=e[r++];if(!(i&128)){s+=String.fromCharCode(i);continue}var u=e[r++]&
63;if((i&224)==192){s+=String.fromCharCode((i&31)<<6|u);continue}var d=e[r++]&63;if((i&240)==224?i=(i&15)<<12|u<<6|d:i=(i&
7)<<18|u<<12|d<<6|e[r++]&63,i<65536)s+=String.fromCharCode(i);else{var _=i-65536;s+=String.fromCharCode(55296|_>>10,56320|
_&1023)}}return s},cr=[],ke=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},Qr=(e,r,t,n)=>{if(!(n>0))return 0;for(var o=t,s=t+n-1,i=0;i<e.length;++i){var u=e.codePointAt(
i);if(u<=127){if(t>=s)break;r[t++]=u}else if(u<=2047){if(t+1>=s)break;r[t++]=192|u>>6,r[t++]=128|u&63}else if(u<=65535){
if(t+2>=s)break;r[t++]=224|u>>12,r[t++]=128|u>>6&63,r[t++]=128|u&63}else{if(t+3>=s)break;r[t++]=240|u>>18,r[t++]=128|u>>
12&63,r[t++]=128|u>>6&63,r[t++]=128|u&63,i++}}return r[t]=0,t-o},mr=(e,r,t)=>{var n=ke(e)+1,o=new Array(n),s=Qr(e,o,0,o.
length);return o.length=s,o},En=()=>{if(!cr.length){var e=null;if(E){var r=256,t=Buffer.alloc(r),n=0,o=process.stdin.fd;
try{n=V.readSync(o,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;cr=mr(e)}return cr.shift()},Ae={ttys:[],init(){},shutdown(){},register(e,r){Ae.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Ae.stream_ops)},stream_ops:{open(e){var r=Ae.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,o){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,i=0;i<n;i++){var u;try{u=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(u===void 0&&s===0)throw new a.ErrnoError(6);if(u==null)break;s++,r[t+i]=u}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,o){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return En()},put_char(e,r){r===null||r===10?(Q(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(Q(je(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(Y(je(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(Y(je(e.output)),e.output=[])}}},Sn=(e,r)=>(l(),X).fill(0,e,e+r),Kr=(e,r)=>Math.ceil(e/r)*r,fr=e=>{e=
Kr(e,65536);var r=qt(65536,e);return r&&Sn(r,e),r},D={ops_table:null,mount(e){return D.createNode(null,"/",16895,0)},createNode(e,r,t,n){
if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(63);D.ops_table||={dir:{node:{getattr:D.node_ops.getattr,setattr:D.
node_ops.setattr,lookup:D.node_ops.lookup,mknod:D.node_ops.mknod,rename:D.node_ops.rename,unlink:D.node_ops.unlink,rmdir:D.
node_ops.rmdir,readdir:D.node_ops.readdir,symlink:D.node_ops.symlink},stream:{llseek:D.stream_ops.llseek}},file:{node:{getattr:D.
node_ops.getattr,setattr:D.node_ops.setattr},stream:{llseek:D.stream_ops.llseek,read:D.stream_ops.read,write:D.stream_ops.
write,mmap:D.stream_ops.mmap,msync:D.stream_ops.msync}},link:{node:{getattr:D.node_ops.getattr,setattr:D.node_ops.setattr,
readlink:D.node_ops.readlink},stream:{}},chrdev:{node:{getattr:D.node_ops.getattr,setattr:D.node_ops.setattr},stream:a.chrdev_stream_ops}};
var o=a.createNode(e,r,t,n);return a.isDir(o.mode)?(o.node_ops=D.ops_table.dir.node,o.stream_ops=D.ops_table.dir.stream,
o.contents={}):a.isFile(o.mode)?(o.node_ops=D.ops_table.file.node,o.stream_ops=D.ops_table.file.stream,o.usedBytes=0,o.contents=
null):a.isLink(o.mode)?(o.node_ops=D.ops_table.link.node,o.stream_ops=D.ops_table.link.stream):a.isChrdev(o.mode)&&(o.node_ops=
D.ops_table.chrdev.node,o.stream_ops=D.ops_table.chrdev.stream),o.atime=o.mtime=o.ctime=Date.now(),e&&(e.contents[r]=o,e.
atime=e.mtime=e.ctime=o.atime),o},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var n=1024*1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var o=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(o.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&D.resizeFileStorage(e,r.size)},lookup(e,r){throw D.doesNotExistError||(D.doesNotExistError=new a.ErrnoError(44),
D.doesNotExistError.stack="<generic error, no stack>"),D.doesNotExistError},mknod(e,r,t,n){return D.createNode(e,r,t,n)},
rename(e,r,t){var n;try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var o in n.contents)throw new a.ErrnoError(
55);a.hashRemoveNode(n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.
contents)throw new a.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var n=D.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,n,o){var s=e.node.contents;if(o>=e.node.usedBytes)return 0;var i=Math.
min(e.node.usedBytes-o,n);if(i>8&&s.subarray)r.set(s.subarray(o,o+i),t);else for(var u=0;u<i;u++)r[t+u]=s[o+u];return i},
write(e,r,t,n,o,s){if(r.buffer===(l(),te).buffer&&(s=!1),!n)return 0;var i=e.node;if(i.mtime=i.ctime=Date.now(),r.subarray&&
(!i.contents||i.contents.subarray)){if(s)return i.contents=r.subarray(t,t+n),i.usedBytes=n,n;if(i.usedBytes===0&&o===0)return i.
contents=r.slice(t,t+n),i.usedBytes=n,n;if(o+n<=i.usedBytes)return i.contents.set(r.subarray(t,t+n),o),n}if(D.expandFileStorage(
i,o+n),i.contents.subarray&&r.subarray)i.contents.set(r.subarray(t,t+n),o);else for(var u=0;u<n;u++)i.contents[o+u]=r[t+
u];return i.usedBytes=Math.max(i.usedBytes,o+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,o){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,i,u=e.node.contents;if(!(o&2)&&u&&u.buffer===(l(),te).buffer)i=!1,s=u.byteOffset;else{if(i=!0,s=fr(r),!s)throw new a.
ErrnoError(48);u&&((t>0||t+r<u.length)&&(u.subarray?u=u.subarray(t,t+r):u=Array.prototype.slice.call(u,t,t+r)),(l(),te).
set(u,s))}return{ptr:s,allocated:i}},msync(e,r,t,n,o){return D.stream_ops.write(e,r,0,n,t,!1),0}}},Nn=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},dr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},xn=async e=>{var r=await x(e);return new Uint8Array(r)},Zr=(...e)=>a.createDataFile(
...e),et=[],In=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of et)if(t.canHandle(r))return t.handle(e,r);return e},
pr=async(e,r,t,n,o,s,i,u)=>{var d=r?De.resolve($.join2(e,r)):e;$e();try{var _=t;typeof t=="string"&&(_=await xn(t)),_=await In(
_,d),u?.(),s||Zr(e,r,_,n,o,i)}finally{Je()}},Tn=(e,r,t,n,o,s,i,u,d,_)=>{pr(e,r,t,n,o,u,d,_).then(s).catch(i)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,$.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(_=>!!_),o=a.root,s="/",i=0;i<n.length;i++){var u=i===n.length-1;if(u&&r.parent)break;if(n[i]!=="."){if(n[i]===
".."){if(s=$.dirname(s),a.isRoot(o)){e=s+"/"+n.slice(i+1).join("/"),t--;continue e}else o=o.parent;continue}s=$.join2(s,
n[i]);try{o=a.lookupNode(o,n[i])}catch(_){if(_?.errno===44&&u&&r.noent_okay)return{path:s};throw _}if(a.isMountpoint(o)&&
(!u||r.follow_mount)&&(o=o.mounted.root),a.isLink(o.mode)&&(!u||r.follow)){if(!o.node_ops.readlink)throw new a.ErrnoError(
52);var d=o.node_ops.readlink(o);$.isAbs(d)||(d=$.dirname(s)+"/"+d),e=d+"/"+n.slice(i+1).join("/");continue e}}}return{path:s,
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
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&Y(`warning: ${a.syncFSRequests} FS.syncfs operat\
ions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function o(u){return a.syncFSRequests--,
r(u)}function s(u){if(u)return s.errored?void 0:(s.errored=!0,o(u));++n>=t.length&&o(null)}for(var i of t)i.type.syncfs?
i.type.syncfs(i,e,s):s(null)},mount(e,r,t){var n=t==="/",o=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!o){var i=a.
lookupPath(t,{follow_mount:!1});if(t=i.path,s=i.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(s.mode))throw new a.
ErrnoError(54)}var u={type:e,opts:r,mountpoint:t,mounts:[]},d=e.mount(u);return d.mount=u,u.root=d,n?a.root=d:s&&(s.mounted=
u,s.mount&&s.mount.mounts.push(u)),d},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,o=a.getMounts(n);for(var[s,i]of Object.entries(a.nameTable))for(;i;){var u=i.name_next;
o.includes(i.mount)&&a.destroyNode(i),i=u}t.mounted=null;var d=t.mount.mounts.indexOf(n);t.mount.mounts.splice(d,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),o=n.node,s=$.basename(e);if(!s)throw new a.
ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var i=a.mayCreate(o,s);if(i)throw new a.ErrnoError(i);if(!o.
node_ops.mknod)throw new a.ErrnoError(63);return o.node_ops.mknod(o,s,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var o of t)if(o){(n||$.isAbs(e))&&(n+=
"/"),n+=o;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!De.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var o=$.basename(r),s=a.mayCreate(n,o);if(s)throw new a.ErrnoError(s);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,o,e)},rename(e,r){var t=$.dirname(e),n=$.dirname(r),o=$.basename(e),s=$.basename(
r),i,u,d;if(i=a.lookupPath(e,{parent:!0}),u=i.node,i=a.lookupPath(r,{parent:!0}),d=i.node,!u||!d)throw new a.ErrnoError(
44);if(u.mount!==d.mount)throw new a.ErrnoError(75);var _=a.lookupNode(u,o),g=De.relative(e,n);if(g.charAt(0)!==".")throw new a.
ErrnoError(28);if(g=De.relative(r,t),g.charAt(0)!==".")throw new a.ErrnoError(55);var S;try{S=a.lookupNode(d,s)}catch{}if(_!==
S){var w=a.isDir(_.mode),I=a.mayDelete(u,o,w);if(I)throw new a.ErrnoError(I);if(I=S?a.mayDelete(d,s,w):a.mayCreate(d,s),
I)throw new a.ErrnoError(I);if(!u.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(_)||S&&a.isMountpoint(S))
throw new a.ErrnoError(10);if(d!==u&&(I=a.nodePermissions(u,"w"),I))throw new a.ErrnoError(I);a.hashRemoveNode(_);try{u.
node_ops.rename(_,d,s),_.parent=d}catch(R){throw R}finally{a.hashAddNode(_)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=$.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(o)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=$.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
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
Nn(r):r,r&64?t=t&4095|32768:t=0;var n,o;if(typeof e=="object")n=e;else{o=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
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
ary"&&pe(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),o=n.size,s=new Uint8Array(o);return a.
read(t,s,0,o,0),r.encoding==="utf8"&&(s=je(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(mr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
pe("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,o,s,i,u)=>i,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Ae.register(a.makedev(5,0),Ae.default_tty_ops),Ae.register(a.makedev(6,0),Ae.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(ur(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:D.stream_ops.llseek},r.node_ops={lookup(t,n){var o=+n,
s=a.getStreamChecked(o),i={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:o+1};return i.parent=
i,i},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(D,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:D}},init(e,r,t){a.initialized=!0,e??=c.stdin,r??=c.stdout,t??=c.stderr,a.createStandardStreams(e,r,t)},quit(){a.initialized=
!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=
t.path,n.parentObject=t.node,n.name=$.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(o){n.error=o.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var o=r.split("/").reverse();o.length;){var s=o.pop();if(s){var i=$.join2(e,s);try{a.mkdir(i)}catch(u){if(u.
errno!=20)throw u}e=i}}return i},createFile(e,r,t,n,o){var s=$.join2(typeof e=="string"?e:a.getPath(e),r),i=dr(n,o);return a.
create(s,i)},createDataFile(e,r,t,n,o,s){var i=r;e&&(e=typeof e=="string"?e:a.getPath(e),i=r?$.join2(e,r):e);var u=dr(n,
o),d=a.create(i,u);if(t){if(typeof t=="string"){for(var _=new Array(t.length),g=0,S=t.length;g<S;++g)_[g]=t.charCodeAt(g);
t=_}a.chmod(d,u|146);var w=a.open(d,577);a.write(w,t,0,t.length,0,s),a.close(w),a.chmod(d,u)}},createDevice(e,r,t,n){var o=$.
join2(typeof e=="string"?e:a.getPath(e),r),s=dr(!!t,!!n);a.createDevice.major??=64;var i=a.makedev(a.createDevice.major++,
0);return a.registerDevice(i,{open(u){u.seekable=!1},close(u){n?.buffer?.length&&n(10)},read(u,d,_,g,S){for(var w=0,I=0;I<
g;I++){var R;try{R=t()}catch{throw new a.ErrnoError(29)}if(R===void 0&&w===0)throw new a.ErrnoError(6);if(R==null)break;
w++,d[_+I]=R}return w&&(u.node.atime=Date.now()),w},write(u,d,_,g,S){for(var w=0;w<g;w++)try{n(d[_+w])}catch{throw new a.
ErrnoError(29)}return g&&(u.node.mtime=u.node.ctime=Date.now()),w}}),a.mkdev(o,s,i)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)pe("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=v(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,o){class s{lengthKnown=!1;chunks=[];get(w){
if(!(w>this.length-1||w<0)){var I=w%this.chunkSize,R=w/this.chunkSize|0;return this.getter(R)[I]}}setDataGetter(w){this.
getter=w}cacheLength(){var w=new XMLHttpRequest;w.open("HEAD",t,!1),w.send(null),w.status>=200&&w.status<300||w.status===
304||pe("Couldn't load "+t+". Status: "+w.status);var I=Number(w.getResponseHeader("Content-length")),R,j=(R=w.getResponseHeader(
"Accept-Ranges"))&&R==="bytes",f=(R=w.getResponseHeader("Content-Encoding"))&&R==="gzip",O=1024*1024;j||(O=I);var L=(le,_e)=>{
le>_e&&pe("invalid range ("+le+", "+_e+") or no bytes requested!"),_e>I-1&&pe("only "+I+" bytes available! programmer er\
ror!");var re=new XMLHttpRequest;return re.open("GET",t,!1),I!==O&&re.setRequestHeader("Range","bytes="+le+"-"+_e),re.responseType=
"arraybuffer",re.overrideMimeType&&re.overrideMimeType("text/plain; charset=x-user-defined"),re.send(null),re.status>=200&&
re.status<300||re.status===304||pe("Couldn't load "+t+". Status: "+re.status),re.response!==void 0?new Uint8Array(re.response||
[]):mr(re.responseText||"")},H=this;H.setDataGetter(le=>{var _e=le*O,re=(le+1)*O-1;return re=Math.min(re,I-1),typeof H.chunks[le]>
"u"&&(H.chunks[le]=L(_e,re)),typeof H.chunks[le]>"u"&&pe("doXHR failed!"),H.chunks[le]}),(f||!I)&&(O=I=1,I=this.getter(0).
length,O=I,Q("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=I,this._chunkSize=
O,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){U||pe("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var i=new s,u={isDevice:!1,contents:i}}else
var u={isDevice:!1,url:t};var d=a.createFile(e,r,u,n,o);u.contents?d.contents=u.contents:u.url&&(d.contents=null,d.url=u.
url),Object.defineProperties(d,{usedBytes:{get:function(){return this.contents.length}}});var _={};for(const[S,w]of Object.
entries(d.stream_ops))_[S]=(...I)=>(a.forceLoadFile(d),w(...I));function g(S,w,I,R,j){var f=S.node.contents;if(j>=f.length)
return 0;var O=Math.min(f.length-j,R);if(f.slice)for(var L=0;L<O;L++)w[I+L]=f[j+L];else for(var L=0;L<O;L++)w[I+L]=f.get(
j+L);return O}return _.read=(S,w,I,R,j)=>(a.forceLoadFile(d),g(S,w,I,R,j)),_.mmap=(S,w,I,R,j)=>{a.forceLoadFile(d);var f=fr(
w);if(!f)throw new a.ErrnoError(48);return g(S,(l(),te),f,w,I),{ptr:f,allocated:!0}},d.stream_ops=_,d}},Le=(e,r,t)=>e?je(
(l(),X),e,r):"",P={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if($.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var o=P.
getStreamFromFD(e);n=o.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
B)[e/4]=r.dev,(l(),B)[(e+4)/4]=r.mode,(l(),k)[(e+8)/8]=BigInt(r.nlink),(l(),B)[(e+16)/4]=r.uid,(l(),B)[(e+20)/4]=r.gid,(l(),
B)[(e+24)/4]=r.rdev,(l(),K)[(e+32)/8]=BigInt(r.size),(l(),T)[(e+40)/4]=4096,(l(),T)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),o=r.ctime.getTime();return(l(),K)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),k)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),K)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),k)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),K)[(e+80)/8]=BigInt(Math.
floor(o/1e3)),(l(),k)[(e+88)/8]=BigInt(o%1e3*1e3*1e3),(l(),K)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),B)[(e+8)/
4]=r.bsize,(l(),B)[(e+72)/4]=r.bsize,(l(),K)[(e+16)/8]=BigInt(r.blocks),(l(),K)[(e+24)/8]=BigInt(r.bfree),(l(),K)[(e+32)/
8]=BigInt(r.bavail),(l(),K)[(e+40)/8]=BigInt(r.files),(l(),K)[(e+48)/8]=BigInt(r.ffree),(l(),B)[(e+56)/4]=r.fsid,(l(),B)[(e+
80)/4]=r.flags,(l(),B)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,o){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var s=(l(),X).slice(e,e+t);a.msync(r,s,o,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Le(e);return r}};function rt(e,r,t){if(b)return ne(3,0,1,e,r,t);t=p(t),P.varargs=t;try{var n=P.getStreamFromFD(
e);switch(r){case 0:{var o=lr();if(o<0)return-28;for(;a.streams[o];)o++;var s;return s=a.dupStream(n,o),s.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var o=lr();return n.flags|=o,0}case 5:{var o=Ge(),i=0;return(l(),me)[(o+i)/2]=2,0}case 6:case 7:
return 0}return-28}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function Fn(e,r){if(b)return ne(
4,0,1,e,r);r=p(r);try{return P.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var Ee=(e,r,t)=>Qr(e,(l(),X),r,t);function tt(e,r){if(b)return ne(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=a.cwd(),n=ke(t)+1;return r<n?-68:(Ee(t,e,r),n)}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}
function nt(e,r,t){if(b)return ne(6,0,1,e,r,t);r=p(r),t=p(t);try{var n=P.getStreamFromFD(e);n.getdents||=a.readdir(n.path);
for(var o=280,s=0,i=a.llseek(n,0,1),u=Math.floor(i/o),d=Math.min(n.getdents.length,u+Math.floor(t/o)),_=u;_<d;_++){var g,
S,w=n.getdents[_];if(w===".")g=n.node.id,S=4;else if(w===".."){var I=a.lookupPath(n.path,{parent:!0});g=I.node.id,S=4}else{
var R;try{R=a.lookupNode(n.node,w)}catch(j){if(j?.errno===28)continue;throw j}g=R.id,S=a.isChrdev(R.mode)?2:a.isDir(R.mode)?
4:a.isLink(R.mode)?10:8}(l(),K)[(r+s)/8]=BigInt(g),(l(),K)[(r+s+8)/8]=BigInt((_+1)*o),(l(),me)[(r+s+16)/2]=280,(l(),te)[r+
s+18]=S,Ee(w,r+s+19,256),s+=o}return a.llseek(n,_*o,0),s}catch(j){if(typeof a>"u"||j.name!=="ErrnoError")throw j;return-j.
errno}}function at(e,r,t){if(b)return ne(7,0,1,e,r,t);t=p(t),P.varargs=t;try{var n=P.getStreamFromFD(e);switch(r){case 21509:
return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var o=n.tty.ops.ioctl_tcgets(n),s=Ge();(l(),
T)[s/4]=o.c_iflag||0,(l(),T)[(s+4)/4]=o.c_oflag||0,(l(),T)[(s+8)/4]=o.c_cflag||0,(l(),T)[(s+12)/4]=o.c_lflag||0;for(var i=0;i<
32;i++)(l(),te)[s+i+17]=o.c_cc[i]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=Ge(),u=(l(),T)[s/4],d=(l(),T)[(s+4)/4],_=(l(),T)[(s+8)/4],g=(l(),
T)[(s+12)/4],S=[],i=0;i<32;i++)S.push((l(),te)[s+i+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:u,c_oflag:d,c_cflag:_,
c_lflag:g,c_cc:S})}return 0}case 21519:{if(!n.tty)return-59;var s=Ge();return(l(),T)[s/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var s=Ge();return a.ioctl(n,r,s)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var w=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=Ge();(l(),me)[s/2]=w[0],(l(),me)[(s+2)/2]=w[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(I){if(typeof a>"u"||I.name!=="ErrnoError")throw I;return-I.
errno}}function Bn(e,r){if(b)return ne(8,0,1,e,r);e=p(e),r=p(r);try{return e=P.getStr(e),P.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function An(e,r,t,n){if(b)return ne(9,0,1,e,r,t,n);r=p(r),
t=p(t);try{r=P.getStr(r);var o=n&256,s=n&4096;return n=n&-6401,r=P.calculateAt(e,r,s),P.writeStat(t,o?a.lstat(r):a.stat(
r))}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}function ot(e,r,t,n){if(b)return ne(10,0,1,e,
r,t,n);r=p(r),n=p(n),P.varargs=n;try{r=P.getStr(r),r=P.calculateAt(e,r);var o=n?lr():0;return a.open(r,t,o).fd}catch(s){
if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function st(e,r){if(b)return ne(11,0,1,e,r);e=p(e),r=p(r);
try{return e=P.getStr(e),P.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Cn=()=>pe("");function Gn(e){e=p(e),Ir(e,!U,1,!A,5242880,!1),M.threadInitTLS()}var gr=e=>{if(e instanceof jr||e=="un\
wind")return ce;y(1,e)},Dn=()=>{if(!nr())try{if(b){Qe()&&Tr(ce);return}or(ce)}catch(e){gr(e)}},Se=e=>{if(!he)try{e(),Dn()}catch(r){
gr(r)}};function _r(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),T),e/4,e);r.value.then(He);var t=e+228;
Atomics.store((l(),T),t/4,1)}}var He=()=>Se(()=>{var e=Qe();e&&(_r(e),$t())});function jn(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
He);else if(b)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=M.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var Ye=[];function Rn(e,r,t,n,o){t=p(t),o=p(o),n/=2,Ye.length=n;for(var s=o/8,i=0;i<n;i++)(l(),K)[s+2*i]?
Ye[i]=(l(),K)[s+2*i+1]:Ye[i]=(l(),Ie)[s+2*i+1];var u=Ja[e];M.currentProxiedOperationCallerThread=t;var d=u(...Ye);return M.
currentProxiedOperationCallerThread=0,typeof d=="bigint"&&(d=p(d)),d}function On(e){e=p(e),b?postMessage({cmd:"cleanupTh\
read",thread:e}):Or(e)}function Un(e){e=p(e),E&&M.pthreads[e].ref()}var Ln=e=>e%4===0&&(e%100!==0||e%400===0),Mn=[0,31,60,
91,121,152,182,213,244,274,305,335],Wn=[0,31,59,90,120,151,181,212,243,273,304,334],qn=e=>{var r=Ln(e.getFullYear()),t=r?
Mn:Wn,n=t[e.getMonth()]+e.getDate()-1;return n};function Vn(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(l(),T)[r/4]=t.getSeconds(),
(l(),T)[(r+4)/4]=t.getMinutes(),(l(),T)[(r+8)/4]=t.getHours(),(l(),T)[(r+12)/4]=t.getDate(),(l(),T)[(r+16)/4]=t.getMonth(),
(l(),T)[(r+20)/4]=t.getFullYear()-1900,(l(),T)[(r+24)/4]=t.getDay();var n=qn(t)|0;(l(),T)[(r+28)/4]=n,(l(),K)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var o=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
i=o.getTimezoneOffset(),u=(s!=i&&t.getTimezoneOffset()==Math.min(i,s))|0;(l(),T)[(r+32)/4]=u}function it(e,r,t,n,o,s,i){
if(b)return ne(12,0,1,e,r,t,n,o,s,i);e=p(e),o=p(o),s=p(s),i=p(i);try{var u=P.getStreamFromFD(n),d=a.mmap(u,e,o,r,t),_=d.
ptr;return(l(),T)[s/4]=d.allocated,(l(),k)[i/8]=BigInt(_),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function lt(e,r,t,n,o,s){if(b)return ne(13,0,1,e,r,t,n,o,s);e=p(e),r=p(r),s=p(s);try{var i=P.getStreamFromFD(o);t&
2&&P.doMsync(e,i,r,n,s)}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var zn=function(e,r,t,n){
e=p(e),r=p(r),t=p(t),n=p(n);var o=new Date().getFullYear(),s=new Date(o,0,1),i=new Date(o,6,1),u=s.getTimezoneOffset(),d=i.
getTimezoneOffset(),_=Math.max(u,d);(l(),k)[e/8]=BigInt(_*60),(l(),T)[r/4]=+(u!=d);var g=I=>{var R=I>=0?"-":"+",j=Math.abs(
I),f=String(Math.floor(j/60)).padStart(2,"0"),O=String(j%60).padStart(2,"0");return`UTC${R}${f}${O}`},S=g(u),w=g(d);d<u?
(Ee(S,t,17),Ee(w,n,17)):(Ee(S,n,17),Ee(w,t,17))},ut=()=>performance.timeOrigin+performance.now(),ct=()=>Date.now(),Jn=e=>e>=
0&&e<=3;function $n(e,r,t){if(t=p(t),!Jn(e))return 28;var n;e===0?n=ct():n=ut();var o=Math.round(n*1e3*1e3);return(l(),K)[t/
8]=BigInt(o),0}var Pn=()=>{},Re=()=>{Pe+=1},Hn=()=>{throw Re(),"unwind"},Yn=()=>new Error().stack.toString(),Xn=e=>{var r=Yn(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),o=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var i="",u="",d=0,_=0,g=o.exec(s);if(g?.length==5)i=g[1],u=g[2],d=g[3],_=g[4];else if(g=n.exec(s),g?.length>=4)i=g[1],u=
g[2],d=g[3],_=g[4]|0;else{r+=s+`
`;continue}if(i=="_emscripten_log"||i=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(u=u.substring(u.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${i} (${u}:${d}:${_})
`)}return r=r.replace(/\s+$/,""),r};function Qn(e,r,t){r=p(r);var n=Xn(e);if(!r||t<=0)return ke(n)+1;var o=Ee(n,r,t);return o+
1}var mt=()=>4294967296,Kn=()=>BigInt(mt()),Zn=()=>2,ea=()=>E?require("os").cpus().length:navigator.hardwareConcurrency,
ra=e=>{var r=ye.buffer.byteLength,t=(e-r+65535)/65536|0;try{return ye.grow(BigInt(t)),ze(),1}catch{}};function ta(e){e=p(
e);var r=(l(),X).length;if(e<=r)return!1;var t=mt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var o=r*(1+.2/n);o=Math.min(o,
e+100663296);var s=Math.min(t,Kr(Math.max(e,o),65536)),i=ra(s);if(i)return!0}return!1}var Ne=e=>{var r=ke(e)+1,t=ar(r);return Ee(
e,t,r),t},na=(e,r)=>{(l(),B)[e/4]=r;var t=(l(),B)[e/4];(l(),B)[(e+4)/4]=(r-t)/4294967296},aa=e=>{var r=ke(e)+1,t=Et(r);return t&&
Ee(e,t,r),t},Te=e=>(l(),B)[e/4]+(l(),T)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{m.Internals.
jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(()=>t(
e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Rt(r);return m.Internals.jsObjects[t]=
e,t},importJsBindGroup:(e,r=0)=>{var t=vr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{var t=hr(
r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{z(e.mapState==="unmapped");var t=Ot(r);return m.Internals.
jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=wr(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=br(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=yr(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=kr(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Er(
r),n=Ut(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),c.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=Nt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=xt(
r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=It(r);return m.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Er(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Tt(r);return m.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=Ft(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=Bt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=At(r);return m.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=Ct(r);return m.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=Lt(
r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Gt(r);return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Dt(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=jt(r);return m.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var o=we(),s=Ne(t);((i,u,d)=>$r(e).call(null,i,BigInt(u),BigInt(d)))(r,BigInt(s),n),be(o)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),k)[e/8]);t;t=Number((l(),k)[t/8])){var n=(l(),T)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),k)[e/8]=BigInt(r),(l(),k)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),k)[e/8]),t=Number((l(),
k)[(e+8)/8]);return Le(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),k)[e/8]),t=Number((l(),k)[(e+8)/8]);
return r?Le(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),Ie)[e/8],g:(l(),Ie)[(e+8)/8],b:(l(),Ie)[(e+16)/8],a:(l(),Ie)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),B)[e/4],height:(l(),B)[(e+4)/4],depthOrArrayLayers:(l(),B)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),B)[e/4],y:(l(),B)[(e+4)/4],z:(l(),B)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.getJsObject(Number((l(),k)[e/
8])),mipLevel:(l(),B)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),T)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),B)[(e+8)/4],t=(l(),B)[(e+12)/4];return{offset:Te(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.buffer=m.getJsObject(Number((l(),
k)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number((l(),k)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
B)[(e+16)/4],endOfPassWriteIndex:(l(),B)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var o=r+
32*n,s=m.makeStringFromStringView(o+8);t[s]=(l(),Ie)[(o+24)/8]}return t}},makePipelineLayout:e=>e?m.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),k)[(e+8)/8])),constants:m.makePipelineConstants(Number(
(l(),k)[(e+32)/8]),Number((l(),k)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),k)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(f){if(f)return{topology:m.PrimitiveTopology[(l(),T)[(f+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),T)[(f+12)/4]],frontFace:m.FrontFace[(l(),T)[(f+16)/4]],cullMode:m.CullMode[(l(),T)[(f+20)/4]],unclippedDepth:!!(l(),
B)[(f+24)/4]}}function t(f){if(f)return{operation:m.BlendOperation[(l(),T)[f/4]],srcFactor:m.BlendFactor[(l(),T)[(f+4)/4]],
dstFactor:m.BlendFactor[(l(),T)[(f+8)/4]]}}function n(f){if(f)return{alpha:t(f+12),color:t(f+0)}}function o(f){var O=m.TextureFormat[(l(),
T)[(f+8)/4]];return O?{format:O,blend:n(Number((l(),k)[(f+16)/8])),writeMask:(l(),B)[(f+24)/4]}:void 0}function s(f,O){for(var L=[],
H=0;H<f;++H)L.push(o(O+32*H));return L}function i(f){return{compare:m.CompareFunction[(l(),T)[f/4]],failOp:m.StencilOperation[(l(),
T)[(f+4)/4]],depthFailOp:m.StencilOperation[(l(),T)[(f+8)/4]],passOp:m.StencilOperation[(l(),T)[(f+12)/4]]}}function u(f){
if(f)return{format:m.TextureFormat[(l(),T)[(f+8)/4]],depthWriteEnabled:!!(l(),B)[(f+12)/4],depthCompare:m.CompareFunction[(l(),
T)[(f+16)/4]],stencilFront:i(f+20),stencilBack:i(f+36),stencilReadMask:(l(),B)[(f+52)/4],stencilWriteMask:(l(),B)[(f+56)/
4],depthBias:(l(),T)[(f+60)/4],depthBiasSlopeScale:(l(),Ce)[(f+64)/4],depthBiasClamp:(l(),Ce)[(f+68)/4]}}function d(f){return{
format:m.VertexFormat[(l(),T)[(f+8)/4]],offset:Te(f+16),shaderLocation:(l(),B)[(f+24)/4]}}function _(f,O){for(var L=[],H=0;H<
f;++H)L.push(d(O+H*32));return L}function g(f){if(f){var O=m.VertexStepMode[(l(),T)[(f+8)/4]],L=Number((l(),k)[(f+24)/8]);
return!O&&!L?null:{arrayStride:Te(f+16),stepMode:O,attributes:_(L,Number((l(),k)[(f+32)/8]))}}}function S(f,O){if(f){for(var L=[],
H=0;H<f;++H)L.push(g(O+H*40));return L}}function w(f){if(f){var O={module:m.getJsObject(Number((l(),k)[(f+8)/8])),constants:m.
makePipelineConstants(Number((l(),k)[(f+32)/8]),Number((l(),k)[(f+40)/8])),buffers:S(Number((l(),k)[(f+48)/8]),Number((l(),
k)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return O}}function I(f){if(f)return{count:(l(),B)[(f+
8)/4],mask:(l(),B)[(f+12)/4],alphaToCoverageEnabled:!!(l(),B)[(f+16)/4]}}function R(f){if(f){var O={module:m.getJsObject(
Number((l(),k)[(f+8)/8])),constants:m.makePipelineConstants(Number((l(),k)[(f+32)/8]),Number((l(),k)[(f+40)/8])),targets:s(
Number((l(),k)[(f+48)/8]),Number((l(),k)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return O}}var j={
label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),k)[(e+24)/8])),vertex:w(e+32),primitive:r(
e+96),depthStencil:u(Number((l(),k)[(e+128)/8])),multisample:I(e+136),fragment:R(Number((l(),k)[(e+160)/8]))};return j},
fillLimitStruct:(e,r)=>{var t=Number((l(),k)[r/8]);function n(i,u,d,_=0){var g=e[i]??_;(l(),B)[(u+d)/4]=g}function o(i,u,d,_=0){
var g=e[i]??_;na(u+d,g)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("maxTextureDimension3D",r,16),
n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),n("maxBindingsPerBindGr\
oup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipelineLayout",r,40),n("ma\
xSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPerShaderStage",r,52),n("m\
axStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBufferOffsetAlignment",r,80),
n("minStorageBufferOffsetAlignment",r,84),o("maxUniformBufferBindingSize",r,64),o("maxStorageBufferBindingSize",r,72),n(
"maxVertexBuffers",r,88),o("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBufferArrayStride",r,108),n(
"maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentBytesPerSample",r,120),n("maxC\
omputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeWorkgroupSizeX",r,132),n("m\
axComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPerDimension",r,144),n("maxIm\
mediateSize",r,148),t!==0){(l(),T)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.maxStorageBuffersPerShaderStage),
n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStorageTexturesInVertexStage",s,20,e.
maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(l(),B)[(r+88)/4]=e.subgroupMinSize,(l(),B)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
n=aa(t),o=ke(e.vendor);m.setStringView(r+8,n,o),n+=o;var s=ke(e.architecture);m.setStringView(r+24,n,s),n+=s;var i=ke(e.
device);m.setStringView(r+40,n,i),n+=i;var u=ke(e.description);m.setStringView(r+56,n,u),n+=u,(l(),T)[(r+72)/4]=2;var d=e.
isFallbackAdapter?3:4;(l(),T)[(r+76)/4]=d,(l(),B)[(r+80)/4]=0,(l(),B)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},oa={undefined:1,unknown:1,destroyed:2},
Fe=()=>{Pe-=1};function sa(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(o),s=p(s);var i=m.getJsObject(e),u={};if(s){var d=Number(
(l(),k)[(s+24)/8]);if(d){var _=Number((l(),k)[(s+32)/8]);u.requiredFeatures=Array.from((l(),B).subarray(_/4,(_+d*4)/4),f=>m.
FeatureName[f])}var g=Number((l(),k)[(s+40)/8]);if(g){let f=function(L,H,le,_e=!1){var re=H+le,qe=(l(),B)[re/4];qe!=4294967295&&
(!_e||qe!=0)&&(w[L]=qe)},O=function(L,H,le){var _e=H+le,re=(l(),B)[_e/4],qe=(l(),B)[(_e+4)/4];(re!=4294967295||qe!=4294967295)&&
(w[L]=Te(_e))};var S=Number((l(),k)[g/8]),w={};if(f("maxTextureDimension1D",g,8),f("maxTextureDimension2D",g,12),f("maxT\
extureDimension3D",g,16),f("maxTextureArrayLayers",g,20),f("maxBindGroups",g,24),f("maxBindGroupsPlusVertexBuffers",g,28),
f("maxBindingsPerBindGroup",g,32),f("maxDynamicUniformBuffersPerPipelineLayout",g,36),f("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),f("maxSampledTexturesPerShaderStage",g,44),f("maxSamplersPerShaderStage",g,48),f("maxStorageBuffersPer\
ShaderStage",g,52),f("maxStorageTexturesPerShaderStage",g,56),f("maxUniformBuffersPerShaderStage",g,60),f("minUniformBuf\
ferOffsetAlignment",g,80),f("minStorageBufferOffsetAlignment",g,84),O("maxUniformBufferBindingSize",g,64),O("maxStorageB\
ufferBindingSize",g,72),f("maxVertexBuffers",g,88),O("maxBufferSize",g,96),f("maxVertexAttributes",g,104),f("maxVertexBu\
fferArrayStride",g,108),f("maxInterStageShaderVariables",g,112),f("maxColorAttachments",g,116),f("maxColorAttachmentByte\
sPerSample",g,120),f("maxComputeWorkgroupStorageSize",g,124),f("maxComputeInvocationsPerWorkgroup",g,128),f("maxComputeW\
orkgroupSizeX",g,132),f("maxComputeWorkgroupSizeY",g,136),f("maxComputeWorkgroupSizeZ",g,140),f("maxComputeWorkgroupsPer\
Dimension",g,144),f("maxImmediateSize",g,148,!0),S!==0){(l(),T)[(S+8)/4];var I=S;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(f("maxStorageBuffersInVertexStage",I,16),f("maxStorageTexturesInVertexStage",I,20),f("maxStorageBuffersInFra\
gmentStage",I,24),f("maxStorageTexturesInFragmentStage",I,28))}u.requiredLimits=w}var R=Number((l(),k)[(s+48)/8]);if(R){
var j={label:m.makeStringFromOptionalStringView(R+8)};u.defaultQueue=j}u.label=m.makeStringFromOptionalStringView(s+8)}Re(),
m.Internals.futureInsert(r,i.requestDevice(u).then(f=>{Fe(),Se(()=>{m.Internals.jsObjectInsert(o,f.queue),m.Internals.jsObjectInsert(
n,f),c.peercomputeOnDevice?.(f),n=BigInt(n),m.Internals.futureInsert(t,f.lost.then(O=>{Se(()=>{f.onuncapturederror=le=>{};
var L=we(),H=Ne(O.message);Sr(t,oa[O.reason],BigInt(H)),be(L)})})),f.onuncapturederror=O=>{var L=5;O.error instanceof GPUValidationError?
L=2:O.error instanceof GPUOutOfMemoryError?L=3:O.error instanceof GPUInternalError&&(L=4);var H=we(),le=Ne(O.error.message);
Wt(BigInt(n),L,BigInt(le)),be(H)},xr(r,1,BigInt(n),0n)})},f=>{Fe(),Se(()=>{var O=we(),L=Ne(f.message);xr(r,3,BigInt(n),BigInt(
L)),t&&Sr(t,4,BigInt(L)),be(O)})}))}function ia(e){e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}var la=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=(()=>{
var o=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=o.getMappedRange(r,t)}catch{return 0n}var i=Pt(16,s.byteLength);return(l(),
X).set(new Uint8Array(s),i),m.Internals.bufferOnUnmaps[e].push(()=>St(i)),i})();return BigInt(n)},ua=function(e,r,t,n,o){
e=p(e),r=p(r),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e);m.Internals.bufferOnUnmaps[e]=[],o==-1&&(o=void 0),Re(),m.Internals.
futureInsert(r,s.mapAsync(t,n,o).then(()=>{Fe(),Se(()=>{Nr(r,1,0n)})},i=>{Fe(),Se(()=>{var u=we(),d=Ne(i.message),_=i.name===
"AbortError"?4:i.name==="OperationError"?3:0;Nr(r,_,BigInt(d)),delete m.Internals.bufferOnUnmaps[e]})}))};function ca(e){
e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.
bufferOnUnmaps[e],r.unmap()}}function ma(e){e=p(e),delete m.Internals.jsObjects[e]}function fa(e,r,t){e=p(e),r=p(r),t=p(
t);var n=!!(l(),B)[(r+40)/4],o={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),B)[(r+24)/4],size:Te(r+32),mappedAtCreation:n},
s=m.getJsObject(e),i;try{i=s.createBuffer(o)}catch{return!1}return m.Internals.jsObjectInsert(t,i),n&&(m.Internals.bufferOnUnmaps[t]=
[]),!0}function da(e,r,t){e=p(e),r=p(r),t=p(t);var n=Number((l(),k)[r/8]),o=(l(),T)[(n+8)/4],s={label:m.makeStringFromOptionalStringView(
r+8),code:""};switch(o){case 2:{s.code=m.makeStringFromStringView(n+16);break}}var i=m.getJsObject(e);m.Internals.jsObjectInsert(
t,i.createShaderModule(s))}var pa=e=>{const r=m.getJsObject(e);r.onuncapturederror=null,r.destroy()};function ga(e,r,t,n){
r=p(r),t=p(t),n=p(n);var o;if(t){o={featureLevel:m.FeatureLevel[(l(),T)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),
T)[(t+12)/4]],forceFallbackAdapter:!!(l(),B)[(t+16)/4]};var s=Number((l(),k)[t/8]);if(s!==0){(l(),T)[(s+8)/4];var i=s;o.
xrCompatible=!!(l(),B)[(i+16)/4]}}if(!("gpu"in navigator)){var u=we(),d=Ne("WebGPU not available on this browser (naviga\
tor.gpu is not available)");We(r,3,BigInt(n),BigInt(d)),be(u);return}Re(),m.Internals.futureInsert(r,navigator.gpu.requestAdapter(
o).then(_=>{Fe(),Se(()=>{if(_)m.Internals.jsObjectInsert(n,_),We(r,1,BigInt(n),0n);else{var g=we(),S=Ne("WebGPU not avai\
lable on this browser (requestAdapter returned null)");We(r,3,BigInt(n),BigInt(S)),be(g)}})},_=>{Fe(),Se(()=>{var g=we(),
S=Ne(_.message);We(r,4,BigInt(n),BigInt(S)),be(g)})}))}var _a=function(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);Re(),m.
Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Fe(),Se(()=>{Mt(r,1)})}))},ft=function(e,r,t){return e=p(e),r=
p(r),t=p(t),ge.handleAsync(async()=>{var n=[];if(t){var o=(l(),T)[t/4];n.length=r+1,n[r]=new Promise(d=>setTimeout(d,o,0))}else
n.length=r;for(var s=0;s<r;++s){var i=Te(e+s*8);if(!(i in m.Internals.futures))return i;n[s]=m.Internals.futures[i]}const u=await Promise.
race(n);return delete m.Internals.futures[u],u})};ft.isAsync=!0;var Xe={},va=()=>C||"./this.program",Me=()=>{if(!Me.strings){
var e=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_us\
er",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:va()};for(var t in Xe)Xe[t]===void 0?delete r[t]:r[t]=Xe[t];var n=[];
for(var t in r)n.push(`${t}=${r[t]}`);Me.strings=n}return Me.strings};function dt(e,r){if(b)return ne(14,0,1,e,r);e=p(e),
r=p(r);var t=0,n=0;for(var o of Me()){var s=r+t;(l(),k)[(e+n)/8]=BigInt(s),t+=Ee(o,s,1/0)+1,n+=8}return 0}function pt(e,r){
if(b)return ne(15,0,1,e,r);e=p(e),r=p(r);var t=Me();(l(),k)[e/8]=BigInt(t.length);var n=0;for(var o of t)n+=ke(o)+1;return(l(),
k)[r/8]=BigInt(n),0}function gt(e){if(b)return ne(16,0,1,e);try{var r=P.getStreamFromFD(e);return a.close(r),0}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.errno}}var ha=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var i=Number(
(l(),k)[r/8]),u=Number((l(),k)[(r+8)/8]);r+=16;var d=a.read(e,(l(),te),i,u,n);if(d<0)return-1;if(o+=d,d<u)break}return o};
function _t(e,r,t,n){if(b)return ne(17,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var o=P.getStreamFromFD(e),s=ha(o,r,t);return(l(),
k)[n/8]=BigInt(s),0}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return i.errno}}function vt(e,r,t,n){if(b)return ne(
18,0,1,e,r,t,n);r=p(r),n=p(n);try{if(isNaN(r))return 61;var o=P.getStreamFromFD(e);return a.llseek(o,r,t),(l(),K)[n/8]=BigInt(
o.position),o.getdents&&r===0&&t===0&&(o.getdents=null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.
errno}}var wa=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var i=Number((l(),k)[r/8]),u=Number((l(),k)[(r+8)/8]);r+=16;var d=a.write(
e,(l(),te),i,u,n);if(d<0)return-1;if(o+=d,d<u)break}return o};function ht(e,r,t,n){if(b)return ne(19,0,1,e,r,t,n);r=p(r),
t=p(t),n=p(n);try{var o=P.getStreamFromFD(e),s=wa(o,r,t);return(l(),k)[n/8]=BigInt(s),0}catch(i){if(typeof a>"u"||i.name!==
"ErrnoError")throw i;return i.errno}}function ba(e,r){e=p(e),r=p(r);try{return ur((l(),X).subarray(e,e+r)),0}catch(t){if(typeof a>
"u"||t.name!=="ErrnoError")throw t;return t.errno}}function ya(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(
t.info,r),1}function ka(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function Ea(e,r){
e=p(e);var t=m.getJsObject(e);return t.features.has(m.FeatureName[r])}var Sa=function(e){e=p(e);var r=(()=>{var t=m.getJsObject(
e);return t.size})();return BigInt(r)},Na=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(
r+8),timestampWrites:m.makePassTimestampWrites(Number((l(),k)[(r+24)/8]))});var o=m.getJsObject(e),s=yr(0n);return m.Internals.
jsObjectInsert(s,o.beginComputePass(n)),s})();return BigInt(t)};function xa(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(
o),s=p(s);var i=m.getJsObject(e),u=m.getJsObject(r),d=m.getJsObject(n);i.copyBufferToBuffer(u,t,d,o,s)}var Ia=function(e,r){
e=p(e);var t=(()=>{var n=m.getJsObject(e),o=wr(0n);return m.Internals.jsObjectInsert(o,n.finish()),o})();return BigInt(t)};
function Ta(e,r,t,n){e=p(e);var o=m.getJsObject(e);o.dispatchWorkgroups(r,t,n)}function Fa(e){e=p(e);var r=m.getJsObject(
e);r.end()}function Ba(e,r,t,n,o){e=p(e),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(t);n==0?s.setBindGroup(
r,i):s.setBindGroup(r,i,(l(),B),o/4,n)}function Aa(e,r){e=p(e),r=p(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var Ca=function(e,r){e=p(e);var t=(()=>{var n=m.getJsObject(e),o=hr(0n);return m.Internals.jsObjectInsert(o,n.getBindGroupLayout(
r)),o})();return BigInt(t)},Ga=function(e,r){e=p(e),r=p(r);var t=(()=>{function n(d){var _=Number((l(),k)[(d+16)/8]),g=Number(
(l(),k)[(d+40)/8]),S=Number((l(),k)[(d+48)/8]),w=0;m.iterateExtensions(d,{327681:j=>{w=Number((l(),k)[(j+16)/8])}});var I;
if(_){var R=Te(d+32);R==-1&&(R=void 0),I={buffer:m.getJsObject(_),offset:Te(d+24),size:R}}else I=m.getJsObject(g||S||w);
return{binding:(l(),B)[(d+8)/4],resource:I}}function o(d,_){for(var g=[],S=0;S<d;++S)g.push(n(_+56*S));return g}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),k)[(r+24)/8])),entries:o(Number((l(),k)[(r+32)/8]),
Number((l(),k)[(r+40)/8]))},i=m.getJsObject(e),u=vr(0n);return m.Internals.jsObjectInsert(u,i.createBindGroup(s)),u})();
return BigInt(t)},Da=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var o=m.getJsObject(e),s=br(0n);return m.Internals.jsObjectInsert(s,o.createCommandEncoder(n)),s})();return BigInt(t)},ja=function(e,r){
e=p(e),r=p(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),o=m.getJsObject(e),s=kr(0n);return m.Internals.jsObjectInsert(
s,o.createComputePipeline(n)),s})();return BigInt(t)};function Ra(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var Oa=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=m.getJsObject(
e),o=Array.from((l(),K).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(o)};function Ua(e,r,t,n,o){e=p(e),r=p(r),t=
p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(r),u=(l(),X).subarray(n,n+o);s.writeBuffer(i,t,u,0,o)}var ge={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;ge.asyncExports=new Set;var t={};for(let[o,s]of Object.entries(
e))if(typeof s=="function"){r.test(o)&&(ge.asyncExports.add(s),s=ge.makeAsyncFunction(s));var n=ge.instrumentFunction(s);
t[o]=n}else t[o]=s;return t},asyncExports:null,isAsyncExport(e){return ge.asyncExports?.has(e)},handleAsync:async e=>{Re();
try{return await e()}finally{Fe()}},handleSleep:e=>ge.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},wt=e=>{var r=c["_"+e];return r},La=(e,r)=>{(l(),te).set(e,r)},bt=(e,r,t,n,o)=>{var s={pointer:j=>BigInt(j),
string:j=>{var f=0;return j!=null&&j!==0&&(f=Ne(j)),BigInt(f)},array:j=>{var f=ar(j.length);return La(j,f),BigInt(f)}};function i(j){
return r==="string"?Le(Number(j)):r==="pointer"?Number(j):r==="boolean"?!!j:j}var u=wt(e),d=[],_=0;if(n)for(var g=0;g<n.
length;g++){var S=s[t[g]];S?(_===0&&(_=we()),d[g]=S(n[g])):d[g]=n[g]}var w=u(...d);function I(j){return _!==0&&be(_),i(j)}
var R=o?.async;return R?w.then(I):(w=I(w),w)},Ma=(e,r,t,n)=>{var o=!t||t.every(i=>i==="number"||i==="boolean"),s=r!=="st\
ring";return s&&o&&!n?wt(e):(...i)=>bt(e,r,t,i,n)},Wa=(...e)=>a.createPath(...e),qa=(...e)=>a.unlink(...e),Va=(...e)=>a.
createLazyFile(...e),za=(...e)=>a.createDevice(...e);if(M.init(),a.createPreloadedFile=Tn,a.preloadFile=pr,a.staticInit(),
sn(),c.noExitRuntime&&(ir=c.noExitRuntime),c.preloadPlugins&&(et=c.preloadPlugins),c.print&&(Q=c.print),c.printErr&&(Y=c.
printErr),c.wasmBinary&&(ue=c.wasmBinary),c.arguments&&c.arguments,c.thisProgram&&(C=c.thisProgram),c.preInit)for(typeof c.
preInit=="function"&&(c.preInit=[c.preInit]);c.preInit.length>0;)c.preInit.shift()();c.ENV=Xe,c.mmapAlloc=fr,c.wasmMemory=
ye,c.addRunDependency=$e,c.removeRunDependency=Je,c.ccall=bt,c.cwrap=Ma,c.FS_preloadFile=pr,c.FS_unlink=qa,c.FS_createPath=
Wa,c.FS_createDevice=za,c.FS=a,c.FS_createDataFile=Zr,c.FS_createLazyFile=Va,c.MEMFS=D;var Ja=[qr,Vr,Hr,rt,Fn,tt,nt,at,Bn,
An,ot,st,it,lt,dt,pt,gt,_t,vt,ht];function yt(e,r,t,n){return ge.handleAsync(async()=>await N(Le(Number(e)),Number(r),Number(
t),Number(n)))}yt.sig="jjjjj";var kt,Et,St,vr,hr,wr,br,yr,kr,Nt,xt,It,Tt,Ft,Bt,At,Ct,Gt,Dt,jt,Rt,Ot,Ut,Er,Lt,Sr,Nr,We,xr,
Mt,Wt,Qe,qt,Ir,Vt,zt,Jt,Tr,$t,Pt,Ht,Yt,Xt,Qt,Kt,Zt;function $a(e){c._wllama_malloc=e.wllama_malloc,c._wllama_start=e.wllama_start,
c._wllama_action=e.wllama_action,c._wllama_exit=e.wllama_exit,c._wllama_debug=e.wllama_debug,kt=c._main=e.main,Et=e.malloc,
St=e.free,vr=e.emwgpuCreateBindGroup,hr=e.emwgpuCreateBindGroupLayout,wr=e.emwgpuCreateCommandBuffer,br=e.emwgpuCreateCommandEncoder,
yr=e.emwgpuCreateComputePassEncoder,kr=e.emwgpuCreateComputePipeline,Nt=e.emwgpuCreateExternalTexture,xt=e.emwgpuCreatePipelineLayout,
It=e.emwgpuCreateQuerySet,Tt=e.emwgpuCreateRenderBundle,Ft=e.emwgpuCreateRenderBundleEncoder,Bt=e.emwgpuCreateRenderPassEncoder,
At=e.emwgpuCreateRenderPipeline,Ct=e.emwgpuCreateSampler,Gt=e.emwgpuCreateSurface,Dt=e.emwgpuCreateTexture,jt=e.emwgpuCreateTextureView,
Rt=e.emwgpuCreateAdapter,Ot=e.emwgpuCreateBuffer,Ut=e.emwgpuCreateDevice,Er=e.emwgpuCreateQueue,Lt=e.emwgpuCreateShaderModule,
Sr=e.emwgpuOnDeviceLostCompleted,Nr=e.emwgpuOnMapAsyncCompleted,We=e.emwgpuOnRequestAdapterCompleted,xr=e.emwgpuOnRequestDeviceCompleted,
Mt=e.emwgpuOnWorkDoneCompleted,Wt=e.emwgpuOnUncapturedError,e._emscripten_tls_init,Qe=e.pthread_self,qt=e.emscripten_builtin_memalign,
Ir=e._emscripten_thread_init,Vt=e._emscripten_thread_crashed,zt=e._emscripten_run_js_on_main_thread,Jt=e._emscripten_thread_free_data,
Tr=e._emscripten_thread_exit,$t=e._emscripten_check_mailbox,Pt=e.memalign,Ht=e.__trap,Yt=e.emscripten_stack_set_limits,Xt=
e._emscripten_stack_restore,Qt=e._emscripten_stack_alloc,Kt=e.emscripten_stack_get_current,Zt=e.__indirect_function_table}
var Oe;function Pa(){Oe={__asyncjs__js_file_read:yt,__pthread_create_js:Yr,__syscall_fcntl64:rt,__syscall_getcwd:tt,__syscall_getdents64:nt,
__syscall_ioctl:at,__syscall_openat:ot,__syscall_stat64:st,_abort_js:Cn,_emscripten_init_main_thread_js:Gn,_emscripten_notify_mailbox_postmessage:jn,
_emscripten_receive_on_main_thread_js:Rn,_emscripten_thread_cleanup:On,_emscripten_thread_mailbox_await:_r,_emscripten_thread_set_strongref:Un,
_localtime_js:Vn,_mmap_js:it,_munmap_js:lt,_tzset_js:zn,clock_time_get:$n,emscripten_check_blocking_allowed:Pn,emscripten_date_now:ct,
emscripten_exit_with_live_runtime:Hn,emscripten_get_callstack:Qn,emscripten_get_heap_max:Kn,emscripten_get_now:ut,emscripten_has_asyncify:Zn,
emscripten_num_logical_cores:ea,emscripten_resize_heap:ta,emwgpuAdapterRequestDevice:sa,emwgpuBufferDestroy:ia,emwgpuBufferGetConstMappedRange:la,
emwgpuBufferMapAsync:ua,emwgpuBufferUnmap:ca,emwgpuDelete:ma,emwgpuDeviceCreateBuffer:fa,emwgpuDeviceCreateShaderModule:da,
emwgpuDeviceDestroy:pa,emwgpuInstanceRequestAdapter:ga,emwgpuQueueOnSubmittedWorkDone:_a,emwgpuWaitAny:ft,environ_get:dt,
environ_sizes_get:pt,exit:or,fd_close:gt,fd_read:_t,fd_seek:vt,fd_write:ht,memory:ye,random_get:ba,wgpuAdapterGetInfo:ya,
wgpuAdapterGetLimits:ka,wgpuAdapterHasFeature:Ea,wgpuBufferGetSize:Sa,wgpuCommandEncoderBeginComputePass:Na,wgpuCommandEncoderCopyBufferToBuffer:xa,
wgpuCommandEncoderFinish:Ia,wgpuComputePassEncoderDispatchWorkgroups:Ta,wgpuComputePassEncoderEnd:Fa,wgpuComputePassEncoderSetBindGroup:Ba,
wgpuComputePassEncoderSetPipeline:Aa,wgpuComputePipelineGetBindGroupLayout:Ca,wgpuDeviceCreateBindGroup:Ga,wgpuDeviceCreateCommandEncoder:Da,
wgpuDeviceCreateComputePipeline:ja,wgpuInstanceHasWGSLLanguageFeature:Ra,wgpuQueueSubmit:Oa,wgpuQueueWriteBuffer:Ua}}function Ha(e){
e=Object.assign({},e);var r=_=>(g,S,w)=>_(g,BigInt(S||0),BigInt(w||0)),t=_=>g=>Number(_(BigInt(g))),n=_=>g=>_(BigInt(g)),
o=_=>()=>Number(_()),s=_=>(g,S)=>Number(_(BigInt(g),BigInt(S))),i=_=>(g,S,w,I,R,j)=>_(BigInt(g),S,w,I,R,j),u=_=>(g,S,w,I,R)=>_(
g,BigInt(S),w,BigInt(I),R),d=_=>(g,S)=>_(BigInt(g),BigInt(S));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=o(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
i(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=u(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
d(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=o(e.emscripten_stack_get_current),e}async function Ya(){var e=kt,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,zr(n,!0),n}catch(o){return gr(o)}}function Ke(){if(Be>0){Ue=Ke;return}
if(b){Cr();return}if(ln(),Be>0){Ue=Ke;return}async function e(){if(c.calledRun=!0,!he){Cr(),c.onRuntimeInitialized?.();var r=c.
noInitialRun||!1;r||await Ya(),un()}}c.setStatus?(c.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>c.setStatus(""),
1),e()},1)):e()}var xe;return b||(Dr(),Ke()),c}var tn=1,nn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
Ve=new Uint8Array([71,76,85,69]),Br=0,lo=1,uo=2,co=3,mo=4,fo=5,po=6,go=7,_o=8,vo=9,ho=10,an={str:mo,int:uo,float:co,bool:lo,
raw:fo,arr_str:vo,arr_int:go,arr_float:_o,arr_bool:po,arr_raw:ho,null:Br};function wo(c){let N=0;const G=new DataView(c.
buffer),A=()=>{const W=G.getUint32(N,!0);return N+=4,W},U=()=>{const W=G.getInt32(N,!0);return N+=4,W},E=()=>{const W=G.
getFloat32(N,!0);return N+=4,W},b=()=>A()!==0,J=W=>{const se=W??A(),fe=new TextDecoder().decode(c.slice(N,N+se));return N+=
se,fe},C=()=>{const W=A(),se=c.slice(N,N+W);return N+=W,se},y=W=>{const se=A(),fe=new Array(se);for(let Q=0;Q<se;Q++)fe[Q]=
W();return fe},h=()=>null,F=W=>{switch(W.type){case"str":return J();case"int":return U();case"float":return E();case"boo\
l":return b();case"raw":return C();case"arr_str":return y(J);case"arr_int":return y(U);case"arr_float":return y(E);case"\
arr_bool":return y(b);case"arr_raw":return y(C);case"null":return h()}},q=c[0]===Ve[0]&&c[1]===Ve[1]&&c[2]===Ve[2]&&c[3]===
Ve[3];if(N+=4,!q)throw new Error("Invalid magic number");if(A()!==tn)throw new Error("Invalid version number");const v=J(
8),V=nn[v];if(!V)throw new Error(`Unknown message name: ${v}`);const ie={_name:v};for(const W of V.fields){const se=A();
if(se===Br){if(!W.isNullable)throw new Error(`${v}: Expect field ${W.name} to be non-nullable`);ie[W.name]=null;continue}
if(se!==an[W.type])throw new Error(`${v}: Expect field ${W.name} to have type ${W.type}`);ie[W.name]=F(W)}return ie}function bo(c){
const N=nn[c._name];if(!N)throw new Error(`Unknown message name: ${c._name}`);const G=[],A=x=>{const v=new ArrayBuffer(4);
new DataView(v).setUint32(0,x,!0),G.push(new Uint8Array(v))},U=x=>{const v=new ArrayBuffer(4);new DataView(v).setInt32(0,
x,!0),G.push(new Uint8Array(v))},E=x=>{const v=new ArrayBuffer(4);new DataView(v).setFloat32(0,x,!0),G.push(new Uint8Array(
v))},b=x=>{A(x?1:0)},J=x=>{const v=new TextEncoder().encode(x);A(v.byteLength),G.push(v)},C=x=>{A(x.byteLength),G.push(x)},
y=(x,v)=>{A(x.length);for(const V of x)v(V)};G.push(Ve),A(tn);{const x=new TextEncoder().encode(c._name);G.push(x)}for(const x of N.
fields){const v=c[x.name];if(!x.isNullable&&v==null)throw new Error(`${c._name}: Expect field ${x.name} to be non-nullab\
le`);if(v==null){A(Br);continue}switch(A(an[x.type]),x.type){case"str":J(v);break;case"int":U(v);break;case"float":E(v);
break;case"bool":b(v);break;case"raw":C(v);break;case"arr_str":y(v,J);break;case"arr_int":y(v,U);break;case"arr_float":y(
v,E);break;case"arr_bool":y(v,b);break;case"arr_raw":y(v,C);break}}const h=G.reduce((x,v)=>x+v.byteLength,0),F=new Uint8Array(
h);let q=0;for(const x of G)F.set(x,q),q+=x.byteLength;return F}const on=4*1024**2,en=1024*1024;function yo({files:c,reader:N,
getMemory:G,getSignal:A=()=>{}}){const U=new Map(c.map(E=>[E.name,E]));return async(E,b,J,C)=>{const y=U.get(E.replace(/^\/?models\//,
""));if(!y||![b,J,C].every(F=>Number.isSafeInteger(F)&&F>=0)||b>y.size)throw new Error("Invalid GGUF native file read");
const h=Math.min(J,y.size-b);if(!Number.isSafeInteger(C+h)||C+h>G().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let F=0;F<h;){oe(A());const q=Math.min(on,h-F),x=await N.read(y.path,b+F,q,{signal:A()});if(oe(A()),
!(x instanceof Uint8Array)||x.byteLength!==q)throw new Error("Incomplete GGUF artifact range");new Uint8Array(G()).set(x,
C+F),F+=q}return BigInt(h)}}function ko(c,N){c.FS.mkdir("/models"),c.FS.mount(c.MEMFS,{root:"."},"/models");const G=new Map(
N.map(E=>[E.name,E])),A=c.MEMFS.stream_ops;for(const E of["read","llseek"]){const b=A[E];A[E]=function(J,...C){const y=G.
get(J.node.name);return y&&(J.node.usedBytes=y.size),b.call(this,J,...C)},c.MEMFS.ops_table.file.stream[E]=A[E]}const U=A.
mmap;A.mmap=function(E,...b){if(G.has(E.node.name))throw new Error("GGUF artifact mmap is prohibited");return U.call(this,
E,...b)},c.MEMFS.ops_table.file.stream.mmap=A.mmap;for(const E of N)c.FS_createDataFile("/models",E.name,new Uint8Array(
0),!0,!1,!0)}function Eo(c,N,{collect:G=!1,onLost:A}={}){if(N.device=c,N.runtimeFeatures=[...c.features],N.runtimeAdapter=
c.adapterInfo?{vendor:c.adapterInfo.vendor,architecture:c.adapterInfo.architecture,isFallbackAdapter:c.adapterInfo.isFallbackAdapter??
!1}:null,!c.features.has("shader-f16")||N.runtimeAdapter?.isFallbackAdapter)throw new Error("GGUF native runtime did not\
 acquire the required hardware GPU");if(c.lost.then(C=>A?.(C)),!G)return()=>{};const U=Object.getOwnPropertyDescriptor(c,
"createCommandEncoder"),E=Object.getOwnPropertyDescriptor(c.queue,"submit"),b=c.createCommandEncoder.bind(c),J=c.queue.submit.
bind(c.queue);return c.createCommandEncoder=(...C)=>{const y=b(...C),h=y.beginComputePass.bind(y);return y.beginComputePass=
(...F)=>{const q=h(...F);for(const x of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const v=q[x].bind(q);q[x]=(...V)=>{
const ie=v(...V);return N.dispatches+=1,ie}}return q},y},c.queue.submit=(...C)=>{const y=J(...C);return N.submissions+=1,
y},()=>{U?Object.defineProperty(c,"createCommandEncoder",U):delete c.createCommandEncoder,E?Object.defineProperty(c.queue,
"submit",E):delete c.queue.submit}}function So(c){const N=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(c);return N?
{gpuLayers:Number(N[1]),totalLayers:Number(N[2])}:null}function No(c){const N=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(c);return N?{backend:N[1],kind:N[2].toLowerCase(),bytes:Math.round(Number(N[3])*1024**2)}:null}async function xo({wasmUrl:c,
weights:N,reader:G,signal:A,collectGpuEvidence:U=!1,onProgress:E,onLost:b,initialize:J=io}={}){const C=N.map((z,ee)=>({...z,
name:`model-${String(ee+1).padStart(5,"0")}-of-${String(N.length).padStart(5,"0")}.gguf`})),y={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let h=A,F,q,x,v,V;const ie=new Promise((z,ee)=>{v=z,V=ee}),W=z=>{const ee=So(
String(z));ee&&(y.offload=ee,E?.({type:"gpu-offload",...ee}));const l=No(String(z));l&&y.buffers.length<32&&(y.buffers.push(
l),E?.({type:"native-buffer",...l,wasmMemoryBytes:x?.wasmMemory?.buffer.byteLength??0}))},se=z=>{F=new Error(`Model sess\
ion lost: GGUF native runtime failed: ${String(z).slice(0,300)}`),V(F)};x={noInitialRun:!0,pthreadPoolSize:0,locateFile(z){
if(z!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return c},print:W,printErr:W,onAbort:se,onExit:se,
preRun(){x.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){v()},peercomputeOnDevice(z){try{q?.(),q=Eo(z,y,{collect:U,onLost(ee){
y.lost=!0,b?.(ee)}})}catch(ee){z.destroy(),se(ee.message)}}};const fe=yo({files:C,reader:G,getMemory:()=>x.wasmMemory.buffer,
getSignal:()=>h});J(x,fe),await ie,oe(A),ko(x,C);const Q=x.cwrap("wllama_start","string",[],{async:!0}),Y=x.cwrap("wllam\
a_malloc","bigint",["bigint","number"]),ue=x.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let Z=!1;const he=async(z,ee,l)=>{
if(Z)throw new Error("Concurrent GGUF native calls are prohibited");if(F)throw F;if(y.lost)throw new Error("GPU device l\
ost; GGUF session is unavailable");oe(l),Z=!0,h=l;try{const ae=bo(ee);if(ae.byteLength>en)throw new Error("GGUF native m\
essage exceeds its byte budget");const de=Number(Y(BigInt(ae.byteLength),0)),ve=new Uint8Array(x.wasmMemory.buffer);if(!Number.
isSafeInteger(de)||de<=0||de+ae.length>ve.length)throw new Error("Invalid GGUF input pointer");ve.set(ae,de);const te=Number(
await ue(z,BigInt(de)));if(F)throw F;const X=x.wasmMemory.buffer,me=new DataView(X).getUint32(de,!0);if(!Number.isSafeInteger(
te)||te<=0||me>en||te+me>X.byteLength)throw new Error("Invalid GGUF output buffer");return wo(new Uint8Array(X,te,me).slice())}catch(ae){
throw F??=new Error(`Model session lost: GGUF native action failed: ${String(ae.message??ae).slice(0,300)}`),F}finally{Z=
!1,h=void 0}},ce=JSON.parse(await Q());if(F)throw F;if(!ce.success||!y.device)throw new Error("GGUF native hardware GPU \
backend did not initialize");return oe(A),{files:C,action:he,evidence:y,async settleGpu(){try{await y.device.queue.onSubmittedWorkDone()}catch(z){
throw y.lost=!0,F=new Error(`Model session lost: GGUF GPU completion failed: ${String(z.message??z).slice(0,300)}`),F}},
close(){q?.(),y.device?.destroy()},memoryBytes(){return x.wasmMemory.buffer.byteLength}}}const Io="ERR_MODEL_CONTEXT_BUD\
GET",rr=1;function To(c,N,G){return Object.assign(new Error(`The model context holds ${N} tokens; instructions and the c\
urrent prompt need ${c}, plus ${G} reserved for the reply. Shorten the current prompt or saved context, or request a sho\
rter reply.`),{code:Io})}function Fo(c){const N=c.findIndex(A=>A.role==="user"),G=c.findIndex((A,U)=>U>N&&A.role==="user");
return N<0||G<0?null:c.filter((A,U)=>U<N||U>=G||A.role==="system")}async function Bo({messages:c,contextTokens:N,reservedOutputTokens:G,
measure:A,signal:U,onMeasured:E}){if(!Number.isSafeInteger(N)||N<1||!Number.isSafeInteger(G)||G<1)throw new Error("Inval\
id GGUF context budget");let b=c.map(h=>({...h})),J=0,C=0;const y=Math.max(1,c.filter(h=>h.role==="user").length);for(let h=1;h<=
y;h+=1){oe(U);const F=await A(b);if(oe(U),!Number.isSafeInteger(F.inputTokens)||F.inputTokens<0||!Number.isSafeInteger(F.
contextTokens)||F.contextTokens<1||F.contextTokens>N||!Number.isSafeInteger(F.probeOutputTokens)||F.probeOutputTokens<0||
F.probeOutputTokens>rr)throw new Error("Invalid GGUF context measurement");C+=F.probeOutputTokens;const q={contextTokens:F.
contextTokens,inputTokens:F.inputTokens,reservedOutputTokens:G,removedTurns:J,preflightCalls:h,measurementTokens:C,probeTokenBudget:rr},
x=F.inputTokens>=F.contextTokens||F.inputTokens+G>F.contextTokens;if(E?.({...q,probeOutputTokens:F.probeOutputTokens,overflow:x}),
oe(U),!x)return{messages:b,contextTruncated:J>0,contextBudget:q};const v=Fo(b);if(!v)throw To(F.inputTokens,F.contextTokens,
G);b=v,J+=1}throw new Error("GGUF context fitting exceeded its bounded attempts")}const er=c=>new TextEncoder().encode(c).
byteLength;function Ao(c){if(!c.data_json||c.data_json==="null")return[];if(typeof c.data_json!="string"||er(c.data_json)>
1024*1024)throw new Error("GGUF result exceeds its byte budget");let N;try{N=JSON.parse(c.data_json)}catch{throw new Error(
"GGUF returned invalid result JSON")}const G=Array.isArray(N)?N:[N];if(G.some(A=>!A||typeof A!="object"||Array.isArray(A)))
throw new Error("GGUF returned invalid result data");return G}function Co(c,N){const G=c[0],A=G?.error??G,U=A?.n_prompt_tokens??
G?.n_prompt_tokens,E=A?.n_ctx??G?.n_ctx;if(A?.type==="exceed_context_size_error"&&Number.isSafeInteger(U)&&U>=E&&Number.
isSafeInteger(E)&&E>0&&E<=N)return Object.assign(new Error("GGUF native prompt exceeds the model context"),{code:"ERR_GG\
UF_NATIVE_CONTEXT",inputTokens:U,contextTokens:E});const b=A?.type==="invalid_request_error";return Object.assign(new Error(
b?"GGUF rejected the inference request":"GGUF native inference failed"),{code:b?"ERR_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE\
_FAILURE"})}function Go(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("G\
GUF inference requires a ComputeManager-owned worker")}function rn(c){return{sessionId:c.sessionId,manifestCid:c.manifestCid,
status:c.lost?"lost":c.status,runtime:"llama.cpp",runtimeVersion:oo,task:"text-generation",workerId:c.workerId,adapter:c.
capabilities?.adapter,runtimeAdapter:c.engine?.evidence.runtimeAdapter??null,runtimeFeatures:c.engine?.evidence.runtimeFeatures??
[],gpuDispatches:c.engine?.evidence.dispatches??0,gpuSubmissions:c.engine?.evidence.submissions??0,gpuOffload:c.engine?.
evidence.offload??null,runtimeOptions:c.options,effectiveContextTokens:c.contextTokens??null,nativeBuffers:c.engine?.evidence.
buffers??[],wasmMemoryBytes:c.engine?.memoryBytes()??0,generatedRequests:c.generatedRequests,artifactReads:c.reader?.getStats()??
null}}function Do({loadEngine:c=xo,createReader:N=Xa,checkCapabilities:G=Qa,assertWorker:A=Go,baseUrl:U=globalThis.location?.
href}={}){let E;async function b(C,y){if(E)throw new Error("GGUF worker already has a resident model");const h=Ka(C.manifest),
F=Za(C.runtimeAssets,U),q=eo(C.runtimeOptions),x=Ze(C.sessionId);oe(y.signal);const v={sessionId:x,manifestCid:C.manifestCid,
workerId:y.workerId??null,manifest:h.manifest,status:"loading",options:q,generatedRequests:0,residency:new AbortController,
lost:!1};E=v;try{v.capabilities=await G(),oe(y.signal),v.reader=N(C.artifactPort,{manifest:h.manifest,signal:v.residency.
signal,maxReadBytes:on,maxReads:1}),await ro(h.manifest.model,h.weights,v.reader,{signal:y.signal}),oe(y.signal),v.engine=
await c({wasmUrl:F.wasm,weights:h.weights,reader:v.reader,signal:y.signal,collectGpuEvidence:C.collectGpuEvidence===!0,onProgress:W=>y.
emitProgress?.({...W,sessionId:x}),onLost(){v.lost=!0,v.active?.abort("GPU device lost")}}),oe(y.signal);const V=await v.
engine.action("load",{_name:"load_req",model_paths:v.engine.files.map(W=>`models/${W.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,
...q,n_ubatch:Math.min(64,q.n_batch),n_parallel:1,kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,
jinja:!0},y.signal);if(!V.success)throw new Error("GGUF native model load failed");if(!Number.isSafeInteger(V.n_ctx)||V.
n_ctx<1||V.n_ctx>to)throw new Error("GGUF native model returned an invalid context capacity");v.contextTokens=V.n_ctx;const ie=v.
engine.evidence.offload;if(!ie||ie.gpuLayers<1||ie.gpuLayers!==Math.min(q.n_gpu_layers,ie.totalLayers))throw new Error("\
GGUF did not honor the explicitly configured GPU layer offload");if(oe(y.signal),v.lost)throw new Error("GPU device lost\
 during GGUF load");return v.status="ready",rn(v)}catch(V){throw v.engine&&y.emitProgress?.({type:"model-load-memory",sessionId:x,
wasmMemoryBytes:v.engine.memoryBytes(),nativeBuffers:v.engine.evidence.buffers??[]}),v.lost=!0,v.status="lost",v.residency.
abort(V),v.reader?.close(V),v.engine?.close(),V}}async function J(C,y){const h=E;if(!h||h.sessionId!==Ze(C.sessionId)||h.
lost)throw new Error("Model session lost or not loaded");if(h.status!=="ready")throw new Error("GGUF model session is bu\
sy");const F=Ze(C.requestId),q=C.maxNewTokens??Fr.maxNewTokens;no.validateGenerationInput({...C,maxNewTokens:q});const x=ao(
C),v=new AbortController,V=()=>v.abort(y.signal?.reason);y.signal?.addEventListener("abort",V,{once:!0}),y.signal?.aborted&&
V(),h.active=v,h.status="generating",h.requestId=F;const ie=h.engine.evidence.dispatches,W=h.engine.evidence.submissions;
let se=0;async function fe(Q,Y){let ue,Z=!1,he="",ce=null,z=null,ee="unknown",l=0;try{oe(v.signal);const ae=await h.engine.
action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:Q,stream:!Y,max_tokens:Y?rr:q,temperature:0,
cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:[]},v.signal);if(!ae.success||!Number.isSafeInteger(ae.
req_id)||ae.req_id<0)throw new Error("GGUF failed to start generation");ue=ae.req_id,oe(v.signal);for(let de=0;de<4096;de+=
1){oe(v.signal);const ve=await h.engine.action("get_result",{_name:"gres_req",req_id:ue},v.signal);oe(v.signal);const te=Ao(
ve);if(!ve.success||ve.is_error)throw Co(te,h.contextTokens);for(const X of te){const me=X.choices?.[0]?.finish_reason??
X.finish_reason;me!=null&&(ee=["stop","length"].includes(me)?me:"unknown");const T=X.choices?.[0],B=T?.delta?.content??T?.
message?.content??X.content??"";if(typeof B!="string")throw new Error("Invalid GGUF text chunk");if(Y){const Ce=T?.delta?.
reasoning_content??T?.message?.reasoning_content??"";if(typeof Ce!="string")throw new Error("Invalid GGUF measurement re\
sult");if(l+=er(B)+er(Ce),l>Fr.maxOutputBytes)throw new Error("GGUF measurement exceeds its byte budget")}else{if(he+=B,
er(he)>Fr.maxOutputBytes)throw new Error("GGUF output exceeds its byte budget");if(B&&y.emitProgress?.({type:"token",sessionId:h.
sessionId,requestId:F,sequence:se++,text:B})===!1)throw new Error("Token consumer rejected output")}ce=X.usage?.prompt_tokens??
X.timings?.prompt_n??ce,z=X.usage?.completion_tokens??X.timings?.predicted_n??z}if(!ve.has_more){Z=!0;break}await new Promise(
X=>setTimeout(X,0))}if(!Z)throw new Error("GGUF result polling exceeded its request budget");if(z!==null&&(!Number.isSafeInteger(
z)||z<0||z>(Y?rr:q)))throw new Error("GGUF returned an over-budget token sequence");if(Y&&(!Number.isSafeInteger(ce)||ce<
0||z===null))throw new Error("GGUF context preflight did not return valid token usage");return{text:he,inputTokens:ce,outputTokens:z,
finishReason:ee}}catch(ae){throw(ae?.name==="RuntimeError"||/Model session lost|GPU device lost/.test(ae?.message??""))&&
(h.lost=!0),ae}finally{if(ue!==void 0&&!h.lost)try{Z||await h.engine.action("cancel",{_name:"cncl_req",req_id:ue}),await h.
engine.settleGpu()}catch{throw h.lost=!0,new Error("Model session lost while settling GGUF inference")}}}try{const Q=await Bo(
{messages:x,contextTokens:h.contextTokens,reservedOutputTokens:q,signal:v.signal,async measure(ue){try{const Z=await fe(
ue,!0);return{inputTokens:Z.inputTokens,contextTokens:h.contextTokens,probeOutputTokens:Z.outputTokens}}catch(Z){if(Z.code!==
"ERR_GGUF_NATIVE_CONTEXT")throw Z;return{inputTokens:Z.inputTokens,contextTokens:Z.contextTokens,probeOutputTokens:0}}},
onMeasured:ue=>y.emitProgress?.({type:"context-budget",sessionId:h.sessionId,requestId:F,...ue})});oe(v.signal);const Y=await fe(
Q.messages,!1);if(oe(v.signal),h.lost)throw new Error("GPU device lost; model session is unavailable");return h.generatedRequests+=
1,{sessionId:h.sessionId,requestId:F,...Y,contextTruncated:Q.contextTruncated,contextBudget:Q.contextBudget,workerId:h.workerId,
gpuDispatches:h.engine.evidence.dispatches-ie,gpuSubmissions:h.engine.evidence.submissions-W,gpuOffload:h.engine.evidence.
offload,artifactReads:h.reader.getStats()}}catch(Q){throw Q?.name==="RuntimeError"?(h.lost=!0,new Error(`Model session l\
ost: GGUF native trap: ${String(Q.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(Q.message??"")&&(h.
lost=!0),Q)}finally{y.signal?.removeEventListener("abort",V),h.active=null,h.requestId=null,h.status=h.lost?"lost":"read\
y"}}return async(C={},y={})=>{if(A(),C.command==="load")return b(C,y);if(C.command==="generate")return J(C,y);const h=Ze(
C.sessionId);if(C.command==="status")return E?.sessionId===h?rn(E):{sessionId:h,status:"absent"};if(!E||E.sessionId!==h)
throw new Error("Model session lost or not loaded");if(C.command==="cancel")return E.requestId===C.requestId&&E.active?.
abort(so()),{sessionId:h,cancellationRequested:!0};if(C.command==="unload"){if(E.status==="generating")throw new Error("\
Cancel and await GGUF generation before unloading");return E.residency.abort("GGUF unload"),E.reader?.close(),E.engine?.
close(),E=null,{sessionId:h,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown GGUF inference comm\
and")}}const jo=Do(),Lo=(c,N)=>jo(c,N);export{Do as createGgufTaskRuntime,Lo as handleModelTask};

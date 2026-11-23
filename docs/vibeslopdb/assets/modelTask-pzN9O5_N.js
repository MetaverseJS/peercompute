import{c as Ka}from"./GgufArtifactReader-CpaKye8S.js";import{aZ as ee,bQ as Za,aY as Ze,a_ as rn,b0 as eo}from"./carnageWindow-Ta-Zfo9P.js";
import{G as Br,h as ro,i as to,j as no,k as ao,l as oo,m as so,o as io,p as lo,q as uo,r as tn,s as co}from"./runtime-CK2tQjbg.js";
import"./preload-helper-FD8EeCEm.js";import"./legacy-CU0beSfE.js";import"./protocol-DYUsXv6b.js";function mo(c,w){const A=class{constructor(){
throw new Error("Nested GGUF workers are prohibited")}};var T=!!globalThis.window,L=!!globalThis.WorkerGlobalScope,y=globalThis.
process?.versions?.node&&globalThis.process?.type!="renderer",k=L&&self.name?.startsWith("em-pthread");if(y){var $=require("worker_threads");
global.Worker=$.Worker,L=!$.isMainThread,k=L&&$.workerData=="em-pthread"}var C="./this.program",F=(e,r)=>{throw r},_=globalThis.
document?.currentScript?.src;typeof __filename<"u"?_=__filename:L&&(_=self.location.href);var G="";function Q(e){return c.
locateFile?c.locateFile(e,G):G+e}var B,h;if(y){var V=require("fs");G=__dirname+"/",h=e=>{e=de(e)?new URL(e):e;var r=V.readFileSync(
e);return r},B=async(e,r=!0)=>{e=de(e)?new URL(e):e;var t=V.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>
1&&(C=process.argv[1].replace(/\\/g,"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=c),F=(e,r)=>{throw process.
exitCode=e,r}}else if(T||L){try{G=new URL(".",_).href}catch{}y||(L&&(h=e=>{var r=new XMLHttpRequest;return r.open("GET",
e,!1),r.responseType="arraybuffer",r.send(null),new Uint8Array(r.response)}),B=async e=>{if(de(e))return new Promise((t,n)=>{
var o=new XMLHttpRequest;o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=()=>{if(o.status==200||o.status==0&&o.
response){t(o.response);return}n(o.status)},o.onerror=n,o.send(null)});var r=await fetch(e,{credentials:"same-origin"});
if(r.ok)return r.arrayBuffer();throw new Error(r.status+" : "+r.url)})}var M=console.log.bind(console),R=console.error.bind(
console);if(y){var X=require("util"),fe=e=>typeof e=="object"?X.inspect(e):e;M=(...e)=>V.writeSync(1,e.map(fe).join(" ")+
`
`),R=(...e)=>V.writeSync(2,e.map(fe).join(" ")+`
`)}var ce=M,ne=R,ae,se,ue=!1,re;function Fe(e,r){e||ge(r)}var de=e=>e.startsWith("file://");function l(){be.buffer!=J.buffer&&
ze()}if(y&&k){var Be=$.parentPort;Be.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>Be.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var Te;if(k){var W=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,n=t.
cmd;if(n==="load"){let o=[];self.onmessage=s=>o.push(s),Te=()=>{postMessage({cmd:"loaded"});for(let s of o)e(s);self.onmessage=
e};for(const s of t.handlers)(!c[s]||c[s].proxy)&&(c[s]=(...i)=>{postMessage({cmd:"callHandler",handler:s,args:i})},s=="\
print"&&(ce=c[s]),s=="printErr"&&(ne=c[s]));be=t.wasmMemory,ze(),se=t.wasmModule,Dr(),Ke()}else if(n==="run"){hn(t.pthread_ptr),
Ir(t.pthread_ptr,0,0,1,0,0),z.threadInitTLS(),_r(t.pthread_ptr),W||(W=!0);try{await Hr(t.start_routine,t.arg)}catch(o){if(o!=
"unwind")throw o}}else t.target==="setimmediate"||(n==="checkMailbox"?W&&He():n&&(ne(`worker: received unknown command ${n}`),
ne(t)))}catch(o){throw zt(),o}}self.onmessage=e}var J,oe,me,S,x,pe,ie,P,E,Gr=!1;function ze(){var e=be.buffer;J=new Int8Array(
e),me=new Int16Array(e),c.HEAPU8=oe=new Uint8Array(e),S=new Int32Array(e),x=new Uint32Array(e),pe=new Float32Array(e),ie=
new Float64Array(e),P=new BigInt64Array(e),E=new BigUint64Array(e)}function un(){if(!k){if(c.wasmMemory)be=c.wasmMemory;else{
var e=c.INITIAL_MEMORY||134217728;be=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}ze()}}function cn(){if(c.preRun)for(typeof c.preRun=="function"&&(c.preRun=[c.preRun]);c.preRun.length;)Wr(c.preRun.
shift());Lr(Mr)}function Cr(){if(Gr=!0,k)return Te();!c.noFSInit&&!a.initialized&&a.init(),Ne.__wasm_call_ctors(),a.ignorePermissions=
!1}function mn(){if(!k){if(c.postRun)for(typeof c.postRun=="function"&&(c.postRun=[c.postRun]);c.postRun.length;)vn(c.postRun.
shift());Lr(Pr)}}function ge(e){c.onAbort?.(e),e="Aborted("+e+")",ne(e),ue=!0,e+=". Build with -sASSERTIONS for more inf\
o.",Gr&&Yt();var r=new WebAssembly.RuntimeError(e);throw r}var tr;function fn(){return Q("wllama.wasm")}function dn(e){if(e==
tr&&ae)return new Uint8Array(ae);if(h)return h(e);throw"both async and sync fetching of the wasm failed"}async function pn(e){
if(!ae)try{var r=await B(e);return new Uint8Array(r)}catch{}return dn(e)}async function gn(e,r){try{var t=await pn(e),n=await WebAssembly.
instantiate(t,r);return n}catch(o){ne(`failed to asynchronously prepare wasm: ${o}`),ge(o)}}async function _n(e,r,t){if(!e&&
!de(r)&&!y)try{var n=fetch(r,{credentials:"same-origin"}),o=await WebAssembly.instantiateStreaming(n,t);return o}catch(s){
ne(`wasm streaming compile failed: ${s}`),ne("falling back to ArrayBuffer instantiation")}return gn(r,t)}function jr(){Ya(),
Ue.__instrumented||(Ue.__instrumented=!0,_e.instrumentWasmImports(Ue));var e={env:Ue,wasi_snapshot_preview1:Ue};return e}
async function Dr(){function e(i,u){return Ne=i.exports,Ne=_e.instrumentWasmExports(Ne),Ne=Xa(Ne),wn(Ne._emscripten_tls_init),
Ha(Ne),se=u,Je(),Ne}Pe();function r(i){return e(i.instance,i.module)}var t=jr();if(c.instantiateWasm)return new Promise(
(i,u)=>{c.instantiateWasm(t,(d,v)=>{i(e(d,v))})});if(k){var n=new WebAssembly.Instance(se,jr());return e(n,se)}tr??=fn();
var o=await _n(ae,tr,t),s=r(o);return s}class Rr{name="ExitStatus";constructor(r){this.message=`Program terminated with \
exit(${r})`,this.status=r}}var Ur=e=>{e.terminate(),e.onmessage=r=>{}},Or=e=>{var r=z.pthreads[e];z.returnWorkerToPool(r)},
Lr=e=>{for(;e.length>0;)e.shift()(c)},Mr=[],Wr=e=>Mr.push(e),Ae=0,Oe=null,Je=e=>{if(Ae--,c.monitorRunDependencies?.(Ae),
Ae==0&&Oe){var r=Oe;Oe=null,r()}},Pe=e=>{Ae++,c.monitorRunDependencies?.(Ae)},qr=e=>{var r=z.getNewWorker();if(!r)return 6;
z.runningWorkers.push(r),z.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,
arg:e.arg,pthread_ptr:e.pthread_ptr};return y&&r.unref(),r.postMessage(t,e.transferList),0},$e=0,nr=()=>ir||$e>0,he=()=>Zt(),
we=e=>Qt(e),ar=e=>Kt(e),te=(e,r,t,...n)=>{for(var o=n.length*2,s=he(),i=ar(o*8),u=i/8,d=0;d<n.length;d++){var v=n[d];typeof v==
"bigint"?((l(),P)[u+2*d]=1n,(l(),P)[u+2*d+1]=v):((l(),P)[u+2*d]=0n,(l(),ie)[u+2*d+1]=v)}var g=Jt(e,r,o,i,t);return we(s),
g};function Vr(e){if(k)return te(0,0,1,e);re=e,nr()||(z.terminateAllThreads(),c.onExit?.(e),ue=!0),F(e,new Rr(e))}function zr(e){
if(k)return te(1,0,0,e);or(e)}var Jr=(e,r)=>{if(re=e,k)throw zr(e),"unwind";Vr(e)},or=Jr,z={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){k||z.initMainThread()},initMainThread(){for(var e=c.pthreadPoolSize;e--;)z.allocateUnusedWorker();
Wr(async()=>{var r=z.loadWasmModuleToAllWorkers();Pe(),await r,Je()})},terminateAllThreads:()=>{for(var e of z.runningWorkers)
Ur(e);for(var e of z.unusedWorkers)Ur(e);z.unusedWorkers=[],z.runningWorkers=[],z.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete z.pthreads[r],z.unusedWorkers.push(e),z.runningWorkers.splice(z.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,Pt(r)},threadInitTLS(){z.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var i=s.
data,u=i.cmd;if(i.targetThread&&i.targetThread!=Qe()){var d=z.pthreads[i.targetThread];d?d.postMessage(i,i.transferList):
ne(`Internal error! Worker sent a message "${u}" to target pthread ${i.targetThread}, but that thread no longer exists!`);
return}u==="checkMailbox"?He():u==="spawnThread"?qr(i):u==="cleanupThread"?Ee(()=>Or(i.thread)):u==="loaded"?(e.loaded=!0,
y&&!e.pthread_ptr&&e.unref(),r(e)):i.target==="setimmediate"?e.postMessage(i):u==="uncaughtException"?e.onerror(i.error):
u==="callHandler"?c[i.handler](...i.args):u&&ne(`worker sent an unknown command ${u}`)},e.onerror=s=>{var i="worker sent\
 an error!";throw ne(`${i} ${s.filename}:${s.lineno}: ${s.message}`),s},y&&(e.on("message",s=>e.onmessage({data:s})),e.on(
"error",s=>e.onerror(s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var o of n)c.propertyIsEnumerable(o)&&t.
push(o);e.postMessage({cmd:"load",handlers:t,wasmMemory:be,wasmModule:se})}),async loadWasmModuleToAllWorkers(){return k?
void 0:Promise.all(z.unusedWorkers.map(z.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=_;c.mainScriptUrlOrBlob&&
(r=c.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new A(r,{workerData:"em-pthread",name:"em-pth\
read"}),z.unusedWorkers.push(e)},getNewWorker(){return z.unusedWorkers.length==0&&(z.allocateUnusedWorker(),z.loadWasmModuleToWorker(
z.unusedWorkers[0])),z.unusedWorkers.pop()}},Pr=[],vn=e=>Pr.push(e);function hn(e){var r=Number((l(),E)[(e+88)/8]),t=Number(
(l(),E)[(e+96)/8]),n=r-t;Xt(r,n),we(r)}var sr=[],$r=e=>{e=Number(e);var r=sr[e];return r||(sr[e]=r=en.get(BigInt(e)),_e.
isAsyncExport(r)&&(sr[e]=r=_e.makeAsyncFunction(r))),r},Hr=async(e,r)=>{$e=0,ir=0;var t=(o=>WebAssembly.promising($r(e)).
call(null,BigInt(o)))(r);function n(o){if(nr()){re=o;return}Fr(o)}t=await t,n(t)};Hr.isAsync=!0;var ir=!0,wn=e=>z.tlsInitFunctions.
push(e),be;function Yr(e,r,t,n){return k?te(2,0,1,e,r,t,n):Xr(e,r,t,n)}var bn=()=>!!globalThis.SharedArrayBuffer,yn=9007199254740992,
kn=-9007199254740992,p=e=>e<kn||e>yn?NaN:Number(e);function Xr(e,r,t,n){if(e=p(e),r=p(r),t=p(t),n=p(n),!bn())return 6;var o=[],
s=0;if(k&&(o.length===0||s))return Yr(e,r,t,n);var i={startRoutine:t,pthread_ptr:e,arg:n,transferList:o};return k?(i.cmd=
"spawnThread",postMessage(i,o),0):qr(i)}var Ce=()=>{var e=Number((l(),E)[Y.varargs/8]);return Y.varargs+=8,e},lr=()=>{var e=(l(),
S)[+Y.varargs/4];return Y.varargs+=4,e},H={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var o=e[n];o==="."?e.splice(n,1):o===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=H.isAbs(e),
t=e.slice(-1)==="/";return e=H.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=H.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>H.normalize(e.join("/")),join2:(e,r)=>H.normalize(e+"/"+r)},En=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),ur=e=>{(ur=En())(e)},je={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var o=n>=0?e[n]:a.cwd();if(typeof o!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!o)return"";r=o+"/"+r,t=H.isAbs(o)}return r=H.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=je.resolve(e).slice(1),r=je.resolve(r).slice(1);function t(v){for(var g=0;g<v.length&&v[g]==="";g++)
;for(var N=v.length-1;N>=0&&v[N]==="";N--);return g>N?[]:v.slice(g,N-g+1)}for(var n=t(e.split("/")),o=t(r.split("/")),s=Math.
min(n.length,o.length),i=s,u=0;u<s;u++)if(n[u]!==o[u]){i=u;break}for(var d=[],u=i;u<n.length;u++)d.push("..");return d=d.
concat(o.slice(i)),d.join("/")}},Qr=globalThis.TextDecoder&&new TextDecoder,Sn=(e,r,t,n)=>{for(var o=r+t;e[r]&&!(r>=o);)
++r;return r},De=(e,r=0,t,n)=>{var o=Sn(e,r,t);if(o-r>16&&e.buffer&&Qr)return Qr.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,o):e.slice(r,o));for(var s="";r<o;){var i=e[r++];if(!(i&128)){s+=String.fromCharCode(i);continue}var u=e[r++]&
63;if((i&224)==192){s+=String.fromCharCode((i&31)<<6|u);continue}var d=e[r++]&63;if((i&240)==224?i=(i&15)<<12|u<<6|d:i=(i&
7)<<18|u<<12|d<<6|e[r++]&63,i<65536)s+=String.fromCharCode(i);else{var v=i-65536;s+=String.fromCharCode(55296|v>>10,56320|
v&1023)}}return s},cr=[],ye=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},Kr=(e,r,t,n)=>{if(!(n>0))return 0;for(var o=t,s=t+n-1,i=0;i<e.length;++i){var u=e.codePointAt(
i);if(u<=127){if(t>=s)break;r[t++]=u}else if(u<=2047){if(t+1>=s)break;r[t++]=192|u>>6,r[t++]=128|u&63}else if(u<=65535){
if(t+2>=s)break;r[t++]=224|u>>12,r[t++]=128|u>>6&63,r[t++]=128|u&63}else{if(t+3>=s)break;r[t++]=240|u>>18,r[t++]=128|u>>
12&63,r[t++]=128|u>>6&63,r[t++]=128|u&63,i++}}return r[t]=0,t-o},mr=(e,r,t)=>{var n=ye(e)+1,o=new Array(n),s=Kr(e,o,0,o.
length);return o.length=s,o},Nn=()=>{if(!cr.length){var e=null;if(y){var r=256,t=Buffer.alloc(r),n=0,o=process.stdin.fd;
try{n=V.readSync(o,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("utf-8"))}else
globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;cr=mr(e)}return cr.shift()},Ge={ttys:[],init(){},shutdown(){},register(e,r){Ge.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Ge.stream_ops)},stream_ops:{open(e){var r=Ge.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,o){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,i=0;i<n;i++){var u;try{u=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(u===void 0&&s===0)throw new a.ErrnoError(6);if(u==null)break;s++,r[t+i]=u}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,o){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return Nn()},put_char(e,r){r===null||r===10?(ce(De(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(ce(De(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(ne(De(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(ne(De(e.output)),e.output=[])}}},xn=(e,r)=>(l(),oe).fill(0,e,e+r),Zr=(e,r)=>Math.ceil(e/r)*r,fr=e=>{
e=Zr(e,65536);var r=Vt(65536,e);return r&&xn(r,e),r},j={ops_table:null,mount(e){return j.createNode(null,"/",16895,0)},createNode(e,r,t,n){
if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(63);j.ops_table||={dir:{node:{getattr:j.node_ops.getattr,setattr:j.
node_ops.setattr,lookup:j.node_ops.lookup,mknod:j.node_ops.mknod,rename:j.node_ops.rename,unlink:j.node_ops.unlink,rmdir:j.
node_ops.rmdir,readdir:j.node_ops.readdir,symlink:j.node_ops.symlink},stream:{llseek:j.stream_ops.llseek}},file:{node:{getattr:j.
node_ops.getattr,setattr:j.node_ops.setattr},stream:{llseek:j.stream_ops.llseek,read:j.stream_ops.read,write:j.stream_ops.
write,mmap:j.stream_ops.mmap,msync:j.stream_ops.msync}},link:{node:{getattr:j.node_ops.getattr,setattr:j.node_ops.setattr,
readlink:j.node_ops.readlink},stream:{}},chrdev:{node:{getattr:j.node_ops.getattr,setattr:j.node_ops.setattr},stream:a.chrdev_stream_ops}};
var o=a.createNode(e,r,t,n);return a.isDir(o.mode)?(o.node_ops=j.ops_table.dir.node,o.stream_ops=j.ops_table.dir.stream,
o.contents={}):a.isFile(o.mode)?(o.node_ops=j.ops_table.file.node,o.stream_ops=j.ops_table.file.stream,o.usedBytes=0,o.contents=
null):a.isLink(o.mode)?(o.node_ops=j.ops_table.link.node,o.stream_ops=j.ops_table.link.stream):a.isChrdev(o.mode)&&(o.node_ops=
j.ops_table.chrdev.node,o.stream_ops=j.ops_table.chrdev.stream),o.atime=o.mtime=o.ctime=Date.now(),e&&(e.contents[r]=o,e.
atime=e.mtime=e.ctime=o.atime),o},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var n=1024*1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var o=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(o.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&j.resizeFileStorage(e,r.size)},lookup(e,r){throw j.doesNotExistError||(j.doesNotExistError=new a.ErrnoError(44),
j.doesNotExistError.stack="<generic error, no stack>"),j.doesNotExistError},mknod(e,r,t,n){return j.createNode(e,r,t,n)},
rename(e,r,t){var n;try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var o in n.contents)throw new a.ErrnoError(
55);a.hashRemoveNode(n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.
contents)throw new a.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var n=j.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,n,o){var s=e.node.contents;if(o>=e.node.usedBytes)return 0;var i=Math.
min(e.node.usedBytes-o,n);if(i>8&&s.subarray)r.set(s.subarray(o,o+i),t);else for(var u=0;u<i;u++)r[t+u]=s[o+u];return i},
write(e,r,t,n,o,s){if(r.buffer===(l(),J).buffer&&(s=!1),!n)return 0;var i=e.node;if(i.mtime=i.ctime=Date.now(),r.subarray&&
(!i.contents||i.contents.subarray)){if(s)return i.contents=r.subarray(t,t+n),i.usedBytes=n,n;if(i.usedBytes===0&&o===0)return i.
contents=r.slice(t,t+n),i.usedBytes=n,n;if(o+n<=i.usedBytes)return i.contents.set(r.subarray(t,t+n),o),n}if(j.expandFileStorage(
i,o+n),i.contents.subarray&&r.subarray)i.contents.set(r.subarray(t,t+n),o);else for(var u=0;u<n;u++)i.contents[o+u]=r[t+
u];return i.usedBytes=Math.max(i.usedBytes,o+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,o){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,i,u=e.node.contents;if(!(o&2)&&u&&u.buffer===(l(),J).buffer)i=!1,s=u.byteOffset;else{if(i=!0,s=fr(r),!s)throw new a.
ErrnoError(48);u&&((t>0||t+r<u.length)&&(u.subarray?u=u.subarray(t,t+r):u=Array.prototype.slice.call(u,t,t+r)),(l(),J).set(
u,s))}return{ptr:s,allocated:i}},msync(e,r,t,n,o){return j.stream_ops.write(e,r,0,n,t,!1),0}}},In=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},dr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},Fn=async e=>{var r=await B(e);return new Uint8Array(r)},et=(...e)=>a.createDataFile(
...e),rt=[],Bn=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of rt)if(t.canHandle(r))return t.handle(e,r);return e},
pr=async(e,r,t,n,o,s,i,u)=>{var d=r?je.resolve(H.join2(e,r)):e;Pe();try{var v=t;typeof t=="string"&&(v=await Fn(t)),v=await Bn(
v,d),u?.(),s||et(e,r,v,n,o,i)}finally{Je()}},Tn=(e,r,t,n,o,s,i,u,d,v)=>{pr(e,r,t,n,o,u,d,v).then(s).catch(i)},a={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,n){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=t,this.rdev=n,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new a.ErrnoError(44);r.follow_mount??=!0,H.isAbs(e)||(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split(
"/").filter(v=>!!v),o=a.root,s="/",i=0;i<n.length;i++){var u=i===n.length-1;if(u&&r.parent)break;if(n[i]!=="."){if(n[i]===
".."){if(s=H.dirname(s),a.isRoot(o)){e=s+"/"+n.slice(i+1).join("/"),t--;continue e}else o=o.parent;continue}s=H.join2(s,
n[i]);try{o=a.lookupNode(o,n[i])}catch(v){if(v?.errno===44&&u&&r.noent_okay)return{path:s};throw v}if(a.isMountpoint(o)&&
(!u||r.follow_mount)&&(o=o.mounted.root),a.isLink(o.mode)&&(!u||r.follow)){if(!o.node_ops.readlink)throw new a.ErrnoError(
52);var d=o.node_ops.readlink(o);H.isAbs(d)||(d=H.dirname(s)+"/"+d),e=d+"/"+n.slice(i+1).join("/");continue e}}}return{path:s,
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
typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&ne(`warning: ${a.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function o(u){return a.syncFSRequests--,
r(u)}function s(u){if(u)return s.errored?void 0:(s.errored=!0,o(u));++n>=t.length&&o(null)}for(var i of t)i.type.syncfs?
i.type.syncfs(i,e,s):s(null)},mount(e,r,t){var n=t==="/",o=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&!o){var i=a.
lookupPath(t,{follow_mount:!1});if(t=i.path,s=i.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(s.mode))throw new a.
ErrnoError(54)}var u={type:e,opts:r,mountpoint:t,mounts:[]},d=e.mount(u);return d.mount=u,u.root=d,n?a.root=d:s&&(s.mounted=
u,s.mount&&s.mount.mounts.push(u)),d},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(r.node))throw new a.
ErrnoError(28);var t=r.node,n=t.mounted,o=a.getMounts(n);for(var[s,i]of Object.entries(a.nameTable))for(;i;){var u=i.name_next;
o.includes(i.mount)&&a.destroyNode(i),i=u}t.mounted=null;var d=t.mount.mounts.indexOf(n);t.mount.mounts.splice(d,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),o=n.node,s=H.basename(e);if(!s)throw new a.
ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var i=a.mayCreate(o,s);if(i)throw new a.ErrnoError(i);if(!o.
node_ops.mknod)throw new a.ErrnoError(63);return o.node_ops.mknod(o,s,r,t)},statfs(e){return a.statfsNode(a.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var o of t)if(o){(n||H.isAbs(e))&&(n+=
"/"),n+=o;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,a.mknod(
e,r,t)},symlink(e,r){if(!je.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),n=t.node;if(!n)throw new a.
ErrnoError(44);var o=H.basename(r),s=a.mayCreate(n,o);if(s)throw new a.ErrnoError(s);if(!n.node_ops.symlink)throw new a.
ErrnoError(63);return n.node_ops.symlink(n,o,e)},rename(e,r){var t=H.dirname(e),n=H.dirname(r),o=H.basename(e),s=H.basename(
r),i,u,d;if(i=a.lookupPath(e,{parent:!0}),u=i.node,i=a.lookupPath(r,{parent:!0}),d=i.node,!u||!d)throw new a.ErrnoError(
44);if(u.mount!==d.mount)throw new a.ErrnoError(75);var v=a.lookupNode(u,o),g=je.relative(e,n);if(g.charAt(0)!==".")throw new a.
ErrnoError(28);if(g=je.relative(r,t),g.charAt(0)!==".")throw new a.ErrnoError(55);var N;try{N=a.lookupNode(d,s)}catch{}if(v!==
N){var b=a.isDir(v.mode),I=a.mayDelete(u,o,b);if(I)throw new a.ErrnoError(I);if(I=N?a.mayDelete(d,s,b):a.mayCreate(d,s),
I)throw new a.ErrnoError(I);if(!u.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(v)||N&&a.isMountpoint(N))
throw new a.ErrnoError(10);if(d!==u&&(I=a.nodePermissions(u,"w"),I))throw new a.ErrnoError(I);a.hashRemoveNode(v);try{u.
node_ops.rename(v,d,s),v.parent=d}catch(U){throw U}finally{a.hashAddNode(v)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=H.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(o)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=H.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
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
In(r):r,r&64?t=t&4095|32768:t=0;var n,o;if(typeof e=="object")n=e;else{o=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
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
ary"&&ge(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),o=n.size,s=new Uint8Array(o);return a.
read(t,s,0,o,0),r.encoding==="utf8"&&(s=De(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(mr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
ge("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,o,s,i,u)=>i,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Ge.register(a.makedev(5,0),Ge.default_tty_ops),Ge.register(a.makedev(6,0),Ge.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(ur(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:j.stream_ops.llseek},r.node_ops={lookup(t,n){var o=+n,
s=a.getStreamChecked(o),i={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:o+1};return i.parent=
i,i},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(j,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:j}},init(e,r,t){a.initialized=!0,e??=c.stdin,r??=c.stdout,t??=c.stderr,a.createStandardStreams(e,r,t)},quit(){a.initialized=
!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=!0,n.parentPath=
t.path,n.parentObject=t.node,n.name=H.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,n.object=t.node,
n.name=t.node.name,n.isRoot=t.path==="/"}catch(o){n.error=o.errno}return n},createPath(e,r,t,n){e=typeof e=="string"?e:a.
getPath(e);for(var o=r.split("/").reverse();o.length;){var s=o.pop();if(s){var i=H.join2(e,s);try{a.mkdir(i)}catch(u){if(u.
errno!=20)throw u}e=i}}return i},createFile(e,r,t,n,o){var s=H.join2(typeof e=="string"?e:a.getPath(e),r),i=dr(n,o);return a.
create(s,i)},createDataFile(e,r,t,n,o,s){var i=r;e&&(e=typeof e=="string"?e:a.getPath(e),i=r?H.join2(e,r):e);var u=dr(n,
o),d=a.create(i,u);if(t){if(typeof t=="string"){for(var v=new Array(t.length),g=0,N=t.length;g<N;++g)v[g]=t.charCodeAt(g);
t=v}a.chmod(d,u|146);var b=a.open(d,577);a.write(b,t,0,t.length,0,s),a.close(b),a.chmod(d,u)}},createDevice(e,r,t,n){var o=H.
join2(typeof e=="string"?e:a.getPath(e),r),s=dr(!!t,!!n);a.createDevice.major??=64;var i=a.makedev(a.createDevice.major++,
0);return a.registerDevice(i,{open(u){u.seekable=!1},close(u){n?.buffer?.length&&n(10)},read(u,d,v,g,N){for(var b=0,I=0;I<
g;I++){var U;try{U=t()}catch{throw new a.ErrnoError(29)}if(U===void 0&&b===0)throw new a.ErrnoError(6);if(U==null)break;
b++,d[v+I]=U}return b&&(u.node.atime=Date.now()),b},write(u,d,v,g,N){for(var b=0;b<g;b++)try{n(d[v+b])}catch{throw new a.
ErrnoError(29)}return g&&(u.node.mtime=u.node.ctime=Date.now()),b}}),a.mkdev(o,s,i)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)ge("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=h(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,o){class s{lengthKnown=!1;chunks=[];get(b){
if(!(b>this.length-1||b<0)){var I=b%this.chunkSize,U=b/this.chunkSize|0;return this.getter(U)[I]}}setDataGetter(b){this.
getter=b}cacheLength(){var b=new XMLHttpRequest;b.open("HEAD",t,!1),b.send(null),b.status>=200&&b.status<300||b.status===
304||ge("Couldn't load "+t+". Status: "+b.status);var I=Number(b.getResponseHeader("Content-length")),U,D=(U=b.getResponseHeader(
"Accept-Ranges"))&&U==="bytes",f=(U=b.getResponseHeader("Content-Encoding"))&&U==="gzip",O=1024*1024;D||(O=I);var q=(le,ve)=>{
le>ve&&ge("invalid range ("+le+", "+ve+") or no bytes requested!"),ve>I-1&&ge("only "+I+" bytes available! programmer er\
ror!");var Z=new XMLHttpRequest;return Z.open("GET",t,!1),I!==O&&Z.setRequestHeader("Range","bytes="+le+"-"+ve),Z.responseType=
"arraybuffer",Z.overrideMimeType&&Z.overrideMimeType("text/plain; charset=x-user-defined"),Z.send(null),Z.status>=200&&Z.
status<300||Z.status===304||ge("Couldn't load "+t+". Status: "+Z.status),Z.response!==void 0?new Uint8Array(Z.response||
[]):mr(Z.responseText||"")},K=this;K.setDataGetter(le=>{var ve=le*O,Z=(le+1)*O-1;return Z=Math.min(Z,I-1),typeof K.chunks[le]>
"u"&&(K.chunks[le]=q(ve,Z)),typeof K.chunks[le]>"u"&&ge("doXHR failed!"),K.chunks[le]}),(f||!I)&&(O=I=1,I=this.getter(0).
length,O=I,ce("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=I,this._chunkSize=
O,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){L||ge("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var i=new s,u={isDevice:!1,contents:i}}else
var u={isDevice:!1,url:t};var d=a.createFile(e,r,u,n,o);u.contents?d.contents=u.contents:u.url&&(d.contents=null,d.url=u.
url),Object.defineProperties(d,{usedBytes:{get:function(){return this.contents.length}}});var v={};for(const[N,b]of Object.
entries(d.stream_ops))v[N]=(...I)=>(a.forceLoadFile(d),b(...I));function g(N,b,I,U,D){var f=N.node.contents;if(D>=f.length)
return 0;var O=Math.min(f.length-D,U);if(f.slice)for(var q=0;q<O;q++)b[I+q]=f[D+q];else for(var q=0;q<O;q++)b[I+q]=f.get(
D+q);return O}return v.read=(N,b,I,U,D)=>(a.forceLoadFile(d),g(N,b,I,U,D)),v.mmap=(N,b,I,U,D)=>{a.forceLoadFile(d);var f=fr(
b);if(!f)throw new a.ErrnoError(48);return g(N,(l(),J),f,b,I),{ptr:f,allocated:!0}},d.stream_ops=v,d}},Le=(e,r,t)=>e?De(
(l(),oe),e,r):"",Y={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(H.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var o=Y.
getStreamFromFD(e);n=o.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
x)[e/4]=r.dev,(l(),x)[(e+4)/4]=r.mode,(l(),E)[(e+8)/8]=BigInt(r.nlink),(l(),x)[(e+16)/4]=r.uid,(l(),x)[(e+20)/4]=r.gid,(l(),
x)[(e+24)/4]=r.rdev,(l(),P)[(e+32)/8]=BigInt(r.size),(l(),S)[(e+40)/4]=4096,(l(),S)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),o=r.ctime.getTime();return(l(),P)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),E)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),P)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),E)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),P)[(e+80)/8]=BigInt(Math.
floor(o/1e3)),(l(),E)[(e+88)/8]=BigInt(o%1e3*1e3*1e3),(l(),P)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),x)[(e+8)/
4]=r.bsize,(l(),x)[(e+72)/4]=r.bsize,(l(),P)[(e+16)/8]=BigInt(r.blocks),(l(),P)[(e+24)/8]=BigInt(r.bfree),(l(),P)[(e+32)/
8]=BigInt(r.bavail),(l(),P)[(e+40)/8]=BigInt(r.files),(l(),P)[(e+48)/8]=BigInt(r.ffree),(l(),x)[(e+56)/4]=r.fsid,(l(),x)[(e+
80)/4]=r.flags,(l(),x)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,o){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var s=(l(),oe).slice(e,e+t);a.msync(r,s,o,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Le(e);return r}};function tt(e,r,t){if(k)return te(3,0,1,e,r,t);t=p(t),Y.varargs=t;try{var n=Y.getStreamFromFD(
e);switch(r){case 0:{var o=lr();if(o<0)return-28;for(;a.streams[o];)o++;var s;return s=a.dupStream(n,o),s.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var o=lr();return n.flags|=o,0}case 5:{var o=Ce(),i=0;return(l(),me)[(o+i)/2]=2,0}case 6:case 7:
return 0}return-28}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}function An(e,r){if(k)return te(
4,0,1,e,r);r=p(r);try{return Y.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var ke=(e,r,t)=>Kr(e,(l(),oe),r,t);function nt(e,r){if(k)return te(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=a.cwd(),n=ye(t)+1;return r<n?-68:(ke(t,e,r),n)}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}
function at(e,r,t){if(k)return te(6,0,1,e,r,t);r=p(r),t=p(t);try{var n=Y.getStreamFromFD(e);n.getdents||=a.readdir(n.path);
for(var o=280,s=0,i=a.llseek(n,0,1),u=Math.floor(i/o),d=Math.min(n.getdents.length,u+Math.floor(t/o)),v=u;v<d;v++){var g,
N,b=n.getdents[v];if(b===".")g=n.node.id,N=4;else if(b===".."){var I=a.lookupPath(n.path,{parent:!0});g=I.node.id,N=4}else{
var U;try{U=a.lookupNode(n.node,b)}catch(D){if(D?.errno===28)continue;throw D}g=U.id,N=a.isChrdev(U.mode)?2:a.isDir(U.mode)?
4:a.isLink(U.mode)?10:8}(l(),P)[(r+s)/8]=BigInt(g),(l(),P)[(r+s+8)/8]=BigInt((v+1)*o),(l(),me)[(r+s+16)/2]=280,(l(),J)[r+
s+18]=N,ke(b,r+s+19,256),s+=o}return a.llseek(n,v*o,0),s}catch(D){if(typeof a>"u"||D.name!=="ErrnoError")throw D;return-D.
errno}}function ot(e,r,t){if(k)return te(7,0,1,e,r,t);t=p(t),Y.varargs=t;try{var n=Y.getStreamFromFD(e);switch(r){case 21509:
return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var o=n.tty.ops.ioctl_tcgets(n),s=Ce();(l(),
S)[s/4]=o.c_iflag||0,(l(),S)[(s+4)/4]=o.c_oflag||0,(l(),S)[(s+8)/4]=o.c_cflag||0,(l(),S)[(s+12)/4]=o.c_lflag||0;for(var i=0;i<
32;i++)(l(),J)[s+i+17]=o.c_cc[i]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=Ce(),u=(l(),S)[s/4],d=(l(),S)[(s+4)/4],v=(l(),S)[(s+8)/4],g=(l(),
S)[(s+12)/4],N=[],i=0;i<32;i++)N.push((l(),J)[s+i+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:u,c_oflag:d,c_cflag:v,
c_lflag:g,c_cc:N})}return 0}case 21519:{if(!n.tty)return-59;var s=Ce();return(l(),S)[s/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var s=Ce();return a.ioctl(n,r,s)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var b=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=Ce();(l(),me)[s/2]=b[0],(l(),me)[(s+2)/2]=b[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(I){if(typeof a>"u"||I.name!=="ErrnoError")throw I;return-I.
errno}}function Gn(e,r){if(k)return te(8,0,1,e,r);e=p(e),r=p(r);try{return e=Y.getStr(e),Y.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function Cn(e,r,t,n){if(k)return te(9,0,1,e,r,t,n);r=p(r),
t=p(t);try{r=Y.getStr(r);var o=n&256,s=n&4096;return n=n&-6401,r=Y.calculateAt(e,r,s),Y.writeStat(t,o?a.lstat(r):a.stat(
r))}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}function st(e,r,t,n){if(k)return te(10,0,1,e,
r,t,n);r=p(r),n=p(n),Y.varargs=n;try{r=Y.getStr(r),r=Y.calculateAt(e,r);var o=n?lr():0;return a.open(r,t,o).fd}catch(s){
if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function it(e,r){if(k)return te(11,0,1,e,r);e=p(e),r=p(r);
try{return e=Y.getStr(e),Y.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var jn=()=>ge("");function Dn(e){e=p(e),Ir(e,!L,1,!T,5242880,!1),z.threadInitTLS()}var gr=e=>{if(e instanceof Rr||e=="un\
wind")return re;F(1,e)},Rn=()=>{if(!nr())try{if(k){Qe()&&Fr(re);return}or(re)}catch(e){gr(e)}},Ee=e=>{if(!ue)try{e(),Rn()}catch(r){
gr(r)}};function _r(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),S),e/4,e);r.value.then(He);var t=e+228;
Atomics.store((l(),S),t/4,1)}}var He=()=>Ee(()=>{var e=Qe();e&&(_r(e),$t())});function Un(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
He);else if(k)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=z.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var Ye=[];function On(e,r,t,n,o){t=p(t),o=p(o),n/=2,Ye.length=n;for(var s=o/8,i=0;i<n;i++)(l(),P)[s+2*i]?
Ye[i]=(l(),P)[s+2*i+1]:Ye[i]=(l(),ie)[s+2*i+1];var u=$a[e];z.currentProxiedOperationCallerThread=t;var d=u(...Ye);return z.
currentProxiedOperationCallerThread=0,typeof d=="bigint"&&(d=p(d)),d}function Ln(e){e=p(e),k?postMessage({cmd:"cleanupTh\
read",thread:e}):Or(e)}function Mn(e){e=p(e),y&&z.pthreads[e].ref()}var Wn=e=>e%4===0&&(e%100!==0||e%400===0),qn=[0,31,60,
91,121,152,182,213,244,274,305,335],Vn=[0,31,59,90,120,151,181,212,243,273,304,334],zn=e=>{var r=Wn(e.getFullYear()),t=r?
qn:Vn,n=t[e.getMonth()]+e.getDate()-1;return n};function Jn(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(l(),S)[r/4]=t.getSeconds(),
(l(),S)[(r+4)/4]=t.getMinutes(),(l(),S)[(r+8)/4]=t.getHours(),(l(),S)[(r+12)/4]=t.getDate(),(l(),S)[(r+16)/4]=t.getMonth(),
(l(),S)[(r+20)/4]=t.getFullYear()-1900,(l(),S)[(r+24)/4]=t.getDay();var n=zn(t)|0;(l(),S)[(r+28)/4]=n,(l(),P)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var o=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
i=o.getTimezoneOffset(),u=(s!=i&&t.getTimezoneOffset()==Math.min(i,s))|0;(l(),S)[(r+32)/4]=u}function lt(e,r,t,n,o,s,i){
if(k)return te(12,0,1,e,r,t,n,o,s,i);e=p(e),o=p(o),s=p(s),i=p(i);try{var u=Y.getStreamFromFD(n),d=a.mmap(u,e,o,r,t),v=d.
ptr;return(l(),S)[s/4]=d.allocated,(l(),E)[i/8]=BigInt(v),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function ut(e,r,t,n,o,s){if(k)return te(13,0,1,e,r,t,n,o,s);e=p(e),r=p(r),s=p(s);try{var i=Y.getStreamFromFD(o);t&
2&&Y.doMsync(e,i,r,n,s)}catch(u){if(typeof a>"u"||u.name!=="ErrnoError")throw u;return-u.errno}}var Pn=function(e,r,t,n){
e=p(e),r=p(r),t=p(t),n=p(n);var o=new Date().getFullYear(),s=new Date(o,0,1),i=new Date(o,6,1),u=s.getTimezoneOffset(),d=i.
getTimezoneOffset(),v=Math.max(u,d);(l(),E)[e/8]=BigInt(v*60),(l(),S)[r/4]=+(u!=d);var g=I=>{var U=I>=0?"-":"+",D=Math.abs(
I),f=String(Math.floor(D/60)).padStart(2,"0"),O=String(D%60).padStart(2,"0");return`UTC${U}${f}${O}`},N=g(u),b=g(d);d<u?
(ke(N,t,17),ke(b,n,17)):(ke(N,n,17),ke(b,t,17))},ct=()=>performance.timeOrigin+performance.now(),mt=()=>Date.now(),$n=e=>e>=
0&&e<=3;function Hn(e,r,t){if(t=p(t),!$n(e))return 28;var n;e===0?n=mt():n=ct();var o=Math.round(n*1e3*1e3);return(l(),P)[t/
8]=BigInt(o),0}var Yn=()=>{},Re=()=>{$e+=1},Xn=()=>{throw Re(),"unwind"},Qn=()=>new Error().stack.toString(),Kn=e=>{var r=Qn(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),o=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var i="",u="",d=0,v=0,g=o.exec(s);if(g?.length==5)i=g[1],u=g[2],d=g[3],v=g[4];else if(g=n.exec(s),g?.length>=4)i=g[1],u=
g[2],d=g[3],v=g[4]|0;else{r+=s+`
`;continue}if(i=="_emscripten_log"||i=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(u=u.substring(u.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${i} (${u}:${d}:${v})
`)}return r=r.replace(/\s+$/,""),r};function Zn(e,r,t){r=p(r);var n=Kn(e);if(!r||t<=0)return ye(n)+1;var o=ke(n,r,t);return o+
1}var ft=()=>4294967296,ea=()=>BigInt(ft()),ra=()=>2,ta=()=>y?require("os").cpus().length:navigator.hardwareConcurrency,
na=e=>{var r=be.buffer.byteLength,t=(e-r+65535)/65536|0;try{return be.grow(BigInt(t)),ze(),1}catch{}};function aa(e){e=p(
e);var r=(l(),oe).length;if(e<=r)return!1;var t=ft();if(e>t)return!1;for(var n=1;n<=4;n*=2){var o=r*(1+.2/n);o=Math.min(
o,e+100663296);var s=Math.min(t,Zr(Math.max(e,o),65536)),i=na(s);if(i)return!0}return!1}var Se=e=>{var r=ye(e)+1,t=ar(r);
return ke(e,t,r),t},oa=(e,r)=>{(l(),x)[e/4]=r;var t=(l(),x)[e/4];(l(),x)[(e+4)/4]=(r-t)/4294967296},sa=e=>{var r=ye(e)+1,
t=St(r);return t&&ke(e,t,r),t},xe=e=>(l(),x)[e/4]+(l(),S)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
m.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Ut(r);return m.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=vr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=hr(r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{Fe(e.mapState==="unmapped");var t=Ot(r);return m.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=wr(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=br(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=yr(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=kr(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Er(
r),n=Lt(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),c.peercomputeOnDevice?.(e),n},
importJsExternalTexture:(e,r=0)=>{var t=xt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=It(
r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Ft(r);return m.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Er(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Bt(r);return m.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=Tt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=At(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=Gt(r);return m.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=Ct(r);return m.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=Mt(
r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=jt(r);return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=Dt(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=Rt(r);return m.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,n)=>{var o=he(),s=Se(t);((i,u,d)=>$r(e).call(null,i,BigInt(u),BigInt(d)))(r,BigInt(s),n),we(o)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),E)[e/8]);t;t=Number((l(),E)[t/8])){var n=(l(),S)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{
(l(),E)[e/8]=BigInt(r),(l(),E)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),E)[e/8]),t=Number((l(),
E)[(e+8)/8]);return Le(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),E)[e/8]),t=Number((l(),E)[(e+8)/8]);
return r?Le(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),ie)[e/8],g:(l(),ie)[(e+8)/8],b:(l(),ie)[(e+16)/8],a:(l(),ie)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),x)[e/4],height:(l(),x)[(e+4)/4],depthOrArrayLayers:(l(),x)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),x)[e/4],y:(l(),x)[(e+4)/4],z:(l(),x)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.getJsObject(Number((l(),E)[e/
8])),mipLevel:(l(),x)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),S)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),x)[(e+8)/4],t=(l(),x)[(e+12)/4];return{offset:xe(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.buffer=m.getJsObject(Number((l(),
E)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number((l(),E)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
x)[(e+16)/4],endOfPassWriteIndex:(l(),x)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},n=0;n<e;++n){var o=r+
32*n,s=m.makeStringFromStringView(o+8);t[s]=(l(),ie)[(o+24)/8]}return t}},makePipelineLayout:e=>e?m.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),E)[(e+8)/8])),constants:m.makePipelineConstants(Number(
(l(),E)[(e+32)/8]),Number((l(),E)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),E)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(f){if(f)return{topology:m.PrimitiveTopology[(l(),S)[(f+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),S)[(f+12)/4]],frontFace:m.FrontFace[(l(),S)[(f+16)/4]],cullMode:m.CullMode[(l(),S)[(f+20)/4]],unclippedDepth:!!(l(),
x)[(f+24)/4]}}function t(f){if(f)return{operation:m.BlendOperation[(l(),S)[f/4]],srcFactor:m.BlendFactor[(l(),S)[(f+4)/4]],
dstFactor:m.BlendFactor[(l(),S)[(f+8)/4]]}}function n(f){if(f)return{alpha:t(f+12),color:t(f+0)}}function o(f){var O=m.TextureFormat[(l(),
S)[(f+8)/4]];return O?{format:O,blend:n(Number((l(),E)[(f+16)/8])),writeMask:(l(),x)[(f+24)/4]}:void 0}function s(f,O){for(var q=[],
K=0;K<f;++K)q.push(o(O+32*K));return q}function i(f){return{compare:m.CompareFunction[(l(),S)[f/4]],failOp:m.StencilOperation[(l(),
S)[(f+4)/4]],depthFailOp:m.StencilOperation[(l(),S)[(f+8)/4]],passOp:m.StencilOperation[(l(),S)[(f+12)/4]]}}function u(f){
if(f)return{format:m.TextureFormat[(l(),S)[(f+8)/4]],depthWriteEnabled:!!(l(),x)[(f+12)/4],depthCompare:m.CompareFunction[(l(),
S)[(f+16)/4]],stencilFront:i(f+20),stencilBack:i(f+36),stencilReadMask:(l(),x)[(f+52)/4],stencilWriteMask:(l(),x)[(f+56)/
4],depthBias:(l(),S)[(f+60)/4],depthBiasSlopeScale:(l(),pe)[(f+64)/4],depthBiasClamp:(l(),pe)[(f+68)/4]}}function d(f){return{
format:m.VertexFormat[(l(),S)[(f+8)/4]],offset:xe(f+16),shaderLocation:(l(),x)[(f+24)/4]}}function v(f,O){for(var q=[],K=0;K<
f;++K)q.push(d(O+K*32));return q}function g(f){if(f){var O=m.VertexStepMode[(l(),S)[(f+8)/4]],q=Number((l(),E)[(f+24)/8]);
return!O&&!q?null:{arrayStride:xe(f+16),stepMode:O,attributes:v(q,Number((l(),E)[(f+32)/8]))}}}function N(f,O){if(f){for(var q=[],
K=0;K<f;++K)q.push(g(O+K*40));return q}}function b(f){if(f){var O={module:m.getJsObject(Number((l(),E)[(f+8)/8])),constants:m.
makePipelineConstants(Number((l(),E)[(f+32)/8]),Number((l(),E)[(f+40)/8])),buffers:N(Number((l(),E)[(f+48)/8]),Number((l(),
E)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return O}}function I(f){if(f)return{count:(l(),x)[(f+
8)/4],mask:(l(),x)[(f+12)/4],alphaToCoverageEnabled:!!(l(),x)[(f+16)/4]}}function U(f){if(f){var O={module:m.getJsObject(
Number((l(),E)[(f+8)/8])),constants:m.makePipelineConstants(Number((l(),E)[(f+32)/8]),Number((l(),E)[(f+40)/8])),targets:s(
Number((l(),E)[(f+48)/8]),Number((l(),E)[(f+56)/8])),entryPoint:m.makeStringFromOptionalStringView(f+16)};return O}}var D={
label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),E)[(e+24)/8])),vertex:b(e+32),primitive:r(
e+96),depthStencil:u(Number((l(),E)[(e+128)/8])),multisample:I(e+136),fragment:U(Number((l(),E)[(e+160)/8]))};return D},
fillLimitStruct:(e,r)=>{var t=Number((l(),E)[r/8]);function n(i,u,d,v=0){var g=e[i]??v;(l(),x)[(u+d)/4]=g}function o(i,u,d,v=0){
var g=e[i]??v;oa(u+d,g)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("maxTextureDimension3D",r,16),
n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),n("maxBindingsPerBindGr\
oup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipelineLayout",r,40),n("ma\
xSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPerShaderStage",r,52),n("m\
axStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBufferOffsetAlignment",r,80),
n("minStorageBufferOffsetAlignment",r,84),o("maxUniformBufferBindingSize",r,64),o("maxStorageBufferBindingSize",r,72),n(
"maxVertexBuffers",r,88),o("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBufferArrayStride",r,108),n(
"maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentBytesPerSample",r,120),n("maxC\
omputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeWorkgroupSizeX",r,132),n("m\
axComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPerDimension",r,144),n("maxIm\
mediateSize",r,148),t!==0){(l(),S)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.maxStorageBuffersPerShaderStage),
n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStorageTexturesInVertexStage",s,20,e.
maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(l(),x)[(r+88)/4]=e.subgroupMinSize,(l(),x)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
n=sa(t),o=ye(e.vendor);m.setStringView(r+8,n,o),n+=o;var s=ye(e.architecture);m.setStringView(r+24,n,s),n+=s;var i=ye(e.
device);m.setStringView(r+40,n,i),n+=i;var u=ye(e.description);m.setStringView(r+56,n,u),n+=u,(l(),S)[(r+72)/4]=2;var d=e.
isFallbackAdapter?3:4;(l(),S)[(r+76)/4]=d,(l(),x)[(r+80)/4]=0,(l(),x)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},ia={undefined:1,unknown:1,destroyed:2},
Ie=()=>{$e-=1};function la(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(o),s=p(s);var i=m.getJsObject(e),u={};if(s){var d=Number(
(l(),E)[(s+24)/8]);if(d){var v=Number((l(),E)[(s+32)/8]);u.requiredFeatures=Array.from((l(),x).subarray(v/4,(v+d*4)/4),f=>m.
FeatureName[f])}var g=Number((l(),E)[(s+40)/8]);if(g){let f=function(q,K,le,ve=!1){var Z=K+le,qe=(l(),x)[Z/4];qe!=4294967295&&
(!ve||qe!=0)&&(b[q]=qe)},O=function(q,K,le){var ve=K+le,Z=(l(),x)[ve/4],qe=(l(),x)[(ve+4)/4];(Z!=4294967295||qe!=4294967295)&&
(b[q]=xe(ve))};var N=Number((l(),E)[g/8]),b={};if(f("maxTextureDimension1D",g,8),f("maxTextureDimension2D",g,12),f("maxT\
extureDimension3D",g,16),f("maxTextureArrayLayers",g,20),f("maxBindGroups",g,24),f("maxBindGroupsPlusVertexBuffers",g,28),
f("maxBindingsPerBindGroup",g,32),f("maxDynamicUniformBuffersPerPipelineLayout",g,36),f("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),f("maxSampledTexturesPerShaderStage",g,44),f("maxSamplersPerShaderStage",g,48),f("maxStorageBuffersPer\
ShaderStage",g,52),f("maxStorageTexturesPerShaderStage",g,56),f("maxUniformBuffersPerShaderStage",g,60),f("minUniformBuf\
ferOffsetAlignment",g,80),f("minStorageBufferOffsetAlignment",g,84),O("maxUniformBufferBindingSize",g,64),O("maxStorageB\
ufferBindingSize",g,72),f("maxVertexBuffers",g,88),O("maxBufferSize",g,96),f("maxVertexAttributes",g,104),f("maxVertexBu\
fferArrayStride",g,108),f("maxInterStageShaderVariables",g,112),f("maxColorAttachments",g,116),f("maxColorAttachmentByte\
sPerSample",g,120),f("maxComputeWorkgroupStorageSize",g,124),f("maxComputeInvocationsPerWorkgroup",g,128),f("maxComputeW\
orkgroupSizeX",g,132),f("maxComputeWorkgroupSizeY",g,136),f("maxComputeWorkgroupSizeZ",g,140),f("maxComputeWorkgroupsPer\
Dimension",g,144),f("maxImmediateSize",g,148,!0),N!==0){(l(),S)[(N+8)/4];var I=N;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(f("maxStorageBuffersInVertexStage",I,16),f("maxStorageTexturesInVertexStage",I,20),f("maxStorageBuffersInFra\
gmentStage",I,24),f("maxStorageTexturesInFragmentStage",I,28))}u.requiredLimits=b}var U=Number((l(),E)[(s+48)/8]);if(U){
var D={label:m.makeStringFromOptionalStringView(U+8)};u.defaultQueue=D}u.label=m.makeStringFromOptionalStringView(s+8)}Re(),
m.Internals.futureInsert(r,i.requestDevice(u).then(f=>{Ie(),Ee(()=>{m.Internals.jsObjectInsert(o,f.queue),m.Internals.jsObjectInsert(
n,f),c.peercomputeOnDevice?.(f),n=BigInt(n),m.Internals.futureInsert(t,f.lost.then(O=>{Ee(()=>{f.onuncapturederror=le=>{};
var q=he(),K=Se(O.message);Sr(t,ia[O.reason],BigInt(K)),we(q)})})),f.onuncapturederror=O=>{var q=5;O.error instanceof GPUValidationError?
q=2:O.error instanceof GPUOutOfMemoryError?q=3:O.error instanceof GPUInternalError&&(q=4);var K=he(),le=Se(O.error.message);
qt(BigInt(n),q,BigInt(le)),we(K)},xr(r,1,BigInt(n),0n)})},f=>{Ie(),Ee(()=>{var O=he(),q=Se(f.message);xr(r,3,BigInt(n),BigInt(
q)),t&&Sr(t,4,BigInt(q)),we(O)})}))}function ua(e){e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}var ca=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=(()=>{
var o=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=o.getMappedRange(r,t)}catch{return 0n}var i=Ht(16,s.byteLength);return(l(),
oe).set(new Uint8Array(s),i),m.Internals.bufferOnUnmaps[e].push(()=>Nt(i)),i})();return BigInt(n)},ma=function(e,r,t,n,o){
e=p(e),r=p(r),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e);m.Internals.bufferOnUnmaps[e]=[],o==-1&&(o=void 0),Re(),m.Internals.
futureInsert(r,s.mapAsync(t,n,o).then(()=>{Ie(),Ee(()=>{Nr(r,1,0n)})},i=>{Ie(),Ee(()=>{var u=he(),d=Se(i.message),v=i.name===
"AbortError"?4:i.name==="OperationError"?3:0;Nr(r,v,BigInt(d)),delete m.Internals.bufferOnUnmaps[e]})}))};function fa(e){
e=p(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.
bufferOnUnmaps[e],r.unmap()}}function da(e){e=p(e),delete m.Internals.jsObjects[e]}function pa(e,r,t){e=p(e),r=p(r),t=p(
t);var n=!!(l(),x)[(r+40)/4],o={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),x)[(r+24)/4],size:xe(r+32),mappedAtCreation:n},
s=m.getJsObject(e),i;try{i=s.createBuffer(o)}catch{return!1}return m.Internals.jsObjectInsert(t,i),n&&(m.Internals.bufferOnUnmaps[t]=
[]),!0}function ga(e,r,t){e=p(e),r=p(r),t=p(t);var n=Number((l(),E)[r/8]),o=(l(),S)[(n+8)/4],s={label:m.makeStringFromOptionalStringView(
r+8),code:""};switch(o){case 2:{s.code=m.makeStringFromStringView(n+16);break}}var i=m.getJsObject(e);m.Internals.jsObjectInsert(
t,i.createShaderModule(s))}var _a=e=>{const r=m.getJsObject(e);r.onuncapturederror=null,r.destroy()};function va(e,r,t,n){
r=p(r),t=p(t),n=p(n);var o;if(t){o={featureLevel:m.FeatureLevel[(l(),S)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),
S)[(t+12)/4]],forceFallbackAdapter:!!(l(),x)[(t+16)/4]};var s=Number((l(),E)[t/8]);if(s!==0){(l(),S)[(s+8)/4];var i=s;o.
xrCompatible=!!(l(),x)[(i+16)/4]}}if(!("gpu"in navigator)){var u=he(),d=Se("WebGPU not available on this browser (naviga\
tor.gpu is not available)");We(r,3,BigInt(n),BigInt(d)),we(u);return}Re(),m.Internals.futureInsert(r,navigator.gpu.requestAdapter(
o).then(v=>{Ie(),Ee(()=>{if(v)m.Internals.jsObjectInsert(n,v),We(r,1,BigInt(n),0n);else{var g=he(),N=Se("WebGPU not avai\
lable on this browser (requestAdapter returned null)");We(r,3,BigInt(n),BigInt(N)),we(g)}})},v=>{Ie(),Ee(()=>{var g=he(),
N=Se(v.message);We(r,4,BigInt(n),BigInt(N)),we(g)})}))}var ha=function(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);Re(),m.
Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Ie(),Ee(()=>{Wt(r,1)})}))},dt=function(e,r,t){return e=p(e),r=
p(r),t=p(t),_e.handleAsync(async()=>{var n=[];if(t){var o=(l(),S)[t/4];n.length=r+1,n[r]=new Promise(d=>setTimeout(d,o,0))}else
n.length=r;for(var s=0;s<r;++s){var i=xe(e+s*8);if(!(i in m.Internals.futures))return i;n[s]=m.Internals.futures[i]}const u=await Promise.
race(n);return delete m.Internals.futures[u],u})};dt.isAsync=!0;var Xe={},wa=()=>C||"./this.program",Me=()=>{if(!Me.strings){
var e=(typeof navigator=="object"&&navigator.language||"C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_us\
er",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:wa()};for(var t in Xe)Xe[t]===void 0?delete r[t]:r[t]=Xe[t];var n=[];
for(var t in r)n.push(`${t}=${r[t]}`);Me.strings=n}return Me.strings};function pt(e,r){if(k)return te(14,0,1,e,r);e=p(e),
r=p(r);var t=0,n=0;for(var o of Me()){var s=r+t;(l(),E)[(e+n)/8]=BigInt(s),t+=ke(o,s,1/0)+1,n+=8}return 0}function gt(e,r){
if(k)return te(15,0,1,e,r);e=p(e),r=p(r);var t=Me();(l(),E)[e/8]=BigInt(t.length);var n=0;for(var o of t)n+=ye(o)+1;return(l(),
E)[r/8]=BigInt(n),0}function _t(e){if(k)return te(16,0,1,e);try{var r=Y.getStreamFromFD(e);return a.close(r),0}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.errno}}var ba=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var i=Number(
(l(),E)[r/8]),u=Number((l(),E)[(r+8)/8]);r+=16;var d=a.read(e,(l(),J),i,u,n);if(d<0)return-1;if(o+=d,d<u)break}return o};
function vt(e,r,t,n){if(k)return te(17,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var o=Y.getStreamFromFD(e),s=ba(o,r,t);return(l(),
E)[n/8]=BigInt(s),0}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return i.errno}}function ht(e,r,t,n){if(k)return te(
18,0,1,e,r,t,n);r=p(r),n=p(n);try{if(isNaN(r))return 61;var o=Y.getStreamFromFD(e);return a.llseek(o,r,t),(l(),P)[n/8]=BigInt(
o.position),o.getdents&&r===0&&t===0&&(o.getdents=null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.
errno}}var ya=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var i=Number((l(),E)[r/8]),u=Number((l(),E)[(r+8)/8]);r+=16;var d=a.write(
e,(l(),J),i,u,n);if(d<0)return-1;if(o+=d,d<u)break}return o};function wt(e,r,t,n){if(k)return te(19,0,1,e,r,t,n);r=p(r),
t=p(t),n=p(n);try{var o=Y.getStreamFromFD(e),s=ya(o,r,t);return(l(),E)[n/8]=BigInt(s),0}catch(i){if(typeof a>"u"||i.name!==
"ErrnoError")throw i;return i.errno}}function ka(e,r){e=p(e),r=p(r);try{return ur((l(),oe).subarray(e,e+r)),0}catch(t){if(typeof a>
"u"||t.name!=="ErrnoError")throw t;return t.errno}}function Ea(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(
t.info,r),1}function Sa(e,r){e=p(e),r=p(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function Na(e,r){
e=p(e);var t=m.getJsObject(e);return t.features.has(m.FeatureName[r])}var xa=function(e){e=p(e);var r=(()=>{var t=m.getJsObject(
e);return t.size})();return BigInt(r)},Ia=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(
r+8),timestampWrites:m.makePassTimestampWrites(Number((l(),E)[(r+24)/8]))});var o=m.getJsObject(e),s=yr(0n);return m.Internals.
jsObjectInsert(s,o.beginComputePass(n)),s})();return BigInt(t)};function Fa(e,r,t,n,o,s){e=p(e),r=p(r),t=p(t),n=p(n),o=p(
o),s=p(s);var i=m.getJsObject(e),u=m.getJsObject(r),d=m.getJsObject(n);i.copyBufferToBuffer(u,t,d,o,s)}var Ba=function(e,r){
e=p(e);var t=(()=>{var n=m.getJsObject(e),o=wr(0n);return m.Internals.jsObjectInsert(o,n.finish()),o})();return BigInt(t)};
function Ta(e,r,t,n){e=p(e);var o=m.getJsObject(e);o.dispatchWorkgroups(r,t,n)}function Aa(e){e=p(e);var r=m.getJsObject(
e);r.end()}function Ga(e,r,t,n,o){e=p(e),t=p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(t);n==0?s.setBindGroup(
r,i):s.setBindGroup(r,i,(l(),x),o/4,n)}function Ca(e,r){e=p(e),r=p(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var ja=function(e,r){e=p(e);var t=(()=>{var n=m.getJsObject(e),o=hr(0n);return m.Internals.jsObjectInsert(o,n.getBindGroupLayout(
r)),o})();return BigInt(t)},Da=function(e,r){e=p(e),r=p(r);var t=(()=>{function n(d){var v=Number((l(),E)[(d+16)/8]),g=Number(
(l(),E)[(d+40)/8]),N=Number((l(),E)[(d+48)/8]),b=0;m.iterateExtensions(d,{327681:D=>{b=Number((l(),E)[(D+16)/8])}});var I;
if(v){var U=xe(d+32);U==-1&&(U=void 0),I={buffer:m.getJsObject(v),offset:xe(d+24),size:U}}else I=m.getJsObject(g||N||b);
return{binding:(l(),x)[(d+8)/4],resource:I}}function o(d,v){for(var g=[],N=0;N<d;++N)g.push(n(v+56*N));return g}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),E)[(r+24)/8])),entries:o(Number((l(),E)[(r+32)/8]),
Number((l(),E)[(r+40)/8]))},i=m.getJsObject(e),u=vr(0n);return m.Internals.jsObjectInsert(u,i.createBindGroup(s)),u})();
return BigInt(t)},Ra=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var o=m.getJsObject(e),s=br(0n);return m.Internals.jsObjectInsert(s,o.createCommandEncoder(n)),s})();return BigInt(t)},Ua=function(e,r){
e=p(e),r=p(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),o=m.getJsObject(e),s=kr(0n);return m.Internals.jsObjectInsert(
s,o.createComputePipeline(n)),s})();return BigInt(t)};function Oa(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var La=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=m.getJsObject(
e),o=Array.from((l(),P).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(o)};function Ma(e,r,t,n,o){e=p(e),r=p(r),t=
p(t),n=p(n),o=p(o);var s=m.getJsObject(e),i=m.getJsObject(r),u=(l(),oe).subarray(n,n+o);s.writeBuffer(i,t,u,0,o)}var _e={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;_e.asyncExports=new Set;var t={};for(let[o,s]of Object.entries(
e))if(typeof s=="function"){r.test(o)&&(_e.asyncExports.add(s),s=_e.makeAsyncFunction(s));var n=_e.instrumentFunction(s);
t[o]=n}else t[o]=s;return t},asyncExports:null,isAsyncExport(e){return _e.asyncExports?.has(e)},handleAsync:async e=>{Re();
try{return await e()}finally{Ie()}},handleSleep:e=>_e.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},bt=e=>{var r=c["_"+e];return r},Wa=(e,r)=>{(l(),J).set(e,r)},yt=(e,r,t,n,o)=>{var s={pointer:D=>BigInt(D),
string:D=>{var f=0;return D!=null&&D!==0&&(f=Se(D)),BigInt(f)},array:D=>{var f=ar(D.length);return Wa(D,f),BigInt(f)}};function i(D){
return r==="string"?Le(Number(D)):r==="pointer"?Number(D):r==="boolean"?!!D:D}var u=bt(e),d=[],v=0;if(n)for(var g=0;g<n.
length;g++){var N=s[t[g]];N?(v===0&&(v=he()),d[g]=N(n[g])):d[g]=n[g]}var b=u(...d);function I(D){return v!==0&&we(v),i(D)}
var U=o?.async;return U?b.then(I):(b=I(b),b)},qa=(e,r,t,n)=>{var o=!t||t.every(i=>i==="number"||i==="boolean"),s=r!=="st\
ring";return s&&o&&!n?bt(e):(...i)=>yt(e,r,t,i,n)},Va=(...e)=>a.createPath(...e),za=(...e)=>a.unlink(...e),Ja=(...e)=>a.
createLazyFile(...e),Pa=(...e)=>a.createDevice(...e);if(z.init(),a.createPreloadedFile=Tn,a.preloadFile=pr,a.staticInit(),
un(),c.noExitRuntime&&(ir=c.noExitRuntime),c.preloadPlugins&&(rt=c.preloadPlugins),c.print&&(ce=c.print),c.printErr&&(ne=
c.printErr),c.wasmBinary&&(ae=c.wasmBinary),c.arguments&&c.arguments,c.thisProgram&&(C=c.thisProgram),c.preInit)for(typeof c.
preInit=="function"&&(c.preInit=[c.preInit]);c.preInit.length>0;)c.preInit.shift()();c.ENV=Xe,c.mmapAlloc=fr,c.wasmMemory=
be,c.addRunDependency=Pe,c.removeRunDependency=Je,c.ccall=yt,c.cwrap=qa,c.FS_preloadFile=pr,c.FS_unlink=za,c.FS_createPath=
Va,c.FS_createDevice=Pa,c.FS=a,c.FS_createDataFile=et,c.FS_createLazyFile=Ja,c.MEMFS=j;var $a=[Vr,zr,Yr,tt,An,nt,at,ot,Gn,
Cn,st,it,lt,ut,pt,gt,_t,vt,ht,wt];function kt(e,r,t,n){return _e.handleAsync(async()=>await w(Le(Number(e)),Number(r),Number(
t),Number(n)))}kt.sig="jjjjj";var Et,St,Nt,vr,hr,wr,br,yr,kr,xt,It,Ft,Bt,Tt,At,Gt,Ct,jt,Dt,Rt,Ut,Ot,Lt,Er,Mt,Sr,Nr,We,xr,
Wt,qt,Qe,Vt,Ir,zt,Jt,Pt,Fr,$t,Ht,Yt,Xt,Qt,Kt,Zt,en;function Ha(e){c._wllama_malloc=e.wllama_malloc,c._wllama_start=e.wllama_start,
c._wllama_action=e.wllama_action,c._wllama_exit=e.wllama_exit,c._wllama_debug=e.wllama_debug,Et=c._main=e.main,St=e.malloc,
Nt=e.free,vr=e.emwgpuCreateBindGroup,hr=e.emwgpuCreateBindGroupLayout,wr=e.emwgpuCreateCommandBuffer,br=e.emwgpuCreateCommandEncoder,
yr=e.emwgpuCreateComputePassEncoder,kr=e.emwgpuCreateComputePipeline,xt=e.emwgpuCreateExternalTexture,It=e.emwgpuCreatePipelineLayout,
Ft=e.emwgpuCreateQuerySet,Bt=e.emwgpuCreateRenderBundle,Tt=e.emwgpuCreateRenderBundleEncoder,At=e.emwgpuCreateRenderPassEncoder,
Gt=e.emwgpuCreateRenderPipeline,Ct=e.emwgpuCreateSampler,jt=e.emwgpuCreateSurface,Dt=e.emwgpuCreateTexture,Rt=e.emwgpuCreateTextureView,
Ut=e.emwgpuCreateAdapter,Ot=e.emwgpuCreateBuffer,Lt=e.emwgpuCreateDevice,Er=e.emwgpuCreateQueue,Mt=e.emwgpuCreateShaderModule,
Sr=e.emwgpuOnDeviceLostCompleted,Nr=e.emwgpuOnMapAsyncCompleted,We=e.emwgpuOnRequestAdapterCompleted,xr=e.emwgpuOnRequestDeviceCompleted,
Wt=e.emwgpuOnWorkDoneCompleted,qt=e.emwgpuOnUncapturedError,e._emscripten_tls_init,Qe=e.pthread_self,Vt=e.emscripten_builtin_memalign,
Ir=e._emscripten_thread_init,zt=e._emscripten_thread_crashed,Jt=e._emscripten_run_js_on_main_thread,Pt=e._emscripten_thread_free_data,
Fr=e._emscripten_thread_exit,$t=e._emscripten_check_mailbox,Ht=e.memalign,Yt=e.__trap,Xt=e.emscripten_stack_set_limits,Qt=
e._emscripten_stack_restore,Kt=e._emscripten_stack_alloc,Zt=e.emscripten_stack_get_current,en=e.__indirect_function_table}
var Ue;function Ya(){Ue={__asyncjs__js_file_read:kt,__pthread_create_js:Xr,__syscall_fcntl64:tt,__syscall_getcwd:nt,__syscall_getdents64:at,
__syscall_ioctl:ot,__syscall_openat:st,__syscall_stat64:it,_abort_js:jn,_emscripten_init_main_thread_js:Dn,_emscripten_notify_mailbox_postmessage:Un,
_emscripten_receive_on_main_thread_js:On,_emscripten_thread_cleanup:Ln,_emscripten_thread_mailbox_await:_r,_emscripten_thread_set_strongref:Mn,
_localtime_js:Jn,_mmap_js:lt,_munmap_js:ut,_tzset_js:Pn,clock_time_get:Hn,emscripten_check_blocking_allowed:Yn,emscripten_date_now:mt,
emscripten_exit_with_live_runtime:Xn,emscripten_get_callstack:Zn,emscripten_get_heap_max:ea,emscripten_get_now:ct,emscripten_has_asyncify:ra,
emscripten_num_logical_cores:ta,emscripten_resize_heap:aa,emwgpuAdapterRequestDevice:la,emwgpuBufferDestroy:ua,emwgpuBufferGetConstMappedRange:ca,
emwgpuBufferMapAsync:ma,emwgpuBufferUnmap:fa,emwgpuDelete:da,emwgpuDeviceCreateBuffer:pa,emwgpuDeviceCreateShaderModule:ga,
emwgpuDeviceDestroy:_a,emwgpuInstanceRequestAdapter:va,emwgpuQueueOnSubmittedWorkDone:ha,emwgpuWaitAny:dt,environ_get:pt,
environ_sizes_get:gt,exit:or,fd_close:_t,fd_read:vt,fd_seek:ht,fd_write:wt,memory:be,random_get:ka,wgpuAdapterGetInfo:Ea,
wgpuAdapterGetLimits:Sa,wgpuAdapterHasFeature:Na,wgpuBufferGetSize:xa,wgpuCommandEncoderBeginComputePass:Ia,wgpuCommandEncoderCopyBufferToBuffer:Fa,
wgpuCommandEncoderFinish:Ba,wgpuComputePassEncoderDispatchWorkgroups:Ta,wgpuComputePassEncoderEnd:Aa,wgpuComputePassEncoderSetBindGroup:Ga,
wgpuComputePassEncoderSetPipeline:Ca,wgpuComputePipelineGetBindGroupLayout:ja,wgpuDeviceCreateBindGroup:Da,wgpuDeviceCreateCommandEncoder:Ra,
wgpuDeviceCreateComputePipeline:Ua,wgpuInstanceHasWGSLLanguageFeature:Oa,wgpuQueueSubmit:La,wgpuQueueWriteBuffer:Ma}}function Xa(e){
e=Object.assign({},e);var r=v=>(g,N,b)=>v(g,BigInt(N||0),BigInt(b||0)),t=v=>g=>Number(v(BigInt(g))),n=v=>g=>v(BigInt(g)),
o=v=>()=>Number(v()),s=v=>(g,N)=>Number(v(BigInt(g),BigInt(N))),i=v=>(g,N,b,I,U,D)=>v(BigInt(g),N,b,I,U,D),u=v=>(g,N,b,I,U)=>v(
g,BigInt(N),b,BigInt(I),U),d=v=>(g,N)=>v(BigInt(g),BigInt(N));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),
e.pthread_self=o(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
i(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=u(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
n(e._emscripten_thread_free_data),e._emscripten_thread_exit=n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
d(e.emscripten_stack_set_limits),e._emscripten_stack_restore=n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=o(e.emscripten_stack_get_current),e}async function Qa(){var e=Et,
r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,Jr(n,!0),n}catch(o){return gr(o)}}function Ke(){if(Ae>0){Oe=Ke;return}
if(k){Cr();return}if(cn(),Ae>0){Oe=Ke;return}async function e(){if(c.calledRun=!0,!ue){Cr(),c.onRuntimeInitialized?.();var r=c.
noInitialRun||!1;r||await Qa(),mn()}}c.setStatus?(c.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>c.setStatus(""),
1),e()},1)):e()}var Ne;return k||(Dr(),Ke()),c}var an=1,on={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
Ve=new Uint8Array([71,76,85,69]),Ar=0,fo=1,po=2,go=3,_o=4,vo=5,ho=6,wo=7,bo=8,yo=9,ko=10,sn={str:_o,int:po,float:go,bool:fo,
raw:vo,arr_str:yo,arr_int:wo,arr_float:bo,arr_bool:ho,arr_raw:ko,null:Ar};function Eo(c){let w=0;const A=new DataView(c.
buffer),T=()=>{const R=A.getUint32(w,!0);return w+=4,R},L=()=>{const R=A.getInt32(w,!0);return w+=4,R},y=()=>{const R=A.
getFloat32(w,!0);return w+=4,R},k=()=>T()!==0,$=R=>{const X=R??T(),fe=new TextDecoder().decode(c.slice(w,w+X));return w+=
X,fe},C=()=>{const R=T(),X=c.slice(w,w+R);return w+=R,X},F=R=>{const X=T(),fe=new Array(X);for(let ce=0;ce<X;ce++)fe[ce]=
R();return fe},_=()=>null,G=R=>{switch(R.type){case"str":return $();case"int":return L();case"float":return y();case"boo\
l":return k();case"raw":return C();case"arr_str":return F($);case"arr_int":return F(L);case"arr_float":return F(y);case"\
arr_bool":return F(k);case"arr_raw":return F(C);case"null":return _()}},Q=c[0]===Ve[0]&&c[1]===Ve[1]&&c[2]===Ve[2]&&c[3]===
Ve[3];if(w+=4,!Q)throw new Error("Invalid magic number");if(T()!==an)throw new Error("Invalid version number");const h=$(
8),V=on[h];if(!V)throw new Error(`Unknown message name: ${h}`);const M={_name:h};for(const R of V.fields){const X=T();if(X===
Ar){if(!R.isNullable)throw new Error(`${h}: Expect field ${R.name} to be non-nullable`);M[R.name]=null;continue}if(X!==sn[R.
type])throw new Error(`${h}: Expect field ${R.name} to have type ${R.type}`);M[R.name]=G(R)}return M}function So(c){const w=on[c.
_name];if(!w)throw new Error(`Unknown message name: ${c._name}`);const A=[],T=B=>{const h=new ArrayBuffer(4);new DataView(
h).setUint32(0,B,!0),A.push(new Uint8Array(h))},L=B=>{const h=new ArrayBuffer(4);new DataView(h).setInt32(0,B,!0),A.push(
new Uint8Array(h))},y=B=>{const h=new ArrayBuffer(4);new DataView(h).setFloat32(0,B,!0),A.push(new Uint8Array(h))},k=B=>{
T(B?1:0)},$=B=>{const h=new TextEncoder().encode(B);T(h.byteLength),A.push(h)},C=B=>{T(B.byteLength),A.push(B)},F=(B,h)=>{
T(B.length);for(const V of B)h(V)};A.push(Ve),T(an);{const B=new TextEncoder().encode(c._name);A.push(B)}for(const B of w.
fields){const h=c[B.name];if(!B.isNullable&&h==null)throw new Error(`${c._name}: Expect field ${B.name} to be non-nullab\
le`);if(h==null){T(Ar);continue}switch(T(sn[B.type]),B.type){case"str":$(h);break;case"int":L(h);break;case"float":y(h);
break;case"bool":k(h);break;case"raw":C(h);break;case"arr_str":F(h,$);break;case"arr_int":F(h,L);break;case"arr_float":F(
h,y);break;case"arr_bool":F(h,k);break;case"arr_raw":F(h,C);break}}const _=A.reduce((B,h)=>B+h.byteLength,0),G=new Uint8Array(
_);let Q=0;for(const B of A)G.set(B,Q),Q+=B.byteLength;return G}const ln=4*1024**2,Tr=1024*1024;function No(c,w){if(c===
"completion"){if(typeof w?.data_json!="string"||new TextEncoder().encode(w.data_json).length>Tr||!Array.isArray(w.files)||
w.files.length>Br.maximumFiles||w.files.some(y=>!(y instanceof Uint8Array)))throw new Error("Invalid GGUF native media r\
equest");if(w.files.reduce((y,k)=>y+k.byteLength,0)>Br.requestBytes)throw new Error("GGUF native media exceeds its byte \
budget")}const A=So(w),T=c==="completion"?Br.requestBytes:Tr;if(A.byteLength>T)throw new Error("GGUF native message exce\
eds its byte budget");return A}function xo({files:c,reader:w,getMemory:A,getSignal:T=()=>{}}){const L=new Map(c.map(y=>[
y.name,y]));return async(y,k,$,C)=>{const F=L.get(y.replace(/^\/?models\//,""));if(!F||![k,$,C].every(G=>Number.isSafeInteger(
G)&&G>=0)||k>F.size)throw new Error("Invalid GGUF native file read");const _=Math.min($,F.size-k);if(!Number.isSafeInteger(
C+_)||C+_>A().byteLength)throw new Error("GGUF native file read exceeds WASM memory");for(let G=0;G<_;){ee(T());const Q=Math.
min(ln,_-G),B=await w.read(F.path,k+G,Q,{signal:T()});if(ee(T()),!(B instanceof Uint8Array)||B.byteLength!==Q)throw new Error(
"Incomplete GGUF artifact range");new Uint8Array(A()).set(B,C+G),G+=Q}return BigInt(_)}}function Io(c,w){c.FS.mkdir("/mo\
dels"),c.FS.mount(c.MEMFS,{root:"."},"/models");const A=new Map(w.map(y=>[y.name,y])),T=c.MEMFS.stream_ops;for(const y of[
"read","llseek"]){const k=T[y];T[y]=function($,...C){const F=A.get($.node.name);return F&&($.node.usedBytes=F.size),k.call(
this,$,...C)},c.MEMFS.ops_table.file.stream[y]=T[y]}const L=T.mmap;T.mmap=function(y,...k){if(A.has(y.node.name))throw new Error(
"GGUF artifact mmap is prohibited");return L.call(this,y,...k)},c.MEMFS.ops_table.file.stream.mmap=T.mmap;for(const y of w)
c.FS_createDataFile("/models",y.name,new Uint8Array(0),!0,!1,!0)}function Fo(c,w,{collect:A=!1,onLost:T}={}){if(w.device=
c,w.runtimeFeatures=[...c.features],w.runtimeAdapter=c.adapterInfo?{vendor:c.adapterInfo.vendor,architecture:c.adapterInfo.
architecture,isFallbackAdapter:c.adapterInfo.isFallbackAdapter??!1}:null,!c.features.has("shader-f16")||w.runtimeAdapter?.
isFallbackAdapter)throw new Error("GGUF native runtime did not acquire the required hardware GPU");c.lost.then(F=>T?.(F));
const L=Za(c,w);if(!A)return L;const y=Object.getOwnPropertyDescriptor(c,"createCommandEncoder"),k=Object.getOwnPropertyDescriptor(
c.queue,"submit"),$=c.createCommandEncoder.bind(c),C=c.queue.submit.bind(c.queue);return c.createCommandEncoder=(...F)=>{
const _=$(...F),G=_.beginComputePass.bind(_);return _.beginComputePass=(...Q)=>{const B=G(...Q);for(const h of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const V=B[h].bind(B);B[h]=(...M)=>{const R=V(...M);return w.dispatches+=1,R}}
return B},_},c.queue.submit=(...F)=>{const _=C(...F);return w.submissions+=1,_},()=>{L(),y?Object.defineProperty(c,"crea\
teCommandEncoder",y):delete c.createCommandEncoder,k?Object.defineProperty(c.queue,"submit",k):delete c.queue.submit}}function Bo(c){
const w=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(c);return w?{gpuLayers:Number(w[1]),totalLayers:Number(w[2])}:
null}function To(c){const w=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.exec(c);return w?
{backend:w[1],kind:w[2].toLowerCase(),bytes:Math.round(Number(w[3])*1024**2)}:null}async function Ao({wasmUrl:c,weights:w,
projector:A,adapters:T=[],reader:L,signal:y,collectGpuEvidence:k=!1,onProgress:$,onLost:C,initialize:F=mo}={}){const _=w.
map((W,J)=>({...W,name:`model-${String(J+1).padStart(5,"0")}-of-${String(w.length).padStart(5,"0")}.gguf`}));if(A&&w.some(
W=>W.path===A.path))throw new Error("GGUF projector must be separate from text shards");const G=A?{...A,name:"mmproj.ggu\
f"}:void 0,Q=T.map((W,J)=>({...W.file,scale:W.scale,name:`adapter-${J+1}.gguf`})),B=[..._,...G?[G]:[],...Q];if(new Set(B.
map(W=>W.path)).size!==B.length)throw new Error("GGUF base and companion files must have distinct paths");const h={dispatches:0,
submissions:0,device:null,offload:null,buffers:[],lost:!1};let V=y,M,R,X,fe,ce;const ne=new Promise((W,J)=>{fe=W,ce=J}),
ae=W=>{const J=Bo(String(W));J&&(h.offload=J,$?.({type:"gpu-offload",...J}));const oe=To(String(W));oe&&h.buffers.length<
32&&(h.buffers.push(oe),$?.({type:"native-buffer",...oe,wasmMemoryBytes:X?.wasmMemory?.buffer.byteLength??0}))},se=W=>{M=
new Error(`Model session lost: GGUF native runtime failed: ${String(W).slice(0,300)}`),ce(M)};X={noInitialRun:!0,pthreadPoolSize:0,
locateFile(W){if(W!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return c},print:ae,printErr:ae,
onAbort:se,onExit:se,preRun(){X.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){fe()},peercomputeOnDevice(W){try{R?.(),R=
Fo(W,h,{collect:k,onLost(J){h.lost=!0,C?.(J)}})}catch(J){W.destroy(),se(J.message)}}};const ue=xo({files:B,reader:L,getMemory:()=>X.
wasmMemory.buffer,getSignal:()=>V});F(X,ue),await ne,ee(y),Io(X,B);const re=X.cwrap("wllama_start","string",[],{async:!0}),
Fe=X.cwrap("wllama_malloc","bigint",["bigint","number"]),de=X.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});
let l=!1;const Be=async(W,J,oe)=>{if(l)throw new Error("Concurrent GGUF native calls are prohibited");if(M)throw M;if(h.
lost)throw new Error("GPU device lost; GGUF session is unavailable");ee(oe);const me=No(W,J);l=!0,V=oe;try{const S=Number(
Fe(BigInt(me.byteLength),0)),x=new Uint8Array(X.wasmMemory.buffer);if(!Number.isSafeInteger(S)||S<=0||S+me.length>x.length)
throw new Error("Invalid GGUF input pointer");x.set(me,S);const pe=Number(await de(W,BigInt(S)));if(M)throw M;const ie=X.
wasmMemory.buffer,P=new DataView(ie).getUint32(S,!0);if(!Number.isSafeInteger(pe)||pe<=0||P>Tr||pe+P>ie.byteLength)throw new Error(
"Invalid GGUF output buffer");return Eo(new Uint8Array(ie,pe,P).slice())}catch(S){throw M??=new Error(`Model session los\
t: GGUF native action failed: ${String(S.message??S).slice(0,300)}`),M}finally{l=!1,V=void 0}},Te=JSON.parse(await re());
if(M)throw M;if(!Te.success||!h.device)throw new Error("GGUF native hardware GPU backend did not initialize");return ee(
y),{files:_,projectorFile:G,adapterFiles:Q,action:Be,evidence:h,async settleGpu(){try{await h.device.queue.onSubmittedWorkDone()}catch(W){
throw h.lost=!0,M=new Error(`Model session lost: GGUF GPU completion failed: ${String(W.message??W).slice(0,300)}`),M}},
close(){R?.(),h.device?.destroy()},memoryBytes(){return X.wasmMemory.buffer.byteLength}}}const Go="ERR_MODEL_CONTEXT_BUD\
GET",rr=1;function Co(c,w,A){return Object.assign(new Error(`The model context holds ${w} tokens; instructions and the c\
urrent prompt need ${c}, plus ${A} reserved for the reply. Shorten the current prompt or saved context, or request a sho\
rter reply.`),{code:Go})}function jo(c){const w=c.findIndex(T=>T.role==="user"),A=c.findIndex((T,L)=>L>w&&T.role==="user");
return w<0||A<0||!c.some((T,L)=>L>w&&L<A&&T.role==="assistant")?null:c.filter((T,L)=>L<w||L>=A||T.role==="system")}async function Do({
messages:c,contextTokens:w,reservedOutputTokens:A,measure:T,signal:L,onMeasured:y}){if(!Number.isSafeInteger(w)||w<1||!Number.
isSafeInteger(A)||A<1)throw new Error("Invalid GGUF context budget");let k=c.map(_=>({..._})),$=0,C=0;const F=Math.max(1,
c.filter(_=>_.role==="user").length);for(let _=1;_<=F;_+=1){ee(L);const G=await T(k);if(ee(L),!Number.isSafeInteger(G.inputTokens)||
G.inputTokens<0||!Number.isSafeInteger(G.contextTokens)||G.contextTokens<1||G.contextTokens>w||!Number.isSafeInteger(G.probeOutputTokens)||
G.probeOutputTokens<0||G.probeOutputTokens>rr)throw new Error("Invalid GGUF context measurement");C+=G.probeOutputTokens;
const Q={contextTokens:G.contextTokens,inputTokens:G.inputTokens,reservedOutputTokens:A,removedTurns:$,preflightCalls:_,
measurementTokens:C,probeTokenBudget:rr},B=G.inputTokens>=G.contextTokens||G.inputTokens+A>G.contextTokens;if(y?.({...Q,
probeOutputTokens:G.probeOutputTokens,overflow:B}),ee(L),!B)return{messages:k,contextTruncated:$>0,contextBudget:Q};const h=jo(
k);if(!h)throw Co(G.inputTokens,G.contextTokens,A);k=h,$+=1}throw new Error("GGUF context fitting exceeded its bounded a\
ttempts")}const er=c=>new TextEncoder().encode(c).byteLength;function Ro(c){if(!c.data_json||c.data_json==="null")return[];
if(typeof c.data_json!="string"||er(c.data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");let w;
try{w=JSON.parse(c.data_json)}catch{throw new Error("GGUF returned invalid result JSON")}const A=Array.isArray(w)?w:[w];
if(A.some(T=>!T||typeof T!="object"||Array.isArray(T)))throw new Error("GGUF returned invalid result data");return A}function Uo(c,w){
const A=c[0],T=A?.error??A,L=T?.n_prompt_tokens??A?.n_prompt_tokens,y=T?.n_ctx??A?.n_ctx;if(T?.type==="exceed_context_si\
ze_error"&&Number.isSafeInteger(L)&&L>=y&&Number.isSafeInteger(y)&&y>0&&y<=w)return Object.assign(new Error("GGUF native\
 prompt exceeds the model context"),{code:"ERR_GGUF_NATIVE_CONTEXT",inputTokens:L,contextTokens:y});const k=T?.type==="i\
nvalid_request_error";return Object.assign(new Error(k?"GGUF rejected the inference request":"GGUF native inference fail\
ed"),{code:k?"ERR_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE_FAILURE"})}function Oo(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof
WorkerGlobalScope))throw new Error("GGUF inference requires a ComputeManager-owned worker")}function nn(c){return{sessionId:c.
sessionId,manifestCid:c.manifestCid,status:c.lost?"lost":c.status,runtime:"llama.cpp",runtimeVersion:co,task:"text-gener\
ation",workerId:c.workerId,adapter:c.capabilities?.adapter,runtimeAdapter:c.engine?.evidence.runtimeAdapter??null,runtimeFeatures:c.
engine?.evidence.runtimeFeatures??[],gpuDispatches:c.engine?.evidence.dispatches??0,gpuSubmissions:c.engine?.evidence.submissions??
0,requestedGpuBufferPeakBytes:c.engine?.evidence.requestedGpuBufferPeakBytes,gpuOffload:c.engine?.evidence.offload??null,
runtimeOptions:c.options,effectiveContextTokens:c.contextTokens??null,inputModalities:c.inputModalities??["text"],loraAdapters:c.
loraAdapters??[],nativeBuffers:c.engine?.evidence.buffers??[],wasmMemoryBytes:c.engine?.memoryBytes()??0,generatedRequests:c.
generatedRequests,artifactReads:c.reader?.getStats()??null}}function Lo({loadEngine:c=Ao,createReader:w=Ka,checkCapabilities:A=ro,
assertWorker:T=Oo,baseUrl:L=globalThis.location?.href}={}){let y;async function k(C,F){if(y)throw new Error("GGUF worker\
 already has a resident model");const _=to(C.manifest),G=no(C.runtimeAssets,L),Q=ao(C.runtimeOptions,_.mediaProfile),B=Ze(
C.sessionId);ee(F.signal);const h={sessionId:B,manifestCid:C.manifestCid,workerId:F.workerId??null,manifest:_.manifest,mediaProfile:_.
mediaProfile,status:"loading",options:Q,generatedRequests:0,residency:new AbortController,lost:!1};y=h;try{if(h.capabilities=
await A(),ee(F.signal),h.reader=w(C.artifactPort,{manifest:_.manifest,signal:h.residency.signal,maxReadBytes:ln,maxReads:1}),
await oo(_.baseManifest.model,_.weights,h.reader,{signal:F.signal}),_.adapters.length&&(h.loraAdapters=await so(_.baseManifest.
model,_.weights,_.adapters,h.reader,{signal:F.signal})),ee(F.signal),h.engine=await c({wasmUrl:G.wasm,weights:_.weights,
projector:_.projector,adapters:_.adapters,reader:h.reader,signal:F.signal,collectGpuEvidence:C.collectGpuEvidence===!0,onProgress:R=>F.
emitProgress?.({...R,sessionId:B}),onLost(){h.lost=!0,h.active?.abort("GPU device lost")}}),ee(F.signal),_.mediaProfile&&
!h.engine.projectorFile)throw new Error("GGUF projector was not mounted");if(_.adapters.length&&h.engine.adapterFiles?.length!==
_.adapters.length)throw new Error("GGUF adapters were not mounted");const V=await h.engine.action("load",{_name:"load_re\
q",model_paths:h.engine.files.map(R=>`models/${R.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...Q,n_ubatch:_.mediaProfile?.
batchTokens??Math.min(64,Q.n_batch),n_parallel:1,kv_unified:!0,..._.mediaProfile?{mmproj_path:`models/${h.engine.projectorFile.
name}`,mmproj_offload:!0,image_min_tokens:_.mediaProfile.imageMinTokens,image_max_tokens:_.mediaProfile.imageMaxTokens}:
{},..._.adapters.length?{lora_paths:h.engine.adapterFiles.map(R=>`models/${R.name}`),lora_scales:_.adapters.map(R=>R.scale)}:
{},log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},F.signal);if(!V.success)throw new Error(
"GGUF native model load failed");if(!Number.isSafeInteger(V.n_ctx)||V.n_ctx<1||V.n_ctx>io)throw new Error("GGUF native m\
odel returned an invalid context capacity");if(h.contextTokens=V.n_ctx,_.mediaProfile){if(V.has_image_input!==!0||V.has_audio_input!==
!0||V.n_batch!==_.mediaProfile.batchTokens||V.n_ubatch!==_.mediaProfile.batchTokens||typeof V.media_marker!="string"||!/^<[^\s<>]{1,126}>$/.
test(V.media_marker))throw new Error("GGUF native runtime did not confirm the required image/audio projector and batch p\
rofile");h.mediaMarker=V.media_marker,h.inputModalities=["text","image","audio"]}const M=h.engine.evidence.offload;if(!M||
M.gpuLayers<1||M.gpuLayers!==Math.min(Q.n_gpu_layers,M.totalLayers))throw new Error("GGUF did not honor the explicitly c\
onfigured GPU layer offload");if(ee(F.signal),h.lost)throw new Error("GPU device lost during GGUF load");return h.status=
"ready",nn(h)}catch(V){throw h.engine&&F.emitProgress?.({type:"model-load-memory",sessionId:B,wasmMemoryBytes:h.engine.memoryBytes(),
nativeBuffers:h.engine.evidence.buffers??[]}),h.lost=!0,h.status="lost",h.residency.abort(V),h.reader?.close(V),h.engine?.
close(),V}}async function $(C,F){const _=y;if(!_||_.sessionId!==Ze(C.sessionId)||_.lost)throw new Error("Model session l\
ost or not loaded");if(_.status!=="ready")throw new Error("GGUF model session is busy");const G=Ze(C.requestId),Q=lo(C,_.
manifest),{messages:B,maxNewTokens:h}=Q;ee(F.signal);const V=uo(Q);ee(F.signal),tn(B,V,_.mediaMarker);const M=new AbortController,
R=()=>M.abort(F.signal?.reason);F.signal?.addEventListener("abort",R,{once:!0}),F.signal?.aborted&&R(),_.active=M,_.status=
"generating",_.requestId=G;const X=_.engine.evidence.dispatches,fe=_.engine.evidence.submissions;let ce=0;async function ne(ae,se){
let ue,re=!1,Fe="",de=null,l=null,Be="unknown",Te=0;try{ee(M.signal);const W=tn(ae,V,_.mediaMarker),J=await _.engine.action(
"completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:W.messages,stream:!se,max_tokens:se?rr:h,temperature:0,
cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:W.files},M.signal);if(!J.success||!Number.isSafeInteger(
J.req_id)||J.req_id<0)throw new Error("GGUF failed to start generation");ue=J.req_id,ee(M.signal);for(let oe=0;oe<4096;oe+=
1){ee(M.signal);const me=await _.engine.action("get_result",{_name:"gres_req",req_id:ue},M.signal);ee(M.signal);const S=Ro(
me);if(!me.success||me.is_error)throw Uo(S,_.contextTokens);for(const x of S){const pe=x.choices?.[0]?.finish_reason??x.
finish_reason;pe!=null&&(Be=["stop","length"].includes(pe)?pe:"unknown");const ie=x.choices?.[0],P=ie?.delta?.content??ie?.
message?.content??x.content??"";if(typeof P!="string")throw new Error("Invalid GGUF text chunk");if(se){const E=ie?.delta?.
reasoning_content??ie?.message?.reasoning_content??"";if(typeof E!="string")throw new Error("Invalid GGUF measurement re\
sult");if(Te+=er(P)+er(E),Te>rn.maxOutputBytes)throw new Error("GGUF measurement exceeds its byte budget")}else{if(Fe+=P,
er(Fe)>rn.maxOutputBytes)throw new Error("GGUF output exceeds its byte budget");if(P&&F.emitProgress?.({type:"token",sessionId:_.
sessionId,requestId:G,sequence:ce++,text:P})===!1)throw new Error("Token consumer rejected output")}de=x.usage?.prompt_tokens??
x.timings?.prompt_n??de,l=x.usage?.completion_tokens??x.timings?.predicted_n??l}if(!me.has_more){re=!0;break}await new Promise(
x=>setTimeout(x,0))}if(!re)throw new Error("GGUF result polling exceeded its request budget");if(l!==null&&(!Number.isSafeInteger(
l)||l<0||l>(se?rr:h)))throw new Error("GGUF returned an over-budget token sequence");if(se&&(!Number.isSafeInteger(de)||
de<0||l===null))throw new Error("GGUF context preflight did not return valid token usage");return{text:Fe,inputTokens:de,
outputTokens:l,finishReason:Be}}catch(W){throw(W?.name==="RuntimeError"||/Model session lost|GPU device lost/.test(W?.message??
""))&&(_.lost=!0),W}finally{if(ue!==void 0&&!_.lost)try{re||await _.engine.action("cancel",{_name:"cncl_req",req_id:ue}),
await _.engine.settleGpu()}catch{throw _.lost=!0,new Error("Model session lost while settling GGUF inference")}}}try{const ae=await Do(
{messages:B,contextTokens:_.contextTokens,reservedOutputTokens:h,signal:M.signal,async measure(ue){try{const re=await ne(
ue,!0);return{inputTokens:re.inputTokens,contextTokens:_.contextTokens,probeOutputTokens:re.outputTokens}}catch(re){if(re.
code!=="ERR_GGUF_NATIVE_CONTEXT")throw re;return{inputTokens:re.inputTokens,contextTokens:re.contextTokens,probeOutputTokens:0}}},
onMeasured:ue=>F.emitProgress?.({type:"context-budget",sessionId:_.sessionId,requestId:G,...ue})});ee(M.signal);const se=await ne(
ae.messages,!1);if(ee(M.signal),_.lost)throw new Error("GPU device lost; model session is unavailable");return _.generatedRequests+=
1,{sessionId:_.sessionId,requestId:G,...se,contextTruncated:ae.contextTruncated,contextBudget:ae.contextBudget,requestedGpuBufferPeakBytes:_.
engine.evidence.requestedGpuBufferPeakBytes,wasmMemoryBytes:_.engine.memoryBytes(),workerId:_.workerId,gpuDispatches:_.engine.
evidence.dispatches-X,gpuSubmissions:_.engine.evidence.submissions-fe,gpuOffload:_.engine.evidence.offload,artifactReads:_.
reader.getStats()}}catch(ae){throw ae?.name==="RuntimeError"?(_.lost=!0,new Error(`Model session lost: GGUF native trap:\
 ${String(ae.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(ae.message??"")&&(_.lost=!0),ae)}finally{
F.signal?.removeEventListener("abort",R),_.active=null,_.requestId=null,_.status=_.lost?"lost":"ready"}}return async(C={},F={})=>{
if(T(),C.command==="load")return k(C,F);if(C.command==="generate")return $(C,F);const _=Ze(C.sessionId);if(C.command==="\
status")return y?.sessionId===_?nn(y):{sessionId:_,status:"absent"};if(!y||y.sessionId!==_)throw new Error("Model sessio\
n lost or not loaded");if(C.command==="cancel")return y.requestId===C.requestId&&y.active?.abort(eo()),{sessionId:_,cancellationRequested:!0};
if(C.command==="unload"){if(y.status==="generating")throw new Error("Cancel and await GGUF generation before unloading");
return y.residency.abort("GGUF unload"),y.reader?.close(),y.engine?.close(),y=null,{sessionId:_,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const Mo=Lo(),$o=(c,w)=>Mo(c,w);export{Lo as createGgufTaskRuntime,$o as handleModelTask};

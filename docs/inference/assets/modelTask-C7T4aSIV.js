import{c as fi}from"./GgufArtifactReader-DZX454k1.js";import{t as ie,v as tt,l as di,C as mi,c as pi,M as Er,a as hr,b as gi}from"./ArtifactReadBridge-Bns2fboi.js";
import{validateImageInput as lt,normalizeModelMessages as hi}from"./modelTask-DDS8dEO6.js";import{v as ft}from"./runtimeDefinition-BbETJy7k.js";
import{s as Xa}from"./sha2-BwZiqLOA.js";import{n as ir,e as bi,a as _i,A as vi,b as yi}from"./ArtifactManifest-DPFdnZW5.js";
function wi(n,u){const f=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};var m=!!globalThis.
window,g=!!globalThis.WorkerGlobalScope,p=globalThis.process?.versions?.node&&globalThis.process?.type!="renderer",h=g&&
self.name?.startsWith("em-pthread");if(p){var N=require("worker_threads");global.Worker=N.Worker,g=!N.isMainThread,h=g&&
N.workerData=="em-pthread"}var B="./this.program",x=(e,r)=>{throw r},y=globalThis.document?.currentScript?.src;typeof __filename<
"u"?y=__filename:g&&(y=self.location.href);var R="";function T(e){return n.locateFile?n.locateFile(e,R):R+e}var G,w;if(p){
var D=require("fs");R=__dirname+"/",w=e=>{e=be(e)?new URL(e):e;var r=D.readFileSync(e);return r},G=async(e,r=!0)=>{e=be(
e)?new URL(e):e;var t=D.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(B=process.argv[1].replace(/\\/g,
"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=n),x=(e,r)=>{throw process.exitCode=e,r}}else if(m||g){try{
R=new URL(".",y).href}catch{}p||(g&&(w=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType="arraybuffe\
r",r.send(null),new Uint8Array(r.response)}),G=async e=>{if(be(e))return new Promise((t,a)=>{var i=new XMLHttpRequest;i.
open("GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}
a(i.status)},i.onerror=a,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();
throw new Error(r.status+" : "+r.url)})}var L=console.log.bind(console),q=console.error.bind(console);if(p){var Z=require("util"),
ve=e=>typeof e=="object"?Z.inspect(e):e;L=(...e)=>D.writeSync(1,e.map(ve).join(" ")+`
`),q=(...e)=>D.writeSync(2,e.map(ve).join(" ")+`
`)}var de=L,se=q,ce,ue,pe=!1,ne;function ke(e,r){e||ye(r)}var be=e=>e.startsWith("file://");function l(){Ne.buffer!=Q.buffer&&
sr()}if(p&&h){var Be=N.parentPort;Be.on("message",e=>global.onmessage?.({data:e})),Object.assign(globalThis,{self:global,
postMessage:e=>Be.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({cmd:"uncaughtException",error:e}),process.
exit(1)})}var j;if(h){var U=!1;self.onunhandledrejection=r=>{throw r.reason||r};async function e(r){try{var t=r.data,a=t.
cmd;if(a==="load"){let i=[];self.onmessage=s=>i.push(s),j=()=>{postMessage({cmd:"loaded"});for(let s of i)e(s);self.onmessage=
e};for(const s of t.handlers)(!n[s]||n[s].proxy)&&(n[s]=(...c)=>{postMessage({cmd:"callHandler",handler:s,args:c})},s=="\
print"&&(de=n[s]),s=="printErr"&&(se=n[s]));Ne=t.wasmMemory,sr(),ue=t.wasmModule,_t(),gr()}else if(a==="run"){An(t.pthread_ptr),
Kr(t.pthread_ptr,0,0,1,0,0),K.threadInitTLS(),Dr(t.pthread_ptr),U||(U=!0);try{await Ft(t.start_routine,t.arg)}catch(i){if(i!=
"unwind")throw i}}else t.target==="setimmediate"||(a==="checkMailbox"?U&&fr():a&&(se(`worker: received unknown command ${a}`),
se(t)))}catch(i){throw Ga(),i}}self.onmessage=e}var Q,X,ee,F,A,le,ae,J,I,Ce=!1;function sr(){var e=Ne.buffer;Q=new Int8Array(
e),ee=new Int16Array(e),n.HEAPU8=X=new Uint8Array(e),F=new Int32Array(e),A=new Uint32Array(e),le=new Float32Array(e),ae=
new Float64Array(e),J=new BigInt64Array(e),I=new BigUint64Array(e)}function wn(){if(!h){if(n.wasmMemory)Ne=n.wasmMemory;else{
var e=n.INITIAL_MEMORY||134217728;Ne=new WebAssembly.Memory({initial:BigInt(e/65536),maximum:65536n,shared:!0,address:"i\
64"})}sr()}}function En(){if(n.preRun)for(typeof n.preRun=="function"&&(n.preRun=[n.preRun]);n.preRun.length;)St(n.preRun.
shift());Et(kt)}function ht(){if(Ce=!0,h)return j();!n.noFSInit&&!o.initialized&&o.init(),Re.__wasm_call_ctors(),o.ignorePermissions=
!1}function kn(){if(!h){if(n.postRun)for(typeof n.postRun=="function"&&(n.postRun=[n.postRun]);n.postRun.length;)In(n.postRun.
shift());Et(It)}}function ye(e){n.onAbort?.(e),e="Aborted("+e+")",se(e),pe=!0,e+=". Build with -sASSERTIONS for more inf\
o.",Ce&&Ta();var r=new WebAssembly.RuntimeError(e);throw r}var Br;function Sn(){return T("wllama.wasm")}function Bn(e){if(e==
Br&&ce)return new Uint8Array(ce);if(w)return w(e);throw"both async and sync fetching of the wasm failed"}async function xn(e){
if(!ce)try{var r=await G(e);return new Uint8Array(r)}catch{}return Bn(e)}async function Gn(e,r){try{var t=await xn(e),a=await WebAssembly.
instantiate(t,r);return a}catch(i){se(`failed to asynchronously prepare wasm: ${i}`),ye(i)}}async function Nn(e,r,t){if(!e&&
!be(r)&&!p)try{var a=fetch(r,{credentials:"same-origin"}),i=await WebAssembly.instantiateStreaming(a,t);return i}catch(s){
se(`wasm streaming compile failed: ${s}`),se("falling back to ArrayBuffer instantiation")}return Gn(r,t)}function bt(){ci(),
Pe.__instrumented||(Pe.__instrumented=!0,we.instrumentWasmImports(Pe));var e={env:Pe,wasi_snapshot_preview1:Pe};return e}
async function _t(){function e(c,d){return Re=c.exports,Re=we.instrumentWasmExports(Re),Re=ui(Re),Fn(Re._emscripten_tls_init),
si(Re),ue=d,cr(),Re}ur();function r(c){return e(c.instance,c.module)}var t=bt();if(n.instantiateWasm)return new Promise(
(c,d)=>{n.instantiateWasm(t,(v,S)=>{c(e(v,S))})});if(h){var a=new WebAssembly.Instance(ue,bt());return e(a,ue)}Br??=Sn();
var i=await Nn(ce,Br,t),s=r(i);return s}class vt{name="ExitStatus";constructor(r){this.message=`Program terminated with \
exit(${r})`,this.status=r}}var yt=e=>{e.terminate(),e.onmessage=r=>{}},wt=e=>{var r=K.pthreads[e];K.returnWorkerToPool(r)},
Et=e=>{for(;e.length>0;)e.shift()(n)},kt=[],St=e=>kt.push(e),De=0,Je=null,cr=e=>{if(De--,n.monitorRunDependencies?.(De),
De==0&&Je){var r=Je;Je=null,r()}},ur=e=>{De++,n.monitorRunDependencies?.(De)},Bt=e=>{var r=K.getNewWorker();if(!r)return 6;
K.runningWorkers.push(r),K.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,
arg:e.arg,pthread_ptr:e.pthread_ptr};return p&&r.unref(),r.postMessage(t,e.transferList),0},lr=0,xr=()=>Ar||lr>0,xe=()=>Oa(),
Ge=e=>Ua(e),Gr=e=>Ra(e),me=(e,r,t,...a)=>{for(var i=a.length*2,s=xe(),c=Gr(i*8),d=c/8,v=0;v<a.length;v++){var S=a[v];typeof S==
"bigint"?((l(),J)[d+2*v]=1n,(l(),J)[d+2*v+1]=S):((l(),J)[d+2*v]=0n,(l(),ae)[d+2*v+1]=S)}var k=Na(e,r,i,c,t);return Ge(s),
k};function xt(e){if(h)return me(0,0,1,e);ne=e,xr()||(K.terminateAllThreads(),n.onExit?.(e),pe=!0),x(e,new vt(e))}function Gt(e){
if(h)return me(1,0,0,e);Nr(e)}var Nt=(e,r)=>{if(ne=e,h)throw Gt(e),"unwind";xt(e)},Nr=Nt,K={unusedWorkers:[],runningWorkers:[],
tlsInitFunctions:[],pthreads:{},init(){h||K.initMainThread()},initMainThread(){for(var e=n.pthreadPoolSize;e--;)K.allocateUnusedWorker();
St(async()=>{var r=K.loadWasmModuleToAllWorkers();ur(),await r,cr()})},terminateAllThreads:()=>{for(var e of K.runningWorkers)
yt(e);for(var e of K.unusedWorkers)yt(e);K.unusedWorkers=[],K.runningWorkers=[],K.pthreads={}},returnWorkerToPool:e=>{var r=e.
pthread_ptr;delete K.pthreads[r],K.unusedWorkers.push(e),K.runningWorkers.splice(K.runningWorkers.indexOf(e),1),e.pthread_ptr=
0,Ia(r)},threadInitTLS(){K.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(r=>{e.onmessage=s=>{var c=s.
data,d=c.cmd;if(c.targetThread&&c.targetThread!=pr()){var v=K.pthreads[c.targetThread];v?v.postMessage(c,c.transferList):
se(`Internal error! Worker sent a message "${d}" to target pthread ${c.targetThread}, but that thread no longer exists!`);
return}d==="checkMailbox"?fr():d==="spawnThread"?Bt(c):d==="cleanupThread"?Fe(()=>wt(c.thread)):d==="loaded"?(e.loaded=!0,
p&&!e.pthread_ptr&&e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):d==="uncaughtException"?e.onerror(c.error):
d==="callHandler"?n[c.handler](...c.args):d&&se(`worker sent an unknown command ${d}`)},e.onerror=s=>{var c="worker sent\
 an error!";throw se(`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},p&&(e.on("message",s=>e.onmessage({data:s})),e.on(
"error",s=>e.onerror(s)));var t=[],a=["onExit","onAbort","print","printErr"];for(var i of a)n.propertyIsEnumerable(i)&&t.
push(i);e.postMessage({cmd:"load",handlers:t,wasmMemory:Ne,wasmModule:ue})}),async loadWasmModuleToAllWorkers(){return h?
void 0:Promise.all(K.unusedWorkers.map(K.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=y;n.mainScriptUrlOrBlob&&
(r=n.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new f(r,{workerData:"em-pthread",name:"em-pth\
read"}),K.unusedWorkers.push(e)},getNewWorker(){return K.unusedWorkers.length==0&&(K.allocateUnusedWorker(),K.loadWasmModuleToWorker(
K.unusedWorkers[0])),K.unusedWorkers.pop()}},It=[],In=e=>It.push(e);function An(e){var r=Number((l(),I)[(e+88)/8]),t=Number(
(l(),I)[(e+96)/8]),a=r-t;Ca(r,a),Ge(r)}var Ir=[],At=e=>{e=Number(e);var r=Ir[e];return r||(Ir[e]=r=Ma.get(BigInt(e)),we.
isAsyncExport(r)&&(Ir[e]=r=we.makeAsyncFunction(r))),r},Ft=async(e,r)=>{lr=0,Ar=0;var t=(i=>WebAssembly.promising(At(e)).
call(null,BigInt(i)))(r);function a(i){if(xr()){ne=i;return}Xr(i)}t=await t,a(t)};Ft.isAsync=!0;var Ar=!0,Fn=e=>K.tlsInitFunctions.
push(e),Ne;function Tt(e,r,t,a){return h?me(2,0,1,e,r,t,a):Ct(e,r,t,a)}var Tn=()=>!!globalThis.SharedArrayBuffer,Cn=9007199254740992,
Un=-9007199254740992,E=e=>e<Un||e>Cn?NaN:Number(e);function Ct(e,r,t,a){if(e=E(e),r=E(r),t=E(t),a=E(a),!Tn())return 6;var i=[],
s=0;if(h&&(i.length===0||s))return Tt(e,r,t,a);var c={startRoutine:t,pthread_ptr:e,arg:a,transferList:i};return h?(c.cmd=
"spawnThread",postMessage(c,i),0):Bt(c)}var Le=()=>{var e=Number((l(),I)[te.varargs/8]);return te.varargs+=8,e},Fr=()=>{
var e=(l(),F)[+te.varargs/4];return te.varargs+=4,e},re={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,a=e.length-1;a>=0;a--){var i=e[a];i==="."?e.splice(a,1):i===
".."?(e.splice(a,1),t++):t&&(e.splice(a,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=re.isAbs(e),
t=e.slice(-1)==="/";return e=re.normalizeArray(e.split("/").filter(a=>!!a),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),
(r?"/":"")+e},dirname:e=>{var r=re.splitPath(e),t=r[0],a=r[1];return!t&&!a?".":(a&&(a=a.slice(0,-1)),t+a)},basename:e=>e&&
e.match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>re.normalize(e.join("/")),join2:(e,r)=>re.normalize(e+"/"+r)},Rn=()=>e=>e.set(
crypto.getRandomValues(new Uint8Array(e.byteLength))),Tr=e=>{(Tr=Rn())(e)},Qe={resolve:(...e)=>{for(var r="",t=!1,a=e.length-
1;a>=-1&&!t;a--){var i=a>=0?e[a]:o.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be st\
rings");if(!i)return"";r=i+"/"+r,t=re.isAbs(i)}return r=re.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"\
/":"")+r||"."},relative:(e,r)=>{e=Qe.resolve(e).slice(1),r=Qe.resolve(r).slice(1);function t(S){for(var k=0;k<S.length&&
S[k]==="";k++);for(var O=S.length-1;O>=0&&S[O]==="";O--);return k>O?[]:S.slice(k,O-k+1)}for(var a=t(e.split("/")),i=t(r.
split("/")),s=Math.min(a.length,i.length),c=s,d=0;d<s;d++)if(a[d]!==i[d]){c=d;break}for(var v=[],d=c;d<a.length;d++)v.push(
"..");return v=v.concat(i.slice(c)),v.join("/")}},Ut=globalThis.TextDecoder&&new TextDecoder,On=(e,r,t,a)=>{for(var i=r+
t;e[r]&&!(r>=i);)++r;return r},We=(e,r=0,t,a)=>{var i=On(e,r,t);if(i-r>16&&e.buffer&&Ut)return Ut.decode(e.buffer instanceof
ArrayBuffer?e.subarray(r,i):e.slice(r,i));for(var s="";r<i;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}
var d=e[r++]&63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|d);continue}var v=e[r++]&63;if((c&240)==224?c=(c&15)<<
12|d<<6|v:c=(c&7)<<18|d<<12|v<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var S=c-65536;s+=String.fromCharCode(55296|
S>>10,56320|S&1023)}}return s},Cr=[],Ie=e=>{for(var r=0,t=0;t<e.length;++t){var a=e.charCodeAt(t);a<=127?r++:a<=2047?r+=
2:a>=55296&&a<=57343?(r+=4,++t):r+=3}return r},Rt=(e,r,t,a)=>{if(!(a>0))return 0;for(var i=t,s=t+a-1,c=0;c<e.length;++c){
var d=e.codePointAt(c);if(d<=127){if(t>=s)break;r[t++]=d}else if(d<=2047){if(t+1>=s)break;r[t++]=192|d>>6,r[t++]=128|d&63}else if(d<=
65535){if(t+2>=s)break;r[t++]=224|d>>12,r[t++]=128|d>>6&63,r[t++]=128|d&63}else{if(t+3>=s)break;r[t++]=240|d>>18,r[t++]=
128|d>>12&63,r[t++]=128|d>>6&63,r[t++]=128|d&63,c++}}return r[t]=0,t-i},Ur=(e,r,t)=>{var a=Ie(e)+1,i=new Array(a),s=Rt(e,
i,0,i.length);return i.length=s,i},Mn=()=>{if(!Cr.length){var e=null;if(p){var r=256,t=Buffer.alloc(r),a=0,i=process.stdin.
fd;try{a=D.readSync(i,t,0,r)}catch(s){if(s.toString().includes("EOF"))a=0;else throw s}a>0&&(e=t.slice(0,a).toString("ut\
f-8"))}else globalThis.window?.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;Cr=Ur(e)}return Cr.shift()},ze={ttys:[],init(){},shutdown(){},register(e,r){ze.ttys[e]={input:[],output:[],
ops:r},o.registerDevice(e,ze.stream_ops)},stream_ops:{open(e){var r=ze.ttys[e.node.rdev];if(!r)throw new o.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,a,i){if(!e.tty||!e.tty.
ops.get_char)throw new o.ErrnoError(60);for(var s=0,c=0;c<a;c++){var d;try{d=e.tty.ops.get_char(e.tty)}catch{throw new o.
ErrnoError(29)}if(d===void 0&&s===0)throw new o.ErrnoError(6);if(d==null)break;s++,r[t+c]=d}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,a,i){if(!e.tty||!e.tty.ops.put_char)throw new o.ErrnoError(60);try{for(var s=0;s<a;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new o.ErrnoError(29)}return a&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return Mn()},put_char(e,r){r===null||r===10?(de(We(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){e.output?.length>
0&&(de(We(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,c_lflag:35387,c_cc:[3,28,127,
21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},ioctl_tiocgwinsz(e){return[
24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(se(We(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){
e.output?.length>0&&(se(We(e.output)),e.output=[])}}},jn=(e,r)=>(l(),X).fill(0,e,e+r),Ot=(e,r)=>Math.ceil(e/r)*r,Rr=e=>{
e=Ot(e,65536);var r=xa(65536,e);return r&&jn(r,e),r},W={ops_table:null,mount(e){return W.createNode(null,"/",16895,0)},createNode(e,r,t,a){
if(o.isBlkdev(t)||o.isFIFO(t))throw new o.ErrnoError(63);W.ops_table||={dir:{node:{getattr:W.node_ops.getattr,setattr:W.
node_ops.setattr,lookup:W.node_ops.lookup,mknod:W.node_ops.mknod,rename:W.node_ops.rename,unlink:W.node_ops.unlink,rmdir:W.
node_ops.rmdir,readdir:W.node_ops.readdir,symlink:W.node_ops.symlink},stream:{llseek:W.stream_ops.llseek}},file:{node:{getattr:W.
node_ops.getattr,setattr:W.node_ops.setattr},stream:{llseek:W.stream_ops.llseek,read:W.stream_ops.read,write:W.stream_ops.
write,mmap:W.stream_ops.mmap,msync:W.stream_ops.msync}},link:{node:{getattr:W.node_ops.getattr,setattr:W.node_ops.setattr,
readlink:W.node_ops.readlink},stream:{}},chrdev:{node:{getattr:W.node_ops.getattr,setattr:W.node_ops.setattr},stream:o.chrdev_stream_ops}};
var i=o.createNode(e,r,t,a);return o.isDir(i.mode)?(i.node_ops=W.ops_table.dir.node,i.stream_ops=W.ops_table.dir.stream,
i.contents={}):o.isFile(i.mode)?(i.node_ops=W.ops_table.file.node,i.stream_ops=W.ops_table.file.stream,i.usedBytes=0,i.contents=
null):o.isLink(i.mode)?(i.node_ops=W.ops_table.link.node,i.stream_ops=W.ops_table.link.stream):o.isChrdev(i.mode)&&(i.node_ops=
W.ops_table.chrdev.node,i.stream_ops=W.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.
atime=e.mtime=e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,
e.usedBytes):new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=
r)){var a=1024*1024;r=Math.max(r,t*(t<a?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(
r),e.usedBytes>0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=
null,e.usedBytes=0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),
e.usedBytes=r}},node_ops:{getattr(e){var r={};return r.dev=o.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,
r.uid=0,r.gid=0,r.rdev=e.rdev,o.isDir(e.mode)?r.size=4096:o.isFile(e.mode)?r.size=e.usedBytes:o.isLink(e.mode)?r.size=e.
link.length:r.size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=
Math.ceil(r.size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==
void 0&&W.resizeFileStorage(e,r.size)},lookup(e,r){throw W.doesNotExistError||(W.doesNotExistError=new o.ErrnoError(44),
W.doesNotExistError.stack="<generic error, no stack>"),W.doesNotExistError},mknod(e,r,t,a){return W.createNode(e,r,t,a)},
rename(e,r,t){var a;try{a=o.lookupNode(r,t)}catch{}if(a){if(o.isDir(e.mode))for(var i in a.contents)throw new o.ErrnoError(
55);o.hashRemoveNode(a)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.
mtime=Date.now()},unlink(e,r){delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=o.lookupNode(e,r);for(var a in t.
contents)throw new o.ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.
keys(e.contents)]},symlink(e,r,t){var a=W.createNode(e,r,41471,0);return a.link=t,a},readlink(e){if(!o.isLink(e.mode))throw new o.
ErrnoError(28);return e.link}},stream_ops:{read(e,r,t,a,i){var s=e.node.contents;if(i>=e.node.usedBytes)return 0;var c=Math.
min(e.node.usedBytes-i,a);if(c>8&&s.subarray)r.set(s.subarray(i,i+c),t);else for(var d=0;d<c;d++)r[t+d]=s[i+d];return c},
write(e,r,t,a,i,s){if(r.buffer===(l(),Q).buffer&&(s=!1),!a)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&
(!c.contents||c.contents.subarray)){if(s)return c.contents=r.subarray(t,t+a),c.usedBytes=a,a;if(c.usedBytes===0&&i===0)return c.
contents=r.slice(t,t+a),c.usedBytes=a,a;if(i+a<=c.usedBytes)return c.contents.set(r.subarray(t,t+a),i),a}if(W.expandFileStorage(
c,i+a),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+a),i);else for(var d=0;d<a;d++)c.contents[i+d]=r[t+
d];return c.usedBytes=Math.max(c.usedBytes,i+a),a},llseek(e,r,t){var a=r;if(t===1?a+=e.position:t===2&&o.isFile(e.node.mode)&&
(a+=e.node.usedBytes),a<0)throw new o.ErrnoError(28);return a},mmap(e,r,t,a,i){if(!o.isFile(e.node.mode))throw new o.ErrnoError(
43);var s,c,d=e.node.contents;if(!(i&2)&&d&&d.buffer===(l(),Q).buffer)c=!1,s=d.byteOffset;else{if(c=!0,s=Rr(r),!s)throw new o.
ErrnoError(48);d&&((t>0||t+r<d.length)&&(d.subarray?d=d.subarray(t,t+r):d=Array.prototype.slice.call(d,t,t+r)),(l(),Q).set(
d,s))}return{ptr:s,allocated:c}},msync(e,r,t,a,i){return W.stream_ops.write(e,r,0,a,t,!1),0}}},Dn=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},Or=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},zn=async e=>{var r=await G(e);return new Uint8Array(r)},Mt=(...e)=>o.createDataFile(
...e),jt=[],qn=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of jt)if(t.canHandle(r))return t.handle(e,r);return e},
Mr=async(e,r,t,a,i,s,c,d)=>{var v=r?Qe.resolve(re.join2(e,r)):e;ur();try{var S=t;typeof t=="string"&&(S=await zn(t)),S=await qn(
S,v),d?.(),s||Mt(e,r,S,a,i,c)}finally{cr()}},Ln=(e,r,t,a,i,s,c,d,v,S)=>{Mr(e,r,t,a,i,d,v,S).then(s).catch(c)},o={root:null,
mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,filesystems:null,
syncFSRequests:0,readFiles:{},ErrnoError:class{name="ErrnoError";constructor(e){this.errno=e}},FSStream:class{shared={};get object(){
return this.node}set object(e){this.node=e}get isRead(){return(this.flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==
0}get isAppend(){return this.flags&1024}get flags(){return this.shared.flags}set flags(e){this.shared.flags=e}get position(){
return this.shared.position}set position(e){this.shared.position=e}},FSNode:class{node_ops={};stream_ops={};readMode=365;writeMode=146;mounted=null;constructor(e,r,t,a){
e||(e=this),this.parent=e,this.mount=e.mount,this.id=o.nextInode++,this.name=r,this.mode=t,this.rdev=a,this.atime=this.mtime=
this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){e?this.mode|=this.readMode:
this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){e?this.mode|=this.writeMode:
this.mode&=~this.writeMode}get isFolder(){return o.isDir(this.mode)}get isDevice(){return o.isChrdev(this.mode)}},lookupPath(e,r={}){
if(!e)throw new o.ErrnoError(44);r.follow_mount??=!0,re.isAbs(e)||(e=o.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var a=e.
split("/").filter(S=>!!S),i=o.root,s="/",c=0;c<a.length;c++){var d=c===a.length-1;if(d&&r.parent)break;if(a[c]!=="."){if(a[c]===
".."){if(s=re.dirname(s),o.isRoot(i)){e=s+"/"+a.slice(c+1).join("/"),t--;continue e}else i=i.parent;continue}s=re.join2(
s,a[c]);try{i=o.lookupNode(i,a[c])}catch(S){if(S?.errno===44&&d&&r.noent_okay)return{path:s};throw S}if(o.isMountpoint(i)&&
(!d||r.follow_mount)&&(i=i.mounted.root),o.isLink(i.mode)&&(!d||r.follow)){if(!i.node_ops.readlink)throw new o.ErrnoError(
52);var v=i.node_ops.readlink(i);re.isAbs(v)||(v=re.dirname(s)+"/"+v),e=v+"/"+a.slice(c+1).join("/");continue e}}}return{
path:s,node:i}}throw new o.ErrnoError(32)},getPath(e){for(var r;;){if(o.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.
length-1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:e.name,e=e.parent}},hashName(e,r){for(var t=0,a=0;a<r.length;a++)
t=(t<<5)-t+r.charCodeAt(a)|0;return(e+t>>>0)%o.nameTable.length},hashAddNode(e){var r=o.hashName(e.parent.id,e.name);e.name_next=
o.nameTable[r],o.nameTable[r]=e},hashRemoveNode(e){var r=o.hashName(e.parent.id,e.name);if(o.nameTable[r]===e)o.nameTable[r]=
e.name_next;else for(var t=o.nameTable[r];t;){if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){
var t=o.mayLookup(e);if(t)throw new o.ErrnoError(t);for(var a=o.hashName(e.id,r),i=o.nameTable[a];i;i=i.name_next){var s=i.
name;if(i.parent.id===e.id&&s===r)return i}return o.lookup(e,r)},createNode(e,r,t,a){var i=new o.FSNode(e,r,t,a);return o.
hashAddNode(i),i},destroyNode(e){o.hashRemoveNode(e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},
isFile(e){return(e&61440)===32768},isDir(e){return(e&61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&
61440)===8192},isBlkdev(e){return(e&61440)===24576},isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},
flagsToPermissionString(e){var r=["r","w","rw"][e&3];return e&512&&(r+="w"),r},nodePermissions(e,r){return o.ignorePermissions?
0:r.includes("r")&&!(e.mode&292)||r.includes("w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!o.
isDir(e.mode))return 54;var r=o.nodePermissions(e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!o.isDir(e.mode))
return 54;try{var t=o.lookupNode(e,r);return 20}catch{}return o.nodePermissions(e,"wx")},mayDelete(e,r,t){var a;try{a=o.
lookupNode(e,r)}catch(s){return s.errno}var i=o.nodePermissions(e,"wx");if(i)return i;if(t){if(!o.isDir(a.mode))return 54;
if(o.isRoot(a)||o.getPath(a)===o.cwd())return 10}else if(o.isDir(a.mode))return 31;return 0},mayOpen(e,r){return e?o.isLink(
e.mode)?32:o.isDir(e.mode)&&(o.flagsToPermissionString(r)!=="r"||r&576)?31:o.nodePermissions(e,o.flagsToPermissionString(
r)):44},checkOpExists(e,r){if(!e)throw new o.ErrnoError(r);return e},MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=o.MAX_OPEN_FDS;e++)
if(!o.streams[e])return e;throw new o.ErrnoError(33)},getStreamChecked(e){var r=o.getStream(e);if(!r)throw new o.ErrnoError(
8);return r},getStream:e=>o.streams[e],createStream(e,r=-1){return e=Object.assign(new o.FSStream,e),r==-1&&(r=o.nextfd()),
e.fd=r,o.streams[r]=e,e},closeStream(e){o.streams[e]=null},dupStream(e,r=-1){var t=o.createStream(e,r);return t.stream_ops?.
dup?.(t),t},doSetAttr(e,r,t){var a=e?.stream_ops.setattr,i=a?e:r;a??=r.node_ops.setattr,o.checkOpExists(a,63),a(i,t)},chrdev_stream_ops:{
open(e){var r=o.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,e.stream_ops.open?.(e)},llseek(){throw new o.ErrnoError(
70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){o.devices[e]={stream_ops:r}},getDevice:e=>o.
devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var a=t.pop();r.push(a),t.push(...a.mounts)}return r},syncfs(e,r){
typeof e=="function"&&(r=e,e=!1),o.syncFSRequests++,o.syncFSRequests>1&&se(`warning: ${o.syncFSRequests} FS.syncfs opera\
tions in flight at once, probably just doing extra work`);var t=o.getMounts(o.root.mount),a=0;function i(d){return o.syncFSRequests--,
r(d)}function s(d){if(d)return s.errored?void 0:(s.errored=!0,i(d));++a>=t.length&&i(null)}for(var c of t)c.type.syncfs?
c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var a=t==="/",i=!t,s;if(a&&o.root)throw new o.ErrnoError(10);if(!a&&!i){var c=o.
lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,o.isMountpoint(s))throw new o.ErrnoError(10);if(!o.isDir(s.mode))throw new o.
ErrnoError(54)}var d={type:e,opts:r,mountpoint:t,mounts:[]},v=e.mount(d);return v.mount=d,d.root=v,a?o.root=v:s&&(s.mounted=
d,s.mount&&s.mount.mounts.push(d)),v},unmount(e){var r=o.lookupPath(e,{follow_mount:!1});if(!o.isMountpoint(r.node))throw new o.
ErrnoError(28);var t=r.node,a=t.mounted,i=o.getMounts(a);for(var[s,c]of Object.entries(o.nameTable))for(;c;){var d=c.name_next;
i.includes(c.mount)&&o.destroyNode(c),c=d}t.mounted=null;var v=t.mount.mounts.indexOf(a);t.mount.mounts.splice(v,1)},lookup(e,r){
return e.node_ops.lookup(e,r)},mknod(e,r,t){var a=o.lookupPath(e,{parent:!0}),i=a.node,s=re.basename(e);if(!s)throw new o.
ErrnoError(28);if(s==="."||s==="..")throw new o.ErrnoError(20);var c=o.mayCreate(i,s);if(c)throw new o.ErrnoError(c);if(!i.
node_ops.mknod)throw new o.ErrnoError(63);return i.node_ops.mknod(i,s,r,t)},statfs(e){return o.statfsNode(o.lookupPath(e,
{follow:!0}).node)},statfsStream(e){return o.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,frsize:4096,blocks:1e6,
bfree:5e5,bavail:5e5,files:o.nextInode,ffree:o.nextInode-1,fsid:42,flags:2,namelen:255};return e.node_ops.statfs&&Object.
assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,o.mknod(e,r,0)},mkdir(e,r=511){
return r&=1023,r|=16384,o.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),a="";for(var i of t)if(i){(a||re.isAbs(e))&&(a+=
"/"),a+=i;try{o.mkdir(a,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=r,r=438),r|=8192,o.mknod(
e,r,t)},symlink(e,r){if(!Qe.resolve(e))throw new o.ErrnoError(44);var t=o.lookupPath(r,{parent:!0}),a=t.node;if(!a)throw new o.
ErrnoError(44);var i=re.basename(r),s=o.mayCreate(a,i);if(s)throw new o.ErrnoError(s);if(!a.node_ops.symlink)throw new o.
ErrnoError(63);return a.node_ops.symlink(a,i,e)},rename(e,r){var t=re.dirname(e),a=re.dirname(r),i=re.basename(e),s=re.basename(
r),c,d,v;if(c=o.lookupPath(e,{parent:!0}),d=c.node,c=o.lookupPath(r,{parent:!0}),v=c.node,!d||!v)throw new o.ErrnoError(
44);if(d.mount!==v.mount)throw new o.ErrnoError(75);var S=o.lookupNode(d,i),k=Qe.relative(e,a);if(k.charAt(0)!==".")throw new o.
ErrnoError(28);if(k=Qe.relative(r,t),k.charAt(0)!==".")throw new o.ErrnoError(55);var O;try{O=o.lookupNode(v,s)}catch{}if(S!==
O){var C=o.isDir(S.mode),M=o.mayDelete(d,i,C);if(M)throw new o.ErrnoError(M);if(M=O?o.mayDelete(v,s,C):o.mayCreate(v,s),
M)throw new o.ErrnoError(M);if(!d.node_ops.rename)throw new o.ErrnoError(63);if(o.isMountpoint(S)||O&&o.isMountpoint(O))
throw new o.ErrnoError(10);if(v!==d&&(M=o.nodePermissions(d,"w"),M))throw new o.ErrnoError(M);o.hashRemoveNode(S);try{d.
node_ops.rename(S,v,s),S.parent=v}catch(P){throw P}finally{o.hashAddNode(S)}}},rmdir(e){var r=o.lookupPath(e,{parent:!0}),
t=r.node,a=re.basename(e),i=o.lookupNode(t,a),s=o.mayDelete(t,a,!0);if(s)throw new o.ErrnoError(s);if(!t.node_ops.rmdir)
throw new o.ErrnoError(63);if(o.isMountpoint(i))throw new o.ErrnoError(10);t.node_ops.rmdir(t,a),o.destroyNode(i)},readdir(e){
var r=o.lookupPath(e,{follow:!0}),t=r.node,a=o.checkOpExists(t.node_ops.readdir,54);return a(t)},unlink(e){var r=o.lookupPath(
e,{parent:!0}),t=r.node;if(!t)throw new o.ErrnoError(44);var a=re.basename(e),i=o.lookupNode(t,a),s=o.mayDelete(t,a,!1);
if(s)throw new o.ErrnoError(s);if(!t.node_ops.unlink)throw new o.ErrnoError(63);if(o.isMountpoint(i))throw new o.ErrnoError(
10);t.node_ops.unlink(t,a),o.destroyNode(i)},readlink(e){var r=o.lookupPath(e),t=r.node;if(!t)throw new o.ErrnoError(44);
if(!t.node_ops.readlink)throw new o.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=o.lookupPath(e,{follow:!r}),
a=t.node,i=o.checkOpExists(a.node_ops.getattr,63);return i(a)},fstat(e){var r=o.getStreamChecked(e),t=r.node,a=r.stream_ops.
getattr,i=a?r:t;return a??=t.node_ops.getattr,o.checkOpExists(a,63),a(i)},lstat(e){return o.stat(e,!0)},doChmod(e,r,t,a){
o.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:a})},chmod(e,r,t){var a;if(typeof e=="string"){var i=o.
lookupPath(e,{follow:!t});a=i.node}else a=e;o.doChmod(null,a,r,t)},lchmod(e,r){o.chmod(e,r,!0)},fchmod(e,r){var t=o.getStreamChecked(
e);o.doChmod(t,t.node,r,!1)},doChown(e,r,t){o.doSetAttr(e,r,{timestamp:Date.now(),dontFollow:t})},chown(e,r,t,a){var i;if(typeof e==
"string"){var s=o.lookupPath(e,{follow:!a});i=s.node}else i=e;o.doChown(null,i,a)},lchown(e,r,t){o.chown(e,r,t,!0)},fchown(e,r,t){
var a=o.getStreamChecked(e);o.doChown(a,a.node,!1)},doTruncate(e,r,t){if(o.isDir(r.mode))throw new o.ErrnoError(31);if(!o.
isFile(r.mode))throw new o.ErrnoError(28);var a=o.nodePermissions(r,"w");if(a)throw new o.ErrnoError(a);o.doSetAttr(e,r,
{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new o.ErrnoError(28);var t;if(typeof e=="string"){var a=o.lookupPath(
e,{follow:!0});t=a.node}else t=e;o.doTruncate(null,t,r)},ftruncate(e,r){var t=o.getStreamChecked(e);if(r<0||(t.flags&2097155)===
0)throw new o.ErrnoError(28);o.doTruncate(t,t.node,r)},utime(e,r,t){var a=o.lookupPath(e,{follow:!0}),i=a.node,s=o.checkOpExists(
i.node_ops.setattr,63);s(i,{atime:r,mtime:t})},open(e,r,t=438){if(e==="")throw new o.ErrnoError(44);r=typeof r=="string"?
Dn(r):r,r&64?t=t&4095|32768:t=0;var a,i;if(typeof e=="object")a=e;else{i=e.endsWith("/");var s=o.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});a=s.node,e=s.path}var c=!1;if(r&64)if(a){if(r&128)throw new o.ErrnoError(20)}else{if(i)throw new o.
ErrnoError(31);a=o.mknod(e,t|511,0),c=!0}if(!a)throw new o.ErrnoError(44);if(o.isChrdev(a.mode)&&(r&=-513),r&65536&&!o.isDir(
a.mode))throw new o.ErrnoError(54);if(!c){var d=o.mayOpen(a,r);if(d)throw new o.ErrnoError(d)}r&512&&!c&&o.truncate(a,0),
r&=-131713;var v=o.createStream({node:a,path:o.getPath(a),flags:r,seekable:!0,position:0,stream_ops:a.stream_ops,ungotten:[],
error:!1});return v.stream_ops.open&&v.stream_ops.open(v),c&&o.chmod(a,t&511),n.logReadFiles&&!(r&1)&&(e in o.readFiles||
(o.readFiles[e]=1)),v},close(e){if(o.isClosed(e))throw new o.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{o.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(o.isClosed(e))throw new o.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new o.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new o.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,a,i){if(a<
0||i<0)throw new o.ErrnoError(28);if(o.isClosed(e))throw new o.ErrnoError(8);if((e.flags&2097155)===1)throw new o.ErrnoError(
8);if(o.isDir(e.node.mode))throw new o.ErrnoError(31);if(!e.stream_ops.read)throw new o.ErrnoError(28);var s=typeof i<"u";
if(!s)i=e.position;else if(!e.seekable)throw new o.ErrnoError(70);var c=e.stream_ops.read(e,r,t,a,i);return s||(e.position+=
c),c},write(e,r,t,a,i,s){if(a<0||i<0)throw new o.ErrnoError(28);if(o.isClosed(e))throw new o.ErrnoError(8);if((e.flags&2097155)===
0)throw new o.ErrnoError(8);if(o.isDir(e.node.mode))throw new o.ErrnoError(31);if(!e.stream_ops.write)throw new o.ErrnoError(
28);e.seekable&&e.flags&1024&&o.llseek(e,0,2);var c=typeof i<"u";if(!c)i=e.position;else if(!e.seekable)throw new o.ErrnoError(
70);var d=e.stream_ops.write(e,r,t,a,i,s);return c||(e.position+=d),d},mmap(e,r,t,a,i){if((a&2)!==0&&(i&2)===0&&(e.flags&
2097155)!==2)throw new o.ErrnoError(2);if((e.flags&2097155)===1)throw new o.ErrnoError(2);if(!e.stream_ops.mmap)throw new o.
ErrnoError(43);if(!r)throw new o.ErrnoError(28);return e.stream_ops.mmap(e,r,t,a,i)},msync(e,r,t,a,i){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,a,i):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new o.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&ye(`Invalid encoding type "${r.encoding}"`);var t=o.open(e,r.flags),a=o.stat(e),i=a.size,s=new Uint8Array(i);return o.
read(t,s,0,i,0),r.encoding==="utf8"&&(s=We(s)),o.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var a=o.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(Ur(r))),ArrayBuffer.isView(r)?o.write(a,r,0,r.byteLength,void 0,t.canOwn):
ye("Unsupported data type"),o.close(a)},cwd:()=>o.currentPath,chdir(e){var r=o.lookupPath(e,{follow:!0});if(r.node===null)
throw new o.ErrnoError(44);if(!o.isDir(r.node.mode))throw new o.ErrnoError(54);var t=o.nodePermissions(r.node,"x");if(t)
throw new o.ErrnoError(t);o.currentPath=r.path},createDefaultDirectories(){o.mkdir("/tmp"),o.mkdir("/home"),o.mkdir("/ho\
me/web_user")},createDefaultDevices(){o.mkdir("/dev"),o.registerDevice(o.makedev(1,3),{read:()=>0,write:(a,i,s,c,d)=>c,llseek:()=>0}),
o.mkdev("/dev/null",o.makedev(1,3)),ze.register(o.makedev(5,0),ze.default_tty_ops),ze.register(o.makedev(6,0),ze.default_tty1_ops),
o.mkdev("/dev/tty",o.makedev(5,0)),o.mkdev("/dev/tty1",o.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(Tr(
e),r=e.byteLength),e[--r]);o.createDevice("/dev","random",t),o.createDevice("/dev","urandom",t),o.mkdir("/dev/shm"),o.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){o.mkdir("/proc");var e=o.mkdir("/proc/self");o.mkdir("/proc/self/fd"),o.mount(
{mount(){var r=o.createNode(e,"fd",16895,73);return r.stream_ops={llseek:W.stream_ops.llseek},r.node_ops={lookup(t,a){var i=+a,
s=o.getStreamChecked(i),c={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:i+1};return c.parent=
c,c},readdir(){return Array.from(o.streams.entries()).filter(([t,a])=>a).map(([t,a])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?o.createDevice("/dev","stdin",e):o.symlink("/dev/tty","/dev/stdin"),r?o.createDevice(
"/dev","stdout",null,r):o.symlink("/dev/tty","/dev/stdout"),t?o.createDevice("/dev","stderr",null,t):o.symlink("/dev/tty\
1","/dev/stderr"),o.open("/dev/stdin",0),o.open("/dev/stdout",1),o.open("/dev/stderr",1)},staticInit(){o.nameTable=new Array(
4096),o.mount(W,{},"/"),o.createDefaultDirectories(),o.createDefaultDevices(),o.createSpecialDirectories(),o.filesystems=
{MEMFS:W}},init(e,r,t){o.initialized=!0,e??=n.stdin,r??=n.stdout,t??=n.stderr,o.createStandardStreams(e,r,t)},quit(){o.initialized=
!1;for(var e of o.streams)e&&o.close(e)},findObject(e,r){var t=o.analyzePath(e,r);return t.exists?t.object:null},analyzePath(e,r){
try{var t=o.lookupPath(e,{follow:!r});e=t.path}catch{}var a={isRoot:!1,exists:!1,error:0,name:null,path:null,object:null,
parentExists:!1,parentPath:null,parentObject:null};try{var t=o.lookupPath(e,{parent:!0});a.parentExists=!0,a.parentPath=
t.path,a.parentObject=t.node,a.name=re.basename(e),t=o.lookupPath(e,{follow:!r}),a.exists=!0,a.path=t.path,a.object=t.node,
a.name=t.node.name,a.isRoot=t.path==="/"}catch(i){a.error=i.errno}return a},createPath(e,r,t,a){e=typeof e=="string"?e:o.
getPath(e);for(var i=r.split("/").reverse();i.length;){var s=i.pop();if(s){var c=re.join2(e,s);try{o.mkdir(c)}catch(d){if(d.
errno!=20)throw d}e=c}}return c},createFile(e,r,t,a,i){var s=re.join2(typeof e=="string"?e:o.getPath(e),r),c=Or(a,i);return o.
create(s,c)},createDataFile(e,r,t,a,i,s){var c=r;e&&(e=typeof e=="string"?e:o.getPath(e),c=r?re.join2(e,r):e);var d=Or(a,
i),v=o.create(c,d);if(t){if(typeof t=="string"){for(var S=new Array(t.length),k=0,O=t.length;k<O;++k)S[k]=t.charCodeAt(k);
t=S}o.chmod(v,d|146);var C=o.open(v,577);o.write(C,t,0,t.length,0,s),o.close(C),o.chmod(v,d)}},createDevice(e,r,t,a){var i=re.
join2(typeof e=="string"?e:o.getPath(e),r),s=Or(!!t,!!a);o.createDevice.major??=64;var c=o.makedev(o.createDevice.major++,
0);return o.registerDevice(c,{open(d){d.seekable=!1},close(d){a?.buffer?.length&&a(10)},read(d,v,S,k,O){for(var C=0,M=0;M<
k;M++){var P;try{P=t()}catch{throw new o.ErrnoError(29)}if(P===void 0&&C===0)throw new o.ErrnoError(6);if(P==null)break;
C++,v[S+M]=P}return C&&(d.node.atime=Date.now()),C},write(d,v,S,k,O){for(var C=0;C<k;C++)try{a(v[S+C])}catch{throw new o.
ErrnoError(29)}return k&&(d.node.mtime=d.node.ctime=Date.now()),C}}),o.mkdev(i,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||
e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)ye("Lazy loading should have been performed (contents set) in c\
reateLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the\
 main thread.");else try{e.contents=w(e.url)}catch{throw new o.ErrnoError(29)}},createLazyFile(e,r,t,a,i){class s{lengthKnown=!1;chunks=[];get(C){
if(!(C>this.length-1||C<0)){var M=C%this.chunkSize,P=C/this.chunkSize|0;return this.getter(P)[M]}}setDataGetter(C){this.
getter=C}cacheLength(){var C=new XMLHttpRequest;C.open("HEAD",t,!1),C.send(null),C.status>=200&&C.status<300||C.status===
304||ye("Couldn't load "+t+". Status: "+C.status);var M=Number(C.getResponseHeader("Content-length")),P,$=(P=C.getResponseHeader(
"Accept-Ranges"))&&P==="bytes",_=(P=C.getResponseHeader("Content-Encoding"))&&P==="gzip",V=1024*1024;$||(V=M);var H=(he,Ee)=>{
he>Ee&&ye("invalid range ("+he+", "+Ee+") or no bytes requested!"),Ee>M-1&&ye("only "+M+" bytes available! programmer er\
ror!");var fe=new XMLHttpRequest;return fe.open("GET",t,!1),M!==V&&fe.setRequestHeader("Range","bytes="+he+"-"+Ee),fe.responseType=
"arraybuffer",fe.overrideMimeType&&fe.overrideMimeType("text/plain; charset=x-user-defined"),fe.send(null),fe.status>=200&&
fe.status<300||fe.status===304||ye("Couldn't load "+t+". Status: "+fe.status),fe.response!==void 0?new Uint8Array(fe.response||
[]):Ur(fe.responseText||"")},oe=this;oe.setDataGetter(he=>{var Ee=he*V,fe=(he+1)*V-1;return fe=Math.min(fe,M-1),typeof oe.
chunks[he]>"u"&&(oe.chunks[he]=H(Ee,fe)),typeof oe.chunks[he]>"u"&&ye("doXHR failed!"),oe.chunks[he]}),(_||!M)&&(V=M=1,M=
this.getter(0).length,V=M,de("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
M,this._chunkSize=V,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){g||ye("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,d={isDevice:!1,
contents:c}}else var d={isDevice:!1,url:t};var v=o.createFile(e,r,d,a,i);d.contents?v.contents=d.contents:d.url&&(v.contents=
null,v.url=d.url),Object.defineProperties(v,{usedBytes:{get:function(){return this.contents.length}}});var S={};for(const[
O,C]of Object.entries(v.stream_ops))S[O]=(...M)=>(o.forceLoadFile(v),C(...M));function k(O,C,M,P,$){var _=O.node.contents;
if($>=_.length)return 0;var V=Math.min(_.length-$,P);if(_.slice)for(var H=0;H<V;H++)C[M+H]=_[$+H];else for(var H=0;H<V;H++)
C[M+H]=_.get($+H);return V}return S.read=(O,C,M,P,$)=>(o.forceLoadFile(v),k(O,C,M,P,$)),S.mmap=(O,C,M,P,$)=>{o.forceLoadFile(
v);var _=Rr(C);if(!_)throw new o.ErrnoError(48);return k(O,(l(),Q),_,C,M),{ptr:_,allocated:!0}},v.stream_ops=S,v}},He=(e,r,t)=>e?
We((l(),X),e,r):"",te={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(re.isAbs(r))return r;var a;if(e===-100)a=o.cwd();else{var i=te.
getStreamFromFD(e);a=i.path}if(r.length==0){if(!t)throw new o.ErrnoError(44);return a}return a+"/"+r},writeStat(e,r){(l(),
A)[e/4]=r.dev,(l(),A)[(e+4)/4]=r.mode,(l(),I)[(e+8)/8]=BigInt(r.nlink),(l(),A)[(e+16)/4]=r.uid,(l(),A)[(e+20)/4]=r.gid,(l(),
A)[(e+24)/4]=r.rdev,(l(),J)[(e+32)/8]=BigInt(r.size),(l(),F)[(e+40)/4]=4096,(l(),F)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
a=r.mtime.getTime(),i=r.ctime.getTime();return(l(),J)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),I)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),J)[(e+64)/8]=BigInt(Math.floor(a/1e3)),(l(),I)[(e+72)/8]=BigInt(a%1e3*1e3*1e3),(l(),J)[(e+80)/8]=BigInt(Math.
floor(i/1e3)),(l(),I)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(l(),J)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),A)[(e+8)/
4]=r.bsize,(l(),A)[(e+72)/4]=r.bsize,(l(),J)[(e+16)/8]=BigInt(r.blocks),(l(),J)[(e+24)/8]=BigInt(r.bfree),(l(),J)[(e+32)/
8]=BigInt(r.bavail),(l(),J)[(e+40)/8]=BigInt(r.files),(l(),J)[(e+48)/8]=BigInt(r.ffree),(l(),A)[(e+56)/4]=r.fsid,(l(),A)[(e+
80)/4]=r.flags,(l(),A)[(e+64)/4]=r.namelen},doMsync(e,r,t,a,i){if(!o.isFile(r.node.mode))throw new o.ErrnoError(43);if(a&
2)return 0;var s=(l(),X).slice(e,e+t);o.msync(r,s,i,t,a)},getStreamFromFD(e){var r=o.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=He(e);return r}};function Dt(e,r,t){if(h)return me(3,0,1,e,r,t);t=E(t),te.varargs=t;try{var a=te.getStreamFromFD(
e);switch(r){case 0:{var i=Fr();if(i<0)return-28;for(;o.streams[i];)i++;var s;return s=o.dupStream(a,i),s.fd}case 1:case 2:
return 0;case 3:return a.flags;case 4:{var i=Fr();return a.flags|=i,0}case 5:{var i=Le(),c=0;return(l(),ee)[(i+c)/2]=2,0}case 6:case 7:
return 0}return-28}catch(d){if(typeof o>"u"||d.name!=="ErrnoError")throw d;return-d.errno}}function Qn(e,r){if(h)return me(
4,0,1,e,r);r=E(r);try{return te.writeStat(r,o.fstat(e))}catch(t){if(typeof o>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var Ae=(e,r,t)=>Rt(e,(l(),X),r,t);function zt(e,r){if(h)return me(5,0,1,e,r);e=E(e),r=E(r);try{if(r===0)return-28;
var t=o.cwd(),a=Ie(t)+1;return r<a?-68:(Ae(t,e,r),a)}catch(i){if(typeof o>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}
function qt(e,r,t){if(h)return me(6,0,1,e,r,t);r=E(r),t=E(t);try{var a=te.getStreamFromFD(e);a.getdents||=o.readdir(a.path);
for(var i=280,s=0,c=o.llseek(a,0,1),d=Math.floor(c/i),v=Math.min(a.getdents.length,d+Math.floor(t/i)),S=d;S<v;S++){var k,
O,C=a.getdents[S];if(C===".")k=a.node.id,O=4;else if(C===".."){var M=o.lookupPath(a.path,{parent:!0});k=M.node.id,O=4}else{
var P;try{P=o.lookupNode(a.node,C)}catch($){if($?.errno===28)continue;throw $}k=P.id,O=o.isChrdev(P.mode)?2:o.isDir(P.mode)?
4:o.isLink(P.mode)?10:8}(l(),J)[(r+s)/8]=BigInt(k),(l(),J)[(r+s+8)/8]=BigInt((S+1)*i),(l(),ee)[(r+s+16)/2]=280,(l(),Q)[r+
s+18]=O,Ae(C,r+s+19,256),s+=i}return o.llseek(a,S*i,0),s}catch($){if(typeof o>"u"||$.name!=="ErrnoError")throw $;return-$.
errno}}function Lt(e,r,t){if(h)return me(7,0,1,e,r,t);t=E(t),te.varargs=t;try{var a=te.getStreamFromFD(e);switch(r){case 21509:
return a.tty?0:-59;case 21505:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tcgets){var i=a.tty.ops.ioctl_tcgets(a),s=Le();(l(),
F)[s/4]=i.c_iflag||0,(l(),F)[(s+4)/4]=i.c_oflag||0,(l(),F)[(s+8)/4]=i.c_cflag||0,(l(),F)[(s+12)/4]=i.c_lflag||0;for(var c=0;c<
32;c++)(l(),Q)[s+c+17]=i.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:return a.tty?0:-59;case 21506:case 21507:case 21508:{
if(!a.tty)return-59;if(a.tty.ops.ioctl_tcsets){for(var s=Le(),d=(l(),F)[s/4],v=(l(),F)[(s+4)/4],S=(l(),F)[(s+8)/4],k=(l(),
F)[(s+12)/4],O=[],c=0;c<32;c++)O.push((l(),Q)[s+c+17]);return a.tty.ops.ioctl_tcsets(a.tty,r,{c_iflag:d,c_oflag:v,c_cflag:S,
c_lflag:k,c_cc:O})}return 0}case 21519:{if(!a.tty)return-59;var s=Le();return(l(),F)[s/4]=0,0}case 21520:return a.tty?-28:
-59;case 21537:case 21531:{var s=Le();return o.ioctl(a,r,s)}case 21523:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tiocgwinsz){
var C=a.tty.ops.ioctl_tiocgwinsz(a.tty),s=Le();(l(),ee)[s/2]=C[0],(l(),ee)[(s+2)/2]=C[1]}return 0}case 21524:return a.tty?
0:-59;case 21515:return a.tty?0:-59;default:return-28}}catch(M){if(typeof o>"u"||M.name!=="ErrnoError")throw M;return-M.
errno}}function Wn(e,r){if(h)return me(8,0,1,e,r);e=E(e),r=E(r);try{return e=te.getStr(e),te.writeStat(r,o.lstat(e))}catch(t){
if(typeof o>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function $n(e,r,t,a){if(h)return me(9,0,1,e,r,t,a);r=E(r),
t=E(t);try{r=te.getStr(r);var i=a&256,s=a&4096;return a=a&-6401,r=te.calculateAt(e,r,s),te.writeStat(t,i?o.lstat(r):o.stat(
r))}catch(c){if(typeof o>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Qt(e,r,t,a){if(h)return me(10,0,1,e,
r,t,a);r=E(r),a=E(a),te.varargs=a;try{r=te.getStr(r),r=te.calculateAt(e,r);var i=a?Fr():0;return o.open(r,t,i).fd}catch(s){
if(typeof o>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function Wt(e,r){if(h)return me(11,0,1,e,r);e=E(e),r=E(r);
try{return e=te.getStr(e),te.writeStat(r,o.stat(e))}catch(t){if(typeof o>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Pn=()=>ye("");function Vn(e){e=E(e),Kr(e,!g,1,!m,5242880,!1),K.threadInitTLS()}var jr=e=>{if(e instanceof vt||e=="un\
wind")return ne;x(1,e)},Jn=()=>{if(!xr())try{if(h){pr()&&Xr(ne);return}Nr(ne)}catch(e){jr(e)}},Fe=e=>{if(!pe)try{e(),Jn()}catch(r){
jr(r)}};function Dr(e){if(e=E(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),F),e/4,e);r.value.then(fr);var t=e+228;
Atomics.store((l(),F),t/4,1)}}var fr=()=>Fe(()=>{var e=pr();e&&(Dr(e),Aa())});function Hn(e,r){if(e=E(e),r=E(r),e==r)setTimeout(
fr);else if(h)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=K.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var dr=[];function Kn(e,r,t,a,i){t=E(t),i=E(i),a/=2,dr.length=a;for(var s=i/8,c=0;c<a;c++)(l(),J)[s+2*c]?
dr[c]=(l(),J)[s+2*c+1]:dr[c]=(l(),ae)[s+2*c+1];var d=ii[e];K.currentProxiedOperationCallerThread=t;var v=d(...dr);return K.
currentProxiedOperationCallerThread=0,typeof v=="bigint"&&(v=E(v)),v}function Xn(e){e=E(e),h?postMessage({cmd:"cleanupTh\
read",thread:e}):wt(e)}function Yn(e){e=E(e),p&&K.pthreads[e].ref()}var Zn=e=>e%4===0&&(e%100!==0||e%400===0),eo=[0,31,60,
91,121,152,182,213,244,274,305,335],ro=[0,31,59,90,120,151,181,212,243,273,304,334],to=e=>{var r=Zn(e.getFullYear()),t=r?
eo:ro,a=t[e.getMonth()]+e.getDate()-1;return a};function ao(e,r){e=E(e),r=E(r);var t=new Date(e*1e3);(l(),F)[r/4]=t.getSeconds(),
(l(),F)[(r+4)/4]=t.getMinutes(),(l(),F)[(r+8)/4]=t.getHours(),(l(),F)[(r+12)/4]=t.getDate(),(l(),F)[(r+16)/4]=t.getMonth(),
(l(),F)[(r+20)/4]=t.getFullYear()-1900,(l(),F)[(r+24)/4]=t.getDay();var a=to(t)|0;(l(),F)[(r+28)/4]=a,(l(),J)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=i.getTimezoneOffset(),d=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(l(),F)[(r+32)/4]=d}function $t(e,r,t,a,i,s,c){
if(h)return me(12,0,1,e,r,t,a,i,s,c);e=E(e),i=E(i),s=E(s),c=E(c);try{var d=te.getStreamFromFD(a),v=o.mmap(d,e,i,r,t),S=v.
ptr;return(l(),F)[s/4]=v.allocated,(l(),I)[c/8]=BigInt(S),0}catch(k){if(typeof o>"u"||k.name!=="ErrnoError")throw k;return-k.
errno}}function Pt(e,r,t,a,i,s){if(h)return me(13,0,1,e,r,t,a,i,s);e=E(e),r=E(r),s=E(s);try{var c=te.getStreamFromFD(i);
t&2&&te.doMsync(e,c,r,a,s)}catch(d){if(typeof o>"u"||d.name!=="ErrnoError")throw d;return-d.errno}}var no=function(e,r,t,a){
e=E(e),r=E(r),t=E(t),a=E(a);var i=new Date().getFullYear(),s=new Date(i,0,1),c=new Date(i,6,1),d=s.getTimezoneOffset(),v=c.
getTimezoneOffset(),S=Math.max(d,v);(l(),I)[e/8]=BigInt(S*60),(l(),F)[r/4]=+(d!=v);var k=M=>{var P=M>=0?"-":"+",$=Math.abs(
M),_=String(Math.floor($/60)).padStart(2,"0"),V=String($%60).padStart(2,"0");return`UTC${P}${_}${V}`},O=k(d),C=k(v);v<d?
(Ae(O,t,17),Ae(C,a,17)):(Ae(O,a,17),Ae(C,t,17))},Vt=()=>performance.timeOrigin+performance.now(),Jt=()=>Date.now(),oo=e=>e>=
0&&e<=3;function io(e,r,t){if(t=E(t),!oo(e))return 28;var a;e===0?a=Jt():a=Vt();var i=Math.round(a*1e3*1e3);return(l(),J)[t/
8]=BigInt(i),0}var so=()=>{},$e=()=>{lr+=1},co=()=>{throw $e(),"unwind"},uo=()=>new Error().stack.toString(),lo=e=>{var r=uo(),
t=r.split(`
`);r="";var a=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",d="",v=0,S=0,k=i.exec(s);if(k?.length==5)c=k[1],d=k[2],v=k[3],S=k[4];else if(k=a.exec(s),k?.length>=4)c=k[1],d=
k[2],v=k[3],S=k[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(d=d.substring(d.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${d}:${v}:${S})
`)}return r=r.replace(/\s+$/,""),r};function fo(e,r,t){r=E(r);var a=lo(e);if(!r||t<=0)return Ie(a)+1;var i=Ae(a,r,t);return i+
1}var Ht=()=>4294967296,mo=()=>BigInt(Ht()),po=()=>2,go=()=>p?require("os").cpus().length:navigator.hardwareConcurrency,
ho=e=>{var r=Ne.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Ne.grow(BigInt(t)),sr(),1}catch{}};function bo(e){e=E(
e);var r=(l(),X).length;if(e<=r)return!1;var t=Ht();if(e>t)return!1;for(var a=1;a<=4;a*=2){var i=r*(1+.2/a);i=Math.min(i,
e+100663296);var s=Math.min(t,Ot(Math.max(e,i),65536)),c=ho(s);if(c)return!0}return!1}var Ue=e=>{var r=Ie(e)+1,t=Gr(r);return Ae(
e,t,r),t},_o=(e,r)=>{(l(),A)[e/4]=r;var t=(l(),A)[e/4];(l(),A)[(e+4)/4]=(r-t)/4294967296},vo=e=>{var r=Ie(e)+1,t=sa(r);return t&&
Ae(e,t,r),t},Me=e=>(l(),A)[e/4]+(l(),F)[(e+4)/4]*4294967296,b={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{b.Internals.
jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{b.Internals.futures[e]=new Promise(t=>r.finally(()=>t(
e)))}},getJsObject:e=>{if(e)return b.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=ya(r);return b.Internals.jsObjects[t]=
e,t},importJsBindGroup:(e,r=0)=>{var t=zr(r);return b.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{var t=qr(
r);return b.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{ke(e.mapState==="unmapped");var t=wa(r);return b.Internals.
jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Lr(r);return b.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Qr(r);return b.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Wr(r);return b.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=$r(r);return b.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var t=Pr(
r),a=Ea(r,t);return b.Internals.jsObjectInsert(t,e.queue),b.Internals.jsObjectInsert(a,e),n.peercomputeOnDevice?.(e),a},
importJsExternalTexture:(e,r=0)=>{var t=ua(r);return b.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{var t=la(
r);return b.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=fa(r);return b.Internals.jsObjects[t]=e,t},importJsQueue:(e,r=0)=>{
var t=Pr(r);return b.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=da(r);return b.Internals.jsObjects[t]=
e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=ma(r);return b.Internals.jsObjects[t]=e,t},importJsRenderPassEncoder:(e,r=0)=>{
var t=pa(r);return b.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{var t=ga(r);return b.Internals.jsObjects[t]=
e,t},importJsSampler:(e,r=0)=>{var t=ha(r);return b.Internals.jsObjects[t]=e,t},importJsShaderModule:(e,r=0)=>{var t=ka(
r);return b.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=ba(r);return b.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{
var t=_a(r);return b.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{var t=va(r);return b.Internals.jsObjects[t]=
e,t},errorCallback:(e,r,t,a)=>{var i=xe(),s=Ue(t);((c,d,v)=>At(e).call(null,c,BigInt(d),BigInt(v)))(r,BigInt(s),a),Ge(i)},
iterateExtensions:(e,r)=>{for(var t=Number((l(),I)[e/8]);t;t=Number((l(),I)[t/8])){var a=(l(),F)[(t+8)/4];r[a](t)}},setStringView:(e,r,t)=>{
(l(),I)[e/8]=BigInt(r),(l(),I)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{var r=Number((l(),I)[e/8]),t=Number((l(),
I)[(e+8)/8]);return He(r,t)},makeStringFromOptionalStringView:e=>{var r=Number((l(),I)[e/8]),t=Number((l(),I)[(e+8)/8]);
return r?He(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),ae)[e/8],g:(l(),ae)[(e+8)/8],b:(l(),ae)[(e+16)/8],a:(l(),ae)[(e+
24)/8]}),makeExtent3D:e=>({width:(l(),A)[e/4],height:(l(),A)[(e+4)/4],depthOrArrayLayers:(l(),A)[(e+8)/4]}),makeOrigin3D:e=>({
x:(l(),A)[e/4],y:(l(),A)[(e+4)/4],z:(l(),A)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:b.getJsObject(Number((l(),I)[e/
8])),mipLevel:(l(),A)[(e+8)/4],origin:b.makeOrigin3D(e+12),aspect:b.TextureAspect[(l(),F)[(e+24)/4]]}),makeTexelCopyBufferLayout:e=>{
var r=(l(),A)[(e+8)/4],t=(l(),A)[(e+12)/4];return{offset:Me(e),bytesPerRow:r===4294967295?void 0:r,rowsPerImage:t===4294967295?
void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=b.makeTexelCopyBufferLayout(r);return t.buffer=b.getJsObject(Number((l(),
I)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:b.getJsObject(Number((l(),I)[(e+8)/8])),beginningOfPassWriteIndex:(l(),
A)[(e+16)/4],endOfPassWriteIndex:(l(),A)[(e+20)/4]}},makePipelineConstants:(e,r)=>{if(e){for(var t={},a=0;a<e;++a){var i=r+
32*a,s=b.makeStringFromStringView(i+8);t[s]=(l(),ae)[(i+24)/8]}return t}},makePipelineLayout:e=>e?b.getJsObject(e):"auto",
makeComputeState:e=>{if(e){var r={module:b.getJsObject(Number((l(),I)[(e+8)/8])),constants:b.makePipelineConstants(Number(
(l(),I)[(e+32)/8]),Number((l(),I)[(e+40)/8])),entryPoint:b.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:b.makeStringFromOptionalStringView(e+8),layout:b.makePipelineLayout(Number((l(),I)[(e+24)/8])),compute:b.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(_){if(_)return{topology:b.PrimitiveTopology[(l(),F)[(_+8)/4]],stripIndexFormat:b.
IndexFormat[(l(),F)[(_+12)/4]],frontFace:b.FrontFace[(l(),F)[(_+16)/4]],cullMode:b.CullMode[(l(),F)[(_+20)/4]],unclippedDepth:!!(l(),
A)[(_+24)/4]}}function t(_){if(_)return{operation:b.BlendOperation[(l(),F)[_/4]],srcFactor:b.BlendFactor[(l(),F)[(_+4)/4]],
dstFactor:b.BlendFactor[(l(),F)[(_+8)/4]]}}function a(_){if(_)return{alpha:t(_+12),color:t(_+0)}}function i(_){var V=b.TextureFormat[(l(),
F)[(_+8)/4]];return V?{format:V,blend:a(Number((l(),I)[(_+16)/8])),writeMask:(l(),A)[(_+24)/4]}:void 0}function s(_,V){for(var H=[],
oe=0;oe<_;++oe)H.push(i(V+32*oe));return H}function c(_){return{compare:b.CompareFunction[(l(),F)[_/4]],failOp:b.StencilOperation[(l(),
F)[(_+4)/4]],depthFailOp:b.StencilOperation[(l(),F)[(_+8)/4]],passOp:b.StencilOperation[(l(),F)[(_+12)/4]]}}function d(_){
if(_)return{format:b.TextureFormat[(l(),F)[(_+8)/4]],depthWriteEnabled:!!(l(),A)[(_+12)/4],depthCompare:b.CompareFunction[(l(),
F)[(_+16)/4]],stencilFront:c(_+20),stencilBack:c(_+36),stencilReadMask:(l(),A)[(_+52)/4],stencilWriteMask:(l(),A)[(_+56)/
4],depthBias:(l(),F)[(_+60)/4],depthBiasSlopeScale:(l(),le)[(_+64)/4],depthBiasClamp:(l(),le)[(_+68)/4]}}function v(_){return{
format:b.VertexFormat[(l(),F)[(_+8)/4]],offset:Me(_+16),shaderLocation:(l(),A)[(_+24)/4]}}function S(_,V){for(var H=[],oe=0;oe<
_;++oe)H.push(v(V+oe*32));return H}function k(_){if(_){var V=b.VertexStepMode[(l(),F)[(_+8)/4]],H=Number((l(),I)[(_+24)/
8]);return!V&&!H?null:{arrayStride:Me(_+16),stepMode:V,attributes:S(H,Number((l(),I)[(_+32)/8]))}}}function O(_,V){if(_){
for(var H=[],oe=0;oe<_;++oe)H.push(k(V+oe*40));return H}}function C(_){if(_){var V={module:b.getJsObject(Number((l(),I)[(_+
8)/8])),constants:b.makePipelineConstants(Number((l(),I)[(_+32)/8]),Number((l(),I)[(_+40)/8])),buffers:O(Number((l(),I)[(_+
48)/8]),Number((l(),I)[(_+56)/8])),entryPoint:b.makeStringFromOptionalStringView(_+16)};return V}}function M(_){if(_)return{
count:(l(),A)[(_+8)/4],mask:(l(),A)[(_+12)/4],alphaToCoverageEnabled:!!(l(),A)[(_+16)/4]}}function P(_){if(_){var V={module:b.
getJsObject(Number((l(),I)[(_+8)/8])),constants:b.makePipelineConstants(Number((l(),I)[(_+32)/8]),Number((l(),I)[(_+40)/
8])),targets:s(Number((l(),I)[(_+48)/8]),Number((l(),I)[(_+56)/8])),entryPoint:b.makeStringFromOptionalStringView(_+16)};
return V}}var $={label:b.makeStringFromOptionalStringView(e+8),layout:b.makePipelineLayout(Number((l(),I)[(e+24)/8])),vertex:C(
e+32),primitive:r(e+96),depthStencil:d(Number((l(),I)[(e+128)/8])),multisample:M(e+136),fragment:P(Number((l(),I)[(e+160)/
8]))};return $},fillLimitStruct:(e,r)=>{var t=Number((l(),I)[r/8]);function a(c,d,v,S=0){var k=e[c]??S;(l(),A)[(d+v)/4]=
k}function i(c,d,v,S=0){var k=e[c]??S;_o(d+v,k)}if(a("maxTextureDimension1D",r,8),a("maxTextureDimension2D",r,12),a("max\
TextureDimension3D",r,16),a("maxTextureArrayLayers",r,20),a("maxBindGroups",r,24),a("maxBindGroupsPlusVertexBuffers",r,28),
a("maxBindingsPerBindGroup",r,32),a("maxDynamicUniformBuffersPerPipelineLayout",r,36),a("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),a("maxSampledTexturesPerShaderStage",r,44),a("maxSamplersPerShaderStage",r,48),a("maxStorageBuffersPer\
ShaderStage",r,52),a("maxStorageTexturesPerShaderStage",r,56),a("maxUniformBuffersPerShaderStage",r,60),a("minUniformBuf\
ferOffsetAlignment",r,80),a("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageB\
ufferBindingSize",r,72),a("maxVertexBuffers",r,88),i("maxBufferSize",r,96),a("maxVertexAttributes",r,104),a("maxVertexBu\
fferArrayStride",r,108),a("maxInterStageShaderVariables",r,112),a("maxColorAttachments",r,116),a("maxColorAttachmentByte\
sPerSample",r,120),a("maxComputeWorkgroupStorageSize",r,124),a("maxComputeInvocationsPerWorkgroup",r,128),a("maxComputeW\
orkgroupSizeX",r,132),a("maxComputeWorkgroupSizeY",r,136),a("maxComputeWorkgroupSizeZ",r,140),a("maxComputeWorkgroupsPer\
Dimension",r,144),a("maxImmediateSize",r,148),t!==0){(l(),F)[(t+8)/4];var s=t;a("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),a("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),a("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),a("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(l(),A)[(r+88)/4]=e.subgroupMinSize,(l(),A)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,a=vo(t),i=Ie(e.vendor);b.setStringView(r+8,a,i),a+=i;var s=Ie(e.architecture);b.setStringView(r+24,
a,s),a+=s;var c=Ie(e.device);b.setStringView(r+40,a,c),a+=c;var d=Ie(e.description);b.setStringView(r+56,a,d),a+=d,(l(),
F)[(r+72)/4]=2;var v=e.isFallbackAdapter?3:4;(l(),F)[(r+76)/4]=v,(l(),A)[(r+80)/4]=0,(l(),A)[(r+84)/4]=0},AddressMode:[,
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},yo={undefined:1,unknown:1,destroyed:2},
je=()=>{lr-=1};function wo(e,r,t,a,i,s){e=E(e),r=E(r),t=E(t),a=E(a),i=E(i),s=E(s);var c=b.getJsObject(e),d={};if(s){var v=Number(
(l(),I)[(s+24)/8]);if(v){var S=Number((l(),I)[(s+32)/8]);d.requiredFeatures=Array.from((l(),A).subarray(S/4,(S+v*4)/4),_=>b.
FeatureName[_])}var k=Number((l(),I)[(s+40)/8]);if(k){let _=function(H,oe,he,Ee=!1){var fe=oe+he,Ye=(l(),A)[fe/4];Ye!=4294967295&&
(!Ee||Ye!=0)&&(C[H]=Ye)},V=function(H,oe,he){var Ee=oe+he,fe=(l(),A)[Ee/4],Ye=(l(),A)[(Ee+4)/4];(fe!=4294967295||Ye!=4294967295)&&
(C[H]=Me(Ee))};var O=Number((l(),I)[k/8]),C={};if(_("maxTextureDimension1D",k,8),_("maxTextureDimension2D",k,12),_("maxT\
extureDimension3D",k,16),_("maxTextureArrayLayers",k,20),_("maxBindGroups",k,24),_("maxBindGroupsPlusVertexBuffers",k,28),
_("maxBindingsPerBindGroup",k,32),_("maxDynamicUniformBuffersPerPipelineLayout",k,36),_("maxDynamicStorageBuffersPerPipe\
lineLayout",k,40),_("maxSampledTexturesPerShaderStage",k,44),_("maxSamplersPerShaderStage",k,48),_("maxStorageBuffersPer\
ShaderStage",k,52),_("maxStorageTexturesPerShaderStage",k,56),_("maxUniformBuffersPerShaderStage",k,60),_("minUniformBuf\
ferOffsetAlignment",k,80),_("minStorageBufferOffsetAlignment",k,84),V("maxUniformBufferBindingSize",k,64),V("maxStorageB\
ufferBindingSize",k,72),_("maxVertexBuffers",k,88),V("maxBufferSize",k,96),_("maxVertexAttributes",k,104),_("maxVertexBu\
fferArrayStride",k,108),_("maxInterStageShaderVariables",k,112),_("maxColorAttachments",k,116),_("maxColorAttachmentByte\
sPerSample",k,120),_("maxComputeWorkgroupStorageSize",k,124),_("maxComputeInvocationsPerWorkgroup",k,128),_("maxComputeW\
orkgroupSizeX",k,132),_("maxComputeWorkgroupSizeY",k,136),_("maxComputeWorkgroupSizeZ",k,140),_("maxComputeWorkgroupsPer\
Dimension",k,144),_("maxImmediateSize",k,148,!0),O!==0){(l(),F)[(O+8)/4];var M=O;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(_("maxStorageBuffersInVertexStage",M,16),_("maxStorageTexturesInVertexStage",M,20),_("maxStorageBuffersInFra\
gmentStage",M,24),_("maxStorageTexturesInFragmentStage",M,28))}d.requiredLimits=C}var P=Number((l(),I)[(s+48)/8]);if(P){
var $={label:b.makeStringFromOptionalStringView(P+8)};d.defaultQueue=$}d.label=b.makeStringFromOptionalStringView(s+8)}$e(),
b.Internals.futureInsert(r,c.requestDevice(d).then(_=>{je(),Fe(()=>{b.Internals.jsObjectInsert(i,_.queue),b.Internals.jsObjectInsert(
a,_),n.peercomputeOnDevice?.(_),a=BigInt(a),b.Internals.futureInsert(t,_.lost.then(V=>{Fe(()=>{_.onuncapturederror=he=>{};
var H=xe(),oe=Ue(V.message);Vr(t,yo[V.reason],BigInt(oe)),Ge(H)})})),_.onuncapturederror=V=>{var H=5;V.error instanceof GPUValidationError?
H=2:V.error instanceof GPUOutOfMemoryError?H=3:V.error instanceof GPUInternalError&&(H=4);var oe=xe(),he=Ue(V.error.message);
Ba(BigInt(a),H,BigInt(he)),Ge(oe)},Hr(r,1,BigInt(a),0n)})},_=>{je(),Fe(()=>{var V=xe(),H=Ue(_.message);Hr(r,3,BigInt(a),
BigInt(H)),t&&Vr(t,4,BigInt(H)),Ge(V)})}))}function Eo(e){e=E(e);var r=b.getJsObject(e),t=b.Internals.bufferOnUnmaps[e];
if(t){for(var a=0;a<t.length;++a)t[a]();delete b.Internals.bufferOnUnmaps[e]}r.destroy()}var ko=function(e,r,t){e=E(e),r=
E(r),t=E(t);var a=(()=>{var i=b.getJsObject(e);t==-1&&(t=void 0);var s;try{s=i.getMappedRange(r,t)}catch{return 0n}var c=Fa(
16,s.byteLength);return(l(),X).set(new Uint8Array(s),c),b.Internals.bufferOnUnmaps[e].push(()=>ca(c)),c})();return BigInt(
a)},So=function(e,r,t,a,i){e=E(e),r=E(r),t=E(t),a=E(a),i=E(i);var s=b.getJsObject(e);b.Internals.bufferOnUnmaps[e]=[],i==
-1&&(i=void 0),$e(),b.Internals.futureInsert(r,s.mapAsync(t,a,i).then(()=>{je(),Fe(()=>{Jr(r,1,0n)})},c=>{je(),Fe(()=>{var d=xe(),
v=Ue(c.message),S=c.name==="AbortError"?4:c.name==="OperationError"?3:0;Jr(r,S,BigInt(v)),delete b.Internals.bufferOnUnmaps[e]})}))};
function Bo(e){e=E(e);var r=b.getJsObject(e),t=b.Internals.bufferOnUnmaps[e];if(t){for(var a=0;a<t.length;++a)t[a]();delete b.
Internals.bufferOnUnmaps[e],r.unmap()}}function xo(e){e=E(e),delete b.Internals.jsObjects[e]}function Go(e,r,t){e=E(e),r=
E(r),t=E(t);var a=!!(l(),A)[(r+40)/4],i={label:b.makeStringFromOptionalStringView(r+8),usage:(l(),A)[(r+24)/4],size:Me(r+
32),mappedAtCreation:a},s=b.getJsObject(e),c;try{c=s.createBuffer(i)}catch{return!1}return b.Internals.jsObjectInsert(t,
c),a&&(b.Internals.bufferOnUnmaps[t]=[]),!0}function No(e,r,t){e=E(e),r=E(r),t=E(t);var a=Number((l(),I)[r/8]),i=(l(),F)[(a+
8)/4],s={label:b.makeStringFromOptionalStringView(r+8),code:""};switch(i){case 2:{s.code=b.makeStringFromStringView(a+16);
break}}var c=b.getJsObject(e);b.Internals.jsObjectInsert(t,c.createShaderModule(s))}var Io=e=>{const r=b.getJsObject(e);
r.onuncapturederror=null,r.destroy()};function Ao(e,r,t,a){r=E(r),t=E(t),a=E(a);var i;if(t){i={featureLevel:b.FeatureLevel[(l(),
F)[(t+8)/4]],powerPreference:b.PowerPreference[(l(),F)[(t+12)/4]],forceFallbackAdapter:!!(l(),A)[(t+16)/4]};var s=Number(
(l(),I)[t/8]);if(s!==0){(l(),F)[(s+8)/4];var c=s;i.xrCompatible=!!(l(),A)[(c+16)/4]}}if(!("gpu"in navigator)){var d=xe(),
v=Ue("WebGPU not available on this browser (navigator.gpu is not available)");Xe(r,3,BigInt(a),BigInt(v)),Ge(d);return}$e(),
b.Internals.futureInsert(r,navigator.gpu.requestAdapter(i).then(S=>{je(),Fe(()=>{if(S)b.Internals.jsObjectInsert(a,S),Xe(
r,1,BigInt(a),0n);else{var k=xe(),O=Ue("WebGPU not available on this browser (requestAdapter returned null)");Xe(r,3,BigInt(
a),BigInt(O)),Ge(k)}})},S=>{je(),Fe(()=>{var k=xe(),O=Ue(S.message);Xe(r,4,BigInt(a),BigInt(O)),Ge(k)})}))}var Fo=function(e,r){
e=E(e),r=E(r);var t=b.getJsObject(e);$e(),b.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{je(),Fe(()=>{Sa(r,
1)})}))},Kt=function(e,r,t){return e=E(e),r=E(r),t=E(t),we.handleAsync(async()=>{var a=[];if(t){var i=(l(),F)[t/4];a.length=
r+1,a[r]=new Promise(v=>setTimeout(v,i,0))}else a.length=r;for(var s=0;s<r;++s){var c=Me(e+s*8);if(!(c in b.Internals.futures))
return c;a[s]=b.Internals.futures[c]}const d=await Promise.race(a);return delete b.Internals.futures[d],d})};Kt.isAsync=
!0;var mr={},To=()=>B||"./this.program",Ke=()=>{if(!Ke.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:To()};
for(var t in mr)mr[t]===void 0?delete r[t]:r[t]=mr[t];var a=[];for(var t in r)a.push(`${t}=${r[t]}`);Ke.strings=a}return Ke.
strings};function Xt(e,r){if(h)return me(14,0,1,e,r);e=E(e),r=E(r);var t=0,a=0;for(var i of Ke()){var s=r+t;(l(),I)[(e+a)/
8]=BigInt(s),t+=Ae(i,s,1/0)+1,a+=8}return 0}function Yt(e,r){if(h)return me(15,0,1,e,r);e=E(e),r=E(r);var t=Ke();(l(),I)[e/
8]=BigInt(t.length);var a=0;for(var i of t)a+=Ie(i)+1;return(l(),I)[r/8]=BigInt(a),0}function Zt(e){if(h)return me(16,0,
1,e);try{var r=te.getStreamFromFD(e);return o.close(r),0}catch(t){if(typeof o>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var Co=(e,r,t,a)=>{for(var i=0,s=0;s<t;s++){var c=Number((l(),I)[r/8]),d=Number((l(),I)[(r+8)/8]);r+=16;var v=o.read(
e,(l(),Q),c,d,a);if(v<0)return-1;if(i+=v,v<d)break}return i};function ea(e,r,t,a){if(h)return me(17,0,1,e,r,t,a);r=E(r),
t=E(t),a=E(a);try{var i=te.getStreamFromFD(e),s=Co(i,r,t);return(l(),I)[a/8]=BigInt(s),0}catch(c){if(typeof o>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function ra(e,r,t,a){if(h)return me(18,0,1,e,r,t,a);r=E(r),a=E(a);try{if(isNaN(r))return 61;
var i=te.getStreamFromFD(e);return o.llseek(i,r,t),(l(),J)[a/8]=BigInt(i.position),i.getdents&&r===0&&t===0&&(i.getdents=
null),0}catch(s){if(typeof o>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var Uo=(e,r,t,a)=>{for(var i=0,s=0;s<t;s++){
var c=Number((l(),I)[r/8]),d=Number((l(),I)[(r+8)/8]);r+=16;var v=o.write(e,(l(),Q),c,d,a);if(v<0)return-1;if(i+=v,v<d)break}
return i};function ta(e,r,t,a){if(h)return me(19,0,1,e,r,t,a);r=E(r),t=E(t),a=E(a);try{var i=te.getStreamFromFD(e),s=Uo(
i,r,t);return(l(),I)[a/8]=BigInt(s),0}catch(c){if(typeof o>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function Ro(e,r){
e=E(e),r=E(r);try{return Tr((l(),X).subarray(e,e+r)),0}catch(t){if(typeof o>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function Oo(e,r){e=E(e),r=E(r);var t=b.getJsObject(e);return b.fillAdapterInfoStruct(t.info,r),1}function Mo(e,r){
e=E(e),r=E(r);var t=b.getJsObject(e);return b.fillLimitStruct(t.limits,r),1}function jo(e,r){e=E(e);var t=b.getJsObject(
e);return t.features.has(b.FeatureName[r])}var Do=function(e){e=E(e);var r=(()=>{var t=b.getJsObject(e);return t.size})();
return BigInt(r)},zo=function(e,r){e=E(e),r=E(r);var t=(()=>{var a;r&&(a={label:b.makeStringFromOptionalStringView(r+8),
timestampWrites:b.makePassTimestampWrites(Number((l(),I)[(r+24)/8]))});var i=b.getJsObject(e),s=Wr(0n);return b.Internals.
jsObjectInsert(s,i.beginComputePass(a)),s})();return BigInt(t)};function qo(e,r,t,a,i,s){e=E(e),r=E(r),t=E(t),a=E(a),i=E(
i),s=E(s);var c=b.getJsObject(e),d=b.getJsObject(r),v=b.getJsObject(a);c.copyBufferToBuffer(d,t,v,i,s)}var Lo=function(e,r){
e=E(e);var t=(()=>{var a=b.getJsObject(e),i=Lr(0n);return b.Internals.jsObjectInsert(i,a.finish()),i})();return BigInt(t)};
function Qo(e,r,t,a){e=E(e);var i=b.getJsObject(e);i.dispatchWorkgroups(r,t,a)}function Wo(e){e=E(e);var r=b.getJsObject(
e);r.end()}function $o(e,r,t,a,i){e=E(e),t=E(t),a=E(a),i=E(i);var s=b.getJsObject(e),c=b.getJsObject(t);a==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(l(),A),i/4,a)}function Po(e,r){e=E(e),r=E(r);var t=b.getJsObject(e),a=b.getJsObject(r);t.setPipeline(
a)}var Vo=function(e,r){e=E(e);var t=(()=>{var a=b.getJsObject(e),i=qr(0n);return b.Internals.jsObjectInsert(i,a.getBindGroupLayout(
r)),i})();return BigInt(t)},Jo=function(e,r){e=E(e),r=E(r);var t=(()=>{function a(v){var S=Number((l(),I)[(v+16)/8]),k=Number(
(l(),I)[(v+40)/8]),O=Number((l(),I)[(v+48)/8]),C=0;b.iterateExtensions(v,{327681:$=>{C=Number((l(),I)[($+16)/8])}});var M;
if(S){var P=Me(v+32);P==-1&&(P=void 0),M={buffer:b.getJsObject(S),offset:Me(v+24),size:P}}else M=b.getJsObject(k||O||C);
return{binding:(l(),A)[(v+8)/4],resource:M}}function i(v,S){for(var k=[],O=0;O<v;++O)k.push(a(S+56*O));return k}var s={label:b.
makeStringFromOptionalStringView(r+8),layout:b.getJsObject(Number((l(),I)[(r+24)/8])),entries:i(Number((l(),I)[(r+32)/8]),
Number((l(),I)[(r+40)/8]))},c=b.getJsObject(e),d=zr(0n);return b.Internals.jsObjectInsert(d,c.createBindGroup(s)),d})();
return BigInt(t)},Ho=function(e,r){e=E(e),r=E(r);var t=(()=>{var a;r&&(a={label:b.makeStringFromOptionalStringView(r+8)});
var i=b.getJsObject(e),s=Qr(0n);return b.Internals.jsObjectInsert(s,i.createCommandEncoder(a)),s})();return BigInt(t)},Ko=function(e,r){
e=E(e),r=E(r);var t=(()=>{var a=b.makeComputePipelineDesc(r),i=b.getJsObject(e),s=$r(0n);return b.Internals.jsObjectInsert(
s,i.createComputePipeline(a)),s})();return BigInt(t)};function Xo(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(b.WGSLLanguageFeatureName[r]):!1}var Yo=function(e,r,t){e=E(e),r=E(r),t=E(t);var a=b.getJsObject(
e),i=Array.from((l(),J).subarray(t/8,(t+r*8)/8),s=>b.getJsObject(s));a.submit(i)};function Zo(e,r,t,a,i){e=E(e),r=E(r),t=
E(t),a=E(a),i=E(i);var s=b.getJsObject(e),c=b.getJsObject(r),d=(l(),X).subarray(a,a+i);s.writeBuffer(c,t,d,0,i)}var we={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,a]of Object.entries(e))typeof a=="function"&&(a.isAsync||
r.test(t))&&(e[t]=a=new WebAssembly.Suspending(a))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;we.asyncExports=new Set;var t={};for(let[i,s]of Object.entries(
e))if(typeof s=="function"){r.test(i)&&(we.asyncExports.add(s),s=we.makeAsyncFunction(s));var a=we.instrumentFunction(s);
t[i]=a}else t[i]=s;return t},asyncExports:null,isAsyncExport(e){return we.asyncExports?.has(e)},handleAsync:async e=>{$e();
try{return await e()}finally{je()}},handleSleep:e=>we.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},aa=e=>{var r=n["_"+e];return r},ei=(e,r)=>{(l(),Q).set(e,r)},na=(e,r,t,a,i)=>{var s={pointer:$=>BigInt($),
string:$=>{var _=0;return $!=null&&$!==0&&(_=Ue($)),BigInt(_)},array:$=>{var _=Gr($.length);return ei($,_),BigInt(_)}};function c($){
return r==="string"?He(Number($)):r==="pointer"?Number($):r==="boolean"?!!$:$}var d=aa(e),v=[],S=0;if(a)for(var k=0;k<a.
length;k++){var O=s[t[k]];O?(S===0&&(S=xe()),v[k]=O(a[k])):v[k]=a[k]}var C=d(...v);function M($){return S!==0&&Ge(S),c($)}
var P=i?.async;return P?C.then(M):(C=M(C),C)},ri=(e,r,t,a)=>{var i=!t||t.every(c=>c==="number"||c==="boolean"),s=r!=="st\
ring";return s&&i&&!a?aa(e):(...c)=>na(e,r,t,c,a)},ti=(...e)=>o.createPath(...e),ai=(...e)=>o.unlink(...e),ni=(...e)=>o.
createLazyFile(...e),oi=(...e)=>o.createDevice(...e);if(K.init(),o.createPreloadedFile=Ln,o.preloadFile=Mr,o.staticInit(),
wn(),n.noExitRuntime&&(Ar=n.noExitRuntime),n.preloadPlugins&&(jt=n.preloadPlugins),n.print&&(de=n.print),n.printErr&&(se=
n.printErr),n.wasmBinary&&(ce=n.wasmBinary),n.arguments&&n.arguments,n.thisProgram&&(B=n.thisProgram),n.preInit)for(typeof n.
preInit=="function"&&(n.preInit=[n.preInit]);n.preInit.length>0;)n.preInit.shift()();n.ENV=mr,n.mmapAlloc=Rr,n.wasmMemory=
Ne,n.addRunDependency=ur,n.removeRunDependency=cr,n.ccall=na,n.cwrap=ri,n.FS_preloadFile=Mr,n.FS_unlink=ai,n.FS_createPath=
ti,n.FS_createDevice=oi,n.FS=o,n.FS_createDataFile=Mt,n.FS_createLazyFile=ni,n.MEMFS=W;var ii=[xt,Gt,Tt,Dt,Qn,zt,qt,Lt,Wn,
$n,Qt,Wt,$t,Pt,Xt,Yt,Zt,ea,ra,ta];function oa(e,r,t,a){return we.handleAsync(async()=>await u(He(Number(e)),Number(r),Number(
t),Number(a)))}oa.sig="jjjjj";var ia,sa,ca,zr,qr,Lr,Qr,Wr,$r,ua,la,fa,da,ma,pa,ga,ha,ba,_a,va,ya,wa,Ea,Pr,ka,Vr,Jr,Xe,Hr,
Sa,Ba,pr,xa,Kr,Ga,Na,Ia,Xr,Aa,Fa,Ta,Ca,Ua,Ra,Oa,Ma;function si(e){n._wllama_malloc=e.wllama_malloc,n._wllama_start=e.wllama_start,
n._wllama_action=e.wllama_action,n._wllama_exit=e.wllama_exit,n._wllama_debug=e.wllama_debug,ia=n._main=e.main,sa=e.malloc,
ca=e.free,zr=e.emwgpuCreateBindGroup,qr=e.emwgpuCreateBindGroupLayout,Lr=e.emwgpuCreateCommandBuffer,Qr=e.emwgpuCreateCommandEncoder,
Wr=e.emwgpuCreateComputePassEncoder,$r=e.emwgpuCreateComputePipeline,ua=e.emwgpuCreateExternalTexture,la=e.emwgpuCreatePipelineLayout,
fa=e.emwgpuCreateQuerySet,da=e.emwgpuCreateRenderBundle,ma=e.emwgpuCreateRenderBundleEncoder,pa=e.emwgpuCreateRenderPassEncoder,
ga=e.emwgpuCreateRenderPipeline,ha=e.emwgpuCreateSampler,ba=e.emwgpuCreateSurface,_a=e.emwgpuCreateTexture,va=e.emwgpuCreateTextureView,
ya=e.emwgpuCreateAdapter,wa=e.emwgpuCreateBuffer,Ea=e.emwgpuCreateDevice,Pr=e.emwgpuCreateQueue,ka=e.emwgpuCreateShaderModule,
Vr=e.emwgpuOnDeviceLostCompleted,Jr=e.emwgpuOnMapAsyncCompleted,Xe=e.emwgpuOnRequestAdapterCompleted,Hr=e.emwgpuOnRequestDeviceCompleted,
Sa=e.emwgpuOnWorkDoneCompleted,Ba=e.emwgpuOnUncapturedError,e._emscripten_tls_init,pr=e.pthread_self,xa=e.emscripten_builtin_memalign,
Kr=e._emscripten_thread_init,Ga=e._emscripten_thread_crashed,Na=e._emscripten_run_js_on_main_thread,Ia=e._emscripten_thread_free_data,
Xr=e._emscripten_thread_exit,Aa=e._emscripten_check_mailbox,Fa=e.memalign,Ta=e.__trap,Ca=e.emscripten_stack_set_limits,Ua=
e._emscripten_stack_restore,Ra=e._emscripten_stack_alloc,Oa=e.emscripten_stack_get_current,Ma=e.__indirect_function_table}
var Pe;function ci(){Pe={__asyncjs__js_file_read:oa,__pthread_create_js:Ct,__syscall_fcntl64:Dt,__syscall_getcwd:zt,__syscall_getdents64:qt,
__syscall_ioctl:Lt,__syscall_openat:Qt,__syscall_stat64:Wt,_abort_js:Pn,_emscripten_init_main_thread_js:Vn,_emscripten_notify_mailbox_postmessage:Hn,
_emscripten_receive_on_main_thread_js:Kn,_emscripten_thread_cleanup:Xn,_emscripten_thread_mailbox_await:Dr,_emscripten_thread_set_strongref:Yn,
_localtime_js:ao,_mmap_js:$t,_munmap_js:Pt,_tzset_js:no,clock_time_get:io,emscripten_check_blocking_allowed:so,emscripten_date_now:Jt,
emscripten_exit_with_live_runtime:co,emscripten_get_callstack:fo,emscripten_get_heap_max:mo,emscripten_get_now:Vt,emscripten_has_asyncify:po,
emscripten_num_logical_cores:go,emscripten_resize_heap:bo,emwgpuAdapterRequestDevice:wo,emwgpuBufferDestroy:Eo,emwgpuBufferGetConstMappedRange:ko,
emwgpuBufferMapAsync:So,emwgpuBufferUnmap:Bo,emwgpuDelete:xo,emwgpuDeviceCreateBuffer:Go,emwgpuDeviceCreateShaderModule:No,
emwgpuDeviceDestroy:Io,emwgpuInstanceRequestAdapter:Ao,emwgpuQueueOnSubmittedWorkDone:Fo,emwgpuWaitAny:Kt,environ_get:Xt,
environ_sizes_get:Yt,exit:Nr,fd_close:Zt,fd_read:ea,fd_seek:ra,fd_write:ta,memory:Ne,random_get:Ro,wgpuAdapterGetInfo:Oo,
wgpuAdapterGetLimits:Mo,wgpuAdapterHasFeature:jo,wgpuBufferGetSize:Do,wgpuCommandEncoderBeginComputePass:zo,wgpuCommandEncoderCopyBufferToBuffer:qo,
wgpuCommandEncoderFinish:Lo,wgpuComputePassEncoderDispatchWorkgroups:Qo,wgpuComputePassEncoderEnd:Wo,wgpuComputePassEncoderSetBindGroup:$o,
wgpuComputePassEncoderSetPipeline:Po,wgpuComputePipelineGetBindGroupLayout:Vo,wgpuDeviceCreateBindGroup:Jo,wgpuDeviceCreateCommandEncoder:Ho,
wgpuDeviceCreateComputePipeline:Ko,wgpuInstanceHasWGSLLanguageFeature:Xo,wgpuQueueSubmit:Yo,wgpuQueueWriteBuffer:Zo}}function ui(e){
e=Object.assign({},e);var r=S=>(k,O,C)=>S(k,BigInt(O||0),BigInt(C||0)),t=S=>k=>Number(S(BigInt(k))),a=S=>k=>S(BigInt(k)),
i=S=>()=>Number(S()),s=S=>(k,O)=>Number(S(BigInt(k),BigInt(O))),c=S=>(k,O,C,M,P,$)=>S(BigInt(k),O,C,M,P,$),d=S=>(k,O,C,M,P)=>S(
k,BigInt(O),C,BigInt(M),P),v=S=>(k,O)=>S(BigInt(k),BigInt(O));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=a(e.free),
e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=s(e.emscripten_builtin_memalign),e._emscripten_thread_init=
c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=d(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=
a(e._emscripten_thread_free_data),e._emscripten_thread_exit=a(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=
v(e.emscripten_stack_set_limits),e._emscripten_stack_restore=a(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(
e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.emscripten_stack_get_current),e}async function li(){var e=ia,
r=0,t=0;try{var a=e(r,BigInt(t));return a=await a,Nt(a,!0),a}catch(i){return jr(i)}}function gr(){if(De>0){Je=gr;return}
if(h){ht();return}if(En(),De>0){Je=gr;return}async function e(){if(n.calledRun=!0,!pe){ht(),n.onRuntimeInitialized?.();var r=n.
noInitialRun||!1;r||await li(),kn()}}n.setStatus?(n.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>n.setStatus(""),
1),e()},1)):e()}var Re;return h||(_t(),gr()),n}var Ya=1,Za={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"\
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
nr=new Uint8Array([71,76,85,69]),dt=0,Ei=1,ki=2,Si=3,Bi=4,xi=5,Gi=6,Ni=7,Ii=8,Ai=9,Fi=10,en={str:Bi,int:ki,float:Si,bool:Ei,
raw:xi,arr_str:Ai,arr_int:Ni,arr_float:Ii,arr_bool:Gi,arr_raw:Fi,null:dt};function Ti(n){let u=0;const f=new DataView(n.
buffer),m=()=>{const q=f.getUint32(u,!0);return u+=4,q},g=()=>{const q=f.getInt32(u,!0);return u+=4,q},p=()=>{const q=f.
getFloat32(u,!0);return u+=4,q},h=()=>m()!==0,N=q=>{const Z=q??m(),ve=new TextDecoder().decode(n.slice(u,u+Z));return u+=
Z,ve},B=()=>{const q=m(),Z=n.slice(u,u+q);return u+=q,Z},x=q=>{const Z=m(),ve=new Array(Z);for(let de=0;de<Z;de++)ve[de]=
q();return ve},y=()=>null,R=q=>{switch(q.type){case"str":return N();case"int":return g();case"float":return p();case"boo\
l":return h();case"raw":return B();case"arr_str":return x(N);case"arr_int":return x(g);case"arr_float":return x(p);case"\
arr_bool":return x(h);case"arr_raw":return x(B);case"null":return y()}},T=n[0]===nr[0]&&n[1]===nr[1]&&n[2]===nr[2]&&n[3]===
nr[3];if(u+=4,!T)throw new Error("Invalid magic number");if(m()!==Ya)throw new Error("Invalid version number");const w=N(
8),D=Za[w];if(!D)throw new Error(`Unknown message name: ${w}`);const L={_name:w};for(const q of D.fields){const Z=m();if(Z===
dt){if(!q.isNullable)throw new Error(`${w}: Expect field ${q.name} to be non-nullable`);L[q.name]=null;continue}if(Z!==en[q.
type])throw new Error(`${w}: Expect field ${q.name} to have type ${q.type}`);L[q.name]=R(q)}return L}function Ci(n){const u=Za[n.
_name];if(!u)throw new Error(`Unknown message name: ${n._name}`);const f=[],m=G=>{const w=new ArrayBuffer(4);new DataView(
w).setUint32(0,G,!0),f.push(new Uint8Array(w))},g=G=>{const w=new ArrayBuffer(4);new DataView(w).setInt32(0,G,!0),f.push(
new Uint8Array(w))},p=G=>{const w=new ArrayBuffer(4);new DataView(w).setFloat32(0,G,!0),f.push(new Uint8Array(w))},h=G=>{
m(G?1:0)},N=G=>{const w=new TextEncoder().encode(G);m(w.byteLength),f.push(w)},B=G=>{m(G.byteLength),f.push(G)},x=(G,w)=>{
m(G.length);for(const D of G)w(D)};f.push(nr),m(Ya);{const G=new TextEncoder().encode(n._name);f.push(G)}for(const G of u.
fields){const w=n[G.name];if(!G.isNullable&&w==null)throw new Error(`${n._name}: Expect field ${G.name} to be non-nullab\
le`);if(w==null){m(dt);continue}switch(m(en[G.type]),G.type){case"str":N(w);break;case"int":g(w);break;case"float":p(w);
break;case"bool":h(w);break;case"raw":B(w);break;case"arr_str":x(w,N);break;case"arr_int":x(w,g);break;case"arr_float":x(
w,p);break;case"arr_bool":x(w,h);break;case"arr_raw":x(w,B);break}}const y=f.reduce((G,w)=>G+w.byteLength,0),R=new Uint8Array(
y);let T=0;for(const G of f)R.set(G,T),T+=G.byteLength;return R}const Ve=Object.freeze({profile:"gemma4-unified-v1",imageMinTokens:70,
imageMaxTokens:280,batchTokens:512,contextTokens:2048,maximumFiles:2,requestBytes:6*1024**2});function Ui(n){const u=n?.
ggufMedia;if(u===void 0)return null;if(!u||Object.keys(u).length!==2||u.profile!==Ve.profile||u.projectorPath!=="mmproj-\
gemma4-unified-f16.gguf"||n.architecture!=="gemma4"||n.task!=="text-generation"||JSON.stringify(n.modalities)!=='["text"\
,"image","audio"]')throw new Error("Unsupported GGUF multimodal profile");return Ve}const Ri=Uint32Array.from({length:256},
(n,u)=>{let f=u;for(let m=0;m<8;m++)f=f&1?3988292384^f>>>1:f>>>1;return f>>>0});function Oi(n,u,f){let m=4294967295;for(let g=u;g<
f;g++)m=Ri[(m^n[g])&255]^m>>>8;return(m^4294967295)>>>0}function Yr(n,u){const f=new Uint8Array(u.length+12),m=new DataView(
f.buffer);return m.setUint32(0,u.length),f.set(new TextEncoder().encode(n),4),f.set(u,8),m.setUint32(f.length-4,Oi(f,4,f.
length-4)),f}function Mi(n){const u=lt(n);if(!u)throw new Error("GGUF image pixels are required");const f=u.width*4,m=new Uint8Array(
u.data.length+u.height);for(let G=0;G<u.height;G++)m.set(u.data.subarray(G*f,(G+1)*f),G*(f+1)+1);const g=new Uint8Array(
2+m.length+Math.ceil(m.length/65535)*5+4);g.set([120,1]);let p=2,h=1,N=0;const B=new DataView(g.buffer);for(let G=0;G<m.
length;){const w=Math.min(65535,m.length-G);g[p++]=G+w===m.length?1:0,B.setUint16(p,w,!0),B.setUint16(p+2,w^65535,!0),p+=
4,g.set(m.subarray(G,G+w),p),p+=w;for(let D=G;D<G+w;D++)h=(h+m[D])%65521,N=(N+h)%65521;G+=w}B.setUint32(p,(N<<16|h)>>>0);
const x=new Uint8Array(13),y=new DataView(x.buffer);y.setUint32(0,u.width),y.setUint32(4,u.height),x.set([8,6,0,0,0],8);
const R=[new Uint8Array([137,80,78,71,13,10,26,10]),Yr("IHDR",x),Yr("IDAT",g),Yr("IEND",new Uint8Array)],T=new Uint8Array(
R.reduce((G,w)=>G+w.length,0));p=0;for(const G of R)T.set(G,p),p+=G.length;return T}function ji(n){const{samples:u,sampleRate:f}=ft(
n?.samples,n?.sampleRate),m=new Uint8Array(44+u.length*2),g=new DataView(m.buffer),p=(h,N)=>m.set(new TextEncoder().encode(
N),h);p(0,"RIFF"),g.setUint32(4,m.length-8,!0),p(8,"WAVE"),p(12,"fmt "),g.setUint32(16,16,!0),g.setUint16(20,1,!0),g.setUint16(
22,1,!0),g.setUint32(24,f,!0),g.setUint32(28,f*2,!0),g.setUint16(32,2,!0),g.setUint16(34,16,!0),p(36,"data"),g.setUint32(
40,u.length*2,!0);for(let h=0;h<u.length;h++){const N=Math.max(-1,Math.min(1,u[h]));g.setInt16(44+h*2,Math.round(N*(N<0?
32768:32767)),!0)}return m}function Di({image:n,audio:u}){return lt(n),u!=null&&ft(u.samples,u.sampleRate),[...n?[Mi(n)]:
[],...u?[ji(u)]:[]]}function ja(n,u,f){if(f&&n.some(g=>g.content.includes(f)))throw new Error("Prompt contains a reserve\
d native media marker");if(!u.length)return{messages:n,files:[]};if(typeof f!="string"||!/^<[^\s<>]{1,126}>$/.test(f))throw new Error(
"Invalid native media marker");if(u.length>Ve.maximumFiles)throw new Error("Too many GGUF media inputs");const m=n.findLastIndex(
g=>g.role==="user");if(m<0)throw new Error("GGUF media needs a current user message");return{files:u,messages:n.map((g,p)=>p!==
m?g:{role:g.role,content:[{type:"text",text:g.content},...u.map(()=>({type:"text",text:f}))]})}}const rn=4*1024**2,at=1024*
1024;function zi(n,u){if(n==="completion"){if(typeof u?.data_json!="string"||new TextEncoder().encode(u.data_json).length>
at||!Array.isArray(u.files)||u.files.length>Ve.maximumFiles||u.files.some(p=>!(p instanceof Uint8Array)))throw new Error(
"Invalid GGUF native media request");if(u.files.reduce((p,h)=>p+h.byteLength,0)>Ve.requestBytes)throw new Error("GGUF na\
tive media exceeds its byte budget")}const f=Ci(u),m=n==="completion"?Ve.requestBytes:at;if(f.byteLength>m)throw new Error(
"GGUF native message exceeds its byte budget");return f}function qi({files:n,reader:u,getMemory:f,getSignal:m=()=>{}}){const g=new Map(
n.map(p=>[p.name,p]));return async(p,h,N,B)=>{const x=g.get(p.replace(/^\/?models\//,""));if(!x||![h,N,B].every(R=>Number.
isSafeInteger(R)&&R>=0)||h>x.size)throw new Error("Invalid GGUF native file read");const y=Math.min(N,x.size-h);if(!Number.
isSafeInteger(B+y)||B+y>f().byteLength)throw new Error("GGUF native file read exceeds WASM memory");for(let R=0;R<y;){ie(
m());const T=Math.min(rn,y-R),G=await u.read(x.path,h+R,T,{signal:m()});if(ie(m()),!(G instanceof Uint8Array)||G.byteLength!==
T)throw new Error("Incomplete GGUF artifact range");new Uint8Array(f()).set(G,B+R),R+=T}return BigInt(y)}}function Li(n,u){
n.FS.mkdir("/models"),n.FS.mount(n.MEMFS,{root:"."},"/models");const f=new Map(u.map(p=>[p.name,p])),m=n.MEMFS.stream_ops;
for(const p of["read","llseek"]){const h=m[p];m[p]=function(N,...B){const x=f.get(N.node.name);return x&&(N.node.usedBytes=
x.size),h.call(this,N,...B)},n.MEMFS.ops_table.file.stream[p]=m[p]}const g=m.mmap;m.mmap=function(p,...h){if(f.has(p.node.
name))throw new Error("GGUF artifact mmap is prohibited");return g.call(this,p,...h)},n.MEMFS.ops_table.file.stream.mmap=
m.mmap;for(const p of u)n.FS_createDataFile("/models",p.name,new Uint8Array(0),!0,!1,!0)}function Qi(n,u,{collect:f=!1,onLost:m}={}){
if(u.device=n,u.runtimeFeatures=[...n.features],u.runtimeAdapter=n.adapterInfo?{vendor:n.adapterInfo.vendor,architecture:n.
adapterInfo.architecture,isFallbackAdapter:n.adapterInfo.isFallbackAdapter??!1}:null,!n.features.has("shader-f16")||u.runtimeAdapter?.
isFallbackAdapter)throw new Error("GGUF native runtime did not acquire the required hardware GPU");if(n.lost.then(B=>m?.(
B)),!f)return()=>{};const g=Object.getOwnPropertyDescriptor(n,"createCommandEncoder"),p=Object.getOwnPropertyDescriptor(
n.queue,"submit"),h=n.createCommandEncoder.bind(n),N=n.queue.submit.bind(n.queue);return n.createCommandEncoder=(...B)=>{
const x=h(...B),y=x.beginComputePass.bind(x);return x.beginComputePass=(...R)=>{const T=y(...R);for(const G of["dispatch\
Workgroups","dispatchWorkgroupsIndirect"]){const w=T[G].bind(T);T[G]=(...D)=>{const L=w(...D);return u.dispatches+=1,L}}
return T},x},n.queue.submit=(...B)=>{const x=N(...B);return u.submissions+=1,x},()=>{g?Object.defineProperty(n,"createCo\
mmandEncoder",g):delete n.createCommandEncoder,p?Object.defineProperty(n.queue,"submit",p):delete n.queue.submit}}function Wi(n){
const u=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(n);return u?{gpuLayers:Number(u[1]),totalLayers:Number(u[2])}:
null}function $i(n){const u=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.exec(n);return u?
{backend:u[1],kind:u[2].toLowerCase(),bytes:Math.round(Number(u[3])*1024**2)}:null}async function Pi({wasmUrl:n,weights:u,
projector:f,adapters:m=[],reader:g,signal:p,collectGpuEvidence:h=!1,onProgress:N,onLost:B,initialize:x=wi}={}){const y=u.
map((U,Q)=>({...U,name:`model-${String(Q+1).padStart(5,"0")}-of-${String(u.length).padStart(5,"0")}.gguf`}));if(f&&u.some(
U=>U.path===f.path))throw new Error("GGUF projector must be separate from text shards");const R=f?{...f,name:"mmproj.ggu\
f"}:void 0,T=m.map((U,Q)=>({...U.file,scale:U.scale,name:`adapter-${Q+1}.gguf`})),G=[...y,...R?[R]:[],...T];if(new Set(G.
map(U=>U.path)).size!==G.length)throw new Error("GGUF base and companion files must have distinct paths");const w={dispatches:0,
submissions:0,device:null,offload:null,buffers:[],lost:!1};let D=p,L,q,Z,ve,de;const se=new Promise((U,Q)=>{ve=U,de=Q}),
ce=U=>{const Q=Wi(String(U));Q&&(w.offload=Q,N?.({type:"gpu-offload",...Q}));const X=$i(String(U));X&&w.buffers.length<32&&
(w.buffers.push(X),N?.({type:"native-buffer",...X,wasmMemoryBytes:Z?.wasmMemory?.buffer.byteLength??0}))},ue=U=>{L=new Error(
`Model session lost: GGUF native runtime failed: ${String(U).slice(0,300)}`),de(L)};Z={noInitialRun:!0,pthreadPoolSize:0,
locateFile(U){if(U!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return n},print:ce,printErr:ce,
onAbort:ue,onExit:ue,preRun(){Z.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){ve()},peercomputeOnDevice(U){try{q?.(),q=
Qi(U,w,{collect:h,onLost(Q){w.lost=!0,B?.(Q)}})}catch(Q){U.destroy(),ue(Q.message)}}};const pe=qi({files:G,reader:g,getMemory:()=>Z.
wasmMemory.buffer,getSignal:()=>D});x(Z,pe),await se,ie(p),Li(Z,G);const ne=Z.cwrap("wllama_start","string",[],{async:!0}),
ke=Z.cwrap("wllama_malloc","bigint",["bigint","number"]),be=Z.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});
let l=!1;const Be=async(U,Q,X)=>{if(l)throw new Error("Concurrent GGUF native calls are prohibited");if(L)throw L;if(w.lost)
throw new Error("GPU device lost; GGUF session is unavailable");ie(X);const ee=zi(U,Q);l=!0,D=X;try{const F=Number(ke(BigInt(
ee.byteLength),0)),A=new Uint8Array(Z.wasmMemory.buffer);if(!Number.isSafeInteger(F)||F<=0||F+ee.length>A.length)throw new Error(
"Invalid GGUF input pointer");A.set(ee,F);const le=Number(await be(U,BigInt(F)));if(L)throw L;const ae=Z.wasmMemory.buffer,
J=new DataView(ae).getUint32(F,!0);if(!Number.isSafeInteger(le)||le<=0||J>at||le+J>ae.byteLength)throw new Error("Invali\
d GGUF output buffer");return Ti(new Uint8Array(ae,le,J).slice())}catch(F){throw L??=new Error(`Model session lost: GGUF\
 native action failed: ${String(F.message??F).slice(0,300)}`),L}finally{l=!1,D=void 0}},j=JSON.parse(await ne());if(L)throw L;
if(!j.success||!w.device)throw new Error("GGUF native hardware GPU backend did not initialize");return ie(p),{files:y,projectorFile:R,
adapterFiles:T,action:Be,evidence:w,async settleGpu(){try{await w.device.queue.onSubmittedWorkDone()}catch(U){throw w.lost=
!0,L=new Error(`Model session lost: GGUF GPU completion failed: ${String(U.message??U).slice(0,300)}`),L}},close(){q?.(),
w.device?.destroy()},memoryBytes(){return Z.wasmMemory.buffer.byteLength}}}const Y=Object.freeze({maximumBytes:16*1024**
3,headerBytes:16*1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,stringBytes:1024**2}),mt=Object.
freeze(di("llama.cpp").map(n=>n.architecture)),tn="peercompute.gguf.header.v1",Vi="3.8.1",nt=new Map([[0,["F32",1,4]],[1,
["F16",1,2]],[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",
256,84]],[11,["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],
[17,["IQ2_XS",256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["\
IQ2_S",256,82]],[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),kr=new Map([[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,
"q8_0"],[8,"q5_0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_\
k_s"],[17,"q5_k_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,
"iq4_nl"],[26,"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),Ji=new TextDecoder("utf-8",{fatal:!0}),
Hi=n=>Array.from(n,u=>u.toString(16).padStart(2,"0")).join(""),z=n=>new Error(`Unsupported GGUF Hub package: ${n}`),Da=n=>typeof n==
"string"&&/^[a-z0-9_]{1,64}$/.test(n)?n:"(missing or invalid)";function _e(n,u,f,m=0){if(!Number.isSafeInteger(n)||n<m||
n>u)throw z(`invalid ${f}`);return n}class Ki extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_\
GGUF_HEADER_TRUNCATED"}}function Xi(n,{size:u,kind:f="model",includeTensorInfo:m=!1}={}){if(!["model","lora"].includes(f)||
typeof m!="boolean")throw z("header inspection mode");if(!(n instanceof Uint8Array))throw z("header bytes required");if(_e(
u,Y.maximumBytes,"file size",24),n.length>Y.headerBytes||n.length>u)throw z("header byte budget exceeded");const g=new DataView(
n.buffer,n.byteOffset,n.byteLength);let p=0;function h(j){if(_e(j,Y.headerBytes,"header field length"),p+j>Y.headerBytes)
throw z("header byte budget exceeded");if(p+j>n.length)throw new Ki;const U=p;return p+=j,U}const N=()=>g.getUint32(h(4),
!0),B=()=>{const j=g.getBigUint64(h(8),!0);if(j>BigInt(Number.MAX_SAFE_INTEGER))throw z("unsafe 64-bit value");return Number(
j)};function x(j=Y.stringBytes,U=!0){const Q=_e(B(),j,"string length"),X=h(Q);return U?Ji.decode(n.subarray(X,X+Q)):void 0}
function y(j,U=!0,Q=!1){if(j===8)return x(Y.stringBytes,U);if(j===9){if(Q)throw z("nested metadata arrays");const A=N(),
le=_e(B(),Y.arrayItems,"array count");if(A===9||A>12)throw z("metadata array type");if(A===8)for(let ae=0;ae<le;ae++)x(Y.
stringBytes,!1);else h(le*[1,1,2,2,4,4,4,1,0,0,8,8,8][A]);return{array:!0,element:A,count:le}}const X=[1,1,2,2,4,4,4,1,0,
0,8,8,8];if(!X[j])throw z("metadata value type");const ee=h(X[j]);if(!U)return;if(j===0)return g.getUint8(ee);if(j===1)return g.
getInt8(ee);if(j===2)return g.getUint16(ee,!0);if(j===3)return g.getInt16(ee,!0);if(j===4)return g.getUint32(ee,!0);if(j===
5)return g.getInt32(ee,!0);if(j===6)return g.getFloat32(ee,!0);if(j===7){const A=g.getUint8(ee);if(A>1)throw z("boolean \
value");return!!A}if(j===12)return g.getFloat64(ee,!0);const F=j===10?g.getBigUint64(ee,!0):g.getBigInt64(ee,!0);if(F>BigInt(
Number.MAX_SAFE_INTEGER)||F<BigInt(Number.MIN_SAFE_INTEGER))throw z("unsafe metadata integer");return Number(F)}if(N()!==
1179993927)throw z("magic or byte order");const R=N();if(![2,3].includes(R))throw z("version");const T=_e(B(),Y.tensors,
"tensor count",1),G=_e(B(),Y.metadata,"metadata count",1),w=new Map,D=new Map;for(let j=0;j<G;j++){const U=x(512);if(!U||
w.has(U)||/[\u0000-\u001f\u007f]/u.test(U))throw z("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.
test(U))throw z("custom tensor layout requires catalog review");const Q=N();D.set(U,Q);const X=["general.architecture","\
general.type","general.file_type","general.alignment","general.name","general.quantization_version","split.count","split\
.no","split.tensors.count","tokenizer.ggml.model","tokenizer.ggml.tokens","adapter.type","adapter.lora.alpha"].includes(
U);w.set(U,y(Q,X))}const L=w.get("general.architecture");if(!mt.includes(L))throw z(`architecture ${Da(L)} is not admitt\
ed by the pinned browser runtime`);if(f==="model"){if(w.has("general.type")&&w.get("general.type")!=="model")throw z("ad\
apter or non-model GGUF")}else{if(w.get("general.type")!=="adapter"||w.get("adapter.type")!=="lora")throw z("ordinary Lo\
RA adapter required");const j=w.get("adapter.lora.alpha");if(D.get("adapter.lora.alpha")!==6||!Number.isFinite(j)||j<0||
j>65536)throw z("finite F32 LoRA alpha required");if([...w.keys()].some(U=>U.startsWith("adapter.")&&!["adapter.type","a\
dapter.lora.alpha"].includes(U)))throw z("nonstandard LoRA metadata requires a separate adapter profile")}if(/georefine/i.
test(w.get("general.name")??""))throw z("custom GeoRefine model requires catalog review");if((w.get("split.count")??1)!==
1||(w.get("split.no")??0)!==0||(w.get("split.tensors.count")??T)!==T)throw z("split GGUF requires complete shard admissi\
on");if(![void 0,2].includes(w.get("general.quantization_version")))throw z("quantization version");const q=w.get("gener\
al.file_type");if(f==="model"?!kr.has(q):![void 0,0,1].includes(q))throw z("file quantization type");const Z=w.get("toke\
nizer.ggml.model"),ve=L==="gemma4"?Z==="gemma4":["llama","gpt2"].includes(Z);if(f==="model"&&(!ve||w.get("tokenizer.ggml\
.tokens")?.element!==8||!w.get("tokenizer.ggml.tokens")?.count))throw z(`self-contained supported tokenizer required for\
 ${L}; found ${Da(Z)}`);const de=_e(w.get("general.alignment")??32,4096,"alignment",1);if(de&de-1)throw z("alignment mus\
t be a power of two");const se=new Set,ce=new Set,ue=[],pe=[],ne=new Map;let ke=0;for(let j=0;j<T;j++){const U=x(512);if(!U||
se.has(U)||/georefine|[\u0000-\u001f\u007f]/iu.test(U))throw z("duplicate or custom tensor name");se.add(U);const Q=_e(N(),
4,"tensor dimensions",1);let X=1,ee=0;const F=[];for(let I=0;I<Q;I++){const Ce=_e(B(),Y.maximumBytes,"tensor dimension",
1);I===0&&(ee=Ce),F.push(Ce),X*=Ce,_e(X,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const A=N(),le=nt.get(A);if(!le||
ee%le[1])throw z("unsupported tensor codec or quantized row shape");if(f==="lora"){const I=/^(.+\.weight)\.lora_([ab])$/.
exec(U);if(!I||/\.lora_[ab]/.test(I[1])||Q!==2||![0,1].includes(A))throw z("LoRA requires only ordinary F16/F32 matrix p\
airs; replacement tensors are unsupported");const Ce=ne.get(I[1])??{};Ce[I[2]]=F,ne.set(I[1],Ce)}const ae=_e(X/le[1]*le[2],
u,"tensor bytes",1),J=B();if(J%de||J+ae>u)throw z("tensor offset exceeds file or alignment");ue.push({start:J,end:J+ae}),
ce.add(A),m&&pe.push({name:U,shape:F,type:A,offset:J,bytes:ae}),ke=Math.max(ke,ae)}if(f==="model"&&(!se.has("token_embd.\
weight")||!se.has("output_norm.weight")))throw z("text model tensor layout");if(f==="lora")for(const[j,U]of ne){if(!U.a||
!U.b)throw z("LoRA tensor pair is incomplete");const X=j==="token_embd.weight"?U.a[0]:U.a[1];if(X!==U.b[0]||X>1024)throw z(
"LoRA tensor pair has inconsistent or unsupported rank")}const be=p,l=Math.ceil(p/de)*de;ue.sort((j,U)=>j.start-U.start);
let Be=0;for(const j of ue){if(j.start<Be||l+j.end>u)throw z("overlapping or truncated tensor data");Be=j.end}return{schema:f===
"model"?tn:"peercompute.gguf.lora-header.v1",version:R,architecture:L,fileType:q??null,dtype:kr.get(q)??"float",tensorCount:T,
metadataCount:G,headerBytes:be,dataOffset:l,maximumTensorBytes:ke,tensorTypes:[...ce].sort((j,U)=>j-U),headerSha256:Hi(Xa(
n.subarray(0,be))),...f==="lora"?{alpha:w.get("adapter.lora.alpha"),targetCount:ne.size}:{},...m?{tensorInfo:pe}:{}}}async function an({
readRange:n,size:u,signal:f,kind:m="model",includeTensorInfo:g=!1}={}){if(typeof n!="function")throw z("range reader req\
uired");_e(u,Y.maximumBytes,"file size",24);let p=new Uint8Array(0),h=Math.min(64*1024,u);for(;;){ie(f);const N=new Uint8Array(
h);N.set(p);for(let B=p.length;B<h;){const x=Math.min(Y.rangeBytes,h-B),y=await n(B,x,{signal:f});if(ie(f),!(y instanceof
Uint8Array)||y.length!==x)throw z("truncated range response");N.set(y,B),B+=x}p=N;try{return Xi(p,{size:u,kind:m,includeTensorInfo:g})}catch(B){
if(B.code!=="ERR_GGUF_HEADER_TRUNCATED"||h===u)throw B;if(h===Y.headerBytes)throw z("header exceeds bounded probe");h=Math.
min(h*2,u,Y.headerBytes)}}}function Yi(n){if(!n||n.schema!==tn||![2,3].includes(n.version)||!mt.includes(n.architecture)||
!kr.has(n.fileType)||kr.get(n.fileType)!==n.dtype||!/^[a-f0-9]{64}$/.test(n.headerSha256??""))throw z("header profile");
for(const[f,m]of[["tensorCount",Y.tensors],["metadataCount",Y.metadata],["headerBytes",Y.headerBytes],["dataOffset",Y.headerBytes+
4096],["maximumTensorBytes",Y.maximumBytes]])_e(n[f],m,f,1);if(n.dataOffset<n.headerBytes||!Array.isArray(n.tensorTypes)||
!n.tensorTypes.length||n.tensorTypes.length>nt.size||n.tensorTypes.some((f,m)=>!nt.has(f)||m>0&&f<=n.tensorTypes[m-1]))throw z(
"tensor profile");const u=["schema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerByt\
es","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.keys(n).some(f=>!u.includes(f)))throw z("u\
nexpected header profile field");return Object.fromEntries(u.map(f=>[f,n[f]]))}function Zi({repository:n,revision:u,file:f,
header:m}={}){if(typeof n!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(n)||!/^[a-f0-9]{40}$/.
test(u??""))throw z("immutable Hugging Face repository/revision required");if(tt(f?.path),!f.path.endsWith(".gguf")||!/^[a-f0-9]{64}$/.
test(f.sha256??""))throw z("pinned GGUF SHA-256 required");_e(f.size,Y.maximumBytes,"weight size",24);const g=Yi(m);if(g.
dataOffset+g.maximumTensorBytes>f.size)throw z("header/file size mismatch");const p=f.size>4*1024**3;return{model:{runtime:"\
llama.cpp",runtimeVersion:Vi,architecture:g.architecture==="qwen35"?"qwen3_5":g.architecture,format:"GGUF",task:"text-ge\
neration",dtype:g.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:n,revision:u,gguf:{...g,path:f.path,
size:f.size,sha256:f.sha256}},weights:[f],totalBytes:f.size,resourcePolicy:{maxModelBytes:Y.maximumBytes,minimumCpuBytes:(p?
8:2)*1024**3,minimumGpuBytes:(p?16:2)*1024**3}}}function nn(n,{files:u,totalBytes:f}={}){if(!n?.gguf)throw z("bounded he\
ader profile required");const{path:m,size:g,sha256:p,...h}=n.gguf,N=Zi({repository:n.repository,revision:n.revision,file:{
path:m,size:g,sha256:p},header:h});for(const B of["runtime","runtimeVersion","architecture","format","task","dtype"])if(n[B]!==
N.model[B])throw z(`model ${B} disagrees with header`);if(JSON.stringify(n.modalities)!=='["text"]'||JSON.stringify(n.requiredFeatures)!==
'["shader-f16"]')throw z("text-only/f16 capability profile required");if(u){const B=u.filter(x=>x.path.endsWith(".gguf"));
if(B.length!==1||B[0].path!==m||B[0].size!==g||B[0].sha256!==p||u.some(x=>!/^[a-f0-9]{64}$/.test(x.sha256??"")))throw z(
"file closure/digest mismatch");N.weights=B,f=u.reduce((x,y)=>x+y.size,0)}return N.totalBytes=_e(f??g,Y.maximumBytes,"pa\
ckage bytes",g),N}async function es(n,u,f,{signal:m}={}){if(!n.gguf)return;const g=nn(n,{files:u}).model.gguf,p=await an(
{size:u[0].size,signal:m,readRange:(y,R,T)=>f.read(u[0].path,y,R,T)}),{path:h,size:N,sha256:B,...x}=g;if(JSON.stringify(
p)!==JSON.stringify(x))throw z("stored header does not match inspected package")}const rs="peercompute.gguf.lora-header.\
v1",ge=n=>new Error(`Unsupported GGUF LoRA: ${n}`),on=n=>typeof n=="string"&&/^[a-f0-9]{64}$/.test(n),Se=(n,u,f=1)=>Number.
isSafeInteger(n)&&n>=f&&n<=u,sn=n=>n==="qwen3_5"?"qwen35":n;function pt(n){if(!n||n.schema!==rs||![2,3].includes(n.version)||
!mt.includes(n.architecture)||![null,0,1].includes(n.fileType)||n.dtype!==(n.fileType===0?"f32":n.fileType===1?"f16":"fl\
oat")||!on(n.headerSha256)||!Number.isFinite(n.alpha)||n.alpha<0||n.alpha>65536||!Se(n.tensorCount,Y.tensors)||n.tensorCount%
2||!Se(n.targetCount,Y.tensors/2)||n.tensorCount!==n.targetCount*2||!Se(n.metadataCount,Y.metadata)||!Se(n.headerBytes,Y.
headerBytes)||!Se(n.dataOffset,Y.headerBytes+4096)||n.dataOffset<n.headerBytes||!Se(n.maximumTensorBytes,Y.maximumBytes)||
!Array.isArray(n.tensorTypes)||!n.tensorTypes.length||n.tensorTypes.length>2||n.tensorTypes.some((f,m)=>![0,1].includes(
f)||m&&f<=n.tensorTypes[m-1]))throw ge("invalid bounded adapter header profile");const u=["schema","version","architectu\
re","fileType","dtype","tensorCount","metadataCount","headerBytes","dataOffset","maximumTensorBytes","tensorTypes","head\
erSha256","alpha","targetCount"];if(Object.keys(n).some(f=>!u.includes(f)&&f!=="tensorInfo"))throw ge("unexpected adapte\
r profile field");return Object.fromEntries(u.map(f=>[f,f==="tensorTypes"?[...n[f]]:n[f]]))}function ts({repository:n,revision:u,
path:f,file:m,header:g,scale:p=1}={}){if(typeof n!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.
test(n)||!/^[a-f0-9]{40}$/.test(u??""))throw ge("immutable adapter repository and revision required");if(tt(m?.path),tt(
f??m.path),!m.path.endsWith(".gguf")||!on(m.sha256)||!Se(m.size,Y.maximumBytes,24)||!Number.isFinite(p)||p<-2||p>2)throw ge(
"invalid adapter file or scale");const h=pt(g);if(h.dataOffset+h.maximumTensorBytes>m.size)throw ge("adapter profile exc\
eeds file size");return{role:"lora",format:"GGUF",file:{...m},scale:p,source:{repository:n,revision:u,path:f??m.path},profile:h}}
function as(n,u){const f=pt(u);if(n?.schema!=="peercompute.gguf.header.v1"||n.architecture!==f.architecture||!Array.isArray(
n.tensorInfo)||n.tensorInfo.length!==n.tensorCount||!Se(n.tensorCount,Y.tensors)||!Array.isArray(u.tensorInfo)||u.tensorInfo.
length!==f.tensorCount)throw ge("base architecture or complete tensor directories do not match");const m=new Map(n.tensorInfo.
map(h=>[h.name,h])),g=new Map(u.tensorInfo.map(h=>[h.name,h]));if(m.size!==n.tensorCount||g.size!==f.tensorCount)throw ge(
"duplicate tensor directory entries");let p=0;for(const h of g.values()){const N=/^(.+\.weight)\.lora_([ab])$/.exec(h.name);
if(!N||/\.lora_[ab]/.test(N[1])||![0,1].includes(h.type)||!Array.isArray(h.shape)||h.shape.length!==2||h.shape.some(G=>!Se(
G,Y.maximumBytes)))throw ge("ordinary matrix adapter required");if(N[2]==="b")continue;const B=m.get(N[1]),x=h,y=g.get(`${N[1]}\
.lora_b`);if(!B||!y||B.shape?.length!==2)throw ge("missing matrix target or LoRA pair in selected base");const R=N[1]===
"token_embd.weight",T=R?x.shape[0]:x.shape[1];if(!Se(T,1024)||T!==y.shape?.[0]||(R?B.shape[0]!==y.shape?.[1]||B.shape[1]!==
x.shape[1]:B.shape[0]!==x.shape[0]||B.shape[1]!==y.shape?.[1]))throw ge("adapter tensor dimensions do not match selected\
 base");p++}if(p!==f.targetCount)throw ge("incomplete LoRA tensor pairs");return{architecture:f.architecture,targetCount:p,
tensorCount:f.tensorCount,alpha:f.alpha}}function cn(n,u,f){if(!Array.isArray(f)||f.length<1||f.length>4||n?.runtime!=="\
llama.cpp"||!Array.isArray(u)||u.length!==1)throw ge("one complete base GGUF and one to four adapters required");const m=new Set(
u.map(p=>p.path));let g=u[0].size;return f.map(p=>{if(!p||p.role!=="lora"||p.format!=="GGUF")throw ge("unsupported adapt\
er runtime or role");const h=ts({...p.source,file:p.file,header:p.profile,scale:p.scale});if(h.profile.architecture!==sn(
n.architecture))throw ge("adapter and base architectures differ");if(m.has(h.file.path))throw ge("duplicate adapter or b\
ase file path");if(m.add(h.file.path),g+=h.file.size,!Se(g,Y.maximumBytes))throw ge("combined package exceeds runtime by\
te budget");return h})}async function ns(n,u,f,m,{signal:g}={}){const p=cn(n,u,f),h=(x,y)=>an({size:x.size,kind:y,includeTensorInfo:!0,
signal:g,readRange:(R,T,G)=>m.read(x.path,R,T,G)});ie(g);const N=await h(u[0],"model");if(N.architecture!==sn(n.architecture)||
n.gguf&&N.headerSha256!==n.gguf.headerSha256)throw ge("stored base header differs from selected model");const B=[];for(const x of p){
ie(g);const y=await h(x.file,"lora");if(JSON.stringify(pt(y))!==JSON.stringify(x.profile))throw ge("stored adapter heade\
r differs from inspected file");B.push({path:x.file.path,...as(N,y)})}return B}const os="ERR_MODEL_CONTEXT_BUDGET",Sr=1;
function is(n,u,f){return Object.assign(new Error(`The model context holds ${u} tokens; instructions and the current pro\
mpt need ${n}, plus ${f} reserved for the reply. Shorten the current prompt or saved context, or request a shorter reply\
.`),{code:os})}function ss(n){const u=n.findIndex(m=>m.role==="user"),f=n.findIndex((m,g)=>g>u&&m.role==="user");return u<
0||f<0?null:n.filter((m,g)=>g<u||g>=f||m.role==="system")}async function cs({messages:n,contextTokens:u,reservedOutputTokens:f,
measure:m,signal:g,onMeasured:p}){if(!Number.isSafeInteger(u)||u<1||!Number.isSafeInteger(f)||f<1)throw new Error("Inval\
id GGUF context budget");let h=n.map(y=>({...y})),N=0,B=0;const x=Math.max(1,n.filter(y=>y.role==="user").length);for(let y=1;y<=
x;y+=1){ie(g);const R=await m(h);if(ie(g),!Number.isSafeInteger(R.inputTokens)||R.inputTokens<0||!Number.isSafeInteger(R.
contextTokens)||R.contextTokens<1||R.contextTokens>u||!Number.isSafeInteger(R.probeOutputTokens)||R.probeOutputTokens<0||
R.probeOutputTokens>Sr)throw new Error("Invalid GGUF context measurement");B+=R.probeOutputTokens;const T={contextTokens:R.
contextTokens,inputTokens:R.inputTokens,reservedOutputTokens:f,removedTurns:N,preflightCalls:y,measurementTokens:B,probeTokenBudget:Sr},
G=R.inputTokens>=R.contextTokens||R.inputTokens+f>R.contextTokens;if(p?.({...T,probeOutputTokens:R.probeOutputTokens,overflow:G}),
ie(g),!G)return{messages:h,contextTruncated:N>0,contextBudget:T};const w=ss(h);if(!w)throw is(R.inputTokens,R.contextTokens,
f);h=w,N+=1}throw new Error("GGUF context fitting exceeded its bounded attempts")}const Ze="Tsotchke-Corporation/Qwen3.8\
-27B-GeoRefine-D14-abl-GGUF",er="5ce3fd841676adf2c1a10d7193637d46007e88f7",za=[{path:".gitattributes",size:1603,gitBlobSha1:"\
dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687\
d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-a\
bl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"\
README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"\
af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}],us="This catalog supports verified storage and distribution. Execution is admitted separat\
ely by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";function un(n){
for(const u of Object.values(n))u&&typeof u=="object"&&un(u);return Object.freeze(n)}const ls=un({"qwen3.8-27b-georefine\
-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ze,revision:er,
status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"u\
navailable",executionReason:us},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ze}/blob/${er}/LICENSE`,notice:"\
Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ze,revision:er,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ze}/blob/${er}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ze,revision:er},weightBytes:14199740480,
totalBytes:za.reduce((n,u)=>n+u.size,0),files:za}});function ln(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.
values(n).forEach(ln),Object.freeze(n)),n}const fs=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],ds=ln(Object.fromEntries(fs.map(n=>{const{dtype:u,sourceModel:f,blockCount:m,nextnPredictLayers:g,...p}=n,
N=p.files.find(B=>B.path==="LICENSE").source;return[p.id,{...p,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+N.repository+"/blob/"+N.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:p.repository,revision:p.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+p.repository+"/blob/"+p.revision+"/README.md",sourceModel:{...f,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:m,
nextnPredictLayers:g,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:p.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:u,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:p.repository,revision:p.revision},weightBytes:p.files[0].size,totalBytes:p.
files.reduce((B,x)=>B+x.size,0)}]})));function gt(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).
forEach(gt),Object.freeze(n)),n}const Oe="Tsotchke-Corporation",fn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${Oe}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
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
S GGUF, candidate text)",repository:`${Oe}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
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
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${Oe}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
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
06e0df3640f9ae04fff09706ef"}]}],ms=gt(Object.fromEntries(fn.map(n=>{const{architecture:u,quantizationTypes:f,sourceModel:m,
publisherLimitations:g,...p}=n;return[n.id,{...p,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${n.repository}\
/blob/${n.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:n.repository,revision:n.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${n.repository}/blob/${n.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:m,
publisherLimitations:g,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:u,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:f,modalities:["text"],requiredFeatures:["shader-f16"],repository:n.repository,
revision:n.revision},weightBytes:n.files.filter(h=>h.path.endsWith(".gguf")).reduce((h,N)=>h+N.size,0),totalBytes:n.files.
reduce((h,N)=>h+N.size,0)}]})));gt({organization:Oe,sourceUrl:`https://huggingface.co/${Oe}`,checkedAt:"2026-11-04",repositories:[
...fn.map(({id:n,repository:u,revision:f})=>({repository:u,revision:f,catalogId:n,format:"GGUF",codecRequired:!1})),{repository:`${Oe}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Oe}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Oe}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${Oe}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const br="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",_r="036d46331b5ef633654ff516e739\
73e81c8eca79",qa="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",La=`https://huggingface.co/${br}/blob/${_r}/README.\
md`,Zr=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59b\
b8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028\
c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function dn(n){return n&&typeof n=="object"&&
!Object.isFrozen(n)&&(Object.values(n).forEach(dn),Object.freeze(n)),n}const ps=dn({[qa]:{id:qa,name:"MiMo V2.6 Distill \
Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:br,revision:_r,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"\
User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolat\
ion, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher\
-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"\
MIT",sourceUrl:La,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked \
parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:br,revision:_r,format:"GGUF",
metadataCheckedAt:"2026-11-10",modelCardUrl:La,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"\
1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion i\
nput revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for t\
hese GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 o\
nly; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"\
working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not suppl\
ied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",
task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:br,revision:_r},weightBytes:Zr[0].
size,totalBytes:Zr.reduce((n,u)=>n+u.size,0),files:Zr}}),vr="TrevorJS/gemma-4-12B-it-uncensored-GGUF",yr="d878d412b001a7\
20b9a62eaac432d00aac9d1b4f",Qa="gemma4-12b-uncensored-q4-k-m-gguf",gs=`https://huggingface.co/${vr}/blob/${yr}/README.md`,
Wa="TrevorJS/gemma-4-12B-it-uncensored",$a="159eb7a8a04efb31ed43887e4732ff3edccff8ac",et=[{path:"gemma-4-12B-it-uncensor\
ed-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README\
.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961\
e18b9a380366eb9ed3d6ee"}];function mn(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(mn),
Object.freeze(n)),n}const pn=mn({[Qa]:{id:Qa,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:vr,revision:yr,
status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this\
 exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires sh\
ader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publi\
sher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apa\
che-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. Th\
e conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENS\
E file."},provenance:{repository:vr,revision:yr,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:gs,sourceModel:{
repository:Wa,revision:$a,modelCardUrl:`https://huggingface.co/${Wa}/blob/${$a}/README.md`,modelCardBytes:4929,modelCardSha256:"\
d2994dbe94e6a1c3fce070b0b6efc5fe8e9aa4a7803b41f29c1479713bad352b",revisionPurpose:"Pinned source metadata reference; not\
 a verified conversion input revision.",conversionInputRevisionVerified:!1},upstreamModel:{repository:"google/gemma-4-12\
B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",revisionPurpose:"Pinned upstream metadata and license referenc\
e.",architecture:"Gemma4UnifiedForConditionalGeneration",modalities:["text","image","audio"]},vision:"The upstream model\
 is multimodal; this is a text-only GGUF package without a vision or audio projector. Upstream capabilities do not estab\
lish browser support.",publisherEvaluation:"The source card reports native llama.cpp Q8 testing; it does not establish Q\
4_K_M browser execution.",runtimeRequirement:"Gemma4Unified support from llama.cpp PR #24118 (2026-06-04 or later), incl\
uding the gemma4 tokenizer.",ggufHeader:{version:3,architecture:"gemma4",tokenizer:"gemma4",blockCount:48,tensorCount:667,
contextLength:262144,completeHeaderBytes:15822379,tensorTypes:["F32","Q4_K","Q6_K"]}},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:"gemma4",format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["\
shader-f16"],repository:vr,revision:yr},weightBytes:et[0].size,totalBytes:et.reduce((n,u)=>n+u.size,0),files:et}});function gn(n){
return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(gn),Object.freeze(n)),n}const ot=gn({id:"ge\
mma4-unified-trevor-159eb7a8-f16-v1",converterRevision:"46ca246de9bb1c35269722a6240d37d9dfd79cad",source:{repository:"Tr\
evorJS/gemma-4-12B-it-uncensored",revision:"159eb7a8a04efb31ed43887e4732ff3edccff8ac",url:"https://huggingface.co/Trevor\
JS/gemma-4-12B-it-uncensored/resolve/159eb7a8a04efb31ed43887e4732ff3edccff8ac/model.safetensors",size:23919549408,publisherSha256:"\
dd7fcab67274aea3adaf0f29fb6bc120b504f8b1a597124f03c15259e20c6f84"},sourceTensorBytes:104759808,size:122030944,sha256:"ee\
1fed84b7d15ffc4d13c44b59fff59e50fe89f36adcc5ec4900c83efd0edc27",headerHex:"47475546030000000b000000000000001b00000000000\
000140000000000000067656e6572616c2e617263686974656374757265080000000400000000000000636c69700c0000000000000067656e6572616\
c2e747970650800000006000000000000006d6d70726f6a0c0000000000000067656e6572616c2e6e616d6508000000230000000000000047656d6d6\
1342031324220547265766f7220556e696669656420436f6d70616e696f6e120000000000000067656e6572616c2e73697a655f6c6162656c0800000\
0030000000000000035324d110000000000000067656e6572616c2e66696c655f7479706504000000010000001700000000000000636c69702e68617\
35f766973696f6e5f656e636f64657207000000011a00000000000000636c69702e766973696f6e2e70726f6a656374696f6e5f64696d04000000000\
f00001600000000000000636c69702e766973696f6e2e696d6167655f73697a6504000000e00000001600000000000000636c69702e766973696f6e2\
e70617463685f73697a6504000000100000001c00000000000000636c69702e766973696f6e2e656d62656464696e675f6c656e67746804000000000\
f00001f00000000000000636c69702e766973696f6e2e666565645f666f72776172645f6c656e67746804000000000000001700000000000000636c6\
9702e766973696f6e2e626c6f636b5f636f756e7404000000000000002000000000000000636c69702e766973696f6e2e617474656e74696f6e2e686\
561645f636f756e7404000000000000001600000000000000636c69702e766973696f6e2e696d6167655f6d65616e090000000600000003000000000\
000000000000000000000000000001500000000000000636c69702e766973696f6e2e696d6167655f737464090000000600000003000000000000000\
000803f0000803f0000803f1600000000000000636c69702e6861735f617564696f5f656e636f64657207000000011900000000000000636c69702e6\
17564696f2e70726f6a656374696f6e5f64696d04000000000f00001b00000000000000636c69702e617564696f2e656d62656464696e675f6c656e6\
7746804000000800200001e00000000000000636c69702e617564696f2e666565645f666f72776172645f6c656e67746804000000000000001600000\
000000000636c69702e617564696f2e626c6f636b5f636f756e7404000000000000001f00000000000000636c69702e617564696f2e617474656e746\
96f6e2e686561645f636f756e7404000000000000001a00000000000000636c69702e766973696f6e2e70726f6a6563746f725f74797065080000000\
80000000000000067656d6d613475762800000000000000636c69702e766973696f6e2e617474656e74696f6e2e6c617965725f6e6f726d5f6570736\
96c6f6e06000000bd3786351900000000000000636c69702e617564696f2e70726f6a6563746f725f7479706508000000080000000000000067656d6\
d613475611700000000000000636c69702e617564696f2e6e756d5f6d656c5f62696e7304000000800000002700000000000000636c69702e6175646\
96f2e617474656e74696f6e2e6c617965725f6e6f726d5f657073696c6f6e06000000bd3786351c0000000000000067656e6572616c2e7175616e746\
97a6174696f6e5f76657273696f6e04000000020000001c000000000000006d6d2e612e696e7075745f70726f6a656374696f6e2e776569676874020\
000008002000000000000000f0000000000000100000000000000000000001a000000000000006d6d2e696e7075745f70726f6a656374696f6e2e776\
56967687402000000000f000000000000000f0000000000000100000000004b00000000001100000000000000762e70617463685f656d62642e62696\
17301000000000f0000000000000000000000000d02000000001300000000000000762e70617463685f656d62642e77656967687402000000001b000\
000000000000f00000000000001000000003c0d02000000001300000000000000762e70617463685f6e6f726d2e312e6269617301000000001b00000\
000000000000000003c3705000000001500000000000000762e70617463685f6e6f726d2e312e77656967687401000000001b0000000000000000000\
000a83705000000001300000000000000762e70617463685f6e6f726d2e322e6269617301000000000f0000000000000000000000143805000000001\
500000000000000762e70617463685f6e6f726d2e322e77656967687401000000000f000000000000000000000050380500000000160000000000000\
0762e706f736974696f6e5f656d62642e77656967687403000000000f0000000000006004000000000000020000000000000000000000008c3805000\
000001300000000000000762e70617463685f6e6f726d2e332e6269617301000000000f00000000000000000000008c4507000000001500000000000\
000762e70617463685f6e6f726d2e332e77656967687401000000000f0000000000000000000000c8450700000000000000000000000000000000000\
00000000000",tensors:[{sourceName:"model.embed_audio.embedding_projection.weight",sourceOffset:88960,sourceBytes:4915200,
sourceSha256:"13acfa416b1b5462172e035f4d0bfa8b5687ffcbe8e39a641c0f6255deae55aa",transform:"identity",outputName:"mm.a.in\
put_projection.weight",outputType:"f16",outputOffset:1888,outputBytes:4915200},{sourceName:"model.embed_vision.embedding\
_projection.weight",sourceOffset:5004160,sourceBytes:29491200,sourceSha256:"24b039b273e7abb78598449b14ca508f52b2b6f8a9de\
e02636eb999dd74b76cb",transform:"identity",outputName:"mm.input_projection.weight",outputType:"f16",outputOffset:4917088,
outputBytes:29491200},{sourceName:"model.vision_embedder.patch_dense.bias",sourceOffset:23849196e3,sourceBytes:7680,sourceSha256:"\
cff453202ce800f6ae86de0155916397807569cf9982aff6ecbf4d338d4e6367",transform:"identity",outputName:"v.patch_embd.bias",outputType:"\
f32",outputOffset:34408288,outputBytes:15360},{sourceName:"model.vision_embedder.patch_dense.weight",sourceOffset:23849203680,
sourceBytes:53084160,sourceSha256:"3e6de438f7269759f3f380cf17ea4b7be38f66fb1bf080a13afe52d08db2d8cb",transform:"patch-ch\
w",outputName:"v.patch_embd.weight",outputType:"f16",outputOffset:34423648,outputBytes:53084160},{sourceName:"model.visi\
on_embedder.patch_ln1.bias",sourceOffset:23902287840,sourceBytes:13824,sourceSha256:"59feb36622246d1b1e063f36c13e0219b0e\
a8bf85387c963ef74e4572f9c4a62",transform:"patch-chw",outputName:"v.patch_norm.1.bias",outputType:"f32",outputOffset:87507808,
outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln1.weight",sourceOffset:23902301664,sourceBytes:13824,sourceSha256:"\
9f24ede566712933ce0e196985bda3678db26d2ba9986de83473d601236c266a",transform:"patch-chw",outputName:"v.patch_norm.1.weigh\
t",outputType:"f32",outputOffset:87535456,outputBytes:27648},{sourceName:"model.vision_embedder.patch_ln2.bias",sourceOffset:23902315488,
sourceBytes:7680,sourceSha256:"7f0c14a2d8e734bcd6441ae26199efb5c29d08b51b43bbd32d65b8e4865e3df9",transform:"identity",outputName:"\
v.patch_norm.2.bias",outputType:"f32",outputOffset:87563104,outputBytes:15360},{sourceName:"model.vision_embedder.patch_\
ln2.weight",sourceOffset:23902323168,sourceBytes:7680,sourceSha256:"a4abbf0ce48d752c4b605d2f5bc882c84e4f02729c0dfcd3421e\
0905f7a03a90",transform:"identity",outputName:"v.patch_norm.2.weight",outputType:"f32",outputOffset:87578464,outputBytes:15360},
{sourceName:"model.vision_embedder.pos_embedding",sourceOffset:23902330848,sourceBytes:17203200,sourceSha256:"fec2505806\
22e6ae1e39ee89cf9c173e0a15a7987d75c5dcb1975ba08df178d0",transform:"position-xy",outputName:"v.position_embd.weight",outputType:"\
f32",outputOffset:87593824,outputBytes:34406400},{sourceName:"model.vision_embedder.pos_norm.bias",sourceOffset:23919534048,
sourceBytes:7680,sourceSha256:"43b0a2fbb80dcb85bb0602a686588ca8387703da9bf65ae55e20f8e763368aa1",transform:"identity",outputName:"\
v.patch_norm.3.bias",outputType:"f32",outputOffset:122000224,outputBytes:15360},{sourceName:"model.vision_embedder.pos_n\
orm.weight",sourceOffset:23919541728,sourceBytes:7680,sourceSha256:"712aba394794531a970fdfb9451492cc8286ecbb431951950dc2\
296c18697e5d",transform:"identity",outputName:"v.patch_norm.3.weight",outputType:"f32",outputOffset:122015584,outputBytes:15360}]}),
it=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:ot.size,sha256:ot.sha256}),or=pn["gemma4-12b-uncensored-q4-\
k-m-gguf"],Pa="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",Va=[...or.files,it],rr=ot;function hn(n){return n&&typeof n==
"object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(hn),Object.freeze(n)),n}const hs=hn({[Pa]:{...or,id:Pa,name:"Ge\
mma 4 12B Uncensored (Q4_K_M, vision + audio)",files:Va,description:"Image and audio understanding with text replies. Re\
uses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading thi\
s package to avoid keeping two 12B models in GPU memory.",capabilities:{...or.capabilities,executionStatus:"tested",executionReason:"\
Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained rel\
oad and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; \
speech synthesis uses a separate model."},model:{...or.model,modalities:["text","image","audio"],ggufMedia:{profile:"gem\
ma4-unified-v1",projectorPath:it.path}},provenance:{...or.provenance,vision:"A separately derived Gemma4Unified companio\
n supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browse\
r execution remains unverified.",derivedArtifacts:[{path:it.path,recipe:rr.id,sourceRepository:rr.source.repository,sourceRevision:rr.
source.revision,sourcePath:"model.safetensors",sourceFileSha256:rr.source.publisherSha256,sourceDigestVerification:"Publ\
isher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source c\
heckpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:rr.converterRevision,outputType:"f16"},
processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config\
.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced \
explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understan\
ding and transcription are distinct from image or speech generation."},totalBytes:Va.reduce((n,u)=>n+u.size,0)}}),tr="ba\
rtowski/Qwen_Qwen3.5-0.8B-GGUF",ar="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",rt=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",
size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"\
499cb320f9f2f3963beee9d8b890046f825c6f5d"}],st=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function bn(n){
return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(bn),Object.freeze(n)),n}const bs=Object.fromEntries(
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
LICENSE"}}]}].map(({architecture:n,...u})=>[u.id,bn({...u,status:"execution-candidate",format:"GGUF",capabilities:st,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${u.files[2].source.repository}/blob/${u.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:u.
repository,revision:u.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${u.repository}\
/blob/${u.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:n,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:u.repository,revision:u.revision},weightBytes:u.files[0].size,totalBytes:u.files.reduce((f,m)=>f+m.size,
0)})])),Ja=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:tr,revision:ar,status:"execution-candidate",format:"GGUF",capabilities:st,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${tr}/blob/${ar}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:tr,revision:ar,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${tr}/blob/${ar}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:tr,revision:ar},weightBytes:rt[0].size,totalBytes:rt.
reduce((n,u)=>n+u.size,0),files:rt},...bs,...ds,...ps,...pn,...hs,...ms,...Object.fromEntries(Object.entries(ls).map(([n,
u])=>[n,{...u,status:"execution-candidate",capabilities:st}]))}),_s="peercompute.model.composition.v1",ct=Object.freeze(
{adapters:4,scaleMagnitude:2,maximumBytes:yi}),Te=n=>new Error(`Invalid model composition: ${n}`),Ha=(n,u)=>JSON.stringify(
n)===JSON.stringify(u);function _n(n){return mi.createV1(85,pi(18,Xa(bi(n)))).toString()}function vs(n,u){const f=ir(n);
if(!f.model||f.model.composition!==void 0)throw Te("a model base without nested composition is required");const m=_n(f);
if(u!==void 0&&_i(u).toString()!==m)throw Te("base manifest CID does not match canonical base bytes");return{base:f,cid:m}}
function ys(n,{remap:u=!1}={}){if(!Array.isArray(n)||!n.length||n.length>ct.adapters)throw Te("one to four adapters are \
required");const f=new Set,m=new Set;return n.map((g,p)=>{if(!g||Object.keys(g).some(B=>!["role","format","file","scale",
"source","profile"].includes(B))||typeof g.role!="string"||!/^[a-z][a-z0-9-]{0,31}$/.test(g.role)||typeof g.format!="str\
ing"||!/^[A-Za-z][A-Za-z0-9._-]{0,31}$/.test(g.format)||!Number.isFinite(g.scale)||Math.abs(g.scale)>ct.scaleMagnitude||
!g.profile||typeof g.profile!="object"||Array.isArray(g.profile)||!g.source||typeof g.source!="object"||Array.isArray(g.
source))throw Te("adapter descriptor or strength");const h=ir({schema:vi,files:[g.file]}).files[0];if(!h.sha256||!h.size)
throw Te("adapter requires a nonempty file with a pinned SHA-256");const N=`${h.sha256}:${h.size}`;if(f.has(h.cid)||m.has(
N))throw Te("duplicate adapter bytes");return f.add(h.cid),m.add(N),{role:g.role,format:g.format,scale:Object.is(g.scale,
-0)?0:g.scale,file:{...h,...u?{path:`adapters/${p+1}-${h.sha256.slice(0,16)}.${g.format.toLowerCase()}`}:{}},source:{...g.
source},profile:{...g.profile}}})}function ws(n){const u=ir(n),f=u.model?.composition;if(f===void 0)return{manifest:u,baseManifest:u,
baseManifestCid:_n(u),adapters:[]};if(!f||f.schema!==_s||typeof f.baseManifestCid!="string"||Object.keys(f).some(y=>!["s\
chema","baseManifestCid","baseManifest","adapters"].includes(y)))throw Te("unsupported composition schema");const{base:m,
cid:g}=vs(f.baseManifest,f.baseManifestCid),p=ys(f.adapters),{composition:h,...N}=u.model;if(!Ha(N,m.model))throw Te("co\
mposed model changed the base runtime identity");const B=ir({...m,files:[...m.files,...p.map(y=>y.file)]}).files;if(!Ha(
u.files,B))throw Te("composed file closure differs from exact base and adapters");const x=u.files.reduce((y,R)=>y+R.size,
0);if(!Number.isSafeInteger(x)||x>ct.maximumBytes)throw Te("combined package exceeds runtime byte budget");return{manifest:u,
baseManifest:m,baseManifestCid:g,adapters:p}}const vn="3.8.1",ut=2048,qe=1024**3;function yn(n){const u=ws(n),f=Es(u.baseManifest),
m=u.adapters.length?cn(f.manifest.model,f.weights,u.adapters):[],g=u.manifest.files.reduce((p,h)=>p+h.size,0);if(!Number.
isSafeInteger(g)||g>f.resourcePolicy.maxModelBytes)throw new Error("GGUF composed package exceeds its byte budget");return{
...f,manifest:u.manifest,baseManifest:f.manifest,adapters:m,totalBytes:g}}function Es(n){const u=ir(n),f=u.model,m=Ui(f),
g=Object.values(Ja).filter(T=>T.model.runtime==="llama.cpp"&&T.repository===f?.repository&&T.revision===f?.revision&&T.model.
architecture===f?.architecture&&T.model.task===f?.task&&T.model.dtype===f?.dtype&&JSON.stringify(T.model.ggufMedia??null)===
JSON.stringify(f?.ggufMedia??null)),p=g.length===1?g[0]:void 0;if(!p&&f?.gguf&&!m){const T=nn(f,{files:u.files});for(const G of Object.
values(Ja))if(!(G.repository!==f.repository||G.revision!==f.revision))for(const w of G.files.filter(D=>D.path.endsWith("\
.gguf"))){const D=T.weights.find(L=>L.path===w.path);if(D&&(D.size!==w.size||D.sha256!==w.sha256))throw new Error("GGUF \
weights do not match the pinned catalog digests")}return{...T,manifest:u}}if(!p||f.runtime!=="llama.cpp"||f.runtimeVersion!==
void 0&&f.runtimeVersion!==vn||p.model.runtimeVersion!==void 0&&f.runtimeVersion!==p.model.runtimeVersion||f.dtype!==p.model.
dtype||f.format!=="GGUF"||f.task!=="text-generation"||f.modalities!==void 0&&JSON.stringify(f.modalities)!==JSON.stringify(
p.model.modalities))throw new Error("GGUF model revision is not in the trusted runtime catalog");const h=u.files.filter(
T=>T.path.endsWith(".gguf")),N=p.files.filter(T=>T.path.endsWith(".gguf"));if(!h.length||h.length!==N.length||h.some(T=>!N.
some(G=>G.path===T.path&&G.size===T.size&&G.sha256===T.sha256)))throw new Error("GGUF weights do not match the pinned ca\
talog digests");if(m&&(u.files.length!==p.files.length||p.files.some(T=>!u.files.some(G=>G.path===T.path&&G.size===T.size&&
G.sha256===T.sha256))))throw new Error("GGUF multimodal file closure differs from the pinned catalog");const B=m?h.find(
T=>T.path===f.ggufMedia.projectorPath):void 0,x=h.filter(T=>T!==B);if(m&&(!B||x.length!==1))throw new Error("GGUF multim\
odal package requires its pinned projector and text weights");const y=u.files.reduce((T,G)=>T+G.size,0);if(!Number.isSafeInteger(
y)||y>16*qe)throw new Error("GGUF package exceeds its byte budget");const R=x.reduce((T,G)=>T+G.size,0)>4*qe;return{manifest:u,
weights:x,projector:B,mediaProfile:m,totalBytes:y,resourcePolicy:{maxModelBytes:16*qe,minimumCpuBytes:R?8*qe:2*qe,minimumGpuBytes:R?
16*qe:2*qe}}}function ks(n,u=globalThis.location?.href){const f=new URL(u);if(!n||Object.keys(n).some(g=>g!=="wasm")||typeof n.
wasm!="string")throw new Error("GGUF runtime needs one trusted WASM asset");const m=new URL(n.wasm,f);if(m.origin!==f.origin||
!["http:","https:"].includes(m.protocol)||m.username||m.password||m.search||m.hash||!m.pathname.endsWith(".wasm"))throw new Error(
"GGUF runtime WASM must be a fixed same-origin asset");return{wasm:m.href}}function Ss(n={},u=null){if(!n||typeof n!="ob\
ject"||Array.isArray(n)||Object.keys(n).some(m=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(m)))throw new Error(
"Unknown GGUF runtime option");const f={n_ctx:ut,n_batch:u?u.batchTokens:64,n_gpu_layers:99999,n_threads:1,...n};if(u&&f.
n_batch===64&&(f.n_batch=u.batchTokens),!Number.isInteger(f.n_ctx)||f.n_ctx<64||f.n_ctx>ut||!Number.isInteger(f.n_batch)||
f.n_batch<1||f.n_batch>(u?u.batchTokens:128)||u&&(f.n_batch!==u.batchTokens||f.n_ctx!==u.contextTokens)||!Number.isInteger(
f.n_gpu_layers)||f.n_gpu_layers<1||f.n_gpu_layers>99999||f.n_threads!==1)throw new Error("GGUF options exceed the manage\
d GPU runtime bounds");return Object.freeze(f)}function Bs(n,u){const{mediaProfile:f}=yn(u),m=lt(n.image),g=n.audio==null?
null:ft(n.audio.samples,n.audio.sampleRate);if((m||g)&&!f)throw new Error("This GGUF adapter currently accepts text only");
const p=n.maxNewTokens??Er.maxNewTokens;if(!Number.isInteger(p)||p<1||p>Er.maxNewTokens)throw new Error("GGUF output exc\
eeds its token budget");const h=hi(g&&n.messages==null&&n.prompt==null?{prompt:"Transcribe this audio."}:n);if((m||g)&&!h.
some(N=>N.role==="user"))throw new Error("GGUF media needs a current user message");return{messages:h,...m?{image:m}:{},
...g?{audio:g}:{},maxNewTokens:p}}async function xs({scope:n=globalThis,gpu:u=n.navigator?.gpu}={}){if(!n.crossOriginIsolated||
!n.SharedArrayBuffer)throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const f=n.WebAssembly;
if(typeof f?.Suspending!="function"||typeof f?.promising!="function")throw new Error("GGUF requires WebAssembly JSPI");try{
new f.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly me\
mory64")}const m=await u?.requestAdapter({powerPreference:"high-performance"});if(!m||m.isFallbackAdapter||m.info?.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!m.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:m.info?.vendor??"",architecture:m.info?.architecture??
"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const wr=n=>new TextEncoder().
encode(n).byteLength;function Gs(n){if(!n.data_json||n.data_json==="null")return[];if(typeof n.data_json!="string"||wr(n.
data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");let u;try{u=JSON.parse(n.data_json)}catch{throw new Error(
"GGUF returned invalid result JSON")}const f=Array.isArray(u)?u:[u];if(f.some(m=>!m||typeof m!="object"||Array.isArray(m)))
throw new Error("GGUF returned invalid result data");return f}function Ns(n,u){const f=n[0],m=f?.error??f,g=m?.n_prompt_tokens??
f?.n_prompt_tokens,p=m?.n_ctx??f?.n_ctx;if(m?.type==="exceed_context_size_error"&&Number.isSafeInteger(g)&&g>=p&&Number.
isSafeInteger(p)&&p>0&&p<=u)return Object.assign(new Error("GGUF native prompt exceeds the model context"),{code:"ERR_GG\
UF_NATIVE_CONTEXT",inputTokens:g,contextTokens:p});const h=m?.type==="invalid_request_error";return Object.assign(new Error(
h?"GGUF rejected the inference request":"GGUF native inference failed"),{code:h?"ERR_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE\
_FAILURE"})}function Is(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("G\
GUF inference requires a ComputeManager-owned worker")}function Ka(n){return{sessionId:n.sessionId,manifestCid:n.manifestCid,
status:n.lost?"lost":n.status,runtime:"llama.cpp",runtimeVersion:vn,task:"text-generation",workerId:n.workerId,adapter:n.
capabilities?.adapter,runtimeAdapter:n.engine?.evidence.runtimeAdapter??null,runtimeFeatures:n.engine?.evidence.runtimeFeatures??
[],gpuDispatches:n.engine?.evidence.dispatches??0,gpuSubmissions:n.engine?.evidence.submissions??0,gpuOffload:n.engine?.
evidence.offload??null,runtimeOptions:n.options,effectiveContextTokens:n.contextTokens??null,inputModalities:n.inputModalities??
["text"],loraAdapters:n.loraAdapters??[],nativeBuffers:n.engine?.evidence.buffers??[],wasmMemoryBytes:n.engine?.memoryBytes()??
0,generatedRequests:n.generatedRequests,artifactReads:n.reader?.getStats()??null}}function As({loadEngine:n=Pi,createReader:u=fi,
checkCapabilities:f=xs,assertWorker:m=Is,baseUrl:g=globalThis.location?.href}={}){let p;async function h(B,x){if(p)throw new Error(
"GGUF worker already has a resident model");const y=yn(B.manifest),R=ks(B.runtimeAssets,g),T=Ss(B.runtimeOptions,y.mediaProfile),
G=hr(B.sessionId);ie(x.signal);const w={sessionId:G,manifestCid:B.manifestCid,workerId:x.workerId??null,manifest:y.manifest,
mediaProfile:y.mediaProfile,status:"loading",options:T,generatedRequests:0,residency:new AbortController,lost:!1};p=w;try{
if(w.capabilities=await f(),ie(x.signal),w.reader=u(B.artifactPort,{manifest:y.manifest,signal:w.residency.signal,maxReadBytes:rn,
maxReads:1}),await es(y.baseManifest.model,y.weights,w.reader,{signal:x.signal}),y.adapters.length&&(w.loraAdapters=await ns(
y.baseManifest.model,y.weights,y.adapters,w.reader,{signal:x.signal})),ie(x.signal),w.engine=await n({wasmUrl:R.wasm,weights:y.
weights,projector:y.projector,adapters:y.adapters,reader:w.reader,signal:x.signal,collectGpuEvidence:B.collectGpuEvidence===
!0,onProgress:q=>x.emitProgress?.({...q,sessionId:G}),onLost(){w.lost=!0,w.active?.abort("GPU device lost")}}),ie(x.signal),
y.mediaProfile&&!w.engine.projectorFile)throw new Error("GGUF projector was not mounted");if(y.adapters.length&&w.engine.
adapterFiles?.length!==y.adapters.length)throw new Error("GGUF adapters were not mounted");const D=await w.engine.action(
"load",{_name:"load_req",model_paths:w.engine.files.map(q=>`models/${q.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...T,
n_ubatch:y.mediaProfile?.batchTokens??Math.min(64,T.n_batch),n_parallel:1,kv_unified:!0,...y.mediaProfile?{mmproj_path:`\
models/${w.engine.projectorFile.name}`,mmproj_offload:!0,image_min_tokens:y.mediaProfile.imageMinTokens,image_max_tokens:y.
mediaProfile.imageMaxTokens}:{},...y.adapters.length?{lora_paths:w.engine.adapterFiles.map(q=>`models/${q.name}`),lora_scales:y.
adapters.map(q=>q.scale)}:{},log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},x.signal);if(!D.
success)throw new Error("GGUF native model load failed");if(!Number.isSafeInteger(D.n_ctx)||D.n_ctx<1||D.n_ctx>ut)throw new Error(
"GGUF native model returned an invalid context capacity");if(w.contextTokens=D.n_ctx,y.mediaProfile){if(D.has_image_input!==
!0||D.has_audio_input!==!0||D.n_batch!==y.mediaProfile.batchTokens||D.n_ubatch!==y.mediaProfile.batchTokens||typeof D.media_marker!=
"string"||!/^<[^\s<>]{1,126}>$/.test(D.media_marker))throw new Error("GGUF native runtime did not confirm the required i\
mage/audio projector and batch profile");w.mediaMarker=D.media_marker,w.inputModalities=["text","image","audio"]}const L=w.
engine.evidence.offload;if(!L||L.gpuLayers<1||L.gpuLayers!==Math.min(T.n_gpu_layers,L.totalLayers))throw new Error("GGUF\
 did not honor the explicitly configured GPU layer offload");if(ie(x.signal),w.lost)throw new Error("GPU device lost dur\
ing GGUF load");return w.status="ready",Ka(w)}catch(D){throw w.engine&&x.emitProgress?.({type:"model-load-memory",sessionId:G,
wasmMemoryBytes:w.engine.memoryBytes(),nativeBuffers:w.engine.evidence.buffers??[]}),w.lost=!0,w.status="lost",w.residency.
abort(D),w.reader?.close(D),w.engine?.close(),D}}async function N(B,x){const y=p;if(!y||y.sessionId!==hr(B.sessionId)||y.
lost)throw new Error("Model session lost or not loaded");if(y.status!=="ready")throw new Error("GGUF model session is bu\
sy");const R=hr(B.requestId),T=Bs(B,y.manifest),{messages:G,maxNewTokens:w}=T;ie(x.signal);const D=Di(T);ie(x.signal),ja(
G,D,y.mediaMarker);const L=new AbortController,q=()=>L.abort(x.signal?.reason);x.signal?.addEventListener("abort",q,{once:!0}),
x.signal?.aborted&&q(),y.active=L,y.status="generating",y.requestId=R;const Z=y.engine.evidence.dispatches,ve=y.engine.evidence.
submissions;let de=0;async function se(ce,ue){let pe,ne=!1,ke="",be=null,l=null,Be="unknown",j=0;try{ie(L.signal);const U=ja(
ce,D,y.mediaMarker),Q=await y.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:U.
messages,stream:!ue,max_tokens:ue?Sr:w,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:U.
files},L.signal);if(!Q.success||!Number.isSafeInteger(Q.req_id)||Q.req_id<0)throw new Error("GGUF failed to start genera\
tion");pe=Q.req_id,ie(L.signal);for(let X=0;X<4096;X+=1){ie(L.signal);const ee=await y.engine.action("get_result",{_name:"\
gres_req",req_id:pe},L.signal);ie(L.signal);const F=Gs(ee);if(!ee.success||ee.is_error)throw Ns(F,y.contextTokens);for(const A of F){
const le=A.choices?.[0]?.finish_reason??A.finish_reason;le!=null&&(Be=["stop","length"].includes(le)?le:"unknown");const ae=A.
choices?.[0],J=ae?.delta?.content??ae?.message?.content??A.content??"";if(typeof J!="string")throw new Error("Invalid GG\
UF text chunk");if(ue){const I=ae?.delta?.reasoning_content??ae?.message?.reasoning_content??"";if(typeof I!="string")throw new Error(
"Invalid GGUF measurement result");if(j+=wr(J)+wr(I),j>Er.maxOutputBytes)throw new Error("GGUF measurement exceeds its b\
yte budget")}else{if(ke+=J,wr(ke)>Er.maxOutputBytes)throw new Error("GGUF output exceeds its byte budget");if(J&&x.emitProgress?.(
{type:"token",sessionId:y.sessionId,requestId:R,sequence:de++,text:J})===!1)throw new Error("Token consumer rejected out\
put")}be=A.usage?.prompt_tokens??A.timings?.prompt_n??be,l=A.usage?.completion_tokens??A.timings?.predicted_n??l}if(!ee.
has_more){ne=!0;break}await new Promise(A=>setTimeout(A,0))}if(!ne)throw new Error("GGUF result polling exceeded its req\
uest budget");if(l!==null&&(!Number.isSafeInteger(l)||l<0||l>(ue?Sr:w)))throw new Error("GGUF returned an over-budget to\
ken sequence");if(ue&&(!Number.isSafeInteger(be)||be<0||l===null))throw new Error("GGUF context preflight did not return\
 valid token usage");return{text:ke,inputTokens:be,outputTokens:l,finishReason:Be}}catch(U){throw(U?.name==="RuntimeErro\
r"||/Model session lost|GPU device lost/.test(U?.message??""))&&(y.lost=!0),U}finally{if(pe!==void 0&&!y.lost)try{ne||await y.
engine.action("cancel",{_name:"cncl_req",req_id:pe}),await y.engine.settleGpu()}catch{throw y.lost=!0,new Error("Model s\
ession lost while settling GGUF inference")}}}try{const ce=await cs({messages:G,contextTokens:y.contextTokens,reservedOutputTokens:w,
signal:L.signal,async measure(pe){try{const ne=await se(pe,!0);return{inputTokens:ne.inputTokens,contextTokens:y.contextTokens,
probeOutputTokens:ne.outputTokens}}catch(ne){if(ne.code!=="ERR_GGUF_NATIVE_CONTEXT")throw ne;return{inputTokens:ne.inputTokens,
contextTokens:ne.contextTokens,probeOutputTokens:0}}},onMeasured:pe=>x.emitProgress?.({type:"context-budget",sessionId:y.
sessionId,requestId:R,...pe})});ie(L.signal);const ue=await se(ce.messages,!1);if(ie(L.signal),y.lost)throw new Error("G\
PU device lost; model session is unavailable");return y.generatedRequests+=1,{sessionId:y.sessionId,requestId:R,...ue,contextTruncated:ce.
contextTruncated,contextBudget:ce.contextBudget,workerId:y.workerId,gpuDispatches:y.engine.evidence.dispatches-Z,gpuSubmissions:y.
engine.evidence.submissions-ve,gpuOffload:y.engine.evidence.offload,artifactReads:y.reader.getStats()}}catch(ce){throw ce?.
name==="RuntimeError"?(y.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(ce.message).slice(0,300)}`)):
(/Model session lost|GPU device lost/.test(ce.message??"")&&(y.lost=!0),ce)}finally{x.signal?.removeEventListener("abort",
q),y.active=null,y.requestId=null,y.status=y.lost?"lost":"ready"}}return async(B={},x={})=>{if(m(),B.command==="load")return h(
B,x);if(B.command==="generate")return N(B,x);const y=hr(B.sessionId);if(B.command==="status")return p?.sessionId===y?Ka(
p):{sessionId:y,status:"absent"};if(!p||p.sessionId!==y)throw new Error("Model session lost or not loaded");if(B.command===
"cancel")return p.requestId===B.requestId&&p.active?.abort(gi()),{sessionId:y,cancellationRequested:!0};if(B.command==="\
unload"){if(p.status==="generating")throw new Error("Cancel and await GGUF generation before unloading");return p.residency.
abort("GGUF unload"),p.reader?.close(),p.engine?.close(),p=null,{sessionId:y,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const Fs=As(),js=(n,u)=>Fs(n,u);export{As as createGgufTaskRuntime,js as handleModelTask};

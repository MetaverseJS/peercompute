var _o=Object.defineProperty;var vo=(n,l,u)=>l in n?_o(n,l,{enumerable:!0,configurable:!0,writable:!0,value:u}):n[l]=u;var Ae=(n,l,u)=>vo(n,typeof l!="symbol"?l+"":l,u);import{c as yo}from"./GgufArtifactReader-CzGoASVT.js";import{t as oe,v as gt,l as wo,C as Eo,c as ko,M as Or,a as Ar,b as So}from"./ArtifactReadBridge-COO86mrc.js";
import{validateImageInput as kt,normalizeModelMessages as Bo}from"./modelTask-BhFPPJiR.js";import{v as St}from"./runtimeDefinition-Cbawh_V4.js";
import{s as mn}from"./sha2-DF-yaAk2.js";import{n as br,e as Go,a as xo,A as No,b as Io}from"./ArtifactManifest-yd-Kg2mB.js";function Ao(n,l){var Pa,Ja,Ha,Ka,Xa,Ya;const u=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};
var m=!!globalThis.window,p=!!globalThis.WorkerGlobalScope,g=((Ja=(Pa=globalThis.process)==null?void 0:Pa.versions)==null?
void 0:Ja.node)&&((Ha=globalThis.process)==null?void 0:Ha.type)!="renderer",h=p&&((Ka=self.name)==null?void 0:Ka.startsWith(
"em-pthread"));if(g){var N=require("worker_threads");global.Worker=N.Worker,p=!N.isMainThread,h=p&&N.workerData=="em-pth\
read"}var T="./this.program",x=(e,r)=>{throw r},G=(Ya=(Xa=globalThis.document)==null?void 0:Xa.currentScript)==null?void 0:
Ya.src;typeof __filename<"u"?G=__filename:p&&(G=self.location.href);var v="";function F(e){return n.locateFile?n.locateFile(
e,v):v+e}var B,k;if(g){var R=require("fs");v=__dirname+"/",k=e=>{e=_e(e)?new URL(e):e;var r=R.readFileSync(e);return r},
B=async(e,r=!0)=>{e=_e(e)?new URL(e):e;var t=R.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(T=process.
argv[1].replace(/\\/g,"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=n),x=(e,r)=>{throw process.exitCode=
e,r}}else if(m||p){try{v=new URL(".",G).href}catch{}g||(p&&(k=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType=
"arraybuffer",r.send(null),new Uint8Array(r.response)}),B=async e=>{if(_e(e))return new Promise((t,a)=>{var o=new XMLHttpRequest;
o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=()=>{if(o.status==200||o.status==0&&o.response){t(o.response);return}
a(o.status)},o.onerror=a,o.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();
throw new Error(r.status+" : "+r.url)})}var P=console.log.bind(console),D=console.error.bind(console);if(g){var J=require("util"),
be=e=>typeof e=="object"?J.inspect(e):e;P=(...e)=>R.writeSync(1,e.map(be).join(" ")+`
`),D=(...e)=>R.writeSync(2,e.map(be).join(" ")+`
`)}var se=P,V=D,me,ne,we=!1,ye;function ce(e,r){e||ue(r)}var _e=e=>e.startsWith("file://");function f(){Ue.buffer!=A.buffer&&
ve()}if(g&&h){var le=N.parentPort;le.on("message",e=>{var r;return(r=global.onmessage)==null?void 0:r.call(global,{data:e})}),
Object.assign(globalThis,{self:global,postMessage:e=>le.postMessage(e)}),process.on("uncaughtException",e=>{postMessage(
{cmd:"uncaughtException",error:e}),process.exit(1)})}var xe;if(h){var W=!1;self.onunhandledrejection=r=>{throw r.reason||
r};async function e(r){try{var t=r.data,a=t.cmd;if(a==="load"){let o=[];self.onmessage=s=>o.push(s),xe=()=>{postMessage(
{cmd:"loaded"});for(let s of o)e(s);self.onmessage=e};for(const s of t.handlers)(!n[s]||n[s].proxy)&&(n[s]=(...c)=>{postMessage(
{cmd:"callHandler",handler:s,args:c})},s=="print"&&(se=n[s]),s=="printErr"&&(V=n[s]));Ue=t.wasmMemory,ve(),ne=t.wasmModule,
Qe(),Ir()}else if(a==="run"){jn(t.pthread_ptr),ut(t.pthread_ptr,0,0,1,0,0),Y.threadInitTLS(),Yr(t.pthread_ptr),W||(W=!0);
try{await zt(t.start_routine,t.arg)}catch(o){if(o!="unwind")throw o}}else t.target==="setimmediate"||(a==="checkMailbox"?
W&&Br():a&&(V(`worker: received unknown command ${a}`),V(t)))}catch(o){throw Oa(),o}}self.onmessage=e}var A,z,ie,I,U,pe,
ee,H,C,Ne=!1;function ve(){var e=Ue.buffer;A=new Int8Array(e),ie=new Int16Array(e),n.HEAPU8=z=new Uint8Array(e),I=new Int32Array(
e),U=new Uint32Array(e),pe=new Float32Array(e),ee=new Float64Array(e),H=new BigInt64Array(e),C=new BigUint64Array(e)}function Ie(){
if(!h){if(n.wasmMemory)Ue=n.wasmMemory;else{var e=n.INITIAL_MEMORY||134217728;Ue=new WebAssembly.Memory({initial:BigInt(
e/65536),maximum:65536n,shared:!0,address:"i64"})}ve()}}function _r(){if(n.preRun)for(typeof n.preRun=="function"&&(n.preRun=
[n.preRun]);n.preRun.length;)Ct(n.preRun.shift());Tt(Ft)}function tr(){if(Ne=!0,h)return xe();!n.noFSInit&&!i.initialized&&
i.init(),ze.__wasm_call_ctors(),i.ignorePermissions=!1}function vr(){if(!h){if(n.postRun)for(typeof n.postRun=="function"&&
(n.postRun=[n.postRun]);n.postRun.length;)On(n.postRun.shift());Tt(Mt)}}function ue(e){var t;(t=n.onAbort)==null||t.call(
n,e),e="Aborted("+e+")",V(e),we=!0,e+=". Build with -sASSERTIONS for more info.",Ne&&qa();var r=new WebAssembly.RuntimeError(
e);throw r}var Le;function yr(){return F("wllama.wasm")}function He(e){if(e==Le&&me)return new Uint8Array(me);if(k)return k(
e);throw"both async and sync fetching of the wasm failed"}async function wr(e){if(!me)try{var r=await B(e);return new Uint8Array(
r)}catch{}return He(e)}async function Be(e,r){try{var t=await wr(e),a=await WebAssembly.instantiate(t,r);return a}catch(o){
V(`failed to asynchronously prepare wasm: ${o}`),ue(o)}}async function ar(e,r,t){if(!e&&!_e(r)&&!g)try{var a=fetch(r,{credentials:"\
same-origin"}),o=await WebAssembly.instantiateStreaming(a,t);return o}catch(s){V(`wasm streaming compile failed: ${s}`),
V("falling back to ArrayBuffer instantiation")}return Be(r,t)}function Ee(){go(),er.__instrumented||(er.__instrumented=!0,
Ge.instrumentWasmImports(er));var e={env:er,wasi_snapshot_preview1:er};return e}async function Qe(){function e(c,d){return ze=
c.exports,ze=Ge.instrumentWasmExports(ze),ze=ho(ze),Mn(ze._emscripten_tls_init),po(ze),ne=d,Er(),ze}kr();function r(c){return e(
c.instance,c.module)}var t=Ee();if(n.instantiateWasm)return new Promise((c,d)=>{n.instantiateWasm(t,(_,S)=>{c(e(_,S))})});
if(h){var a=new WebAssembly.Instance(ne,Ee());return e(a,ne)}Le??(Le=yr());var o=await ar(me,Le,t),s=r(o);return s}class nr{constructor(r){
Ae(this,"name","ExitStatus");this.message=`Program terminated with exit(${r})`,this.status=r}}var It=e=>{e.terminate(),e.
onmessage=r=>{}},At=e=>{var r=Y.pthreads[e];Y.returnWorkerToPool(r)},Tt=e=>{for(;e.length>0;)e.shift()(n)},Ft=[],Ct=e=>Ft.
push(e),Ve=0,ir=null,Er=e=>{var t;if(Ve--,(t=n.monitorRunDependencies)==null||t.call(n,Ve),Ve==0&&ir){var r=ir;ir=null,r()}},
kr=e=>{var r;Ve++,(r=n.monitorRunDependencies)==null||r.call(n,Ve)},Ut=e=>{var r=Y.getNewWorker();if(!r)return 6;Y.runningWorkers.
push(r),Y.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,
pthread_ptr:e.pthread_ptr};return g&&r.unref(),r.postMessage(t,e.transferList),0},Sr=0,Dr=()=>Qr||Sr>0,Fe=()=>$a(),Ce=e=>Qa(
e),zr=e=>Wa(e),de=(e,r,t,...a)=>{for(var o=a.length*2,s=Fe(),c=zr(o*8),d=c/8,_=0;_<a.length;_++){var S=a[_];typeof S=="b\
igint"?((f(),H)[d+2*_]=1n,(f(),H)[d+2*_+1]=S):((f(),H)[d+2*_]=0n,(f(),ee)[d+2*_+1]=S)}var E=ja(e,r,o,c,t);return Ce(s),E};
function Rt(e){var r;if(h)return de(0,0,1,e);ye=e,Dr()||(Y.terminateAllThreads(),(r=n.onExit)==null||r.call(n,e),we=!0),
x(e,new nr(e))}function Ot(e){if(h)return de(1,0,0,e);qr(e)}var jt=(e,r)=>{if(ye=e,h)throw Ot(e),"unwind";Rt(e)},qr=jt,Y={
unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){h||Y.initMainThread()},initMainThread(){for(var e=n.
pthreadPoolSize;e--;)Y.allocateUnusedWorker();Ct(async()=>{var r=Y.loadWasmModuleToAllWorkers();kr(),await r,Er()})},terminateAllThreads:()=>{
for(var e of Y.runningWorkers)It(e);for(var e of Y.unusedWorkers)It(e);Y.unusedWorkers=[],Y.runningWorkers=[],Y.pthreads=
{}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete Y.pthreads[r],Y.unusedWorkers.push(e),Y.runningWorkers.splice(Y.runningWorkers.
indexOf(e),1),e.pthread_ptr=0,Ma(r)},threadInitTLS(){Y.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(
r=>{e.onmessage=s=>{var c=s.data,d=c.cmd;if(c.targetThread&&c.targetThread!=Nr()){var _=Y.pthreads[c.targetThread];_?_.postMessage(
c,c.transferList):V(`Internal error! Worker sent a message "${d}" to target pthread ${c.targetThread}, but that thread n\
o longer exists!`);return}d==="checkMailbox"?Br():d==="spawnThread"?Ut(c):d==="cleanupThread"?je(()=>At(c.thread)):d==="\
loaded"?(e.loaded=!0,g&&!e.pthread_ptr&&e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):d==="uncaughtExceptio\
n"?e.onerror(c.error):d==="callHandler"?n[c.handler](...c.args):d&&V(`worker sent an unknown command ${d}`)},e.onerror=s=>{
var c="worker sent an error!";throw V(`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},g&&(e.on("message",s=>e.onmessage(
{data:s})),e.on("error",s=>e.onerror(s)));var t=[],a=["onExit","onAbort","print","printErr"];for(var o of a)n.propertyIsEnumerable(
o)&&t.push(o);e.postMessage({cmd:"load",handlers:t,wasmMemory:Ue,wasmModule:ne})}),async loadWasmModuleToAllWorkers(){return h?
void 0:Promise.all(Y.unusedWorkers.map(Y.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=G;n.mainScriptUrlOrBlob&&
(r=n.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new u(r,{workerData:"em-pthread",name:"em-pth\
read"}),Y.unusedWorkers.push(e)},getNewWorker(){return Y.unusedWorkers.length==0&&(Y.allocateUnusedWorker(),Y.loadWasmModuleToWorker(
Y.unusedWorkers[0])),Y.unusedWorkers.pop()}},Mt=[],On=e=>Mt.push(e);function jn(e){var r=Number((f(),C)[(e+88)/8]),t=Number(
(f(),C)[(e+96)/8]),a=r-t;La(r,a),Ce(r)}var Lr=[],Dt=e=>{e=Number(e);var r=Lr[e];return r||(Lr[e]=r=Va.get(BigInt(e)),Ge.
isAsyncExport(r)&&(Lr[e]=r=Ge.makeAsyncFunction(r))),r},zt=async(e,r)=>{Sr=0,Qr=0;var t=(o=>WebAssembly.promising(Dt(e)).
call(null,BigInt(o)))(r);function a(o){if(Dr()){ye=o;return}lt(o)}t=await t,a(t)};zt.isAsync=!0;var Qr=!0,Mn=e=>Y.tlsInitFunctions.
push(e),Ue;function qt(e,r,t,a){return h?de(2,0,1,e,r,t,a):Lt(e,r,t,a)}var Dn=()=>!!globalThis.SharedArrayBuffer,zn=9007199254740992,
qn=-9007199254740992,w=e=>e<qn||e>zn?NaN:Number(e);function Lt(e,r,t,a){if(e=w(e),r=w(r),t=w(t),a=w(a),!Dn())return 6;var o=[],
s=0;if(h&&(o.length===0||s))return qt(e,r,t,a);var c={startRoutine:t,pthread_ptr:e,arg:a,transferList:o};return h?(c.cmd=
"spawnThread",postMessage(c,o),0):Ut(c)}var Ke=()=>{var e=Number((f(),C)[te.varargs/8]);return te.varargs+=8,e},Wr=()=>{
var e=(f(),I)[+te.varargs/4];return te.varargs+=4,e},re={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,a=e.length-1;a>=0;a--){var o=e[a];o==="."?e.splice(a,1):o===
".."?(e.splice(a,1),t++):t&&(e.splice(a,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=re.isAbs(e),
t=e.slice(-1)==="/";return e=re.normalizeArray(e.split("/").filter(a=>!!a),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),
(r?"/":"")+e},dirname:e=>{var r=re.splitPath(e),t=r[0],a=r[1];return!t&&!a?".":(a&&(a=a.slice(0,-1)),t+a)},basename:e=>e&&
e.match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>re.normalize(e.join("/")),join2:(e,r)=>re.normalize(e+"/"+r)},Ln=()=>e=>e.set(
crypto.getRandomValues(new Uint8Array(e.byteLength))),$r=e=>{($r=Ln())(e)},Xe={resolve:(...e)=>{for(var r="",t=!1,a=e.length-
1;a>=-1&&!t;a--){var o=a>=0?e[a]:i.cwd();if(typeof o!="string")throw new TypeError("Arguments to path.resolve must be st\
rings");if(!o)return"";r=o+"/"+r,t=re.isAbs(o)}return r=re.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"\
/":"")+r||"."},relative:(e,r)=>{e=Xe.resolve(e).slice(1),r=Xe.resolve(r).slice(1);function t(S){for(var E=0;E<S.length&&
S[E]==="";E++);for(var O=S.length-1;O>=0&&S[O]==="";O--);return E>O?[]:S.slice(E,O-E+1)}for(var a=t(e.split("/")),o=t(r.
split("/")),s=Math.min(a.length,o.length),c=s,d=0;d<s;d++)if(a[d]!==o[d]){c=d;break}for(var _=[],d=c;d<a.length;d++)_.push(
"..");return _=_.concat(o.slice(c)),_.join("/")}},Qt=globalThis.TextDecoder&&new TextDecoder,Qn=(e,r,t,a)=>{for(var o=r+
t;e[r]&&!(r>=o);)++r;return r},Ye=(e,r=0,t,a)=>{var o=Qn(e,r,t);if(o-r>16&&e.buffer&&Qt)return Qt.decode(e.buffer instanceof
ArrayBuffer?e.subarray(r,o):e.slice(r,o));for(var s="";r<o;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}
var d=e[r++]&63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|d);continue}var _=e[r++]&63;if((c&240)==224?c=(c&15)<<
12|d<<6|_:c=(c&7)<<18|d<<12|_<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var S=c-65536;s+=String.fromCharCode(55296|
S>>10,56320|S&1023)}}return s},Vr=[],Re=e=>{for(var r=0,t=0;t<e.length;++t){var a=e.charCodeAt(t);a<=127?r++:a<=2047?r+=
2:a>=55296&&a<=57343?(r+=4,++t):r+=3}return r},Wt=(e,r,t,a)=>{if(!(a>0))return 0;for(var o=t,s=t+a-1,c=0;c<e.length;++c){
var d=e.codePointAt(c);if(d<=127){if(t>=s)break;r[t++]=d}else if(d<=2047){if(t+1>=s)break;r[t++]=192|d>>6,r[t++]=128|d&63}else if(d<=
65535){if(t+2>=s)break;r[t++]=224|d>>12,r[t++]=128|d>>6&63,r[t++]=128|d&63}else{if(t+3>=s)break;r[t++]=240|d>>18,r[t++]=
128|d>>12&63,r[t++]=128|d>>6&63,r[t++]=128|d&63,c++}}return r[t]=0,t-o},Pr=(e,r,t)=>{var a=Re(e)+1,o=new Array(a),s=Wt(e,
o,0,o.length);return o.length=s,o},Wn=()=>{var s;if(!Vr.length){var e=null;if(g){var r=256,t=Buffer.alloc(r),a=0,o=process.
stdin.fd;try{a=R.readSync(o,t,0,r)}catch(c){if(c.toString().includes("EOF"))a=0;else throw c}a>0&&(e=t.slice(0,a).toString(
"utf-8"))}else(s=globalThis.window)!=null&&s.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;Vr=Pr(e)}return Vr.shift()},Pe={ttys:[],init(){},shutdown(){},register(e,r){Pe.ttys[e]={input:[],output:[],
ops:r},i.registerDevice(e,Pe.stream_ops)},stream_ops:{open(e){var r=Pe.ttys[e.node.rdev];if(!r)throw new i.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,a,o){if(!e.tty||!e.tty.
ops.get_char)throw new i.ErrnoError(60);for(var s=0,c=0;c<a;c++){var d;try{d=e.tty.ops.get_char(e.tty)}catch{throw new i.
ErrnoError(29)}if(d===void 0&&s===0)throw new i.ErrnoError(6);if(d==null)break;s++,r[t+c]=d}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,a,o){if(!e.tty||!e.tty.ops.put_char)throw new i.ErrnoError(60);try{for(var s=0;s<a;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new i.ErrnoError(29)}return a&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return Wn()},put_char(e,r){r===null||r===10?(se(Ye(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){var r;((r=e.
output)==null?void 0:r.length)>0&&(se(Ye(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,
c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},
ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(V(Ye(e.output)),e.output=[]):r!=0&&
e.output.push(r)},fsync(e){var r;((r=e.output)==null?void 0:r.length)>0&&(V(Ye(e.output)),e.output=[])}}},$n=(e,r)=>(f(),
z).fill(0,e,e+r),$t=(e,r)=>Math.ceil(e/r)*r,Jr=e=>{e=$t(e,65536);var r=Ra(65536,e);return r&&$n(r,e),r},Q={ops_table:null,
mount(e){return Q.createNode(null,"/",16895,0)},createNode(e,r,t,a){if(i.isBlkdev(t)||i.isFIFO(t))throw new i.ErrnoError(
63);Q.ops_table||(Q.ops_table={dir:{node:{getattr:Q.node_ops.getattr,setattr:Q.node_ops.setattr,lookup:Q.node_ops.lookup,
mknod:Q.node_ops.mknod,rename:Q.node_ops.rename,unlink:Q.node_ops.unlink,rmdir:Q.node_ops.rmdir,readdir:Q.node_ops.readdir,
symlink:Q.node_ops.symlink},stream:{llseek:Q.stream_ops.llseek}},file:{node:{getattr:Q.node_ops.getattr,setattr:Q.node_ops.
setattr},stream:{llseek:Q.stream_ops.llseek,read:Q.stream_ops.read,write:Q.stream_ops.write,mmap:Q.stream_ops.mmap,msync:Q.
stream_ops.msync}},link:{node:{getattr:Q.node_ops.getattr,setattr:Q.node_ops.setattr,readlink:Q.node_ops.readlink},stream:{}},
chrdev:{node:{getattr:Q.node_ops.getattr,setattr:Q.node_ops.setattr},stream:i.chrdev_stream_ops}});var o=i.createNode(e,
r,t,a);return i.isDir(o.mode)?(o.node_ops=Q.ops_table.dir.node,o.stream_ops=Q.ops_table.dir.stream,o.contents={}):i.isFile(
o.mode)?(o.node_ops=Q.ops_table.file.node,o.stream_ops=Q.ops_table.file.stream,o.usedBytes=0,o.contents=null):i.isLink(o.
mode)?(o.node_ops=Q.ops_table.link.node,o.stream_ops=Q.ops_table.link.stream):i.isChrdev(o.mode)&&(o.node_ops=Q.ops_table.
chrdev.node,o.stream_ops=Q.ops_table.chrdev.stream),o.atime=o.mtime=o.ctime=Date.now(),e&&(e.contents[r]=o,e.atime=e.mtime=
e.ctime=o.atime),o},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):
new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=r)){var a=1024*
1024;r=Math.max(r,t*(t<a?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var o=e.contents;e.contents=new Uint8Array(r),e.usedBytes>
0&&e.contents.set(o.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=null,e.usedBytes=
0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),e.usedBytes=
r}},node_ops:{getattr(e){var r={};return r.dev=i.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,r.uid=0,r.gid=
0,r.rdev=e.rdev,i.isDir(e.mode)?r.size=4096:i.isFile(e.mode)?r.size=e.usedBytes:i.isLink(e.mode)?r.size=e.link.length:r.
size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=Math.ceil(r.
size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==void 0&&
Q.resizeFileStorage(e,r.size)},lookup(e,r){throw Q.doesNotExistError||(Q.doesNotExistError=new i.ErrnoError(44),Q.doesNotExistError.
stack="<generic error, no stack>"),Q.doesNotExistError},mknod(e,r,t,a){return Q.createNode(e,r,t,a)},rename(e,r,t){var a;
try{a=i.lookupNode(r,t)}catch{}if(a){if(i.isDir(e.mode))for(var o in a.contents)throw new i.ErrnoError(55);i.hashRemoveNode(
a)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,r){
delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=i.lookupNode(e,r);for(var a in t.contents)throw new i.
ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.keys(e.contents)]},
symlink(e,r,t){var a=Q.createNode(e,r,41471,0);return a.link=t,a},readlink(e){if(!i.isLink(e.mode))throw new i.ErrnoError(
28);return e.link}},stream_ops:{read(e,r,t,a,o){var s=e.node.contents;if(o>=e.node.usedBytes)return 0;var c=Math.min(e.node.
usedBytes-o,a);if(c>8&&s.subarray)r.set(s.subarray(o,o+c),t);else for(var d=0;d<c;d++)r[t+d]=s[o+d];return c},write(e,r,t,a,o,s){
if(r.buffer===(f(),A).buffer&&(s=!1),!a)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&(!c.contents||c.
contents.subarray)){if(s)return c.contents=r.subarray(t,t+a),c.usedBytes=a,a;if(c.usedBytes===0&&o===0)return c.contents=
r.slice(t,t+a),c.usedBytes=a,a;if(o+a<=c.usedBytes)return c.contents.set(r.subarray(t,t+a),o),a}if(Q.expandFileStorage(c,
o+a),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+a),o);else for(var d=0;d<a;d++)c.contents[o+d]=r[t+d];
return c.usedBytes=Math.max(c.usedBytes,o+a),a},llseek(e,r,t){var a=r;if(t===1?a+=e.position:t===2&&i.isFile(e.node.mode)&&
(a+=e.node.usedBytes),a<0)throw new i.ErrnoError(28);return a},mmap(e,r,t,a,o){if(!i.isFile(e.node.mode))throw new i.ErrnoError(
43);var s,c,d=e.node.contents;if(!(o&2)&&d&&d.buffer===(f(),A).buffer)c=!1,s=d.byteOffset;else{if(c=!0,s=Jr(r),!s)throw new i.
ErrnoError(48);d&&((t>0||t+r<d.length)&&(d.subarray?d=d.subarray(t,t+r):d=Array.prototype.slice.call(d,t,t+r)),(f(),A).set(
d,s))}return{ptr:s,allocated:c}},msync(e,r,t,a,o){return Q.stream_ops.write(e,r,0,a,t,!1),0}}},Vn=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},Hr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},Pn=async e=>{var r=await B(e);return new Uint8Array(r)},Vt=(...e)=>i.createDataFile(
...e),Pt=[],Jn=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of Pt)if(t.canHandle(r))return t.handle(e,r);return e},
Kr=async(e,r,t,a,o,s,c,d)=>{var _=r?Xe.resolve(re.join2(e,r)):e;kr();try{var S=t;typeof t=="string"&&(S=await Pn(t)),S=await Jn(
S,_),d==null||d(),s||Vt(e,r,S,a,o,c)}finally{Er()}},Hn=(e,r,t,a,o,s,c,d,_,S)=>{Kr(e,r,t,a,o,d,_,S).then(s).catch(c)},i={
root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,
filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{constructor(e){Ae(this,"name","ErrnoError");this.errno=e}},
FSStream:class{constructor(){Ae(this,"shared",{})}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.
flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.
shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=
e}},FSNode:class{constructor(e,r,t,a){Ae(this,"node_ops",{});Ae(this,"stream_ops",{});Ae(this,"readMode",365);Ae(this,"w\
riteMode",146);Ae(this,"mounted",null);e||(e=this),this.parent=e,this.mount=e.mount,this.id=i.nextInode++,this.name=r,this.
mode=t,this.rdev=a,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){
e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){
e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return i.isDir(this.mode)}get isDevice(){return i.
isChrdev(this.mode)}},lookupPath(e,r={}){if(!e)throw new i.ErrnoError(44);r.follow_mount??(r.follow_mount=!0),re.isAbs(e)||
(e=i.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var a=e.split("/").filter(S=>!!S),o=i.root,s="/",c=0;c<a.length;c++){var d=c===
a.length-1;if(d&&r.parent)break;if(a[c]!=="."){if(a[c]===".."){if(s=re.dirname(s),i.isRoot(o)){e=s+"/"+a.slice(c+1).join(
"/"),t--;continue e}else o=o.parent;continue}s=re.join2(s,a[c]);try{o=i.lookupNode(o,a[c])}catch(S){if((S==null?void 0:S.
errno)===44&&d&&r.noent_okay)return{path:s};throw S}if(i.isMountpoint(o)&&(!d||r.follow_mount)&&(o=o.mounted.root),i.isLink(
o.mode)&&(!d||r.follow)){if(!o.node_ops.readlink)throw new i.ErrnoError(52);var _=o.node_ops.readlink(o);re.isAbs(_)||(_=
re.dirname(s)+"/"+_),e=_+"/"+a.slice(c+1).join("/");continue e}}}return{path:s,node:o}}throw new i.ErrnoError(32)},getPath(e){
for(var r;;){if(i.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:
e.name,e=e.parent}},hashName(e,r){for(var t=0,a=0;a<r.length;a++)t=(t<<5)-t+r.charCodeAt(a)|0;return(e+t>>>0)%i.nameTable.
length},hashAddNode(e){var r=i.hashName(e.parent.id,e.name);e.name_next=i.nameTable[r],i.nameTable[r]=e},hashRemoveNode(e){
var r=i.hashName(e.parent.id,e.name);if(i.nameTable[r]===e)i.nameTable[r]=e.name_next;else for(var t=i.nameTable[r];t;){
if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){var t=i.mayLookup(e);if(t)throw new i.
ErrnoError(t);for(var a=i.hashName(e.id,r),o=i.nameTable[a];o;o=o.name_next){var s=o.name;if(o.parent.id===e.id&&s===r)return o}
return i.lookup(e,r)},createNode(e,r,t,a){var o=new i.FSNode(e,r,t,a);return i.hashAddNode(o),o},destroyNode(e){i.hashRemoveNode(
e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&
61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},
isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var r=["r","w","rw"][e&
3];return e&512&&(r+="w"),r},nodePermissions(e,r){return i.ignorePermissions?0:r.includes("r")&&!(e.mode&292)||r.includes(
"w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!i.isDir(e.mode))return 54;var r=i.nodePermissions(
e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!i.isDir(e.mode))return 54;try{var t=i.lookupNode(e,r);return 20}catch{}
return i.nodePermissions(e,"wx")},mayDelete(e,r,t){var a;try{a=i.lookupNode(e,r)}catch(s){return s.errno}var o=i.nodePermissions(
e,"wx");if(o)return o;if(t){if(!i.isDir(a.mode))return 54;if(i.isRoot(a)||i.getPath(a)===i.cwd())return 10}else if(i.isDir(
a.mode))return 31;return 0},mayOpen(e,r){return e?i.isLink(e.mode)?32:i.isDir(e.mode)&&(i.flagsToPermissionString(r)!=="\
r"||r&576)?31:i.nodePermissions(e,i.flagsToPermissionString(r)):44},checkOpExists(e,r){if(!e)throw new i.ErrnoError(r);return e},
MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=i.MAX_OPEN_FDS;e++)if(!i.streams[e])return e;throw new i.ErrnoError(33)},getStreamChecked(e){
var r=i.getStream(e);if(!r)throw new i.ErrnoError(8);return r},getStream:e=>i.streams[e],createStream(e,r=-1){return e=Object.
assign(new i.FSStream,e),r==-1&&(r=i.nextfd()),e.fd=r,i.streams[r]=e,e},closeStream(e){i.streams[e]=null},dupStream(e,r=-1){
var a,o;var t=i.createStream(e,r);return(o=(a=t.stream_ops)==null?void 0:a.dup)==null||o.call(a,t),t},doSetAttr(e,r,t){var a=e==
null?void 0:e.stream_ops.setattr,o=a?e:r;a??(a=r.node_ops.setattr),i.checkOpExists(a,63),a(o,t)},chrdev_stream_ops:{open(e){
var t,a;var r=i.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,(a=(t=e.stream_ops).open)==null||a.call(t,e)},llseek(){
throw new i.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){i.devices[e]={stream_ops:r}},
getDevice:e=>i.devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var a=t.pop();r.push(a),t.push(...a.mounts)}return r},
syncfs(e,r){typeof e=="function"&&(r=e,e=!1),i.syncFSRequests++,i.syncFSRequests>1&&V(`warning: ${i.syncFSRequests} FS.s\
yncfs operations in flight at once, probably just doing extra work`);var t=i.getMounts(i.root.mount),a=0;function o(d){return i.
syncFSRequests--,r(d)}function s(d){if(d)return s.errored?void 0:(s.errored=!0,o(d));++a>=t.length&&o(null)}for(var c of t)
c.type.syncfs?c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var a=t==="/",o=!t,s;if(a&&i.root)throw new i.ErrnoError(10);if(!a&&
!o){var c=i.lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,i.isMountpoint(s))throw new i.ErrnoError(10);if(!i.isDir(
s.mode))throw new i.ErrnoError(54)}var d={type:e,opts:r,mountpoint:t,mounts:[]},_=e.mount(d);return _.mount=d,d.root=_,a?
i.root=_:s&&(s.mounted=d,s.mount&&s.mount.mounts.push(d)),_},unmount(e){var r=i.lookupPath(e,{follow_mount:!1});if(!i.isMountpoint(
r.node))throw new i.ErrnoError(28);var t=r.node,a=t.mounted,o=i.getMounts(a);for(var[s,c]of Object.entries(i.nameTable))
for(;c;){var d=c.name_next;o.includes(c.mount)&&i.destroyNode(c),c=d}t.mounted=null;var _=t.mount.mounts.indexOf(a);t.mount.
mounts.splice(_,1)},lookup(e,r){return e.node_ops.lookup(e,r)},mknod(e,r,t){var a=i.lookupPath(e,{parent:!0}),o=a.node,s=re.
basename(e);if(!s)throw new i.ErrnoError(28);if(s==="."||s==="..")throw new i.ErrnoError(20);var c=i.mayCreate(o,s);if(c)
throw new i.ErrnoError(c);if(!o.node_ops.mknod)throw new i.ErrnoError(63);return o.node_ops.mknod(o,s,r,t)},statfs(e){return i.
statfsNode(i.lookupPath(e,{follow:!0}).node)},statfsStream(e){return i.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,
frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:i.nextInode,ffree:i.nextInode-1,fsid:42,flags:2,namelen:255};return e.
node_ops.statfs&&Object.assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,i.mknod(
e,r,0)},mkdir(e,r=511){return r&=1023,r|=16384,i.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),a="";for(var o of t)if(o){
(a||re.isAbs(e))&&(a+="/"),a+=o;try{i.mkdir(a,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=
r,r=438),r|=8192,i.mknod(e,r,t)},symlink(e,r){if(!Xe.resolve(e))throw new i.ErrnoError(44);var t=i.lookupPath(r,{parent:!0}),
a=t.node;if(!a)throw new i.ErrnoError(44);var o=re.basename(r),s=i.mayCreate(a,o);if(s)throw new i.ErrnoError(s);if(!a.node_ops.
symlink)throw new i.ErrnoError(63);return a.node_ops.symlink(a,o,e)},rename(e,r){var t=re.dirname(e),a=re.dirname(r),o=re.
basename(e),s=re.basename(r),c,d,_;if(c=i.lookupPath(e,{parent:!0}),d=c.node,c=i.lookupPath(r,{parent:!0}),_=c.node,!d||
!_)throw new i.ErrnoError(44);if(d.mount!==_.mount)throw new i.ErrnoError(75);var S=i.lookupNode(d,o),E=Xe.relative(e,a);
if(E.charAt(0)!==".")throw new i.ErrnoError(28);if(E=Xe.relative(r,t),E.charAt(0)!==".")throw new i.ErrnoError(55);var O;
try{O=i.lookupNode(_,s)}catch{}if(S!==O){var M=i.isDir(S.mode),j=i.mayDelete(d,o,M);if(j)throw new i.ErrnoError(j);if(j=
O?i.mayDelete(_,s,M):i.mayCreate(_,s),j)throw new i.ErrnoError(j);if(!d.node_ops.rename)throw new i.ErrnoError(63);if(i.
isMountpoint(S)||O&&i.isMountpoint(O))throw new i.ErrnoError(10);if(_!==d&&(j=i.nodePermissions(d,"w"),j))throw new i.ErrnoError(
j);i.hashRemoveNode(S);try{d.node_ops.rename(S,_,s),S.parent=_}catch($){throw $}finally{i.hashAddNode(S)}}},rmdir(e){var r=i.
lookupPath(e,{parent:!0}),t=r.node,a=re.basename(e),o=i.lookupNode(t,a),s=i.mayDelete(t,a,!0);if(s)throw new i.ErrnoError(
s);if(!t.node_ops.rmdir)throw new i.ErrnoError(63);if(i.isMountpoint(o))throw new i.ErrnoError(10);t.node_ops.rmdir(t,a),
i.destroyNode(o)},readdir(e){var r=i.lookupPath(e,{follow:!0}),t=r.node,a=i.checkOpExists(t.node_ops.readdir,54);return a(
t)},unlink(e){var r=i.lookupPath(e,{parent:!0}),t=r.node;if(!t)throw new i.ErrnoError(44);var a=re.basename(e),o=i.lookupNode(
t,a),s=i.mayDelete(t,a,!1);if(s)throw new i.ErrnoError(s);if(!t.node_ops.unlink)throw new i.ErrnoError(63);if(i.isMountpoint(
o))throw new i.ErrnoError(10);t.node_ops.unlink(t,a),i.destroyNode(o)},readlink(e){var r=i.lookupPath(e),t=r.node;if(!t)
throw new i.ErrnoError(44);if(!t.node_ops.readlink)throw new i.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=i.
lookupPath(e,{follow:!r}),a=t.node,o=i.checkOpExists(a.node_ops.getattr,63);return o(a)},fstat(e){var r=i.getStreamChecked(
e),t=r.node,a=r.stream_ops.getattr,o=a?r:t;return a??(a=t.node_ops.getattr),i.checkOpExists(a,63),a(o)},lstat(e){return i.
stat(e,!0)},doChmod(e,r,t,a){i.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:a})},chmod(e,r,t){var a;
if(typeof e=="string"){var o=i.lookupPath(e,{follow:!t});a=o.node}else a=e;i.doChmod(null,a,r,t)},lchmod(e,r){i.chmod(e,
r,!0)},fchmod(e,r){var t=i.getStreamChecked(e);i.doChmod(t,t.node,r,!1)},doChown(e,r,t){i.doSetAttr(e,r,{timestamp:Date.
now(),dontFollow:t})},chown(e,r,t,a){var o;if(typeof e=="string"){var s=i.lookupPath(e,{follow:!a});o=s.node}else o=e;i.
doChown(null,o,a)},lchown(e,r,t){i.chown(e,r,t,!0)},fchown(e,r,t){var a=i.getStreamChecked(e);i.doChown(a,a.node,!1)},doTruncate(e,r,t){
if(i.isDir(r.mode))throw new i.ErrnoError(31);if(!i.isFile(r.mode))throw new i.ErrnoError(28);var a=i.nodePermissions(r,
"w");if(a)throw new i.ErrnoError(a);i.doSetAttr(e,r,{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new i.ErrnoError(
28);var t;if(typeof e=="string"){var a=i.lookupPath(e,{follow:!0});t=a.node}else t=e;i.doTruncate(null,t,r)},ftruncate(e,r){
var t=i.getStreamChecked(e);if(r<0||(t.flags&2097155)===0)throw new i.ErrnoError(28);i.doTruncate(t,t.node,r)},utime(e,r,t){
var a=i.lookupPath(e,{follow:!0}),o=a.node,s=i.checkOpExists(o.node_ops.setattr,63);s(o,{atime:r,mtime:t})},open(e,r,t=438){
if(e==="")throw new i.ErrnoError(44);r=typeof r=="string"?Vn(r):r,r&64?t=t&4095|32768:t=0;var a,o;if(typeof e=="object")
a=e;else{o=e.endsWith("/");var s=i.lookupPath(e,{follow:!(r&131072),noent_okay:!0});a=s.node,e=s.path}var c=!1;if(r&64)if(a){
if(r&128)throw new i.ErrnoError(20)}else{if(o)throw new i.ErrnoError(31);a=i.mknod(e,t|511,0),c=!0}if(!a)throw new i.ErrnoError(
44);if(i.isChrdev(a.mode)&&(r&=-513),r&65536&&!i.isDir(a.mode))throw new i.ErrnoError(54);if(!c){var d=i.mayOpen(a,r);if(d)
throw new i.ErrnoError(d)}r&512&&!c&&i.truncate(a,0),r&=-131713;var _=i.createStream({node:a,path:i.getPath(a),flags:r,seekable:!0,
position:0,stream_ops:a.stream_ops,ungotten:[],error:!1});return _.stream_ops.open&&_.stream_ops.open(_),c&&i.chmod(a,t&
511),n.logReadFiles&&!(r&1)&&(e in i.readFiles||(i.readFiles[e]=1)),_},close(e){if(i.isClosed(e))throw new i.ErrnoError(
8);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(r){throw r}finally{i.closeStream(e.
fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){if(i.isClosed(e))throw new i.ErrnoError(8);if(!e.seekable||
!e.stream_ops.llseek)throw new i.ErrnoError(70);if(t!=0&&t!=1&&t!=2)throw new i.ErrnoError(28);return e.position=e.stream_ops.
llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,a,o){if(a<0||o<0)throw new i.ErrnoError(28);if(i.isClosed(e))throw new i.
ErrnoError(8);if((e.flags&2097155)===1)throw new i.ErrnoError(8);if(i.isDir(e.node.mode))throw new i.ErrnoError(31);if(!e.
stream_ops.read)throw new i.ErrnoError(28);var s=typeof o<"u";if(!s)o=e.position;else if(!e.seekable)throw new i.ErrnoError(
70);var c=e.stream_ops.read(e,r,t,a,o);return s||(e.position+=c),c},write(e,r,t,a,o,s){if(a<0||o<0)throw new i.ErrnoError(
28);if(i.isClosed(e))throw new i.ErrnoError(8);if((e.flags&2097155)===0)throw new i.ErrnoError(8);if(i.isDir(e.node.mode))
throw new i.ErrnoError(31);if(!e.stream_ops.write)throw new i.ErrnoError(28);e.seekable&&e.flags&1024&&i.llseek(e,0,2);var c=typeof o<
"u";if(!c)o=e.position;else if(!e.seekable)throw new i.ErrnoError(70);var d=e.stream_ops.write(e,r,t,a,o,s);return c||(e.
position+=d),d},mmap(e,r,t,a,o){if((a&2)!==0&&(o&2)===0&&(e.flags&2097155)!==2)throw new i.ErrnoError(2);if((e.flags&2097155)===
1)throw new i.ErrnoError(2);if(!e.stream_ops.mmap)throw new i.ErrnoError(43);if(!r)throw new i.ErrnoError(28);return e.stream_ops.
mmap(e,r,t,a,o)},msync(e,r,t,a,o){return e.stream_ops.msync?e.stream_ops.msync(e,r,t,a,o):0},ioctl(e,r,t){if(!e.stream_ops.
ioctl)throw new i.ErrnoError(59);return e.stream_ops.ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||
"binary",r.encoding!=="utf8"&&r.encoding!=="binary"&&ue(`Invalid encoding type "${r.encoding}"`);var t=i.open(e,r.flags),
a=i.stat(e),o=a.size,s=new Uint8Array(o);return i.read(t,s,0,o,0),r.encoding==="utf8"&&(s=Ye(s)),i.close(t),s},writeFile(e,r,t={}){
t.flags=t.flags||577;var a=i.open(e,t.flags,t.mode);typeof r=="string"&&(r=new Uint8Array(Pr(r))),ArrayBuffer.isView(r)?
i.write(a,r,0,r.byteLength,void 0,t.canOwn):ue("Unsupported data type"),i.close(a)},cwd:()=>i.currentPath,chdir(e){var r=i.
lookupPath(e,{follow:!0});if(r.node===null)throw new i.ErrnoError(44);if(!i.isDir(r.node.mode))throw new i.ErrnoError(54);
var t=i.nodePermissions(r.node,"x");if(t)throw new i.ErrnoError(t);i.currentPath=r.path},createDefaultDirectories(){i.mkdir(
"/tmp"),i.mkdir("/home"),i.mkdir("/home/web_user")},createDefaultDevices(){i.mkdir("/dev"),i.registerDevice(i.makedev(1,
3),{read:()=>0,write:(a,o,s,c,d)=>c,llseek:()=>0}),i.mkdev("/dev/null",i.makedev(1,3)),Pe.register(i.makedev(5,0),Pe.default_tty_ops),
Pe.register(i.makedev(6,0),Pe.default_tty1_ops),i.mkdev("/dev/tty",i.makedev(5,0)),i.mkdev("/dev/tty1",i.makedev(6,0));var e=new Uint8Array(
1024),r=0,t=()=>(r===0&&($r(e),r=e.byteLength),e[--r]);i.createDevice("/dev","random",t),i.createDevice("/dev","urandom",
t),i.mkdir("/dev/shm"),i.mkdir("/dev/shm/tmp")},createSpecialDirectories(){i.mkdir("/proc");var e=i.mkdir("/proc/self");
i.mkdir("/proc/self/fd"),i.mount({mount(){var r=i.createNode(e,"fd",16895,73);return r.stream_ops={llseek:Q.stream_ops.llseek},
r.node_ops={lookup(t,a){var o=+a,s=i.getStreamChecked(o),c={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.
path},id:o+1};return c.parent=c,c},readdir(){return Array.from(i.streams.entries()).filter(([t,a])=>a).map(([t,a])=>t.toString())}},
r}},{},"/proc/self/fd")},createStandardStreams(e,r,t){e?i.createDevice("/dev","stdin",e):i.symlink("/dev/tty","/dev/stdi\
n"),r?i.createDevice("/dev","stdout",null,r):i.symlink("/dev/tty","/dev/stdout"),t?i.createDevice("/dev","stderr",null,t):
i.symlink("/dev/tty1","/dev/stderr"),i.open("/dev/stdin",0),i.open("/dev/stdout",1),i.open("/dev/stderr",1)},staticInit(){
i.nameTable=new Array(4096),i.mount(Q,{},"/"),i.createDefaultDirectories(),i.createDefaultDevices(),i.createSpecialDirectories(),
i.filesystems={MEMFS:Q}},init(e,r,t){i.initialized=!0,e??(e=n.stdin),r??(r=n.stdout),t??(t=n.stderr),i.createStandardStreams(
e,r,t)},quit(){i.initialized=!1;for(var e of i.streams)e&&i.close(e)},findObject(e,r){var t=i.analyzePath(e,r);return t.
exists?t.object:null},analyzePath(e,r){try{var t=i.lookupPath(e,{follow:!r});e=t.path}catch{}var a={isRoot:!1,exists:!1,
error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var t=i.lookupPath(e,{parent:!0});
a.parentExists=!0,a.parentPath=t.path,a.parentObject=t.node,a.name=re.basename(e),t=i.lookupPath(e,{follow:!r}),a.exists=
!0,a.path=t.path,a.object=t.node,a.name=t.node.name,a.isRoot=t.path==="/"}catch(o){a.error=o.errno}return a},createPath(e,r,t,a){
e=typeof e=="string"?e:i.getPath(e);for(var o=r.split("/").reverse();o.length;){var s=o.pop();if(s){var c=re.join2(e,s);
try{i.mkdir(c)}catch(d){if(d.errno!=20)throw d}e=c}}return c},createFile(e,r,t,a,o){var s=re.join2(typeof e=="string"?e:
i.getPath(e),r),c=Hr(a,o);return i.create(s,c)},createDataFile(e,r,t,a,o,s){var c=r;e&&(e=typeof e=="string"?e:i.getPath(
e),c=r?re.join2(e,r):e);var d=Hr(a,o),_=i.create(c,d);if(t){if(typeof t=="string"){for(var S=new Array(t.length),E=0,O=t.
length;E<O;++E)S[E]=t.charCodeAt(E);t=S}i.chmod(_,d|146);var M=i.open(_,577);i.write(M,t,0,t.length,0,s),i.close(M),i.chmod(
_,d)}},createDevice(e,r,t,a){var d;var o=re.join2(typeof e=="string"?e:i.getPath(e),r),s=Hr(!!t,!!a);(d=i.createDevice).
major??(d.major=64);var c=i.makedev(i.createDevice.major++,0);return i.registerDevice(c,{open(_){_.seekable=!1},close(_){
var S;(S=a==null?void 0:a.buffer)!=null&&S.length&&a(10)},read(_,S,E,O,M){for(var j=0,$=0;$<O;$++){var q;try{q=t()}catch{
throw new i.ErrnoError(29)}if(q===void 0&&j===0)throw new i.ErrnoError(6);if(q==null)break;j++,S[E+$]=q}return j&&(_.node.
atime=Date.now()),j},write(_,S,E,O,M){for(var j=0;j<O;j++)try{a(S[E+j])}catch{throw new i.ErrnoError(29)}return O&&(_.node.
mtime=_.node.ctime=Date.now()),j}}),i.mkdev(o,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;
if(globalThis.XMLHttpRequest)ue("Lazy loading should have been performed (contents set) in createLazyFile, but it was no\
t. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");else try{e.contents=
k(e.url)}catch{throw new i.ErrnoError(29)}},createLazyFile(e,r,t,a,o){class s{constructor(){Ae(this,"lengthKnown",!1);Ae(
this,"chunks",[])}get(M){if(!(M>this.length-1||M<0)){var j=M%this.chunkSize,$=M/this.chunkSize|0;return this.getter($)[j]}}setDataGetter(M){
this.getter=M}cacheLength(){var M=new XMLHttpRequest;M.open("HEAD",t,!1),M.send(null),M.status>=200&&M.status<300||M.status===
304||ue("Couldn't load "+t+". Status: "+M.status);var j=Number(M.getResponseHeader("Content-length")),$,q=($=M.getResponseHeader(
"Accept-Ranges"))&&$==="bytes",y=($=M.getResponseHeader("Content-Encoding"))&&$==="gzip",K=1024*1024;q||(K=j);var X=(ge,ke)=>{
ge>ke&&ue("invalid range ("+ge+", "+ke+") or no bytes requested!"),ke>j-1&&ue("only "+j+" bytes available! programmer er\
ror!");var fe=new XMLHttpRequest;return fe.open("GET",t,!1),j!==K&&fe.setRequestHeader("Range","bytes="+ge+"-"+ke),fe.responseType=
"arraybuffer",fe.overrideMimeType&&fe.overrideMimeType("text/plain; charset=x-user-defined"),fe.send(null),fe.status>=200&&
fe.status<300||fe.status===304||ue("Couldn't load "+t+". Status: "+fe.status),fe.response!==void 0?new Uint8Array(fe.response||
[]):Pr(fe.responseText||"")},ae=this;ae.setDataGetter(ge=>{var ke=ge*K,fe=(ge+1)*K-1;return fe=Math.min(fe,j-1),typeof ae.
chunks[ge]>"u"&&(ae.chunks[ge]=X(ke,fe)),typeof ae.chunks[ge]>"u"&&ue("doXHR failed!"),ae.chunks[ge]}),(y||!j)&&(K=j=1,j=
this.getter(0).length,K=j,se("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
j,this._chunkSize=K,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){p||ue("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,d={isDevice:!1,
contents:c}}else var d={isDevice:!1,url:t};var _=i.createFile(e,r,d,a,o);d.contents?_.contents=d.contents:d.url&&(_.contents=
null,_.url=d.url),Object.defineProperties(_,{usedBytes:{get:function(){return this.contents.length}}});var S={};for(const[
O,M]of Object.entries(_.stream_ops))S[O]=(...j)=>(i.forceLoadFile(_),M(...j));function E(O,M,j,$,q){var y=O.node.contents;
if(q>=y.length)return 0;var K=Math.min(y.length-q,$);if(y.slice)for(var X=0;X<K;X++)M[j+X]=y[q+X];else for(var X=0;X<K;X++)
M[j+X]=y.get(q+X);return K}return S.read=(O,M,j,$,q)=>(i.forceLoadFile(_),E(O,M,j,$,q)),S.mmap=(O,M,j,$,q)=>{i.forceLoadFile(
_);var y=Jr(M);if(!y)throw new i.ErrnoError(48);return E(O,(f(),A),y,M,j),{ptr:y,allocated:!0}},_.stream_ops=S,_}},or=(e,r,t)=>e?
Ye((f(),z),e,r):"",te={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(re.isAbs(r))return r;var a;if(e===-100)a=i.cwd();else{var o=te.
getStreamFromFD(e);a=o.path}if(r.length==0){if(!t)throw new i.ErrnoError(44);return a}return a+"/"+r},writeStat(e,r){(f(),
U)[e/4]=r.dev,(f(),U)[(e+4)/4]=r.mode,(f(),C)[(e+8)/8]=BigInt(r.nlink),(f(),U)[(e+16)/4]=r.uid,(f(),U)[(e+20)/4]=r.gid,(f(),
U)[(e+24)/4]=r.rdev,(f(),H)[(e+32)/8]=BigInt(r.size),(f(),I)[(e+40)/4]=4096,(f(),I)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
a=r.mtime.getTime(),o=r.ctime.getTime();return(f(),H)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(f(),C)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(f(),H)[(e+64)/8]=BigInt(Math.floor(a/1e3)),(f(),C)[(e+72)/8]=BigInt(a%1e3*1e3*1e3),(f(),H)[(e+80)/8]=BigInt(Math.
floor(o/1e3)),(f(),C)[(e+88)/8]=BigInt(o%1e3*1e3*1e3),(f(),H)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(f(),U)[(e+8)/
4]=r.bsize,(f(),U)[(e+72)/4]=r.bsize,(f(),H)[(e+16)/8]=BigInt(r.blocks),(f(),H)[(e+24)/8]=BigInt(r.bfree),(f(),H)[(e+32)/
8]=BigInt(r.bavail),(f(),H)[(e+40)/8]=BigInt(r.files),(f(),H)[(e+48)/8]=BigInt(r.ffree),(f(),U)[(e+56)/4]=r.fsid,(f(),U)[(e+
80)/4]=r.flags,(f(),U)[(e+64)/4]=r.namelen},doMsync(e,r,t,a,o){if(!i.isFile(r.node.mode))throw new i.ErrnoError(43);if(a&
2)return 0;var s=(f(),z).slice(e,e+t);i.msync(r,s,o,t,a)},getStreamFromFD(e){var r=i.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=or(e);return r}};function Jt(e,r,t){if(h)return de(3,0,1,e,r,t);t=w(t),te.varargs=t;try{var a=te.getStreamFromFD(
e);switch(r){case 0:{var o=Wr();if(o<0)return-28;for(;i.streams[o];)o++;var s;return s=i.dupStream(a,o),s.fd}case 1:case 2:
return 0;case 3:return a.flags;case 4:{var o=Wr();return a.flags|=o,0}case 5:{var o=Ke(),c=0;return(f(),ie)[(o+c)/2]=2,0}case 6:case 7:
return 0}return-28}catch(d){if(typeof i>"u"||d.name!=="ErrnoError")throw d;return-d.errno}}function Kn(e,r){if(h)return de(
4,0,1,e,r);r=w(r);try{return te.writeStat(r,i.fstat(e))}catch(t){if(typeof i>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var Oe=(e,r,t)=>Wt(e,(f(),z),r,t);function Ht(e,r){if(h)return de(5,0,1,e,r);e=w(e),r=w(r);try{if(r===0)return-28;
var t=i.cwd(),a=Re(t)+1;return r<a?-68:(Oe(t,e,r),a)}catch(o){if(typeof i>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}
function Kt(e,r,t){if(h)return de(6,0,1,e,r,t);r=w(r),t=w(t);try{var a=te.getStreamFromFD(e);a.getdents||(a.getdents=i.readdir(
a.path));for(var o=280,s=0,c=i.llseek(a,0,1),d=Math.floor(c/o),_=Math.min(a.getdents.length,d+Math.floor(t/o)),S=d;S<_;S++){
var E,O,M=a.getdents[S];if(M===".")E=a.node.id,O=4;else if(M===".."){var j=i.lookupPath(a.path,{parent:!0});E=j.node.id,
O=4}else{var $;try{$=i.lookupNode(a.node,M)}catch(q){if((q==null?void 0:q.errno)===28)continue;throw q}E=$.id,O=i.isChrdev(
$.mode)?2:i.isDir($.mode)?4:i.isLink($.mode)?10:8}(f(),H)[(r+s)/8]=BigInt(E),(f(),H)[(r+s+8)/8]=BigInt((S+1)*o),(f(),ie)[(r+
s+16)/2]=280,(f(),A)[r+s+18]=O,Oe(M,r+s+19,256),s+=o}return i.llseek(a,S*o,0),s}catch(q){if(typeof i>"u"||q.name!=="Errn\
oError")throw q;return-q.errno}}function Xt(e,r,t){if(h)return de(7,0,1,e,r,t);t=w(t),te.varargs=t;try{var a=te.getStreamFromFD(
e);switch(r){case 21509:return a.tty?0:-59;case 21505:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tcgets){var o=a.tty.ops.ioctl_tcgets(
a),s=Ke();(f(),I)[s/4]=o.c_iflag||0,(f(),I)[(s+4)/4]=o.c_oflag||0,(f(),I)[(s+8)/4]=o.c_cflag||0,(f(),I)[(s+12)/4]=o.c_lflag||
0;for(var c=0;c<32;c++)(f(),A)[s+c+17]=o.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:return a.tty?0:-59;case 21506:case 21507:case 21508:{
if(!a.tty)return-59;if(a.tty.ops.ioctl_tcsets){for(var s=Ke(),d=(f(),I)[s/4],_=(f(),I)[(s+4)/4],S=(f(),I)[(s+8)/4],E=(f(),
I)[(s+12)/4],O=[],c=0;c<32;c++)O.push((f(),A)[s+c+17]);return a.tty.ops.ioctl_tcsets(a.tty,r,{c_iflag:d,c_oflag:_,c_cflag:S,
c_lflag:E,c_cc:O})}return 0}case 21519:{if(!a.tty)return-59;var s=Ke();return(f(),I)[s/4]=0,0}case 21520:return a.tty?-28:
-59;case 21537:case 21531:{var s=Ke();return i.ioctl(a,r,s)}case 21523:{if(!a.tty)return-59;if(a.tty.ops.ioctl_tiocgwinsz){
var M=a.tty.ops.ioctl_tiocgwinsz(a.tty),s=Ke();(f(),ie)[s/2]=M[0],(f(),ie)[(s+2)/2]=M[1]}return 0}case 21524:return a.tty?
0:-59;case 21515:return a.tty?0:-59;default:return-28}}catch(j){if(typeof i>"u"||j.name!=="ErrnoError")throw j;return-j.
errno}}function Xn(e,r){if(h)return de(8,0,1,e,r);e=w(e),r=w(r);try{return e=te.getStr(e),te.writeStat(r,i.lstat(e))}catch(t){
if(typeof i>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function Yn(e,r,t,a){if(h)return de(9,0,1,e,r,t,a);r=w(r),
t=w(t);try{r=te.getStr(r);var o=a&256,s=a&4096;return a=a&-6401,r=te.calculateAt(e,r,s),te.writeStat(t,o?i.lstat(r):i.stat(
r))}catch(c){if(typeof i>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Yt(e,r,t,a){if(h)return de(10,0,1,e,
r,t,a);r=w(r),a=w(a),te.varargs=a;try{r=te.getStr(r),r=te.calculateAt(e,r);var o=a?Wr():0;return i.open(r,t,o).fd}catch(s){
if(typeof i>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function Zt(e,r){if(h)return de(11,0,1,e,r);e=w(e),r=w(r);
try{return e=te.getStr(e),te.writeStat(r,i.stat(e))}catch(t){if(typeof i>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var Zn=()=>ue("");function ei(e){e=w(e),ut(e,!p,1,!m,5242880,!1),Y.threadInitTLS()}var Xr=e=>{if(e instanceof nr||e=="un\
wind")return ye;x(1,e)},ri=()=>{if(!Dr())try{if(h){Nr()&&lt(ye);return}qr(ye)}catch(e){Xr(e)}},je=e=>{if(!we)try{e(),ri()}catch(r){
Xr(r)}};function Yr(e){if(e=w(e),Atomics.waitAsync){var r=Atomics.waitAsync((f(),I),e/4,e);r.value.then(Br);var t=e+228;
Atomics.store((f(),I),t/4,1)}}var Br=()=>je(()=>{var e=Nr();e&&(Yr(e),Da())});function ti(e,r){if(e=w(e),r=w(r),e==r)setTimeout(
Br);else if(h)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=Y.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var Gr=[];function ai(e,r,t,a,o){t=w(t),o=w(o),a/=2,Gr.length=a;for(var s=o/8,c=0;c<a;c++)(f(),H)[s+2*c]?
Gr[c]=(f(),H)[s+2*c+1]:Gr[c]=(f(),ee)[s+2*c+1];var d=mo[e];Y.currentProxiedOperationCallerThread=t;var _=d(...Gr);return Y.
currentProxiedOperationCallerThread=0,typeof _=="bigint"&&(_=w(_)),_}function ni(e){e=w(e),h?postMessage({cmd:"cleanupTh\
read",thread:e}):At(e)}function ii(e){e=w(e),g&&Y.pthreads[e].ref()}var oi=e=>e%4===0&&(e%100!==0||e%400===0),si=[0,31,60,
91,121,152,182,213,244,274,305,335],ci=[0,31,59,90,120,151,181,212,243,273,304,334],ui=e=>{var r=oi(e.getFullYear()),t=r?
si:ci,a=t[e.getMonth()]+e.getDate()-1;return a};function li(e,r){e=w(e),r=w(r);var t=new Date(e*1e3);(f(),I)[r/4]=t.getSeconds(),
(f(),I)[(r+4)/4]=t.getMinutes(),(f(),I)[(r+8)/4]=t.getHours(),(f(),I)[(r+12)/4]=t.getDate(),(f(),I)[(r+16)/4]=t.getMonth(),
(f(),I)[(r+20)/4]=t.getFullYear()-1900,(f(),I)[(r+24)/4]=t.getDay();var a=ui(t)|0;(f(),I)[(r+28)/4]=a,(f(),H)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var o=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=o.getTimezoneOffset(),d=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(f(),I)[(r+32)/4]=d}function ea(e,r,t,a,o,s,c){
if(h)return de(12,0,1,e,r,t,a,o,s,c);e=w(e),o=w(o),s=w(s),c=w(c);try{var d=te.getStreamFromFD(a),_=i.mmap(d,e,o,r,t),S=_.
ptr;return(f(),I)[s/4]=_.allocated,(f(),C)[c/8]=BigInt(S),0}catch(E){if(typeof i>"u"||E.name!=="ErrnoError")throw E;return-E.
errno}}function ra(e,r,t,a,o,s){if(h)return de(13,0,1,e,r,t,a,o,s);e=w(e),r=w(r),s=w(s);try{var c=te.getStreamFromFD(o);
t&2&&te.doMsync(e,c,r,a,s)}catch(d){if(typeof i>"u"||d.name!=="ErrnoError")throw d;return-d.errno}}var fi=function(e,r,t,a){
e=w(e),r=w(r),t=w(t),a=w(a);var o=new Date().getFullYear(),s=new Date(o,0,1),c=new Date(o,6,1),d=s.getTimezoneOffset(),_=c.
getTimezoneOffset(),S=Math.max(d,_);(f(),C)[e/8]=BigInt(S*60),(f(),I)[r/4]=+(d!=_);var E=j=>{var $=j>=0?"-":"+",q=Math.abs(
j),y=String(Math.floor(q/60)).padStart(2,"0"),K=String(q%60).padStart(2,"0");return`UTC${$}${y}${K}`},O=E(d),M=E(_);_<d?
(Oe(O,t,17),Oe(M,a,17)):(Oe(O,a,17),Oe(M,t,17))},ta=()=>performance.timeOrigin+performance.now(),aa=()=>Date.now(),di=e=>e>=
0&&e<=3;function mi(e,r,t){if(t=w(t),!di(e))return 28;var a;e===0?a=aa():a=ta();var o=Math.round(a*1e3*1e3);return(f(),H)[t/
8]=BigInt(o),0}var pi=()=>{},Ze=()=>{Sr+=1},gi=()=>{throw Ze(),"unwind"},hi=()=>new Error().stack.toString(),bi=e=>{var r=hi(),
t=r.split(`
`);r="";var a=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),o=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",d="",_=0,S=0,E=o.exec(s);if((E==null?void 0:E.length)==5)c=E[1],d=E[2],_=E[3],S=E[4];else if(E=a.exec(s),(E==null?
void 0:E.length)>=4)c=E[1],d=E[2],_=E[3],S=E[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(d=d.substring(d.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${d}:${_}:${S})
`)}return r=r.replace(/\s+$/,""),r};function _i(e,r,t){r=w(r);var a=bi(e);if(!r||t<=0)return Re(a)+1;var o=Oe(a,r,t);return o+
1}var na=()=>4294967296,vi=()=>BigInt(na()),yi=()=>2,wi=()=>g?require("os").cpus().length:navigator.hardwareConcurrency,
Ei=e=>{var r=Ue.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Ue.grow(BigInt(t)),ve(),1}catch{}};function ki(e){e=w(
e);var r=(f(),z).length;if(e<=r)return!1;var t=na();if(e>t)return!1;for(var a=1;a<=4;a*=2){var o=r*(1+.2/a);o=Math.min(o,
e+100663296);var s=Math.min(t,$t(Math.max(e,o),65536)),c=Ei(s);if(c)return!0}return!1}var De=e=>{var r=Re(e)+1,t=zr(r);return Oe(
e,t,r),t},Si=(e,r)=>{(f(),U)[e/4]=r;var t=(f(),U)[e/4];(f(),U)[(e+4)/4]=(r-t)/4294967296},Bi=e=>{var r=Re(e)+1,t=ha(r);return t&&
Oe(e,t,r),t},We=e=>(f(),U)[e/4]+(f(),I)[(e+4)/4]*4294967296,b={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{b.Internals.
jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{b.Internals.futures[e]=new Promise(t=>r.finally(()=>t(
e)))}},getJsObject:e=>{if(e)return b.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Ia(r);return b.Internals.jsObjects[t]=
e,t},importJsBindGroup:(e,r=0)=>{var t=Zr(r);return b.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{var t=et(
r);return b.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{ce(e.mapState==="unmapped");var t=Aa(r);return b.Internals.
jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=rt(r);return b.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=tt(r);return b.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=at(r);return b.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=nt(r);return b.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var o;var t=it(
r),a=Ta(r,t);return b.Internals.jsObjectInsert(t,e.queue),b.Internals.jsObjectInsert(a,e),(o=n.peercomputeOnDevice)==null||
o.call(n,e),a},importJsExternalTexture:(e,r=0)=>{var t=_a(r);return b.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{
var t=va(r);return b.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=ya(r);return b.Internals.jsObjects[t]=
e,t},importJsQueue:(e,r=0)=>{var t=it(r);return b.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=wa(r);
return b.Internals.jsObjects[t]=e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=Ea(r);return b.Internals.jsObjects[t]=e,
t},importJsRenderPassEncoder:(e,r=0)=>{var t=ka(r);return b.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{
var t=Sa(r);return b.Internals.jsObjects[t]=e,t},importJsSampler:(e,r=0)=>{var t=Ba(r);return b.Internals.jsObjects[t]=e,
t},importJsShaderModule:(e,r=0)=>{var t=Fa(r);return b.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Ga(r);
return b.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{var t=xa(r);return b.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{
var t=Na(r);return b.Internals.jsObjects[t]=e,t},errorCallback:(e,r,t,a)=>{var o=Fe(),s=De(t);((c,d,_)=>Dt(e).call(null,
c,BigInt(d),BigInt(_)))(r,BigInt(s),a),Ce(o)},iterateExtensions:(e,r)=>{for(var t=Number((f(),C)[e/8]);t;t=Number((f(),C)[t/
8])){var a=(f(),I)[(t+8)/4];r[a](t)}},setStringView:(e,r,t)=>{(f(),C)[e/8]=BigInt(r),(f(),C)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{
var r=Number((f(),C)[e/8]),t=Number((f(),C)[(e+8)/8]);return or(r,t)},makeStringFromOptionalStringView:e=>{var r=Number(
(f(),C)[e/8]),t=Number((f(),C)[(e+8)/8]);return r?or(r,t):t===0?"":void 0},makeColor:e=>({r:(f(),ee)[e/8],g:(f(),ee)[(e+
8)/8],b:(f(),ee)[(e+16)/8],a:(f(),ee)[(e+24)/8]}),makeExtent3D:e=>({width:(f(),U)[e/4],height:(f(),U)[(e+4)/4],depthOrArrayLayers:(f(),
U)[(e+8)/4]}),makeOrigin3D:e=>({x:(f(),U)[e/4],y:(f(),U)[(e+4)/4],z:(f(),U)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:b.
getJsObject(Number((f(),C)[e/8])),mipLevel:(f(),U)[(e+8)/4],origin:b.makeOrigin3D(e+12),aspect:b.TextureAspect[(f(),I)[(e+
24)/4]]}),makeTexelCopyBufferLayout:e=>{var r=(f(),U)[(e+8)/4],t=(f(),U)[(e+12)/4];return{offset:We(e),bytesPerRow:r===4294967295?
void 0:r,rowsPerImage:t===4294967295?void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=b.makeTexelCopyBufferLayout(r);return t.
buffer=b.getJsObject(Number((f(),C)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:b.getJsObject(Number(
(f(),C)[(e+8)/8])),beginningOfPassWriteIndex:(f(),U)[(e+16)/4],endOfPassWriteIndex:(f(),U)[(e+20)/4]}},makePipelineConstants:(e,r)=>{
if(e){for(var t={},a=0;a<e;++a){var o=r+32*a,s=b.makeStringFromStringView(o+8);t[s]=(f(),ee)[(o+24)/8]}return t}},makePipelineLayout:e=>e?
b.getJsObject(e):"auto",makeComputeState:e=>{if(e){var r={module:b.getJsObject(Number((f(),C)[(e+8)/8])),constants:b.makePipelineConstants(
Number((f(),C)[(e+32)/8]),Number((f(),C)[(e+40)/8])),entryPoint:b.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:b.makeStringFromOptionalStringView(e+8),layout:b.makePipelineLayout(Number((f(),C)[(e+24)/8])),compute:b.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(y){if(y)return{topology:b.PrimitiveTopology[(f(),I)[(y+8)/4]],stripIndexFormat:b.
IndexFormat[(f(),I)[(y+12)/4]],frontFace:b.FrontFace[(f(),I)[(y+16)/4]],cullMode:b.CullMode[(f(),I)[(y+20)/4]],unclippedDepth:!!(f(),
U)[(y+24)/4]}}function t(y){if(y)return{operation:b.BlendOperation[(f(),I)[y/4]],srcFactor:b.BlendFactor[(f(),I)[(y+4)/4]],
dstFactor:b.BlendFactor[(f(),I)[(y+8)/4]]}}function a(y){if(y)return{alpha:t(y+12),color:t(y+0)}}function o(y){var K=b.TextureFormat[(f(),
I)[(y+8)/4]];return K?{format:K,blend:a(Number((f(),C)[(y+16)/8])),writeMask:(f(),U)[(y+24)/4]}:void 0}function s(y,K){for(var X=[],
ae=0;ae<y;++ae)X.push(o(K+32*ae));return X}function c(y){return{compare:b.CompareFunction[(f(),I)[y/4]],failOp:b.StencilOperation[(f(),
I)[(y+4)/4]],depthFailOp:b.StencilOperation[(f(),I)[(y+8)/4]],passOp:b.StencilOperation[(f(),I)[(y+12)/4]]}}function d(y){
if(y)return{format:b.TextureFormat[(f(),I)[(y+8)/4]],depthWriteEnabled:!!(f(),U)[(y+12)/4],depthCompare:b.CompareFunction[(f(),
I)[(y+16)/4]],stencilFront:c(y+20),stencilBack:c(y+36),stencilReadMask:(f(),U)[(y+52)/4],stencilWriteMask:(f(),U)[(y+56)/
4],depthBias:(f(),I)[(y+60)/4],depthBiasSlopeScale:(f(),pe)[(y+64)/4],depthBiasClamp:(f(),pe)[(y+68)/4]}}function _(y){return{
format:b.VertexFormat[(f(),I)[(y+8)/4]],offset:We(y+16),shaderLocation:(f(),U)[(y+24)/4]}}function S(y,K){for(var X=[],ae=0;ae<
y;++ae)X.push(_(K+ae*32));return X}function E(y){if(y){var K=b.VertexStepMode[(f(),I)[(y+8)/4]],X=Number((f(),C)[(y+24)/
8]);return!K&&!X?null:{arrayStride:We(y+16),stepMode:K,attributes:S(X,Number((f(),C)[(y+32)/8]))}}}function O(y,K){if(y){
for(var X=[],ae=0;ae<y;++ae)X.push(E(K+ae*40));return X}}function M(y){if(y){var K={module:b.getJsObject(Number((f(),C)[(y+
8)/8])),constants:b.makePipelineConstants(Number((f(),C)[(y+32)/8]),Number((f(),C)[(y+40)/8])),buffers:O(Number((f(),C)[(y+
48)/8]),Number((f(),C)[(y+56)/8])),entryPoint:b.makeStringFromOptionalStringView(y+16)};return K}}function j(y){if(y)return{
count:(f(),U)[(y+8)/4],mask:(f(),U)[(y+12)/4],alphaToCoverageEnabled:!!(f(),U)[(y+16)/4]}}function $(y){if(y){var K={module:b.
getJsObject(Number((f(),C)[(y+8)/8])),constants:b.makePipelineConstants(Number((f(),C)[(y+32)/8]),Number((f(),C)[(y+40)/
8])),targets:s(Number((f(),C)[(y+48)/8]),Number((f(),C)[(y+56)/8])),entryPoint:b.makeStringFromOptionalStringView(y+16)};
return K}}var q={label:b.makeStringFromOptionalStringView(e+8),layout:b.makePipelineLayout(Number((f(),C)[(e+24)/8])),vertex:M(
e+32),primitive:r(e+96),depthStencil:d(Number((f(),C)[(e+128)/8])),multisample:j(e+136),fragment:$(Number((f(),C)[(e+160)/
8]))};return q},fillLimitStruct:(e,r)=>{var t=Number((f(),C)[r/8]);function a(c,d,_,S=0){var E=e[c]??S;(f(),U)[(d+_)/4]=
E}function o(c,d,_,S=0){var E=e[c]??S;Si(d+_,E)}if(a("maxTextureDimension1D",r,8),a("maxTextureDimension2D",r,12),a("max\
TextureDimension3D",r,16),a("maxTextureArrayLayers",r,20),a("maxBindGroups",r,24),a("maxBindGroupsPlusVertexBuffers",r,28),
a("maxBindingsPerBindGroup",r,32),a("maxDynamicUniformBuffersPerPipelineLayout",r,36),a("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),a("maxSampledTexturesPerShaderStage",r,44),a("maxSamplersPerShaderStage",r,48),a("maxStorageBuffersPer\
ShaderStage",r,52),a("maxStorageTexturesPerShaderStage",r,56),a("maxUniformBuffersPerShaderStage",r,60),a("minUniformBuf\
ferOffsetAlignment",r,80),a("minStorageBufferOffsetAlignment",r,84),o("maxUniformBufferBindingSize",r,64),o("maxStorageB\
ufferBindingSize",r,72),a("maxVertexBuffers",r,88),o("maxBufferSize",r,96),a("maxVertexAttributes",r,104),a("maxVertexBu\
fferArrayStride",r,108),a("maxInterStageShaderVariables",r,112),a("maxColorAttachments",r,116),a("maxColorAttachmentByte\
sPerSample",r,120),a("maxComputeWorkgroupStorageSize",r,124),a("maxComputeInvocationsPerWorkgroup",r,128),a("maxComputeW\
orkgroupSizeX",r,132),a("maxComputeWorkgroupSizeY",r,136),a("maxComputeWorkgroupSizeZ",r,140),a("maxComputeWorkgroupsPer\
Dimension",r,144),a("maxImmediateSize",r,148),t!==0){(f(),I)[(t+8)/4];var s=t;a("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),a("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),a("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),a("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(f(),U)[(r+88)/4]=e.subgroupMinSize,(f(),U)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,a=Bi(t),o=Re(e.vendor);b.setStringView(r+8,a,o),a+=o;var s=Re(e.architecture);b.setStringView(r+24,
a,s),a+=s;var c=Re(e.device);b.setStringView(r+40,a,c),a+=c;var d=Re(e.description);b.setStringView(r+56,a,d),a+=d,(f(),
I)[(r+72)/4]=2;var _=e.isFallbackAdapter?3:4;(f(),I)[(r+76)/4]=_,(f(),U)[(r+80)/4]=0,(f(),U)[(r+84)/4]=0},AddressMode:[,
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},Gi={undefined:1,unknown:1,destroyed:2},
$e=()=>{Sr-=1};function xi(e,r,t,a,o,s){e=w(e),r=w(r),t=w(t),a=w(a),o=w(o),s=w(s);var c=b.getJsObject(e),d={};if(s){var _=Number(
(f(),C)[(s+24)/8]);if(_){var S=Number((f(),C)[(s+32)/8]);d.requiredFeatures=Array.from((f(),U).subarray(S/4,(S+_*4)/4),y=>b.
FeatureName[y])}var E=Number((f(),C)[(s+40)/8]);if(E){let y=function(X,ae,ge,ke=!1){var fe=ae+ge,ur=(f(),U)[fe/4];ur!=4294967295&&
(!ke||ur!=0)&&(M[X]=ur)},K=function(X,ae,ge){var ke=ae+ge,fe=(f(),U)[ke/4],ur=(f(),U)[(ke+4)/4];(fe!=4294967295||ur!=4294967295)&&
(M[X]=We(ke))};var O=Number((f(),C)[E/8]),M={};if(y("maxTextureDimension1D",E,8),y("maxTextureDimension2D",E,12),y("maxT\
extureDimension3D",E,16),y("maxTextureArrayLayers",E,20),y("maxBindGroups",E,24),y("maxBindGroupsPlusVertexBuffers",E,28),
y("maxBindingsPerBindGroup",E,32),y("maxDynamicUniformBuffersPerPipelineLayout",E,36),y("maxDynamicStorageBuffersPerPipe\
lineLayout",E,40),y("maxSampledTexturesPerShaderStage",E,44),y("maxSamplersPerShaderStage",E,48),y("maxStorageBuffersPer\
ShaderStage",E,52),y("maxStorageTexturesPerShaderStage",E,56),y("maxUniformBuffersPerShaderStage",E,60),y("minUniformBuf\
ferOffsetAlignment",E,80),y("minStorageBufferOffsetAlignment",E,84),K("maxUniformBufferBindingSize",E,64),K("maxStorageB\
ufferBindingSize",E,72),y("maxVertexBuffers",E,88),K("maxBufferSize",E,96),y("maxVertexAttributes",E,104),y("maxVertexBu\
fferArrayStride",E,108),y("maxInterStageShaderVariables",E,112),y("maxColorAttachments",E,116),y("maxColorAttachmentByte\
sPerSample",E,120),y("maxComputeWorkgroupStorageSize",E,124),y("maxComputeInvocationsPerWorkgroup",E,128),y("maxComputeW\
orkgroupSizeX",E,132),y("maxComputeWorkgroupSizeY",E,136),y("maxComputeWorkgroupSizeZ",E,140),y("maxComputeWorkgroupsPer\
Dimension",E,144),y("maxImmediateSize",E,148,!0),O!==0){(f(),I)[(O+8)/4];var j=O;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(y("maxStorageBuffersInVertexStage",j,16),y("maxStorageTexturesInVertexStage",j,20),y("maxStorageBuffersInFra\
gmentStage",j,24),y("maxStorageTexturesInFragmentStage",j,28))}d.requiredLimits=M}var $=Number((f(),C)[(s+48)/8]);if($){
var q={label:b.makeStringFromOptionalStringView($+8)};d.defaultQueue=q}d.label=b.makeStringFromOptionalStringView(s+8)}Ze(),
b.Internals.futureInsert(r,c.requestDevice(d).then(y=>{$e(),je(()=>{var K;b.Internals.jsObjectInsert(o,y.queue),b.Internals.
jsObjectInsert(a,y),(K=n.peercomputeOnDevice)==null||K.call(n,y),a=BigInt(a),b.Internals.futureInsert(t,y.lost.then(X=>{
je(()=>{y.onuncapturederror=ke=>{};var ae=Fe(),ge=De(X.message);ot(t,Gi[X.reason],BigInt(ge)),Ce(ae)})})),y.onuncapturederror=
X=>{var ae=5;X.error instanceof GPUValidationError?ae=2:X.error instanceof GPUOutOfMemoryError?ae=3:X.error instanceof GPUInternalError&&
(ae=4);var ge=Fe(),ke=De(X.error.message);Ua(BigInt(a),ae,BigInt(ke)),Ce(ge)},ct(r,1,BigInt(a),0n)})},y=>{$e(),je(()=>{var K=Fe(),
X=De(y.message);ct(r,3,BigInt(a),BigInt(X)),t&&ot(t,4,BigInt(X)),Ce(K)})}))}function Ni(e){e=w(e);var r=b.getJsObject(e),
t=b.Internals.bufferOnUnmaps[e];if(t){for(var a=0;a<t.length;++a)t[a]();delete b.Internals.bufferOnUnmaps[e]}r.destroy()}
var Ii=function(e,r,t){e=w(e),r=w(r),t=w(t);var a=(()=>{var o=b.getJsObject(e);t==-1&&(t=void 0);var s;try{s=o.getMappedRange(
r,t)}catch{return 0n}var c=za(16,s.byteLength);return(f(),z).set(new Uint8Array(s),c),b.Internals.bufferOnUnmaps[e].push(
()=>ba(c)),c})();return BigInt(a)},Ai=function(e,r,t,a,o){e=w(e),r=w(r),t=w(t),a=w(a),o=w(o);var s=b.getJsObject(e);b.Internals.
bufferOnUnmaps[e]=[],o==-1&&(o=void 0),Ze(),b.Internals.futureInsert(r,s.mapAsync(t,a,o).then(()=>{$e(),je(()=>{st(r,1,0n)})},
c=>{$e(),je(()=>{var d=Fe(),_=De(c.message),S=c.name==="AbortError"?4:c.name==="OperationError"?3:0;st(r,S,BigInt(_)),delete b.
Internals.bufferOnUnmaps[e]})}))};function Ti(e){e=w(e);var r=b.getJsObject(e),t=b.Internals.bufferOnUnmaps[e];if(t){for(var a=0;a<
t.length;++a)t[a]();delete b.Internals.bufferOnUnmaps[e],r.unmap()}}function Fi(e){e=w(e),delete b.Internals.jsObjects[e]}
function Ci(e,r,t){e=w(e),r=w(r),t=w(t);var a=!!(f(),U)[(r+40)/4],o={label:b.makeStringFromOptionalStringView(r+8),usage:(f(),
U)[(r+24)/4],size:We(r+32),mappedAtCreation:a},s=b.getJsObject(e),c;try{c=s.createBuffer(o)}catch{return!1}return b.Internals.
jsObjectInsert(t,c),a&&(b.Internals.bufferOnUnmaps[t]=[]),!0}function Ui(e,r,t){e=w(e),r=w(r),t=w(t);var a=Number((f(),C)[r/
8]),o=(f(),I)[(a+8)/4],s={label:b.makeStringFromOptionalStringView(r+8),code:""};switch(o){case 2:{s.code=b.makeStringFromStringView(
a+16);break}}var c=b.getJsObject(e);b.Internals.jsObjectInsert(t,c.createShaderModule(s))}var Ri=e=>{const r=b.getJsObject(
e);r.onuncapturederror=null,r.destroy()};function Oi(e,r,t,a){r=w(r),t=w(t),a=w(a);var o;if(t){o={featureLevel:b.FeatureLevel[(f(),
I)[(t+8)/4]],powerPreference:b.PowerPreference[(f(),I)[(t+12)/4]],forceFallbackAdapter:!!(f(),U)[(t+16)/4]};var s=Number(
(f(),C)[t/8]);if(s!==0){(f(),I)[(s+8)/4];var c=s;o.xrCompatible=!!(f(),U)[(c+16)/4]}}if(!("gpu"in navigator)){var d=Fe(),
_=De("WebGPU not available on this browser (navigator.gpu is not available)");cr(r,3,BigInt(a),BigInt(_)),Ce(d);return}Ze(),
b.Internals.futureInsert(r,navigator.gpu.requestAdapter(o).then(S=>{$e(),je(()=>{if(S)b.Internals.jsObjectInsert(a,S),cr(
r,1,BigInt(a),0n);else{var E=Fe(),O=De("WebGPU not available on this browser (requestAdapter returned null)");cr(r,3,BigInt(
a),BigInt(O)),Ce(E)}})},S=>{$e(),je(()=>{var E=Fe(),O=De(S.message);cr(r,4,BigInt(a),BigInt(O)),Ce(E)})}))}var ji=function(e,r){
e=w(e),r=w(r);var t=b.getJsObject(e);Ze(),b.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{$e(),je(()=>{Ca(r,
1)})}))},ia=function(e,r,t){return e=w(e),r=w(r),t=w(t),Ge.handleAsync(async()=>{var a=[];if(t){var o=(f(),I)[t/4];a.length=
r+1,a[r]=new Promise(_=>setTimeout(_,o,0))}else a.length=r;for(var s=0;s<r;++s){var c=We(e+s*8);if(!(c in b.Internals.futures))
return c;a[s]=b.Internals.futures[c]}const d=await Promise.race(a);return delete b.Internals.futures[d],d})};ia.isAsync=
!0;var xr={},Mi=()=>T||"./this.program",sr=()=>{if(!sr.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:Mi()};
for(var t in xr)xr[t]===void 0?delete r[t]:r[t]=xr[t];var a=[];for(var t in r)a.push(`${t}=${r[t]}`);sr.strings=a}return sr.
strings};function oa(e,r){if(h)return de(14,0,1,e,r);e=w(e),r=w(r);var t=0,a=0;for(var o of sr()){var s=r+t;(f(),C)[(e+a)/
8]=BigInt(s),t+=Oe(o,s,1/0)+1,a+=8}return 0}function sa(e,r){if(h)return de(15,0,1,e,r);e=w(e),r=w(r);var t=sr();(f(),C)[e/
8]=BigInt(t.length);var a=0;for(var o of t)a+=Re(o)+1;return(f(),C)[r/8]=BigInt(a),0}function ca(e){if(h)return de(16,0,
1,e);try{var r=te.getStreamFromFD(e);return i.close(r),0}catch(t){if(typeof i>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var Di=(e,r,t,a)=>{for(var o=0,s=0;s<t;s++){var c=Number((f(),C)[r/8]),d=Number((f(),C)[(r+8)/8]);r+=16;var _=i.read(
e,(f(),A),c,d,a);if(_<0)return-1;if(o+=_,_<d)break}return o};function ua(e,r,t,a){if(h)return de(17,0,1,e,r,t,a);r=w(r),
t=w(t),a=w(a);try{var o=te.getStreamFromFD(e),s=Di(o,r,t);return(f(),C)[a/8]=BigInt(s),0}catch(c){if(typeof i>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function la(e,r,t,a){if(h)return de(18,0,1,e,r,t,a);r=w(r),a=w(a);try{if(isNaN(r))return 61;
var o=te.getStreamFromFD(e);return i.llseek(o,r,t),(f(),H)[a/8]=BigInt(o.position),o.getdents&&r===0&&t===0&&(o.getdents=
null),0}catch(s){if(typeof i>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var zi=(e,r,t,a)=>{for(var o=0,s=0;s<t;s++){
var c=Number((f(),C)[r/8]),d=Number((f(),C)[(r+8)/8]);r+=16;var _=i.write(e,(f(),A),c,d,a);if(_<0)return-1;if(o+=_,_<d)break}
return o};function fa(e,r,t,a){if(h)return de(19,0,1,e,r,t,a);r=w(r),t=w(t),a=w(a);try{var o=te.getStreamFromFD(e),s=zi(
o,r,t);return(f(),C)[a/8]=BigInt(s),0}catch(c){if(typeof i>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function qi(e,r){
e=w(e),r=w(r);try{return $r((f(),z).subarray(e,e+r)),0}catch(t){if(typeof i>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function Li(e,r){e=w(e),r=w(r);var t=b.getJsObject(e);return b.fillAdapterInfoStruct(t.info,r),1}function Qi(e,r){
e=w(e),r=w(r);var t=b.getJsObject(e);return b.fillLimitStruct(t.limits,r),1}function Wi(e,r){e=w(e);var t=b.getJsObject(
e);return t.features.has(b.FeatureName[r])}var $i=function(e){e=w(e);var r=(()=>{var t=b.getJsObject(e);return t.size})();
return BigInt(r)},Vi=function(e,r){e=w(e),r=w(r);var t=(()=>{var a;r&&(a={label:b.makeStringFromOptionalStringView(r+8),
timestampWrites:b.makePassTimestampWrites(Number((f(),C)[(r+24)/8]))});var o=b.getJsObject(e),s=at(0n);return b.Internals.
jsObjectInsert(s,o.beginComputePass(a)),s})();return BigInt(t)};function Pi(e,r,t,a,o,s){e=w(e),r=w(r),t=w(t),a=w(a),o=w(
o),s=w(s);var c=b.getJsObject(e),d=b.getJsObject(r),_=b.getJsObject(a);c.copyBufferToBuffer(d,t,_,o,s)}var Ji=function(e,r){
e=w(e);var t=(()=>{var a=b.getJsObject(e),o=rt(0n);return b.Internals.jsObjectInsert(o,a.finish()),o})();return BigInt(t)};
function Hi(e,r,t,a){e=w(e);var o=b.getJsObject(e);o.dispatchWorkgroups(r,t,a)}function Ki(e){e=w(e);var r=b.getJsObject(
e);r.end()}function Xi(e,r,t,a,o){e=w(e),t=w(t),a=w(a),o=w(o);var s=b.getJsObject(e),c=b.getJsObject(t);a==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(f(),U),o/4,a)}function Yi(e,r){e=w(e),r=w(r);var t=b.getJsObject(e),a=b.getJsObject(r);t.setPipeline(
a)}var Zi=function(e,r){e=w(e);var t=(()=>{var a=b.getJsObject(e),o=et(0n);return b.Internals.jsObjectInsert(o,a.getBindGroupLayout(
r)),o})();return BigInt(t)},eo=function(e,r){e=w(e),r=w(r);var t=(()=>{function a(_){var S=Number((f(),C)[(_+16)/8]),E=Number(
(f(),C)[(_+40)/8]),O=Number((f(),C)[(_+48)/8]),M=0;b.iterateExtensions(_,{327681:q=>{M=Number((f(),C)[(q+16)/8])}});var j;
if(S){var $=We(_+32);$==-1&&($=void 0),j={buffer:b.getJsObject(S),offset:We(_+24),size:$}}else j=b.getJsObject(E||O||M);
return{binding:(f(),U)[(_+8)/4],resource:j}}function o(_,S){for(var E=[],O=0;O<_;++O)E.push(a(S+56*O));return E}var s={label:b.
makeStringFromOptionalStringView(r+8),layout:b.getJsObject(Number((f(),C)[(r+24)/8])),entries:o(Number((f(),C)[(r+32)/8]),
Number((f(),C)[(r+40)/8]))},c=b.getJsObject(e),d=Zr(0n);return b.Internals.jsObjectInsert(d,c.createBindGroup(s)),d})();
return BigInt(t)},ro=function(e,r){e=w(e),r=w(r);var t=(()=>{var a;r&&(a={label:b.makeStringFromOptionalStringView(r+8)});
var o=b.getJsObject(e),s=tt(0n);return b.Internals.jsObjectInsert(s,o.createCommandEncoder(a)),s})();return BigInt(t)},to=function(e,r){
e=w(e),r=w(r);var t=(()=>{var a=b.makeComputePipelineDesc(r),o=b.getJsObject(e),s=nt(0n);return b.Internals.jsObjectInsert(
s,o.createComputePipeline(a)),s})();return BigInt(t)};function ao(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(b.WGSLLanguageFeatureName[r]):!1}var no=function(e,r,t){e=w(e),r=w(r),t=w(t);var a=b.getJsObject(
e),o=Array.from((f(),H).subarray(t/8,(t+r*8)/8),s=>b.getJsObject(s));a.submit(o)};function io(e,r,t,a,o){e=w(e),r=w(r),t=
w(t),a=w(a),o=w(o);var s=b.getJsObject(e),c=b.getJsObject(r),d=(f(),z).subarray(a,a+o);s.writeBuffer(c,t,d,0,o)}var Ge={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,a]of Object.entries(e))typeof a=="function"&&(a.isAsync||
r.test(t))&&(e[t]=a=new WebAssembly.Suspending(a))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;Ge.asyncExports=new Set;var t={};for(let[o,s]of Object.entries(
e))if(typeof s=="function"){r.test(o)&&(Ge.asyncExports.add(s),s=Ge.makeAsyncFunction(s));var a=Ge.instrumentFunction(s);
t[o]=a}else t[o]=s;return t},asyncExports:null,isAsyncExport(e){var r;return(r=Ge.asyncExports)==null?void 0:r.has(e)},handleAsync:async e=>{
Ze();try{return await e()}finally{$e()}},handleSleep:e=>Ge.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},da=e=>{var r=n["_"+e];return r},oo=(e,r)=>{(f(),A).set(e,r)},ma=(e,r,t,a,o)=>{var s={pointer:q=>BigInt(q),
string:q=>{var y=0;return q!=null&&q!==0&&(y=De(q)),BigInt(y)},array:q=>{var y=zr(q.length);return oo(q,y),BigInt(y)}};function c(q){
return r==="string"?or(Number(q)):r==="pointer"?Number(q):r==="boolean"?!!q:q}var d=da(e),_=[],S=0;if(a)for(var E=0;E<a.
length;E++){var O=s[t[E]];O?(S===0&&(S=Fe()),_[E]=O(a[E])):_[E]=a[E]}var M=d(..._);function j(q){return S!==0&&Ce(S),c(q)}
var $=o==null?void 0:o.async;return $?M.then(j):(M=j(M),M)},so=(e,r,t,a)=>{var o=!t||t.every(c=>c==="number"||c==="boole\
an"),s=r!=="string";return s&&o&&!a?da(e):(...c)=>ma(e,r,t,c,a)},co=(...e)=>i.createPath(...e),uo=(...e)=>i.unlink(...e),
lo=(...e)=>i.createLazyFile(...e),fo=(...e)=>i.createDevice(...e);if(Y.init(),i.createPreloadedFile=Hn,i.preloadFile=Kr,
i.staticInit(),Ie(),n.noExitRuntime&&(Qr=n.noExitRuntime),n.preloadPlugins&&(Pt=n.preloadPlugins),n.print&&(se=n.print),
n.printErr&&(V=n.printErr),n.wasmBinary&&(me=n.wasmBinary),n.arguments&&n.arguments,n.thisProgram&&(T=n.thisProgram),n.preInit)
for(typeof n.preInit=="function"&&(n.preInit=[n.preInit]);n.preInit.length>0;)n.preInit.shift()();n.ENV=xr,n.mmapAlloc=Jr,
n.wasmMemory=Ue,n.addRunDependency=kr,n.removeRunDependency=Er,n.ccall=ma,n.cwrap=so,n.FS_preloadFile=Kr,n.FS_unlink=uo,
n.FS_createPath=co,n.FS_createDevice=fo,n.FS=i,n.FS_createDataFile=Vt,n.FS_createLazyFile=lo,n.MEMFS=Q;var mo=[Rt,Ot,qt,
Jt,Kn,Ht,Kt,Xt,Xn,Yn,Yt,Zt,ea,ra,oa,sa,ca,ua,la,fa];function pa(e,r,t,a){return Ge.handleAsync(async()=>await l(or(Number(
e)),Number(r),Number(t),Number(a)))}pa.sig="jjjjj";var ga,ha,ba,Zr,et,rt,tt,at,nt,_a,va,ya,wa,Ea,ka,Sa,Ba,Ga,xa,Na,Ia,Aa,
Ta,it,Fa,ot,st,cr,ct,Ca,Ua,Nr,Ra,ut,Oa,ja,Ma,lt,Da,za,qa,La,Qa,Wa,$a,Va;function po(e){n._wllama_malloc=e.wllama_malloc,
n._wllama_start=e.wllama_start,n._wllama_action=e.wllama_action,n._wllama_exit=e.wllama_exit,n._wllama_debug=e.wllama_debug,
ga=n._main=e.main,ha=e.malloc,ba=e.free,Zr=e.emwgpuCreateBindGroup,et=e.emwgpuCreateBindGroupLayout,rt=e.emwgpuCreateCommandBuffer,
tt=e.emwgpuCreateCommandEncoder,at=e.emwgpuCreateComputePassEncoder,nt=e.emwgpuCreateComputePipeline,_a=e.emwgpuCreateExternalTexture,
va=e.emwgpuCreatePipelineLayout,ya=e.emwgpuCreateQuerySet,wa=e.emwgpuCreateRenderBundle,Ea=e.emwgpuCreateRenderBundleEncoder,
ka=e.emwgpuCreateRenderPassEncoder,Sa=e.emwgpuCreateRenderPipeline,Ba=e.emwgpuCreateSampler,Ga=e.emwgpuCreateSurface,xa=
e.emwgpuCreateTexture,Na=e.emwgpuCreateTextureView,Ia=e.emwgpuCreateAdapter,Aa=e.emwgpuCreateBuffer,Ta=e.emwgpuCreateDevice,
it=e.emwgpuCreateQueue,Fa=e.emwgpuCreateShaderModule,ot=e.emwgpuOnDeviceLostCompleted,st=e.emwgpuOnMapAsyncCompleted,cr=
e.emwgpuOnRequestAdapterCompleted,ct=e.emwgpuOnRequestDeviceCompleted,Ca=e.emwgpuOnWorkDoneCompleted,Ua=e.emwgpuOnUncapturedError,
e._emscripten_tls_init,Nr=e.pthread_self,Ra=e.emscripten_builtin_memalign,ut=e._emscripten_thread_init,Oa=e._emscripten_thread_crashed,
ja=e._emscripten_run_js_on_main_thread,Ma=e._emscripten_thread_free_data,lt=e._emscripten_thread_exit,Da=e._emscripten_check_mailbox,
za=e.memalign,qa=e.__trap,La=e.emscripten_stack_set_limits,Qa=e._emscripten_stack_restore,Wa=e._emscripten_stack_alloc,$a=
e.emscripten_stack_get_current,Va=e.__indirect_function_table}var er;function go(){er={__asyncjs__js_file_read:pa,__pthread_create_js:Lt,
__syscall_fcntl64:Jt,__syscall_getcwd:Ht,__syscall_getdents64:Kt,__syscall_ioctl:Xt,__syscall_openat:Yt,__syscall_stat64:Zt,
_abort_js:Zn,_emscripten_init_main_thread_js:ei,_emscripten_notify_mailbox_postmessage:ti,_emscripten_receive_on_main_thread_js:ai,
_emscripten_thread_cleanup:ni,_emscripten_thread_mailbox_await:Yr,_emscripten_thread_set_strongref:ii,_localtime_js:li,_mmap_js:ea,
_munmap_js:ra,_tzset_js:fi,clock_time_get:mi,emscripten_check_blocking_allowed:pi,emscripten_date_now:aa,emscripten_exit_with_live_runtime:gi,
emscripten_get_callstack:_i,emscripten_get_heap_max:vi,emscripten_get_now:ta,emscripten_has_asyncify:yi,emscripten_num_logical_cores:wi,
emscripten_resize_heap:ki,emwgpuAdapterRequestDevice:xi,emwgpuBufferDestroy:Ni,emwgpuBufferGetConstMappedRange:Ii,emwgpuBufferMapAsync:Ai,
emwgpuBufferUnmap:Ti,emwgpuDelete:Fi,emwgpuDeviceCreateBuffer:Ci,emwgpuDeviceCreateShaderModule:Ui,emwgpuDeviceDestroy:Ri,
emwgpuInstanceRequestAdapter:Oi,emwgpuQueueOnSubmittedWorkDone:ji,emwgpuWaitAny:ia,environ_get:oa,environ_sizes_get:sa,exit:qr,
fd_close:ca,fd_read:ua,fd_seek:la,fd_write:fa,memory:Ue,random_get:qi,wgpuAdapterGetInfo:Li,wgpuAdapterGetLimits:Qi,wgpuAdapterHasFeature:Wi,
wgpuBufferGetSize:$i,wgpuCommandEncoderBeginComputePass:Vi,wgpuCommandEncoderCopyBufferToBuffer:Pi,wgpuCommandEncoderFinish:Ji,
wgpuComputePassEncoderDispatchWorkgroups:Hi,wgpuComputePassEncoderEnd:Ki,wgpuComputePassEncoderSetBindGroup:Xi,wgpuComputePassEncoderSetPipeline:Yi,
wgpuComputePipelineGetBindGroupLayout:Zi,wgpuDeviceCreateBindGroup:eo,wgpuDeviceCreateCommandEncoder:ro,wgpuDeviceCreateComputePipeline:to,
wgpuInstanceHasWGSLLanguageFeature:ao,wgpuQueueSubmit:no,wgpuQueueWriteBuffer:io}}function ho(e){e=Object.assign({},e);var r=S=>(E,O,M)=>S(
E,BigInt(O||0),BigInt(M||0)),t=S=>E=>Number(S(BigInt(E))),a=S=>E=>S(BigInt(E)),o=S=>()=>Number(S()),s=S=>(E,O)=>Number(S(
BigInt(E),BigInt(O))),c=S=>(E,O,M,j,$,q)=>S(BigInt(E),O,M,j,$,q),d=S=>(E,O,M,j,$)=>S(E,BigInt(O),M,BigInt(j),$),_=S=>(E,O)=>S(
BigInt(E),BigInt(O));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=a(e.free),e.pthread_self=o(e.pthread_self),e.emscripten_builtin_memalign=
s(e.emscripten_builtin_memalign),e._emscripten_thread_init=c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=
d(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=a(e._emscripten_thread_free_data),e._emscripten_thread_exit=
a(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=_(e.emscripten_stack_set_limits),e._emscripten_stack_restore=
a(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(e._emscripten_stack_alloc),e.emscripten_stack_get_current=o(e.
emscripten_stack_get_current),e}async function bo(){var e=ga,r=0,t=0;try{var a=e(r,BigInt(t));return a=await a,jt(a,!0),
a}catch(o){return Xr(o)}}function Ir(){if(Ve>0){ir=Ir;return}if(h){tr();return}if(_r(),Ve>0){ir=Ir;return}async function e(){
var t;if(n.calledRun=!0,!we){tr(),(t=n.onRuntimeInitialized)==null||t.call(n);var r=n.noInitialRun||!1;r||await bo(),vr()}}
n.setStatus?(n.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>n.setStatus(""),1),e()},1)):e()}var ze;return h||(Qe(),
Ir()),n}var pn=1,gn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"GlueMsgError",fields:[{type:"str",
name:"message",isNullable:!1}]},load_req:{name:"load_req",structName:"glue_msg_load_req",className:"GlueMsgLoadReq",fields:[
{type:"arr_str",name:"model_paths",isNullable:!1},{type:"str",name:"mmproj_path",isNullable:!0},{type:"bool",name:"n_ctx\
_auto",isNullable:!1},{type:"bool",name:"use_mmap",isNullable:!1},{type:"bool",name:"use_mlock",isNullable:!1},{type:"in\
t",name:"n_gpu_layers",isNullable:!1},{type:"int",name:"n_ctx",isNullable:!1},{type:"int",name:"n_threads",isNullable:!1},
{type:"str",name:"model_alias",isNullable:!0},{type:"int",name:"log_level",isNullable:!0},{type:"bool",name:"embeddings",
isNullable:!0},{type:"bool",name:"offload_kqv",isNullable:!0},{type:"int",name:"n_batch",isNullable:!0},{type:"int",name:"\
n_ubatch",isNullable:!0},{type:"int",name:"n_parallel",isNullable:!0},{type:"str",name:"pooling_type",isNullable:!0},{type:"\
str",name:"rope_scaling_type",isNullable:!0},{type:"float",name:"rope_freq_base",isNullable:!0},{type:"float",name:"rope\
_freq_scale",isNullable:!0},{type:"float",name:"yarn_ext_factor",isNullable:!0},{type:"float",name:"yarn_attn_factor",isNullable:!0},
{type:"float",name:"yarn_beta_fast",isNullable:!0},{type:"float",name:"yarn_beta_slow",isNullable:!0},{type:"int",name:"\
yarn_orig_ctx",isNullable:!0},{type:"str",name:"cache_type_k",isNullable:!0},{type:"str",name:"cache_type_v",isNullable:!0},
{type:"bool",name:"kv_unified",isNullable:!0},{type:"bool",name:"flash_attn",isNullable:!0},{type:"bool",name:"swa_full",
isNullable:!0},{type:"int",name:"n_ctx_checkpoints",isNullable:!0},{type:"int",name:"checkpoint_min_step",isNullable:!0},
{type:"str",name:"chat_template",isNullable:!0},{type:"bool",name:"jinja",isNullable:!0},{type:"arr_str",name:"default_t\
emplate_kwargs_keys",isNullable:!0},{type:"arr_str",name:"default_template_kwargs_vals",isNullable:!0},{type:"bool",name:"\
reasoning",isNullable:!0},{type:"int",name:"image_min_tokens",isNullable:!0},{type:"int",name:"image_max_tokens",isNullable:!0},
{type:"bool",name:"warmup",isNullable:!0},{type:"bool",name:"no_kv_offload",isNullable:!0},{type:"bool",name:"mmproj_off\
load",isNullable:!0},{type:"bool",name:"cont_batching",isNullable:!0},{type:"int",name:"n_keep",isNullable:!0},{type:"bo\
ol",name:"ctx_shift",isNullable:!0},{type:"bool",name:"cache_idle_slots",isNullable:!0},{type:"int",name:"n_cache_reuse",
isNullable:!0},{type:"arr_str",name:"lora_paths",isNullable:!0},{type:"arr_float",name:"lora_scales",isNullable:!0},{type:"\
bool",name:"lora_init_without_apply",isNullable:!0},{type:"str",name:"spec_draft_model",isNullable:!0},{type:"int",name:"\
spec_draft_ngl",isNullable:!0},{type:"int",name:"spec_draft_n_max",isNullable:!0},{type:"int",name:"spec_draft_n_min",isNullable:!0},
{type:"float",name:"spec_draft_p_min",isNullable:!0},{type:"int",name:"spec_draft_threads",isNullable:!0},{type:"int",name:"\
spec_draft_threads_batch",isNullable:!0},{type:"arr_str",name:"kv_overrides_keys",isNullable:!0},{type:"arr_str",name:"k\
v_overrides_vals",isNullable:!0},{type:"int",name:"reasoning_budget_tokens",isNullable:!0},{type:"str",name:"reasoning_b\
udget_message",isNullable:!0},{type:"str",name:"reasoning_format",isNullable:!0},{type:"bool",name:"skip_chat_parsing",isNullable:!0},
{type:"bool",name:"prefill_assistant",isNullable:!0}]},load_res:{name:"load_res",structName:"glue_msg_load_res",className:"\
GlueMsgLoadRes",fields:[{type:"bool",name:"success",isNullable:!1},{type:"int",name:"n_ctx",isNullable:!1},{type:"int",name:"\
n_batch",isNullable:!1},{type:"int",name:"n_ubatch",isNullable:!1},{type:"int",name:"n_vocab",isNullable:!1},{type:"int",
name:"n_ctx_train",isNullable:!1},{type:"int",name:"n_embd",isNullable:!1},{type:"int",name:"n_layer",isNullable:!1},{type:"\
arr_str",name:"metadata_key",isNullable:!1},{type:"arr_str",name:"metadata_val",isNullable:!1},{type:"int",name:"token_b\
os",isNullable:!1},{type:"int",name:"token_eos",isNullable:!1},{type:"int",name:"token_eot",isNullable:!1},{type:"arr_in\
t",name:"list_tokens_eog",isNullable:!1},{type:"bool",name:"add_bos_token",isNullable:!1},{type:"bool",name:"add_eos_tok\
en",isNullable:!1},{type:"bool",name:"has_encoder",isNullable:!1},{type:"int",name:"token_decoder_start",isNullable:!1},
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
gr=new Uint8Array([71,76,85,69]),Bt=0,To=1,Fo=2,Co=3,Uo=4,Ro=5,Oo=6,jo=7,Mo=8,Do=9,zo=10,hn={str:Uo,int:Fo,float:Co,bool:To,
raw:Ro,arr_str:Do,arr_int:jo,arr_float:Mo,arr_bool:Oo,arr_raw:zo,null:Bt};function qo(n){let l=0;const u=new DataView(n.
buffer),m=()=>{const D=u.getUint32(l,!0);return l+=4,D},p=()=>{const D=u.getInt32(l,!0);return l+=4,D},g=()=>{const D=u.
getFloat32(l,!0);return l+=4,D},h=()=>m()!==0,N=D=>{const J=D??m(),be=new TextDecoder().decode(n.slice(l,l+J));return l+=
J,be},T=()=>{const D=m(),J=n.slice(l,l+D);return l+=D,J},x=D=>{const J=m(),be=new Array(J);for(let se=0;se<J;se++)be[se]=
D();return be},G=()=>null,v=D=>{switch(D.type){case"str":return N();case"int":return p();case"float":return g();case"boo\
l":return h();case"raw":return T();case"arr_str":return x(N);case"arr_int":return x(p);case"arr_float":return x(g);case"\
arr_bool":return x(h);case"arr_raw":return x(T);case"null":return G()}},F=n[0]===gr[0]&&n[1]===gr[1]&&n[2]===gr[2]&&n[3]===
gr[3];if(l+=4,!F)throw new Error("Invalid magic number");if(m()!==pn)throw new Error("Invalid version number");const k=N(
8),R=gn[k];if(!R)throw new Error(`Unknown message name: ${k}`);const P={_name:k};for(const D of R.fields){const J=m();if(J===
Bt){if(!D.isNullable)throw new Error(`${k}: Expect field ${D.name} to be non-nullable`);P[D.name]=null;continue}if(J!==hn[D.
type])throw new Error(`${k}: Expect field ${D.name} to have type ${D.type}`);P[D.name]=v(D)}return P}function Lo(n){const l=gn[n.
_name];if(!l)throw new Error(`Unknown message name: ${n._name}`);const u=[],m=B=>{const k=new ArrayBuffer(4);new DataView(
k).setUint32(0,B,!0),u.push(new Uint8Array(k))},p=B=>{const k=new ArrayBuffer(4);new DataView(k).setInt32(0,B,!0),u.push(
new Uint8Array(k))},g=B=>{const k=new ArrayBuffer(4);new DataView(k).setFloat32(0,B,!0),u.push(new Uint8Array(k))},h=B=>{
m(B?1:0)},N=B=>{const k=new TextEncoder().encode(B);m(k.byteLength),u.push(k)},T=B=>{m(B.byteLength),u.push(B)},x=(B,k)=>{
m(B.length);for(const R of B)k(R)};u.push(gr),m(pn);{const B=new TextEncoder().encode(n._name);u.push(B)}for(const B of l.
fields){const k=n[B.name];if(!B.isNullable&&k==null)throw new Error(`${n._name}: Expect field ${B.name} to be non-nullab\
le`);if(k==null){m(Bt);continue}switch(m(hn[B.type]),B.type){case"str":N(k);break;case"int":p(k);break;case"float":g(k);
break;case"bool":h(k);break;case"raw":T(k);break;case"arr_str":x(k,N);break;case"arr_int":x(k,p);break;case"arr_float":x(
k,g);break;case"arr_bool":x(k,h);break;case"arr_raw":x(k,T);break}}const G=u.reduce((B,k)=>B+k.byteLength,0),v=new Uint8Array(
G);let F=0;for(const B of u)v.set(B,F),F+=B.byteLength;return v}const rr=Object.freeze({profile:"gemma4-unified-v1",imageMinTokens:70,
imageMaxTokens:280,batchTokens:512,contextTokens:2048,maximumFiles:2,requestBytes:6*1024**2});function Qo(n){const l=n==
null?void 0:n.ggufMedia;if(l===void 0)return null;if(!l||Object.keys(l).length!==2||l.profile!==rr.profile||l.projectorPath!==
"mmproj-gemma4-unified-f16.gguf"||n.architecture!=="gemma4"||n.task!=="text-generation"||JSON.stringify(n.modalities)!==
'["text","image","audio"]')throw new Error("Unsupported GGUF multimodal profile");return rr}const Wo=Uint32Array.from({length:256},
(n,l)=>{let u=l;for(let m=0;m<8;m++)u=u&1?3988292384^u>>>1:u>>>1;return u>>>0});function $o(n,l,u){let m=4294967295;for(let p=l;p<
u;p++)m=Wo[(m^n[p])&255]^m>>>8;return(m^4294967295)>>>0}function ft(n,l){const u=new Uint8Array(l.length+12),m=new DataView(
u.buffer);return m.setUint32(0,l.length),u.set(new TextEncoder().encode(n),4),u.set(l,8),m.setUint32(u.length-4,$o(u,4,u.
length-4)),u}function Vo(n){const l=kt(n);if(!l)throw new Error("GGUF image pixels are required");const u=l.width*4,m=new Uint8Array(
l.data.length+l.height);for(let B=0;B<l.height;B++)m.set(l.data.subarray(B*u,(B+1)*u),B*(u+1)+1);const p=new Uint8Array(
2+m.length+Math.ceil(m.length/65535)*5+4);p.set([120,1]);let g=2,h=1,N=0;const T=new DataView(p.buffer);for(let B=0;B<m.
length;){const k=Math.min(65535,m.length-B);p[g++]=B+k===m.length?1:0,T.setUint16(g,k,!0),T.setUint16(g+2,k^65535,!0),g+=
4,p.set(m.subarray(B,B+k),g),g+=k;for(let R=B;R<B+k;R++)h=(h+m[R])%65521,N=(N+h)%65521;B+=k}T.setUint32(g,(N<<16|h)>>>0);
const x=new Uint8Array(13),G=new DataView(x.buffer);G.setUint32(0,l.width),G.setUint32(4,l.height),x.set([8,6,0,0,0],8);
const v=[new Uint8Array([137,80,78,71,13,10,26,10]),ft("IHDR",x),ft("IDAT",p),ft("IEND",new Uint8Array)],F=new Uint8Array(
v.reduce((B,k)=>B+k.length,0));g=0;for(const B of v)F.set(B,g),g+=B.length;return F}function Po(n){const{samples:l,sampleRate:u}=St(
n==null?void 0:n.samples,n==null?void 0:n.sampleRate),m=new Uint8Array(44+l.length*2),p=new DataView(m.buffer),g=(h,N)=>m.
set(new TextEncoder().encode(N),h);g(0,"RIFF"),p.setUint32(4,m.length-8,!0),g(8,"WAVE"),g(12,"fmt "),p.setUint32(16,16,!0),
p.setUint16(20,1,!0),p.setUint16(22,1,!0),p.setUint32(24,u,!0),p.setUint32(28,u*2,!0),p.setUint16(32,2,!0),p.setUint16(34,
16,!0),g(36,"data"),p.setUint32(40,l.length*2,!0);for(let h=0;h<l.length;h++){const N=Math.max(-1,Math.min(1,l[h]));p.setInt16(
44+h*2,Math.round(N*(N<0?32768:32767)),!0)}return m}function Jo({image:n,audio:l}){return kt(n),l!=null&&St(l.samples,l.
sampleRate),[...n?[Vo(n)]:[],...l?[Po(l)]:[]]}function Za(n,l,u){if(u&&n.some(p=>p.content.includes(u)))throw new Error(
"Prompt contains a reserved native media marker");if(!l.length)return{messages:n,files:[]};if(typeof u!="string"||!/^<[^\s<>]{1,126}>$/.
test(u))throw new Error("Invalid native media marker");if(l.length>rr.maximumFiles)throw new Error("Too many GGUF media \
inputs");const m=n.findLastIndex(p=>p.role==="user");if(m<0)throw new Error("GGUF media needs a current user message");return{
files:l,messages:n.map((p,g)=>g!==m?p:{role:p.role,content:[{type:"text",text:p.content},...l.map(()=>({type:"text",text:u}))]})}}
const bn=4*1024**2,ht=1024*1024;function Ho(n,l){if(n==="completion"){if(typeof(l==null?void 0:l.data_json)!="string"||new TextEncoder().
encode(l.data_json).length>ht||!Array.isArray(l.files)||l.files.length>rr.maximumFiles||l.files.some(g=>!(g instanceof Uint8Array)))
throw new Error("Invalid GGUF native media request");if(l.files.reduce((g,h)=>g+h.byteLength,0)>rr.requestBytes)throw new Error(
"GGUF native media exceeds its byte budget")}const u=Lo(l),m=n==="completion"?rr.requestBytes:ht;if(u.byteLength>m)throw new Error(
"GGUF native message exceeds its byte budget");return u}function Ko({files:n,reader:l,getMemory:u,getSignal:m=()=>{}}){const p=new Map(
n.map(g=>[g.name,g]));return async(g,h,N,T)=>{const x=p.get(g.replace(/^\/?models\//,""));if(!x||![h,N,T].every(v=>Number.
isSafeInteger(v)&&v>=0)||h>x.size)throw new Error("Invalid GGUF native file read");const G=Math.min(N,x.size-h);if(!Number.
isSafeInteger(T+G)||T+G>u().byteLength)throw new Error("GGUF native file read exceeds WASM memory");for(let v=0;v<G;){oe(
m());const F=Math.min(bn,G-v),B=await l.read(x.path,h+v,F,{signal:m()});if(oe(m()),!(B instanceof Uint8Array)||B.byteLength!==
F)throw new Error("Incomplete GGUF artifact range");new Uint8Array(u()).set(B,T+v),v+=F}return BigInt(G)}}function Xo(n,l){
n.FS.mkdir("/models"),n.FS.mount(n.MEMFS,{root:"."},"/models");const u=new Map(l.map(g=>[g.name,g])),m=n.MEMFS.stream_ops;
for(const g of["read","llseek"]){const h=m[g];m[g]=function(N,...T){const x=u.get(N.node.name);return x&&(N.node.usedBytes=
x.size),h.call(this,N,...T)},n.MEMFS.ops_table.file.stream[g]=m[g]}const p=m.mmap;m.mmap=function(g,...h){if(u.has(g.node.
name))throw new Error("GGUF artifact mmap is prohibited");return p.call(this,g,...h)},n.MEMFS.ops_table.file.stream.mmap=
m.mmap;for(const g of l)n.FS_createDataFile("/models",g.name,new Uint8Array(0),!0,!1,!0)}function Yo(n,l,{collect:u=!1,onLost:m}={}){
var T;if(l.device=n,l.runtimeFeatures=[...n.features],l.runtimeAdapter=n.adapterInfo?{vendor:n.adapterInfo.vendor,architecture:n.
adapterInfo.architecture,isFallbackAdapter:n.adapterInfo.isFallbackAdapter??!1}:null,!n.features.has("shader-f16")||(T=l.
runtimeAdapter)!=null&&T.isFallbackAdapter)throw new Error("GGUF native runtime did not acquire the required hardware GP\
U");if(n.lost.then(x=>m==null?void 0:m(x)),!u)return()=>{};const p=Object.getOwnPropertyDescriptor(n,"createCommandEncod\
er"),g=Object.getOwnPropertyDescriptor(n.queue,"submit"),h=n.createCommandEncoder.bind(n),N=n.queue.submit.bind(n.queue);
return n.createCommandEncoder=(...x)=>{const G=h(...x),v=G.beginComputePass.bind(G);return G.beginComputePass=(...F)=>{const B=v(
...F);for(const k of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const R=B[k].bind(B);B[k]=(...P)=>{const D=R(...P);
return l.dispatches+=1,D}}return B},G},n.queue.submit=(...x)=>{const G=N(...x);return l.submissions+=1,G},()=>{p?Object.
defineProperty(n,"createCommandEncoder",p):delete n.createCommandEncoder,g?Object.defineProperty(n.queue,"submit",g):delete n.
queue.submit}}function Zo(n){const l=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(n);return l?{gpuLayers:Number(
l[1]),totalLayers:Number(l[2])}:null}function es(n){const l=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(n);return l?{backend:l[1],kind:l[2].toLowerCase(),bytes:Math.round(Number(l[3])*1024**2)}:null}async function rs({wasmUrl:n,
weights:l,projector:u,adapters:m=[],reader:p,signal:g,collectGpuEvidence:h=!1,onProgress:N,onLost:T,initialize:x=Ao}={}){
const G=l.map((W,A)=>({...W,name:`model-${String(A+1).padStart(5,"0")}-of-${String(l.length).padStart(5,"0")}.gguf`}));if(u&&
l.some(W=>W.path===u.path))throw new Error("GGUF projector must be separate from text shards");const v=u?{...u,name:"mmp\
roj.gguf"}:void 0,F=m.map((W,A)=>({...W.file,scale:W.scale,name:`adapter-${A+1}.gguf`})),B=[...G,...v?[v]:[],...F];if(new Set(
B.map(W=>W.path)).size!==B.length)throw new Error("GGUF base and companion files must have distinct paths");const k={dispatches:0,
submissions:0,device:null,offload:null,buffers:[],lost:!1};let R=g,P,D,J,be,se;const V=new Promise((W,A)=>{be=W,se=A}),me=W=>{
var ie;const A=Zo(String(W));A&&(k.offload=A,N==null||N({type:"gpu-offload",...A}));const z=es(String(W));z&&k.buffers.length<
32&&(k.buffers.push(z),N==null||N({type:"native-buffer",...z,wasmMemoryBytes:((ie=J==null?void 0:J.wasmMemory)==null?void 0:
ie.buffer.byteLength)??0}))},ne=W=>{P=new Error(`Model session lost: GGUF native runtime failed: ${String(W).slice(0,300)}`),
se(P)};J={noInitialRun:!0,pthreadPoolSize:0,locateFile(W){if(W!=="wllama.wasm")throw new Error("Untrusted GGUF runtime a\
sset request");return n},print:me,printErr:me,onAbort:ne,onExit:ne,preRun(){J.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){
be()},peercomputeOnDevice(W){try{D==null||D(),D=Yo(W,k,{collect:h,onLost(A){k.lost=!0,T==null||T(A)}})}catch(A){W.destroy(),
ne(A.message)}}};const we=Ko({files:B,reader:p,getMemory:()=>J.wasmMemory.buffer,getSignal:()=>R});x(J,we),await V,oe(g),
Xo(J,B);const ye=J.cwrap("wllama_start","string",[],{async:!0}),ce=J.cwrap("wllama_malloc","bigint",["bigint","number"]),
_e=J.cwrap("wllama_action","bigint",["string","bigint"],{async:!0});let f=!1;const le=async(W,A,z)=>{if(f)throw new Error(
"Concurrent GGUF native calls are prohibited");if(P)throw P;if(k.lost)throw new Error("GPU device lost; GGUF session is \
unavailable");oe(z);const ie=Ho(W,A);f=!0,R=z;try{const I=Number(ce(BigInt(ie.byteLength),0)),U=new Uint8Array(J.wasmMemory.
buffer);if(!Number.isSafeInteger(I)||I<=0||I+ie.length>U.length)throw new Error("Invalid GGUF input pointer");U.set(ie,I);
const pe=Number(await _e(W,BigInt(I)));if(P)throw P;const ee=J.wasmMemory.buffer,H=new DataView(ee).getUint32(I,!0);if(!Number.
isSafeInteger(pe)||pe<=0||H>ht||pe+H>ee.byteLength)throw new Error("Invalid GGUF output buffer");return qo(new Uint8Array(
ee,pe,H).slice())}catch(I){throw P??(P=new Error(`Model session lost: GGUF native action failed: ${String(I.message??I).
slice(0,300)}`)),P}finally{f=!1,R=void 0}},xe=JSON.parse(await ye());if(P)throw P;if(!xe.success||!k.device)throw new Error(
"GGUF native hardware GPU backend did not initialize");return oe(g),{files:G,projectorFile:v,adapterFiles:F,action:le,evidence:k,
async settleGpu(){try{await k.device.queue.onSubmittedWorkDone()}catch(W){throw k.lost=!0,P=new Error(`Model session los\
t: GGUF GPU completion failed: ${String(W.message??W).slice(0,300)}`),P}},close(){var W;D==null||D(),(W=k.device)==null||
W.destroy()},memoryBytes(){return J.wasmMemory.buffer.byteLength}}}const Z=Object.freeze({maximumBytes:16*1024**3,headerBytes:16*
1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,arrayItems:1048576,stringBytes:1024**2}),Gt=Object.freeze(wo("lla\
ma.cpp").map(n=>n.architecture)),_n="peercompute.gguf.header.v1",ts="3.8.1",bt=new Map([[0,["F32",1,4]],[1,["F16",1,2]],
[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,
["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",
256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,["IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],
[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),jr=new Map([[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_\
0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k\
_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,
"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],[31,"iq1_m"]]),as=new TextDecoder("utf-8",{fatal:!0}),ns=n=>Array.
from(n,l=>l.toString(16).padStart(2,"0")).join(""),L=n=>new Error(`Unsupported GGUF Hub package: ${n}`),en=n=>typeof n==
"string"&&/^[a-z0-9_]{1,64}$/.test(n)?n:"(missing or invalid)";function Se(n,l,u,m=0){if(!Number.isSafeInteger(n)||n<m||
n>l)throw L(`invalid ${u}`);return n}class is extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_\
GGUF_HEADER_TRUNCATED"}}function os(n,{size:l,kind:u="model",includeTensorInfo:m=!1}={}){var xe,W;if(!["model","lora"].includes(
u)||typeof m!="boolean")throw L("header inspection mode");if(!(n instanceof Uint8Array))throw L("header bytes required");
if(Se(l,Z.maximumBytes,"file size",24),n.length>Z.headerBytes||n.length>l)throw L("header byte budget exceeded");const p=new DataView(
n.buffer,n.byteOffset,n.byteLength);let g=0;function h(A){if(Se(A,Z.headerBytes,"header field length"),g+A>Z.headerBytes)
throw L("header byte budget exceeded");if(g+A>n.length)throw new is;const z=g;return g+=A,z}const N=()=>p.getUint32(h(4),
!0),T=()=>{const A=p.getBigUint64(h(8),!0);if(A>BigInt(Number.MAX_SAFE_INTEGER))throw L("unsafe 64-bit value");return Number(
A)};function x(A=Z.stringBytes,z=!0){const ie=Se(T(),A,"string length"),I=h(ie);return z?as.decode(n.subarray(I,I+ie)):void 0}
function G(A,z=!0,ie=!1){if(A===8)return x(Z.stringBytes,z);if(A===9){if(ie)throw L("nested metadata arrays");const ee=N(),
H=Se(T(),Z.arrayItems,"array count");if(ee===9||ee>12)throw L("metadata array type");if(ee===8)for(let C=0;C<H;C++)x(Z.stringBytes,
!1);else h(H*[1,1,2,2,4,4,4,1,0,0,8,8,8][ee]);return{array:!0,element:ee,count:H}}const I=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!I[A])
throw L("metadata value type");const U=h(I[A]);if(!z)return;if(A===0)return p.getUint8(U);if(A===1)return p.getInt8(U);if(A===
2)return p.getUint16(U,!0);if(A===3)return p.getInt16(U,!0);if(A===4)return p.getUint32(U,!0);if(A===5)return p.getInt32(
U,!0);if(A===6)return p.getFloat32(U,!0);if(A===7){const ee=p.getUint8(U);if(ee>1)throw L("boolean value");return!!ee}if(A===
12)return p.getFloat64(U,!0);const pe=A===10?p.getBigUint64(U,!0):p.getBigInt64(U,!0);if(pe>BigInt(Number.MAX_SAFE_INTEGER)||
pe<BigInt(Number.MIN_SAFE_INTEGER))throw L("unsafe metadata integer");return Number(pe)}if(N()!==1179993927)throw L("mag\
ic or byte order");const v=N();if(![2,3].includes(v))throw L("version");const F=Se(T(),Z.tensors,"tensor count",1),B=Se(
T(),Z.metadata,"metadata count",1),k=new Map,R=new Map;for(let A=0;A<B;A++){const z=x(512);if(!z||k.has(z)||/[\u0000-\u001f\u007f]/u.
test(z))throw L("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.test(z))throw L("cu\
stom tensor layout requires catalog review");const ie=N();R.set(z,ie);const I=["general.architecture","general.type","ge\
neral.file_type","general.alignment","general.name","general.quantization_version","split.count","split.no","split.tenso\
rs.count","tokenizer.ggml.model","tokenizer.ggml.tokens","adapter.type","adapter.lora.alpha"].includes(z);k.set(z,G(ie,I))}
const P=k.get("general.architecture");if(!Gt.includes(P))throw L(`architecture ${en(P)} is not admitted by the pinned br\
owser runtime`);if(u==="model"){if(k.has("general.type")&&k.get("general.type")!=="model")throw L("adapter or non-model \
GGUF")}else{if(k.get("general.type")!=="adapter"||k.get("adapter.type")!=="lora")throw L("ordinary LoRA adapter required");
const A=k.get("adapter.lora.alpha");if(R.get("adapter.lora.alpha")!==6||!Number.isFinite(A)||A<0||A>65536)throw L("finit\
e F32 LoRA alpha required");if([...k.keys()].some(z=>z.startsWith("adapter.")&&!["adapter.type","adapter.lora.alpha"].includes(
z)))throw L("nonstandard LoRA metadata requires a separate adapter profile")}if(/georefine/i.test(k.get("general.name")??
""))throw L("custom GeoRefine model requires catalog review");if((k.get("split.count")??1)!==1||(k.get("split.no")??0)!==
0||(k.get("split.tensors.count")??F)!==F)throw L("split GGUF requires complete shard admission");if(![void 0,2].includes(
k.get("general.quantization_version")))throw L("quantization version");const D=k.get("general.file_type");if(u==="model"?
!jr.has(D):![void 0,0,1].includes(D))throw L("file quantization type");const J=k.get("tokenizer.ggml.model"),be=P==="gem\
ma4"?J==="gemma4":["llama","gpt2"].includes(J);if(u==="model"&&(!be||((xe=k.get("tokenizer.ggml.tokens"))==null?void 0:xe.
element)!==8||!((W=k.get("tokenizer.ggml.tokens"))!=null&&W.count)))throw L(`self-contained supported tokenizer required\
 for ${P}; found ${en(J)}`);const se=Se(k.get("general.alignment")??32,4096,"alignment",1);if(se&se-1)throw L("alignment\
 must be a power of two");const V=new Set,me=new Set,ne=[],we=[],ye=new Map;let ce=0;for(let A=0;A<F;A++){const z=x(512);
if(!z||V.has(z)||/georefine|[\u0000-\u001f\u007f]/iu.test(z))throw L("duplicate or custom tensor name");V.add(z);const ie=Se(
N(),4,"tensor dimensions",1);let I=1,U=0;const pe=[];for(let ve=0;ve<ie;ve++){const Ie=Se(T(),Z.maximumBytes,"tensor dim\
ension",1);ve===0&&(U=Ie),pe.push(Ie),I*=Ie,Se(I,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const ee=N(),H=bt.get(
ee);if(!H||U%H[1])throw L("unsupported tensor codec or quantized row shape");if(u==="lora"){const ve=/^(.+\.weight)\.lora_([ab])$/.
exec(z);if(!ve||/\.lora_[ab]/.test(ve[1])||ie!==2||![0,1].includes(ee))throw L("LoRA requires only ordinary F16/F32 matr\
ix pairs; replacement tensors are unsupported");const Ie=ye.get(ve[1])??{};Ie[ve[2]]=pe,ye.set(ve[1],Ie)}const C=Se(I/H[1]*
H[2],l,"tensor bytes",1),Ne=T();if(Ne%se||Ne+C>l)throw L("tensor offset exceeds file or alignment");ne.push({start:Ne,end:Ne+
C}),me.add(ee),m&&we.push({name:z,shape:pe,type:ee,offset:Ne,bytes:C}),ce=Math.max(ce,C)}if(u==="model"&&(!V.has("token_\
embd.weight")||!V.has("output_norm.weight")))throw L("text model tensor layout");if(u==="lora")for(const[A,z]of ye){if(!z.
a||!z.b)throw L("LoRA tensor pair is incomplete");const I=A==="token_embd.weight"?z.a[0]:z.a[1];if(I!==z.b[0]||I>1024)throw L(
"LoRA tensor pair has inconsistent or unsupported rank")}const _e=g,f=Math.ceil(g/se)*se;ne.sort((A,z)=>A.start-z.start);
let le=0;for(const A of ne){if(A.start<le||f+A.end>l)throw L("overlapping or truncated tensor data");le=A.end}return{schema:u===
"model"?_n:"peercompute.gguf.lora-header.v1",version:v,architecture:P,fileType:D??null,dtype:jr.get(D)??"float",tensorCount:F,
metadataCount:B,headerBytes:_e,dataOffset:f,maximumTensorBytes:ce,tensorTypes:[...me].sort((A,z)=>A-z),headerSha256:ns(mn(
n.subarray(0,_e))),...u==="lora"?{alpha:k.get("adapter.lora.alpha"),targetCount:ye.size}:{},...m?{tensorInfo:we}:{}}}async function vn({
readRange:n,size:l,signal:u,kind:m="model",includeTensorInfo:p=!1}={}){if(typeof n!="function")throw L("range reader req\
uired");Se(l,Z.maximumBytes,"file size",24);let g=new Uint8Array(0),h=Math.min(64*1024,l);for(;;){oe(u);const N=new Uint8Array(
h);N.set(g);for(let T=g.length;T<h;){const x=Math.min(Z.rangeBytes,h-T),G=await n(T,x,{signal:u});if(oe(u),!(G instanceof
Uint8Array)||G.length!==x)throw L("truncated range response");N.set(G,T),T+=x}g=N;try{return os(g,{size:l,kind:m,includeTensorInfo:p})}catch(T){
if(T.code!=="ERR_GGUF_HEADER_TRUNCATED"||h===l)throw T;if(h===Z.headerBytes)throw L("header exceeds bounded probe");h=Math.
min(h*2,l,Z.headerBytes)}}}function ss(n){if(!n||n.schema!==_n||![2,3].includes(n.version)||!Gt.includes(n.architecture)||
!jr.has(n.fileType)||jr.get(n.fileType)!==n.dtype||!/^[a-f0-9]{64}$/.test(n.headerSha256??""))throw L("header profile");
for(const[u,m]of[["tensorCount",Z.tensors],["metadataCount",Z.metadata],["headerBytes",Z.headerBytes],["dataOffset",Z.headerBytes+
4096],["maximumTensorBytes",Z.maximumBytes]])Se(n[u],m,u,1);if(n.dataOffset<n.headerBytes||!Array.isArray(n.tensorTypes)||
!n.tensorTypes.length||n.tensorTypes.length>bt.size||n.tensorTypes.some((u,m)=>!bt.has(u)||m>0&&u<=n.tensorTypes[m-1]))throw L(
"tensor profile");const l=["schema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerByt\
es","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.keys(n).some(u=>!l.includes(u)))throw L("u\
nexpected header profile field");return Object.fromEntries(l.map(u=>[u,n[u]]))}function cs({repository:n,revision:l,file:u,
header:m}={}){if(typeof n!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(n)||!/^[a-f0-9]{40}$/.
test(l??""))throw L("immutable Hugging Face repository/revision required");if(gt(u==null?void 0:u.path),!u.path.endsWith(
".gguf")||!/^[a-f0-9]{64}$/.test(u.sha256??""))throw L("pinned GGUF SHA-256 required");Se(u.size,Z.maximumBytes,"weight \
size",24);const p=ss(m);if(p.dataOffset+p.maximumTensorBytes>u.size)throw L("header/file size mismatch");const g=u.size>
4*1024**3;return{model:{runtime:"llama.cpp",runtimeVersion:ts,architecture:p.architecture==="qwen35"?"qwen3_5":p.architecture,
format:"GGUF",task:"text-generation",dtype:p.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:n,revision:l,
gguf:{...p,path:u.path,size:u.size,sha256:u.sha256}},weights:[u],totalBytes:u.size,resourcePolicy:{maxModelBytes:Z.maximumBytes,
minimumCpuBytes:(g?8:2)*1024**3,minimumGpuBytes:(g?16:2)*1024**3}}}function yn(n,{files:l,totalBytes:u}={}){if(!(n!=null&&
n.gguf))throw L("bounded header profile required");const{path:m,size:p,sha256:g,...h}=n.gguf,N=cs({repository:n.repository,
revision:n.revision,file:{path:m,size:p,sha256:g},header:h});for(const T of["runtime","runtimeVersion","architecture","f\
ormat","task","dtype"])if(n[T]!==N.model[T])throw L(`model ${T} disagrees with header`);if(JSON.stringify(n.modalities)!==
'["text"]'||JSON.stringify(n.requiredFeatures)!=='["shader-f16"]')throw L("text-only/f16 capability profile required");if(l){
const T=l.filter(x=>x.path.endsWith(".gguf"));if(T.length!==1||T[0].path!==m||T[0].size!==p||T[0].sha256!==g||l.some(x=>!/^[a-f0-9]{64}$/.
test(x.sha256??"")))throw L("file closure/digest mismatch");N.weights=T,u=l.reduce((x,G)=>x+G.size,0)}return N.totalBytes=
Se(u??p,Z.maximumBytes,"package bytes",p),N}async function us(n,l,u,{signal:m}={}){if(!n.gguf)return;const p=yn(n,{files:l}).
model.gguf,g=await vn({size:l[0].size,signal:m,readRange:(G,v,F)=>u.read(l[0].path,G,v,F)}),{path:h,size:N,sha256:T,...x}=p;
if(JSON.stringify(g)!==JSON.stringify(x))throw L("stored header does not match inspected package")}const ls="peercompute\
.gguf.lora-header.v1",he=n=>new Error(`Unsupported GGUF LoRA: ${n}`),wn=n=>typeof n=="string"&&/^[a-f0-9]{64}$/.test(n),
Te=(n,l,u=1)=>Number.isSafeInteger(n)&&n>=u&&n<=l,En=n=>n==="qwen3_5"?"qwen35":n;function xt(n){if(!n||n.schema!==ls||![
2,3].includes(n.version)||!Gt.includes(n.architecture)||![null,0,1].includes(n.fileType)||n.dtype!==(n.fileType===0?"f32":
n.fileType===1?"f16":"float")||!wn(n.headerSha256)||!Number.isFinite(n.alpha)||n.alpha<0||n.alpha>65536||!Te(n.tensorCount,
Z.tensors)||n.tensorCount%2||!Te(n.targetCount,Z.tensors/2)||n.tensorCount!==n.targetCount*2||!Te(n.metadataCount,Z.metadata)||
!Te(n.headerBytes,Z.headerBytes)||!Te(n.dataOffset,Z.headerBytes+4096)||n.dataOffset<n.headerBytes||!Te(n.maximumTensorBytes,
Z.maximumBytes)||!Array.isArray(n.tensorTypes)||!n.tensorTypes.length||n.tensorTypes.length>2||n.tensorTypes.some((u,m)=>![
0,1].includes(u)||m&&u<=n.tensorTypes[m-1]))throw he("invalid bounded adapter header profile");const l=["schema","versio\
n","architecture","fileType","dtype","tensorCount","metadataCount","headerBytes","dataOffset","maximumTensorBytes","tens\
orTypes","headerSha256","alpha","targetCount"];if(Object.keys(n).some(u=>!l.includes(u)&&u!=="tensorInfo"))throw he("une\
xpected adapter profile field");return Object.fromEntries(l.map(u=>[u,u==="tensorTypes"?[...n[u]]:n[u]]))}function fs({repository:n,
revision:l,path:u,file:m,header:p,scale:g=1}={}){if(typeof n!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.
test(n)||!/^[a-f0-9]{40}$/.test(l??""))throw he("immutable adapter repository and revision required");if(gt(m==null?void 0:
m.path),gt(u??m.path),!m.path.endsWith(".gguf")||!wn(m.sha256)||!Te(m.size,Z.maximumBytes,24)||!Number.isFinite(g)||g<-2||
g>2)throw he("invalid adapter file or scale");const h=xt(p);if(h.dataOffset+h.maximumTensorBytes>m.size)throw he("adapte\
r profile exceeds file size");return{role:"lora",format:"GGUF",file:{...m},scale:g,source:{repository:n,revision:l,path:u??
m.path},profile:h}}function ds(n,l){var h,N,T,x;const u=xt(l);if((n==null?void 0:n.schema)!=="peercompute.gguf.header.v1"||
n.architecture!==u.architecture||!Array.isArray(n.tensorInfo)||n.tensorInfo.length!==n.tensorCount||!Te(n.tensorCount,Z.
tensors)||!Array.isArray(l.tensorInfo)||l.tensorInfo.length!==u.tensorCount)throw he("base architecture or complete tens\
or directories do not match");const m=new Map(n.tensorInfo.map(G=>[G.name,G])),p=new Map(l.tensorInfo.map(G=>[G.name,G]));
if(m.size!==n.tensorCount||p.size!==u.tensorCount)throw he("duplicate tensor directory entries");let g=0;for(const G of p.
values()){const v=/^(.+\.weight)\.lora_([ab])$/.exec(G.name);if(!v||/\.lora_[ab]/.test(v[1])||![0,1].includes(G.type)||!Array.
isArray(G.shape)||G.shape.length!==2||G.shape.some(D=>!Te(D,Z.maximumBytes)))throw he("ordinary matrix adapter required");
if(v[2]==="b")continue;const F=m.get(v[1]),B=G,k=p.get(`${v[1]}.lora_b`);if(!F||!k||((h=F.shape)==null?void 0:h.length)!==
2)throw he("missing matrix target or LoRA pair in selected base");const R=v[1]==="token_embd.weight",P=R?B.shape[0]:B.shape[1];
if(!Te(P,1024)||P!==((N=k.shape)==null?void 0:N[0])||(R?F.shape[0]!==((T=k.shape)==null?void 0:T[1])||F.shape[1]!==B.shape[1]:
F.shape[0]!==B.shape[0]||F.shape[1]!==((x=k.shape)==null?void 0:x[1])))throw he("adapter tensor dimensions do not match \
selected base");g++}if(g!==u.targetCount)throw he("incomplete LoRA tensor pairs");return{architecture:u.architecture,targetCount:g,
tensorCount:u.tensorCount,alpha:u.alpha}}function kn(n,l,u){if(!Array.isArray(u)||u.length<1||u.length>4||(n==null?void 0:
n.runtime)!=="llama.cpp"||!Array.isArray(l)||l.length!==1)throw he("one complete base GGUF and one to four adapters requ\
ired");const m=new Set(l.map(g=>g.path));let p=l[0].size;return u.map(g=>{if(!g||g.role!=="lora"||g.format!=="GGUF")throw he(
"unsupported adapter runtime or role");const h=fs({...g.source,file:g.file,header:g.profile,scale:g.scale});if(h.profile.
architecture!==En(n.architecture))throw he("adapter and base architectures differ");if(m.has(h.file.path))throw he("dupl\
icate adapter or base file path");if(m.add(h.file.path),p+=h.file.size,!Te(p,Z.maximumBytes))throw he("combined package \
exceeds runtime byte budget");return h})}async function ms(n,l,u,m,{signal:p}={}){const g=kn(n,l,u),h=(x,G)=>vn({size:x.
size,kind:G,includeTensorInfo:!0,signal:p,readRange:(v,F,B)=>m.read(x.path,v,F,B)});oe(p);const N=await h(l[0],"model");
if(N.architecture!==En(n.architecture)||n.gguf&&N.headerSha256!==n.gguf.headerSha256)throw he("stored base header differ\
s from selected model");const T=[];for(const x of g){oe(p);const G=await h(x.file,"lora");if(JSON.stringify(xt(G))!==JSON.
stringify(x.profile))throw he("stored adapter header differs from inspected file");T.push({path:x.file.path,...ds(N,G)})}
return T}const ps="ERR_MODEL_CONTEXT_BUDGET",Mr=1;function gs(n,l,u){return Object.assign(new Error(`The model context h\
olds ${l} tokens; instructions and the current prompt need ${n}, plus ${u} reserved for the reply. Shorten the current p\
rompt or saved context, or request a shorter reply.`),{code:ps})}function hs(n){const l=n.findIndex(m=>m.role==="user"),
u=n.findIndex((m,p)=>p>l&&m.role==="user");return l<0||u<0?null:n.filter((m,p)=>p<l||p>=u||m.role==="system")}async function bs({
messages:n,contextTokens:l,reservedOutputTokens:u,measure:m,signal:p,onMeasured:g}){if(!Number.isSafeInteger(l)||l<1||!Number.
isSafeInteger(u)||u<1)throw new Error("Invalid GGUF context budget");let h=n.map(G=>({...G})),N=0,T=0;const x=Math.max(1,
n.filter(G=>G.role==="user").length);for(let G=1;G<=x;G+=1){oe(p);const v=await m(h);if(oe(p),!Number.isSafeInteger(v.inputTokens)||
v.inputTokens<0||!Number.isSafeInteger(v.contextTokens)||v.contextTokens<1||v.contextTokens>l||!Number.isSafeInteger(v.probeOutputTokens)||
v.probeOutputTokens<0||v.probeOutputTokens>Mr)throw new Error("Invalid GGUF context measurement");T+=v.probeOutputTokens;
const F={contextTokens:v.contextTokens,inputTokens:v.inputTokens,reservedOutputTokens:u,removedTurns:N,preflightCalls:G,
measurementTokens:T,probeTokenBudget:Mr},B=v.inputTokens>=v.contextTokens||v.inputTokens+u>v.contextTokens;if(g==null||g(
{...F,probeOutputTokens:v.probeOutputTokens,overflow:B}),oe(p),!B)return{messages:h,contextTruncated:N>0,contextBudget:F};
const k=hs(h);if(!k)throw gs(v.inputTokens,v.contextTokens,u);h=k,N+=1}throw new Error("GGUF context fitting exceeded it\
s bounded attempts")}const lr="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",fr="5ce3fd841676adf2c1a10d719363\
7d46007e88f7",rn=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENS\
E",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3ee\
b0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb3\
3a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da426\
51bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{
path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,
gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf\
88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33\
903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],_s="This catalog \
supports verified storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF m\
odel catalog after browser capability and resource checks.";function Sn(n){for(const l of Object.values(n))l&&typeof l==
"object"&&Sn(l);return Object.freeze(n)}const vs=Sn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-ggu\
f",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:lr,revision:fr,status:"storage-only",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:_s},license:{spdx:"Apa\
che-2.0",sourceUrl:`https://huggingface.co/${lr}/blob/${fr}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model ca\
rd, and immutable artifact provenance."},provenance:{repository:lr,revision:fr,format:"GGUF",metadataCheckedAt:"2026-11-\
03",modelCardUrl:`https://huggingface.co/${lr}/blob/${fr}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{
runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS",
"IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:lr,revision:fr},weightBytes:14199740480,totalBytes:rn.reduce((n,l)=>n+l.size,
0),files:rn}});function Bn(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Bn),Object.freeze(
n)),n}const ys=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",
repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",dtype:"q5_k_m",
sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:32,
nextnPredictLayers:0,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and pot\
entially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision\
 and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-Q5_K_M.gguf",size:6467969824,sha256:"bff5\
a5dbf8ba472d65c0626b0f6046a12996bb841268aa44767dcb9bc87fb0cc"},{path:"README.md",size:4013,sha256:"825f21663874cbfa09dbb\
791849ff9c7f233a043317f16d85ecb3fa3872aaf72",gitBlobSha1:"707f62876429f1ddf7274149e70cfd0dc7940d87",source:{repository:"\
bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"README.md"}},{path:"\
LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adac\
fd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897ea\
e104ddf9fff92031a73d8",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10e\
ae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evi\
l-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"\
caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-Q5_K_M-GGUF",revision:"9531689a9d2da3897eae104ddf9fff92031a73d8",path:"\
EVALUATION.md"}}]},{id:"qwen3.5-9b-claude-highiq-davidau-q4-k-m-gguf",name:"Qwen3.5 9B Claude HighIQ Thinking Heretic (D\
avidAU via mradermacher Q4_K_M, text)",repository:"mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED\
-GGUF",revision:"84c2de4ce65b7bb33584521767646adf9663b128",dtype:"q4_k_m",sourceModel:{repository:"DavidAU/Qwen3.5-9B-Cl\
aude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808"},blockCount:32,nextnPredictLayers:0,
behavior:{kind:"heretic",notice:"Publisher-described heretic fine-tune; not a guarantee of refusal-free output or factua\
l accuracy. This is mradermacher's GGUF conversion of the requested DavidAU source. The browser adapter currently runs t\
ext only."},files:[{path:"Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED.Q4_K_M.gguf",size:5627045888,sha256:"\
b16f38d00a26d9d1eeb191a5836b32982802ffa02819d0db2f5391ec1d53c06d"},{path:"README.md",size:5730,sha256:"eea5e514740c52143\
2aec62a2d416ade44f881e197f95740cc376bc3ecfe430a",gitBlobSha1:"fe0216b6798e17cf35bea52a3a2d74e42b14a24a",source:{repository:"\
mradermacher/Qwen3.5-9B-Claude-4.6-HighIQ-THINKING-HERETIC-UNCENSORED-GGUF",revision:"84c2de4ce65b7bb33584521767646adf96\
63b128",path:"README.md"}},{path:"SOURCE_README.md",size:79602,sha256:"0afc6c4508d99e8966cfd6164d6a3ea924c6781c973192231\
70c5c2f0abdef76",gitBlobSha1:"979caec3d5beb4e54054aebae4316fbed5466b85",source:{repository:"DavidAU/Qwen3.5-9B-Claude-4.\
6-HighIQ-THINKING-HERETIC-UNCENSORED",revision:"22818ca1184f346094524bdd7cda7c7125009808",path:"README.md"}},{path:"LICE\
NSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92\
be087f6e113b5d6d97f678f",source:{repository:"Qwen/Qwen3.5-9B",revision:"c202236235762e1c871ad0ccb60c8ee5ba337b9a",path:"\
LICENSE"}}]},{id:"qwen3.5-9b-evil-mradermacher-q8-0-gguf",name:"Qwen3.5 9B Evil (mradermacher GGUF Q8_0, experimental te\
xt)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",dtype:"q8_0",
sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4"},blockCount:33,
nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"The publisher reports capability damage and pot\
entially hostile responses, including in ordinary conversations. Safety-refusal removal is not claimed; thinking, vision\
 and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B-Evil-BF16.Q8_0.gguf",size:9786061312,sha256:"e\
2315cbfae6702932ed2432435f5714e675bc670954bf6c05aa32303b07e7247"},{path:"README.md",size:4035,sha256:"2d11817c75831fd4bb\
eeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e37506aa283a95220b833a16367bfa953",source:{repository:"\
mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb703544772e11e97e4e3ce3b3",path:"README.md"}},{path:"SO\
URCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa933\
74e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d\
438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"bbedc3fda3305820b977265f01b8619d87570a6739de\
3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",source:{repository:"bowmanslayer/Qwen3.5-9B\
-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},{path:"NOTICE",size:581,sha256:"86e4396\
39f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc2737774933bab6a0c7b8c660c52aa4130cde2",source:{
repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"NOTICE"}},{path:"\
EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06be4bceca2d163d456e20a",gitBlobSha1:"01597ba5\
169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d4\
38111559b04ed015cd4",path:"EVALUATION.md"}}]},{id:"qwen3.5-9b-evil-mradermacher-q4-k-m-gguf",name:"Qwen3.5 9B Evil (mrad\
ermacher GGUF Q4_K_M, experimental text)",repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb\
703544772e11e97e4e3ce3b3",dtype:"q4_k_m",sourceModel:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a57\
5c13af75c5d438111559b04ed015cd4"},blockCount:33,nextnPredictLayers:1,behavior:{kind:"experimental-behavior-edit",notice:"\
The publisher reports capability damage and potentially hostile responses, including in ordinary conversations. Safety-r\
efusal removal is not claimed; thinking, vision and long-context behavior remain unevaluated."},files:[{path:"Qwen3.5-9B\
-Evil-BF16.Q4_K_M.gguf",size:5780091392,sha256:"cfdca30d8666ad7ddf25fa14c24e4e8967c191c70d122185d3bcb612f5f50c95"},{path:"\
README.md",size:4035,sha256:"2d11817c75831fd4bbeeb246e9df9ac2fedc9b37271d76565548361c09142707",gitBlobSha1:"d9e21a7e3750\
6aa283a95220b833a16367bfa953",source:{repository:"mradermacher/Qwen3.5-9B-Evil-BF16-GGUF",revision:"8f99fdb7e067bceb7035\
44772e11e97e4e3ce3b3",path:"README.md"}},{path:"SOURCE_README.md",size:4098,sha256:"b3c9dd4be451e8f5fc8b0aa1a95e4e8efdf7\
d60cd0e33e37a09b2143976fe7ce",gitBlobSha1:"defa93374e1a853200ef4285739799fef5fe4e6c",source:{repository:"bowmanslayer/Qw\
en3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"README.md"}},{path:"LICENSE",size:11544,sha256:"\
bbedc3fda3305820b977265f01b8619d87570a6739de3a5582c3464840f1e57a",gitBlobSha1:"f938136e3adacfd92be087f6e113b5d6d97f678f",
source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"LICENSE"}},
{path:"NOTICE",size:581,sha256:"86e439639f24dc425b3f3b6ce8e65960b42b7d67869ea10eae4c78fc71886e53",gitBlobSha1:"1bc273777\
4933bab6a0c7b8c660c52aa4130cde2",source:{repository:"bowmanslayer/Qwen3.5-9B-Evil-BF16",revision:"b66fc0a575c13af75c5d43\
8111559b04ed015cd4",path:"NOTICE"}},{path:"EVALUATION.md",size:2359,sha256:"caaa2965eac04bc0228e6f6991b7b8cdcdcda83fb06b\
e4bceca2d163d456e20a",gitBlobSha1:"01597ba5169c6ba2ff24e62739583306730adaee",source:{repository:"bowmanslayer/Qwen3.5-9B\
-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],ws=Bn(Object.fromEntries(ys.map(
n=>{const{dtype:l,sourceModel:u,blockCount:m,nextnPredictLayers:p,...g}=n,N=g.files.find(T=>T.path==="LICENSE").source;return[
g.id,{...g,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, c\
ross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device executio\
n validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/"+N.repository+"/blob/"+N.revision+"/LICENS\
E",notice:"The inherited Apache-2.0 license, conversion/source cards and available modification notices are included."},
provenance:{repository:g.repository,revision:g.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https\
://huggingface.co/"+g.repository+"/blob/"+g.revision+"/README.md",sourceModel:{...u,revisionPurpose:"Pinned source docum\
entation and license reference; the converter does not identify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},
upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:m,nextnPredictLayers:p,inspectedPrefixBytes:65536},
vision:"Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the curre\
nt managed GGUF adapter rejects images.",behavior:g.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"\
qwen3_5",format:"GGUF",task:"text-generation",dtype:l,modalities:["text"],requiredFeatures:["shader-f16"],repository:g.repository,
revision:g.revision},weightBytes:g.files[0].size,totalBytes:g.files.reduce((T,x)=>T+x.size,0)}]})));function Nt(n){return n&&
typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Nt),Object.freeze(n)),n}const qe="Tsotchke-Corporatio\
n",Gn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
text)",repository:`${qe}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",
architecture:"qwen3_moe",quantizationTypes:["F32","Q8_0","Q4_K","Q6_K"],sourceModel:{repository:"huihui-ai/Huihui-Qwen3-\
Coder-30B-A3B-Instruct-abliterated",revision:"b84c58d52ac44041774fe9542e1943e4d971b5f4"},publisherLimitations:"Experimen\
tal lossy mixed quantization of an abliterated parent. Behavioral quality, SAE certification and runtime qualification a\
re untested.",files:[{path:".gitattributes",size:1609,gitBlobSha1:"3a433079d93d83ef24990f9ca0b33672cbcc8edd"},{path:"LIC\
ENSE",size:11343,gitBlobSha1:"6634c8cc3133b3848ec74b9f275acaaa1ea618ab"},{path:"NOTICE",size:574,gitBlobSha1:"687c4673ec\
e140e83416522e0d00b53880e8bb13"},{path:"Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-MIXED-Q4_K.gguf",size:18587950144,sha256:"\
2f005a4633b7783c4cdf8e924a0d9ddae28efd7a4d4812d3d94ea97c57aabf51"},{path:"README.md",size:2765,gitBlobSha1:"00227290350d\
0484631d06756736f4dff2e8bd66"},{path:"artifact-manifest.json",size:7659,gitBlobSha1:"87e9f2092c05a30a4c2840073729aa952e6\
e5d05"},{path:"chat_template.jinja",size:6853,gitBlobSha1:"3656cd64ff2fcc6ae59312eb87a709e0aa25b2eb"},{path:"config.json",
size:1065,gitBlobSha1:"5288c67c42b574d39f790e6bf8836f57ec477483"},{path:"generation_config.json",size:235,gitBlobSha1:"f\
1d3ae3c691e1a05d8d0455c0ec9b4153076d5ee"},{path:"tokenizer_config.json",size:5644,gitBlobSha1:"b2cbe86ae45a1274c9b93ec06\
0466ea8a4665c9b"},{path:"verify_artifact.py",size:1403,gitBlobSha1:"57027eb456280780650ef6bc44524b396734cbcf"}]},{id:"qw\
en3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${qe}\
/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac671898b95",architecture:"qwen3_5_moe",quantizationTypes:[
"F32","Q8_0","Q5_K","IQ4_XS","Q6_K"],sourceModel:{repository:"ericpandev/Qwen3.6-35B-A3B-Uncensored-HauhauCS-Aggressive-\
bf16",revision:"f6ab91b5bdc2a7e7e1a1e2263c98a409509c79ed"},publisherLimitations:"The publisher records a failed coding-q\
uality gate and no complete capability certificate. Its internal qLLM Metal gguf-c20 runtime is not a public portable-ru\
ntime qualification; a public pinned clean-machine recipe remains unverified. This is not the GeoRefine TBE codec.",files:[
{path:".gitattributes",size:1699,gitBlobSha1:"f44e4e63e69c8b9a20797fd820049ea27bcf95fc"},{path:"C20-MANIFEST.json",size:2392163,
gitBlobSha1:"3cb693fce32249c21d7a621060df41dbf5df64a9"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e\
21ebe6f181687d02"},{path:"NOTICE",size:465,gitBlobSha1:"4852a35fe237eb4335504e78cd61cdb15834c02f"},{path:"Qwen3.6-35B-A3\
B-GeoRefine-C20-MIXED-IQ4_XS.gguf",size:19998783936,sha256:"027f3c99a065fa1b413505428acb28e5647ebeeafe1e0220badf4b4fce91\
1c96"},{path:"README.md",size:4914,gitBlobSha1:"601a361b4a8308e9121749810fb103b644c581c1"},{path:"artifact-manifest.json",
size:2726,gitBlobSha1:"2706dafb0ea785ed8df0eae767a008315f8a1a9f"},{path:"config.json",size:3148,gitBlobSha1:"09981f690fa\
954e74c4ae3d66163bb68435d14ca"},{path:"generation_config.json",size:243,gitBlobSha1:"be05abc6b17ea7880b71c67d31f7264f92c\
34fc0"},{path:"special_tokens_map.json",size:437,gitBlobSha1:"1838f3b7f5e64b0f32abbd98181ea3ca8b3abfbc"},{path:"tokenize\
r.json",size:19991323,sha256:"adfe67f1d28892e2c9dc17110ceac44bab368d488499115adfea19ff992d9ac7"},{path:"tokenizer_config\
.json",size:15148,gitBlobSha1:"ab21e994b5ad9d2e9777ebe294b4fc98dd7fc6ec"},{path:"verify_c20.py",size:886,gitBlobSha1:"2b\
a7e98dd936d250bff3e3f2a38cae09c81dae86"}]},{id:"qwen3.8-27b-georefine-l162-gguf",name:"Qwen3.8 27B GeoRefine L162 (mixed\
 Q4_K GGUF, candidate text)",repository:`${qe}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd\
3e198e56a4c6da",architecture:"qwen3_5",quantizationTypes:["F32","Q4_K","Q8_0","Q5_K","Q6_K"],sourceModel:{repository:"hu\
ihui-ai/Huihui-Qwen3.8-27B-abliterated",revision:"739e3c5b89849f6c238ce1e5b70008612ae42cdd"},publisherLimitations:"Exper\
imental lossy mixed quantization; behavioral quality and runtime qualification are untested. Q4_K_M_CUSTOM labels a cust\
om allocation of standard GGUF tensor types, not a custom codec or the standard llama.cpp Q4_K_M allocation recipe. The \
inherited Q8_0 header label does not describe the tensor mix.",files:[{path:".gitattributes",size:1694,gitBlobSha1:"f41c\
1739e40b19b0a39816d1819e9e1d82245e5e"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},
{path:"NOTICE",size:515,gitBlobSha1:"f153f97bba2134be8cd813690301cb2b5cd997b8"},{path:"Qwen3.8-27B-GeoRefine-L162-abl-MI\
XED-Q4_K_M_CUSTOM.gguf",size:16249419840,sha256:"191cd8fea54421e402c25d540d90358d27e5678ce8b4f73643d91111cbc223fd"},{path:"\
README.md",size:3913,gitBlobSha1:"5fd10161fbf27f1436861018bb15946d31ab4d8b"},{path:"artifact-manifest.json",size:5897,gitBlobSha1:"\
fff04f79d87dc6253f0f3908dddf67c0ab66a8fd"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5a\
a7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation\
_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,
gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b\
06e0df3640f9ae04fff09706ef"}]}],Es=Nt(Object.fromEntries(Gn.map(n=>{const{architecture:l,quantizationTypes:u,sourceModel:m,
publisherLimitations:p,...g}=n;return[n.id,{...g,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${n.repository}\
/blob/${n.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:n.repository,revision:n.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${n.repository}/blob/${n.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:m,
publisherLimitations:p,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:l,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:u,modalities:["text"],requiredFeatures:["shader-f16"],repository:n.repository,
revision:n.revision},weightBytes:n.files.filter(h=>h.path.endsWith(".gguf")).reduce((h,N)=>h+N.size,0),totalBytes:n.files.
reduce((h,N)=>h+N.size,0)}]})));Nt({organization:qe,sourceUrl:`https://huggingface.co/${qe}`,checkedAt:"2026-11-04",repositories:[
...Gn.map(({id:n,repository:l,revision:u})=>({repository:l,revision:u,catalogId:n,format:"GGUF",codecRequired:!1})),{repository:`${qe}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${qe}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${qe}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${qe}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const Tr="BoldingBuilds/Abliterated-MiMo-V2.6-Distill-Qwen-9B-GGUF",Fr="036d46331b5ef633654ff516e739\
73e81c8eca79",tn="mimo-v2.6-distill-qwen-9b-abliterated-q4-k-m-gguf",an=`https://huggingface.co/${Tr}/blob/${Fr}/README.\
md`,dt=[{path:"MiMo-V2.6-Distill-Qwen-9B-Abliterated-Q4_K_M.gguf",size:5629105280,sha256:"8798617e1da0b324a7d4c04659c59b\
b8f712dd5a7332b4703a5a2875d977ecf2"},{path:"README.md",size:7258,sha256:"ba41257ca6d1905daf030c7ef2aead2c6d60136a213c028\
c9b6991e8b74cdd7a",gitBlobSha1:"1b0eb905e11ce299d5402e7b75fece713a63682b"}];function xn(n){return n&&typeof n=="object"&&
!Object.isFrozen(n)&&(Object.values(n).forEach(xn),Object.freeze(n)),n}const ks=xn({[tn]:{id:tn,name:"MiMo V2.6 Distill \
Qwen 9B Abliterated (GGUF Q4_K_M, text)",repository:Tr,revision:Fr,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"user-reported",executionReason:"\
User-tested successfully in PeerCompute on 2026-11-10. Device details were not supplied; shader-f16, cross-origin isolat\
ion, shared WASM memory64/JSPI and memory admission are still required."},behavior:{kind:"abliterated",notice:"Publisher\
-described refusal-ablated MiMo distillation; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"\
MIT",sourceUrl:an,notice:"The publisher declares MIT in the included model card. Neither this conversion nor its linked \
parent supplies a separate LICENSE file at the checked revisions."},provenance:{repository:Tr,revision:Fr,format:"GGUF",
metadataCheckedAt:"2026-11-10",modelCardUrl:an,sourceModel:{repository:"XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B",revision:"\
1f09ddcc1a0ea45751ae0dfe2af20d533168c46f",revisionPurpose:"Pinned parent metadata reference; not a verified conversion i\
nput revision.",conversionInputRevisionVerified:!1},vision:"Text-only package. The publisher does not claim vision for t\
hese GGUF files; no projector is included.",publisherEvaluation:"The model card reports completed evaluations for Q8_0 o\
nly; Q4_K_M is listed as built but untested.",userReportedExecution:{checkedAt:"2026-11-10",application:"PeerCompute",result:"\
working",evidence:"User confirmed this exact Q4_K_M file works in PeerCompute; device and browser details were not suppl\
ied.",independentlyReproduced:!1}},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",
task:"text-generation",dtype:"q4_k_m",modalities:["text"],requiredFeatures:["shader-f16"],repository:Tr,revision:Fr},weightBytes:dt[0].
size,totalBytes:dt.reduce((n,l)=>n+l.size,0),files:dt}}),Cr="TrevorJS/gemma-4-12B-it-uncensored-GGUF",Ur="d878d412b001a7\
20b9a62eaac432d00aac9d1b4f",nn="gemma4-12b-uncensored-q4-k-m-gguf",Ss=`https://huggingface.co/${Cr}/blob/${Ur}/README.md`,
on="TrevorJS/gemma-4-12B-it-uncensored",sn="159eb7a8a04efb31ed43887e4732ff3edccff8ac",mt=[{path:"gemma-4-12B-it-uncensor\
ed-Q4_K_M.gguf",size:7381382208,sha256:"6f78e675eddd0f1ec8079ba4f66193880e14dfcb42002b6bd72c18ad7c365494"},{path:"README\
.md",size:1629,sha256:"aef2a4d7ace8ca9a1f8435ec6f713cd51db8e917e9477e2eba6446d2e7997a41",gitBlobSha1:"b0817c994d69e95961\
e18b9a380366eb9ed3d6ee"}];function Nn(n){return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Nn),
Object.freeze(n)),n}const In=Nn({[nn]:{id:nn,name:"Gemma 4 12B Uncensored (GGUF Q4_K_M, text)",repository:Cr,revision:Ur,
status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"user-reported",executionReason:"User reported successful PeerCompute text inference on 2026-11-10; this\
 exact package was observed hosted on the peer network. Independent local GPU qualification remains pending. Requires sh\
ader-f16, isolation, shared WASM memory64/JSPI and device memory admission."},behavior:{kind:"abliterated",notice:"Publi\
sher-described refusal-ablated Gemma 4; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apa\
che-2.0",sourceUrl:"https://ai.google.dev/gemma/apache_2",notice:"Google and both publisher cards declare Apache-2.0. Th\
e conversion card is included and the source card is linked; these checked repositories do not provide a separate LICENS\
E file."},provenance:{repository:Cr,revision:Ur,format:"GGUF",metadataCheckedAt:"2026-11-10",modelCardUrl:Ss,sourceModel:{
repository:on,revision:sn,modelCardUrl:`https://huggingface.co/${on}/blob/${sn}/README.md`,modelCardBytes:4929,modelCardSha256:"\
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
shader-f16"],repository:Cr,revision:Ur},weightBytes:mt[0].size,totalBytes:mt.reduce((n,l)=>n+l.size,0),files:mt}});function An(n){
return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(An),Object.freeze(n)),n}const _t=An({id:"ge\
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
vt=Object.freeze({path:"mmproj-gemma4-unified-f16.gguf",size:_t.size,sha256:_t.sha256}),hr=In["gemma4-12b-uncensored-q4-\
k-m-gguf"],cn="gemma4-12b-uncensored-q4-k-m-multimodal-gguf",un=[...hr.files,vt],dr=_t;function Tn(n){return n&&typeof n==
"object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Tn),Object.freeze(n)),n}const Bs=Tn({[cn]:{...hr,id:cn,name:"Ge\
mma 4 12B Uncensored (Q4_K_M, vision + audio)",files:un,description:"Image and audio understanding with text replies. Re\
uses saved Gemma Q4_K_M decoder files and adds a small verified companion. Unload the text-only Gemma before loading thi\
s package to avoid keeping two 12B models in GPU memory.",capabilities:{...hr.capabilities,executionStatus:"tested",executionReason:"\
Tested November 10, 2026 in hardware Chrome on an RTX 5060 Ti: text, changing images, speech transcription, retained rel\
oad and encrypted peer inference. Requires the pinned companion and normal device admission. Audio input produces text; \
speech synthesis uses a separate model."},model:{...hr.model,modalities:["text","image","audio"],ggufMedia:{profile:"gem\
ma4-unified-v1",projectorPath:vt.path}},provenance:{...hr.provenance,vision:"A separately derived Gemma4Unified companio\
n supplies image and raw-waveform audio projections from the pinned Trevor source. The decoder file is unchanged. Browse\
r execution remains unverified.",derivedArtifacts:[{path:vt.path,recipe:dr.id,sourceRepository:dr.source.repository,sourceRevision:dr.
source.revision,sourcePath:"model.safetensors",sourceFileSha256:dr.source.publisherSha256,sourceDigestVerification:"Publ\
isher whole-file digest; selected tensor ranges are independently pinned and verified by the recipe. The entire source c\
heckpoint is not downloaded.",converter:{repository:"ggml-org/llama.cpp",revision:dr.converterRevision,outputType:"f16"},
processor:{repository:"google/gemma-4-12B-it",revision:"43c9d014b231474fa7212dbb48a762566c2b255d",path:"processor_config\
.json",sha256:"6b938e76555b3e9946890770e1abcd442a4718f34041a58e8139dc8ad34545c9",notice:"Processor settings are sourced \
explicitly from Google because the Trevor source omits this file."}}],outputModalities:"Text only. Image/audio understan\
ding and transcription are distinct from image or speech generation."},totalBytes:un.reduce((n,l)=>n+l.size,0)}}),mr="ba\
rtowski/Qwen_Qwen3.5-0.8B-GGUF",pr="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",pt=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",
size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"\
499cb320f9f2f3963beee9d8b890046f825c6f5d"}],yt=Object.freeze({import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,
executionStatus:"candidate",executionReason:"Requires the managed llama.cpp WebGPU runtime, an isolated browser with sha\
der-f16, and explicit memory admission. Actual model execution must be verified on the selected device."});function Fn(n){
return n&&typeof n=="object"&&!Object.isFrozen(n)&&(Object.values(n).forEach(Fn),Object.freeze(n)),n}const Gs=Object.fromEntries(
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
LICENSE"}}]}].map(({architecture:n,...l})=>[l.id,Fn({...l,status:"execution-candidate",format:"GGUF",capabilities:yt,behavior:{
kind:"abliterated",notice:"Publisher-described reduction in refusals; not a guarantee of refusal-free output or factual \
accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${l.files[2].source.repository}/blob/${l.files[2].
source.revision}/LICENSE`,notice:"The inherited upstream Apache-2.0 license and model card are included."},provenance:{repository:l.
repository,revision:l.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${l.repository}\
/blob/${l.revision}/README.md`,behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:n,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:[
"text"],repository:l.repository,revision:l.revision},weightBytes:l.files[0].size,totalBytes:l.files.reduce((u,m)=>u+m.size,
0)})])),ln=Object.freeze({"qwen3.5-0.8b-q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, tex\
t)",repository:mr,revision:pr,status:"execution-candidate",format:"GGUF",capabilities:yt,license:{spdx:"Apache-2.0",sourceUrl:`\
https://huggingface.co/${mr}/blob/${pr}/README.md`,notice:"Preserve the upstream model card and immutable artifact prove\
nance."},provenance:{repository:mr,revision:pr,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggin\
gface.co/${mr}/blob/${pr}/README.md`},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"G\
GUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:mr,revision:pr},weightBytes:pt[0].size,totalBytes:pt.
reduce((n,l)=>n+l.size,0),files:pt},...Gs,...ws,...ks,...In,...Bs,...Es,...Object.fromEntries(Object.entries(vs).map(([n,
l])=>[n,{...l,status:"execution-candidate",capabilities:yt}]))}),xs="peercompute.model.composition.v1",wt=Object.freeze(
{adapters:4,scaleMagnitude:2,maximumBytes:Io}),Me=n=>new Error(`Invalid model composition: ${n}`),fn=(n,l)=>JSON.stringify(
n)===JSON.stringify(l);function Cn(n){return Eo.createV1(85,ko(18,mn(Go(n)))).toString()}function Ns(n,l){const u=br(n);
if(!u.model||u.model.composition!==void 0)throw Me("a model base without nested composition is required");const m=Cn(u);
if(l!==void 0&&xo(l).toString()!==m)throw Me("base manifest CID does not match canonical base bytes");return{base:u,cid:m}}
function Is(n,{remap:l=!1}={}){if(!Array.isArray(n)||!n.length||n.length>wt.adapters)throw Me("one to four adapters are \
required");const u=new Set,m=new Set;return n.map((p,g)=>{if(!p||Object.keys(p).some(T=>!["role","format","file","scale",
"source","profile"].includes(T))||typeof p.role!="string"||!/^[a-z][a-z0-9-]{0,31}$/.test(p.role)||typeof p.format!="str\
ing"||!/^[A-Za-z][A-Za-z0-9._-]{0,31}$/.test(p.format)||!Number.isFinite(p.scale)||Math.abs(p.scale)>wt.scaleMagnitude||
!p.profile||typeof p.profile!="object"||Array.isArray(p.profile)||!p.source||typeof p.source!="object"||Array.isArray(p.
source))throw Me("adapter descriptor or strength");const h=br({schema:No,files:[p.file]}).files[0];if(!h.sha256||!h.size)
throw Me("adapter requires a nonempty file with a pinned SHA-256");const N=`${h.sha256}:${h.size}`;if(u.has(h.cid)||m.has(
N))throw Me("duplicate adapter bytes");return u.add(h.cid),m.add(N),{role:p.role,format:p.format,scale:Object.is(p.scale,
-0)?0:p.scale,file:{...h,...l?{path:`adapters/${g+1}-${h.sha256.slice(0,16)}.${p.format.toLowerCase()}`}:{}},source:{...p.
source},profile:{...p.profile}}})}function As(n){var G;const l=br(n),u=(G=l.model)==null?void 0:G.composition;if(u===void 0)
return{manifest:l,baseManifest:l,baseManifestCid:Cn(l),adapters:[]};if(!u||u.schema!==xs||typeof u.baseManifestCid!="str\
ing"||Object.keys(u).some(v=>!["schema","baseManifestCid","baseManifest","adapters"].includes(v)))throw Me("unsupported \
composition schema");const{base:m,cid:p}=Ns(u.baseManifest,u.baseManifestCid),g=Is(u.adapters),{composition:h,...N}=l.model;
if(!fn(N,m.model))throw Me("composed model changed the base runtime identity");const T=br({...m,files:[...m.files,...g.map(
v=>v.file)]}).files;if(!fn(l.files,T))throw Me("composed file closure differs from exact base and adapters");const x=l.files.
reduce((v,F)=>v+F.size,0);if(!Number.isSafeInteger(x)||x>wt.maximumBytes)throw Me("combined package exceeds runtime byte\
 budget");return{manifest:l,baseManifest:m,baseManifestCid:p,adapters:g}}const Un="3.8.1",Et=2048,Je=1024**3;function Rn(n){
const l=As(n),u=Ts(l.baseManifest),m=l.adapters.length?kn(u.manifest.model,u.weights,l.adapters):[],p=l.manifest.files.reduce(
(g,h)=>g+h.size,0);if(!Number.isSafeInteger(p)||p>u.resourcePolicy.maxModelBytes)throw new Error("GGUF composed package \
exceeds its byte budget");return{...u,manifest:l.manifest,baseManifest:u.manifest,adapters:m,totalBytes:p}}function Ts(n){
const l=br(n),u=l.model,m=Qo(u),p=Object.values(ln).filter(F=>F.model.runtime==="llama.cpp"&&F.repository===(u==null?void 0:
u.repository)&&F.revision===(u==null?void 0:u.revision)&&F.model.architecture===(u==null?void 0:u.architecture)&&F.model.
task===(u==null?void 0:u.task)&&F.model.dtype===(u==null?void 0:u.dtype)&&JSON.stringify(F.model.ggufMedia??null)===JSON.
stringify((u==null?void 0:u.ggufMedia)??null)),g=p.length===1?p[0]:void 0;if(!g&&(u!=null&&u.gguf)&&!m){const F=yn(u,{files:l.
files});for(const B of Object.values(ln))if(!(B.repository!==u.repository||B.revision!==u.revision))for(const k of B.files.
filter(R=>R.path.endsWith(".gguf"))){const R=F.weights.find(P=>P.path===k.path);if(R&&(R.size!==k.size||R.sha256!==k.sha256))
throw new Error("GGUF weights do not match the pinned catalog digests")}return{...F,manifest:l}}if(!g||u.runtime!=="llam\
a.cpp"||u.runtimeVersion!==void 0&&u.runtimeVersion!==Un||g.model.runtimeVersion!==void 0&&u.runtimeVersion!==g.model.runtimeVersion||
u.dtype!==g.model.dtype||u.format!=="GGUF"||u.task!=="text-generation"||u.modalities!==void 0&&JSON.stringify(u.modalities)!==
JSON.stringify(g.model.modalities))throw new Error("GGUF model revision is not in the trusted runtime catalog");const h=l.
files.filter(F=>F.path.endsWith(".gguf")),N=g.files.filter(F=>F.path.endsWith(".gguf"));if(!h.length||h.length!==N.length||
h.some(F=>!N.some(B=>B.path===F.path&&B.size===F.size&&B.sha256===F.sha256)))throw new Error("GGUF weights do not match \
the pinned catalog digests");if(m&&(l.files.length!==g.files.length||g.files.some(F=>!l.files.some(B=>B.path===F.path&&B.
size===F.size&&B.sha256===F.sha256))))throw new Error("GGUF multimodal file closure differs from the pinned catalog");const T=m?
h.find(F=>F.path===u.ggufMedia.projectorPath):void 0,x=h.filter(F=>F!==T);if(m&&(!T||x.length!==1))throw new Error("GGUF\
 multimodal package requires its pinned projector and text weights");const G=l.files.reduce((F,B)=>F+B.size,0);if(!Number.
isSafeInteger(G)||G>16*Je)throw new Error("GGUF package exceeds its byte budget");const v=x.reduce((F,B)=>F+B.size,0)>4*
Je;return{manifest:l,weights:x,projector:T,mediaProfile:m,totalBytes:G,resourcePolicy:{maxModelBytes:16*Je,minimumCpuBytes:v?
8*Je:2*Je,minimumGpuBytes:v?16*Je:2*Je}}}function Fs(n,l=(u=>(u=globalThis.location)==null?void 0:u.href)()){const m=new URL(
l);if(!n||Object.keys(n).some(g=>g!=="wasm")||typeof n.wasm!="string")throw new Error("GGUF runtime needs one trusted WA\
SM asset");const p=new URL(n.wasm,m);if(p.origin!==m.origin||!["http:","https:"].includes(p.protocol)||p.username||p.password||
p.search||p.hash||!p.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fixed same-origin asset");return{
wasm:p.href}}function Cs(n={},l=null){if(!n||typeof n!="object"||Array.isArray(n)||Object.keys(n).some(m=>!["n_ctx","n_b\
atch","n_gpu_layers","n_threads"].includes(m)))throw new Error("Unknown GGUF runtime option");const u={n_ctx:Et,n_batch:l?
l.batchTokens:64,n_gpu_layers:99999,n_threads:1,...n};if(l&&u.n_batch===64&&(u.n_batch=l.batchTokens),!Number.isInteger(
u.n_ctx)||u.n_ctx<64||u.n_ctx>Et||!Number.isInteger(u.n_batch)||u.n_batch<1||u.n_batch>(l?l.batchTokens:128)||l&&(u.n_batch!==
l.batchTokens||u.n_ctx!==l.contextTokens)||!Number.isInteger(u.n_gpu_layers)||u.n_gpu_layers<1||u.n_gpu_layers>99999||u.
n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(u)}function Us(n,l){
const{mediaProfile:u}=Rn(l),m=kt(n.image),p=n.audio==null?null:St(n.audio.samples,n.audio.sampleRate);if((m||p)&&!u)throw new Error(
"This GGUF adapter currently accepts text only");const g=n.maxNewTokens??Or.maxNewTokens;if(!Number.isInteger(g)||g<1||g>
Or.maxNewTokens)throw new Error("GGUF output exceeds its token budget");const h=Bo(p&&n.messages==null&&n.prompt==null?{
prompt:"Transcribe this audio."}:n);if((m||p)&&!h.some(N=>N.role==="user"))throw new Error("GGUF media needs a current u\
ser message");return{messages:h,...m?{image:m}:{},...p?{audio:p}:{},maxNewTokens:g}}async function Rs({scope:n=globalThis,
gpu:l=(u=>(u=n.navigator)==null?void 0:u.gpu)()}={}){var g,h,N;if(!n.crossOriginIsolated||!n.SharedArrayBuffer)throw new Error(
"GGUF requires cross-origin isolation and SharedArrayBuffer");const m=n.WebAssembly;if(typeof(m==null?void 0:m.Suspending)!=
"function"||typeof(m==null?void 0:m.promising)!="function")throw new Error("GGUF requires WebAssembly JSPI");try{new m.Memory(
{initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAssembly memory64")}const p=await(l==
null?void 0:l.requestAdapter({powerPreference:"high-performance"}));if(!p||p.isFallbackAdapter||(g=p.info)!=null&&g.isFallbackAdapter)
throw new Error("GGUF requires a hardware WebGPU adapter");if(!p.features.has("shader-f16"))throw new Error("GGUF requir\
es hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:((h=p.info)==null?void 0:h.vendor)??"",architecture:((N=
p.info)==null?void 0:N.architecture)??"",isFallbackAdapter:!1,requiredFeatures:["shader-f16"]},sharedMemory:!0,memory64:!0,
jspi:!0}}const Rr=n=>new TextEncoder().encode(n).byteLength;function Os(n){if(!n.data_json||n.data_json==="null")return[];
if(typeof n.data_json!="string"||Rr(n.data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");let l;
try{l=JSON.parse(n.data_json)}catch{throw new Error("GGUF returned invalid result JSON")}const u=Array.isArray(l)?l:[l];
if(u.some(m=>!m||typeof m!="object"||Array.isArray(m)))throw new Error("GGUF returned invalid result data");return u}function js(n,l){
const u=n[0],m=(u==null?void 0:u.error)??u,p=(m==null?void 0:m.n_prompt_tokens)??(u==null?void 0:u.n_prompt_tokens),g=(m==
null?void 0:m.n_ctx)??(u==null?void 0:u.n_ctx);if((m==null?void 0:m.type)==="exceed_context_size_error"&&Number.isSafeInteger(
p)&&p>=g&&Number.isSafeInteger(g)&&g>0&&g<=l)return Object.assign(new Error("GGUF native prompt exceeds the model contex\
t"),{code:"ERR_GGUF_NATIVE_CONTEXT",inputTokens:p,contextTokens:g});const h=(m==null?void 0:m.type)==="invalid_request_e\
rror";return Object.assign(new Error(h?"GGUF rejected the inference request":"GGUF native inference failed"),{code:h?"ER\
R_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE_FAILURE"})}function Ms(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))
throw new Error("GGUF inference requires a ComputeManager-owned worker")}function dn(n){var l,u,m,p,g,h,N,T,x;return{sessionId:n.
sessionId,manifestCid:n.manifestCid,status:n.lost?"lost":n.status,runtime:"llama.cpp",runtimeVersion:Un,task:"text-gener\
ation",workerId:n.workerId,adapter:(l=n.capabilities)==null?void 0:l.adapter,runtimeAdapter:((u=n.engine)==null?void 0:u.
evidence.runtimeAdapter)??null,runtimeFeatures:((m=n.engine)==null?void 0:m.evidence.runtimeFeatures)??[],gpuDispatches:((p=
n.engine)==null?void 0:p.evidence.dispatches)??0,gpuSubmissions:((g=n.engine)==null?void 0:g.evidence.submissions)??0,gpuOffload:((h=
n.engine)==null?void 0:h.evidence.offload)??null,runtimeOptions:n.options,effectiveContextTokens:n.contextTokens??null,inputModalities:n.
inputModalities??["text"],loraAdapters:n.loraAdapters??[],nativeBuffers:((N=n.engine)==null?void 0:N.evidence.buffers)??
[],wasmMemoryBytes:((T=n.engine)==null?void 0:T.memoryBytes())??0,generatedRequests:n.generatedRequests,artifactReads:((x=
n.reader)==null?void 0:x.getStats())??null}}function Ds({loadEngine:n=rs,createReader:l=yo,checkCapabilities:u=Rs,assertWorker:m=Ms,
baseUrl:p=(g=>(g=globalThis.location)==null?void 0:g.href)()}={}){let h;async function N(x,G){var P,D,J,be,se;if(h)throw new Error(
"GGUF worker already has a resident model");const v=Rn(x.manifest),F=Fs(x.runtimeAssets,p),B=Cs(x.runtimeOptions,v.mediaProfile),
k=Ar(x.sessionId);oe(G.signal);const R={sessionId:k,manifestCid:x.manifestCid,workerId:G.workerId??null,manifest:v.manifest,
mediaProfile:v.mediaProfile,status:"loading",options:B,generatedRequests:0,residency:new AbortController,lost:!1};h=R;try{
if(R.capabilities=await u(),oe(G.signal),R.reader=l(x.artifactPort,{manifest:v.manifest,signal:R.residency.signal,maxReadBytes:bn,
maxReads:1}),await us(v.baseManifest.model,v.weights,R.reader,{signal:G.signal}),v.adapters.length&&(R.loraAdapters=await ms(
v.baseManifest.model,v.weights,v.adapters,R.reader,{signal:G.signal})),oe(G.signal),R.engine=await n({wasmUrl:F.wasm,weights:v.
weights,projector:v.projector,adapters:v.adapters,reader:R.reader,signal:G.signal,collectGpuEvidence:x.collectGpuEvidence===
!0,onProgress:ne=>{var we;return(we=G.emitProgress)==null?void 0:we.call(G,{...ne,sessionId:k})},onLost(){var ne;R.lost=
!0,(ne=R.active)==null||ne.abort("GPU device lost")}}),oe(G.signal),v.mediaProfile&&!R.engine.projectorFile)throw new Error(
"GGUF projector was not mounted");if(v.adapters.length&&((P=R.engine.adapterFiles)==null?void 0:P.length)!==v.adapters.length)
throw new Error("GGUF adapters were not mounted");const V=await R.engine.action("load",{_name:"load_req",model_paths:R.engine.
files.map(ne=>`models/${ne.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...B,n_ubatch:((D=v.mediaProfile)==null?void 0:
D.batchTokens)??Math.min(64,B.n_batch),n_parallel:1,kv_unified:!0,...v.mediaProfile?{mmproj_path:`models/${R.engine.projectorFile.
name}`,mmproj_offload:!0,image_min_tokens:v.mediaProfile.imageMinTokens,image_max_tokens:v.mediaProfile.imageMaxTokens}:
{},...v.adapters.length?{lora_paths:R.engine.adapterFiles.map(ne=>`models/${ne.name}`),lora_scales:v.adapters.map(ne=>ne.
scale)}:{},log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},G.signal);if(!V.success)throw new Error(
"GGUF native model load failed");if(!Number.isSafeInteger(V.n_ctx)||V.n_ctx<1||V.n_ctx>Et)throw new Error("GGUF native m\
odel returned an invalid context capacity");if(R.contextTokens=V.n_ctx,v.mediaProfile){if(V.has_image_input!==!0||V.has_audio_input!==
!0||V.n_batch!==v.mediaProfile.batchTokens||V.n_ubatch!==v.mediaProfile.batchTokens||typeof V.media_marker!="string"||!/^<[^\s<>]{1,126}>$/.
test(V.media_marker))throw new Error("GGUF native runtime did not confirm the required image/audio projector and batch p\
rofile");R.mediaMarker=V.media_marker,R.inputModalities=["text","image","audio"]}const me=R.engine.evidence.offload;if(!me||
me.gpuLayers<1||me.gpuLayers!==Math.min(B.n_gpu_layers,me.totalLayers))throw new Error("GGUF did not honor the explicitl\
y configured GPU layer offload");if(oe(G.signal),R.lost)throw new Error("GPU device lost during GGUF load");return R.status=
"ready",dn(R)}catch(V){throw R.engine&&((J=G.emitProgress)==null||J.call(G,{type:"model-load-memory",sessionId:k,wasmMemoryBytes:R.
engine.memoryBytes(),nativeBuffers:R.engine.evidence.buffers??[]})),R.lost=!0,R.status="lost",R.residency.abort(V),(be=R.
reader)==null||be.close(V),(se=R.engine)==null||se.close(),V}}async function T(x,G){var ne,we,ye;const v=h;if(!v||v.sessionId!==
Ar(x.sessionId)||v.lost)throw new Error("Model session lost or not loaded");if(v.status!=="ready")throw new Error("GGUF \
model session is busy");const F=Ar(x.requestId),B=Us(x,v.manifest),{messages:k,maxNewTokens:R}=B;oe(G.signal);const P=Jo(
B);oe(G.signal),Za(k,P,v.mediaMarker);const D=new AbortController,J=()=>{var ce;return D.abort((ce=G.signal)==null?void 0:
ce.reason)};(ne=G.signal)==null||ne.addEventListener("abort",J,{once:!0}),(we=G.signal)!=null&&we.aborted&&J(),v.active=
D,v.status="generating",v.requestId=F;const be=v.engine.evidence.dispatches,se=v.engine.evidence.submissions;let V=0;async function me(ce,_e){
var I,U,pe,ee,H,C,Ne,ve,Ie,_r,tr,vr;let f,le=!1,xe="",W=null,A=null,z="unknown",ie=0;try{oe(D.signal);const ue=Za(ce,P,v.
mediaMarker),Le=await v.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:ue.messages,
stream:!_e,max_tokens:_e?Mr:R,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:ue.files},
D.signal);if(!Le.success||!Number.isSafeInteger(Le.req_id)||Le.req_id<0)throw new Error("GGUF failed to start generation");
f=Le.req_id,oe(D.signal);for(let yr=0;yr<4096;yr+=1){oe(D.signal);const He=await v.engine.action("get_result",{_name:"gr\
es_req",req_id:f},D.signal);oe(D.signal);const wr=Os(He);if(!He.success||He.is_error)throw js(wr,v.contextTokens);for(const Be of wr){
const ar=((U=(I=Be.choices)==null?void 0:I[0])==null?void 0:U.finish_reason)??Be.finish_reason;ar!=null&&(z=["stop","len\
gth"].includes(ar)?ar:"unknown");const Ee=(pe=Be.choices)==null?void 0:pe[0],Qe=((ee=Ee==null?void 0:Ee.delta)==null?void 0:
ee.content)??((H=Ee==null?void 0:Ee.message)==null?void 0:H.content)??Be.content??"";if(typeof Qe!="string")throw new Error(
"Invalid GGUF text chunk");if(_e){const nr=((C=Ee==null?void 0:Ee.delta)==null?void 0:C.reasoning_content)??((Ne=Ee==null?
void 0:Ee.message)==null?void 0:Ne.reasoning_content)??"";if(typeof nr!="string")throw new Error("Invalid GGUF measureme\
nt result");if(ie+=Rr(Qe)+Rr(nr),ie>Or.maxOutputBytes)throw new Error("GGUF measurement exceeds its byte budget")}else{if(xe+=
Qe,Rr(xe)>Or.maxOutputBytes)throw new Error("GGUF output exceeds its byte budget");if(Qe&&((ve=G.emitProgress)==null?void 0:
ve.call(G,{type:"token",sessionId:v.sessionId,requestId:F,sequence:V++,text:Qe}))===!1)throw new Error("Token consumer r\
ejected output")}W=((Ie=Be.usage)==null?void 0:Ie.prompt_tokens)??((_r=Be.timings)==null?void 0:_r.prompt_n)??W,A=((tr=Be.
usage)==null?void 0:tr.completion_tokens)??((vr=Be.timings)==null?void 0:vr.predicted_n)??A}if(!He.has_more){le=!0;break}
await new Promise(Be=>setTimeout(Be,0))}if(!le)throw new Error("GGUF result polling exceeded its request budget");if(A!==
null&&(!Number.isSafeInteger(A)||A<0||A>(_e?Mr:R)))throw new Error("GGUF returned an over-budget token sequence");if(_e&&
(!Number.isSafeInteger(W)||W<0||A===null))throw new Error("GGUF context preflight did not return valid token usage");return{
text:xe,inputTokens:W,outputTokens:A,finishReason:z}}catch(ue){throw((ue==null?void 0:ue.name)==="RuntimeError"||/Model session lost|GPU device lost/.
test((ue==null?void 0:ue.message)??""))&&(v.lost=!0),ue}finally{if(f!==void 0&&!v.lost)try{le||await v.engine.action("ca\
ncel",{_name:"cncl_req",req_id:f}),await v.engine.settleGpu()}catch{throw v.lost=!0,new Error("Model session lost while \
settling GGUF inference")}}}try{const ce=await bs({messages:k,contextTokens:v.contextTokens,reservedOutputTokens:R,signal:D.
signal,async measure(f){try{const le=await me(f,!0);return{inputTokens:le.inputTokens,contextTokens:v.contextTokens,probeOutputTokens:le.
outputTokens}}catch(le){if(le.code!=="ERR_GGUF_NATIVE_CONTEXT")throw le;return{inputTokens:le.inputTokens,contextTokens:le.
contextTokens,probeOutputTokens:0}}},onMeasured:f=>{var le;return(le=G.emitProgress)==null?void 0:le.call(G,{type:"conte\
xt-budget",sessionId:v.sessionId,requestId:F,...f})}});oe(D.signal);const _e=await me(ce.messages,!1);if(oe(D.signal),v.
lost)throw new Error("GPU device lost; model session is unavailable");return v.generatedRequests+=1,{sessionId:v.sessionId,
requestId:F,..._e,contextTruncated:ce.contextTruncated,contextBudget:ce.contextBudget,workerId:v.workerId,gpuDispatches:v.
engine.evidence.dispatches-be,gpuSubmissions:v.engine.evidence.submissions-se,gpuOffload:v.engine.evidence.offload,artifactReads:v.
reader.getStats()}}catch(ce){throw(ce==null?void 0:ce.name)==="RuntimeError"?(v.lost=!0,new Error(`Model session lost: G\
GUF native trap: ${String(ce.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.test(ce.message??"")&&(v.lost=
!0),ce)}finally{(ye=G.signal)==null||ye.removeEventListener("abort",J),v.active=null,v.requestId=null,v.status=v.lost?"l\
ost":"ready"}}return async(x={},G={})=>{var F,B,k;if(m(),x.command==="load")return N(x,G);if(x.command==="generate")return T(
x,G);const v=Ar(x.sessionId);if(x.command==="status")return(h==null?void 0:h.sessionId)===v?dn(h):{sessionId:v,status:"a\
bsent"};if(!h||h.sessionId!==v)throw new Error("Model session lost or not loaded");if(x.command==="cancel")return h.requestId===
x.requestId&&((F=h.active)==null||F.abort(So())),{sessionId:v,cancellationRequested:!0};if(x.command==="unload"){if(h.status===
"generating")throw new Error("Cancel and await GGUF generation before unloading");return h.residency.abort("GGUF unload"),
(B=h.reader)==null||B.close(),(k=h.engine)==null||k.close(),h=null,{sessionId:v,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const zs=Ds(),Js=(n,l)=>zs(n,l);export{Ds as createGgufTaskRuntime,Js as handleModelTask};

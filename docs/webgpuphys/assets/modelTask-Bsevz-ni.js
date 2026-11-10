var qi=Object.defineProperty;var zi=(i,l,d)=>l in i?qi(i,l,{enumerable:!0,configurable:!0,writable:!0,value:d}):i[l]=d;var K=(i,l,d)=>zi(i,typeof l!="symbol"?l+"":l,d);import{c as Li}from"./GgufArtifactReader-C_-gweyf.js";import{normalizeModelMessages as Mi}from"./modelTask-D6FFhGwB.js";
import{t as me,v as Qi,l as Wi,M as kr,a as Er,b as Vi}from"./ArtifactReadBridge-BAWOcyZj.js";import{n as Hi}from"./ArtifactManifest-BZyREYLI.js";function $i(i,l){var Nn,In,Fn,An,Tn,Cn;const d=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};
var m=!!globalThis.window,v=!!globalThis.WorkerGlobalScope,_=((In=(Nn=globalThis.process)==null?void 0:Nn.versions)==null?
void 0:In.node)&&((Fn=globalThis.process)==null?void 0:Fn.type)!="renderer",g=v&&((An=self.name)==null?void 0:An.startsWith(
"em-pthread"));if(_){var G=require("worker_threads");global.Worker=G.Worker,v=!G.isMainThread,g=v&&G.workerData=="em-pth\
read"}var N="./this.program",E=(e,r)=>{throw r},x=(Cn=(Tn=globalThis.document)==null?void 0:Tn.currentScript)==null?void 0:
Cn.src;typeof __filename<"u"?x=__filename:v&&(x=self.location.href);var k="";function I(e){return i.locateFile?i.locateFile(
e,k):k+e}var B,F;if(_){var R=require("fs");k=__dirname+"/",F=e=>{e=M(e)?new URL(e):e;var r=R.readFileSync(e);return r},B=
async(e,r=!0)=>{e=M(e)?new URL(e):e;var t=R.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(N=process.
argv[1].replace(/\\/g,"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=i),E=(e,r)=>{throw process.exitCode=
e,r}}else if(m||v){try{k=new URL(".",x).href}catch{}_||(v&&(F=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType=
"arraybuffer",r.send(null),new Uint8Array(r.response)}),B=async e=>{if(M(e))return new Promise((t,n)=>{var o=new XMLHttpRequest;
o.open("GET",e,!0),o.responseType="arraybuffer",o.onload=()=>{if(o.status==200||o.status==0&&o.response){t(o.response);return}
n(o.status)},o.onerror=n,o.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();
throw new Error(r.status+" : "+r.url)})}var te=console.log.bind(console),V=console.error.bind(console);if(_){var ne=require("util"),
ae=e=>typeof e=="object"?ne.inspect(e):e;te=(...e)=>R.writeSync(1,e.map(ae).join(" ")+`
`),V=(...e)=>R.writeSync(2,e.map(ae).join(" ")+`
`)}var fe=te,X=V,be,ve,ie=!1,j;function D(e,r){e||he(r)}var M=e=>e.startsWith("file://");function u(){Ie.buffer!=Y.buffer&&
ze()}if(_&&g){var P=G.parentPort;P.on("message",e=>{var r;return(r=global.onmessage)==null?void 0:r.call(global,{data:e})}),
Object.assign(globalThis,{self:global,postMessage:e=>P.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({
cmd:"uncaughtException",error:e}),process.exit(1)})}var oe;if(g){var ue=!1;self.onunhandledrejection=r=>{throw r.reason||
r};async function e(r){try{var t=r.data,n=t.cmd;if(n==="load"){let o=[];self.onmessage=s=>o.push(s),oe=()=>{postMessage(
{cmd:"loaded"});for(let s of o)e(s);self.onmessage=e};for(const s of t.handlers)(!i[s]||i[s].proxy)&&(i[s]=(...c)=>{postMessage(
{cmd:"callHandler",handler:s,args:c})},s=="print"&&(fe=i[s]),s=="printErr"&&(X=i[s]));Ie=t.wasmMemory,ze(),ve=t.wasmModule,
st(),yr()}else if(n==="run"){ia(t.pthread_ptr),Xr(t.pthread_ptr,0,0,1,0,0),J.threadInitTLS(),zr(t.pthread_ptr),ue||(ue=!0);
try{await wt(t.start_routine,t.arg)}catch(o){if(o!="unwind")throw o}}else t.target==="setimmediate"||(n==="checkMailbox"?
ue&&br():n&&(X(`worker: received unknown command ${n}`),X(t)))}catch(o){throw bn(),o}}self.onmessage=e}var Y,se,_e,O,q,Ve,
Be,ce,A,Ye=!1;function ze(){var e=Ie.buffer;Y=new Int8Array(e),_e=new Int16Array(e),i.HEAPU8=se=new Uint8Array(e),O=new Int32Array(
e),q=new Uint32Array(e),Ve=new Float32Array(e),Be=new Float64Array(e),ce=new BigInt64Array(e),A=new BigUint64Array(e)}function lr(){
if(!g){if(i.wasmMemory)Ie=i.wasmMemory;else{var e=i.INITIAL_MEMORY||134217728;Ie=new WebAssembly.Memory({initial:BigInt(
e/65536),maximum:65536n,shared:!0,address:"i64"})}ze()}}function fr(){if(i.preRun)for(typeof i.preRun=="function"&&(i.preRun=
[i.preRun]);i.preRun.length;)mt(i.preRun.shift());ft(dt)}function we(){if(Ye=!0,g)return oe();!i.noFSInit&&!a.initialized&&
a.init(),Re.__wasm_call_ctors(),a.ignorePermissions=!1}function dr(){if(!g){if(i.postRun)for(typeof i.postRun=="function"&&
(i.postRun=[i.postRun]);i.postRun.length;)aa(i.postRun.shift());ft(_t)}}function he(e){var t;(t=i.onAbort)==null||t.call(
i,e),e="Aborted("+e+")",X(e),ie=!0,e+=". Build with -sASSERTIONS for more info.",Ye&&En();var r=new WebAssembly.RuntimeError(
e);throw r}var He;function Se(){return I("wllama.wasm")}function Ze(e){if(e==He&&be)return new Uint8Array(be);if(F)return F(
e);throw"both async and sync fetching of the wasm failed"}async function ke(e){if(!be)try{var r=await B(e);return new Uint8Array(
r)}catch{}return Ze(e)}async function Le(e,r){try{var t=await ke(e),n=await WebAssembly.instantiate(t,r);return n}catch(o){
X(`failed to asynchronously prepare wasm: ${o}`),he(o)}}async function mr(e,r,t){if(!e&&!M(r)&&!_)try{var n=fetch(r,{credentials:"\
same-origin"}),o=await WebAssembly.instantiateStreaming(n,t);return o}catch(s){X(`wasm streaming compile failed: ${s}`),
X("falling back to ArrayBuffer instantiation")}return Le(r,t)}function ot(){Oi(),Xe.__instrumented||(Xe.__instrumented=!0,
xe.instrumentWasmImports(Xe));var e={env:Xe,wasi_snapshot_preview1:Xe};return e}async function st(){function e(c,f){return Re=
c.exports,Re=xe.instrumentWasmExports(Re),Re=ji(Re),oa(Re._emscripten_tls_init),Ri(Re),ve=f,pr(),Re}gr();function r(c){return e(
c.instance,c.module)}var t=ot();if(i.instantiateWasm)return new Promise((c,f)=>{i.instantiateWasm(t,(h,S)=>{c(e(h,S))})});
if(g){var n=new WebAssembly.Instance(ve,ot());return e(n,ve)}He??(He=Se());var o=await mr(be,He,t),s=r(o);return s}class ct{constructor(r){
K(this,"name","ExitStatus");this.message=`Program terminated with exit(${r})`,this.status=r}}var ut=e=>{e.terminate(),e.
onmessage=r=>{}},lt=e=>{var r=J.pthreads[e];J.returnWorkerToPool(r)},ft=e=>{for(;e.length>0;)e.shift()(i)},dt=[],mt=e=>dt.
push(e),Me=0,er=null,pr=e=>{var t;if(Me--,(t=i.monitorRunDependencies)==null||t.call(i,Me),Me==0&&er){var r=er;er=null,r()}},
gr=e=>{var r;Me++,(r=i.monitorRunDependencies)==null||r.call(i,Me)},pt=e=>{var r=J.getNewWorker();if(!r)return 6;J.runningWorkers.
push(r),J.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,
pthread_ptr:e.pthread_ptr};return _&&r.unref(),r.postMessage(t,e.transferList),0},hr=0,Gr=()=>Ar||hr>0,Ge=()=>Bn(),Ne=e=>Sn(
e),Nr=e=>xn(e),pe=(e,r,t,...n)=>{for(var o=n.length*2,s=Ge(),c=Nr(o*8),f=c/8,h=0;h<n.length;h++){var S=n[h];typeof S=="b\
igint"?((u(),ce)[f+2*h]=1n,(u(),ce)[f+2*h+1]=S):((u(),ce)[f+2*h]=0n,(u(),Be)[f+2*h+1]=S)}var y=_n(e,r,o,c,t);return Ne(s),
y};function gt(e){var r;if(g)return pe(0,0,1,e);j=e,Gr()||(J.terminateAllThreads(),(r=i.onExit)==null||r.call(i,e),ie=!0),
E(e,new ct(e))}function ht(e){if(g)return pe(1,0,0,e);Ir(e)}var bt=(e,r)=>{if(j=e,g)throw ht(e),"unwind";gt(e)},Ir=bt,J={
unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){g||J.initMainThread()},initMainThread(){for(var e=i.
pthreadPoolSize;e--;)J.allocateUnusedWorker();mt(async()=>{var r=J.loadWasmModuleToAllWorkers();gr(),await r,pr()})},terminateAllThreads:()=>{
for(var e of J.runningWorkers)ut(e);for(var e of J.unusedWorkers)ut(e);J.unusedWorkers=[],J.runningWorkers=[],J.pthreads=
{}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete J.pthreads[r],J.unusedWorkers.push(e),J.runningWorkers.splice(J.runningWorkers.
indexOf(e),1),e.pthread_ptr=0,vn(r)},threadInitTLS(){J.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(
r=>{e.onmessage=s=>{var c=s.data,f=c.cmd;if(c.targetThread&&c.targetThread!=wr()){var h=J.pthreads[c.targetThread];h?h.postMessage(
c,c.transferList):X(`Internal error! Worker sent a message "${f}" to target pthread ${c.targetThread}, but that thread n\
o longer exists!`);return}f==="checkMailbox"?br():f==="spawnThread"?pt(c):f==="cleanupThread"?Te(()=>lt(c.thread)):f==="\
loaded"?(e.loaded=!0,_&&!e.pthread_ptr&&e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):f==="uncaughtExceptio\
n"?e.onerror(c.error):f==="callHandler"?i[c.handler](...c.args):f&&X(`worker sent an unknown command ${f}`)},e.onerror=s=>{
var c="worker sent an error!";throw X(`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},_&&(e.on("message",s=>e.onmessage(
{data:s})),e.on("error",s=>e.onerror(s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var o of n)i.propertyIsEnumerable(
o)&&t.push(o);e.postMessage({cmd:"load",handlers:t,wasmMemory:Ie,wasmModule:ve})}),async loadWasmModuleToAllWorkers(){return g?
void 0:Promise.all(J.unusedWorkers.map(J.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=x;i.mainScriptUrlOrBlob&&
(r=i.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new d(r,{workerData:"em-pthread",name:"em-pth\
read"}),J.unusedWorkers.push(e)},getNewWorker(){return J.unusedWorkers.length==0&&(J.allocateUnusedWorker(),J.loadWasmModuleToWorker(
J.unusedWorkers[0])),J.unusedWorkers.pop()}},_t=[],aa=e=>_t.push(e);function ia(e){var r=Number((u(),A)[(e+88)/8]),t=Number(
(u(),A)[(e+96)/8]),n=r-t;kn(r,n),Ne(r)}var Fr=[],vt=e=>{e=Number(e);var r=Fr[e];return r||(Fr[e]=r=Gn.get(BigInt(e)),xe.
isAsyncExport(r)&&(Fr[e]=r=xe.makeAsyncFunction(r))),r},wt=async(e,r)=>{hr=0,Ar=0;var t=(o=>WebAssembly.promising(vt(e)).
call(null,BigInt(o)))(r);function n(o){if(Gr()){j=o;return}Yr(o)}t=await t,n(t)};wt.isAsync=!0;var Ar=!0,oa=e=>J.tlsInitFunctions.
push(e),Ie;function yt(e,r,t,n){return g?pe(2,0,1,e,r,t,n):Et(e,r,t,n)}var sa=()=>!!globalThis.SharedArrayBuffer,ca=9007199254740992,
ua=-9007199254740992,w=e=>e<ua||e>ca?NaN:Number(e);function Et(e,r,t,n){if(e=w(e),r=w(r),t=w(t),n=w(n),!sa())return 6;var o=[],
s=0;if(g&&(o.length===0||s))return yt(e,r,t,n);var c={startRoutine:t,pthread_ptr:e,arg:n,transferList:o};return g?(c.cmd=
"spawnThread",postMessage(c,o),0):pt(c)}var $e=()=>{var e=Number((u(),A)[ee.varargs/8]);return ee.varargs+=8,e},Tr=()=>{
var e=(u(),O)[+ee.varargs/4];return ee.varargs+=4,e},Z={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var o=e[n];o==="."?e.splice(n,1):o===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=Z.isAbs(e),
t=e.slice(-1)==="/";return e=Z.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=Z.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>Z.normalize(e.join("/")),join2:(e,r)=>Z.normalize(e+"/"+r)},la=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),Cr=e=>{(Cr=la())(e)},Je={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var o=n>=0?e[n]:a.cwd();if(typeof o!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!o)return"";r=o+"/"+r,t=Z.isAbs(o)}return r=Z.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=Je.resolve(e).slice(1),r=Je.resolve(r).slice(1);function t(S){for(var y=0;y<S.length&&S[y]==="";y++)
;for(var T=S.length-1;T>=0&&S[T]==="";T--);return y>T?[]:S.slice(y,T-y+1)}for(var n=t(e.split("/")),o=t(r.split("/")),s=Math.
min(n.length,o.length),c=s,f=0;f<s;f++)if(n[f]!==o[f]){c=f;break}for(var h=[],f=c;f<n.length;f++)h.push("..");return h=h.
concat(o.slice(c)),h.join("/")}},kt=globalThis.TextDecoder&&new TextDecoder,fa=(e,r,t,n)=>{for(var o=r+t;e[r]&&!(r>=o);)
++r;return r},Pe=(e,r=0,t,n)=>{var o=fa(e,r,t);if(o-r>16&&e.buffer&&kt)return kt.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,o):e.slice(r,o));for(var s="";r<o;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}var f=e[r++]&
63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|f);continue}var h=e[r++]&63;if((c&240)==224?c=(c&15)<<12|f<<6|h:c=(c&
7)<<18|f<<12|h<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var S=c-65536;s+=String.fromCharCode(55296|S>>10,56320|
S&1023)}}return s},Ur=[],Fe=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},St=(e,r,t,n)=>{if(!(n>0))return 0;for(var o=t,s=t+n-1,c=0;c<e.length;++c){var f=e.codePointAt(
c);if(f<=127){if(t>=s)break;r[t++]=f}else if(f<=2047){if(t+1>=s)break;r[t++]=192|f>>6,r[t++]=128|f&63}else if(f<=65535){
if(t+2>=s)break;r[t++]=224|f>>12,r[t++]=128|f>>6&63,r[t++]=128|f&63}else{if(t+3>=s)break;r[t++]=240|f>>18,r[t++]=128|f>>
12&63,r[t++]=128|f>>6&63,r[t++]=128|f&63,c++}}return r[t]=0,t-o},Rr=(e,r,t)=>{var n=Fe(e)+1,o=new Array(n),s=St(e,o,0,o.
length);return o.length=s,o},da=()=>{var s;if(!Ur.length){var e=null;if(_){var r=256,t=Buffer.alloc(r),n=0,o=process.stdin.
fd;try{n=R.readSync(o,t,0,r)}catch(c){if(c.toString().includes("EOF"))n=0;else throw c}n>0&&(e=t.slice(0,n).toString("ut\
f-8"))}else(s=globalThis.window)!=null&&s.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;Ur=Rr(e)}return Ur.shift()},Qe={ttys:[],init(){},shutdown(){},register(e,r){Qe.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Qe.stream_ops)},stream_ops:{open(e){var r=Qe.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,o){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,c=0;c<n;c++){var f;try{f=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(f===void 0&&s===0)throw new a.ErrnoError(6);if(f==null)break;s++,r[t+c]=f}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,o){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return da()},put_char(e,r){r===null||r===10?(fe(Pe(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){var r;((r=e.
output)==null?void 0:r.length)>0&&(fe(Pe(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,
c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},
ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(X(Pe(e.output)),e.output=[]):r!=0&&
e.output.push(r)},fsync(e){var r;((r=e.output)==null?void 0:r.length)>0&&(X(Pe(e.output)),e.output=[])}}},ma=(e,r)=>(u(),
se).fill(0,e,e+r),xt=(e,r)=>Math.ceil(e/r)*r,Or=e=>{e=xt(e,65536);var r=hn(65536,e);return r&&ma(r,e),r},L={ops_table:null,
mount(e){return L.createNode(null,"/",16895,0)},createNode(e,r,t,n){if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(
63);L.ops_table||(L.ops_table={dir:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr,lookup:L.node_ops.lookup,
mknod:L.node_ops.mknod,rename:L.node_ops.rename,unlink:L.node_ops.unlink,rmdir:L.node_ops.rmdir,readdir:L.node_ops.readdir,
symlink:L.node_ops.symlink},stream:{llseek:L.stream_ops.llseek}},file:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.
setattr},stream:{llseek:L.stream_ops.llseek,read:L.stream_ops.read,write:L.stream_ops.write,mmap:L.stream_ops.mmap,msync:L.
stream_ops.msync}},link:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr,readlink:L.node_ops.readlink},stream:{}},
chrdev:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr},stream:a.chrdev_stream_ops}});var o=a.createNode(e,
r,t,n);return a.isDir(o.mode)?(o.node_ops=L.ops_table.dir.node,o.stream_ops=L.ops_table.dir.stream,o.contents={}):a.isFile(
o.mode)?(o.node_ops=L.ops_table.file.node,o.stream_ops=L.ops_table.file.stream,o.usedBytes=0,o.contents=null):a.isLink(o.
mode)?(o.node_ops=L.ops_table.link.node,o.stream_ops=L.ops_table.link.stream):a.isChrdev(o.mode)&&(o.node_ops=L.ops_table.
chrdev.node,o.stream_ops=L.ops_table.chrdev.stream),o.atime=o.mtime=o.ctime=Date.now(),e&&(e.contents[r]=o,e.atime=e.mtime=
e.ctime=o.atime),o},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):
new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=r)){var n=1024*
1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var o=e.contents;e.contents=new Uint8Array(r),e.usedBytes>
0&&e.contents.set(o.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=null,e.usedBytes=
0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),e.usedBytes=
r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,r.uid=0,r.gid=
0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.link.length:r.
size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=Math.ceil(r.
size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==void 0&&
L.resizeFileStorage(e,r.size)},lookup(e,r){throw L.doesNotExistError||(L.doesNotExistError=new a.ErrnoError(44),L.doesNotExistError.
stack="<generic error, no stack>"),L.doesNotExistError},mknod(e,r,t,n){return L.createNode(e,r,t,n)},rename(e,r,t){var n;
try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var o in n.contents)throw new a.ErrnoError(55);a.hashRemoveNode(
n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,r){
delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.contents)throw new a.
ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.keys(e.contents)]},
symlink(e,r,t){var n=L.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.ErrnoError(
28);return e.link}},stream_ops:{read(e,r,t,n,o){var s=e.node.contents;if(o>=e.node.usedBytes)return 0;var c=Math.min(e.node.
usedBytes-o,n);if(c>8&&s.subarray)r.set(s.subarray(o,o+c),t);else for(var f=0;f<c;f++)r[t+f]=s[o+f];return c},write(e,r,t,n,o,s){
if(r.buffer===(u(),Y).buffer&&(s=!1),!n)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&(!c.contents||c.
contents.subarray)){if(s)return c.contents=r.subarray(t,t+n),c.usedBytes=n,n;if(c.usedBytes===0&&o===0)return c.contents=
r.slice(t,t+n),c.usedBytes=n,n;if(o+n<=c.usedBytes)return c.contents.set(r.subarray(t,t+n),o),n}if(L.expandFileStorage(c,
o+n),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+n),o);else for(var f=0;f<n;f++)c.contents[o+f]=r[t+f];
return c.usedBytes=Math.max(c.usedBytes,o+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,o){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,c,f=e.node.contents;if(!(o&2)&&f&&f.buffer===(u(),Y).buffer)c=!1,s=f.byteOffset;else{if(c=!0,s=Or(r),!s)throw new a.
ErrnoError(48);f&&((t>0||t+r<f.length)&&(f.subarray?f=f.subarray(t,t+r):f=Array.prototype.slice.call(f,t,t+r)),(u(),Y).set(
f,s))}return{ptr:s,allocated:c}},msync(e,r,t,n,o){return L.stream_ops.write(e,r,0,n,t,!1),0}}},pa=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},jr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},ga=async e=>{var r=await B(e);return new Uint8Array(r)},Bt=(...e)=>a.createDataFile(
...e),Gt=[],ha=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of Gt)if(t.canHandle(r))return t.handle(e,r);return e},
Dr=async(e,r,t,n,o,s,c,f)=>{var h=r?Je.resolve(Z.join2(e,r)):e;gr();try{var S=t;typeof t=="string"&&(S=await ga(t)),S=await ha(
S,h),f==null||f(),s||Bt(e,r,S,n,o,c)}finally{pr()}},ba=(e,r,t,n,o,s,c,f,h,S)=>{Dr(e,r,t,n,o,f,h,S).then(s).catch(c)},a={
root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,
filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{constructor(e){K(this,"name","ErrnoError");this.errno=e}},
FSStream:class{constructor(){K(this,"shared",{})}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.
flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.
shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=
e}},FSNode:class{constructor(e,r,t,n){K(this,"node_ops",{});K(this,"stream_ops",{});K(this,"readMode",365);K(this,"write\
Mode",146);K(this,"mounted",null);e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=
t,this.rdev=n,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){
e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){
e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.
isChrdev(this.mode)}},lookupPath(e,r={}){if(!e)throw new a.ErrnoError(44);r.follow_mount??(r.follow_mount=!0),Z.isAbs(e)||
(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split("/").filter(S=>!!S),o=a.root,s="/",c=0;c<n.length;c++){var f=c===
n.length-1;if(f&&r.parent)break;if(n[c]!=="."){if(n[c]===".."){if(s=Z.dirname(s),a.isRoot(o)){e=s+"/"+n.slice(c+1).join(
"/"),t--;continue e}else o=o.parent;continue}s=Z.join2(s,n[c]);try{o=a.lookupNode(o,n[c])}catch(S){if((S==null?void 0:S.
errno)===44&&f&&r.noent_okay)return{path:s};throw S}if(a.isMountpoint(o)&&(!f||r.follow_mount)&&(o=o.mounted.root),a.isLink(
o.mode)&&(!f||r.follow)){if(!o.node_ops.readlink)throw new a.ErrnoError(52);var h=o.node_ops.readlink(o);Z.isAbs(h)||(h=
Z.dirname(s)+"/"+h),e=h+"/"+n.slice(c+1).join("/");continue e}}}return{path:s,node:o}}throw new a.ErrnoError(32)},getPath(e){
for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:
e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.
length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){
var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=e.name_next;else for(var t=a.nameTable[r];t;){
if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){var t=a.mayLookup(e);if(t)throw new a.
ErrnoError(t);for(var n=a.hashName(e.id,r),o=a.nameTable[n];o;o=o.name_next){var s=o.name;if(o.parent.id===e.id&&s===r)return o}
return a.lookup(e,r)},createNode(e,r,t,n){var o=new a.FSNode(e,r,t,n);return a.hashAddNode(o),o},destroyNode(e){a.hashRemoveNode(
e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&
61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},
isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var r=["r","w","rw"][e&
3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?0:r.includes("r")&&!(e.mode&292)||r.includes(
"w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.isDir(e.mode))return 54;var r=a.nodePermissions(
e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))return 54;try{var t=a.lookupNode(e,r);return 20}catch{}
return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.lookupNode(e,r)}catch(s){return s.errno}var o=a.nodePermissions(
e,"wx");if(o)return o;if(t){if(!a.isDir(n.mode))return 54;if(a.isRoot(n)||a.getPath(n)===a.cwd())return 10}else if(a.isDir(
n.mode))return 31;return 0},mayOpen(e,r){return e?a.isLink(e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(r)!=="\
r"||r&576)?31:a.nodePermissions(e,a.flagsToPermissionString(r)):44},checkOpExists(e,r){if(!e)throw new a.ErrnoError(r);return e},
MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){
var r=a.getStream(e);if(!r)throw new a.ErrnoError(8);return r},getStream:e=>a.streams[e],createStream(e,r=-1){return e=Object.
assign(new a.FSStream,e),r==-1&&(r=a.nextfd()),e.fd=r,a.streams[r]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,r=-1){
var n,o;var t=a.createStream(e,r);return(o=(n=t.stream_ops)==null?void 0:n.dup)==null||o.call(n,t),t},doSetAttr(e,r,t){var n=e==
null?void 0:e.stream_ops.setattr,o=n?e:r;n??(n=r.node_ops.setattr),a.checkOpExists(n,63),n(o,t)},chrdev_stream_ops:{open(e){
var t,n;var r=a.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,(n=(t=e.stream_ops).open)==null||n.call(t,e)},llseek(){
throw new a.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){a.devices[e]={stream_ops:r}},
getDevice:e=>a.devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var n=t.pop();r.push(n),t.push(...n.mounts)}return r},
syncfs(e,r){typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&X(`warning: ${a.syncFSRequests} FS.s\
yncfs operations in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function o(f){return a.
syncFSRequests--,r(f)}function s(f){if(f)return s.errored?void 0:(s.errored=!0,o(f));++n>=t.length&&o(null)}for(var c of t)
c.type.syncfs?c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var n=t==="/",o=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&
!o){var c=a.lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(
s.mode))throw new a.ErrnoError(54)}var f={type:e,opts:r,mountpoint:t,mounts:[]},h=e.mount(f);return h.mount=f,f.root=h,n?
a.root=h:s&&(s.mounted=f,s.mount&&s.mount.mounts.push(f)),h},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(
r.node))throw new a.ErrnoError(28);var t=r.node,n=t.mounted,o=a.getMounts(n);for(var[s,c]of Object.entries(a.nameTable))
for(;c;){var f=c.name_next;o.includes(c.mount)&&a.destroyNode(c),c=f}t.mounted=null;var h=t.mount.mounts.indexOf(n);t.mount.
mounts.splice(h,1)},lookup(e,r){return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),o=n.node,s=Z.
basename(e);if(!s)throw new a.ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var c=a.mayCreate(o,s);if(c)
throw new a.ErrnoError(c);if(!o.node_ops.mknod)throw new a.ErrnoError(63);return o.node_ops.mknod(o,s,r,t)},statfs(e){return a.
statfsNode(a.lookupPath(e,{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,
frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.
node_ops.statfs&&Object.assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(
e,r,0)},mkdir(e,r=511){return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var o of t)if(o){
(n||Z.isAbs(e))&&(n+="/"),n+=o;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=
r,r=438),r|=8192,a.mknod(e,r,t)},symlink(e,r){if(!Je.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),
n=t.node;if(!n)throw new a.ErrnoError(44);var o=Z.basename(r),s=a.mayCreate(n,o);if(s)throw new a.ErrnoError(s);if(!n.node_ops.
symlink)throw new a.ErrnoError(63);return n.node_ops.symlink(n,o,e)},rename(e,r){var t=Z.dirname(e),n=Z.dirname(r),o=Z.basename(
e),s=Z.basename(r),c,f,h;if(c=a.lookupPath(e,{parent:!0}),f=c.node,c=a.lookupPath(r,{parent:!0}),h=c.node,!f||!h)throw new a.
ErrnoError(44);if(f.mount!==h.mount)throw new a.ErrnoError(75);var S=a.lookupNode(f,o),y=Je.relative(e,n);if(y.charAt(0)!==
".")throw new a.ErrnoError(28);if(y=Je.relative(r,t),y.charAt(0)!==".")throw new a.ErrnoError(55);var T;try{T=a.lookupNode(
h,s)}catch{}if(S!==T){var U=a.isDir(S.mode),C=a.mayDelete(f,o,U);if(C)throw new a.ErrnoError(C);if(C=T?a.mayDelete(h,s,U):
a.mayCreate(h,s),C)throw new a.ErrnoError(C);if(!f.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(S)||T&&a.
isMountpoint(T))throw new a.ErrnoError(10);if(h!==f&&(C=a.nodePermissions(f,"w"),C))throw new a.ErrnoError(C);a.hashRemoveNode(
S);try{f.node_ops.rename(S,h,s),S.parent=h}catch(Q){throw Q}finally{a.hashAddNode(S)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=Z.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(s);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(o)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=Z.basename(e),o=a.lookupNode(t,n),s=a.mayDelete(t,n,!1);if(s)
throw new a.ErrnoError(s);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(o))throw new a.ErrnoError(10);
t.node_ops.unlink(t,n),a.destroyNode(o)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)throw new a.ErrnoError(44);if(!t.
node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.lookupPath(e,{follow:!r}),
n=t.node,o=a.checkOpExists(n.node_ops.getattr,63);return o(n)},fstat(e){var r=a.getStreamChecked(e),t=r.node,n=r.stream_ops.
getattr,o=n?r:t;return n??(n=t.node_ops.getattr),a.checkOpExists(n,63),n(o)},lstat(e){return a.stat(e,!0)},doChmod(e,r,t,n){
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
pa(r):r,r&64?t=t&4095|32768:t=0;var n,o;if(typeof e=="object")n=e;else{o=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=s.node,e=s.path}var c=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(o)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),c=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!c){var f=a.mayOpen(n,r);if(f)throw new a.ErrnoError(f)}r&512&&!c&&a.truncate(n,0),
r&=-131713;var h=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return h.stream_ops.open&&h.stream_ops.open(h),c&&a.chmod(n,t&511),i.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),h},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){
if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&
t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,o){if(n<
0||o<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(
8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.read)throw new a.ErrnoError(28);var s=typeof o<"u";
if(!s)o=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var c=e.stream_ops.read(e,r,t,n,o);return s||(e.position+=
c),c},write(e,r,t,n,o,s){if(n<0||o<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===
0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(
28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var c=typeof o<"u";if(!c)o=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var f=e.stream_ops.write(e,r,t,n,o,s);return c||(e.position+=f),f},mmap(e,r,t,n,o){if((n&2)!==0&&(o&2)===0&&(e.flags&
2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.
ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.mmap(e,r,t,n,o)},msync(e,r,t,n,o){return e.stream_ops.
msync?e.stream_ops.msync(e,r,t,n,o):0},ioctl(e,r,t){if(!e.stream_ops.ioctl)throw new a.ErrnoError(59);return e.stream_ops.
ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||"binary",r.encoding!=="utf8"&&r.encoding!=="bin\
ary"&&he(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),o=n.size,s=new Uint8Array(o);return a.
read(t,s,0,o,0),r.encoding==="utf8"&&(s=Pe(s)),a.close(t),s},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(Rr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
he("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,o,s,c,f)=>c,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Qe.register(a.makedev(5,0),Qe.default_tty_ops),Qe.register(a.makedev(6,0),Qe.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(Cr(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:L.stream_ops.llseek},r.node_ops={lookup(t,n){var o=+n,
s=a.getStreamChecked(o),c={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.path},id:o+1};return c.parent=
c,c},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(L,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:L}},init(e,r,t){a.initialized=!0,e??(e=i.stdin),r??(r=i.stdout),t??(t=i.stderr),a.createStandardStreams(e,r,t)},quit(){
a.initialized=!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:
null},analyzePath(e,r){try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,
path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=
!0,n.parentPath=t.path,n.parentObject=t.node,n.name=Z.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,
n.object=t.node,n.name=t.node.name,n.isRoot=t.path==="/"}catch(o){n.error=o.errno}return n},createPath(e,r,t,n){e=typeof e==
"string"?e:a.getPath(e);for(var o=r.split("/").reverse();o.length;){var s=o.pop();if(s){var c=Z.join2(e,s);try{a.mkdir(c)}catch(f){
if(f.errno!=20)throw f}e=c}}return c},createFile(e,r,t,n,o){var s=Z.join2(typeof e=="string"?e:a.getPath(e),r),c=jr(n,o);
return a.create(s,c)},createDataFile(e,r,t,n,o,s){var c=r;e&&(e=typeof e=="string"?e:a.getPath(e),c=r?Z.join2(e,r):e);var f=jr(
n,o),h=a.create(c,f);if(t){if(typeof t=="string"){for(var S=new Array(t.length),y=0,T=t.length;y<T;++y)S[y]=t.charCodeAt(
y);t=S}a.chmod(h,f|146);var U=a.open(h,577);a.write(U,t,0,t.length,0,s),a.close(U),a.chmod(h,f)}},createDevice(e,r,t,n){
var f;var o=Z.join2(typeof e=="string"?e:a.getPath(e),r),s=jr(!!t,!!n);(f=a.createDevice).major??(f.major=64);var c=a.makedev(
a.createDevice.major++,0);return a.registerDevice(c,{open(h){h.seekable=!1},close(h){var S;(S=n==null?void 0:n.buffer)!=
null&&S.length&&n(10)},read(h,S,y,T,U){for(var C=0,Q=0;Q<T;Q++){var z;try{z=t()}catch{throw new a.ErrnoError(29)}if(z===
void 0&&C===0)throw new a.ErrnoError(6);if(z==null)break;C++,S[y+Q]=z}return C&&(h.node.atime=Date.now()),C},write(h,S,y,T,U){
for(var C=0;C<T;C++)try{n(S[y+C])}catch{throw new a.ErrnoError(29)}return T&&(h.node.mtime=h.node.ctime=Date.now()),C}}),
a.mkdev(o,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)he(
"Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in we\
b workers. Use --embed-file or --preload-file in emcc on the main thread.");else try{e.contents=F(e.url)}catch{throw new a.
ErrnoError(29)}},createLazyFile(e,r,t,n,o){class s{constructor(){K(this,"lengthKnown",!1);K(this,"chunks",[])}get(U){if(!(U>
this.length-1||U<0)){var C=U%this.chunkSize,Q=U/this.chunkSize|0;return this.getter(Q)[C]}}setDataGetter(U){this.getter=
U}cacheLength(){var U=new XMLHttpRequest;U.open("HEAD",t,!1),U.send(null),U.status>=200&&U.status<300||U.status===304||he(
"Couldn't load "+t+". Status: "+U.status);var C=Number(U.getResponseHeader("Content-length")),Q,z=(Q=U.getResponseHeader(
"Accept-Ranges"))&&Q==="bytes",b=(Q=U.getResponseHeader("Content-Encoding"))&&Q==="gzip",H=1024*1024;z||(H=C);var $=(ge,ye)=>{
ge>ye&&he("invalid range ("+ge+", "+ye+") or no bytes requested!"),ye>C-1&&he("only "+C+" bytes available! programmer er\
ror!");var de=new XMLHttpRequest;return de.open("GET",t,!1),C!==H&&de.setRequestHeader("Range","bytes="+ge+"-"+ye),de.responseType=
"arraybuffer",de.overrideMimeType&&de.overrideMimeType("text/plain; charset=x-user-defined"),de.send(null),de.status>=200&&
de.status<300||de.status===304||he("Couldn't load "+t+". Status: "+de.status),de.response!==void 0?new Uint8Array(de.response||
[]):Rr(de.responseText||"")},re=this;re.setDataGetter(ge=>{var ye=ge*H,de=(ge+1)*H-1;return de=Math.min(de,C-1),typeof re.
chunks[ge]>"u"&&(re.chunks[ge]=$(ye,de)),typeof re.chunks[ge]>"u"&&he("doXHR failed!"),re.chunks[ge]}),(b||!C)&&(H=C=1,C=
this.getter(0).length,H=C,fe("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
C,this._chunkSize=H,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){v||he("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,f={isDevice:!1,
contents:c}}else var f={isDevice:!1,url:t};var h=a.createFile(e,r,f,n,o);f.contents?h.contents=f.contents:f.url&&(h.contents=
null,h.url=f.url),Object.defineProperties(h,{usedBytes:{get:function(){return this.contents.length}}});var S={};for(const[
T,U]of Object.entries(h.stream_ops))S[T]=(...C)=>(a.forceLoadFile(h),U(...C));function y(T,U,C,Q,z){var b=T.node.contents;
if(z>=b.length)return 0;var H=Math.min(b.length-z,Q);if(b.slice)for(var $=0;$<H;$++)U[C+$]=b[z+$];else for(var $=0;$<H;$++)
U[C+$]=b.get(z+$);return H}return S.read=(T,U,C,Q,z)=>(a.forceLoadFile(h),y(T,U,C,Q,z)),S.mmap=(T,U,C,Q,z)=>{a.forceLoadFile(
h);var b=Or(U);if(!b)throw new a.ErrnoError(48);return y(T,(u(),Y),b,U,C),{ptr:b,allocated:!0}},h.stream_ops=S,h}},rr=(e,r,t)=>e?
Pe((u(),se),e,r):"",ee={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(Z.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var o=ee.
getStreamFromFD(e);n=o.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(u(),
q)[e/4]=r.dev,(u(),q)[(e+4)/4]=r.mode,(u(),A)[(e+8)/8]=BigInt(r.nlink),(u(),q)[(e+16)/4]=r.uid,(u(),q)[(e+20)/4]=r.gid,(u(),
q)[(e+24)/4]=r.rdev,(u(),ce)[(e+32)/8]=BigInt(r.size),(u(),O)[(e+40)/4]=4096,(u(),O)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),o=r.ctime.getTime();return(u(),ce)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(u(),A)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(u(),ce)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(u(),A)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(u(),ce)[(e+80)/8]=BigInt(
Math.floor(o/1e3)),(u(),A)[(e+88)/8]=BigInt(o%1e3*1e3*1e3),(u(),ce)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(u(),q)[(e+
8)/4]=r.bsize,(u(),q)[(e+72)/4]=r.bsize,(u(),ce)[(e+16)/8]=BigInt(r.blocks),(u(),ce)[(e+24)/8]=BigInt(r.bfree),(u(),ce)[(e+
32)/8]=BigInt(r.bavail),(u(),ce)[(e+40)/8]=BigInt(r.files),(u(),ce)[(e+48)/8]=BigInt(r.ffree),(u(),q)[(e+56)/4]=r.fsid,(u(),
q)[(e+80)/4]=r.flags,(u(),q)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,o){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);
if(n&2)return 0;var s=(u(),se).slice(e,e+t);a.msync(r,s,o,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},
varargs:void 0,getStr(e){var r=rr(e);return r}};function Nt(e,r,t){if(g)return pe(3,0,1,e,r,t);t=w(t),ee.varargs=t;try{var n=ee.
getStreamFromFD(e);switch(r){case 0:{var o=Tr();if(o<0)return-28;for(;a.streams[o];)o++;var s;return s=a.dupStream(n,o),
s.fd}case 1:case 2:return 0;case 3:return n.flags;case 4:{var o=Tr();return n.flags|=o,0}case 5:{var o=$e(),c=0;return(u(),
_e)[(o+c)/2]=2,0}case 6:case 7:return 0}return-28}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}
function _a(e,r){if(g)return pe(4,0,1,e,r);r=w(r);try{return ee.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!==
"ErrnoError")throw t;return-t.errno}}var Ae=(e,r,t)=>St(e,(u(),se),r,t);function It(e,r){if(g)return pe(5,0,1,e,r);e=w(e),
r=w(r);try{if(r===0)return-28;var t=a.cwd(),n=Fe(t)+1;return r<n?-68:(Ae(t,e,r),n)}catch(o){if(typeof a>"u"||o.name!=="E\
rrnoError")throw o;return-o.errno}}function Ft(e,r,t){if(g)return pe(6,0,1,e,r,t);r=w(r),t=w(t);try{var n=ee.getStreamFromFD(
e);n.getdents||(n.getdents=a.readdir(n.path));for(var o=280,s=0,c=a.llseek(n,0,1),f=Math.floor(c/o),h=Math.min(n.getdents.
length,f+Math.floor(t/o)),S=f;S<h;S++){var y,T,U=n.getdents[S];if(U===".")y=n.node.id,T=4;else if(U===".."){var C=a.lookupPath(
n.path,{parent:!0});y=C.node.id,T=4}else{var Q;try{Q=a.lookupNode(n.node,U)}catch(z){if((z==null?void 0:z.errno)===28)continue;
throw z}y=Q.id,T=a.isChrdev(Q.mode)?2:a.isDir(Q.mode)?4:a.isLink(Q.mode)?10:8}(u(),ce)[(r+s)/8]=BigInt(y),(u(),ce)[(r+s+
8)/8]=BigInt((S+1)*o),(u(),_e)[(r+s+16)/2]=280,(u(),Y)[r+s+18]=T,Ae(U,r+s+19,256),s+=o}return a.llseek(n,S*o,0),s}catch(z){
if(typeof a>"u"||z.name!=="ErrnoError")throw z;return-z.errno}}function At(e,r,t){if(g)return pe(7,0,1,e,r,t);t=w(t),ee.
varargs=t;try{var n=ee.getStreamFromFD(e);switch(r){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.
ops.ioctl_tcgets){var o=n.tty.ops.ioctl_tcgets(n),s=$e();(u(),O)[s/4]=o.c_iflag||0,(u(),O)[(s+4)/4]=o.c_oflag||0,(u(),O)[(s+
8)/4]=o.c_cflag||0,(u(),O)[(s+12)/4]=o.c_lflag||0;for(var c=0;c<32;c++)(u(),Y)[s+c+17]=o.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:
return n.tty?0:-59;case 21506:case 21507:case 21508:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=$e(),f=(u(),
O)[s/4],h=(u(),O)[(s+4)/4],S=(u(),O)[(s+8)/4],y=(u(),O)[(s+12)/4],T=[],c=0;c<32;c++)T.push((u(),Y)[s+c+17]);return n.tty.
ops.ioctl_tcsets(n.tty,r,{c_iflag:f,c_oflag:h,c_cflag:S,c_lflag:y,c_cc:T})}return 0}case 21519:{if(!n.tty)return-59;var s=$e();
return(u(),O)[s/4]=0,0}case 21520:return n.tty?-28:-59;case 21537:case 21531:{var s=$e();return a.ioctl(n,r,s)}case 21523:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){var U=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=$e();(u(),_e)[s/2]=U[0],(u(),
_e)[(s+2)/2]=U[1]}return 0}case 21524:return n.tty?0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(C){if(typeof a>
"u"||C.name!=="ErrnoError")throw C;return-C.errno}}function va(e,r){if(g)return pe(8,0,1,e,r);e=w(e),r=w(r);try{return e=
ee.getStr(e),ee.writeStat(r,a.lstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function wa(e,r,t,n){
if(g)return pe(9,0,1,e,r,t,n);r=w(r),t=w(t);try{r=ee.getStr(r);var o=n&256,s=n&4096;return n=n&-6401,r=ee.calculateAt(e,
r,s),ee.writeStat(t,o?a.lstat(r):a.stat(r))}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Tt(e,r,t,n){
if(g)return pe(10,0,1,e,r,t,n);r=w(r),n=w(n),ee.varargs=n;try{r=ee.getStr(r),r=ee.calculateAt(e,r);var o=n?Tr():0;return a.
open(r,t,o).fd}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function Ct(e,r){if(g)return pe(11,
0,1,e,r);e=w(e),r=w(r);try{return e=ee.getStr(e),ee.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoErro\
r")throw t;return-t.errno}}var ya=()=>he("");function Ea(e){e=w(e),Xr(e,!v,1,!m,5242880,!1),J.threadInitTLS()}var qr=e=>{
if(e instanceof ct||e=="unwind")return j;E(1,e)},ka=()=>{if(!Gr())try{if(g){wr()&&Yr(j);return}Ir(j)}catch(e){qr(e)}},Te=e=>{
if(!ie)try{e(),ka()}catch(r){qr(r)}};function zr(e){if(e=w(e),Atomics.waitAsync){var r=Atomics.waitAsync((u(),O),e/4,e);
r.value.then(br);var t=e+228;Atomics.store((u(),O),t/4,1)}}var br=()=>Te(()=>{var e=wr();e&&(zr(e),wn())});function Sa(e,r){
if(e=w(e),r=w(r),e==r)setTimeout(br);else if(g)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=J.pthreads[e];
if(!t)return;t.postMessage({cmd:"checkMailbox"})}}var _r=[];function xa(e,r,t,n,o){t=w(t),o=w(o),n/=2,_r.length=n;for(var s=o/
8,c=0;c<n;c++)(u(),ce)[s+2*c]?_r[c]=(u(),ce)[s+2*c+1]:_r[c]=(u(),Be)[s+2*c+1];var f=Ui[e];J.currentProxiedOperationCallerThread=
t;var h=f(..._r);return J.currentProxiedOperationCallerThread=0,typeof h=="bigint"&&(h=w(h)),h}function Ba(e){e=w(e),g?postMessage(
{cmd:"cleanupThread",thread:e}):lt(e)}function Ga(e){e=w(e),_&&J.pthreads[e].ref()}var Na=e=>e%4===0&&(e%100!==0||e%400===
0),Ia=[0,31,60,91,121,152,182,213,244,274,305,335],Fa=[0,31,59,90,120,151,181,212,243,273,304,334],Aa=e=>{var r=Na(e.getFullYear()),
t=r?Ia:Fa,n=t[e.getMonth()]+e.getDate()-1;return n};function Ta(e,r){e=w(e),r=w(r);var t=new Date(e*1e3);(u(),O)[r/4]=t.
getSeconds(),(u(),O)[(r+4)/4]=t.getMinutes(),(u(),O)[(r+8)/4]=t.getHours(),(u(),O)[(r+12)/4]=t.getDate(),(u(),O)[(r+16)/
4]=t.getMonth(),(u(),O)[(r+20)/4]=t.getFullYear()-1900,(u(),O)[(r+24)/4]=t.getDay();var n=Aa(t)|0;(u(),O)[(r+28)/4]=n,(u(),
ce)[(r+40)/8]=BigInt(-(t.getTimezoneOffset()*60));var o=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=o.getTimezoneOffset(),f=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(u(),O)[(r+32)/4]=f}function Ut(e,r,t,n,o,s,c){
if(g)return pe(12,0,1,e,r,t,n,o,s,c);e=w(e),o=w(o),s=w(s),c=w(c);try{var f=ee.getStreamFromFD(n),h=a.mmap(f,e,o,r,t),S=h.
ptr;return(u(),O)[s/4]=h.allocated,(u(),A)[c/8]=BigInt(S),0}catch(y){if(typeof a>"u"||y.name!=="ErrnoError")throw y;return-y.
errno}}function Rt(e,r,t,n,o,s){if(g)return pe(13,0,1,e,r,t,n,o,s);e=w(e),r=w(r),s=w(s);try{var c=ee.getStreamFromFD(o);
t&2&&ee.doMsync(e,c,r,n,s)}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}var Ca=function(e,r,t,n){
e=w(e),r=w(r),t=w(t),n=w(n);var o=new Date().getFullYear(),s=new Date(o,0,1),c=new Date(o,6,1),f=s.getTimezoneOffset(),h=c.
getTimezoneOffset(),S=Math.max(f,h);(u(),A)[e/8]=BigInt(S*60),(u(),O)[r/4]=+(f!=h);var y=C=>{var Q=C>=0?"-":"+",z=Math.abs(
C),b=String(Math.floor(z/60)).padStart(2,"0"),H=String(z%60).padStart(2,"0");return`UTC${Q}${b}${H}`},T=y(f),U=y(h);h<f?
(Ae(T,t,17),Ae(U,n,17)):(Ae(T,n,17),Ae(U,t,17))},Ot=()=>performance.timeOrigin+performance.now(),jt=()=>Date.now(),Ua=e=>e>=
0&&e<=3;function Ra(e,r,t){if(t=w(t),!Ua(e))return 28;var n;e===0?n=jt():n=Ot();var o=Math.round(n*1e3*1e3);return(u(),ce)[t/
8]=BigInt(o),0}var Oa=()=>{},Ke=()=>{hr+=1},ja=()=>{throw Ke(),"unwind"},Da=()=>new Error().stack.toString(),qa=e=>{var r=Da(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),o=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",f="",h=0,S=0,y=o.exec(s);if((y==null?void 0:y.length)==5)c=y[1],f=y[2],h=y[3],S=y[4];else if(y=n.exec(s),(y==null?
void 0:y.length)>=4)c=y[1],f=y[2],h=y[3],S=y[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(f=f.substring(f.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${f}:${h}:${S})
`)}return r=r.replace(/\s+$/,""),r};function za(e,r,t){r=w(r);var n=qa(e);if(!r||t<=0)return Fe(n)+1;var o=Ae(n,r,t);return o+
1}var Dt=()=>4294967296,La=()=>BigInt(Dt()),Ma=()=>2,Qa=()=>_?require("os").cpus().length:navigator.hardwareConcurrency,
Wa=e=>{var r=Ie.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Ie.grow(BigInt(t)),ze(),1}catch{}};function Va(e){e=w(
e);var r=(u(),se).length;if(e<=r)return!1;var t=Dt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var o=r*(1+.2/n);o=Math.min(
o,e+100663296);var s=Math.min(t,xt(Math.max(e,o),65536)),c=Wa(s);if(c)return!0}return!1}var Ue=e=>{var r=Fe(e)+1,t=Nr(r);
return Ae(e,t,r),t},Ha=(e,r)=>{(u(),q)[e/4]=r;var t=(u(),q)[e/4];(u(),q)[(e+4)/4]=(r-t)/4294967296},$a=e=>{var r=Fe(e)+1,
t=Kt(r);return t&&Ae(e,t,r),t},je=e=>(u(),q)[e/4]+(u(),O)[(e+4)/4]*4294967296,p={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
p.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{p.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return p.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=ln(r);return p.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=Lr(r);return p.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Mr(r);return p.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{D(e.mapState==="unmapped");var t=fn(r);return p.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Qr(r);return p.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Wr(r);return p.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=Vr(r);return p.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Hr(r);return p.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var o;var t=$r(
r),n=dn(r,t);return p.Internals.jsObjectInsert(t,e.queue),p.Internals.jsObjectInsert(n,e),(o=i.peercomputeOnDevice)==null||
o.call(i,e),n},importJsExternalTexture:(e,r=0)=>{var t=Yt(r);return p.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{
var t=Zt(r);return p.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=en(r);return p.Internals.jsObjects[t]=
e,t},importJsQueue:(e,r=0)=>{var t=$r(r);return p.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=rn(r);
return p.Internals.jsObjects[t]=e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=tn(r);return p.Internals.jsObjects[t]=e,
t},importJsRenderPassEncoder:(e,r=0)=>{var t=nn(r);return p.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{
var t=an(r);return p.Internals.jsObjects[t]=e,t},importJsSampler:(e,r=0)=>{var t=on(r);return p.Internals.jsObjects[t]=e,
t},importJsShaderModule:(e,r=0)=>{var t=mn(r);return p.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=sn(r);
return p.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{var t=cn(r);return p.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{
var t=un(r);return p.Internals.jsObjects[t]=e,t},errorCallback:(e,r,t,n)=>{var o=Ge(),s=Ue(t);((c,f,h)=>vt(e).call(null,
c,BigInt(f),BigInt(h)))(r,BigInt(s),n),Ne(o)},iterateExtensions:(e,r)=>{for(var t=Number((u(),A)[e/8]);t;t=Number((u(),A)[t/
8])){var n=(u(),O)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{(u(),A)[e/8]=BigInt(r),(u(),A)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{
var r=Number((u(),A)[e/8]),t=Number((u(),A)[(e+8)/8]);return rr(r,t)},makeStringFromOptionalStringView:e=>{var r=Number(
(u(),A)[e/8]),t=Number((u(),A)[(e+8)/8]);return r?rr(r,t):t===0?"":void 0},makeColor:e=>({r:(u(),Be)[e/8],g:(u(),Be)[(e+
8)/8],b:(u(),Be)[(e+16)/8],a:(u(),Be)[(e+24)/8]}),makeExtent3D:e=>({width:(u(),q)[e/4],height:(u(),q)[(e+4)/4],depthOrArrayLayers:(u(),
q)[(e+8)/4]}),makeOrigin3D:e=>({x:(u(),q)[e/4],y:(u(),q)[(e+4)/4],z:(u(),q)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:p.
getJsObject(Number((u(),A)[e/8])),mipLevel:(u(),q)[(e+8)/4],origin:p.makeOrigin3D(e+12),aspect:p.TextureAspect[(u(),O)[(e+
24)/4]]}),makeTexelCopyBufferLayout:e=>{var r=(u(),q)[(e+8)/4],t=(u(),q)[(e+12)/4];return{offset:je(e),bytesPerRow:r===4294967295?
void 0:r,rowsPerImage:t===4294967295?void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=p.makeTexelCopyBufferLayout(r);return t.
buffer=p.getJsObject(Number((u(),A)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:p.getJsObject(Number(
(u(),A)[(e+8)/8])),beginningOfPassWriteIndex:(u(),q)[(e+16)/4],endOfPassWriteIndex:(u(),q)[(e+20)/4]}},makePipelineConstants:(e,r)=>{
if(e){for(var t={},n=0;n<e;++n){var o=r+32*n,s=p.makeStringFromStringView(o+8);t[s]=(u(),Be)[(o+24)/8]}return t}},makePipelineLayout:e=>e?
p.getJsObject(e):"auto",makeComputeState:e=>{if(e){var r={module:p.getJsObject(Number((u(),A)[(e+8)/8])),constants:p.makePipelineConstants(
Number((u(),A)[(e+32)/8]),Number((u(),A)[(e+40)/8])),entryPoint:p.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:p.makeStringFromOptionalStringView(e+8),layout:p.makePipelineLayout(Number((u(),A)[(e+24)/8])),compute:p.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(b){if(b)return{topology:p.PrimitiveTopology[(u(),O)[(b+8)/4]],stripIndexFormat:p.
IndexFormat[(u(),O)[(b+12)/4]],frontFace:p.FrontFace[(u(),O)[(b+16)/4]],cullMode:p.CullMode[(u(),O)[(b+20)/4]],unclippedDepth:!!(u(),
q)[(b+24)/4]}}function t(b){if(b)return{operation:p.BlendOperation[(u(),O)[b/4]],srcFactor:p.BlendFactor[(u(),O)[(b+4)/4]],
dstFactor:p.BlendFactor[(u(),O)[(b+8)/4]]}}function n(b){if(b)return{alpha:t(b+12),color:t(b+0)}}function o(b){var H=p.TextureFormat[(u(),
O)[(b+8)/4]];return H?{format:H,blend:n(Number((u(),A)[(b+16)/8])),writeMask:(u(),q)[(b+24)/4]}:void 0}function s(b,H){for(var $=[],
re=0;re<b;++re)$.push(o(H+32*re));return $}function c(b){return{compare:p.CompareFunction[(u(),O)[b/4]],failOp:p.StencilOperation[(u(),
O)[(b+4)/4]],depthFailOp:p.StencilOperation[(u(),O)[(b+8)/4]],passOp:p.StencilOperation[(u(),O)[(b+12)/4]]}}function f(b){
if(b)return{format:p.TextureFormat[(u(),O)[(b+8)/4]],depthWriteEnabled:!!(u(),q)[(b+12)/4],depthCompare:p.CompareFunction[(u(),
O)[(b+16)/4]],stencilFront:c(b+20),stencilBack:c(b+36),stencilReadMask:(u(),q)[(b+52)/4],stencilWriteMask:(u(),q)[(b+56)/
4],depthBias:(u(),O)[(b+60)/4],depthBiasSlopeScale:(u(),Ve)[(b+64)/4],depthBiasClamp:(u(),Ve)[(b+68)/4]}}function h(b){return{
format:p.VertexFormat[(u(),O)[(b+8)/4]],offset:je(b+16),shaderLocation:(u(),q)[(b+24)/4]}}function S(b,H){for(var $=[],re=0;re<
b;++re)$.push(h(H+re*32));return $}function y(b){if(b){var H=p.VertexStepMode[(u(),O)[(b+8)/4]],$=Number((u(),A)[(b+24)/
8]);return!H&&!$?null:{arrayStride:je(b+16),stepMode:H,attributes:S($,Number((u(),A)[(b+32)/8]))}}}function T(b,H){if(b){
for(var $=[],re=0;re<b;++re)$.push(y(H+re*40));return $}}function U(b){if(b){var H={module:p.getJsObject(Number((u(),A)[(b+
8)/8])),constants:p.makePipelineConstants(Number((u(),A)[(b+32)/8]),Number((u(),A)[(b+40)/8])),buffers:T(Number((u(),A)[(b+
48)/8]),Number((u(),A)[(b+56)/8])),entryPoint:p.makeStringFromOptionalStringView(b+16)};return H}}function C(b){if(b)return{
count:(u(),q)[(b+8)/4],mask:(u(),q)[(b+12)/4],alphaToCoverageEnabled:!!(u(),q)[(b+16)/4]}}function Q(b){if(b){var H={module:p.
getJsObject(Number((u(),A)[(b+8)/8])),constants:p.makePipelineConstants(Number((u(),A)[(b+32)/8]),Number((u(),A)[(b+40)/
8])),targets:s(Number((u(),A)[(b+48)/8]),Number((u(),A)[(b+56)/8])),entryPoint:p.makeStringFromOptionalStringView(b+16)};
return H}}var z={label:p.makeStringFromOptionalStringView(e+8),layout:p.makePipelineLayout(Number((u(),A)[(e+24)/8])),vertex:U(
e+32),primitive:r(e+96),depthStencil:f(Number((u(),A)[(e+128)/8])),multisample:C(e+136),fragment:Q(Number((u(),A)[(e+160)/
8]))};return z},fillLimitStruct:(e,r)=>{var t=Number((u(),A)[r/8]);function n(c,f,h,S=0){var y=e[c]??S;(u(),q)[(f+h)/4]=
y}function o(c,f,h,S=0){var y=e[c]??S;Ha(f+h,y)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("max\
TextureDimension3D",r,16),n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),
n("maxBindingsPerBindGroup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),n("maxSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPer\
ShaderStage",r,52),n("maxStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBuf\
ferOffsetAlignment",r,80),n("minStorageBufferOffsetAlignment",r,84),o("maxUniformBufferBindingSize",r,64),o("maxStorageB\
ufferBindingSize",r,72),n("maxVertexBuffers",r,88),o("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBu\
fferArrayStride",r,108),n("maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentByte\
sPerSample",r,120),n("maxComputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeW\
orkgroupSizeX",r,132),n("maxComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPer\
Dimension",r,144),n("maxImmediateSize",r,148),t!==0){(u(),O)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(u(),q)[(r+88)/4]=e.subgroupMinSize,(u(),q)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,n=$a(t),o=Fe(e.vendor);p.setStringView(r+8,n,o),n+=o;var s=Fe(e.architecture);p.setStringView(r+24,
n,s),n+=s;var c=Fe(e.device);p.setStringView(r+40,n,c),n+=c;var f=Fe(e.description);p.setStringView(r+56,n,f),n+=f,(u(),
O)[(r+72)/4]=2;var h=e.isFallbackAdapter?3:4;(u(),O)[(r+76)/4]=h,(u(),q)[(r+80)/4]=0,(u(),q)[(r+84)/4]=0},AddressMode:[,
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},Ja={undefined:1,unknown:1,destroyed:2},
De=()=>{hr-=1};function Pa(e,r,t,n,o,s){e=w(e),r=w(r),t=w(t),n=w(n),o=w(o),s=w(s);var c=p.getJsObject(e),f={};if(s){var h=Number(
(u(),A)[(s+24)/8]);if(h){var S=Number((u(),A)[(s+32)/8]);f.requiredFeatures=Array.from((u(),q).subarray(S/4,(S+h*4)/4),b=>p.
FeatureName[b])}var y=Number((u(),A)[(s+40)/8]);if(y){let b=function($,re,ge,ye=!1){var de=re+ge,ar=(u(),q)[de/4];ar!=4294967295&&
(!ye||ar!=0)&&(U[$]=ar)},H=function($,re,ge){var ye=re+ge,de=(u(),q)[ye/4],ar=(u(),q)[(ye+4)/4];(de!=4294967295||ar!=4294967295)&&
(U[$]=je(ye))};var T=Number((u(),A)[y/8]),U={};if(b("maxTextureDimension1D",y,8),b("maxTextureDimension2D",y,12),b("maxT\
extureDimension3D",y,16),b("maxTextureArrayLayers",y,20),b("maxBindGroups",y,24),b("maxBindGroupsPlusVertexBuffers",y,28),
b("maxBindingsPerBindGroup",y,32),b("maxDynamicUniformBuffersPerPipelineLayout",y,36),b("maxDynamicStorageBuffersPerPipe\
lineLayout",y,40),b("maxSampledTexturesPerShaderStage",y,44),b("maxSamplersPerShaderStage",y,48),b("maxStorageBuffersPer\
ShaderStage",y,52),b("maxStorageTexturesPerShaderStage",y,56),b("maxUniformBuffersPerShaderStage",y,60),b("minUniformBuf\
ferOffsetAlignment",y,80),b("minStorageBufferOffsetAlignment",y,84),H("maxUniformBufferBindingSize",y,64),H("maxStorageB\
ufferBindingSize",y,72),b("maxVertexBuffers",y,88),H("maxBufferSize",y,96),b("maxVertexAttributes",y,104),b("maxVertexBu\
fferArrayStride",y,108),b("maxInterStageShaderVariables",y,112),b("maxColorAttachments",y,116),b("maxColorAttachmentByte\
sPerSample",y,120),b("maxComputeWorkgroupStorageSize",y,124),b("maxComputeInvocationsPerWorkgroup",y,128),b("maxComputeW\
orkgroupSizeX",y,132),b("maxComputeWorkgroupSizeY",y,136),b("maxComputeWorkgroupSizeZ",y,140),b("maxComputeWorkgroupsPer\
Dimension",y,144),b("maxImmediateSize",y,148,!0),T!==0){(u(),O)[(T+8)/4];var C=T;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(b("maxStorageBuffersInVertexStage",C,16),b("maxStorageTexturesInVertexStage",C,20),b("maxStorageBuffersInFra\
gmentStage",C,24),b("maxStorageTexturesInFragmentStage",C,28))}f.requiredLimits=U}var Q=Number((u(),A)[(s+48)/8]);if(Q){
var z={label:p.makeStringFromOptionalStringView(Q+8)};f.defaultQueue=z}f.label=p.makeStringFromOptionalStringView(s+8)}Ke(),
p.Internals.futureInsert(r,c.requestDevice(f).then(b=>{De(),Te(()=>{var H;p.Internals.jsObjectInsert(o,b.queue),p.Internals.
jsObjectInsert(n,b),(H=i.peercomputeOnDevice)==null||H.call(i,b),n=BigInt(n),p.Internals.futureInsert(t,b.lost.then($=>{
Te(()=>{b.onuncapturederror=ye=>{};var re=Ge(),ge=Ue($.message);Jr(t,Ja[$.reason],BigInt(ge)),Ne(re)})})),b.onuncapturederror=
$=>{var re=5;$.error instanceof GPUValidationError?re=2:$.error instanceof GPUOutOfMemoryError?re=3:$.error instanceof GPUInternalError&&
(re=4);var ge=Ge(),ye=Ue($.error.message);gn(BigInt(n),re,BigInt(ye)),Ne(ge)},Kr(r,1,BigInt(n),0n)})},b=>{De(),Te(()=>{var H=Ge(),
$=Ue(b.message);Kr(r,3,BigInt(n),BigInt($)),t&&Jr(t,4,BigInt($)),Ne(H)})}))}function Ka(e){e=w(e);var r=p.getJsObject(e),
t=p.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete p.Internals.bufferOnUnmaps[e]}r.destroy()}
var Xa=function(e,r,t){e=w(e),r=w(r),t=w(t);var n=(()=>{var o=p.getJsObject(e);t==-1&&(t=void 0);var s;try{s=o.getMappedRange(
r,t)}catch{return 0n}var c=yn(16,s.byteLength);return(u(),se).set(new Uint8Array(s),c),p.Internals.bufferOnUnmaps[e].push(
()=>Xt(c)),c})();return BigInt(n)},Ya=function(e,r,t,n,o){e=w(e),r=w(r),t=w(t),n=w(n),o=w(o);var s=p.getJsObject(e);p.Internals.
bufferOnUnmaps[e]=[],o==-1&&(o=void 0),Ke(),p.Internals.futureInsert(r,s.mapAsync(t,n,o).then(()=>{De(),Te(()=>{Pr(r,1,0n)})},
c=>{De(),Te(()=>{var f=Ge(),h=Ue(c.message),S=c.name==="AbortError"?4:c.name==="OperationError"?3:0;Pr(r,S,BigInt(h)),delete p.
Internals.bufferOnUnmaps[e]})}))};function Za(e){e=w(e);var r=p.getJsObject(e),t=p.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete p.Internals.bufferOnUnmaps[e],r.unmap()}}function ei(e){e=w(e),delete p.Internals.jsObjects[e]}
function ri(e,r,t){e=w(e),r=w(r),t=w(t);var n=!!(u(),q)[(r+40)/4],o={label:p.makeStringFromOptionalStringView(r+8),usage:(u(),
q)[(r+24)/4],size:je(r+32),mappedAtCreation:n},s=p.getJsObject(e),c;try{c=s.createBuffer(o)}catch{return!1}return p.Internals.
jsObjectInsert(t,c),n&&(p.Internals.bufferOnUnmaps[t]=[]),!0}function ti(e,r,t){e=w(e),r=w(r),t=w(t);var n=Number((u(),A)[r/
8]),o=(u(),O)[(n+8)/4],s={label:p.makeStringFromOptionalStringView(r+8),code:""};switch(o){case 2:{s.code=p.makeStringFromStringView(
n+16);break}}var c=p.getJsObject(e);p.Internals.jsObjectInsert(t,c.createShaderModule(s))}var ni=e=>{const r=p.getJsObject(
e);r.onuncapturederror=null,r.destroy()};function ai(e,r,t,n){r=w(r),t=w(t),n=w(n);var o;if(t){o={featureLevel:p.FeatureLevel[(u(),
O)[(t+8)/4]],powerPreference:p.PowerPreference[(u(),O)[(t+12)/4]],forceFallbackAdapter:!!(u(),q)[(t+16)/4]};var s=Number(
(u(),A)[t/8]);if(s!==0){(u(),O)[(s+8)/4];var c=s;o.xrCompatible=!!(u(),q)[(c+16)/4]}}if(!("gpu"in navigator)){var f=Ge(),
h=Ue("WebGPU not available on this browser (navigator.gpu is not available)");nr(r,3,BigInt(n),BigInt(h)),Ne(f);return}Ke(),
p.Internals.futureInsert(r,navigator.gpu.requestAdapter(o).then(S=>{De(),Te(()=>{if(S)p.Internals.jsObjectInsert(n,S),nr(
r,1,BigInt(n),0n);else{var y=Ge(),T=Ue("WebGPU not available on this browser (requestAdapter returned null)");nr(r,3,BigInt(
n),BigInt(T)),Ne(y)}})},S=>{De(),Te(()=>{var y=Ge(),T=Ue(S.message);nr(r,4,BigInt(n),BigInt(T)),Ne(y)})}))}var ii=function(e,r){
e=w(e),r=w(r);var t=p.getJsObject(e);Ke(),p.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{De(),Te(()=>{pn(r,
1)})}))},qt=function(e,r,t){return e=w(e),r=w(r),t=w(t),xe.handleAsync(async()=>{var n=[];if(t){var o=(u(),O)[t/4];n.length=
r+1,n[r]=new Promise(h=>setTimeout(h,o,0))}else n.length=r;for(var s=0;s<r;++s){var c=je(e+s*8);if(!(c in p.Internals.futures))
return c;n[s]=p.Internals.futures[c]}const f=await Promise.race(n);return delete p.Internals.futures[f],f})};qt.isAsync=
!0;var vr={},oi=()=>N||"./this.program",tr=()=>{if(!tr.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:oi()};
for(var t in vr)vr[t]===void 0?delete r[t]:r[t]=vr[t];var n=[];for(var t in r)n.push(`${t}=${r[t]}`);tr.strings=n}return tr.
strings};function zt(e,r){if(g)return pe(14,0,1,e,r);e=w(e),r=w(r);var t=0,n=0;for(var o of tr()){var s=r+t;(u(),A)[(e+n)/
8]=BigInt(s),t+=Ae(o,s,1/0)+1,n+=8}return 0}function Lt(e,r){if(g)return pe(15,0,1,e,r);e=w(e),r=w(r);var t=tr();(u(),A)[e/
8]=BigInt(t.length);var n=0;for(var o of t)n+=Fe(o)+1;return(u(),A)[r/8]=BigInt(n),0}function Mt(e){if(g)return pe(16,0,
1,e);try{var r=ee.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var si=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){var c=Number((u(),A)[r/8]),f=Number((u(),A)[(r+8)/8]);r+=16;var h=a.read(
e,(u(),Y),c,f,n);if(h<0)return-1;if(o+=h,h<f)break}return o};function Qt(e,r,t,n){if(g)return pe(17,0,1,e,r,t,n);r=w(r),
t=w(t),n=w(n);try{var o=ee.getStreamFromFD(e),s=si(o,r,t);return(u(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function Wt(e,r,t,n){if(g)return pe(18,0,1,e,r,t,n);r=w(r),n=w(n);try{if(isNaN(r))return 61;
var o=ee.getStreamFromFD(e);return a.llseek(o,r,t),(u(),ce)[n/8]=BigInt(o.position),o.getdents&&r===0&&t===0&&(o.getdents=
null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var ci=(e,r,t,n)=>{for(var o=0,s=0;s<t;s++){
var c=Number((u(),A)[r/8]),f=Number((u(),A)[(r+8)/8]);r+=16;var h=a.write(e,(u(),Y),c,f,n);if(h<0)return-1;if(o+=h,h<f)break}
return o};function Vt(e,r,t,n){if(g)return pe(19,0,1,e,r,t,n);r=w(r),t=w(t),n=w(n);try{var o=ee.getStreamFromFD(e),s=ci(
o,r,t);return(u(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function ui(e,r){
e=w(e),r=w(r);try{return Cr((u(),se).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function li(e,r){e=w(e),r=w(r);var t=p.getJsObject(e);return p.fillAdapterInfoStruct(t.info,r),1}function fi(e,r){
e=w(e),r=w(r);var t=p.getJsObject(e);return p.fillLimitStruct(t.limits,r),1}function di(e,r){e=w(e);var t=p.getJsObject(
e);return t.features.has(p.FeatureName[r])}var mi=function(e){e=w(e);var r=(()=>{var t=p.getJsObject(e);return t.size})();
return BigInt(r)},pi=function(e,r){e=w(e),r=w(r);var t=(()=>{var n;r&&(n={label:p.makeStringFromOptionalStringView(r+8),
timestampWrites:p.makePassTimestampWrites(Number((u(),A)[(r+24)/8]))});var o=p.getJsObject(e),s=Vr(0n);return p.Internals.
jsObjectInsert(s,o.beginComputePass(n)),s})();return BigInt(t)};function gi(e,r,t,n,o,s){e=w(e),r=w(r),t=w(t),n=w(n),o=w(
o),s=w(s);var c=p.getJsObject(e),f=p.getJsObject(r),h=p.getJsObject(n);c.copyBufferToBuffer(f,t,h,o,s)}var hi=function(e,r){
e=w(e);var t=(()=>{var n=p.getJsObject(e),o=Qr(0n);return p.Internals.jsObjectInsert(o,n.finish()),o})();return BigInt(t)};
function bi(e,r,t,n){e=w(e);var o=p.getJsObject(e);o.dispatchWorkgroups(r,t,n)}function _i(e){e=w(e);var r=p.getJsObject(
e);r.end()}function vi(e,r,t,n,o){e=w(e),t=w(t),n=w(n),o=w(o);var s=p.getJsObject(e),c=p.getJsObject(t);n==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(u(),q),o/4,n)}function wi(e,r){e=w(e),r=w(r);var t=p.getJsObject(e),n=p.getJsObject(r);t.setPipeline(
n)}var yi=function(e,r){e=w(e);var t=(()=>{var n=p.getJsObject(e),o=Mr(0n);return p.Internals.jsObjectInsert(o,n.getBindGroupLayout(
r)),o})();return BigInt(t)},Ei=function(e,r){e=w(e),r=w(r);var t=(()=>{function n(h){var S=Number((u(),A)[(h+16)/8]),y=Number(
(u(),A)[(h+40)/8]),T=Number((u(),A)[(h+48)/8]),U=0;p.iterateExtensions(h,{327681:z=>{U=Number((u(),A)[(z+16)/8])}});var C;
if(S){var Q=je(h+32);Q==-1&&(Q=void 0),C={buffer:p.getJsObject(S),offset:je(h+24),size:Q}}else C=p.getJsObject(y||T||U);
return{binding:(u(),q)[(h+8)/4],resource:C}}function o(h,S){for(var y=[],T=0;T<h;++T)y.push(n(S+56*T));return y}var s={label:p.
makeStringFromOptionalStringView(r+8),layout:p.getJsObject(Number((u(),A)[(r+24)/8])),entries:o(Number((u(),A)[(r+32)/8]),
Number((u(),A)[(r+40)/8]))},c=p.getJsObject(e),f=Lr(0n);return p.Internals.jsObjectInsert(f,c.createBindGroup(s)),f})();
return BigInt(t)},ki=function(e,r){e=w(e),r=w(r);var t=(()=>{var n;r&&(n={label:p.makeStringFromOptionalStringView(r+8)});
var o=p.getJsObject(e),s=Wr(0n);return p.Internals.jsObjectInsert(s,o.createCommandEncoder(n)),s})();return BigInt(t)},Si=function(e,r){
e=w(e),r=w(r);var t=(()=>{var n=p.makeComputePipelineDesc(r),o=p.getJsObject(e),s=Hr(0n);return p.Internals.jsObjectInsert(
s,o.createComputePipeline(n)),s})();return BigInt(t)};function xi(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(p.WGSLLanguageFeatureName[r]):!1}var Bi=function(e,r,t){e=w(e),r=w(r),t=w(t);var n=p.getJsObject(
e),o=Array.from((u(),ce).subarray(t/8,(t+r*8)/8),s=>p.getJsObject(s));n.submit(o)};function Gi(e,r,t,n,o){e=w(e),r=w(r),
t=w(t),n=w(n),o=w(o);var s=p.getJsObject(e),c=p.getJsObject(r),f=(u(),se).subarray(n,n+o);s.writeBuffer(c,t,f,0,o)}var xe={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;xe.asyncExports=new Set;var t={};for(let[o,s]of Object.entries(
e))if(typeof s=="function"){r.test(o)&&(xe.asyncExports.add(s),s=xe.makeAsyncFunction(s));var n=xe.instrumentFunction(s);
t[o]=n}else t[o]=s;return t},asyncExports:null,isAsyncExport(e){var r;return(r=xe.asyncExports)==null?void 0:r.has(e)},handleAsync:async e=>{
Ke();try{return await e()}finally{De()}},handleSleep:e=>xe.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},Ht=e=>{var r=i["_"+e];return r},Ni=(e,r)=>{(u(),Y).set(e,r)},$t=(e,r,t,n,o)=>{var s={pointer:z=>BigInt(z),
string:z=>{var b=0;return z!=null&&z!==0&&(b=Ue(z)),BigInt(b)},array:z=>{var b=Nr(z.length);return Ni(z,b),BigInt(b)}};function c(z){
return r==="string"?rr(Number(z)):r==="pointer"?Number(z):r==="boolean"?!!z:z}var f=Ht(e),h=[],S=0;if(n)for(var y=0;y<n.
length;y++){var T=s[t[y]];T?(S===0&&(S=Ge()),h[y]=T(n[y])):h[y]=n[y]}var U=f(...h);function C(z){return S!==0&&Ne(S),c(z)}
var Q=o==null?void 0:o.async;return Q?U.then(C):(U=C(U),U)},Ii=(e,r,t,n)=>{var o=!t||t.every(c=>c==="number"||c==="boole\
an"),s=r!=="string";return s&&o&&!n?Ht(e):(...c)=>$t(e,r,t,c,n)},Fi=(...e)=>a.createPath(...e),Ai=(...e)=>a.unlink(...e),
Ti=(...e)=>a.createLazyFile(...e),Ci=(...e)=>a.createDevice(...e);if(J.init(),a.createPreloadedFile=ba,a.preloadFile=Dr,
a.staticInit(),lr(),i.noExitRuntime&&(Ar=i.noExitRuntime),i.preloadPlugins&&(Gt=i.preloadPlugins),i.print&&(fe=i.print),
i.printErr&&(X=i.printErr),i.wasmBinary&&(be=i.wasmBinary),i.arguments&&i.arguments,i.thisProgram&&(N=i.thisProgram),i.preInit)
for(typeof i.preInit=="function"&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.shift()();i.ENV=vr,i.mmapAlloc=Or,
i.wasmMemory=Ie,i.addRunDependency=gr,i.removeRunDependency=pr,i.ccall=$t,i.cwrap=Ii,i.FS_preloadFile=Dr,i.FS_unlink=Ai,
i.FS_createPath=Fi,i.FS_createDevice=Ci,i.FS=a,i.FS_createDataFile=Bt,i.FS_createLazyFile=Ti,i.MEMFS=L;var Ui=[gt,ht,yt,
Nt,_a,It,Ft,At,va,wa,Tt,Ct,Ut,Rt,zt,Lt,Mt,Qt,Wt,Vt];function Jt(e,r,t,n){return xe.handleAsync(async()=>await l(rr(Number(
e)),Number(r),Number(t),Number(n)))}Jt.sig="jjjjj";var Pt,Kt,Xt,Lr,Mr,Qr,Wr,Vr,Hr,Yt,Zt,en,rn,tn,nn,an,on,sn,cn,un,ln,fn,
dn,$r,mn,Jr,Pr,nr,Kr,pn,gn,wr,hn,Xr,bn,_n,vn,Yr,wn,yn,En,kn,Sn,xn,Bn,Gn;function Ri(e){i._wllama_malloc=e.wllama_malloc,
i._wllama_start=e.wllama_start,i._wllama_action=e.wllama_action,i._wllama_exit=e.wllama_exit,i._wllama_debug=e.wllama_debug,
Pt=i._main=e.main,Kt=e.malloc,Xt=e.free,Lr=e.emwgpuCreateBindGroup,Mr=e.emwgpuCreateBindGroupLayout,Qr=e.emwgpuCreateCommandBuffer,
Wr=e.emwgpuCreateCommandEncoder,Vr=e.emwgpuCreateComputePassEncoder,Hr=e.emwgpuCreateComputePipeline,Yt=e.emwgpuCreateExternalTexture,
Zt=e.emwgpuCreatePipelineLayout,en=e.emwgpuCreateQuerySet,rn=e.emwgpuCreateRenderBundle,tn=e.emwgpuCreateRenderBundleEncoder,
nn=e.emwgpuCreateRenderPassEncoder,an=e.emwgpuCreateRenderPipeline,on=e.emwgpuCreateSampler,sn=e.emwgpuCreateSurface,cn=
e.emwgpuCreateTexture,un=e.emwgpuCreateTextureView,ln=e.emwgpuCreateAdapter,fn=e.emwgpuCreateBuffer,dn=e.emwgpuCreateDevice,
$r=e.emwgpuCreateQueue,mn=e.emwgpuCreateShaderModule,Jr=e.emwgpuOnDeviceLostCompleted,Pr=e.emwgpuOnMapAsyncCompleted,nr=
e.emwgpuOnRequestAdapterCompleted,Kr=e.emwgpuOnRequestDeviceCompleted,pn=e.emwgpuOnWorkDoneCompleted,gn=e.emwgpuOnUncapturedError,
e._emscripten_tls_init,wr=e.pthread_self,hn=e.emscripten_builtin_memalign,Xr=e._emscripten_thread_init,bn=e._emscripten_thread_crashed,
_n=e._emscripten_run_js_on_main_thread,vn=e._emscripten_thread_free_data,Yr=e._emscripten_thread_exit,wn=e._emscripten_check_mailbox,
yn=e.memalign,En=e.__trap,kn=e.emscripten_stack_set_limits,Sn=e._emscripten_stack_restore,xn=e._emscripten_stack_alloc,Bn=
e.emscripten_stack_get_current,Gn=e.__indirect_function_table}var Xe;function Oi(){Xe={__asyncjs__js_file_read:Jt,__pthread_create_js:Et,
__syscall_fcntl64:Nt,__syscall_getcwd:It,__syscall_getdents64:Ft,__syscall_ioctl:At,__syscall_openat:Tt,__syscall_stat64:Ct,
_abort_js:ya,_emscripten_init_main_thread_js:Ea,_emscripten_notify_mailbox_postmessage:Sa,_emscripten_receive_on_main_thread_js:xa,
_emscripten_thread_cleanup:Ba,_emscripten_thread_mailbox_await:zr,_emscripten_thread_set_strongref:Ga,_localtime_js:Ta,_mmap_js:Ut,
_munmap_js:Rt,_tzset_js:Ca,clock_time_get:Ra,emscripten_check_blocking_allowed:Oa,emscripten_date_now:jt,emscripten_exit_with_live_runtime:ja,
emscripten_get_callstack:za,emscripten_get_heap_max:La,emscripten_get_now:Ot,emscripten_has_asyncify:Ma,emscripten_num_logical_cores:Qa,
emscripten_resize_heap:Va,emwgpuAdapterRequestDevice:Pa,emwgpuBufferDestroy:Ka,emwgpuBufferGetConstMappedRange:Xa,emwgpuBufferMapAsync:Ya,
emwgpuBufferUnmap:Za,emwgpuDelete:ei,emwgpuDeviceCreateBuffer:ri,emwgpuDeviceCreateShaderModule:ti,emwgpuDeviceDestroy:ni,
emwgpuInstanceRequestAdapter:ai,emwgpuQueueOnSubmittedWorkDone:ii,emwgpuWaitAny:qt,environ_get:zt,environ_sizes_get:Lt,exit:Ir,
fd_close:Mt,fd_read:Qt,fd_seek:Wt,fd_write:Vt,memory:Ie,random_get:ui,wgpuAdapterGetInfo:li,wgpuAdapterGetLimits:fi,wgpuAdapterHasFeature:di,
wgpuBufferGetSize:mi,wgpuCommandEncoderBeginComputePass:pi,wgpuCommandEncoderCopyBufferToBuffer:gi,wgpuCommandEncoderFinish:hi,
wgpuComputePassEncoderDispatchWorkgroups:bi,wgpuComputePassEncoderEnd:_i,wgpuComputePassEncoderSetBindGroup:vi,wgpuComputePassEncoderSetPipeline:wi,
wgpuComputePipelineGetBindGroupLayout:yi,wgpuDeviceCreateBindGroup:Ei,wgpuDeviceCreateCommandEncoder:ki,wgpuDeviceCreateComputePipeline:Si,
wgpuInstanceHasWGSLLanguageFeature:xi,wgpuQueueSubmit:Bi,wgpuQueueWriteBuffer:Gi}}function ji(e){e=Object.assign({},e);var r=S=>(y,T,U)=>S(
y,BigInt(T||0),BigInt(U||0)),t=S=>y=>Number(S(BigInt(y))),n=S=>y=>S(BigInt(y)),o=S=>()=>Number(S()),s=S=>(y,T)=>Number(S(
BigInt(y),BigInt(T))),c=S=>(y,T,U,C,Q,z)=>S(BigInt(y),T,U,C,Q,z),f=S=>(y,T,U,C,Q)=>S(y,BigInt(T),U,BigInt(C),Q),h=S=>(y,T)=>S(
BigInt(y),BigInt(T));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),e.pthread_self=o(e.pthread_self),e.emscripten_builtin_memalign=
s(e.emscripten_builtin_memalign),e._emscripten_thread_init=c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=
f(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=n(e._emscripten_thread_free_data),e._emscripten_thread_exit=
n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=h(e.emscripten_stack_set_limits),e._emscripten_stack_restore=
n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(e._emscripten_stack_alloc),e.emscripten_stack_get_current=o(e.
emscripten_stack_get_current),e}async function Di(){var e=Pt,r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,bt(n,!0),
n}catch(o){return qr(o)}}function yr(){if(Me>0){er=yr;return}if(g){we();return}if(fr(),Me>0){er=yr;return}async function e(){
var t;if(i.calledRun=!0,!ie){we(),(t=i.onRuntimeInitialized)==null||t.call(i);var r=i.noInitialRun||!1;r||await Di(),dr()}}
i.setStatus?(i.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>i.setStatus(""),1),e()},1)):e()}var Re;return g||(st(),
yr()),i}var Mn=1,Qn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"GlueMsgError",fields:[{type:"str",
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
ur=new Uint8Array([71,76,85,69]),at=0,Ji=1,Pi=2,Ki=3,Xi=4,Yi=5,Zi=6,eo=7,ro=8,to=9,no=10,Wn={str:Xi,int:Pi,float:Ki,bool:Ji,
raw:Yi,arr_str:to,arr_int:eo,arr_float:ro,arr_bool:Zi,arr_raw:no,null:at};function ao(i){let l=0;const d=new DataView(i.
buffer),m=()=>{const V=d.getUint32(l,!0);return l+=4,V},v=()=>{const V=d.getInt32(l,!0);return l+=4,V},_=()=>{const V=d.
getFloat32(l,!0);return l+=4,V},g=()=>m()!==0,G=V=>{const ne=V??m(),ae=new TextDecoder().decode(i.slice(l,l+ne));return l+=
ne,ae},N=()=>{const V=m(),ne=i.slice(l,l+V);return l+=V,ne},E=V=>{const ne=m(),ae=new Array(ne);for(let fe=0;fe<ne;fe++)
ae[fe]=V();return ae},x=()=>null,k=V=>{switch(V.type){case"str":return G();case"int":return v();case"float":return _();case"\
bool":return g();case"raw":return N();case"arr_str":return E(G);case"arr_int":return E(v);case"arr_float":return E(_);case"\
arr_bool":return E(g);case"arr_raw":return E(N);case"null":return x()}},I=i[0]===ur[0]&&i[1]===ur[1]&&i[2]===ur[2]&&i[3]===
ur[3];if(l+=4,!I)throw new Error("Invalid magic number");if(m()!==Mn)throw new Error("Invalid version number");const F=G(
8),R=Qn[F];if(!R)throw new Error(`Unknown message name: ${F}`);const te={_name:F};for(const V of R.fields){const ne=m();
if(ne===at){if(!V.isNullable)throw new Error(`${F}: Expect field ${V.name} to be non-nullable`);te[V.name]=null;continue}
if(ne!==Wn[V.type])throw new Error(`${F}: Expect field ${V.name} to have type ${V.type}`);te[V.name]=k(V)}return te}function io(i){
const l=Qn[i._name];if(!l)throw new Error(`Unknown message name: ${i._name}`);const d=[],m=B=>{const F=new ArrayBuffer(4);
new DataView(F).setUint32(0,B,!0),d.push(new Uint8Array(F))},v=B=>{const F=new ArrayBuffer(4);new DataView(F).setInt32(0,
B,!0),d.push(new Uint8Array(F))},_=B=>{const F=new ArrayBuffer(4);new DataView(F).setFloat32(0,B,!0),d.push(new Uint8Array(
F))},g=B=>{m(B?1:0)},G=B=>{const F=new TextEncoder().encode(B);m(F.byteLength),d.push(F)},N=B=>{m(B.byteLength),d.push(B)},
E=(B,F)=>{m(B.length);for(const R of B)F(R)};d.push(ur),m(Mn);{const B=new TextEncoder().encode(i._name);d.push(B)}for(const B of l.
fields){const F=i[B.name];if(!B.isNullable&&F==null)throw new Error(`${i._name}: Expect field ${B.name} to be non-nullab\
le`);if(F==null){m(at);continue}switch(m(Wn[B.type]),B.type){case"str":G(F);break;case"int":v(F);break;case"float":_(F);
break;case"bool":g(F);break;case"raw":N(F);break;case"arr_str":E(F,G);break;case"arr_int":E(F,v);break;case"arr_float":E(
F,_);break;case"arr_bool":E(F,g);break;case"arr_raw":E(F,N);break}}const x=d.reduce((B,F)=>B+F.byteLength,0),k=new Uint8Array(
x);let I=0;for(const B of d)k.set(B,I),I+=B.byteLength;return k}const Vn=4*1024**2,Un=1024*1024;function oo({files:i,reader:l,
getMemory:d,getSignal:m=()=>{}}){const v=new Map(i.map(_=>[_.name,_]));return async(_,g,G,N)=>{const E=v.get(_.replace(/^\/?models\//,
""));if(!E||![g,G,N].every(k=>Number.isSafeInteger(k)&&k>=0)||g>E.size)throw new Error("Invalid GGUF native file read");
const x=Math.min(G,E.size-g);if(!Number.isSafeInteger(N+x)||N+x>d().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let k=0;k<x;){me(m());const I=Math.min(Vn,x-k),B=await l.read(E.path,g+k,I,{signal:m()});if(me(m()),
!(B instanceof Uint8Array)||B.byteLength!==I)throw new Error("Incomplete GGUF artifact range");new Uint8Array(d()).set(B,
N+k),k+=I}return BigInt(x)}}function so(i,l){i.FS.mkdir("/models"),i.FS.mount(i.MEMFS,{root:"."},"/models");const d=new Map(
l.map(_=>[_.name,_])),m=i.MEMFS.stream_ops;for(const _ of["read","llseek"]){const g=m[_];m[_]=function(G,...N){const E=d.
get(G.node.name);return E&&(G.node.usedBytes=E.size),g.call(this,G,...N)},i.MEMFS.ops_table.file.stream[_]=m[_]}const v=m.
mmap;m.mmap=function(_,...g){if(d.has(_.node.name))throw new Error("GGUF artifact mmap is prohibited");return v.call(this,
_,...g)},i.MEMFS.ops_table.file.stream.mmap=m.mmap;for(const _ of l)i.FS_createDataFile("/models",_.name,new Uint8Array(
0),!0,!1,!0)}function co(i,l,{collect:d=!1,onLost:m}={}){var N;if(l.device=i,l.runtimeFeatures=[...i.features],l.runtimeAdapter=
i.adapterInfo?{vendor:i.adapterInfo.vendor,architecture:i.adapterInfo.architecture,isFallbackAdapter:i.adapterInfo.isFallbackAdapter??
!1}:null,!i.features.has("shader-f16")||(N=l.runtimeAdapter)!=null&&N.isFallbackAdapter)throw new Error("GGUF native run\
time did not acquire the required hardware GPU");if(i.lost.then(E=>m==null?void 0:m(E)),!d)return()=>{};const v=Object.getOwnPropertyDescriptor(
i,"createCommandEncoder"),_=Object.getOwnPropertyDescriptor(i.queue,"submit"),g=i.createCommandEncoder.bind(i),G=i.queue.
submit.bind(i.queue);return i.createCommandEncoder=(...E)=>{const x=g(...E),k=x.beginComputePass.bind(x);return x.beginComputePass=
(...I)=>{const B=k(...I);for(const F of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const R=B[F].bind(B);B[F]=(...te)=>{
const V=R(...te);return l.dispatches+=1,V}}return B},x},i.queue.submit=(...E)=>{const x=G(...E);return l.submissions+=1,
x},()=>{v?Object.defineProperty(i,"createCommandEncoder",v):delete i.createCommandEncoder,_?Object.defineProperty(i.queue,
"submit",_):delete i.queue.submit}}function uo(i){const l=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(i);return l?
{gpuLayers:Number(l[1]),totalLayers:Number(l[2])}:null}function lo(i){const l=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(i);return l?{backend:l[1],kind:l[2].toLowerCase(),bytes:Math.round(Number(l[3])*1024**2)}:null}async function fo({wasmUrl:i,
weights:l,reader:d,signal:m,collectGpuEvidence:v=!1,onProgress:_,onLost:g,initialize:G=$i}={}){const N=l.map((D,M)=>({...D,
name:`model-${String(M+1).padStart(5,"0")}-of-${String(l.length).padStart(5,"0")}.gguf`})),E={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let x=m,k,I,B,F,R;const te=new Promise((D,M)=>{F=D,R=M}),V=D=>{var P;const M=uo(
String(D));M&&(E.offload=M,_==null||_({type:"gpu-offload",...M}));const u=lo(String(D));u&&E.buffers.length<32&&(E.buffers.
push(u),_==null||_({type:"native-buffer",...u,wasmMemoryBytes:((P=B==null?void 0:B.wasmMemory)==null?void 0:P.buffer.byteLength)??
0}))},ne=D=>{k=new Error(`Model session lost: GGUF native runtime failed: ${String(D).slice(0,300)}`),R(k)};B={noInitialRun:!0,
pthreadPoolSize:0,locateFile(D){if(D!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return i},print:V,
printErr:V,onAbort:ne,onExit:ne,preRun(){B.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){F()},peercomputeOnDevice(D){try{
I==null||I(),I=co(D,E,{collect:v,onLost(M){E.lost=!0,g==null||g(M)}})}catch(M){D.destroy(),ne(M.message)}}};const ae=oo(
{files:N,reader:d,getMemory:()=>B.wasmMemory.buffer,getSignal:()=>x});G(B,ae),await te,me(m),so(B,N);const fe=B.cwrap("w\
llama_start","string",[],{async:!0}),X=B.cwrap("wllama_malloc","bigint",["bigint","number"]),be=B.cwrap("wllama_action",
"bigint",["string","bigint"],{async:!0});let ve=!1;const ie=async(D,M,u)=>{if(ve)throw new Error("Concurrent GGUF native\
 calls are prohibited");if(k)throw k;if(E.lost)throw new Error("GPU device lost; GGUF session is unavailable");me(u),ve=
!0,x=u;try{const P=io(M);if(P.byteLength>Un)throw new Error("GGUF native message exceeds its byte budget");const oe=Number(
X(BigInt(P.byteLength),0)),ue=new Uint8Array(B.wasmMemory.buffer);if(!Number.isSafeInteger(oe)||oe<=0||oe+P.length>ue.length)
throw new Error("Invalid GGUF input pointer");ue.set(P,oe);const Y=Number(await be(D,BigInt(oe)));if(k)throw k;const se=B.
wasmMemory.buffer,_e=new DataView(se).getUint32(oe,!0);if(!Number.isSafeInteger(Y)||Y<=0||_e>Un||Y+_e>se.byteLength)throw new Error(
"Invalid GGUF output buffer");return ao(new Uint8Array(se,Y,_e).slice())}catch(P){throw k??(k=new Error(`Model session l\
ost: GGUF native action failed: ${String(P.message??P).slice(0,300)}`)),k}finally{ve=!1,x=void 0}},j=JSON.parse(await fe());
if(k)throw k;if(!j.success||!E.device)throw new Error("GGUF native hardware GPU backend did not initialize");return me(m),
{files:N,action:ie,evidence:E,async settleGpu(){try{await E.device.queue.onSubmittedWorkDone()}catch(D){throw E.lost=!0,
k=new Error(`Model session lost: GGUF GPU completion failed: ${String(D.message??D).slice(0,300)}`),k}},close(){var D;I==
null||I(),(D=E.device)==null||D.destroy()},memoryBytes(){return B.wasmMemory.buffer.byteLength}}}const mo=i=>i/2**32|0,po=i=>i>>>
0;function go(i,l,d,m){const v=mo(d),_=po(d);i.setUint32(l,m?_:v,m),i.setUint32(l+4,m?v:_,m)}function Rn(i){return i instanceof
Uint8Array||ArrayBuffer.isView(i)&&i.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in i&&i.BYTES_PER_ELEMENT===1}const ho=i=>i?
`"${i}" `:"";function Hn(i,l,d=""){if(Rn(i)&&l===void 0)return i;const m=Rn(i),v="",_=m?`length=${i.length}`:`type=${typeof i}`,
g=ho(d)+"expected Uint8Array"+v+", got "+_;throw m?new RangeError(g):new TypeError(g)}const bo=(i,l)=>{if(i===null||typeof i!=
"object"||Array.isArray(i))throw new TypeError((l==="object"?"":`"${l}" `)+"expected object, got type="+typeof i)},On=(i,l)=>{
bo(i,l);const d=Object.getPrototypeOf(i);if(d!==Object.prototype&&d!==null)throw new TypeError(`"${l}" expected plain ob\
ject`);if(Object.hasOwn(i,"__proto__"))throw new TypeError(`"${l}.__proto__" is not allowed`)};function jn(i,l=!0){if(i.
destroyed)throw new Error("hash was destroyed");if(l&&i.finished)throw new Error("digest() was already called")}function _o(i,l){
Hn(i,void 0,"output");const d=l.outputLen;if(!(i.length>=d))throw new RangeError('"output" expected length >= '+d)}function Dn(...i){
for(let l=0;l<i.length;l++)i[l].fill(0)}function Zr(i){return new DataView(i.buffer,i.byteOffset,i.byteLength)}function Ce(i,l){
return i<<32-l|i>>>l}function vo(i,l,d="opts"){return On(i,"defaults"),l!==void 0&&On(l,d),Object.assign(Object.create(null),
i,l)}function wo(i,l={}){if(typeof i!="function")throw new TypeError('"hashCons" expected function, got type='+typeof i);
l=vo({},l,"info");const d=(v,_)=>i(_).update(v).digest(),m=i(void 0);return d.outputLen=m.outputLen,d.blockLen=m.blockLen,
d.canXOF=m.canXOF,d.create=v=>i(v),Object.assign(d,l),Object.freeze(d)}const yo=i=>({oid:Uint8Array.from([6,9,96,134,72,
1,101,3,4,2,i])});function Eo(i,l,d){return i&l^~i&d}function ko(i,l,d){return i&l^i&d^l&d}class So{constructor(l,d,m,v){
K(this,"blockLen");K(this,"outputLen");K(this,"canXOF",!1);K(this,"padOffset");K(this,"isLE");K(this,"buffer");K(this,"v\
iew");K(this,"finished",!1);K(this,"length",0);K(this,"pos",0);K(this,"destroyed",!1);this.blockLen=l,this.outputLen=d,this.
padOffset=m,this.isLE=v,this.buffer=new Uint8Array(l),this.view=Zr(this.buffer)}update(l){jn(this),Hn(l);const{view:d,buffer:m,
blockLen:v}=this,_=l.length;let g=!1;for(let G=0;G<_;){const N=Math.min(v-this.pos,_-G);if(N===v){const E=Zr(l);for(;v<=
_-G;G+=v)this.process(E,G);g=!0;continue}m.set(G===0&&N===_?l:l.subarray(G,G+N),this.pos),this.pos+=N,G+=N,this.pos===v&&
(this.process(d,0),this.pos=0,g=!0)}return this.length+=l.length,g&&this.roundClean(),this}digestInto(l){jn(this),_o(l,this),
this.finished=!0;const{buffer:d,view:m,blockLen:v,isLE:_}=this;let{pos:g}=this;d[g++]=128,d.fill(0,g),this.padOffset>v-g&&
(this.process(m,0),d.fill(0)),go(m,v-8,this.length*8,_),this.process(m,0),this.roundClean();const G=l===d?m:Zr(l),N=this.
outputLen,E=N/4,x=this.get();if(N%4||E>x.length)throw new Error("invalid outputLen");for(let k=0;k<E;k++)G.setUint32(4*k,
x[k],_)}digest(){const{buffer:l,outputLen:d}=this;this.digestInto(l);const m=l.slice(0,d);return this.destroy(),m}_cloneIntoMeta(l){
const{buffer:d,length:m,finished:v,destroyed:_,pos:g}=this;return l.destroyed=_,l.finished=v,l.length=m,l.pos=g,g&&l.buffer.
set(d),l}clone(){return this._cloneInto()}}const xo=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,
2600822924,528734635,1541459225]),Bo=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,
2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,
113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,
3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,
1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),qe=new Uint32Array(
64);class Go extends So{constructor(d,m){super(64,d,8,!1);K(this,"A",0);K(this,"B",0);K(this,"C",0);K(this,"D",0);K(this,
"E",0);K(this,"F",0);K(this,"G",0);K(this,"H",0);this.A=m[0]|0,this.B=m[1]|0,this.C=m[2]|0,this.D=m[3]|0,this.E=m[4]|0,this.
F=m[5]|0,this.G=m[6]|0,this.H=m[7]|0}get(){const{A:d,B:m,C:v,D:_,E:g,F:G,G:N,H:E}=this;return[d,m,v,_,g,G,N,E]}set(d,m,v,_,g,G,N,E){
this.A=d|0,this.B=m|0,this.C=v|0,this.D=_|0,this.E=g|0,this.F=G|0,this.G=N|0,this.H=E|0}_cloneInto(d){return(d||(d=new this.
constructor)).set(...this.get()),this._cloneIntoMeta(d)}process(d,m){for(let I=0;I<16;I++,m+=4)qe[I]=d.getUint32(m,!1);for(let I=16;I<
64;I++){const B=qe[I-15],F=qe[I-2],R=Ce(B,7)^Ce(B,18)^B>>>3,te=Ce(F,17)^Ce(F,19)^F>>>10;qe[I]=te+qe[I-7]+R+qe[I-16]|0}let{
A:v,B:_,C:g,D:G,E:N,F:E,G:x,H:k}=this;for(let I=0;I<64;I++){const B=Ce(N,6)^Ce(N,11)^Ce(N,25),F=k+B+Eo(N,E,x)+Bo[I]+qe[I]|
0,te=(Ce(v,2)^Ce(v,13)^Ce(v,22))+ko(v,_,g)|0;k=x,x=E,E=N,N=G+F|0,G=g,g=_,_=v,v=F+te|0}v=v+this.A|0,_=_+this.B|0,g=g+this.
C|0,G=G+this.D|0,N=N+this.E|0,E=E+this.F|0,x=x+this.G|0,k=k+this.H|0,this.set(v,_,g,G,N,E,x,k)}roundClean(){Dn(qe)}destroy(){
this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),Dn(this.buffer)}}class No extends Go{constructor(){super(32,xo)}}const Io=wo(
()=>new No,yo(1)),le=Object.freeze({maximumBytes:16*1024**3,headerBytes:16*1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,
arrayItems:1048576,stringBytes:1024**2}),$n=Object.freeze(Wi("llama.cpp").map(i=>i.architecture)),Jn="peercompute.gguf.h\
eader.v1",Fo="3.8.1",rt=new Map([[0,["F32",1,4]],[1,["F16",1,2]],[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],
[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],
[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,[
"IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),xr=new Map(
[[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,
"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],
[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],
[31,"iq1_m"]]),Ao=new TextDecoder("utf-8",{fatal:!0}),To=i=>Array.from(i,l=>l.toString(16).padStart(2,"0")).join(""),W=i=>new Error(
`Unsupported GGUF Hub package: ${i}`);function Ee(i,l,d,m=0){if(!Number.isSafeInteger(i)||i<m||i>l)throw W(`invalid ${d}`);
return i}class Co extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function Uo(i,{
size:l}={}){var ve,ie;if(!(i instanceof Uint8Array))throw W("header bytes required");if(Ee(l,le.maximumBytes,"file size",
24),i.length>le.headerBytes||i.length>l)throw W("header byte budget exceeded");const d=new DataView(i.buffer,i.byteOffset,
i.byteLength);let m=0;function v(j){if(Ee(j,le.headerBytes,"header field length"),m+j>le.headerBytes)throw W("header byt\
e budget exceeded");if(m+j>i.length)throw new Co;const D=m;return m+=j,D}const _=()=>d.getUint32(v(4),!0),g=()=>{const j=d.
getBigUint64(v(8),!0);if(j>BigInt(Number.MAX_SAFE_INTEGER))throw W("unsafe 64-bit value");return Number(j)};function G(j=le.
stringBytes,D=!0){const M=Ee(g(),j,"string length"),u=v(M);return D?Ao.decode(i.subarray(u,u+M)):void 0}function N(j,D=!0,M=!1){
if(j===8)return G(le.stringBytes,D);if(j===9){if(M)throw W("nested metadata arrays");const ue=_(),Y=Ee(g(),le.arrayItems,
"array count");if(ue===9||ue>12)throw W("metadata array type");if(ue===8)for(let se=0;se<Y;se++)G(le.stringBytes,!1);else
v(Y*[1,1,2,2,4,4,4,1,0,0,8,8,8][ue]);return{array:!0,element:ue,count:Y}}const u=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!u[j])throw W(
"metadata value type");const P=v(u[j]);if(!D)return;if(j===0)return d.getUint8(P);if(j===1)return d.getInt8(P);if(j===2)
return d.getUint16(P,!0);if(j===3)return d.getInt16(P,!0);if(j===4)return d.getUint32(P,!0);if(j===5)return d.getInt32(P,
!0);if(j===6)return d.getFloat32(P,!0);if(j===7){const ue=d.getUint8(P);if(ue>1)throw W("boolean value");return!!ue}if(j===
12)return d.getFloat64(P,!0);const oe=j===10?d.getBigUint64(P,!0):d.getBigInt64(P,!0);if(oe>BigInt(Number.MAX_SAFE_INTEGER)||
oe<BigInt(Number.MIN_SAFE_INTEGER))throw W("unsafe metadata integer");return Number(oe)}if(_()!==1179993927)throw W("mag\
ic or byte order");const E=_();if(![2,3].includes(E))throw W("version");const x=Ee(g(),le.tensors,"tensor count",1),k=Ee(
g(),le.metadata,"metadata count",1),I=new Map;for(let j=0;j<k;j++){const D=G(512);if(!D||I.has(D)||/[\u0000-\u001f\u007f]/u.
test(D))throw W("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.test(D))throw W("cu\
stom tensor layout requires catalog review");const M=_(),u=["general.architecture","general.type","general.file_type","g\
eneral.alignment","general.name","general.quantization_version","split.count","split.no","split.tensors.count","tokenize\
r.ggml.model","tokenizer.ggml.tokens"].includes(D);I.set(D,N(M,u))}const B=I.get("general.architecture");if(!$n.includes(
B))throw W("architecture");if(I.has("general.type")&&I.get("general.type")!=="model")throw W("adapter or non-model GGUF");
if(/georefine/i.test(I.get("general.name")??""))throw W("custom GeoRefine model requires catalog review");if((I.get("spl\
it.count")??1)!==1||(I.get("split.no")??0)!==0||(I.get("split.tensors.count")??x)!==x)throw W("split GGUF requires compl\
ete shard admission");if(![void 0,2].includes(I.get("general.quantization_version")))throw W("quantization version");const F=I.
get("general.file_type");if(!xr.has(F))throw W("file quantization type");if(!["llama","gpt2"].includes(I.get("tokenizer.\
ggml.model"))||((ve=I.get("tokenizer.ggml.tokens"))==null?void 0:ve.element)!==8||!((ie=I.get("tokenizer.ggml.tokens"))!=
null&&ie.count))throw W("self-contained supported tokenizer required");const R=Ee(I.get("general.alignment")??32,4096,"a\
lignment",1);if(R&R-1)throw W("alignment must be a power of two");const te=new Set,V=new Set,ne=[];let ae=0;for(let j=0;j<
x;j++){const D=G(512);if(!D||te.has(D)||/georefine|[\u0000-\u001f\u007f]/iu.test(D))throw W("duplicate or custom tensor \
name");te.add(D);const M=Ee(_(),4,"tensor dimensions",1);let u=1,P=0;for(let _e=0;_e<M;_e++){const O=Ee(g(),le.maximumBytes,
"tensor dimension",1);_e===0&&(P=O),u*=O,Ee(u,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const oe=_(),ue=rt.get(oe);
if(!ue||P%ue[1])throw W("unsupported tensor codec or quantized row shape");const Y=Ee(u/ue[1]*ue[2],l,"tensor bytes",1),
se=g();if(se%R||se+Y>l)throw W("tensor offset exceeds file or alignment");ne.push({start:se,end:se+Y}),V.add(oe),ae=Math.
max(ae,Y)}if(!te.has("token_embd.weight")||!te.has("output_norm.weight"))throw W("text model tensor layout");const fe=m,
X=Math.ceil(m/R)*R;ne.sort((j,D)=>j.start-D.start);let be=0;for(const j of ne){if(j.start<be||X+j.end>l)throw W("overlap\
ping or truncated tensor data");be=j.end}return{schema:Jn,version:E,architecture:B,fileType:F,dtype:xr.get(F),tensorCount:x,
metadataCount:k,headerBytes:fe,dataOffset:X,maximumTensorBytes:ae,tensorTypes:[...V].sort((j,D)=>j-D),headerSha256:To(Io(
i.subarray(0,fe)))}}async function Ro({readRange:i,size:l,signal:d}={}){if(typeof i!="function")throw W("range reader re\
quired");Ee(l,le.maximumBytes,"file size",24);let m=new Uint8Array(0),v=Math.min(64*1024,l);for(;;){me(d);const _=new Uint8Array(
v);_.set(m);for(let g=m.length;g<v;){const G=Math.min(le.rangeBytes,v-g),N=await i(g,G,{signal:d});if(me(d),!(N instanceof
Uint8Array)||N.length!==G)throw W("truncated range response");_.set(N,g),g+=G}m=_;try{return Uo(m,{size:l})}catch(g){if(g.
code!=="ERR_GGUF_HEADER_TRUNCATED"||v===l)throw g;if(v===le.headerBytes)throw W("header exceeds bounded probe");v=Math.min(
v*2,l,le.headerBytes)}}}function Oo(i){if(!i||i.schema!==Jn||![2,3].includes(i.version)||!$n.includes(i.architecture)||!xr.
has(i.fileType)||xr.get(i.fileType)!==i.dtype||!/^[a-f0-9]{64}$/.test(i.headerSha256??""))throw W("header profile");for(const[
d,m]of[["tensorCount",le.tensors],["metadataCount",le.metadata],["headerBytes",le.headerBytes],["dataOffset",le.headerBytes+
4096],["maximumTensorBytes",le.maximumBytes]])Ee(i[d],m,d,1);if(i.dataOffset<i.headerBytes||!Array.isArray(i.tensorTypes)||
!i.tensorTypes.length||i.tensorTypes.length>rt.size||i.tensorTypes.some((d,m)=>!rt.has(d)||m>0&&d<=i.tensorTypes[m-1]))throw W(
"tensor profile");const l=["schema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerByt\
es","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.keys(i).some(d=>!l.includes(d)))throw W("u\
nexpected header profile field");return Object.fromEntries(l.map(d=>[d,i[d]]))}function jo({repository:i,revision:l,file:d,
header:m}={}){if(typeof i!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(i)||!/^[a-f0-9]{40}$/.
test(l??""))throw W("immutable Hugging Face repository/revision required");if(Qi(d==null?void 0:d.path),!d.path.endsWith(
".gguf")||!/^[a-f0-9]{64}$/.test(d.sha256??""))throw W("pinned GGUF SHA-256 required");Ee(d.size,le.maximumBytes,"weight\
 size",24);const v=Oo(m);if(v.dataOffset+v.maximumTensorBytes>d.size)throw W("header/file size mismatch");const _=d.size>
4*1024**3;return{model:{runtime:"llama.cpp",runtimeVersion:Fo,architecture:v.architecture==="qwen35"?"qwen3_5":v.architecture,
format:"GGUF",task:"text-generation",dtype:v.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:i,revision:l,
gguf:{...v,path:d.path,size:d.size,sha256:d.sha256}},weights:[d],totalBytes:d.size,resourcePolicy:{maxModelBytes:le.maximumBytes,
minimumCpuBytes:(_?8:2)*1024**3,minimumGpuBytes:(_?16:2)*1024**3}}}function Pn(i,{files:l,totalBytes:d}={}){if(!(i!=null&&
i.gguf))throw W("bounded header profile required");const{path:m,size:v,sha256:_,...g}=i.gguf,G=jo({repository:i.repository,
revision:i.revision,file:{path:m,size:v,sha256:_},header:g});for(const N of["runtime","runtimeVersion","architecture","f\
ormat","task","dtype"])if(i[N]!==G.model[N])throw W(`model ${N} disagrees with header`);if(JSON.stringify(i.modalities)!==
'["text"]'||JSON.stringify(i.requiredFeatures)!=='["shader-f16"]')throw W("text-only/f16 capability profile required");if(l){
const N=l.filter(E=>E.path.endsWith(".gguf"));if(N.length!==1||N[0].path!==m||N[0].size!==v||N[0].sha256!==_||l.some(E=>!/^[a-f0-9]{64}$/.
test(E.sha256??"")))throw W("file closure/digest mismatch");G.weights=N,d=l.reduce((E,x)=>E+x.size,0)}return G.totalBytes=
Ee(d??v,le.maximumBytes,"package bytes",v),G}async function Do(i,l,d,{signal:m}={}){if(!i.gguf)return;const v=Pn(i,{files:l}).
model.gguf,_=await Ro({size:l[0].size,signal:m,readRange:(x,k,I)=>d.read(l[0].path,x,k,I)}),{path:g,size:G,sha256:N,...E}=v;
if(JSON.stringify(_)!==JSON.stringify(E))throw W("stored header does not match inspected package")}const qo="ERR_MODEL_C\
ONTEXT_BUDGET",Br=1;function zo(i,l,d){return Object.assign(new Error(`The model context holds ${l} tokens; instructions\
 and the current prompt need ${i}, plus ${d} reserved for the reply. Shorten the current prompt or saved context, or req\
uest a shorter reply.`),{code:qo})}function Lo(i){const l=i.findIndex(m=>m.role==="user"),d=i.findIndex((m,v)=>v>l&&m.role===
"user");return l<0||d<0?null:i.filter((m,v)=>v<l||v>=d||m.role==="system")}async function Mo({messages:i,contextTokens:l,
reservedOutputTokens:d,measure:m,signal:v,onMeasured:_}){if(!Number.isSafeInteger(l)||l<1||!Number.isSafeInteger(d)||d<1)
throw new Error("Invalid GGUF context budget");let g=i.map(x=>({...x})),G=0,N=0;const E=Math.max(1,i.filter(x=>x.role===
"user").length);for(let x=1;x<=E;x+=1){me(v);const k=await m(g);if(me(v),!Number.isSafeInteger(k.inputTokens)||k.inputTokens<
0||!Number.isSafeInteger(k.contextTokens)||k.contextTokens<1||k.contextTokens>l||!Number.isSafeInteger(k.probeOutputTokens)||
k.probeOutputTokens<0||k.probeOutputTokens>Br)throw new Error("Invalid GGUF context measurement");N+=k.probeOutputTokens;
const I={contextTokens:k.contextTokens,inputTokens:k.inputTokens,reservedOutputTokens:d,removedTurns:G,preflightCalls:x,
measurementTokens:N,probeTokenBudget:Br},B=k.inputTokens>=k.contextTokens||k.inputTokens+d>k.contextTokens;if(_==null||_(
{...I,probeOutputTokens:k.probeOutputTokens,overflow:B}),me(v),!B)return{messages:g,contextTruncated:G>0,contextBudget:I};
const F=Lo(g);if(!F)throw zo(k.inputTokens,k.contextTokens,d);g=F,G+=1}throw new Error("GGUF context fitting exceeded it\
s bounded attempts")}const ir="Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",or="5ce3fd841676adf2c1a10d719363\
7d46007e88f7",qn=[{path:".gitattributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENS\
E",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3ee\
b0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb3\
3a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da426\
51bf2aca14a0c95508d"},{path:"artifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{
path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,
gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf\
88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33\
903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Qo="This catalog \
supports verified storage and distribution. Execution is admitted separately by the managed llama.cpp runtime and GGUF m\
odel catalog after browser capability and resource checks.";function Kn(i){for(const l of Object.values(i))l&&typeof l==
"object"&&Kn(l);return Object.freeze(i)}const Wo=Kn({"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-ggu\
f",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:ir,revision:or,status:"storage-only",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"unavailable",executionReason:Qo},license:{spdx:"Apa\
che-2.0",sourceUrl:`https://huggingface.co/${ir}/blob/${or}/LICENSE`,notice:"Preserve upstream LICENSE, NOTICE, model ca\
rd, and immutable artifact provenance."},provenance:{repository:ir,revision:or,format:"GGUF",metadataCheckedAt:"2026-11-\
03",modelCardUrl:`https://huggingface.co/${ir}/blob/${or}/README.md`,sourceManifestPath:"artifact-manifest.json"},model:{
runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"mixed",quantizationTypes:["IQ4_XS",
"IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:ir,revision:or},weightBytes:14199740480,totalBytes:qn.reduce((i,l)=>i+l.size,
0),files:qn}});function Xn(i){return i&&typeof i=="object"&&!Object.isFrozen(i)&&(Object.values(i).forEach(Xn),Object.freeze(
i)),i}const Vo=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowman GGUF Q5_K_M, experimental text)",
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
-Evil-BF16",revision:"b66fc0a575c13af75c5d438111559b04ed015cd4",path:"EVALUATION.md"}}]}],Ho=Xn(Object.fromEntries(Vo.map(
i=>{const{dtype:l,sourceModel:d,blockCount:m,nextnPredictLayers:v,..._}=i,G=_.files.find(N=>N.path==="LICENSE").source;return[
_.id,{..._,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!0,
requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires managed llama.cpp WebGPU, shader-f16, c\
ross-origin isolation, shared WASM memory64/JSPI and memory admission. These exact files have not passed device executio\
n validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingface.co/"+G.repository+"/blob/"+G.revision+"/LICENS\
E",notice:"The inherited Apache-2.0 license, conversion/source cards and available modification notices are included."},
provenance:{repository:_.repository,revision:_.revision,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:"https\
://huggingface.co/"+_.repository+"/blob/"+_.revision+"/README.md",sourceModel:{...d,revisionPurpose:"Pinned source docum\
entation and license reference; the converter does not identify its exact source checkpoint revision.",conversionInputRevisionVerified:!1},
upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:m,nextnPredictLayers:v,inspectedPrefixBytes:65536},
vision:"Upstream vision metadata/projectors exist, but this text-only package omits the optional projector and the curre\
nt managed GGUF adapter rejects images.",behavior:_.behavior.notice},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"\
qwen3_5",format:"GGUF",task:"text-generation",dtype:l,modalities:["text"],requiredFeatures:["shader-f16"],repository:_.repository,
revision:_.revision},weightBytes:_.files[0].size,totalBytes:_.files.reduce((N,E)=>N+E.size,0)}]})));function it(i){return i&&
typeof i=="object"&&!Object.isFrozen(i)&&(Object.values(i).forEach(it),Object.freeze(i)),i}const Oe="Tsotchke-Corporatio\
n",Yn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Qwen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate \
text)",repository:`${Oe}/Qwen3-Coder-30B-A3B-GeoRefine-C30-abl-GGUF`,revision:"b88c1f0ded829f2195958b8f1129aa2d13a9232f",
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
en3.6-35b-a3b-georefine-c20-gguf",name:"Qwen3.6 35B A3B GeoRefine C20 (mixed IQ4_XS GGUF, candidate text)",repository:`${Oe}\
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
 Q4_K GGUF, candidate text)",repository:`${Oe}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"4268ff007ddb5e8813a391fbdd\
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
06e0df3640f9ae04fff09706ef"}]}],$o=it(Object.fromEntries(Yn.map(i=>{const{architecture:l,quantizationTypes:d,sourceModel:m,
publisherLimitations:v,..._}=i;return[i.id,{..._,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${i.repository}\
/blob/${i.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:i.repository,revision:i.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${i.repository}/blob/${i.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:m,
publisherLimitations:v,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:l,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:d,modalities:["text"],requiredFeatures:["shader-f16"],repository:i.repository,
revision:i.revision},weightBytes:i.files.filter(g=>g.path.endsWith(".gguf")).reduce((g,G)=>g+G.size,0),totalBytes:i.files.
reduce((g,G)=>g+G.size,0)}]})));it({organization:Oe,sourceUrl:`https://huggingface.co/${Oe}`,checkedAt:"2026-11-04",repositories:[
...Yn.map(({id:i,repository:l,revision:d})=>({repository:l,revision:d,catalogId:i,format:"GGUF",codecRequired:!1})),{repository:`${Oe}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${Oe}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${Oe}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${Oe}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const sr="bartowski/Qwen_Qwen3.5-0.8B-GGUF",cr="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",et=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],tt=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function Zn(i){return i&&typeof i=="object"&&!Object.isFrozen(i)&&(Object.
values(i).forEach(Zn),Object.freeze(i)),i}const Jo=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:i,...l})=>[l.id,Zn({...l,
status:"execution-candidate",format:"GGUF",capabilities:tt,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${l.files[2].source.repository}/blob/${l.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:l.repository,revision:l.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${l.repository}/blob/${l.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:i,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:l.repository,revision:l.
revision},weightBytes:l.files[0].size,totalBytes:l.files.reduce((d,m)=>d+m.size,0)})])),zn=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:sr,revision:cr,status:"ex\
ecution-candidate",format:"GGUF",capabilities:tt,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${sr}/blob\
/${cr}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:sr,
revision:cr,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${sr}/blob/${cr}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:sr,revision:cr},weightBytes:et[0].size,totalBytes:et.reduce((i,l)=>i+l.size,0),files:et},
...Jo,...Ho,...$o,...Object.fromEntries(Object.entries(Wo).map(([i,l])=>[i,{...l,status:"execution-candidate",capabilities:tt}]))}),
ea="3.8.1",nt=2048,We=1024**3;function ra(i){const l=Hi(i),d=l.model,m=Object.values(zn).filter(E=>E.model.runtime==="ll\
ama.cpp"&&E.repository===(d==null?void 0:d.repository)&&E.revision===(d==null?void 0:d.revision)&&E.model.architecture===
(d==null?void 0:d.architecture)&&E.model.task===(d==null?void 0:d.task)&&E.model.dtype===(d==null?void 0:d.dtype)),v=m.length===
1?m[0]:void 0;if(!v&&(d!=null&&d.gguf)){const E=Pn(d,{files:l.files});for(const x of Object.values(zn))if(!(x.repository!==
d.repository||x.revision!==d.revision))for(const k of x.files.filter(I=>I.path.endsWith(".gguf"))){const I=E.weights.find(
B=>B.path===k.path);if(I&&(I.size!==k.size||I.sha256!==k.sha256))throw new Error("GGUF weights do not match the pinned c\
atalog digests")}return{...E,manifest:l}}if(!v||d.runtime!=="llama.cpp"||d.runtimeVersion!==void 0&&d.runtimeVersion!==ea||
v.model.runtimeVersion!==void 0&&d.runtimeVersion!==v.model.runtimeVersion||d.dtype!==v.model.dtype||d.format!=="GGUF"||
d.task!=="text-generation")throw new Error("GGUF model revision is not in the trusted runtime catalog");const _=l.files.
filter(E=>E.path.endsWith(".gguf")),g=v.files.filter(E=>E.path.endsWith(".gguf"));if(!_.length||_.length!==g.length||_.some(
E=>!g.some(x=>x.path===E.path&&x.size===E.size&&x.sha256===E.sha256)))throw new Error("GGUF weights do not match the pin\
ned catalog digests");const G=l.files.reduce((E,x)=>E+x.size,0);if(!Number.isSafeInteger(G)||G>16*We)throw new Error("GG\
UF package exceeds its byte budget");const N=_.reduce((E,x)=>E+x.size,0)>4*We;return{manifest:l,weights:_,totalBytes:G,resourcePolicy:{
maxModelBytes:16*We,minimumCpuBytes:N?8*We:2*We,minimumGpuBytes:N?16*We:2*We}}}function ta(i,l=(d=>(d=globalThis.location)==
null?void 0:d.href)()){const m=new URL(l);if(!i||Object.keys(i).some(_=>_!=="wasm")||typeof i.wasm!="string")throw new Error(
"GGUF runtime needs one trusted WASM asset");const v=new URL(i.wasm,m);if(v.origin!==m.origin||!["http:","https:"].includes(
v.protocol)||v.username||v.password||v.search||v.hash||!v.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM \
must be a fixed same-origin asset");return{wasm:v.href}}function na(i={}){if(!i||typeof i!="object"||Array.isArray(i)||Object.
keys(i).some(d=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(d)))throw new Error("Unknown GGUF runtime optio\
n");const l={n_ctx:nt,n_batch:64,n_gpu_layers:99999,n_threads:1,...i};if(!Number.isInteger(l.n_ctx)||l.n_ctx<64||l.n_ctx>
nt||!Number.isInteger(l.n_batch)||l.n_batch<1||l.n_batch>128||!Number.isInteger(l.n_gpu_layers)||l.n_gpu_layers<1||l.n_gpu_layers>
99999||l.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(l)}async function Po({
scope:i=globalThis,gpu:l=(d=>(d=i.navigator)==null?void 0:d.gpu)()}={}){var _,g,G;if(!i.crossOriginIsolated||!i.SharedArrayBuffer)
throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const m=i.WebAssembly;if(typeof(m==null?void 0:
m.Suspending)!="function"||typeof(m==null?void 0:m.promising)!="function")throw new Error("GGUF requires WebAssembly JSP\
I");try{new m.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAss\
embly memory64")}const v=await(l==null?void 0:l.requestAdapter({powerPreference:"high-performance"}));if(!v||v.isFallbackAdapter||
(_=v.info)!=null&&_.isFallbackAdapter)throw new Error("GGUF requires a hardware WebGPU adapter");if(!v.features.has("sha\
der-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:((g=v.info)==
null?void 0:g.vendor)??"",architecture:((G=v.info)==null?void 0:G.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const Ko=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:ra,validateRuntimeAssets:ta,validateRuntimeOptions:na,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:i,maxNewTokens:l}){if(i)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(l)||l<1||l>kr.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),Sr=i=>new TextEncoder().
encode(i).byteLength;function Xo(i){if(!i.data_json||i.data_json==="null")return[];if(typeof i.data_json!="string"||Sr(i.
data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");let l;try{l=JSON.parse(i.data_json)}catch{throw new Error(
"GGUF returned invalid result JSON")}const d=Array.isArray(l)?l:[l];if(d.some(m=>!m||typeof m!="object"||Array.isArray(m)))
throw new Error("GGUF returned invalid result data");return d}function Yo(i,l){const d=i[0],m=(d==null?void 0:d.error)??
d,v=(m==null?void 0:m.n_prompt_tokens)??(d==null?void 0:d.n_prompt_tokens),_=(m==null?void 0:m.n_ctx)??(d==null?void 0:d.
n_ctx);if((m==null?void 0:m.type)==="exceed_context_size_error"&&Number.isSafeInteger(v)&&v>=_&&Number.isSafeInteger(_)&&
_>0&&_<=l)return Object.assign(new Error("GGUF native prompt exceeds the model context"),{code:"ERR_GGUF_NATIVE_CONTEXT",
inputTokens:v,contextTokens:_});const g=(m==null?void 0:m.type)==="invalid_request_error";return Object.assign(new Error(
g?"GGUF rejected the inference request":"GGUF native inference failed"),{code:g?"ERR_GGUF_NATIVE_INPUT":"ERR_GGUF_NATIVE\
_FAILURE"})}function Zo(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error("G\
GUF inference requires a ComputeManager-owned worker")}function Ln(i){var l,d,m,v,_,g,G,N,E;return{sessionId:i.sessionId,
manifestCid:i.manifestCid,status:i.lost?"lost":i.status,runtime:"llama.cpp",runtimeVersion:ea,task:"text-generation",workerId:i.
workerId,adapter:(l=i.capabilities)==null?void 0:l.adapter,runtimeAdapter:((d=i.engine)==null?void 0:d.evidence.runtimeAdapter)??
null,runtimeFeatures:((m=i.engine)==null?void 0:m.evidence.runtimeFeatures)??[],gpuDispatches:((v=i.engine)==null?void 0:
v.evidence.dispatches)??0,gpuSubmissions:((_=i.engine)==null?void 0:_.evidence.submissions)??0,gpuOffload:((g=i.engine)==
null?void 0:g.evidence.offload)??null,runtimeOptions:i.options,effectiveContextTokens:i.contextTokens??null,nativeBuffers:((G=
i.engine)==null?void 0:G.evidence.buffers)??[],wasmMemoryBytes:((N=i.engine)==null?void 0:N.memoryBytes())??0,generatedRequests:i.
generatedRequests,artifactReads:((E=i.reader)==null?void 0:E.getStats())??null}}function es({loadEngine:i=fo,createReader:l=Li,
checkCapabilities:d=Po,assertWorker:m=Zo,baseUrl:v=(_=>(_=globalThis.location)==null?void 0:_.href)()}={}){let g;async function G(E,x){
var te,V,ne;if(g)throw new Error("GGUF worker already has a resident model");const k=ra(E.manifest),I=ta(E.runtimeAssets,
v),B=na(E.runtimeOptions),F=Er(E.sessionId);me(x.signal);const R={sessionId:F,manifestCid:E.manifestCid,workerId:x.workerId??
null,manifest:k.manifest,status:"loading",options:B,generatedRequests:0,residency:new AbortController,lost:!1};g=R;try{R.
capabilities=await d(),me(x.signal),R.reader=l(E.artifactPort,{manifest:k.manifest,signal:R.residency.signal,maxReadBytes:Vn,
maxReads:1}),await Do(k.manifest.model,k.weights,R.reader,{signal:x.signal}),me(x.signal),R.engine=await i({wasmUrl:I.wasm,
weights:k.weights,reader:R.reader,signal:x.signal,collectGpuEvidence:E.collectGpuEvidence===!0,onProgress:X=>{var be;return(be=
x.emitProgress)==null?void 0:be.call(x,{...X,sessionId:F})},onLost(){var X;R.lost=!0,(X=R.active)==null||X.abort("GPU de\
vice lost")}}),me(x.signal);const ae=await R.engine.action("load",{_name:"load_req",model_paths:R.engine.files.map(X=>`m\
odels/${X.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...B,n_ubatch:Math.min(64,B.n_batch),n_parallel:1,kv_unified:!0,
log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},x.signal);if(!ae.success)throw new Error("\
GGUF native model load failed");if(!Number.isSafeInteger(ae.n_ctx)||ae.n_ctx<1||ae.n_ctx>nt)throw new Error("GGUF native\
 model returned an invalid context capacity");R.contextTokens=ae.n_ctx;const fe=R.engine.evidence.offload;if(!fe||fe.gpuLayers<
1||fe.gpuLayers!==Math.min(B.n_gpu_layers,fe.totalLayers))throw new Error("GGUF did not honor the explicitly configured \
GPU layer offload");if(me(x.signal),R.lost)throw new Error("GPU device lost during GGUF load");return R.status="ready",Ln(
R)}catch(ae){throw R.engine&&((te=x.emitProgress)==null||te.call(x,{type:"model-load-memory",sessionId:F,wasmMemoryBytes:R.
engine.memoryBytes(),nativeBuffers:R.engine.evidence.buffers??[]})),R.lost=!0,R.status="lost",R.residency.abort(ae),(V=R.
reader)==null||V.close(ae),(ne=R.engine)==null||ne.close(),ae}}async function N(E,x){var X,be,ve;const k=g;if(!k||k.sessionId!==
Er(E.sessionId)||k.lost)throw new Error("Model session lost or not loaded");if(k.status!=="ready")throw new Error("GGUF \
model session is busy");const I=Er(E.requestId),B=E.maxNewTokens??kr.maxNewTokens;Ko.validateGenerationInput({...E,maxNewTokens:B});
const F=Mi(E),R=new AbortController,te=()=>{var ie;return R.abort((ie=x.signal)==null?void 0:ie.reason)};(X=x.signal)==null||
X.addEventListener("abort",te,{once:!0}),(be=x.signal)!=null&&be.aborted&&te(),k.active=R,k.status="generating",k.requestId=
I;const V=k.engine.evidence.dispatches,ne=k.engine.evidence.submissions;let ae=0;async function fe(ie,j){var se,_e,O,q,Ve,
Be,ce,A,Ye,ze,lr,fr;let D,M=!1,u="",P=null,oe=null,ue="unknown",Y=0;try{me(R.signal);const we=await k.engine.action("com\
pletion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:ie,stream:!j,max_tokens:j?Br:B,temperature:0,cache_prompt:!1,
chat_template_kwargs:{enable_thinking:!1}}),files:[]},R.signal);if(!we.success||!Number.isSafeInteger(we.req_id)||we.req_id<
0)throw new Error("GGUF failed to start generation");D=we.req_id,me(R.signal);for(let dr=0;dr<4096;dr+=1){me(R.signal);const he=await k.
engine.action("get_result",{_name:"gres_req",req_id:D},R.signal);me(R.signal);const He=Xo(he);if(!he.success||he.is_error)
throw Yo(He,k.contextTokens);for(const Se of He){const Ze=((_e=(se=Se.choices)==null?void 0:se[0])==null?void 0:_e.finish_reason)??
Se.finish_reason;Ze!=null&&(ue=["stop","length"].includes(Ze)?Ze:"unknown");const ke=(O=Se.choices)==null?void 0:O[0],Le=((q=
ke==null?void 0:ke.delta)==null?void 0:q.content)??((Ve=ke==null?void 0:ke.message)==null?void 0:Ve.content)??Se.content??
"";if(typeof Le!="string")throw new Error("Invalid GGUF text chunk");if(j){const mr=((Be=ke==null?void 0:ke.delta)==null?
void 0:Be.reasoning_content)??((ce=ke==null?void 0:ke.message)==null?void 0:ce.reasoning_content)??"";if(typeof mr!="str\
ing")throw new Error("Invalid GGUF measurement result");if(Y+=Sr(Le)+Sr(mr),Y>kr.maxOutputBytes)throw new Error("GGUF me\
asurement exceeds its byte budget")}else{if(u+=Le,Sr(u)>kr.maxOutputBytes)throw new Error("GGUF output exceeds its byte \
budget");if(Le&&((A=x.emitProgress)==null?void 0:A.call(x,{type:"token",sessionId:k.sessionId,requestId:I,sequence:ae++,
text:Le}))===!1)throw new Error("Token consumer rejected output")}P=((Ye=Se.usage)==null?void 0:Ye.prompt_tokens)??((ze=
Se.timings)==null?void 0:ze.prompt_n)??P,oe=((lr=Se.usage)==null?void 0:lr.completion_tokens)??((fr=Se.timings)==null?void 0:
fr.predicted_n)??oe}if(!he.has_more){M=!0;break}await new Promise(Se=>setTimeout(Se,0))}if(!M)throw new Error("GGUF resu\
lt polling exceeded its request budget");if(oe!==null&&(!Number.isSafeInteger(oe)||oe<0||oe>(j?Br:B)))throw new Error("G\
GUF returned an over-budget token sequence");if(j&&(!Number.isSafeInteger(P)||P<0||oe===null))throw new Error("GGUF cont\
ext preflight did not return valid token usage");return{text:u,inputTokens:P,outputTokens:oe,finishReason:ue}}catch(we){
throw((we==null?void 0:we.name)==="RuntimeError"||/Model session lost|GPU device lost/.test((we==null?void 0:we.message)??
""))&&(k.lost=!0),we}finally{if(D!==void 0&&!k.lost)try{M||await k.engine.action("cancel",{_name:"cncl_req",req_id:D}),await k.
engine.settleGpu()}catch{throw k.lost=!0,new Error("Model session lost while settling GGUF inference")}}}try{const ie=await Mo(
{messages:F,contextTokens:k.contextTokens,reservedOutputTokens:B,signal:R.signal,async measure(D){try{const M=await fe(D,
!0);return{inputTokens:M.inputTokens,contextTokens:k.contextTokens,probeOutputTokens:M.outputTokens}}catch(M){if(M.code!==
"ERR_GGUF_NATIVE_CONTEXT")throw M;return{inputTokens:M.inputTokens,contextTokens:M.contextTokens,probeOutputTokens:0}}},
onMeasured:D=>{var M;return(M=x.emitProgress)==null?void 0:M.call(x,{type:"context-budget",sessionId:k.sessionId,requestId:I,
...D})}});me(R.signal);const j=await fe(ie.messages,!1);if(me(R.signal),k.lost)throw new Error("GPU device lost; model s\
ession is unavailable");return k.generatedRequests+=1,{sessionId:k.sessionId,requestId:I,...j,contextTruncated:ie.contextTruncated,
contextBudget:ie.contextBudget,workerId:k.workerId,gpuDispatches:k.engine.evidence.dispatches-V,gpuSubmissions:k.engine.
evidence.submissions-ne,gpuOffload:k.engine.evidence.offload,artifactReads:k.reader.getStats()}}catch(ie){throw(ie==null?
void 0:ie.name)==="RuntimeError"?(k.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(ie.message).slice(
0,300)}`)):(/Model session lost|GPU device lost/.test(ie.message??"")&&(k.lost=!0),ie)}finally{(ve=x.signal)==null||ve.removeEventListener(
"abort",te),k.active=null,k.requestId=null,k.status=k.lost?"lost":"ready"}}return async(E={},x={})=>{var I,B,F;if(m(),E.
command==="load")return G(E,x);if(E.command==="generate")return N(E,x);const k=Er(E.sessionId);if(E.command==="status")return(g==
null?void 0:g.sessionId)===k?Ln(g):{sessionId:k,status:"absent"};if(!g||g.sessionId!==k)throw new Error("Model session l\
ost or not loaded");if(E.command==="cancel")return g.requestId===E.requestId&&((I=g.active)==null||I.abort(Vi())),{sessionId:k,
cancellationRequested:!0};if(E.command==="unload"){if(g.status==="generating")throw new Error("Cancel and await GGUF gen\
eration before unloading");return g.residency.abort("GGUF unload"),(B=g.reader)==null||B.close(),(F=g.engine)==null||F.close(),
g=null,{sessionId:k,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown GGUF inference command")}}const rs=es(),
ss=(i,l)=>rs(i,l);export{es as createGgufTaskRuntime,ss as handleModelTask};

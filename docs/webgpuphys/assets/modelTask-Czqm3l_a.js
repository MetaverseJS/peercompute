var Di=Object.defineProperty;var qi=(o,u,d)=>u in o?Di(o,u,{enumerable:!0,configurable:!0,writable:!0,value:d}):o[u]=d;var Y=(o,u,d)=>qi(o,typeof u!="symbol"?u+"":u,d);import{c as zi}from"./GgufArtifactReader-C_-gweyf.js";import{normalizeModelMessages as Li}from"./modelTask-DAs-_8s_.js";
import{t as be,v as Mi,l as Qi,M as Hr,a as gr,b as Wi}from"./ArtifactReadBridge-BAWOcyZj.js";import{n as Vi}from"./ArtifactManifest-BZyREYLI.js";function Hi(o,u){var vn,wn,yn,En,kn,Sn;const d=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};
var b=!!globalThis.window,y=!!globalThis.WorkerGlobalScope,w=((wn=(vn=globalThis.process)==null?void 0:vn.versions)==null?
void 0:wn.node)&&((yn=globalThis.process)==null?void 0:yn.type)!="renderer",h=y&&((En=self.name)==null?void 0:En.startsWith(
"em-pthread"));if(w){var N=require("worker_threads");global.Worker=N.Worker,y=!N.isMainThread,h=y&&N.workerData=="em-pth\
read"}var G="./this.program",E=(e,r)=>{throw r},B=(Sn=(kn=globalThis.document)==null?void 0:kn.currentScript)==null?void 0:
Sn.src;typeof __filename<"u"?B=__filename:y&&(B=self.location.href);var S="";function I(e){return o.locateFile?o.locateFile(
e,S):S+e}var x,F;if(w){var j=require("fs");S=__dirname+"/",F=e=>{e=X(e)?new URL(e):e;var r=j.readFileSync(e);return r},x=
async(e,r=!0)=>{e=X(e)?new URL(e):e;var t=j.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(G=process.
argv[1].replace(/\\/g,"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=o),E=(e,r)=>{throw process.exitCode=
e,r}}else if(b||y){try{S=new URL(".",B).href}catch{}w||(y&&(F=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType=
"arraybuffer",r.send(null),new Uint8Array(r.response)}),x=async e=>{if(X(e))return new Promise((t,n)=>{var i=new XMLHttpRequest;
i.open("GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}
n(i.status)},i.onerror=n,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();
throw new Error(r.status+" : "+r.url)})}var ne=console.log.bind(console),W=console.error.bind(console);if(w){var ae=require("util"),
oe=e=>typeof e=="object"?ae.inspect(e):e;ne=(...e)=>j.writeSync(1,e.map(oe).join(" ")+`
`),W=(...e)=>j.writeSync(2,e.map(oe).join(" ")+`
`)}var se=ne,K=W,_e,pe,ge=!1,q;function z(e,r){e||ye(r)}var X=e=>e.startsWith("file://");function l(){Ie.buffer!=Z.buffer&&
Be()}if(w&&h){var P=N.parentPort;P.on("message",e=>{var r;return(r=global.onmessage)==null?void 0:r.call(global,{data:e})}),
Object.assign(globalThis,{self:global,postMessage:e=>P.postMessage(e)}),process.on("uncaughtException",e=>{postMessage({
cmd:"uncaughtException",error:e}),process.exit(1)})}var de;if(h){var ce=!1;self.onunhandledrejection=r=>{throw r.reason||
r};async function e(r){try{var t=r.data,n=t.cmd;if(n==="load"){let i=[];self.onmessage=s=>i.push(s),de=()=>{postMessage(
{cmd:"loaded"});for(let s of i)e(s);self.onmessage=e};for(const s of t.handlers)(!o[s]||o[s].proxy)&&(o[s]=(...c)=>{postMessage(
{cmd:"callHandler",handler:s,args:c})},s=="print"&&(se=o[s]),s=="printErr"&&(K=o[s]));Ie=t.wasmMemory,Be(),pe=t.wasmModule,
Yr(),pr()}else if(n==="run"){aa(t.pthread_ptr),Mr(t.pthread_ptr,0,0,1,0,0),J.threadInitTLS(),Fr(t.pthread_ptr),ce||(ce=!0);
try{await ft(t.start_routine,t.arg)}catch(i){if(i!="unwind")throw i}}else t.target==="setimmediate"||(n==="checkMailbox"?
ce&&ur():n&&(K(`worker: received unknown command ${n}`),K(t)))}catch(i){throw cn(),i}}self.onmessage=e}var Z,ie,he,R,O,We,
ke,V,A,Se=!1;function Be(){var e=Ie.buffer;Z=new Int8Array(e),he=new Int16Array(e),o.HEAPU8=ie=new Uint8Array(e),R=new Int32Array(
e),O=new Uint32Array(e),We=new Float32Array(e),ke=new Float64Array(e),V=new BigInt64Array(e),A=new BigUint64Array(e)}function xe(){
if(!h){if(o.wasmMemory)Ie=o.wasmMemory;else{var e=o.INITIAL_MEMORY||134217728;Ie=new WebAssembly.Memory({initial:BigInt(
e/65536),maximum:65536n,shared:!0,address:"i64"})}Be()}}function Ke(){if(o.preRun)for(typeof o.preRun=="function"&&(o.preRun=
[o.preRun]);o.preRun.length;)at(o.preRun.shift());tt(nt)}function ze(){if(Se=!0,h)return de();!o.noFSInit&&!a.initialized&&
a.init(),Re.__wasm_call_ctors(),a.ignorePermissions=!1}function Xn(){if(!h){if(o.postRun)for(typeof o.postRun=="function"&&
(o.postRun=[o.postRun]);o.postRun.length;)na(o.postRun.shift());tt(lt)}}function ye(e){var t;(t=o.onAbort)==null||t.call(
o,e),e="Aborted("+e+")",K(e),ge=!0,e+=". Build with -sASSERTIONS for more info.",Se&&mn();var r=new WebAssembly.RuntimeError(
e);throw r}var br;function Yn(){return I("wllama.wasm")}function Zn(e){if(e==br&&_e)return new Uint8Array(_e);if(F)return F(
e);throw"both async and sync fetching of the wasm failed"}async function ea(e){if(!_e)try{var r=await x(e);return new Uint8Array(
r)}catch{}return Zn(e)}async function ra(e,r){try{var t=await ea(e),n=await WebAssembly.instantiate(t,r);return n}catch(i){
K(`failed to asynchronously prepare wasm: ${i}`),ye(i)}}async function ta(e,r,t){if(!e&&!X(r)&&!w)try{var n=fetch(r,{credentials:"\
same-origin"}),i=await WebAssembly.instantiateStreaming(n,t);return i}catch(s){K(`wasm streaming compile failed: ${s}`),
K("falling back to ArrayBuffer instantiation")}return ra(r,t)}function Xr(){Ri(),Pe.__instrumented||(Pe.__instrumented=!0,
Ee.instrumentWasmImports(Pe));var e={env:Pe,wasi_snapshot_preview1:Pe};return e}async function Yr(){function e(c,f){return Re=
c.exports,Re=Ee.instrumentWasmExports(Re),Re=ji(Re),ia(Re._emscripten_tls_init),Ui(Re),pe=f,sr(),Re}cr();function r(c){return e(
c.instance,c.module)}var t=Xr();if(o.instantiateWasm)return new Promise((c,f)=>{o.instantiateWasm(t,(p,k)=>{c(e(p,k))})});
if(h){var n=new WebAssembly.Instance(pe,Xr());return e(n,pe)}br??(br=Yn());var i=await ta(_e,br,t),s=r(i);return s}class Zr{constructor(r){
Y(this,"name","ExitStatus");this.message=`Program terminated with exit(${r})`,this.status=r}}var et=e=>{e.terminate(),e.
onmessage=r=>{}},rt=e=>{var r=J.pthreads[e];J.returnWorkerToPool(r)},tt=e=>{for(;e.length>0;)e.shift()(o)},nt=[],at=e=>nt.
push(e),Le=0,Xe=null,sr=e=>{var t;if(Le--,(t=o.monitorRunDependencies)==null||t.call(o,Le),Le==0&&Xe){var r=Xe;Xe=null,r()}},
cr=e=>{var r;Le++,(r=o.monitorRunDependencies)==null||r.call(o,Le)},it=e=>{var r=J.getNewWorker();if(!r)return 6;J.runningWorkers.
push(r),J.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,
pthread_ptr:e.pthread_ptr};return w&&r.unref(),r.postMessage(t,e.transferList),0},lr=0,_r=()=>Er||lr>0,Ne=()=>bn(),Ge=e=>gn(
e),vr=e=>hn(e),fe=(e,r,t,...n)=>{for(var i=n.length*2,s=Ne(),c=vr(i*8),f=c/8,p=0;p<n.length;p++){var k=n[p];typeof k=="b\
igint"?((l(),V)[f+2*p]=1n,(l(),V)[f+2*p+1]=k):((l(),V)[f+2*p]=0n,(l(),ke)[f+2*p+1]=k)}var v=ln(e,r,i,c,t);return Ge(s),v};
function ot(e){var r;if(h)return fe(0,0,1,e);q=e,_r()||(J.terminateAllThreads(),(r=o.onExit)==null||r.call(o,e),ge=!0),E(
e,new Zr(e))}function st(e){if(h)return fe(1,0,0,e);wr(e)}var ct=(e,r)=>{if(q=e,h)throw st(e),"unwind";ot(e)},wr=ct,J={unusedWorkers:[],
runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){h||J.initMainThread()},initMainThread(){for(var e=o.pthreadPoolSize;e--;)
J.allocateUnusedWorker();at(async()=>{var r=J.loadWasmModuleToAllWorkers();cr(),await r,sr()})},terminateAllThreads:()=>{
for(var e of J.runningWorkers)et(e);for(var e of J.unusedWorkers)et(e);J.unusedWorkers=[],J.runningWorkers=[],J.pthreads=
{}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete J.pthreads[r],J.unusedWorkers.push(e),J.runningWorkers.splice(J.runningWorkers.
indexOf(e),1),e.pthread_ptr=0,un(r)},threadInitTLS(){J.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(
r=>{e.onmessage=s=>{var c=s.data,f=c.cmd;if(c.targetThread&&c.targetThread!=mr()){var p=J.pthreads[c.targetThread];p?p.postMessage(
c,c.transferList):K(`Internal error! Worker sent a message "${f}" to target pthread ${c.targetThread}, but that thread n\
o longer exists!`);return}f==="checkMailbox"?ur():f==="spawnThread"?it(c):f==="cleanupThread"?Ce(()=>rt(c.thread)):f==="\
loaded"?(e.loaded=!0,w&&!e.pthread_ptr&&e.unref(),r(e)):c.target==="setimmediate"?e.postMessage(c):f==="uncaughtExceptio\
n"?e.onerror(c.error):f==="callHandler"?o[c.handler](...c.args):f&&K(`worker sent an unknown command ${f}`)},e.onerror=s=>{
var c="worker sent an error!";throw K(`${c} ${s.filename}:${s.lineno}: ${s.message}`),s},w&&(e.on("message",s=>e.onmessage(
{data:s})),e.on("error",s=>e.onerror(s)));var t=[],n=["onExit","onAbort","print","printErr"];for(var i of n)o.propertyIsEnumerable(
i)&&t.push(i);e.postMessage({cmd:"load",handlers:t,wasmMemory:Ie,wasmModule:pe})}),async loadWasmModuleToAllWorkers(){return h?
void 0:Promise.all(J.unusedWorkers.map(J.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=B;o.mainScriptUrlOrBlob&&
(r=o.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new d(r,{workerData:"em-pthread",name:"em-pth\
read"}),J.unusedWorkers.push(e)},getNewWorker(){return J.unusedWorkers.length==0&&(J.allocateUnusedWorker(),J.loadWasmModuleToWorker(
J.unusedWorkers[0])),J.unusedWorkers.pop()}},lt=[],na=e=>lt.push(e);function aa(e){var r=Number((l(),A)[(e+88)/8]),t=Number(
(l(),A)[(e+96)/8]),n=r-t;pn(r,n),Ge(r)}var yr=[],ut=e=>{e=Number(e);var r=yr[e];return r||(yr[e]=r=_n.get(BigInt(e)),Ee.
isAsyncExport(r)&&(yr[e]=r=Ee.makeAsyncFunction(r))),r},ft=async(e,r)=>{lr=0,Er=0;var t=(i=>WebAssembly.promising(ut(e)).
call(null,BigInt(i)))(r);function n(i){if(_r()){q=i;return}Qr(i)}t=await t,n(t)};ft.isAsync=!0;var Er=!0,ia=e=>J.tlsInitFunctions.
push(e),Ie;function dt(e,r,t,n){return h?fe(2,0,1,e,r,t,n):mt(e,r,t,n)}var oa=()=>!!globalThis.SharedArrayBuffer,sa=9007199254740992,
ca=-9007199254740992,_=e=>e<ca||e>sa?NaN:Number(e);function mt(e,r,t,n){if(e=_(e),r=_(r),t=_(t),n=_(n),!oa())return 6;var i=[],
s=0;if(h&&(i.length===0||s))return dt(e,r,t,n);var c={startRoutine:t,pthread_ptr:e,arg:n,transferList:i};return h?(c.cmd=
"spawnThread",postMessage(c,i),0):it(c)}var Ve=()=>{var e=Number((l(),A)[re.varargs/8]);return re.varargs+=8,e},kr=()=>{
var e=(l(),R)[+re.varargs/4];return re.varargs+=4,e},ee={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var i=e[n];i==="."?e.splice(n,1):i===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=ee.isAbs(e),
t=e.slice(-1)==="/";return e=ee.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),
(r?"/":"")+e},dirname:e=>{var r=ee.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&
e.match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>ee.normalize(e.join("/")),join2:(e,r)=>ee.normalize(e+"/"+r)},la=()=>e=>e.set(
crypto.getRandomValues(new Uint8Array(e.byteLength))),Sr=e=>{(Sr=la())(e)},He={resolve:(...e)=>{for(var r="",t=!1,n=e.length-
1;n>=-1&&!t;n--){var i=n>=0?e[n]:a.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be st\
rings");if(!i)return"";r=i+"/"+r,t=ee.isAbs(i)}return r=ee.normalizeArray(r.split("/").filter(s=>!!s),!t).join("/"),(t?"\
/":"")+r||"."},relative:(e,r)=>{e=He.resolve(e).slice(1),r=He.resolve(r).slice(1);function t(k){for(var v=0;v<k.length&&
k[v]==="";v++);for(var C=k.length-1;C>=0&&k[C]==="";C--);return v>C?[]:k.slice(v,C-v+1)}for(var n=t(e.split("/")),i=t(r.
split("/")),s=Math.min(n.length,i.length),c=s,f=0;f<s;f++)if(n[f]!==i[f]){c=f;break}for(var p=[],f=c;f<n.length;f++)p.push(
"..");return p=p.concat(i.slice(c)),p.join("/")}},pt=globalThis.TextDecoder&&new TextDecoder,ua=(e,r,t,n)=>{for(var i=r+
t;e[r]&&!(r>=i);)++r;return r},$e=(e,r=0,t,n)=>{var i=ua(e,r,t);if(i-r>16&&e.buffer&&pt)return pt.decode(e.buffer instanceof
ArrayBuffer?e.subarray(r,i):e.slice(r,i));for(var s="";r<i;){var c=e[r++];if(!(c&128)){s+=String.fromCharCode(c);continue}
var f=e[r++]&63;if((c&224)==192){s+=String.fromCharCode((c&31)<<6|f);continue}var p=e[r++]&63;if((c&240)==224?c=(c&15)<<
12|f<<6|p:c=(c&7)<<18|f<<12|p<<6|e[r++]&63,c<65536)s+=String.fromCharCode(c);else{var k=c-65536;s+=String.fromCharCode(55296|
k>>10,56320|k&1023)}}return s},Br=[],Ae=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=
2:n>=55296&&n<=57343?(r+=4,++t):r+=3}return r},gt=(e,r,t,n)=>{if(!(n>0))return 0;for(var i=t,s=t+n-1,c=0;c<e.length;++c){
var f=e.codePointAt(c);if(f<=127){if(t>=s)break;r[t++]=f}else if(f<=2047){if(t+1>=s)break;r[t++]=192|f>>6,r[t++]=128|f&63}else if(f<=
65535){if(t+2>=s)break;r[t++]=224|f>>12,r[t++]=128|f>>6&63,r[t++]=128|f&63}else{if(t+3>=s)break;r[t++]=240|f>>18,r[t++]=
128|f>>12&63,r[t++]=128|f>>6&63,r[t++]=128|f&63,c++}}return r[t]=0,t-i},xr=(e,r,t)=>{var n=Ae(e)+1,i=new Array(n),s=gt(e,
i,0,i.length);return i.length=s,i},fa=()=>{var s;if(!Br.length){var e=null;if(w){var r=256,t=Buffer.alloc(r),n=0,i=process.
stdin.fd;try{n=j.readSync(i,t,0,r)}catch(c){if(c.toString().includes("EOF"))n=0;else throw c}n>0&&(e=t.slice(0,n).toString(
"utf-8"))}else(s=globalThis.window)!=null&&s.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;Br=xr(e)}return Br.shift()},Me={ttys:[],init(){},shutdown(){},register(e,r){Me.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Me.stream_ops)},stream_ops:{open(e){var r=Me.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,i){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var s=0,c=0;c<n;c++){var f;try{f=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(f===void 0&&s===0)throw new a.ErrnoError(6);if(f==null)break;s++,r[t+c]=f}return s&&(e.node.atime=Date.
now()),s},write(e,r,t,n,i){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var s=0;s<n;s++)e.tty.ops.put_char(
e.tty,r[t+s])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),s}},default_tty_ops:{get_char(e){
return fa()},put_char(e,r){r===null||r===10?(se($e(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){var r;((r=e.
output)==null?void 0:r.length)>0&&(se($e(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,
c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},
ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(K($e(e.output)),e.output=[]):r!=0&&
e.output.push(r)},fsync(e){var r;((r=e.output)==null?void 0:r.length)>0&&(K($e(e.output)),e.output=[])}}},da=(e,r)=>(l(),
ie).fill(0,e,e+r),ht=(e,r)=>Math.ceil(e/r)*r,Nr=e=>{e=ht(e,65536);var r=sn(65536,e);return r&&da(r,e),r},L={ops_table:null,
mount(e){return L.createNode(null,"/",16895,0)},createNode(e,r,t,n){if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(
63);L.ops_table||(L.ops_table={dir:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr,lookup:L.node_ops.lookup,
mknod:L.node_ops.mknod,rename:L.node_ops.rename,unlink:L.node_ops.unlink,rmdir:L.node_ops.rmdir,readdir:L.node_ops.readdir,
symlink:L.node_ops.symlink},stream:{llseek:L.stream_ops.llseek}},file:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.
setattr},stream:{llseek:L.stream_ops.llseek,read:L.stream_ops.read,write:L.stream_ops.write,mmap:L.stream_ops.mmap,msync:L.
stream_ops.msync}},link:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr,readlink:L.node_ops.readlink},stream:{}},
chrdev:{node:{getattr:L.node_ops.getattr,setattr:L.node_ops.setattr},stream:a.chrdev_stream_ops}});var i=a.createNode(e,
r,t,n);return a.isDir(i.mode)?(i.node_ops=L.ops_table.dir.node,i.stream_ops=L.ops_table.dir.stream,i.contents={}):a.isFile(
i.mode)?(i.node_ops=L.ops_table.file.node,i.stream_ops=L.ops_table.file.stream,i.usedBytes=0,i.contents=null):a.isLink(i.
mode)?(i.node_ops=L.ops_table.link.node,i.stream_ops=L.ops_table.link.stream):a.isChrdev(i.mode)&&(i.node_ops=L.ops_table.
chrdev.node,i.stream_ops=L.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.atime=e.mtime=
e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):
new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=r)){var n=1024*
1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(r),e.usedBytes>
0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=null,e.usedBytes=
0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),e.usedBytes=
r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,r.uid=0,r.gid=
0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.link.length:r.
size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=Math.ceil(r.
size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==void 0&&
L.resizeFileStorage(e,r.size)},lookup(e,r){throw L.doesNotExistError||(L.doesNotExistError=new a.ErrnoError(44),L.doesNotExistError.
stack="<generic error, no stack>"),L.doesNotExistError},mknod(e,r,t,n){return L.createNode(e,r,t,n)},rename(e,r,t){var n;
try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var i in n.contents)throw new a.ErrnoError(55);a.hashRemoveNode(
n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,r){
delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.contents)throw new a.
ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.keys(e.contents)]},
symlink(e,r,t){var n=L.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.ErrnoError(
28);return e.link}},stream_ops:{read(e,r,t,n,i){var s=e.node.contents;if(i>=e.node.usedBytes)return 0;var c=Math.min(e.node.
usedBytes-i,n);if(c>8&&s.subarray)r.set(s.subarray(i,i+c),t);else for(var f=0;f<c;f++)r[t+f]=s[i+f];return c},write(e,r,t,n,i,s){
if(r.buffer===(l(),Z).buffer&&(s=!1),!n)return 0;var c=e.node;if(c.mtime=c.ctime=Date.now(),r.subarray&&(!c.contents||c.
contents.subarray)){if(s)return c.contents=r.subarray(t,t+n),c.usedBytes=n,n;if(c.usedBytes===0&&i===0)return c.contents=
r.slice(t,t+n),c.usedBytes=n,n;if(i+n<=c.usedBytes)return c.contents.set(r.subarray(t,t+n),i),n}if(L.expandFileStorage(c,
i+n),c.contents.subarray&&r.subarray)c.contents.set(r.subarray(t,t+n),i);else for(var f=0;f<n;f++)c.contents[i+f]=r[t+f];
return c.usedBytes=Math.max(c.usedBytes,i+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,i){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var s,c,f=e.node.contents;if(!(i&2)&&f&&f.buffer===(l(),Z).buffer)c=!1,s=f.byteOffset;else{if(c=!0,s=Nr(r),!s)throw new a.
ErrnoError(48);f&&((t>0||t+r<f.length)&&(f.subarray?f=f.subarray(t,t+r):f=Array.prototype.slice.call(f,t,t+r)),(l(),Z).set(
f,s))}return{ptr:s,allocated:c}},msync(e,r,t,n,i){return L.stream_ops.write(e,r,0,n,t,!1),0}}},ma=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},Gr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},pa=async e=>{var r=await x(e);return new Uint8Array(r)},bt=(...e)=>a.createDataFile(
...e),_t=[],ga=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of _t)if(t.canHandle(r))return t.handle(e,r);return e},
Ir=async(e,r,t,n,i,s,c,f)=>{var p=r?He.resolve(ee.join2(e,r)):e;cr();try{var k=t;typeof t=="string"&&(k=await pa(t)),k=await ga(
k,p),f==null||f(),s||bt(e,r,k,n,i,c)}finally{sr()}},ha=(e,r,t,n,i,s,c,f,p,k)=>{Ir(e,r,t,n,i,f,p,k).then(s).catch(c)},a={
root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,
filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{constructor(e){Y(this,"name","ErrnoError");this.errno=e}},
FSStream:class{constructor(){Y(this,"shared",{})}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.
flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.
shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=
e}},FSNode:class{constructor(e,r,t,n){Y(this,"node_ops",{});Y(this,"stream_ops",{});Y(this,"readMode",365);Y(this,"write\
Mode",146);Y(this,"mounted",null);e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.mode=
t,this.rdev=n,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){
e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){
e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.
isChrdev(this.mode)}},lookupPath(e,r={}){if(!e)throw new a.ErrnoError(44);r.follow_mount??(r.follow_mount=!0),ee.isAbs(e)||
(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split("/").filter(k=>!!k),i=a.root,s="/",c=0;c<n.length;c++){var f=c===
n.length-1;if(f&&r.parent)break;if(n[c]!=="."){if(n[c]===".."){if(s=ee.dirname(s),a.isRoot(i)){e=s+"/"+n.slice(c+1).join(
"/"),t--;continue e}else i=i.parent;continue}s=ee.join2(s,n[c]);try{i=a.lookupNode(i,n[c])}catch(k){if((k==null?void 0:k.
errno)===44&&f&&r.noent_okay)return{path:s};throw k}if(a.isMountpoint(i)&&(!f||r.follow_mount)&&(i=i.mounted.root),a.isLink(
i.mode)&&(!f||r.follow)){if(!i.node_ops.readlink)throw new a.ErrnoError(52);var p=i.node_ops.readlink(i);ee.isAbs(p)||(p=
ee.dirname(s)+"/"+p),e=p+"/"+n.slice(c+1).join("/");continue e}}}return{path:s,node:i}}throw new a.ErrnoError(32)},getPath(e){
for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:
e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.
length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){
var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=e.name_next;else for(var t=a.nameTable[r];t;){
if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){var t=a.mayLookup(e);if(t)throw new a.
ErrnoError(t);for(var n=a.hashName(e.id,r),i=a.nameTable[n];i;i=i.name_next){var s=i.name;if(i.parent.id===e.id&&s===r)return i}
return a.lookup(e,r)},createNode(e,r,t,n){var i=new a.FSNode(e,r,t,n);return a.hashAddNode(i),i},destroyNode(e){a.hashRemoveNode(
e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&
61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},
isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var r=["r","w","rw"][e&
3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?0:r.includes("r")&&!(e.mode&292)||r.includes(
"w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.isDir(e.mode))return 54;var r=a.nodePermissions(
e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))return 54;try{var t=a.lookupNode(e,r);return 20}catch{}
return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.lookupNode(e,r)}catch(s){return s.errno}var i=a.nodePermissions(
e,"wx");if(i)return i;if(t){if(!a.isDir(n.mode))return 54;if(a.isRoot(n)||a.getPath(n)===a.cwd())return 10}else if(a.isDir(
n.mode))return 31;return 0},mayOpen(e,r){return e?a.isLink(e.mode)?32:a.isDir(e.mode)&&(a.flagsToPermissionString(r)!=="\
r"||r&576)?31:a.nodePermissions(e,a.flagsToPermissionString(r)):44},checkOpExists(e,r){if(!e)throw new a.ErrnoError(r);return e},
MAX_OPEN_FDS:4096,nextfd(){for(var e=0;e<=a.MAX_OPEN_FDS;e++)if(!a.streams[e])return e;throw new a.ErrnoError(33)},getStreamChecked(e){
var r=a.getStream(e);if(!r)throw new a.ErrnoError(8);return r},getStream:e=>a.streams[e],createStream(e,r=-1){return e=Object.
assign(new a.FSStream,e),r==-1&&(r=a.nextfd()),e.fd=r,a.streams[r]=e,e},closeStream(e){a.streams[e]=null},dupStream(e,r=-1){
var n,i;var t=a.createStream(e,r);return(i=(n=t.stream_ops)==null?void 0:n.dup)==null||i.call(n,t),t},doSetAttr(e,r,t){var n=e==
null?void 0:e.stream_ops.setattr,i=n?e:r;n??(n=r.node_ops.setattr),a.checkOpExists(n,63),n(i,t)},chrdev_stream_ops:{open(e){
var t,n;var r=a.getDevice(e.node.rdev);e.stream_ops=r.stream_ops,(n=(t=e.stream_ops).open)==null||n.call(t,e)},llseek(){
throw new a.ErrnoError(70)}},major:e=>e>>8,minor:e=>e&255,makedev:(e,r)=>e<<8|r,registerDevice(e,r){a.devices[e]={stream_ops:r}},
getDevice:e=>a.devices[e],getMounts(e){for(var r=[],t=[e];t.length;){var n=t.pop();r.push(n),t.push(...n.mounts)}return r},
syncfs(e,r){typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&K(`warning: ${a.syncFSRequests} FS.s\
yncfs operations in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function i(f){return a.
syncFSRequests--,r(f)}function s(f){if(f)return s.errored?void 0:(s.errored=!0,i(f));++n>=t.length&&i(null)}for(var c of t)
c.type.syncfs?c.type.syncfs(c,e,s):s(null)},mount(e,r,t){var n=t==="/",i=!t,s;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&
!i){var c=a.lookupPath(t,{follow_mount:!1});if(t=c.path,s=c.node,a.isMountpoint(s))throw new a.ErrnoError(10);if(!a.isDir(
s.mode))throw new a.ErrnoError(54)}var f={type:e,opts:r,mountpoint:t,mounts:[]},p=e.mount(f);return p.mount=f,f.root=p,n?
a.root=p:s&&(s.mounted=f,s.mount&&s.mount.mounts.push(f)),p},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(
r.node))throw new a.ErrnoError(28);var t=r.node,n=t.mounted,i=a.getMounts(n);for(var[s,c]of Object.entries(a.nameTable))
for(;c;){var f=c.name_next;i.includes(c.mount)&&a.destroyNode(c),c=f}t.mounted=null;var p=t.mount.mounts.indexOf(n);t.mount.
mounts.splice(p,1)},lookup(e,r){return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),i=n.node,s=ee.
basename(e);if(!s)throw new a.ErrnoError(28);if(s==="."||s==="..")throw new a.ErrnoError(20);var c=a.mayCreate(i,s);if(c)
throw new a.ErrnoError(c);if(!i.node_ops.mknod)throw new a.ErrnoError(63);return i.node_ops.mknod(i,s,r,t)},statfs(e){return a.
statfsNode(a.lookupPath(e,{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,
frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.
node_ops.statfs&&Object.assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(
e,r,0)},mkdir(e,r=511){return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var i of t)if(i){
(n||ee.isAbs(e))&&(n+="/"),n+=i;try{a.mkdir(n,r)}catch(s){if(s.errno!=20)throw s}}},mkdev(e,r,t){return typeof t>"u"&&(t=
r,r=438),r|=8192,a.mknod(e,r,t)},symlink(e,r){if(!He.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),
n=t.node;if(!n)throw new a.ErrnoError(44);var i=ee.basename(r),s=a.mayCreate(n,i);if(s)throw new a.ErrnoError(s);if(!n.node_ops.
symlink)throw new a.ErrnoError(63);return n.node_ops.symlink(n,i,e)},rename(e,r){var t=ee.dirname(e),n=ee.dirname(r),i=ee.
basename(e),s=ee.basename(r),c,f,p;if(c=a.lookupPath(e,{parent:!0}),f=c.node,c=a.lookupPath(r,{parent:!0}),p=c.node,!f||
!p)throw new a.ErrnoError(44);if(f.mount!==p.mount)throw new a.ErrnoError(75);var k=a.lookupNode(f,i),v=He.relative(e,n);
if(v.charAt(0)!==".")throw new a.ErrnoError(28);if(v=He.relative(r,t),v.charAt(0)!==".")throw new a.ErrnoError(55);var C;
try{C=a.lookupNode(p,s)}catch{}if(k!==C){var U=a.isDir(k.mode),T=a.mayDelete(f,i,U);if(T)throw new a.ErrnoError(T);if(T=
C?a.mayDelete(p,s,U):a.mayCreate(p,s),T)throw new a.ErrnoError(T);if(!f.node_ops.rename)throw new a.ErrnoError(63);if(a.
isMountpoint(k)||C&&a.isMountpoint(C))throw new a.ErrnoError(10);if(p!==f&&(T=a.nodePermissions(f,"w"),T))throw new a.ErrnoError(
T);a.hashRemoveNode(k);try{f.node_ops.rename(k,p,s),k.parent=p}catch(M){throw M}finally{a.hashAddNode(k)}}},rmdir(e){var r=a.
lookupPath(e,{parent:!0}),t=r.node,n=ee.basename(e),i=a.lookupNode(t,n),s=a.mayDelete(t,n,!0);if(s)throw new a.ErrnoError(
s);if(!t.node_ops.rmdir)throw new a.ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),
a.destroyNode(i)},readdir(e){var r=a.lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(
t)},unlink(e){var r=a.lookupPath(e,{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=ee.basename(e),i=a.lookupNode(
t,n),s=a.mayDelete(t,n,!1);if(s)throw new a.ErrnoError(s);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(
i))throw new a.ErrnoError(10);t.node_ops.unlink(t,n),a.destroyNode(i)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)
throw new a.ErrnoError(44);if(!t.node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.
lookupPath(e,{follow:!r}),n=t.node,i=a.checkOpExists(n.node_ops.getattr,63);return i(n)},fstat(e){var r=a.getStreamChecked(
e),t=r.node,n=r.stream_ops.getattr,i=n?r:t;return n??(n=t.node_ops.getattr),a.checkOpExists(n,63),n(i)},lstat(e){return a.
stat(e,!0)},doChmod(e,r,t,n){a.doSetAttr(e,r,{mode:t&4095|r.mode&-4096,ctime:Date.now(),dontFollow:n})},chmod(e,r,t){var n;
if(typeof e=="string"){var i=a.lookupPath(e,{follow:!t});n=i.node}else n=e;a.doChmod(null,n,r,t)},lchmod(e,r){a.chmod(e,
r,!0)},fchmod(e,r){var t=a.getStreamChecked(e);a.doChmod(t,t.node,r,!1)},doChown(e,r,t){a.doSetAttr(e,r,{timestamp:Date.
now(),dontFollow:t})},chown(e,r,t,n){var i;if(typeof e=="string"){var s=a.lookupPath(e,{follow:!n});i=s.node}else i=e;a.
doChown(null,i,n)},lchown(e,r,t){a.chown(e,r,t,!0)},fchown(e,r,t){var n=a.getStreamChecked(e);a.doChown(n,n.node,!1)},doTruncate(e,r,t){
if(a.isDir(r.mode))throw new a.ErrnoError(31);if(!a.isFile(r.mode))throw new a.ErrnoError(28);var n=a.nodePermissions(r,
"w");if(n)throw new a.ErrnoError(n);a.doSetAttr(e,r,{size:t,timestamp:Date.now()})},truncate(e,r){if(r<0)throw new a.ErrnoError(
28);var t;if(typeof e=="string"){var n=a.lookupPath(e,{follow:!0});t=n.node}else t=e;a.doTruncate(null,t,r)},ftruncate(e,r){
var t=a.getStreamChecked(e);if(r<0||(t.flags&2097155)===0)throw new a.ErrnoError(28);a.doTruncate(t,t.node,r)},utime(e,r,t){
var n=a.lookupPath(e,{follow:!0}),i=n.node,s=a.checkOpExists(i.node_ops.setattr,63);s(i,{atime:r,mtime:t})},open(e,r,t=438){
if(e==="")throw new a.ErrnoError(44);r=typeof r=="string"?ma(r):r,r&64?t=t&4095|32768:t=0;var n,i;if(typeof e=="object")
n=e;else{i=e.endsWith("/");var s=a.lookupPath(e,{follow:!(r&131072),noent_okay:!0});n=s.node,e=s.path}var c=!1;if(r&64)if(n){
if(r&128)throw new a.ErrnoError(20)}else{if(i)throw new a.ErrnoError(31);n=a.mknod(e,t|511,0),c=!0}if(!n)throw new a.ErrnoError(
44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(n.mode))throw new a.ErrnoError(54);if(!c){var f=a.mayOpen(n,r);if(f)
throw new a.ErrnoError(f)}r&512&&!c&&a.truncate(n,0),r&=-131713;var p=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,
position:0,stream_ops:n.stream_ops,ungotten:[],error:!1});return p.stream_ops.open&&p.stream_ops.open(p),c&&a.chmod(n,t&
511),o.logReadFiles&&!(r&1)&&(e in a.readFiles||(a.readFiles[e]=1)),p},close(e){if(a.isClosed(e))throw new a.ErrnoError(
8);e.getdents&&(e.getdents=null);try{e.stream_ops.close&&e.stream_ops.close(e)}catch(r){throw r}finally{a.closeStream(e.
fd)}e.fd=null},isClosed(e){return e.fd===null},llseek(e,r,t){if(a.isClosed(e))throw new a.ErrnoError(8);if(!e.seekable||
!e.stream_ops.llseek)throw new a.ErrnoError(70);if(t!=0&&t!=1&&t!=2)throw new a.ErrnoError(28);return e.position=e.stream_ops.
llseek(e,r,t),e.ungotten=[],e.position},read(e,r,t,n,i){if(n<0||i<0)throw new a.ErrnoError(28);if(a.isClosed(e))throw new a.
ErrnoError(8);if((e.flags&2097155)===1)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))throw new a.ErrnoError(31);if(!e.
stream_ops.read)throw new a.ErrnoError(28);var s=typeof i<"u";if(!s)i=e.position;else if(!e.seekable)throw new a.ErrnoError(
70);var c=e.stream_ops.read(e,r,t,n,i);return s||(e.position+=c),c},write(e,r,t,n,i,s){if(n<0||i<0)throw new a.ErrnoError(
28);if(a.isClosed(e))throw new a.ErrnoError(8);if((e.flags&2097155)===0)throw new a.ErrnoError(8);if(a.isDir(e.node.mode))
throw new a.ErrnoError(31);if(!e.stream_ops.write)throw new a.ErrnoError(28);e.seekable&&e.flags&1024&&a.llseek(e,0,2);var c=typeof i<
"u";if(!c)i=e.position;else if(!e.seekable)throw new a.ErrnoError(70);var f=e.stream_ops.write(e,r,t,n,i,s);return c||(e.
position+=f),f},mmap(e,r,t,n,i){if((n&2)!==0&&(i&2)===0&&(e.flags&2097155)!==2)throw new a.ErrnoError(2);if((e.flags&2097155)===
1)throw new a.ErrnoError(2);if(!e.stream_ops.mmap)throw new a.ErrnoError(43);if(!r)throw new a.ErrnoError(28);return e.stream_ops.
mmap(e,r,t,n,i)},msync(e,r,t,n,i){return e.stream_ops.msync?e.stream_ops.msync(e,r,t,n,i):0},ioctl(e,r,t){if(!e.stream_ops.
ioctl)throw new a.ErrnoError(59);return e.stream_ops.ioctl(e,r,t)},readFile(e,r={}){r.flags=r.flags||0,r.encoding=r.encoding||
"binary",r.encoding!=="utf8"&&r.encoding!=="binary"&&ye(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),
n=a.stat(e),i=n.size,s=new Uint8Array(i);return a.read(t,s,0,i,0),r.encoding==="utf8"&&(s=$e(s)),a.close(t),s},writeFile(e,r,t={}){
t.flags=t.flags||577;var n=a.open(e,t.flags,t.mode);typeof r=="string"&&(r=new Uint8Array(xr(r))),ArrayBuffer.isView(r)?
a.write(n,r,0,r.byteLength,void 0,t.canOwn):ye("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.
lookupPath(e,{follow:!0});if(r.node===null)throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);
var t=a.nodePermissions(r.node,"x");if(t)throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir(
"/tmp"),a.mkdir("/home"),a.mkdir("/home/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,
3),{read:()=>0,write:(n,i,s,c,f)=>c,llseek:()=>0}),a.mkdev("/dev/null",a.makedev(1,3)),Me.register(a.makedev(5,0),Me.default_tty_ops),
Me.register(a.makedev(6,0),Me.default_tty1_ops),a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(
1024),r=0,t=()=>(r===0&&(Sr(e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",
t),a.mkdir("/dev/shm"),a.mkdir("/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");
a.mkdir("/proc/self/fd"),a.mount({mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:L.stream_ops.llseek},
r.node_ops={lookup(t,n){var i=+n,s=a.getStreamChecked(i),c={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>s.
path},id:i+1};return c.parent=c,c},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},
r}},{},"/proc/self/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdi\
n"),r?a.createDevice("/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):
a.symlink("/dev/tty1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){
a.nameTable=new Array(4096),a.mount(L,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),
a.filesystems={MEMFS:L}},init(e,r,t){a.initialized=!0,e??(e=o.stdin),r??(r=o.stdout),t??(t=o.stderr),a.createStandardStreams(
e,r,t)},quit(){a.initialized=!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.
exists?t.object:null},analyzePath(e,r){try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,
error:0,name:null,path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});
n.parentExists=!0,n.parentPath=t.path,n.parentObject=t.node,n.name=ee.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=
!0,n.path=t.path,n.object=t.node,n.name=t.node.name,n.isRoot=t.path==="/"}catch(i){n.error=i.errno}return n},createPath(e,r,t,n){
e=typeof e=="string"?e:a.getPath(e);for(var i=r.split("/").reverse();i.length;){var s=i.pop();if(s){var c=ee.join2(e,s);
try{a.mkdir(c)}catch(f){if(f.errno!=20)throw f}e=c}}return c},createFile(e,r,t,n,i){var s=ee.join2(typeof e=="string"?e:
a.getPath(e),r),c=Gr(n,i);return a.create(s,c)},createDataFile(e,r,t,n,i,s){var c=r;e&&(e=typeof e=="string"?e:a.getPath(
e),c=r?ee.join2(e,r):e);var f=Gr(n,i),p=a.create(c,f);if(t){if(typeof t=="string"){for(var k=new Array(t.length),v=0,C=t.
length;v<C;++v)k[v]=t.charCodeAt(v);t=k}a.chmod(p,f|146);var U=a.open(p,577);a.write(U,t,0,t.length,0,s),a.close(U),a.chmod(
p,f)}},createDevice(e,r,t,n){var f;var i=ee.join2(typeof e=="string"?e:a.getPath(e),r),s=Gr(!!t,!!n);(f=a.createDevice).
major??(f.major=64);var c=a.makedev(a.createDevice.major++,0);return a.registerDevice(c,{open(p){p.seekable=!1},close(p){
var k;(k=n==null?void 0:n.buffer)!=null&&k.length&&n(10)},read(p,k,v,C,U){for(var T=0,M=0;M<C;M++){var D;try{D=t()}catch{
throw new a.ErrnoError(29)}if(D===void 0&&T===0)throw new a.ErrnoError(6);if(D==null)break;T++,k[v+M]=D}return T&&(p.node.
atime=Date.now()),T},write(p,k,v,C,U){for(var T=0;T<C;T++)try{n(k[v+T])}catch{throw new a.ErrnoError(29)}return C&&(p.node.
mtime=p.node.ctime=Date.now()),T}}),a.mkdev(i,s,c)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;
if(globalThis.XMLHttpRequest)ye("Lazy loading should have been performed (contents set) in createLazyFile, but it was no\
t. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");else try{e.contents=
F(e.url)}catch{throw new a.ErrnoError(29)}},createLazyFile(e,r,t,n,i){class s{constructor(){Y(this,"lengthKnown",!1);Y(this,
"chunks",[])}get(U){if(!(U>this.length-1||U<0)){var T=U%this.chunkSize,M=U/this.chunkSize|0;return this.getter(M)[T]}}setDataGetter(U){
this.getter=U}cacheLength(){var U=new XMLHttpRequest;U.open("HEAD",t,!1),U.send(null),U.status>=200&&U.status<300||U.status===
304||ye("Couldn't load "+t+". Status: "+U.status);var T=Number(U.getResponseHeader("Content-length")),M,D=(M=U.getResponseHeader(
"Accept-Ranges"))&&M==="bytes",g=(M=U.getResponseHeader("Content-Encoding"))&&M==="gzip",H=1024*1024;D||(H=T);var $=(me,ve)=>{
me>ve&&ye("invalid range ("+me+", "+ve+") or no bytes requested!"),ve>T-1&&ye("only "+T+" bytes available! programmer er\
ror!");var ue=new XMLHttpRequest;return ue.open("GET",t,!1),T!==H&&ue.setRequestHeader("Range","bytes="+me+"-"+ve),ue.responseType=
"arraybuffer",ue.overrideMimeType&&ue.overrideMimeType("text/plain; charset=x-user-defined"),ue.send(null),ue.status>=200&&
ue.status<300||ue.status===304||ye("Couldn't load "+t+". Status: "+ue.status),ue.response!==void 0?new Uint8Array(ue.response||
[]):xr(ue.responseText||"")},te=this;te.setDataGetter(me=>{var ve=me*H,ue=(me+1)*H-1;return ue=Math.min(ue,T-1),typeof te.
chunks[me]>"u"&&(te.chunks[me]=$(ve,ue)),typeof te.chunks[me]>"u"&&ye("doXHR failed!"),te.chunks[me]}),(g||!T)&&(H=T=1,T=
this.getter(0).length,H=T,se("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=
T,this._chunkSize=H,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){
return this.lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){y||ye("Cannot do synchronous \
binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var c=new s,f={isDevice:!1,
contents:c}}else var f={isDevice:!1,url:t};var p=a.createFile(e,r,f,n,i);f.contents?p.contents=f.contents:f.url&&(p.contents=
null,p.url=f.url),Object.defineProperties(p,{usedBytes:{get:function(){return this.contents.length}}});var k={};for(const[
C,U]of Object.entries(p.stream_ops))k[C]=(...T)=>(a.forceLoadFile(p),U(...T));function v(C,U,T,M,D){var g=C.node.contents;
if(D>=g.length)return 0;var H=Math.min(g.length-D,M);if(g.slice)for(var $=0;$<H;$++)U[T+$]=g[D+$];else for(var $=0;$<H;$++)
U[T+$]=g.get(D+$);return H}return k.read=(C,U,T,M,D)=>(a.forceLoadFile(p),v(C,U,T,M,D)),k.mmap=(C,U,T,M,D)=>{a.forceLoadFile(
p);var g=Nr(U);if(!g)throw new a.ErrnoError(48);return v(C,(l(),Z),g,U,T),{ptr:g,allocated:!0}},p.stream_ops=k,p}},Ye=(e,r,t)=>e?
$e((l(),ie),e,r):"",re={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(ee.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var i=re.
getStreamFromFD(e);n=i.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(l(),
O)[e/4]=r.dev,(l(),O)[(e+4)/4]=r.mode,(l(),A)[(e+8)/8]=BigInt(r.nlink),(l(),O)[(e+16)/4]=r.uid,(l(),O)[(e+20)/4]=r.gid,(l(),
O)[(e+24)/4]=r.rdev,(l(),V)[(e+32)/8]=BigInt(r.size),(l(),R)[(e+40)/4]=4096,(l(),R)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),i=r.ctime.getTime();return(l(),V)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(l(),A)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(l(),V)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(l(),A)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(l(),V)[(e+80)/8]=BigInt(Math.
floor(i/1e3)),(l(),A)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(l(),V)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(l(),O)[(e+8)/
4]=r.bsize,(l(),O)[(e+72)/4]=r.bsize,(l(),V)[(e+16)/8]=BigInt(r.blocks),(l(),V)[(e+24)/8]=BigInt(r.bfree),(l(),V)[(e+32)/
8]=BigInt(r.bavail),(l(),V)[(e+40)/8]=BigInt(r.files),(l(),V)[(e+48)/8]=BigInt(r.ffree),(l(),O)[(e+56)/4]=r.fsid,(l(),O)[(e+
80)/4]=r.flags,(l(),O)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,i){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var s=(l(),ie).slice(e,e+t);a.msync(r,s,i,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Ye(e);return r}};function vt(e,r,t){if(h)return fe(3,0,1,e,r,t);t=_(t),re.varargs=t;try{var n=re.getStreamFromFD(
e);switch(r){case 0:{var i=kr();if(i<0)return-28;for(;a.streams[i];)i++;var s;return s=a.dupStream(n,i),s.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var i=kr();return n.flags|=i,0}case 5:{var i=Ve(),c=0;return(l(),he)[(i+c)/2]=2,0}case 6:case 7:
return 0}return-28}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}function ba(e,r){if(h)return fe(
4,0,1,e,r);r=_(r);try{return re.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var Fe=(e,r,t)=>gt(e,(l(),ie),r,t);function wt(e,r){if(h)return fe(5,0,1,e,r);e=_(e),r=_(r);try{if(r===0)return-28;
var t=a.cwd(),n=Ae(t)+1;return r<n?-68:(Fe(t,e,r),n)}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}
function yt(e,r,t){if(h)return fe(6,0,1,e,r,t);r=_(r),t=_(t);try{var n=re.getStreamFromFD(e);n.getdents||(n.getdents=a.readdir(
n.path));for(var i=280,s=0,c=a.llseek(n,0,1),f=Math.floor(c/i),p=Math.min(n.getdents.length,f+Math.floor(t/i)),k=f;k<p;k++){
var v,C,U=n.getdents[k];if(U===".")v=n.node.id,C=4;else if(U===".."){var T=a.lookupPath(n.path,{parent:!0});v=T.node.id,
C=4}else{var M;try{M=a.lookupNode(n.node,U)}catch(D){if((D==null?void 0:D.errno)===28)continue;throw D}v=M.id,C=a.isChrdev(
M.mode)?2:a.isDir(M.mode)?4:a.isLink(M.mode)?10:8}(l(),V)[(r+s)/8]=BigInt(v),(l(),V)[(r+s+8)/8]=BigInt((k+1)*i),(l(),he)[(r+
s+16)/2]=280,(l(),Z)[r+s+18]=C,Fe(U,r+s+19,256),s+=i}return a.llseek(n,k*i,0),s}catch(D){if(typeof a>"u"||D.name!=="Errn\
oError")throw D;return-D.errno}}function Et(e,r,t){if(h)return fe(7,0,1,e,r,t);t=_(t),re.varargs=t;try{var n=re.getStreamFromFD(
e);switch(r){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var i=n.tty.ops.ioctl_tcgets(
n),s=Ve();(l(),R)[s/4]=i.c_iflag||0,(l(),R)[(s+4)/4]=i.c_oflag||0,(l(),R)[(s+8)/4]=i.c_cflag||0,(l(),R)[(s+12)/4]=i.c_lflag||
0;for(var c=0;c<32;c++)(l(),Z)[s+c+17]=i.c_cc[c]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var s=Ve(),f=(l(),R)[s/4],p=(l(),R)[(s+4)/4],k=(l(),R)[(s+8)/4],v=(l(),
R)[(s+12)/4],C=[],c=0;c<32;c++)C.push((l(),Z)[s+c+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:f,c_oflag:p,c_cflag:k,
c_lflag:v,c_cc:C})}return 0}case 21519:{if(!n.tty)return-59;var s=Ve();return(l(),R)[s/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var s=Ve();return a.ioctl(n,r,s)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var U=n.tty.ops.ioctl_tiocgwinsz(n.tty),s=Ve();(l(),he)[s/2]=U[0],(l(),he)[(s+2)/2]=U[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(T){if(typeof a>"u"||T.name!=="ErrnoError")throw T;return-T.
errno}}function _a(e,r){if(h)return fe(8,0,1,e,r);e=_(e),r=_(r);try{return e=re.getStr(e),re.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function va(e,r,t,n){if(h)return fe(9,0,1,e,r,t,n);r=_(r),
t=_(t);try{r=re.getStr(r);var i=n&256,s=n&4096;return n=n&-6401,r=re.calculateAt(e,r,s),re.writeStat(t,i?a.lstat(r):a.stat(
r))}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function kt(e,r,t,n){if(h)return fe(10,0,1,e,
r,t,n);r=_(r),n=_(n),re.varargs=n;try{r=re.getStr(r),r=re.calculateAt(e,r);var i=n?kr():0;return a.open(r,t,i).fd}catch(s){
if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function St(e,r){if(h)return fe(11,0,1,e,r);e=_(e),r=_(r);
try{return e=re.getStr(e),re.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var wa=()=>ye("");function ya(e){e=_(e),Mr(e,!y,1,!b,5242880,!1),J.threadInitTLS()}var Ar=e=>{if(e instanceof Zr||e=="un\
wind")return q;E(1,e)},Ea=()=>{if(!_r())try{if(h){mr()&&Qr(q);return}wr(q)}catch(e){Ar(e)}},Ce=e=>{if(!ge)try{e(),Ea()}catch(r){
Ar(r)}};function Fr(e){if(e=_(e),Atomics.waitAsync){var r=Atomics.waitAsync((l(),R),e/4,e);r.value.then(ur);var t=e+228;
Atomics.store((l(),R),t/4,1)}}var ur=()=>Ce(()=>{var e=mr();e&&(Fr(e),fn())});function ka(e,r){if(e=_(e),r=_(r),e==r)setTimeout(
ur);else if(h)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=J.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var fr=[];function Sa(e,r,t,n,i){t=_(t),i=_(i),n/=2,fr.length=n;for(var s=i/8,c=0;c<n;c++)(l(),V)[s+2*c]?
fr[c]=(l(),V)[s+2*c+1]:fr[c]=(l(),ke)[s+2*c+1];var f=Ti[e];J.currentProxiedOperationCallerThread=t;var p=f(...fr);return J.
currentProxiedOperationCallerThread=0,typeof p=="bigint"&&(p=_(p)),p}function Ba(e){e=_(e),h?postMessage({cmd:"cleanupTh\
read",thread:e}):rt(e)}function xa(e){e=_(e),w&&J.pthreads[e].ref()}var Na=e=>e%4===0&&(e%100!==0||e%400===0),Ga=[0,31,60,
91,121,152,182,213,244,274,305,335],Ia=[0,31,59,90,120,151,181,212,243,273,304,334],Aa=e=>{var r=Na(e.getFullYear()),t=r?
Ga:Ia,n=t[e.getMonth()]+e.getDate()-1;return n};function Fa(e,r){e=_(e),r=_(r);var t=new Date(e*1e3);(l(),R)[r/4]=t.getSeconds(),
(l(),R)[(r+4)/4]=t.getMinutes(),(l(),R)[(r+8)/4]=t.getHours(),(l(),R)[(r+12)/4]=t.getDate(),(l(),R)[(r+16)/4]=t.getMonth(),
(l(),R)[(r+20)/4]=t.getFullYear()-1900,(l(),R)[(r+24)/4]=t.getDay();var n=Aa(t)|0;(l(),R)[(r+28)/4]=n,(l(),V)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
c=i.getTimezoneOffset(),f=(s!=c&&t.getTimezoneOffset()==Math.min(c,s))|0;(l(),R)[(r+32)/4]=f}function Bt(e,r,t,n,i,s,c){
if(h)return fe(12,0,1,e,r,t,n,i,s,c);e=_(e),i=_(i),s=_(s),c=_(c);try{var f=re.getStreamFromFD(n),p=a.mmap(f,e,i,r,t),k=p.
ptr;return(l(),R)[s/4]=p.allocated,(l(),A)[c/8]=BigInt(k),0}catch(v){if(typeof a>"u"||v.name!=="ErrnoError")throw v;return-v.
errno}}function xt(e,r,t,n,i,s){if(h)return fe(13,0,1,e,r,t,n,i,s);e=_(e),r=_(r),s=_(s);try{var c=re.getStreamFromFD(i);
t&2&&re.doMsync(e,c,r,n,s)}catch(f){if(typeof a>"u"||f.name!=="ErrnoError")throw f;return-f.errno}}var Ca=function(e,r,t,n){
e=_(e),r=_(r),t=_(t),n=_(n);var i=new Date().getFullYear(),s=new Date(i,0,1),c=new Date(i,6,1),f=s.getTimezoneOffset(),p=c.
getTimezoneOffset(),k=Math.max(f,p);(l(),A)[e/8]=BigInt(k*60),(l(),R)[r/4]=+(f!=p);var v=T=>{var M=T>=0?"-":"+",D=Math.abs(
T),g=String(Math.floor(D/60)).padStart(2,"0"),H=String(D%60).padStart(2,"0");return`UTC${M}${g}${H}`},C=v(f),U=v(p);p<f?
(Fe(C,t,17),Fe(U,n,17)):(Fe(C,n,17),Fe(U,t,17))},Nt=()=>performance.timeOrigin+performance.now(),Gt=()=>Date.now(),Ta=e=>e>=
0&&e<=3;function Ua(e,r,t){if(t=_(t),!Ta(e))return 28;var n;e===0?n=Gt():n=Nt();var i=Math.round(n*1e3*1e3);return(l(),V)[t/
8]=BigInt(i),0}var Ra=()=>{},Je=()=>{lr+=1},ja=()=>{throw Je(),"unwind"},Oa=()=>new Error().stack.toString(),Da=e=>{var r=Oa(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var s of t){
var c="",f="",p=0,k=0,v=i.exec(s);if((v==null?void 0:v.length)==5)c=v[1],f=v[2],p=v[3],k=v[4];else if(v=n.exec(s),(v==null?
void 0:v.length)>=4)c=v[1],f=v[2],p=v[3],k=v[4]|0;else{r+=s+`
`;continue}if(c=="_emscripten_log"||c=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(f=f.substring(f.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${c} (${f}:${p}:${k})
`)}return r=r.replace(/\s+$/,""),r};function qa(e,r,t){r=_(r);var n=Da(e);if(!r||t<=0)return Ae(n)+1;var i=Fe(n,r,t);return i+
1}var It=()=>4294967296,za=()=>BigInt(It()),La=()=>2,Ma=()=>w?require("os").cpus().length:navigator.hardwareConcurrency,
Qa=e=>{var r=Ie.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Ie.grow(BigInt(t)),Be(),1}catch{}};function Wa(e){e=_(
e);var r=(l(),ie).length;if(e<=r)return!1;var t=It();if(e>t)return!1;for(var n=1;n<=4;n*=2){var i=r*(1+.2/n);i=Math.min(
i,e+100663296);var s=Math.min(t,ht(Math.max(e,i),65536)),c=Qa(s);if(c)return!0}return!1}var Ue=e=>{var r=Ae(e)+1,t=vr(r);
return Fe(e,t,r),t},Va=(e,r)=>{(l(),O)[e/4]=r;var t=(l(),O)[e/4];(l(),O)[(e+4)/4]=(r-t)/4294967296},Ha=e=>{var r=Ae(e)+1,
t=Lt(r);return t&&Fe(e,t,r),t},Oe=e=>(l(),O)[e/4]+(l(),R)[(e+4)/4]*4294967296,m={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
m.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{m.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return m.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=en(r);return m.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=Cr(r);return m.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Tr(r);return m.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{z(e.mapState==="unmapped");var t=rn(r);return m.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Ur(r);return m.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Rr(r);return m.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=jr(r);return m.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Or(r);return m.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var i;var t=Dr(
r),n=tn(r,t);return m.Internals.jsObjectInsert(t,e.queue),m.Internals.jsObjectInsert(n,e),(i=o.peercomputeOnDevice)==null||
i.call(o,e),n},importJsExternalTexture:(e,r=0)=>{var t=Qt(r);return m.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{
var t=Wt(r);return m.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Vt(r);return m.Internals.jsObjects[t]=
e,t},importJsQueue:(e,r=0)=>{var t=Dr(r);return m.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Ht(r);
return m.Internals.jsObjects[t]=e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=$t(r);return m.Internals.jsObjects[t]=e,
t},importJsRenderPassEncoder:(e,r=0)=>{var t=Jt(r);return m.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{
var t=Pt(r);return m.Internals.jsObjects[t]=e,t},importJsSampler:(e,r=0)=>{var t=Kt(r);return m.Internals.jsObjects[t]=e,
t},importJsShaderModule:(e,r=0)=>{var t=nn(r);return m.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=Xt(r);
return m.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{var t=Yt(r);return m.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{
var t=Zt(r);return m.Internals.jsObjects[t]=e,t},errorCallback:(e,r,t,n)=>{var i=Ne(),s=Ue(t);((c,f,p)=>ut(e).call(null,
c,BigInt(f),BigInt(p)))(r,BigInt(s),n),Ge(i)},iterateExtensions:(e,r)=>{for(var t=Number((l(),A)[e/8]);t;t=Number((l(),A)[t/
8])){var n=(l(),R)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{(l(),A)[e/8]=BigInt(r),(l(),A)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{
var r=Number((l(),A)[e/8]),t=Number((l(),A)[(e+8)/8]);return Ye(r,t)},makeStringFromOptionalStringView:e=>{var r=Number(
(l(),A)[e/8]),t=Number((l(),A)[(e+8)/8]);return r?Ye(r,t):t===0?"":void 0},makeColor:e=>({r:(l(),ke)[e/8],g:(l(),ke)[(e+
8)/8],b:(l(),ke)[(e+16)/8],a:(l(),ke)[(e+24)/8]}),makeExtent3D:e=>({width:(l(),O)[e/4],height:(l(),O)[(e+4)/4],depthOrArrayLayers:(l(),
O)[(e+8)/4]}),makeOrigin3D:e=>({x:(l(),O)[e/4],y:(l(),O)[(e+4)/4],z:(l(),O)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:m.
getJsObject(Number((l(),A)[e/8])),mipLevel:(l(),O)[(e+8)/4],origin:m.makeOrigin3D(e+12),aspect:m.TextureAspect[(l(),R)[(e+
24)/4]]}),makeTexelCopyBufferLayout:e=>{var r=(l(),O)[(e+8)/4],t=(l(),O)[(e+12)/4];return{offset:Oe(e),bytesPerRow:r===4294967295?
void 0:r,rowsPerImage:t===4294967295?void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=m.makeTexelCopyBufferLayout(r);return t.
buffer=m.getJsObject(Number((l(),A)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:m.getJsObject(Number(
(l(),A)[(e+8)/8])),beginningOfPassWriteIndex:(l(),O)[(e+16)/4],endOfPassWriteIndex:(l(),O)[(e+20)/4]}},makePipelineConstants:(e,r)=>{
if(e){for(var t={},n=0;n<e;++n){var i=r+32*n,s=m.makeStringFromStringView(i+8);t[s]=(l(),ke)[(i+24)/8]}return t}},makePipelineLayout:e=>e?
m.getJsObject(e):"auto",makeComputeState:e=>{if(e){var r={module:m.getJsObject(Number((l(),A)[(e+8)/8])),constants:m.makePipelineConstants(
Number((l(),A)[(e+32)/8]),Number((l(),A)[(e+40)/8])),entryPoint:m.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),compute:m.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(g){if(g)return{topology:m.PrimitiveTopology[(l(),R)[(g+8)/4]],stripIndexFormat:m.
IndexFormat[(l(),R)[(g+12)/4]],frontFace:m.FrontFace[(l(),R)[(g+16)/4]],cullMode:m.CullMode[(l(),R)[(g+20)/4]],unclippedDepth:!!(l(),
O)[(g+24)/4]}}function t(g){if(g)return{operation:m.BlendOperation[(l(),R)[g/4]],srcFactor:m.BlendFactor[(l(),R)[(g+4)/4]],
dstFactor:m.BlendFactor[(l(),R)[(g+8)/4]]}}function n(g){if(g)return{alpha:t(g+12),color:t(g+0)}}function i(g){var H=m.TextureFormat[(l(),
R)[(g+8)/4]];return H?{format:H,blend:n(Number((l(),A)[(g+16)/8])),writeMask:(l(),O)[(g+24)/4]}:void 0}function s(g,H){for(var $=[],
te=0;te<g;++te)$.push(i(H+32*te));return $}function c(g){return{compare:m.CompareFunction[(l(),R)[g/4]],failOp:m.StencilOperation[(l(),
R)[(g+4)/4]],depthFailOp:m.StencilOperation[(l(),R)[(g+8)/4]],passOp:m.StencilOperation[(l(),R)[(g+12)/4]]}}function f(g){
if(g)return{format:m.TextureFormat[(l(),R)[(g+8)/4]],depthWriteEnabled:!!(l(),O)[(g+12)/4],depthCompare:m.CompareFunction[(l(),
R)[(g+16)/4]],stencilFront:c(g+20),stencilBack:c(g+36),stencilReadMask:(l(),O)[(g+52)/4],stencilWriteMask:(l(),O)[(g+56)/
4],depthBias:(l(),R)[(g+60)/4],depthBiasSlopeScale:(l(),We)[(g+64)/4],depthBiasClamp:(l(),We)[(g+68)/4]}}function p(g){return{
format:m.VertexFormat[(l(),R)[(g+8)/4]],offset:Oe(g+16),shaderLocation:(l(),O)[(g+24)/4]}}function k(g,H){for(var $=[],te=0;te<
g;++te)$.push(p(H+te*32));return $}function v(g){if(g){var H=m.VertexStepMode[(l(),R)[(g+8)/4]],$=Number((l(),A)[(g+24)/
8]);return!H&&!$?null:{arrayStride:Oe(g+16),stepMode:H,attributes:k($,Number((l(),A)[(g+32)/8]))}}}function C(g,H){if(g){
for(var $=[],te=0;te<g;++te)$.push(v(H+te*40));return $}}function U(g){if(g){var H={module:m.getJsObject(Number((l(),A)[(g+
8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(g+32)/8]),Number((l(),A)[(g+40)/8])),buffers:C(Number((l(),A)[(g+
48)/8]),Number((l(),A)[(g+56)/8])),entryPoint:m.makeStringFromOptionalStringView(g+16)};return H}}function T(g){if(g)return{
count:(l(),O)[(g+8)/4],mask:(l(),O)[(g+12)/4],alphaToCoverageEnabled:!!(l(),O)[(g+16)/4]}}function M(g){if(g){var H={module:m.
getJsObject(Number((l(),A)[(g+8)/8])),constants:m.makePipelineConstants(Number((l(),A)[(g+32)/8]),Number((l(),A)[(g+40)/
8])),targets:s(Number((l(),A)[(g+48)/8]),Number((l(),A)[(g+56)/8])),entryPoint:m.makeStringFromOptionalStringView(g+16)};
return H}}var D={label:m.makeStringFromOptionalStringView(e+8),layout:m.makePipelineLayout(Number((l(),A)[(e+24)/8])),vertex:U(
e+32),primitive:r(e+96),depthStencil:f(Number((l(),A)[(e+128)/8])),multisample:T(e+136),fragment:M(Number((l(),A)[(e+160)/
8]))};return D},fillLimitStruct:(e,r)=>{var t=Number((l(),A)[r/8]);function n(c,f,p,k=0){var v=e[c]??k;(l(),O)[(f+p)/4]=
v}function i(c,f,p,k=0){var v=e[c]??k;Va(f+p,v)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("max\
TextureDimension3D",r,16),n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),
n("maxBindingsPerBindGroup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipe\
lineLayout",r,40),n("maxSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPer\
ShaderStage",r,52),n("maxStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBuf\
ferOffsetAlignment",r,80),n("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageB\
ufferBindingSize",r,72),n("maxVertexBuffers",r,88),i("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBu\
fferArrayStride",r,108),n("maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentByte\
sPerSample",r,120),n("maxComputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeW\
orkgroupSizeX",r,132),n("maxComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPer\
Dimension",r,144),n("maxImmediateSize",r,148),t!==0){(l(),R)[(t+8)/4];var s=t;n("maxStorageBuffersInVertexStage",s,16,e.
maxStorageBuffersPerShaderStage),n("maxStorageBuffersInFragmentStage",s,24,e.maxStorageBuffersPerShaderStage),n("maxStor\
ageTexturesInVertexStage",s,20,e.maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",s,28,e.maxStorageTexturesPerShaderStage)}},
fillAdapterInfoStruct:(e,r)=>{(l(),O)[(r+88)/4]=e.subgroupMinSize,(l(),O)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+
e.device+e.description,n=Ha(t),i=Ae(e.vendor);m.setStringView(r+8,n,i),n+=i;var s=Ae(e.architecture);m.setStringView(r+24,
n,s),n+=s;var c=Ae(e.device);m.setStringView(r+40,n,c),n+=c;var f=Ae(e.description);m.setStringView(r+56,n,f),n+=f,(l(),
R)[(r+72)/4]=2;var p=e.isFallbackAdapter?3:4;(l(),R)[(r+76)/4]=p,(l(),O)[(r+80)/4]=0,(l(),O)[(r+84)/4]=0},AddressMode:[,
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},$a={undefined:1,unknown:1,destroyed:2},
De=()=>{lr-=1};function Ja(e,r,t,n,i,s){e=_(e),r=_(r),t=_(t),n=_(n),i=_(i),s=_(s);var c=m.getJsObject(e),f={};if(s){var p=Number(
(l(),A)[(s+24)/8]);if(p){var k=Number((l(),A)[(s+32)/8]);f.requiredFeatures=Array.from((l(),O).subarray(k/4,(k+p*4)/4),g=>m.
FeatureName[g])}var v=Number((l(),A)[(s+40)/8]);if(v){let g=function($,te,me,ve=!1){var ue=te+me,rr=(l(),O)[ue/4];rr!=4294967295&&
(!ve||rr!=0)&&(U[$]=rr)},H=function($,te,me){var ve=te+me,ue=(l(),O)[ve/4],rr=(l(),O)[(ve+4)/4];(ue!=4294967295||rr!=4294967295)&&
(U[$]=Oe(ve))};var C=Number((l(),A)[v/8]),U={};if(g("maxTextureDimension1D",v,8),g("maxTextureDimension2D",v,12),g("maxT\
extureDimension3D",v,16),g("maxTextureArrayLayers",v,20),g("maxBindGroups",v,24),g("maxBindGroupsPlusVertexBuffers",v,28),
g("maxBindingsPerBindGroup",v,32),g("maxDynamicUniformBuffersPerPipelineLayout",v,36),g("maxDynamicStorageBuffersPerPipe\
lineLayout",v,40),g("maxSampledTexturesPerShaderStage",v,44),g("maxSamplersPerShaderStage",v,48),g("maxStorageBuffersPer\
ShaderStage",v,52),g("maxStorageTexturesPerShaderStage",v,56),g("maxUniformBuffersPerShaderStage",v,60),g("minUniformBuf\
ferOffsetAlignment",v,80),g("minStorageBufferOffsetAlignment",v,84),H("maxUniformBufferBindingSize",v,64),H("maxStorageB\
ufferBindingSize",v,72),g("maxVertexBuffers",v,88),H("maxBufferSize",v,96),g("maxVertexAttributes",v,104),g("maxVertexBu\
fferArrayStride",v,108),g("maxInterStageShaderVariables",v,112),g("maxColorAttachments",v,116),g("maxColorAttachmentByte\
sPerSample",v,120),g("maxComputeWorkgroupStorageSize",v,124),g("maxComputeInvocationsPerWorkgroup",v,128),g("maxComputeW\
orkgroupSizeX",v,132),g("maxComputeWorkgroupSizeY",v,136),g("maxComputeWorkgroupSizeZ",v,140),g("maxComputeWorkgroupsPer\
Dimension",v,144),g("maxImmediateSize",v,148,!0),C!==0){(l(),R)[(C+8)/4];var T=C;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(g("maxStorageBuffersInVertexStage",T,16),g("maxStorageTexturesInVertexStage",T,20),g("maxStorageBuffersInFra\
gmentStage",T,24),g("maxStorageTexturesInFragmentStage",T,28))}f.requiredLimits=U}var M=Number((l(),A)[(s+48)/8]);if(M){
var D={label:m.makeStringFromOptionalStringView(M+8)};f.defaultQueue=D}f.label=m.makeStringFromOptionalStringView(s+8)}Je(),
m.Internals.futureInsert(r,c.requestDevice(f).then(g=>{De(),Ce(()=>{var H;m.Internals.jsObjectInsert(i,g.queue),m.Internals.
jsObjectInsert(n,g),(H=o.peercomputeOnDevice)==null||H.call(o,g),n=BigInt(n),m.Internals.futureInsert(t,g.lost.then($=>{
Ce(()=>{g.onuncapturederror=ve=>{};var te=Ne(),me=Ue($.message);qr(t,$a[$.reason],BigInt(me)),Ge(te)})})),g.onuncapturederror=
$=>{var te=5;$.error instanceof GPUValidationError?te=2:$.error instanceof GPUOutOfMemoryError?te=3:$.error instanceof GPUInternalError&&
(te=4);var me=Ne(),ve=Ue($.error.message);on(BigInt(n),te,BigInt(ve)),Ge(me)},Lr(r,1,BigInt(n),0n)})},g=>{De(),Ce(()=>{var H=Ne(),
$=Ue(g.message);Lr(r,3,BigInt(n),BigInt($)),t&&qr(t,4,BigInt($)),Ge(H)})}))}function Pa(e){e=_(e);var r=m.getJsObject(e),
t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e]}r.destroy()}
var Ka=function(e,r,t){e=_(e),r=_(r),t=_(t);var n=(()=>{var i=m.getJsObject(e);t==-1&&(t=void 0);var s;try{s=i.getMappedRange(
r,t)}catch{return 0n}var c=dn(16,s.byteLength);return(l(),ie).set(new Uint8Array(s),c),m.Internals.bufferOnUnmaps[e].push(
()=>Mt(c)),c})();return BigInt(n)},Xa=function(e,r,t,n,i){e=_(e),r=_(r),t=_(t),n=_(n),i=_(i);var s=m.getJsObject(e);m.Internals.
bufferOnUnmaps[e]=[],i==-1&&(i=void 0),Je(),m.Internals.futureInsert(r,s.mapAsync(t,n,i).then(()=>{De(),Ce(()=>{zr(r,1,0n)})},
c=>{De(),Ce(()=>{var f=Ne(),p=Ue(c.message),k=c.name==="AbortError"?4:c.name==="OperationError"?3:0;zr(r,k,BigInt(p)),delete m.
Internals.bufferOnUnmaps[e]})}))};function Ya(e){e=_(e);var r=m.getJsObject(e),t=m.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete m.Internals.bufferOnUnmaps[e],r.unmap()}}function Za(e){e=_(e),delete m.Internals.jsObjects[e]}
function ei(e,r,t){e=_(e),r=_(r),t=_(t);var n=!!(l(),O)[(r+40)/4],i={label:m.makeStringFromOptionalStringView(r+8),usage:(l(),
O)[(r+24)/4],size:Oe(r+32),mappedAtCreation:n},s=m.getJsObject(e),c;try{c=s.createBuffer(i)}catch{return!1}return m.Internals.
jsObjectInsert(t,c),n&&(m.Internals.bufferOnUnmaps[t]=[]),!0}function ri(e,r,t){e=_(e),r=_(r),t=_(t);var n=Number((l(),A)[r/
8]),i=(l(),R)[(n+8)/4],s={label:m.makeStringFromOptionalStringView(r+8),code:""};switch(i){case 2:{s.code=m.makeStringFromStringView(
n+16);break}}var c=m.getJsObject(e);m.Internals.jsObjectInsert(t,c.createShaderModule(s))}var ti=e=>{const r=m.getJsObject(
e);r.onuncapturederror=null,r.destroy()};function ni(e,r,t,n){r=_(r),t=_(t),n=_(n);var i;if(t){i={featureLevel:m.FeatureLevel[(l(),
R)[(t+8)/4]],powerPreference:m.PowerPreference[(l(),R)[(t+12)/4]],forceFallbackAdapter:!!(l(),O)[(t+16)/4]};var s=Number(
(l(),A)[t/8]);if(s!==0){(l(),R)[(s+8)/4];var c=s;i.xrCompatible=!!(l(),O)[(c+16)/4]}}if(!("gpu"in navigator)){var f=Ne(),
p=Ue("WebGPU not available on this browser (navigator.gpu is not available)");er(r,3,BigInt(n),BigInt(p)),Ge(f);return}Je(),
m.Internals.futureInsert(r,navigator.gpu.requestAdapter(i).then(k=>{De(),Ce(()=>{if(k)m.Internals.jsObjectInsert(n,k),er(
r,1,BigInt(n),0n);else{var v=Ne(),C=Ue("WebGPU not available on this browser (requestAdapter returned null)");er(r,3,BigInt(
n),BigInt(C)),Ge(v)}})},k=>{De(),Ce(()=>{var v=Ne(),C=Ue(k.message);er(r,4,BigInt(n),BigInt(C)),Ge(v)})}))}var ai=function(e,r){
e=_(e),r=_(r);var t=m.getJsObject(e);Je(),m.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{De(),Ce(()=>{an(r,
1)})}))},At=function(e,r,t){return e=_(e),r=_(r),t=_(t),Ee.handleAsync(async()=>{var n=[];if(t){var i=(l(),R)[t/4];n.length=
r+1,n[r]=new Promise(p=>setTimeout(p,i,0))}else n.length=r;for(var s=0;s<r;++s){var c=Oe(e+s*8);if(!(c in m.Internals.futures))
return c;n[s]=m.Internals.futures[c]}const f=await Promise.race(n);return delete m.Internals.futures[f],f})};At.isAsync=
!0;var dr={},ii=()=>G||"./this.program",Ze=()=>{if(!Ze.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:ii()};
for(var t in dr)dr[t]===void 0?delete r[t]:r[t]=dr[t];var n=[];for(var t in r)n.push(`${t}=${r[t]}`);Ze.strings=n}return Ze.
strings};function Ft(e,r){if(h)return fe(14,0,1,e,r);e=_(e),r=_(r);var t=0,n=0;for(var i of Ze()){var s=r+t;(l(),A)[(e+n)/
8]=BigInt(s),t+=Fe(i,s,1/0)+1,n+=8}return 0}function Ct(e,r){if(h)return fe(15,0,1,e,r);e=_(e),r=_(r);var t=Ze();(l(),A)[e/
8]=BigInt(t.length);var n=0;for(var i of t)n+=Ae(i)+1;return(l(),A)[r/8]=BigInt(n),0}function Tt(e){if(h)return fe(16,0,
1,e);try{var r=re.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var oi=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){var c=Number((l(),A)[r/8]),f=Number((l(),A)[(r+8)/8]);r+=16;var p=a.read(
e,(l(),Z),c,f,n);if(p<0)return-1;if(i+=p,p<f)break}return i};function Ut(e,r,t,n){if(h)return fe(17,0,1,e,r,t,n);r=_(r),
t=_(t),n=_(n);try{var i=re.getStreamFromFD(e),s=oi(i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!==
"ErrnoError")throw c;return c.errno}}function Rt(e,r,t,n){if(h)return fe(18,0,1,e,r,t,n);r=_(r),n=_(n);try{if(isNaN(r))return 61;
var i=re.getStreamFromFD(e);return a.llseek(i,r,t),(l(),V)[n/8]=BigInt(i.position),i.getdents&&r===0&&t===0&&(i.getdents=
null),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}var si=(e,r,t,n)=>{for(var i=0,s=0;s<t;s++){
var c=Number((l(),A)[r/8]),f=Number((l(),A)[(r+8)/8]);r+=16;var p=a.write(e,(l(),Z),c,f,n);if(p<0)return-1;if(i+=p,p<f)break}
return i};function jt(e,r,t,n){if(h)return fe(19,0,1,e,r,t,n);r=_(r),t=_(t),n=_(n);try{var i=re.getStreamFromFD(e),s=si(
i,r,t);return(l(),A)[n/8]=BigInt(s),0}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return c.errno}}function ci(e,r){
e=_(e),r=_(r);try{return Sr((l(),ie).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function li(e,r){e=_(e),r=_(r);var t=m.getJsObject(e);return m.fillAdapterInfoStruct(t.info,r),1}function ui(e,r){
e=_(e),r=_(r);var t=m.getJsObject(e);return m.fillLimitStruct(t.limits,r),1}function fi(e,r){e=_(e);var t=m.getJsObject(
e);return t.features.has(m.FeatureName[r])}var di=function(e){e=_(e);var r=(()=>{var t=m.getJsObject(e);return t.size})();
return BigInt(r)},mi=function(e,r){e=_(e),r=_(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8),
timestampWrites:m.makePassTimestampWrites(Number((l(),A)[(r+24)/8]))});var i=m.getJsObject(e),s=jr(0n);return m.Internals.
jsObjectInsert(s,i.beginComputePass(n)),s})();return BigInt(t)};function pi(e,r,t,n,i,s){e=_(e),r=_(r),t=_(t),n=_(n),i=_(
i),s=_(s);var c=m.getJsObject(e),f=m.getJsObject(r),p=m.getJsObject(n);c.copyBufferToBuffer(f,t,p,i,s)}var gi=function(e,r){
e=_(e);var t=(()=>{var n=m.getJsObject(e),i=Ur(0n);return m.Internals.jsObjectInsert(i,n.finish()),i})();return BigInt(t)};
function hi(e,r,t,n){e=_(e);var i=m.getJsObject(e);i.dispatchWorkgroups(r,t,n)}function bi(e){e=_(e);var r=m.getJsObject(
e);r.end()}function _i(e,r,t,n,i){e=_(e),t=_(t),n=_(n),i=_(i);var s=m.getJsObject(e),c=m.getJsObject(t);n==0?s.setBindGroup(
r,c):s.setBindGroup(r,c,(l(),O),i/4,n)}function vi(e,r){e=_(e),r=_(r);var t=m.getJsObject(e),n=m.getJsObject(r);t.setPipeline(
n)}var wi=function(e,r){e=_(e);var t=(()=>{var n=m.getJsObject(e),i=Tr(0n);return m.Internals.jsObjectInsert(i,n.getBindGroupLayout(
r)),i})();return BigInt(t)},yi=function(e,r){e=_(e),r=_(r);var t=(()=>{function n(p){var k=Number((l(),A)[(p+16)/8]),v=Number(
(l(),A)[(p+40)/8]),C=Number((l(),A)[(p+48)/8]),U=0;m.iterateExtensions(p,{327681:D=>{U=Number((l(),A)[(D+16)/8])}});var T;
if(k){var M=Oe(p+32);M==-1&&(M=void 0),T={buffer:m.getJsObject(k),offset:Oe(p+24),size:M}}else T=m.getJsObject(v||C||U);
return{binding:(l(),O)[(p+8)/4],resource:T}}function i(p,k){for(var v=[],C=0;C<p;++C)v.push(n(k+56*C));return v}var s={label:m.
makeStringFromOptionalStringView(r+8),layout:m.getJsObject(Number((l(),A)[(r+24)/8])),entries:i(Number((l(),A)[(r+32)/8]),
Number((l(),A)[(r+40)/8]))},c=m.getJsObject(e),f=Cr(0n);return m.Internals.jsObjectInsert(f,c.createBindGroup(s)),f})();
return BigInt(t)},Ei=function(e,r){e=_(e),r=_(r);var t=(()=>{var n;r&&(n={label:m.makeStringFromOptionalStringView(r+8)});
var i=m.getJsObject(e),s=Rr(0n);return m.Internals.jsObjectInsert(s,i.createCommandEncoder(n)),s})();return BigInt(t)},ki=function(e,r){
e=_(e),r=_(r);var t=(()=>{var n=m.makeComputePipelineDesc(r),i=m.getJsObject(e),s=Or(0n);return m.Internals.jsObjectInsert(
s,i.createComputePipeline(n)),s})();return BigInt(t)};function Si(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(m.WGSLLanguageFeatureName[r]):!1}var Bi=function(e,r,t){e=_(e),r=_(r),t=_(t);var n=m.getJsObject(
e),i=Array.from((l(),V).subarray(t/8,(t+r*8)/8),s=>m.getJsObject(s));n.submit(i)};function xi(e,r,t,n,i){e=_(e),r=_(r),t=
_(t),n=_(n),i=_(i);var s=m.getJsObject(e),c=m.getJsObject(r),f=(l(),ie).subarray(n,n+i);s.writeBuffer(c,t,f,0,i)}var Ee={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;Ee.asyncExports=new Set;var t={};for(let[i,s]of Object.entries(
e))if(typeof s=="function"){r.test(i)&&(Ee.asyncExports.add(s),s=Ee.makeAsyncFunction(s));var n=Ee.instrumentFunction(s);
t[i]=n}else t[i]=s;return t},asyncExports:null,isAsyncExport(e){var r;return(r=Ee.asyncExports)==null?void 0:r.has(e)},handleAsync:async e=>{
Je();try{return await e()}finally{De()}},handleSleep:e=>Ee.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},Ot=e=>{var r=o["_"+e];return r},Ni=(e,r)=>{(l(),Z).set(e,r)},Dt=(e,r,t,n,i)=>{var s={pointer:D=>BigInt(D),
string:D=>{var g=0;return D!=null&&D!==0&&(g=Ue(D)),BigInt(g)},array:D=>{var g=vr(D.length);return Ni(D,g),BigInt(g)}};function c(D){
return r==="string"?Ye(Number(D)):r==="pointer"?Number(D):r==="boolean"?!!D:D}var f=Ot(e),p=[],k=0;if(n)for(var v=0;v<n.
length;v++){var C=s[t[v]];C?(k===0&&(k=Ne()),p[v]=C(n[v])):p[v]=n[v]}var U=f(...p);function T(D){return k!==0&&Ge(k),c(D)}
var M=i==null?void 0:i.async;return M?U.then(T):(U=T(U),U)},Gi=(e,r,t,n)=>{var i=!t||t.every(c=>c==="number"||c==="boole\
an"),s=r!=="string";return s&&i&&!n?Ot(e):(...c)=>Dt(e,r,t,c,n)},Ii=(...e)=>a.createPath(...e),Ai=(...e)=>a.unlink(...e),
Fi=(...e)=>a.createLazyFile(...e),Ci=(...e)=>a.createDevice(...e);if(J.init(),a.createPreloadedFile=ha,a.preloadFile=Ir,
a.staticInit(),xe(),o.noExitRuntime&&(Er=o.noExitRuntime),o.preloadPlugins&&(_t=o.preloadPlugins),o.print&&(se=o.print),
o.printErr&&(K=o.printErr),o.wasmBinary&&(_e=o.wasmBinary),o.arguments&&o.arguments,o.thisProgram&&(G=o.thisProgram),o.preInit)
for(typeof o.preInit=="function"&&(o.preInit=[o.preInit]);o.preInit.length>0;)o.preInit.shift()();o.ENV=dr,o.mmapAlloc=Nr,
o.wasmMemory=Ie,o.addRunDependency=cr,o.removeRunDependency=sr,o.ccall=Dt,o.cwrap=Gi,o.FS_preloadFile=Ir,o.FS_unlink=Ai,
o.FS_createPath=Ii,o.FS_createDevice=Ci,o.FS=a,o.FS_createDataFile=bt,o.FS_createLazyFile=Fi,o.MEMFS=L;var Ti=[ot,st,dt,
vt,ba,wt,yt,Et,_a,va,kt,St,Bt,xt,Ft,Ct,Tt,Ut,Rt,jt];function qt(e,r,t,n){return Ee.handleAsync(async()=>await u(Ye(Number(
e)),Number(r),Number(t),Number(n)))}qt.sig="jjjjj";var zt,Lt,Mt,Cr,Tr,Ur,Rr,jr,Or,Qt,Wt,Vt,Ht,$t,Jt,Pt,Kt,Xt,Yt,Zt,en,rn,
tn,Dr,nn,qr,zr,er,Lr,an,on,mr,sn,Mr,cn,ln,un,Qr,fn,dn,mn,pn,gn,hn,bn,_n;function Ui(e){o._wllama_malloc=e.wllama_malloc,
o._wllama_start=e.wllama_start,o._wllama_action=e.wllama_action,o._wllama_exit=e.wllama_exit,o._wllama_debug=e.wllama_debug,
zt=o._main=e.main,Lt=e.malloc,Mt=e.free,Cr=e.emwgpuCreateBindGroup,Tr=e.emwgpuCreateBindGroupLayout,Ur=e.emwgpuCreateCommandBuffer,
Rr=e.emwgpuCreateCommandEncoder,jr=e.emwgpuCreateComputePassEncoder,Or=e.emwgpuCreateComputePipeline,Qt=e.emwgpuCreateExternalTexture,
Wt=e.emwgpuCreatePipelineLayout,Vt=e.emwgpuCreateQuerySet,Ht=e.emwgpuCreateRenderBundle,$t=e.emwgpuCreateRenderBundleEncoder,
Jt=e.emwgpuCreateRenderPassEncoder,Pt=e.emwgpuCreateRenderPipeline,Kt=e.emwgpuCreateSampler,Xt=e.emwgpuCreateSurface,Yt=
e.emwgpuCreateTexture,Zt=e.emwgpuCreateTextureView,en=e.emwgpuCreateAdapter,rn=e.emwgpuCreateBuffer,tn=e.emwgpuCreateDevice,
Dr=e.emwgpuCreateQueue,nn=e.emwgpuCreateShaderModule,qr=e.emwgpuOnDeviceLostCompleted,zr=e.emwgpuOnMapAsyncCompleted,er=
e.emwgpuOnRequestAdapterCompleted,Lr=e.emwgpuOnRequestDeviceCompleted,an=e.emwgpuOnWorkDoneCompleted,on=e.emwgpuOnUncapturedError,
e._emscripten_tls_init,mr=e.pthread_self,sn=e.emscripten_builtin_memalign,Mr=e._emscripten_thread_init,cn=e._emscripten_thread_crashed,
ln=e._emscripten_run_js_on_main_thread,un=e._emscripten_thread_free_data,Qr=e._emscripten_thread_exit,fn=e._emscripten_check_mailbox,
dn=e.memalign,mn=e.__trap,pn=e.emscripten_stack_set_limits,gn=e._emscripten_stack_restore,hn=e._emscripten_stack_alloc,bn=
e.emscripten_stack_get_current,_n=e.__indirect_function_table}var Pe;function Ri(){Pe={__asyncjs__js_file_read:qt,__pthread_create_js:mt,
__syscall_fcntl64:vt,__syscall_getcwd:wt,__syscall_getdents64:yt,__syscall_ioctl:Et,__syscall_openat:kt,__syscall_stat64:St,
_abort_js:wa,_emscripten_init_main_thread_js:ya,_emscripten_notify_mailbox_postmessage:ka,_emscripten_receive_on_main_thread_js:Sa,
_emscripten_thread_cleanup:Ba,_emscripten_thread_mailbox_await:Fr,_emscripten_thread_set_strongref:xa,_localtime_js:Fa,_mmap_js:Bt,
_munmap_js:xt,_tzset_js:Ca,clock_time_get:Ua,emscripten_check_blocking_allowed:Ra,emscripten_date_now:Gt,emscripten_exit_with_live_runtime:ja,
emscripten_get_callstack:qa,emscripten_get_heap_max:za,emscripten_get_now:Nt,emscripten_has_asyncify:La,emscripten_num_logical_cores:Ma,
emscripten_resize_heap:Wa,emwgpuAdapterRequestDevice:Ja,emwgpuBufferDestroy:Pa,emwgpuBufferGetConstMappedRange:Ka,emwgpuBufferMapAsync:Xa,
emwgpuBufferUnmap:Ya,emwgpuDelete:Za,emwgpuDeviceCreateBuffer:ei,emwgpuDeviceCreateShaderModule:ri,emwgpuDeviceDestroy:ti,
emwgpuInstanceRequestAdapter:ni,emwgpuQueueOnSubmittedWorkDone:ai,emwgpuWaitAny:At,environ_get:Ft,environ_sizes_get:Ct,exit:wr,
fd_close:Tt,fd_read:Ut,fd_seek:Rt,fd_write:jt,memory:Ie,random_get:ci,wgpuAdapterGetInfo:li,wgpuAdapterGetLimits:ui,wgpuAdapterHasFeature:fi,
wgpuBufferGetSize:di,wgpuCommandEncoderBeginComputePass:mi,wgpuCommandEncoderCopyBufferToBuffer:pi,wgpuCommandEncoderFinish:gi,
wgpuComputePassEncoderDispatchWorkgroups:hi,wgpuComputePassEncoderEnd:bi,wgpuComputePassEncoderSetBindGroup:_i,wgpuComputePassEncoderSetPipeline:vi,
wgpuComputePipelineGetBindGroupLayout:wi,wgpuDeviceCreateBindGroup:yi,wgpuDeviceCreateCommandEncoder:Ei,wgpuDeviceCreateComputePipeline:ki,
wgpuInstanceHasWGSLLanguageFeature:Si,wgpuQueueSubmit:Bi,wgpuQueueWriteBuffer:xi}}function ji(e){e=Object.assign({},e);var r=k=>(v,C,U)=>k(
v,BigInt(C||0),BigInt(U||0)),t=k=>v=>Number(k(BigInt(v))),n=k=>v=>k(BigInt(v)),i=k=>()=>Number(k()),s=k=>(v,C)=>Number(k(
BigInt(v),BigInt(C))),c=k=>(v,C,U,T,M,D)=>k(BigInt(v),C,U,T,M,D),f=k=>(v,C,U,T,M)=>k(v,BigInt(C),U,BigInt(T),M),p=k=>(v,C)=>k(
BigInt(v),BigInt(C));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=
s(e.emscripten_builtin_memalign),e._emscripten_thread_init=c(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=
f(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=n(e._emscripten_thread_free_data),e._emscripten_thread_exit=
n(e._emscripten_thread_exit),e.memalign=s(e.memalign),e.emscripten_stack_set_limits=p(e.emscripten_stack_set_limits),e._emscripten_stack_restore=
n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.
emscripten_stack_get_current),e}async function Oi(){var e=zt,r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,ct(n,!0),
n}catch(i){return Ar(i)}}function pr(){if(Le>0){Xe=pr;return}if(h){ze();return}if(Ke(),Le>0){Xe=pr;return}async function e(){
var t;if(o.calledRun=!0,!ge){ze(),(t=o.onRuntimeInitialized)==null||t.call(o);var r=o.noInitialRun||!1;r||await Oi(),Xn()}}
o.setStatus?(o.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>o.setStatus(""),1),e()},1)):e()}var Re;return h||(Yr(),
pr()),o}var Rn=1,jn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"GlueMsgError",fields:[{type:"str",
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
or=new Uint8Array([71,76,85,69]),Pr=0,$i=1,Ji=2,Pi=3,Ki=4,Xi=5,Yi=6,Zi=7,eo=8,ro=9,to=10,On={str:Ki,int:Ji,float:Pi,bool:$i,
raw:Xi,arr_str:ro,arr_int:Zi,arr_float:eo,arr_bool:Yi,arr_raw:to,null:Pr};function no(o){let u=0;const d=new DataView(o.
buffer),b=()=>{const W=d.getUint32(u,!0);return u+=4,W},y=()=>{const W=d.getInt32(u,!0);return u+=4,W},w=()=>{const W=d.
getFloat32(u,!0);return u+=4,W},h=()=>b()!==0,N=W=>{const ae=W??b(),oe=new TextDecoder().decode(o.slice(u,u+ae));return u+=
ae,oe},G=()=>{const W=b(),ae=o.slice(u,u+W);return u+=W,ae},E=W=>{const ae=b(),oe=new Array(ae);for(let se=0;se<ae;se++)
oe[se]=W();return oe},B=()=>null,S=W=>{switch(W.type){case"str":return N();case"int":return y();case"float":return w();case"\
bool":return h();case"raw":return G();case"arr_str":return E(N);case"arr_int":return E(y);case"arr_float":return E(w);case"\
arr_bool":return E(h);case"arr_raw":return E(G);case"null":return B()}},I=o[0]===or[0]&&o[1]===or[1]&&o[2]===or[2]&&o[3]===
or[3];if(u+=4,!I)throw new Error("Invalid magic number");if(b()!==Rn)throw new Error("Invalid version number");const F=N(
8),j=jn[F];if(!j)throw new Error(`Unknown message name: ${F}`);const ne={_name:F};for(const W of j.fields){const ae=b();
if(ae===Pr){if(!W.isNullable)throw new Error(`${F}: Expect field ${W.name} to be non-nullable`);ne[W.name]=null;continue}
if(ae!==On[W.type])throw new Error(`${F}: Expect field ${W.name} to have type ${W.type}`);ne[W.name]=S(W)}return ne}function ao(o){
const u=jn[o._name];if(!u)throw new Error(`Unknown message name: ${o._name}`);const d=[],b=x=>{const F=new ArrayBuffer(4);
new DataView(F).setUint32(0,x,!0),d.push(new Uint8Array(F))},y=x=>{const F=new ArrayBuffer(4);new DataView(F).setInt32(0,
x,!0),d.push(new Uint8Array(F))},w=x=>{const F=new ArrayBuffer(4);new DataView(F).setFloat32(0,x,!0),d.push(new Uint8Array(
F))},h=x=>{b(x?1:0)},N=x=>{const F=new TextEncoder().encode(x);b(F.byteLength),d.push(F)},G=x=>{b(x.byteLength),d.push(x)},
E=(x,F)=>{b(x.length);for(const j of x)F(j)};d.push(or),b(Rn);{const x=new TextEncoder().encode(o._name);d.push(x)}for(const x of u.
fields){const F=o[x.name];if(!x.isNullable&&F==null)throw new Error(`${o._name}: Expect field ${x.name} to be non-nullab\
le`);if(F==null){b(Pr);continue}switch(b(On[x.type]),x.type){case"str":N(F);break;case"int":y(F);break;case"float":w(F);
break;case"bool":h(F);break;case"raw":G(F);break;case"arr_str":E(F,N);break;case"arr_int":E(F,y);break;case"arr_float":E(
F,w);break;case"arr_bool":E(F,h);break;case"arr_raw":E(F,G);break}}const B=d.reduce((x,F)=>x+F.byteLength,0),S=new Uint8Array(
B);let I=0;for(const x of d)S.set(x,I),I+=x.byteLength;return S}const Dn=4*1024**2,Bn=1024*1024;function io({files:o,reader:u,
getMemory:d,getSignal:b=()=>{}}){const y=new Map(o.map(w=>[w.name,w]));return async(w,h,N,G)=>{const E=y.get(w.replace(/^\/?models\//,
""));if(!E||![h,N,G].every(S=>Number.isSafeInteger(S)&&S>=0)||h>E.size)throw new Error("Invalid GGUF native file read");
const B=Math.min(N,E.size-h);if(!Number.isSafeInteger(G+B)||G+B>d().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let S=0;S<B;){be(b());const I=Math.min(Dn,B-S),x=await u.read(E.path,h+S,I,{signal:b()});if(be(b()),
!(x instanceof Uint8Array)||x.byteLength!==I)throw new Error("Incomplete GGUF artifact range");new Uint8Array(d()).set(x,
G+S),S+=I}return BigInt(B)}}function oo(o,u){o.FS.mkdir("/models"),o.FS.mount(o.MEMFS,{root:"."},"/models");const d=new Map(
u.map(w=>[w.name,w])),b=o.MEMFS.stream_ops;for(const w of["read","llseek"]){const h=b[w];b[w]=function(N,...G){const E=d.
get(N.node.name);return E&&(N.node.usedBytes=E.size),h.call(this,N,...G)},o.MEMFS.ops_table.file.stream[w]=b[w]}const y=b.
mmap;b.mmap=function(w,...h){if(d.has(w.node.name))throw new Error("GGUF artifact mmap is prohibited");return y.call(this,
w,...h)},o.MEMFS.ops_table.file.stream.mmap=b.mmap;for(const w of u)o.FS_createDataFile("/models",w.name,new Uint8Array(
0),!0,!1,!0)}function so(o,u,{collect:d=!1,onLost:b}={}){var G;if(u.device=o,u.runtimeFeatures=[...o.features],u.runtimeAdapter=
o.adapterInfo?{vendor:o.adapterInfo.vendor,architecture:o.adapterInfo.architecture,isFallbackAdapter:o.adapterInfo.isFallbackAdapter??
!1}:null,!o.features.has("shader-f16")||(G=u.runtimeAdapter)!=null&&G.isFallbackAdapter)throw new Error("GGUF native run\
time did not acquire the required hardware GPU");if(o.lost.then(E=>b==null?void 0:b(E)),!d)return()=>{};const y=Object.getOwnPropertyDescriptor(
o,"createCommandEncoder"),w=Object.getOwnPropertyDescriptor(o.queue,"submit"),h=o.createCommandEncoder.bind(o),N=o.queue.
submit.bind(o.queue);return o.createCommandEncoder=(...E)=>{const B=h(...E),S=B.beginComputePass.bind(B);return B.beginComputePass=
(...I)=>{const x=S(...I);for(const F of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const j=x[F].bind(x);x[F]=(...ne)=>{
const W=j(...ne);return u.dispatches+=1,W}}return x},B},o.queue.submit=(...E)=>{const B=N(...E);return u.submissions+=1,
B},()=>{y?Object.defineProperty(o,"createCommandEncoder",y):delete o.createCommandEncoder,w?Object.defineProperty(o.queue,
"submit",w):delete o.queue.submit}}function co(o){const u=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(o);return u?
{gpuLayers:Number(u[1]),totalLayers:Number(u[2])}:null}function lo(o){const u=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(o);return u?{backend:u[1],kind:u[2].toLowerCase(),bytes:Math.round(Number(u[3])*1024**2)}:null}async function uo({wasmUrl:o,
weights:u,reader:d,signal:b,collectGpuEvidence:y=!1,onProgress:w,onLost:h,initialize:N=Hi}={}){const G=u.map((z,X)=>({...z,
name:`model-${String(X+1).padStart(5,"0")}-of-${String(u.length).padStart(5,"0")}.gguf`})),E={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let B=b,S,I,x,F,j;const ne=new Promise((z,X)=>{F=z,j=X}),W=z=>{var P;const X=co(
String(z));X&&(E.offload=X,w==null||w({type:"gpu-offload",...X}));const l=lo(String(z));l&&E.buffers.length<32&&(E.buffers.
push(l),w==null||w({type:"native-buffer",...l,wasmMemoryBytes:((P=x==null?void 0:x.wasmMemory)==null?void 0:P.buffer.byteLength)??
0}))},ae=z=>{S=new Error(`Model session lost: GGUF native runtime failed: ${String(z).slice(0,300)}`),j(S)};x={noInitialRun:!0,
pthreadPoolSize:0,locateFile(z){if(z!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return o},print:W,
printErr:W,onAbort:ae,onExit:ae,preRun(){x.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){F()},peercomputeOnDevice(z){try{
I==null||I(),I=so(z,E,{collect:y,onLost(X){E.lost=!0,h==null||h(X)}})}catch(X){z.destroy(),ae(X.message)}}};const oe=io(
{files:G,reader:d,getMemory:()=>x.wasmMemory.buffer,getSignal:()=>B});N(x,oe),await ne,be(b),oo(x,G);const se=x.cwrap("w\
llama_start","string",[],{async:!0}),K=x.cwrap("wllama_malloc","bigint",["bigint","number"]),_e=x.cwrap("wllama_action",
"bigint",["string","bigint"],{async:!0});let pe=!1;const ge=async(z,X,l)=>{if(pe)throw new Error("Concurrent GGUF native\
 calls are prohibited");if(S)throw S;if(E.lost)throw new Error("GPU device lost; GGUF session is unavailable");be(l),pe=
!0,B=l;try{const P=ao(X);if(P.byteLength>Bn)throw new Error("GGUF native message exceeds its byte budget");const de=Number(
K(BigInt(P.byteLength),0)),ce=new Uint8Array(x.wasmMemory.buffer);if(!Number.isSafeInteger(de)||de<=0||de+P.length>ce.length)
throw new Error("Invalid GGUF input pointer");ce.set(P,de);const Z=Number(await _e(z,BigInt(de)));if(S)throw S;const ie=x.
wasmMemory.buffer,he=new DataView(ie).getUint32(de,!0);if(!Number.isSafeInteger(Z)||Z<=0||he>Bn||Z+he>ie.byteLength)throw new Error(
"Invalid GGUF output buffer");return no(new Uint8Array(ie,Z,he).slice())}catch(P){throw S??(S=new Error(`Model session l\
ost: GGUF native action failed: ${String(P.message??P).slice(0,300)}`)),S}finally{pe=!1,B=void 0}},q=JSON.parse(await se());
if(S)throw S;if(!q.success||!E.device)throw new Error("GGUF native hardware GPU backend did not initialize");return be(b),
{files:G,action:ge,evidence:E,async settleGpu(){try{await E.device.queue.onSubmittedWorkDone()}catch(z){throw E.lost=!0,
S=new Error(`Model session lost: GGUF GPU completion failed: ${String(z.message??z).slice(0,300)}`),S}},close(){var z;I==
null||I(),(z=E.device)==null||z.destroy()},memoryBytes(){return x.wasmMemory.buffer.byteLength}}}const fo=o=>o/2**32|0,mo=o=>o>>>
0;function po(o,u,d,b){const y=fo(d),w=mo(d);o.setUint32(u,b?w:y,b),o.setUint32(u+4,b?y:w,b)}function xn(o){return o instanceof
Uint8Array||ArrayBuffer.isView(o)&&o.constructor.name==="Uint8Array"&&"BYTES_PER_ELEMENT"in o&&o.BYTES_PER_ELEMENT===1}const go=o=>o?
`"${o}" `:"";function qn(o,u,d=""){if(xn(o)&&u===void 0)return o;const b=xn(o),y="",w=b?`length=${o.length}`:`type=${typeof o}`,
h=go(d)+"expected Uint8Array"+y+", got "+w;throw b?new RangeError(h):new TypeError(h)}const ho=(o,u)=>{if(o===null||typeof o!=
"object"||Array.isArray(o))throw new TypeError((u==="object"?"":`"${u}" `)+"expected object, got type="+typeof o)},Nn=(o,u)=>{
ho(o,u);const d=Object.getPrototypeOf(o);if(d!==Object.prototype&&d!==null)throw new TypeError(`"${u}" expected plain ob\
ject`);if(Object.hasOwn(o,"__proto__"))throw new TypeError(`"${u}.__proto__" is not allowed`)};function Gn(o,u=!0){if(o.
destroyed)throw new Error("hash was destroyed");if(u&&o.finished)throw new Error("digest() was already called")}function bo(o,u){
qn(o,void 0,"output");const d=u.outputLen;if(!(o.length>=d))throw new RangeError('"output" expected length >= '+d)}function In(...o){
for(let u=0;u<o.length;u++)o[u].fill(0)}function Wr(o){return new DataView(o.buffer,o.byteOffset,o.byteLength)}function Te(o,u){
return o<<32-u|o>>>u}function _o(o,u,d="opts"){return Nn(o,"defaults"),u!==void 0&&Nn(u,d),Object.assign(Object.create(null),
o,u)}function vo(o,u={}){if(typeof o!="function")throw new TypeError('"hashCons" expected function, got type='+typeof o);
u=_o({},u,"info");const d=(y,w)=>o(w).update(y).digest(),b=o(void 0);return d.outputLen=b.outputLen,d.blockLen=b.blockLen,
d.canXOF=b.canXOF,d.create=y=>o(y),Object.assign(d,u),Object.freeze(d)}const wo=o=>({oid:Uint8Array.from([6,9,96,134,72,
1,101,3,4,2,o])});function yo(o,u,d){return o&u^~o&d}function Eo(o,u,d){return o&u^o&d^u&d}class ko{constructor(u,d,b,y){
Y(this,"blockLen");Y(this,"outputLen");Y(this,"canXOF",!1);Y(this,"padOffset");Y(this,"isLE");Y(this,"buffer");Y(this,"v\
iew");Y(this,"finished",!1);Y(this,"length",0);Y(this,"pos",0);Y(this,"destroyed",!1);this.blockLen=u,this.outputLen=d,this.
padOffset=b,this.isLE=y,this.buffer=new Uint8Array(u),this.view=Wr(this.buffer)}update(u){Gn(this),qn(u);const{view:d,buffer:b,
blockLen:y}=this,w=u.length;let h=!1;for(let N=0;N<w;){const G=Math.min(y-this.pos,w-N);if(G===y){const E=Wr(u);for(;y<=
w-N;N+=y)this.process(E,N);h=!0;continue}b.set(N===0&&G===w?u:u.subarray(N,N+G),this.pos),this.pos+=G,N+=G,this.pos===y&&
(this.process(d,0),this.pos=0,h=!0)}return this.length+=u.length,h&&this.roundClean(),this}digestInto(u){Gn(this),bo(u,this),
this.finished=!0;const{buffer:d,view:b,blockLen:y,isLE:w}=this;let{pos:h}=this;d[h++]=128,d.fill(0,h),this.padOffset>y-h&&
(this.process(b,0),d.fill(0)),po(b,y-8,this.length*8,w),this.process(b,0),this.roundClean();const N=u===d?b:Wr(u),G=this.
outputLen,E=G/4,B=this.get();if(G%4||E>B.length)throw new Error("invalid outputLen");for(let S=0;S<E;S++)N.setUint32(4*S,
B[S],w)}digest(){const{buffer:u,outputLen:d}=this;this.digestInto(u);const b=u.slice(0,d);return this.destroy(),b}_cloneIntoMeta(u){
const{buffer:d,length:b,finished:y,destroyed:w,pos:h}=this;return u.destroyed=w,u.finished=y,u.length=b,u.pos=h,h&&u.buffer.
set(d),u}clone(){return this._cloneInto()}}const So=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,
2600822924,528734635,1541459225]),Bo=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,
2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,
264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,
113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,
3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,
1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),qe=new Uint32Array(
64);class xo extends ko{constructor(d,b){super(64,d,8,!1);Y(this,"A",0);Y(this,"B",0);Y(this,"C",0);Y(this,"D",0);Y(this,
"E",0);Y(this,"F",0);Y(this,"G",0);Y(this,"H",0);this.A=b[0]|0,this.B=b[1]|0,this.C=b[2]|0,this.D=b[3]|0,this.E=b[4]|0,this.
F=b[5]|0,this.G=b[6]|0,this.H=b[7]|0}get(){const{A:d,B:b,C:y,D:w,E:h,F:N,G,H:E}=this;return[d,b,y,w,h,N,G,E]}set(d,b,y,w,h,N,G,E){
this.A=d|0,this.B=b|0,this.C=y|0,this.D=w|0,this.E=h|0,this.F=N|0,this.G=G|0,this.H=E|0}_cloneInto(d){return(d||(d=new this.
constructor)).set(...this.get()),this._cloneIntoMeta(d)}process(d,b){for(let I=0;I<16;I++,b+=4)qe[I]=d.getUint32(b,!1);for(let I=16;I<
64;I++){const x=qe[I-15],F=qe[I-2],j=Te(x,7)^Te(x,18)^x>>>3,ne=Te(F,17)^Te(F,19)^F>>>10;qe[I]=ne+qe[I-7]+j+qe[I-16]|0}let{
A:y,B:w,C:h,D:N,E:G,F:E,G:B,H:S}=this;for(let I=0;I<64;I++){const x=Te(G,6)^Te(G,11)^Te(G,25),F=S+x+yo(G,E,B)+Bo[I]+qe[I]|
0,ne=(Te(y,2)^Te(y,13)^Te(y,22))+Eo(y,w,h)|0;S=B,B=E,E=G,G=N+F|0,N=h,h=w,w=y,y=F+ne|0}y=y+this.A|0,w=w+this.B|0,h=h+this.
C|0,N=N+this.D|0,G=G+this.E|0,E=E+this.F|0,B=B+this.G|0,S=S+this.H|0,this.set(y,w,h,N,G,E,B,S)}roundClean(){In(qe)}destroy(){
this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),In(this.buffer)}}class No extends xo{constructor(){super(32,So)}}const Go=vo(
()=>new No,wo(1)),le=Object.freeze({maximumBytes:16*1024**3,headerBytes:16*1024**2,rangeBytes:1024**2,metadata:4096,tensors:65536,
arrayItems:1048576,stringBytes:1024**2}),zn=Object.freeze(Qi("llama.cpp").map(o=>o.architecture)),Ln="peercompute.gguf.h\
eader.v1",Io="3.8.1",$r=new Map([[0,["F32",1,4]],[1,["F16",1,2]],[2,["Q4_0",32,18]],[3,["Q4_1",32,20]],[6,["Q5_0",32,22]],
[7,["Q5_1",32,24]],[8,["Q8_0",32,34]],[10,["Q2_K",256,84]],[11,["Q3_K",256,110]],[12,["Q4_K",256,144]],[13,["Q5_K",256,176]],
[14,["Q6_K",256,210]],[16,["IQ2_XXS",256,66]],[17,["IQ2_XS",256,74]],[18,["IQ3_XXS",256,98]],[19,["IQ1_S",256,50]],[20,[
"IQ4_NL",32,18]],[21,["IQ3_S",256,110]],[22,["IQ2_S",256,82]],[23,["IQ4_XS",256,136]],[29,["IQ1_M",256,56]]]),hr=new Map(
[[0,"f32"],[1,"f16"],[2,"q4_0"],[3,"q4_1"],[7,"q8_0"],[8,"q5_0"],[9,"q5_1"],[10,"q2_k"],[11,"q3_k_s"],[12,"q3_k_m"],[13,
"q3_k_l"],[14,"q4_k_s"],[15,"q4_k_m"],[16,"q5_k_s"],[17,"q5_k_m"],[18,"q6_k"],[19,"iq2_xxs"],[20,"iq2_xs"],[21,"q2_k_s"],
[22,"iq3_xs"],[23,"iq3_xxs"],[24,"iq1_s"],[25,"iq4_nl"],[26,"iq3_s"],[27,"iq3_m"],[28,"iq2_s"],[29,"iq2_m"],[30,"iq4_xs"],
[31,"iq1_m"]]),Ao=new TextDecoder("utf-8",{fatal:!0}),Fo=o=>Array.from(o,u=>u.toString(16).padStart(2,"0")).join(""),Q=o=>new Error(
`Unsupported GGUF Hub package: ${o}`);function we(o,u,d,b=0){if(!Number.isSafeInteger(o)||o<b||o>u)throw Q(`invalid ${d}`);
return o}class Co extends Error{constructor(){super("Truncated GGUF header"),this.code="ERR_GGUF_HEADER_TRUNCATED"}}function To(o,{
size:u}={}){var pe,ge;if(!(o instanceof Uint8Array))throw Q("header bytes required");if(we(u,le.maximumBytes,"file size",
24),o.length>le.headerBytes||o.length>u)throw Q("header byte budget exceeded");const d=new DataView(o.buffer,o.byteOffset,
o.byteLength);let b=0;function y(q){if(we(q,le.headerBytes,"header field length"),b+q>le.headerBytes)throw Q("header byt\
e budget exceeded");if(b+q>o.length)throw new Co;const z=b;return b+=q,z}const w=()=>d.getUint32(y(4),!0),h=()=>{const q=d.
getBigUint64(y(8),!0);if(q>BigInt(Number.MAX_SAFE_INTEGER))throw Q("unsafe 64-bit value");return Number(q)};function N(q=le.
stringBytes,z=!0){const X=we(h(),q,"string length"),l=y(X);return z?Ao.decode(o.subarray(l,l+X)):void 0}function G(q,z=!0,X=!1){
if(q===8)return N(le.stringBytes,z);if(q===9){if(X)throw Q("nested metadata arrays");const ce=w(),Z=we(h(),le.arrayItems,
"array count");if(ce===9||ce>12)throw Q("metadata array type");if(ce===8)for(let ie=0;ie<Z;ie++)N(le.stringBytes,!1);else
y(Z*[1,1,2,2,4,4,4,1,0,0,8,8,8][ce]);return{array:!0,element:ce,count:Z}}const l=[1,1,2,2,4,4,4,1,0,0,8,8,8];if(!l[q])throw Q(
"metadata value type");const P=y(l[q]);if(!z)return;if(q===0)return d.getUint8(P);if(q===1)return d.getInt8(P);if(q===2)
return d.getUint16(P,!0);if(q===3)return d.getInt16(P,!0);if(q===4)return d.getUint32(P,!0);if(q===5)return d.getInt32(P,
!0);if(q===6)return d.getFloat32(P,!0);if(q===7){const ce=d.getUint8(P);if(ce>1)throw Q("boolean value");return!!ce}if(q===
12)return d.getFloat64(P,!0);const de=q===10?d.getBigUint64(P,!0):d.getBigInt64(P,!0);if(de>BigInt(Number.MAX_SAFE_INTEGER)||
de<BigInt(Number.MIN_SAFE_INTEGER))throw Q("unsafe metadata integer");return Number(de)}if(w()!==1179993927)throw Q("mag\
ic or byte order");const E=w();if(![2,3].includes(E))throw Q("version");const B=we(h(),le.tensors,"tensor count",1),S=we(
h(),le.metadata,"metadata count",1),I=new Map;for(let q=0;q<S;q++){const z=N(512);if(!z||I.has(z)||/[\u0000-\u001f\u007f]/u.
test(z))throw Q("duplicate or invalid metadata key");if(/georefine|tensor_extra|tensor_data_layout/i.test(z))throw Q("cu\
stom tensor layout requires catalog review");const X=w(),l=["general.architecture","general.type","general.file_type","g\
eneral.alignment","general.name","general.quantization_version","split.count","split.no","split.tensors.count","tokenize\
r.ggml.model","tokenizer.ggml.tokens"].includes(z);I.set(z,G(X,l))}const x=I.get("general.architecture");if(!zn.includes(
x))throw Q("architecture");if(I.has("general.type")&&I.get("general.type")!=="model")throw Q("adapter or non-model GGUF");
if(/georefine/i.test(I.get("general.name")??""))throw Q("custom GeoRefine model requires catalog review");if((I.get("spl\
it.count")??1)!==1||(I.get("split.no")??0)!==0||(I.get("split.tensors.count")??B)!==B)throw Q("split GGUF requires compl\
ete shard admission");if(![void 0,2].includes(I.get("general.quantization_version")))throw Q("quantization version");const F=I.
get("general.file_type");if(!hr.has(F))throw Q("file quantization type");if(!["llama","gpt2"].includes(I.get("tokenizer.\
ggml.model"))||((pe=I.get("tokenizer.ggml.tokens"))==null?void 0:pe.element)!==8||!((ge=I.get("tokenizer.ggml.tokens"))!=
null&&ge.count))throw Q("self-contained supported tokenizer required");const j=we(I.get("general.alignment")??32,4096,"a\
lignment",1);if(j&j-1)throw Q("alignment must be a power of two");const ne=new Set,W=new Set,ae=[];let oe=0;for(let q=0;q<
B;q++){const z=N(512);if(!z||ne.has(z)||/georefine|[\u0000-\u001f\u007f]/iu.test(z))throw Q("duplicate or custom tensor \
name");ne.add(z);const X=we(w(),4,"tensor dimensions",1);let l=1,P=0;for(let he=0;he<X;he++){const R=we(h(),le.maximumBytes,
"tensor dimension",1);he===0&&(P=R),l*=R,we(l,Number.MAX_SAFE_INTEGER,"tensor element count",1)}const de=w(),ce=$r.get(de);
if(!ce||P%ce[1])throw Q("unsupported tensor codec or quantized row shape");const Z=we(l/ce[1]*ce[2],u,"tensor bytes",1),
ie=h();if(ie%j||ie+Z>u)throw Q("tensor offset exceeds file or alignment");ae.push({start:ie,end:ie+Z}),W.add(de),oe=Math.
max(oe,Z)}if(!ne.has("token_embd.weight")||!ne.has("output_norm.weight"))throw Q("text model tensor layout");const se=b,
K=Math.ceil(b/j)*j;ae.sort((q,z)=>q.start-z.start);let _e=0;for(const q of ae){if(q.start<_e||K+q.end>u)throw Q("overlap\
ping or truncated tensor data");_e=q.end}return{schema:Ln,version:E,architecture:x,fileType:F,dtype:hr.get(F),tensorCount:B,
metadataCount:S,headerBytes:se,dataOffset:K,maximumTensorBytes:oe,tensorTypes:[...W].sort((q,z)=>q-z),headerSha256:Fo(Go(
o.subarray(0,se)))}}async function Uo({readRange:o,size:u,signal:d}={}){if(typeof o!="function")throw Q("range reader re\
quired");we(u,le.maximumBytes,"file size",24);let b=new Uint8Array(0),y=Math.min(64*1024,u);for(;;){be(d);const w=new Uint8Array(
y);w.set(b);for(let h=b.length;h<y;){const N=Math.min(le.rangeBytes,y-h),G=await o(h,N,{signal:d});if(be(d),!(G instanceof
Uint8Array)||G.length!==N)throw Q("truncated range response");w.set(G,h),h+=N}b=w;try{return To(b,{size:u})}catch(h){if(h.
code!=="ERR_GGUF_HEADER_TRUNCATED"||y===u)throw h;if(y===le.headerBytes)throw Q("header exceeds bounded probe");y=Math.min(
y*2,u,le.headerBytes)}}}function Ro(o){if(!o||o.schema!==Ln||![2,3].includes(o.version)||!zn.includes(o.architecture)||!hr.
has(o.fileType)||hr.get(o.fileType)!==o.dtype||!/^[a-f0-9]{64}$/.test(o.headerSha256??""))throw Q("header profile");for(const[
d,b]of[["tensorCount",le.tensors],["metadataCount",le.metadata],["headerBytes",le.headerBytes],["dataOffset",le.headerBytes+
4096],["maximumTensorBytes",le.maximumBytes]])we(o[d],b,d,1);if(o.dataOffset<o.headerBytes||!Array.isArray(o.tensorTypes)||
!o.tensorTypes.length||o.tensorTypes.length>$r.size||o.tensorTypes.some((d,b)=>!$r.has(d)||b>0&&d<=o.tensorTypes[b-1]))throw Q(
"tensor profile");const u=["schema","version","architecture","fileType","dtype","tensorCount","metadataCount","headerByt\
es","dataOffset","maximumTensorBytes","tensorTypes","headerSha256"];if(Object.keys(o).some(d=>!u.includes(d)))throw Q("u\
nexpected header profile field");return Object.fromEntries(u.map(d=>[d,o[d]]))}function jo({repository:o,revision:u,file:d,
header:b}={}){if(typeof o!="string"||!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,95}\/[A-Za-z0-9][A-Za-z0-9_.-]{0,95}$/.test(o)||!/^[a-f0-9]{40}$/.
test(u??""))throw Q("immutable Hugging Face repository/revision required");if(Mi(d==null?void 0:d.path),!d.path.endsWith(
".gguf")||!/^[a-f0-9]{64}$/.test(d.sha256??""))throw Q("pinned GGUF SHA-256 required");we(d.size,le.maximumBytes,"weight\
 size",24);const y=Ro(b);if(y.dataOffset+y.maximumTensorBytes>d.size)throw Q("header/file size mismatch");const w=d.size>
4*1024**3;return{model:{runtime:"llama.cpp",runtimeVersion:Io,architecture:y.architecture==="qwen35"?"qwen3_5":y.architecture,
format:"GGUF",task:"text-generation",dtype:y.dtype,modalities:["text"],requiredFeatures:["shader-f16"],repository:o,revision:u,
gguf:{...y,path:d.path,size:d.size,sha256:d.sha256}},weights:[d],totalBytes:d.size,resourcePolicy:{maxModelBytes:le.maximumBytes,
minimumCpuBytes:(w?8:2)*1024**3,minimumGpuBytes:(w?16:2)*1024**3}}}function Mn(o,{files:u,totalBytes:d}={}){if(!(o!=null&&
o.gguf))throw Q("bounded header profile required");const{path:b,size:y,sha256:w,...h}=o.gguf,N=jo({repository:o.repository,
revision:o.revision,file:{path:b,size:y,sha256:w},header:h});for(const G of["runtime","runtimeVersion","architecture","f\
ormat","task","dtype"])if(o[G]!==N.model[G])throw Q(`model ${G} disagrees with header`);if(JSON.stringify(o.modalities)!==
'["text"]'||JSON.stringify(o.requiredFeatures)!=='["shader-f16"]')throw Q("text-only/f16 capability profile required");if(u){
const G=u.filter(E=>E.path.endsWith(".gguf"));if(G.length!==1||G[0].path!==b||G[0].size!==y||G[0].sha256!==w||u.some(E=>!/^[a-f0-9]{64}$/.
test(E.sha256??"")))throw Q("file closure/digest mismatch");N.weights=G,d=u.reduce((E,B)=>E+B.size,0)}return N.totalBytes=
we(d??y,le.maximumBytes,"package bytes",y),N}async function Oo(o,u,d,{signal:b}={}){if(!o.gguf)return;const y=Mn(o,{files:u}).
model.gguf,w=await Uo({size:u[0].size,signal:b,readRange:(B,S,I)=>d.read(u[0].path,B,S,I)}),{path:h,size:N,sha256:G,...E}=y;
if(JSON.stringify(w)!==JSON.stringify(E))throw Q("stored header does not match inspected package")}const tr="Tsotchke-Co\
rporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",nr="5ce3fd841676adf2c1a10d7193637d46007e88f7",An=[{path:".gitattributes",size:1603,
gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1e78282bdef7ca03dd22e\
21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{path:"Qwen3.8-27B-Ge\
oRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8de2990de0d5fdb9e8a979\
299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"artifact-manifest.json",
size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,gitBlobSha1:"c0c\
686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f892630867acfdfd3\
df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"tokenizer_c\
onfig.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,gitBlobSha1:"\
15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Do="This catalog supports verified storage and distribution. Execution is ad\
mitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and resource checks.";
function Qn(o){for(const u of Object.values(o))u&&typeof u=="object"&&Qn(u);return Object.freeze(o)}const qo=Qn({"qwen3.\
8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:tr,
revision:nr,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"\
unavailable",executionReason:Do},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${tr}/blob/${nr}/LICENSE`,
notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:tr,revision:nr,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${tr}/blob/${nr}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:tr,revision:nr},weightBytes:14199740480,
totalBytes:An.reduce((o,u)=>o+u.size,0),files:An}});function Wn(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.
values(o).forEach(Wn),Object.freeze(o)),o}const zo=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],Lo=Wn(Object.fromEntries(zo.map(o=>{const{dtype:u,sourceModel:d,blockCount:b,nextnPredictLayers:y,...w}=o,
N=w.files.find(G=>G.path==="LICENSE").source;return[w.id,{...w,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+N.repository+"/blob/"+N.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:w.repository,revision:w.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+w.repository+"/blob/"+w.revision+"/README.md",sourceModel:{...d,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:b,
nextnPredictLayers:y,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:w.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:u,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:w.repository,revision:w.revision},weightBytes:w.files[0].size,totalBytes:w.
files.reduce((G,E)=>G+E.size,0)}]})));function Kr(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.values(o).
forEach(Kr),Object.freeze(o)),o}const je="Tsotchke-Corporation",Vn=[{id:"qwen3-coder-30b-a3b-georefine-c30-gguf",name:"Q\
wen3 Coder 30B A3B GeoRefine C30 (mixed Q4_K GGUF, candidate text)",repository:`${je}/Qwen3-Coder-30B-A3B-GeoRefine-C30-\
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
S GGUF, candidate text)",repository:`${je}/Qwen3.6-35B-A3B-GeoRefine-C20-GGUF`,revision:"7f385b4ae408eeb81def3013bf2e5ac\
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
Qwen3.8 27B GeoRefine L162 (mixed Q4_K GGUF, candidate text)",repository:`${je}/Qwen3.8-27B-GeoRefine-L162-abl-GGUF`,revision:"\
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
06e0df3640f9ae04fff09706ef"}]}],Mo=Kr(Object.fromEntries(Vn.map(o=>{const{architecture:u,quantizationTypes:d,sourceModel:b,
publisherLimitations:y,...w}=o;return[o.id,{...w,status:"execution-candidate",format:"GGUF",capabilities:{import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires mana\
ged llama.cpp WebGPU, shader-f16 and browser/resource admission. These exact artifacts are not hardware-qualified; curre\
nt file and runtime byte limits still apply."},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${o.repository}\
/blob/${o.revision}/LICENSE`,notice:"Preserve the included LICENSE, NOTICE, model card and pinned publisher manifests."},
provenance:{repository:o.repository,revision:o.revision,format:"GGUF",metadataCheckedAt:"2026-11-04",modelCardUrl:`https\
://huggingface.co/${o.repository}/blob/${o.revision}/README.md`,sourceManifestPath:"artifact-manifest.json",sourceModel:b,
publisherLimitations:y,codecRequired:!1,tensorFormatEvidence:"Pinned publisher GGUF tensor census; no model payload was \
downloaded for catalog admission.",vision:"The managed GGUF adapter is text-only; upstream vision metadata does not esta\
blish browser image support."},model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:u,format:"GGUF",task:"text\
-generation",dtype:"mixed",quantizationTypes:d,modalities:["text"],requiredFeatures:["shader-f16"],repository:o.repository,
revision:o.revision},weightBytes:o.files.filter(h=>h.path.endsWith(".gguf")).reduce((h,N)=>h+N.size,0),totalBytes:o.files.
reduce((h,N)=>h+N.size,0)}]})));Kr({organization:je,sourceUrl:`https://huggingface.co/${je}`,checkedAt:"2026-11-04",repositories:[
...Vn.map(({id:o,repository:u,revision:d})=>({repository:u,revision:d,catalogId:o,format:"GGUF",codecRequired:!1})),{repository:`${je}\
/Qwen3.8-27B-GeoRefine-D14-abl-GGUF`,revision:"5ce3fd841676adf2c1a10d7193637d46007e88f7",catalogId:"qwen3.8-27b-georefin\
e-d14-gguf",format:"GGUF",codecRequired:!1},{repository:`${je}/Qwen3.8-27B-GeoRefine-Context`,revision:"c725e6920301a405\
849b9e373503553789e0d39b",format:"bitexact-predictive-context-package-v1",codecRequired:!0,exclusionReason:"BCTX/PPCX te\
nsors require GeoRefine decoding or its matched CUDA runtime."},{repository:`${je}/Qwen3.8-27B-GeoRefine-Context-abliter\
ated`,revision:"c161a64650b1a94f8cfb54453a98f98a7a0d7185",format:"bitexact-predictive-context-package-v1",codecRequired:!0,
exclusionReason:"Reversible GeoRefine codec package; restore the full BF16 parent before ordinary Transformers loading."},
{repository:`${je}/Qwen3.8-27B-GeoRefine-TBE`,revision:"592b60bb7b554389331a1dae3db1847bf33bdd45",format:"georefine.tbe.\
serve.v1",codecRequired:!0,exclusionReason:"The .safetensors shards are codec containers, requiring GeoRefine TBE or ful\
l BF16 export."}]});const ar="bartowski/Qwen_Qwen3.5-0.8B-GGUF",ir="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",Vr=[{path:"\
Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd4127d9526"},
{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],Jr=Object.freeze({import:!0,pin:!0,
peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requires the \
managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual model execu\
tion must be verified on the selected device."});function Hn(o){return o&&typeof o=="object"&&!Object.isFrozen(o)&&(Object.
values(o).forEach(Hn),Object.freeze(o)),o}const Qo=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",name:"Qw\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:o,...u})=>[u.id,Hn({...u,
status:"execution-candidate",format:"GGUF",capabilities:Jr,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${u.files[2].source.repository}/blob/${u.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:u.repository,revision:u.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${u.repository}/blob/${u.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:o,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:u.repository,revision:u.
revision},weightBytes:u.files[0].size,totalBytes:u.files.reduce((d,b)=>d+b.size,0)})])),Fn=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:ar,revision:ir,status:"ex\
ecution-candidate",format:"GGUF",capabilities:Jr,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${ar}/blob\
/${ir}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:ar,
revision:ir,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${ar}/blob/${ir}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:ar,revision:ir},weightBytes:Vr[0].size,totalBytes:Vr.reduce((o,u)=>o+u.size,0),files:Vr},
...Qo,...Lo,...Mo,...Object.fromEntries(Object.entries(qo).map(([o,u])=>[o,{...u,status:"execution-candidate",capabilities:Jr}]))}),
$n="3.8.1",Cn=2048,Qe=1024**3;function Jn(o){const u=Vi(o),d=u.model,b=Object.values(Fn).filter(E=>E.model.runtime==="ll\
ama.cpp"&&E.repository===(d==null?void 0:d.repository)&&E.revision===(d==null?void 0:d.revision)&&E.model.architecture===
(d==null?void 0:d.architecture)&&E.model.task===(d==null?void 0:d.task)&&E.model.dtype===(d==null?void 0:d.dtype)),y=b.length===
1?b[0]:void 0;if(!y&&(d!=null&&d.gguf)){const E=Mn(d,{files:u.files});for(const B of Object.values(Fn))if(!(B.repository!==
d.repository||B.revision!==d.revision))for(const S of B.files.filter(I=>I.path.endsWith(".gguf"))){const I=E.weights.find(
x=>x.path===S.path);if(I&&(I.size!==S.size||I.sha256!==S.sha256))throw new Error("GGUF weights do not match the pinned c\
atalog digests")}return{...E,manifest:u}}if(!y||d.runtime!=="llama.cpp"||d.runtimeVersion!==void 0&&d.runtimeVersion!==$n||
y.model.runtimeVersion!==void 0&&d.runtimeVersion!==y.model.runtimeVersion||d.dtype!==y.model.dtype||d.format!=="GGUF"||
d.task!=="text-generation")throw new Error("GGUF model revision is not in the trusted runtime catalog");const w=u.files.
filter(E=>E.path.endsWith(".gguf")),h=y.files.filter(E=>E.path.endsWith(".gguf"));if(!w.length||w.length!==h.length||w.some(
E=>!h.some(B=>B.path===E.path&&B.size===E.size&&B.sha256===E.sha256)))throw new Error("GGUF weights do not match the pin\
ned catalog digests");const N=u.files.reduce((E,B)=>E+B.size,0);if(!Number.isSafeInteger(N)||N>16*Qe)throw new Error("GG\
UF package exceeds its byte budget");const G=w.reduce((E,B)=>E+B.size,0)>4*Qe;return{manifest:u,weights:w,totalBytes:N,resourcePolicy:{
maxModelBytes:16*Qe,minimumCpuBytes:G?8*Qe:2*Qe,minimumGpuBytes:G?16*Qe:2*Qe}}}function Pn(o,u=(d=>(d=globalThis.location)==
null?void 0:d.href)()){const b=new URL(u);if(!o||Object.keys(o).some(w=>w!=="wasm")||typeof o.wasm!="string")throw new Error(
"GGUF runtime needs one trusted WASM asset");const y=new URL(o.wasm,b);if(y.origin!==b.origin||!["http:","https:"].includes(
y.protocol)||y.username||y.password||y.search||y.hash||!y.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM \
must be a fixed same-origin asset");return{wasm:y.href}}function Kn(o={}){if(!o||typeof o!="object"||Array.isArray(o)||Object.
keys(o).some(d=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(d)))throw new Error("Unknown GGUF runtime optio\
n");const u={n_ctx:Cn,n_batch:64,n_gpu_layers:99999,n_threads:1,...o};if(!Number.isInteger(u.n_ctx)||u.n_ctx<64||u.n_ctx>
Cn||!Number.isInteger(u.n_batch)||u.n_batch<1||u.n_batch>128||!Number.isInteger(u.n_gpu_layers)||u.n_gpu_layers<1||u.n_gpu_layers>
99999||u.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(u)}async function Wo({
scope:o=globalThis,gpu:u=(d=>(d=o.navigator)==null?void 0:d.gpu)()}={}){var w,h,N;if(!o.crossOriginIsolated||!o.SharedArrayBuffer)
throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const b=o.WebAssembly;if(typeof(b==null?void 0:
b.Suspending)!="function"||typeof(b==null?void 0:b.promising)!="function")throw new Error("GGUF requires WebAssembly JSP\
I");try{new b.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAss\
embly memory64")}const y=await(u==null?void 0:u.requestAdapter({powerPreference:"high-performance"}));if(!y||y.isFallbackAdapter||
(w=y.info)!=null&&w.isFallbackAdapter)throw new Error("GGUF requires a hardware WebGPU adapter");if(!y.features.has("sha\
der-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:((h=y.info)==
null?void 0:h.vendor)??"",architecture:((N=y.info)==null?void 0:N.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const Vo=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:Jn,validateRuntimeAssets:Pn,validateRuntimeOptions:Kn,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:o,maxNewTokens:u}){if(o)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(u)||u<1||u>Hr.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),Tn=o=>new TextEncoder().
encode(o).byteLength;function Ho(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"GGUF inference requires a ComputeManager-owned worker")}function Un(o){var u,d,b,y,w,h,N,G,E;return{sessionId:o.sessionId,
manifestCid:o.manifestCid,status:o.lost?"lost":o.status,runtime:"llama.cpp",runtimeVersion:$n,task:"text-generation",workerId:o.
workerId,adapter:(u=o.capabilities)==null?void 0:u.adapter,runtimeAdapter:((d=o.engine)==null?void 0:d.evidence.runtimeAdapter)??
null,runtimeFeatures:((b=o.engine)==null?void 0:b.evidence.runtimeFeatures)??[],gpuDispatches:((y=o.engine)==null?void 0:
y.evidence.dispatches)??0,gpuSubmissions:((w=o.engine)==null?void 0:w.evidence.submissions)??0,gpuOffload:((h=o.engine)==
null?void 0:h.evidence.offload)??null,runtimeOptions:o.options,nativeBuffers:((N=o.engine)==null?void 0:N.evidence.buffers)??
[],wasmMemoryBytes:((G=o.engine)==null?void 0:G.memoryBytes())??0,generatedRequests:o.generatedRequests,artifactReads:((E=
o.reader)==null?void 0:E.getStats())??null}}function $o({loadEngine:o=uo,createReader:u=zi,checkCapabilities:d=Wo,assertWorker:b=Ho,
baseUrl:y=(w=>(w=globalThis.location)==null?void 0:w.href)()}={}){let h;async function N(E,B){var ne,W,ae;if(h)throw new Error(
"GGUF worker already has a resident model");const S=Jn(E.manifest),I=Pn(E.runtimeAssets,y),x=Kn(E.runtimeOptions),F=gr(E.
sessionId);be(B.signal);const j={sessionId:F,manifestCid:E.manifestCid,workerId:B.workerId??null,manifest:S.manifest,status:"\
loading",options:x,generatedRequests:0,residency:new AbortController,lost:!1};h=j;try{if(j.capabilities=await d(),be(B.signal),
j.reader=u(E.artifactPort,{manifest:S.manifest,signal:j.residency.signal,maxReadBytes:Dn,maxReads:1}),await Oo(S.manifest.
model,S.weights,j.reader,{signal:B.signal}),be(B.signal),j.engine=await o({wasmUrl:I.wasm,weights:S.weights,reader:j.reader,
signal:B.signal,collectGpuEvidence:E.collectGpuEvidence===!0,onProgress:K=>{var _e;return(_e=B.emitProgress)==null?void 0:
_e.call(B,{...K,sessionId:F})},onLost(){var K;j.lost=!0,(K=j.active)==null||K.abort("GPU device lost")}}),be(B.signal),!(await j.
engine.action("load",{_name:"load_req",model_paths:j.engine.files.map(K=>`models/${K.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,
...x,n_ubatch:Math.min(64,x.n_batch),n_parallel:1,kv_unified:!0,log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,
jinja:!0},B.signal)).success)throw new Error("GGUF native model load failed");const se=j.engine.evidence.offload;if(!se||
se.gpuLayers<1||se.gpuLayers!==Math.min(x.n_gpu_layers,se.totalLayers))throw new Error("GGUF did not honor the explicitl\
y configured GPU layer offload");if(be(B.signal),j.lost)throw new Error("GPU device lost during GGUF load");return j.status=
"ready",Un(j)}catch(oe){throw j.engine&&((ne=B.emitProgress)==null||ne.call(B,{type:"model-load-memory",sessionId:F,wasmMemoryBytes:j.
engine.memoryBytes(),nativeBuffers:j.engine.evidence.buffers??[]})),j.lost=!0,j.status="lost",j.residency.abort(oe),(W=j.
reader)==null||W.close(oe),(ae=j.engine)==null||ae.close(),oe}}async function G(E,B){var z,X,l,P,de,ce,Z,ie,he,R,O,We,ke;
const S=h;if(!S||S.sessionId!==gr(E.sessionId)||S.lost)throw new Error("Model session lost or not loaded");if(S.status!==
"ready")throw new Error("GGUF model session is busy");const I=gr(E.requestId),x=E.maxNewTokens??Hr.maxNewTokens;Vo.validateGenerationInput(
{...E,maxNewTokens:x});const F=Li(E),j=new AbortController,ne=()=>{var V;return j.abort((V=B.signal)==null?void 0:V.reason)};
(z=B.signal)==null||z.addEventListener("abort",ne,{once:!0}),(X=B.signal)!=null&&X.aborted&&ne(),S.active=j,S.status="ge\
nerating",S.requestId=I;const W=S.engine.evidence.dispatches,ae=S.engine.evidence.submissions;let oe,se=!1,K="",_e=0,pe=null,
ge=null,q="unknown";try{const V=await S.engine.action("completion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify(
{messages:F,stream:!0,max_tokens:x,temperature:0,cache_prompt:!1,chat_template_kwargs:{enable_thinking:!1}}),files:[]},j.
signal);if(!V.success||!Number.isInteger(V.req_id))throw new Error("GGUF failed to start generation");oe=V.req_id,be(j.signal);
for(let A=0;A<4096;A+=1){be(j.signal);const Se=await S.engine.action("get_result",{_name:"gres_req",req_id:oe},j.signal);
if(be(j.signal),!Se.success||Se.is_error)throw new Error("GGUF generation failed or exceeded the context budget; shorten\
 the conversation or request fewer output tokens");if(Se.data_json&&Se.data_json!=="null"){if(Tn(Se.data_json)>1024*1024)
throw new Error("GGUF result exceeds its byte budget");const Be=JSON.parse(Se.data_json);for(const xe of Array.isArray(Be)?
Be:[Be]){const Ke=((P=(l=xe.choices)==null?void 0:l[0])==null?void 0:P.finish_reason)??xe.finish_reason;Ke!=null&&(q=["s\
top","length"].includes(Ke)?Ke:"unknown");const ze=((Z=(ce=(de=xe.choices)==null?void 0:de[0])==null?void 0:ce.delta)==null?
void 0:Z.content)??xe.content??"";if(typeof ze!="string")throw new Error("Invalid GGUF text chunk");if(K+=ze,Tn(K)>Hr.maxOutputBytes)
throw new Error("GGUF output exceeds its byte budget");if(ze&&((ie=B.emitProgress)==null?void 0:ie.call(B,{type:"token",
sessionId:S.sessionId,requestId:I,sequence:_e++,text:ze}))===!1)throw new Error("Token consumer rejected output");pe=((he=
xe.usage)==null?void 0:he.prompt_tokens)??((R=xe.timings)==null?void 0:R.prompt_n)??pe,ge=((O=xe.usage)==null?void 0:O.completion_tokens)??
((We=xe.timings)==null?void 0:We.predicted_n)??ge}}if(!Se.has_more){se=!0;break}await new Promise(Be=>setTimeout(Be,0))}
if(!se)throw new Error("GGUF result polling exceeded its request budget");if(await S.engine.settleGpu(),be(j.signal),S.lost)
throw new Error("GPU device lost; model session is unavailable");if(ge!==null&&(!Number.isSafeInteger(ge)||ge>x))throw new Error(
"GGUF returned an over-budget token sequence");return S.generatedRequests+=1,{sessionId:S.sessionId,requestId:I,text:K,inputTokens:pe,
outputTokens:ge,finishReason:q,contextTruncated:!1,workerId:S.workerId,gpuDispatches:S.engine.evidence.dispatches-W,gpuSubmissions:S.
engine.evidence.submissions-ae,gpuOffload:S.engine.evidence.offload,artifactReads:S.reader.getStats()}}catch(V){throw(V==
null?void 0:V.name)==="RuntimeError"?(S.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(V.message).slice(
0,300)}`)):(/Model session lost|GPU device lost/.test(V.message??"")&&(S.lost=!0),V)}finally{(ke=B.signal)==null||ke.removeEventListener(
"abort",ne);try{!se&&oe!==void 0&&!S.lost&&await S.engine.action("cancel",{_name:"cncl_req",req_id:oe})}catch(V){throw S.
lost=!0,new Error(`Model session lost during GGUF cancellation: ${V.message}`)}finally{S.active=null,S.requestId=null,S.
status=S.lost?"lost":"ready"}}}return async(E={},B={})=>{var I,x,F;if(b(),E.command==="load")return N(E,B);if(E.command===
"generate")return G(E,B);const S=gr(E.sessionId);if(E.command==="status")return(h==null?void 0:h.sessionId)===S?Un(h):{sessionId:S,
status:"absent"};if(!h||h.sessionId!==S)throw new Error("Model session lost or not loaded");if(E.command==="cancel")return h.
requestId===E.requestId&&((I=h.active)==null||I.abort(Wi())),{sessionId:S,cancellationRequested:!0};if(E.command==="unlo\
ad"){if(h.status==="generating")throw new Error("Cancel and await GGUF generation before unloading");return h.residency.
abort("GGUF unload"),(x=h.reader)==null||x.close(),(F=h.engine)==null||F.close(),h=null,{sessionId:S,status:"unloaded",requiresWorkerTermination:!0}}
throw new Error("Unknown GGUF inference command")}}const Jo=$o(),es=(o,u)=>Jo(o,u);export{$o as createGgufTaskRuntime,es as handleModelTask};

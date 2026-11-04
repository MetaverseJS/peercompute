var hi=Object.defineProperty;var vi=(l,b,S)=>b in l?hi(l,b,{enumerable:!0,configurable:!0,writable:!0,value:S}):l[b]=S;var ve=(l,b,S)=>vi(l,typeof b!="symbol"?b+"":b,S);import{n as wi,c as yi}from"./GgufArtifactReader-wzk-RGnA.js";import{t as fe,M as Or,v as ur,n as Ei,a as ki}from"./modelTask-CpeYX26T.js";function Si(l,b){var un,cn,fn,mn,dn,pn;const S=class{constructor(){throw new Error("Nested GGUF workers are prohibited")}};
var F=!!globalThis.window,T=!!globalThis.WorkerGlobalScope,w=((cn=(un=globalThis.process)==null?void 0:un.versions)==null?
void 0:cn.node)&&((fn=globalThis.process)==null?void 0:fn.type)!="renderer",v=T&&((mn=self.name)==null?void 0:mn.startsWith(
"em-pthread"));if(w){var q=require("worker_threads");global.Worker=q.Worker,T=!q.isMainThread,v=T&&q.workerData=="em-pth\
read"}var Q="./this.program",h=(e,r)=>{throw r},x=(pn=(dn=globalThis.document)==null?void 0:dn.currentScript)==null?void 0:
pn.src;typeof __filename<"u"?x=__filename:T&&(x=self.location.href);var y="";function V(e){return l.locateFile?l.locateFile(
e,y):y+e}var E,G;if(w){var D=require("fs");y=__dirname+"/",G=e=>{e=X(e)?new URL(e):e;var r=D.readFileSync(e);return r},E=
async(e,r=!0)=>{e=X(e)?new URL(e):e;var t=D.readFileSync(e,r?void 0:"utf8");return t},process.argv.length>1&&(Q=process.
argv[1].replace(/\\/g,"/")),process.argv.slice(2),typeof module<"u"&&(module.exports=l),h=(e,r)=>{throw process.exitCode=
e,r}}else if(F||T){try{y=new URL(".",x).href}catch{}w||(T&&(G=e=>{var r=new XMLHttpRequest;return r.open("GET",e,!1),r.responseType=
"arraybuffer",r.send(null),new Uint8Array(r.response)}),E=async e=>{if(X(e))return new Promise((t,n)=>{var i=new XMLHttpRequest;
i.open("GET",e,!0),i.responseType="arraybuffer",i.onload=()=>{if(i.status==200||i.status==0&&i.response){t(i.response);return}
n(i.status)},i.onerror=n,i.send(null)});var r=await fetch(e,{credentials:"same-origin"});if(r.ok)return r.arrayBuffer();
throw new Error(r.status+" : "+r.url)})}var ie=console.log.bind(console),z=console.error.bind(console);if(w){var K=require("util"),
ne=e=>typeof e=="object"?K.inspect(e):e;ie=(...e)=>D.writeSync(1,e.map(ne).join(" ")+`
`),z=(...e)=>D.writeSync(2,e.map(ne).join(" ")+`
`)}var ee=ie,P=z,me,ue,ce=!1,_e;function Y(e,r){e||ge(r)}var X=e=>e.startsWith("file://");function u(){Be.buffer!=re.buffer&&
ye()}if(w&&v){var oe=q.parentPort;oe.on("message",e=>{var r;return(r=global.onmessage)==null?void 0:r.call(global,{data:e})}),
Object.assign(globalThis,{self:global,postMessage:e=>oe.postMessage(e)}),process.on("uncaughtException",e=>{postMessage(
{cmd:"uncaughtException",error:e}),process.exit(1)})}var de;if(v){var xe=!1;self.onunhandledrejection=r=>{throw r.reason||
r};async function e(r){try{var t=r.data,n=t.cmd;if(n==="load"){let i=[];self.onmessage=o=>i.push(o),de=()=>{postMessage(
{cmd:"loaded"});for(let o of i)e(o);self.onmessage=e};for(const o of t.handlers)(!l[o]||l[o].proxy)&&(l[o]=(...s)=>{postMessage(
{cmd:"callHandler",handler:o,args:s})},o=="print"&&(ee=l[o]),o=="printErr"&&(P=l[o]));Be=t.wasmMemory,ye(),ue=t.wasmModule,
zr(),lr()}else if(n==="run"){On(t.pthread_ptr),Dr(t.pthread_ptr,0,0,1,0,0),W.threadInitTLS(),Sr(t.pthread_ptr),xe||(xe=!0);
try{await rt(t.start_routine,t.arg)}catch(i){if(i!="unwind")throw i}}else t.target==="setimmediate"||(n==="checkMailbox"?
xe&&ar():n&&(P(`worker: received unknown command ${n}`),P(t)))}catch(i){throw Kt(),i}}self.onmessage=e}var re,se,pe,A,C,
Oe,he,O,k,we=!1;function ye(){var e=Be.buffer;re=new Int8Array(e),pe=new Int16Array(e),l.HEAPU8=se=new Uint8Array(e),A=new Int32Array(
e),C=new Uint32Array(e),Oe=new Float32Array(e),he=new Float64Array(e),O=new BigInt64Array(e),k=new BigUint64Array(e)}function Ee(){
if(!v){if(l.wasmMemory)Be=l.wasmMemory;else{var e=l.INITIAL_MEMORY||134217728;Be=new WebAssembly.Memory({initial:BigInt(
e/65536),maximum:65536n,shared:!0,address:"i64"})}ye()}}function Qe(){if(l.preRun)for(typeof l.preRun=="function"&&(l.preRun=
[l.preRun]);l.preRun.length;)Hr(l.preRun.shift());Jr($r)}function Ue(){if(we=!0,v)return de();!l.noFSInit&&!a.initialized&&
a.init(),Ge.__wasm_call_ctors(),a.ignorePermissions=!1}function Gn(){if(!v){if(l.postRun)for(typeof l.postRun=="function"&&
(l.postRun=[l.postRun]);l.postRun.length;)jn(l.postRun.shift());Jr(Zr)}}function ge(e){var t;(t=l.onAbort)==null||t.call(
l,e),e="Aborted("+e+")",P(e),ce=!0,e+=". Build with -sASSERTIONS for more info.",we&&tn();var r=new WebAssembly.RuntimeError(
e);throw r}var cr;function Cn(){return V("wllama.wasm")}function Tn(e){if(e==cr&&me)return new Uint8Array(me);if(G)return G(
e);throw"both async and sync fetching of the wasm failed"}async function Un(e){if(!me)try{var r=await E(e);return new Uint8Array(
r)}catch{}return Tn(e)}async function Dn(e,r){try{var t=await Un(e),n=await WebAssembly.instantiate(t,r);return n}catch(i){
P(`failed to asynchronously prepare wasm: ${i}`),ge(i)}}async function Rn(e,r,t){if(!e&&!X(r)&&!w)try{var n=fetch(r,{credentials:"\
same-origin"}),i=await WebAssembly.instantiateStreaming(n,t);return i}catch(o){P(`wasm streaming compile failed: ${o}`),
P("falling back to ArrayBuffer instantiation")}return Dn(r,t)}function qr(){gi(),We.__instrumented||(We.__instrumented=!0,
be.instrumentWasmImports(We));var e={env:We,wasi_snapshot_preview1:We};return e}async function zr(){function e(s,c){return Ge=
s.exports,Ge=be.instrumentWasmExports(Ge),Ge=bi(Ge),Ln(Ge._emscripten_tls_init),pi(Ge),ue=c,rr(),Ge}tr();function r(s){return e(
s.instance,s.module)}var t=qr();if(l.instantiateWasm)return new Promise((s,c)=>{l.instantiateWasm(t,(m,_)=>{s(e(m,_))})});
if(v){var n=new WebAssembly.Instance(ue,qr());return e(n,ue)}cr??(cr=Cn());var i=await Rn(me,cr,t),o=r(i);return o}class Wr{constructor(r){
ve(this,"name","ExitStatus");this.message=`Program terminated with exit(${r})`,this.status=r}}var Qr=e=>{e.terminate(),e.
onmessage=r=>{}},Vr=e=>{var r=W.pthreads[e];W.returnWorkerToPool(r)},Jr=e=>{for(;e.length>0;)e.shift()(l)},$r=[],Hr=e=>$r.
push(e),De=0,Ve=null,rr=e=>{var t;if(De--,(t=l.monitorRunDependencies)==null||t.call(l,De),De==0&&Ve){var r=Ve;Ve=null,r()}},
tr=e=>{var r;De++,(r=l.monitorRunDependencies)==null||r.call(l,De)},Pr=e=>{var r=W.getNewWorker();if(!r)return 6;W.runningWorkers.
push(r),W.pthreads[e.pthread_ptr]=r,r.pthread_ptr=e.pthread_ptr;var t={cmd:"run",start_routine:e.startRoutine,arg:e.arg,
pthread_ptr:e.pthread_ptr};return w&&r.unref(),r.postMessage(t,e.transferList),0},nr=0,fr=()=>gr||nr>0,ke=()=>sn(),Se=e=>an(
e),mr=e=>on(e),te=(e,r,t,...n)=>{for(var i=n.length*2,o=ke(),s=mr(i*8),c=s/8,m=0;m<n.length;m++){var _=n[m];typeof _=="b\
igint"?((u(),O)[c+2*m]=1n,(u(),O)[c+2*m+1]=_):((u(),O)[c+2*m]=0n,(u(),he)[c+2*m+1]=_)}var g=Xt(e,r,i,s,t);return Se(o),g};
function Yr(e){var r;if(v)return te(0,0,1,e);_e=e,fr()||(W.terminateAllThreads(),(r=l.onExit)==null||r.call(l,e),ce=!0),
h(e,new Wr(e))}function Kr(e){if(v)return te(1,0,0,e);dr(e)}var Xr=(e,r)=>{if(_e=e,v)throw Kr(e),"unwind";Yr(e)},dr=Xr,W={
unusedWorkers:[],runningWorkers:[],tlsInitFunctions:[],pthreads:{},init(){v||W.initMainThread()},initMainThread(){for(var e=l.
pthreadPoolSize;e--;)W.allocateUnusedWorker();Hr(async()=>{var r=W.loadWasmModuleToAllWorkers();tr(),await r,rr()})},terminateAllThreads:()=>{
for(var e of W.runningWorkers)Qr(e);for(var e of W.unusedWorkers)Qr(e);W.unusedWorkers=[],W.runningWorkers=[],W.pthreads=
{}},returnWorkerToPool:e=>{var r=e.pthread_ptr;delete W.pthreads[r],W.unusedWorkers.push(e),W.runningWorkers.splice(W.runningWorkers.
indexOf(e),1),e.pthread_ptr=0,Zt(r)},threadInitTLS(){W.tlsInitFunctions.forEach(e=>e())},loadWasmModuleToWorker:e=>new Promise(
r=>{e.onmessage=o=>{var s=o.data,c=s.cmd;if(s.targetThread&&s.targetThread!=sr()){var m=W.pthreads[s.targetThread];m?m.postMessage(
s,s.transferList):P(`Internal error! Worker sent a message "${c}" to target pthread ${s.targetThread}, but that thread n\
o longer exists!`);return}c==="checkMailbox"?ar():c==="spawnThread"?Pr(s):c==="cleanupThread"?Fe(()=>Vr(s.thread)):c==="\
loaded"?(e.loaded=!0,w&&!e.pthread_ptr&&e.unref(),r(e)):s.target==="setimmediate"?e.postMessage(s):c==="uncaughtExceptio\
n"?e.onerror(s.error):c==="callHandler"?l[s.handler](...s.args):c&&P(`worker sent an unknown command ${c}`)},e.onerror=o=>{
var s="worker sent an error!";throw P(`${s} ${o.filename}:${o.lineno}: ${o.message}`),o},w&&(e.on("message",o=>e.onmessage(
{data:o})),e.on("error",o=>e.onerror(o)));var t=[],n=["onExit","onAbort","print","printErr"];for(var i of n)l.propertyIsEnumerable(
i)&&t.push(i);e.postMessage({cmd:"load",handlers:t,wasmMemory:Be,wasmModule:ue})}),async loadWasmModuleToAllWorkers(){return v?
void 0:Promise.all(W.unusedWorkers.map(W.loadWasmModuleToWorker))},allocateUnusedWorker(){var e,r=x;l.mainScriptUrlOrBlob&&
(r=l.mainScriptUrlOrBlob,typeof r!="string"&&(r=URL.createObjectURL(r))),e=new S(r,{workerData:"em-pthread",name:"em-pth\
read"}),W.unusedWorkers.push(e)},getNewWorker(){return W.unusedWorkers.length==0&&(W.allocateUnusedWorker(),W.loadWasmModuleToWorker(
W.unusedWorkers[0])),W.unusedWorkers.pop()}},Zr=[],jn=e=>Zr.push(e);function On(e){var r=Number((u(),k)[(e+88)/8]),t=Number(
(u(),k)[(e+96)/8]),n=r-t;nn(r,n),Se(r)}var pr=[],et=e=>{e=Number(e);var r=pr[e];return r||(pr[e]=r=ln.get(BigInt(e)),be.
isAsyncExport(r)&&(pr[e]=r=be.makeAsyncFunction(r))),r},rt=async(e,r)=>{nr=0,gr=0;var t=(i=>WebAssembly.promising(et(e)).
call(null,BigInt(i)))(r);function n(i){if(fr()){_e=i;return}Rr(i)}t=await t,n(t)};rt.isAsync=!0;var gr=!0,Ln=e=>W.tlsInitFunctions.
push(e),Be;function tt(e,r,t,n){return v?te(2,0,1,e,r,t,n):nt(e,r,t,n)}var Mn=()=>!!globalThis.SharedArrayBuffer,qn=9007199254740992,
zn=-9007199254740992,p=e=>e<zn||e>qn?NaN:Number(e);function nt(e,r,t,n){if(e=p(e),r=p(r),t=p(t),n=p(n),!Mn())return 6;var i=[],
o=0;if(v&&(i.length===0||o))return tt(e,r,t,n);var s={startRoutine:t,pthread_ptr:e,arg:n,transferList:i};return v?(s.cmd=
"spawnThread",postMessage(s,i),0):Pr(s)}var Le=()=>{var e=Number((u(),k)[$.varargs/8]);return $.varargs+=8,e},br=()=>{var e=(u(),
A)[+$.varargs/4];return $.varargs+=4,e},J={isAbs:e=>e.charAt(0)==="/",splitPath:e=>{var r=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
return r.exec(e).slice(1)},normalizeArray:(e,r)=>{for(var t=0,n=e.length-1;n>=0;n--){var i=e[n];i==="."?e.splice(n,1):i===
".."?(e.splice(n,1),t++):t&&(e.splice(n,1),t--)}if(r)for(;t;t--)e.unshift("..");return e},normalize:e=>{var r=J.isAbs(e),
t=e.slice(-1)==="/";return e=J.normalizeArray(e.split("/").filter(n=>!!n),!r).join("/"),!e&&!r&&(e="."),e&&t&&(e+="/"),(r?
"/":"")+e},dirname:e=>{var r=J.splitPath(e),t=r[0],n=r[1];return!t&&!n?".":(n&&(n=n.slice(0,-1)),t+n)},basename:e=>e&&e.
match(/([^\/]+|\/)\/*$/)[1],join:(...e)=>J.normalize(e.join("/")),join2:(e,r)=>J.normalize(e+"/"+r)},Wn=()=>e=>e.set(crypto.
getRandomValues(new Uint8Array(e.byteLength))),_r=e=>{(_r=Wn())(e)},Me={resolve:(...e)=>{for(var r="",t=!1,n=e.length-1;n>=
-1&&!t;n--){var i=n>=0?e[n]:a.cwd();if(typeof i!="string")throw new TypeError("Arguments to path.resolve must be strings");
if(!i)return"";r=i+"/"+r,t=J.isAbs(i)}return r=J.normalizeArray(r.split("/").filter(o=>!!o),!t).join("/"),(t?"/":"")+r||
"."},relative:(e,r)=>{e=Me.resolve(e).slice(1),r=Me.resolve(r).slice(1);function t(_){for(var g=0;g<_.length&&_[g]==="";g++)
;for(var B=_.length-1;B>=0&&_[B]==="";B--);return g>B?[]:_.slice(g,B-g+1)}for(var n=t(e.split("/")),i=t(r.split("/")),o=Math.
min(n.length,i.length),s=o,c=0;c<o;c++)if(n[c]!==i[c]){s=c;break}for(var m=[],c=s;c<n.length;c++)m.push("..");return m=m.
concat(i.slice(s)),m.join("/")}},at=globalThis.TextDecoder&&new TextDecoder,Qn=(e,r,t,n)=>{for(var i=r+t;e[r]&&!(r>=i);)
++r;return r},qe=(e,r=0,t,n)=>{var i=Qn(e,r,t);if(i-r>16&&e.buffer&&at)return at.decode(e.buffer instanceof ArrayBuffer?
e.subarray(r,i):e.slice(r,i));for(var o="";r<i;){var s=e[r++];if(!(s&128)){o+=String.fromCharCode(s);continue}var c=e[r++]&
63;if((s&224)==192){o+=String.fromCharCode((s&31)<<6|c);continue}var m=e[r++]&63;if((s&240)==224?s=(s&15)<<12|c<<6|m:s=(s&
7)<<18|c<<12|m<<6|e[r++]&63,s<65536)o+=String.fromCharCode(s);else{var _=s-65536;o+=String.fromCharCode(55296|_>>10,56320|
_&1023)}}return o},hr=[],Ne=e=>{for(var r=0,t=0;t<e.length;++t){var n=e.charCodeAt(t);n<=127?r++:n<=2047?r+=2:n>=55296&&
n<=57343?(r+=4,++t):r+=3}return r},it=(e,r,t,n)=>{if(!(n>0))return 0;for(var i=t,o=t+n-1,s=0;s<e.length;++s){var c=e.codePointAt(
s);if(c<=127){if(t>=o)break;r[t++]=c}else if(c<=2047){if(t+1>=o)break;r[t++]=192|c>>6,r[t++]=128|c&63}else if(c<=65535){
if(t+2>=o)break;r[t++]=224|c>>12,r[t++]=128|c>>6&63,r[t++]=128|c&63}else{if(t+3>=o)break;r[t++]=240|c>>18,r[t++]=128|c>>
12&63,r[t++]=128|c>>6&63,r[t++]=128|c&63,s++}}return r[t]=0,t-i},vr=(e,r,t)=>{var n=Ne(e)+1,i=new Array(n),o=it(e,i,0,i.
length);return i.length=o,i},Vn=()=>{var o;if(!hr.length){var e=null;if(w){var r=256,t=Buffer.alloc(r),n=0,i=process.stdin.
fd;try{n=D.readSync(i,t,0,r)}catch(s){if(s.toString().includes("EOF"))n=0;else throw s}n>0&&(e=t.slice(0,n).toString("ut\
f-8"))}else(o=globalThis.window)!=null&&o.prompt&&(e=window.prompt("Input: "),e!==null&&(e+=`
`));if(!e)return null;hr=vr(e)}return hr.shift()},Re={ttys:[],init(){},shutdown(){},register(e,r){Re.ttys[e]={input:[],output:[],
ops:r},a.registerDevice(e,Re.stream_ops)},stream_ops:{open(e){var r=Re.ttys[e.node.rdev];if(!r)throw new a.ErrnoError(43);
e.tty=r,e.seekable=!1},close(e){e.tty.ops.fsync(e.tty)},fsync(e){e.tty.ops.fsync(e.tty)},read(e,r,t,n,i){if(!e.tty||!e.tty.
ops.get_char)throw new a.ErrnoError(60);for(var o=0,s=0;s<n;s++){var c;try{c=e.tty.ops.get_char(e.tty)}catch{throw new a.
ErrnoError(29)}if(c===void 0&&o===0)throw new a.ErrnoError(6);if(c==null)break;o++,r[t+s]=c}return o&&(e.node.atime=Date.
now()),o},write(e,r,t,n,i){if(!e.tty||!e.tty.ops.put_char)throw new a.ErrnoError(60);try{for(var o=0;o<n;o++)e.tty.ops.put_char(
e.tty,r[t+o])}catch{throw new a.ErrnoError(29)}return n&&(e.node.mtime=e.node.ctime=Date.now()),o}},default_tty_ops:{get_char(e){
return Vn()},put_char(e,r){r===null||r===10?(ee(qe(e.output)),e.output=[]):r!=0&&e.output.push(r)},fsync(e){var r;((r=e.
output)==null?void 0:r.length)>0&&(ee(qe(e.output)),e.output=[])},ioctl_tcgets(e){return{c_iflag:25856,c_oflag:5,c_cflag:191,
c_lflag:35387,c_cc:[3,28,127,21,4,0,1,0,17,19,26,0,18,15,23,22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}},ioctl_tcsets(e,r,t){return 0},
ioctl_tiocgwinsz(e){return[24,80]}},default_tty1_ops:{put_char(e,r){r===null||r===10?(P(qe(e.output)),e.output=[]):r!=0&&
e.output.push(r)},fsync(e){var r;((r=e.output)==null?void 0:r.length)>0&&(P(qe(e.output)),e.output=[])}}},Jn=(e,r)=>(u(),
se).fill(0,e,e+r),ot=(e,r)=>Math.ceil(e/r)*r,wr=e=>{e=ot(e,65536);var r=Yt(65536,e);return r&&Jn(r,e),r},R={ops_table:null,
mount(e){return R.createNode(null,"/",16895,0)},createNode(e,r,t,n){if(a.isBlkdev(t)||a.isFIFO(t))throw new a.ErrnoError(
63);R.ops_table||(R.ops_table={dir:{node:{getattr:R.node_ops.getattr,setattr:R.node_ops.setattr,lookup:R.node_ops.lookup,
mknod:R.node_ops.mknod,rename:R.node_ops.rename,unlink:R.node_ops.unlink,rmdir:R.node_ops.rmdir,readdir:R.node_ops.readdir,
symlink:R.node_ops.symlink},stream:{llseek:R.stream_ops.llseek}},file:{node:{getattr:R.node_ops.getattr,setattr:R.node_ops.
setattr},stream:{llseek:R.stream_ops.llseek,read:R.stream_ops.read,write:R.stream_ops.write,mmap:R.stream_ops.mmap,msync:R.
stream_ops.msync}},link:{node:{getattr:R.node_ops.getattr,setattr:R.node_ops.setattr,readlink:R.node_ops.readlink},stream:{}},
chrdev:{node:{getattr:R.node_ops.getattr,setattr:R.node_ops.setattr},stream:a.chrdev_stream_ops}});var i=a.createNode(e,
r,t,n);return a.isDir(i.mode)?(i.node_ops=R.ops_table.dir.node,i.stream_ops=R.ops_table.dir.stream,i.contents={}):a.isFile(
i.mode)?(i.node_ops=R.ops_table.file.node,i.stream_ops=R.ops_table.file.stream,i.usedBytes=0,i.contents=null):a.isLink(i.
mode)?(i.node_ops=R.ops_table.link.node,i.stream_ops=R.ops_table.link.stream):a.isChrdev(i.mode)&&(i.node_ops=R.ops_table.
chrdev.node,i.stream_ops=R.ops_table.chrdev.stream),i.atime=i.mtime=i.ctime=Date.now(),e&&(e.contents[r]=i,e.atime=e.mtime=
e.ctime=i.atime),i},getFileDataAsTypedArray(e){return e.contents?e.contents.subarray?e.contents.subarray(0,e.usedBytes):
new Uint8Array(e.contents):new Uint8Array(0)},expandFileStorage(e,r){var t=e.contents?e.contents.length:0;if(!(t>=r)){var n=1024*
1024;r=Math.max(r,t*(t<n?2:1.125)>>>0),t!=0&&(r=Math.max(r,256));var i=e.contents;e.contents=new Uint8Array(r),e.usedBytes>
0&&e.contents.set(i.subarray(0,e.usedBytes),0)}},resizeFileStorage(e,r){if(e.usedBytes!=r)if(r==0)e.contents=null,e.usedBytes=
0;else{var t=e.contents;e.contents=new Uint8Array(r),t&&e.contents.set(t.subarray(0,Math.min(r,e.usedBytes))),e.usedBytes=
r}},node_ops:{getattr(e){var r={};return r.dev=a.isChrdev(e.mode)?e.id:1,r.ino=e.id,r.mode=e.mode,r.nlink=1,r.uid=0,r.gid=
0,r.rdev=e.rdev,a.isDir(e.mode)?r.size=4096:a.isFile(e.mode)?r.size=e.usedBytes:a.isLink(e.mode)?r.size=e.link.length:r.
size=0,r.atime=new Date(e.atime),r.mtime=new Date(e.mtime),r.ctime=new Date(e.ctime),r.blksize=4096,r.blocks=Math.ceil(r.
size/r.blksize),r},setattr(e,r){for(const t of["mode","atime","mtime","ctime"])r[t]!=null&&(e[t]=r[t]);r.size!==void 0&&
R.resizeFileStorage(e,r.size)},lookup(e,r){throw R.doesNotExistError||(R.doesNotExistError=new a.ErrnoError(44),R.doesNotExistError.
stack="<generic error, no stack>"),R.doesNotExistError},mknod(e,r,t,n){return R.createNode(e,r,t,n)},rename(e,r,t){var n;
try{n=a.lookupNode(r,t)}catch{}if(n){if(a.isDir(e.mode))for(var i in n.contents)throw new a.ErrnoError(55);a.hashRemoveNode(
n)}delete e.parent.contents[e.name],r.contents[t]=e,e.name=t,r.ctime=r.mtime=e.parent.ctime=e.parent.mtime=Date.now()},unlink(e,r){
delete e.contents[r],e.ctime=e.mtime=Date.now()},rmdir(e,r){var t=a.lookupNode(e,r);for(var n in t.contents)throw new a.
ErrnoError(55);delete e.contents[r],e.ctime=e.mtime=Date.now()},readdir(e){return[".","..",...Object.keys(e.contents)]},
symlink(e,r,t){var n=R.createNode(e,r,41471,0);return n.link=t,n},readlink(e){if(!a.isLink(e.mode))throw new a.ErrnoError(
28);return e.link}},stream_ops:{read(e,r,t,n,i){var o=e.node.contents;if(i>=e.node.usedBytes)return 0;var s=Math.min(e.node.
usedBytes-i,n);if(s>8&&o.subarray)r.set(o.subarray(i,i+s),t);else for(var c=0;c<s;c++)r[t+c]=o[i+c];return s},write(e,r,t,n,i,o){
if(r.buffer===(u(),re).buffer&&(o=!1),!n)return 0;var s=e.node;if(s.mtime=s.ctime=Date.now(),r.subarray&&(!s.contents||s.
contents.subarray)){if(o)return s.contents=r.subarray(t,t+n),s.usedBytes=n,n;if(s.usedBytes===0&&i===0)return s.contents=
r.slice(t,t+n),s.usedBytes=n,n;if(i+n<=s.usedBytes)return s.contents.set(r.subarray(t,t+n),i),n}if(R.expandFileStorage(s,
i+n),s.contents.subarray&&r.subarray)s.contents.set(r.subarray(t,t+n),i);else for(var c=0;c<n;c++)s.contents[i+c]=r[t+c];
return s.usedBytes=Math.max(s.usedBytes,i+n),n},llseek(e,r,t){var n=r;if(t===1?n+=e.position:t===2&&a.isFile(e.node.mode)&&
(n+=e.node.usedBytes),n<0)throw new a.ErrnoError(28);return n},mmap(e,r,t,n,i){if(!a.isFile(e.node.mode))throw new a.ErrnoError(
43);var o,s,c=e.node.contents;if(!(i&2)&&c&&c.buffer===(u(),re).buffer)s=!1,o=c.byteOffset;else{if(s=!0,o=wr(r),!o)throw new a.
ErrnoError(48);c&&((t>0||t+r<c.length)&&(c.subarray?c=c.subarray(t,t+r):c=Array.prototype.slice.call(c,t,t+r)),(u(),re).
set(c,o))}return{ptr:o,allocated:s}},msync(e,r,t,n,i){return R.stream_ops.write(e,r,0,n,t,!1),0}}},$n=e=>{var r={r:0,"r+":2,
w:577,"w+":578,a:1089,"a+":1090},t=r[e];if(typeof t>"u")throw new Error(`Unknown file open mode: ${e}`);return t},yr=(e,r)=>{
var t=0;return e&&(t|=365),r&&(t|=146),t},Hn=async e=>{var r=await E(e);return new Uint8Array(r)},st=(...e)=>a.createDataFile(
...e),lt=[],Pn=async(e,r)=>{typeof Browser<"u"&&Browser.init();for(var t of lt)if(t.canHandle(r))return t.handle(e,r);return e},
Er=async(e,r,t,n,i,o,s,c)=>{var m=r?Me.resolve(J.join2(e,r)):e;tr();try{var _=t;typeof t=="string"&&(_=await Hn(t)),_=await Pn(
_,m),c==null||c(),o||st(e,r,_,n,i,s)}finally{rr()}},Yn=(e,r,t,n,i,o,s,c,m,_)=>{Er(e,r,t,n,i,c,m,_).then(o).catch(s)},a={
root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:!1,ignorePermissions:!0,
filesystems:null,syncFSRequests:0,readFiles:{},ErrnoError:class{constructor(e){ve(this,"name","ErrnoError");this.errno=e}},
FSStream:class{constructor(){ve(this,"shared",{})}get object(){return this.node}set object(e){this.node=e}get isRead(){return(this.
flags&2097155)!==1}get isWrite(){return(this.flags&2097155)!==0}get isAppend(){return this.flags&1024}get flags(){return this.
shared.flags}set flags(e){this.shared.flags=e}get position(){return this.shared.position}set position(e){this.shared.position=
e}},FSNode:class{constructor(e,r,t,n){ve(this,"node_ops",{});ve(this,"stream_ops",{});ve(this,"readMode",365);ve(this,"w\
riteMode",146);ve(this,"mounted",null);e||(e=this),this.parent=e,this.mount=e.mount,this.id=a.nextInode++,this.name=r,this.
mode=t,this.rdev=n,this.atime=this.mtime=this.ctime=Date.now()}get read(){return(this.mode&this.readMode)===this.readMode}set read(e){
e?this.mode|=this.readMode:this.mode&=~this.readMode}get write(){return(this.mode&this.writeMode)===this.writeMode}set write(e){
e?this.mode|=this.writeMode:this.mode&=~this.writeMode}get isFolder(){return a.isDir(this.mode)}get isDevice(){return a.
isChrdev(this.mode)}},lookupPath(e,r={}){if(!e)throw new a.ErrnoError(44);r.follow_mount??(r.follow_mount=!0),J.isAbs(e)||
(e=a.cwd()+"/"+e);e:for(var t=0;t<40;t++){for(var n=e.split("/").filter(_=>!!_),i=a.root,o="/",s=0;s<n.length;s++){var c=s===
n.length-1;if(c&&r.parent)break;if(n[s]!=="."){if(n[s]===".."){if(o=J.dirname(o),a.isRoot(i)){e=o+"/"+n.slice(s+1).join(
"/"),t--;continue e}else i=i.parent;continue}o=J.join2(o,n[s]);try{i=a.lookupNode(i,n[s])}catch(_){if((_==null?void 0:_.
errno)===44&&c&&r.noent_okay)return{path:o};throw _}if(a.isMountpoint(i)&&(!c||r.follow_mount)&&(i=i.mounted.root),a.isLink(
i.mode)&&(!c||r.follow)){if(!i.node_ops.readlink)throw new a.ErrnoError(52);var m=i.node_ops.readlink(i);J.isAbs(m)||(m=
J.dirname(o)+"/"+m),e=m+"/"+n.slice(s+1).join("/");continue e}}}return{path:o,node:i}}throw new a.ErrnoError(32)},getPath(e){
for(var r;;){if(a.isRoot(e)){var t=e.mount.mountpoint;return r?t[t.length-1]!=="/"?`${t}/${r}`:t+r:t}r=r?`${e.name}/${r}`:
e.name,e=e.parent}},hashName(e,r){for(var t=0,n=0;n<r.length;n++)t=(t<<5)-t+r.charCodeAt(n)|0;return(e+t>>>0)%a.nameTable.
length},hashAddNode(e){var r=a.hashName(e.parent.id,e.name);e.name_next=a.nameTable[r],a.nameTable[r]=e},hashRemoveNode(e){
var r=a.hashName(e.parent.id,e.name);if(a.nameTable[r]===e)a.nameTable[r]=e.name_next;else for(var t=a.nameTable[r];t;){
if(t.name_next===e){t.name_next=e.name_next;break}t=t.name_next}},lookupNode(e,r){var t=a.mayLookup(e);if(t)throw new a.
ErrnoError(t);for(var n=a.hashName(e.id,r),i=a.nameTable[n];i;i=i.name_next){var o=i.name;if(i.parent.id===e.id&&o===r)return i}
return a.lookup(e,r)},createNode(e,r,t,n){var i=new a.FSNode(e,r,t,n);return a.hashAddNode(i),i},destroyNode(e){a.hashRemoveNode(
e)},isRoot(e){return e===e.parent},isMountpoint(e){return!!e.mounted},isFile(e){return(e&61440)===32768},isDir(e){return(e&
61440)===16384},isLink(e){return(e&61440)===40960},isChrdev(e){return(e&61440)===8192},isBlkdev(e){return(e&61440)===24576},
isFIFO(e){return(e&61440)===4096},isSocket(e){return(e&49152)===49152},flagsToPermissionString(e){var r=["r","w","rw"][e&
3];return e&512&&(r+="w"),r},nodePermissions(e,r){return a.ignorePermissions?0:r.includes("r")&&!(e.mode&292)||r.includes(
"w")&&!(e.mode&146)||r.includes("x")&&!(e.mode&73)?2:0},mayLookup(e){if(!a.isDir(e.mode))return 54;var r=a.nodePermissions(
e,"x");return r||(e.node_ops.lookup?0:2)},mayCreate(e,r){if(!a.isDir(e.mode))return 54;try{var t=a.lookupNode(e,r);return 20}catch{}
return a.nodePermissions(e,"wx")},mayDelete(e,r,t){var n;try{n=a.lookupNode(e,r)}catch(o){return o.errno}var i=a.nodePermissions(
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
syncfs(e,r){typeof e=="function"&&(r=e,e=!1),a.syncFSRequests++,a.syncFSRequests>1&&P(`warning: ${a.syncFSRequests} FS.s\
yncfs operations in flight at once, probably just doing extra work`);var t=a.getMounts(a.root.mount),n=0;function i(c){return a.
syncFSRequests--,r(c)}function o(c){if(c)return o.errored?void 0:(o.errored=!0,i(c));++n>=t.length&&i(null)}for(var s of t)
s.type.syncfs?s.type.syncfs(s,e,o):o(null)},mount(e,r,t){var n=t==="/",i=!t,o;if(n&&a.root)throw new a.ErrnoError(10);if(!n&&
!i){var s=a.lookupPath(t,{follow_mount:!1});if(t=s.path,o=s.node,a.isMountpoint(o))throw new a.ErrnoError(10);if(!a.isDir(
o.mode))throw new a.ErrnoError(54)}var c={type:e,opts:r,mountpoint:t,mounts:[]},m=e.mount(c);return m.mount=c,c.root=m,n?
a.root=m:o&&(o.mounted=c,o.mount&&o.mount.mounts.push(c)),m},unmount(e){var r=a.lookupPath(e,{follow_mount:!1});if(!a.isMountpoint(
r.node))throw new a.ErrnoError(28);var t=r.node,n=t.mounted,i=a.getMounts(n);for(var[o,s]of Object.entries(a.nameTable))
for(;s;){var c=s.name_next;i.includes(s.mount)&&a.destroyNode(s),s=c}t.mounted=null;var m=t.mount.mounts.indexOf(n);t.mount.
mounts.splice(m,1)},lookup(e,r){return e.node_ops.lookup(e,r)},mknod(e,r,t){var n=a.lookupPath(e,{parent:!0}),i=n.node,o=J.
basename(e);if(!o)throw new a.ErrnoError(28);if(o==="."||o==="..")throw new a.ErrnoError(20);var s=a.mayCreate(i,o);if(s)
throw new a.ErrnoError(s);if(!i.node_ops.mknod)throw new a.ErrnoError(63);return i.node_ops.mknod(i,o,r,t)},statfs(e){return a.
statfsNode(a.lookupPath(e,{follow:!0}).node)},statfsStream(e){return a.statfsNode(e.node)},statfsNode(e){var r={bsize:4096,
frsize:4096,blocks:1e6,bfree:5e5,bavail:5e5,files:a.nextInode,ffree:a.nextInode-1,fsid:42,flags:2,namelen:255};return e.
node_ops.statfs&&Object.assign(r,e.node_ops.statfs(e.mount.opts.root)),r},create(e,r=438){return r&=4095,r|=32768,a.mknod(
e,r,0)},mkdir(e,r=511){return r&=1023,r|=16384,a.mknod(e,r,0)},mkdirTree(e,r){var t=e.split("/"),n="";for(var i of t)if(i){
(n||J.isAbs(e))&&(n+="/"),n+=i;try{a.mkdir(n,r)}catch(o){if(o.errno!=20)throw o}}},mkdev(e,r,t){return typeof t>"u"&&(t=
r,r=438),r|=8192,a.mknod(e,r,t)},symlink(e,r){if(!Me.resolve(e))throw new a.ErrnoError(44);var t=a.lookupPath(r,{parent:!0}),
n=t.node;if(!n)throw new a.ErrnoError(44);var i=J.basename(r),o=a.mayCreate(n,i);if(o)throw new a.ErrnoError(o);if(!n.node_ops.
symlink)throw new a.ErrnoError(63);return n.node_ops.symlink(n,i,e)},rename(e,r){var t=J.dirname(e),n=J.dirname(r),i=J.basename(
e),o=J.basename(r),s,c,m;if(s=a.lookupPath(e,{parent:!0}),c=s.node,s=a.lookupPath(r,{parent:!0}),m=s.node,!c||!m)throw new a.
ErrnoError(44);if(c.mount!==m.mount)throw new a.ErrnoError(75);var _=a.lookupNode(c,i),g=Me.relative(e,n);if(g.charAt(0)!==
".")throw new a.ErrnoError(28);if(g=Me.relative(r,t),g.charAt(0)!==".")throw new a.ErrnoError(55);var B;try{B=a.lookupNode(
m,o)}catch{}if(_!==B){var I=a.isDir(_.mode),N=a.mayDelete(c,i,I);if(N)throw new a.ErrnoError(N);if(N=B?a.mayDelete(m,o,I):
a.mayCreate(m,o),N)throw new a.ErrnoError(N);if(!c.node_ops.rename)throw new a.ErrnoError(63);if(a.isMountpoint(_)||B&&a.
isMountpoint(B))throw new a.ErrnoError(10);if(m!==c&&(N=a.nodePermissions(c,"w"),N))throw new a.ErrnoError(N);a.hashRemoveNode(
_);try{c.node_ops.rename(_,m,o),_.parent=m}catch(j){throw j}finally{a.hashAddNode(_)}}},rmdir(e){var r=a.lookupPath(e,{parent:!0}),
t=r.node,n=J.basename(e),i=a.lookupNode(t,n),o=a.mayDelete(t,n,!0);if(o)throw new a.ErrnoError(o);if(!t.node_ops.rmdir)throw new a.
ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);t.node_ops.rmdir(t,n),a.destroyNode(i)},readdir(e){var r=a.
lookupPath(e,{follow:!0}),t=r.node,n=a.checkOpExists(t.node_ops.readdir,54);return n(t)},unlink(e){var r=a.lookupPath(e,
{parent:!0}),t=r.node;if(!t)throw new a.ErrnoError(44);var n=J.basename(e),i=a.lookupNode(t,n),o=a.mayDelete(t,n,!1);if(o)
throw new a.ErrnoError(o);if(!t.node_ops.unlink)throw new a.ErrnoError(63);if(a.isMountpoint(i))throw new a.ErrnoError(10);
t.node_ops.unlink(t,n),a.destroyNode(i)},readlink(e){var r=a.lookupPath(e),t=r.node;if(!t)throw new a.ErrnoError(44);if(!t.
node_ops.readlink)throw new a.ErrnoError(28);return t.node_ops.readlink(t)},stat(e,r){var t=a.lookupPath(e,{follow:!r}),
n=t.node,i=a.checkOpExists(n.node_ops.getattr,63);return i(n)},fstat(e){var r=a.getStreamChecked(e),t=r.node,n=r.stream_ops.
getattr,i=n?r:t;return n??(n=t.node_ops.getattr),a.checkOpExists(n,63),n(i)},lstat(e){return a.stat(e,!0)},doChmod(e,r,t,n){
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
$n(r):r,r&64?t=t&4095|32768:t=0;var n,i;if(typeof e=="object")n=e;else{i=e.endsWith("/");var o=a.lookupPath(e,{follow:!(r&
131072),noent_okay:!0});n=o.node,e=o.path}var s=!1;if(r&64)if(n){if(r&128)throw new a.ErrnoError(20)}else{if(i)throw new a.
ErrnoError(31);n=a.mknod(e,t|511,0),s=!0}if(!n)throw new a.ErrnoError(44);if(a.isChrdev(n.mode)&&(r&=-513),r&65536&&!a.isDir(
n.mode))throw new a.ErrnoError(54);if(!s){var c=a.mayOpen(n,r);if(c)throw new a.ErrnoError(c)}r&512&&!s&&a.truncate(n,0),
r&=-131713;var m=a.createStream({node:n,path:a.getPath(n),flags:r,seekable:!0,position:0,stream_ops:n.stream_ops,ungotten:[],
error:!1});return m.stream_ops.open&&m.stream_ops.open(m),s&&a.chmod(n,t&511),l.logReadFiles&&!(r&1)&&(e in a.readFiles||
(a.readFiles[e]=1)),m},close(e){if(a.isClosed(e))throw new a.ErrnoError(8);e.getdents&&(e.getdents=null);try{e.stream_ops.
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
ary"&&ge(`Invalid encoding type "${r.encoding}"`);var t=a.open(e,r.flags),n=a.stat(e),i=n.size,o=new Uint8Array(i);return a.
read(t,o,0,i,0),r.encoding==="utf8"&&(o=qe(o)),a.close(t),o},writeFile(e,r,t={}){t.flags=t.flags||577;var n=a.open(e,t.flags,
t.mode);typeof r=="string"&&(r=new Uint8Array(vr(r))),ArrayBuffer.isView(r)?a.write(n,r,0,r.byteLength,void 0,t.canOwn):
ge("Unsupported data type"),a.close(n)},cwd:()=>a.currentPath,chdir(e){var r=a.lookupPath(e,{follow:!0});if(r.node===null)
throw new a.ErrnoError(44);if(!a.isDir(r.node.mode))throw new a.ErrnoError(54);var t=a.nodePermissions(r.node,"x");if(t)
throw new a.ErrnoError(t);a.currentPath=r.path},createDefaultDirectories(){a.mkdir("/tmp"),a.mkdir("/home"),a.mkdir("/ho\
me/web_user")},createDefaultDevices(){a.mkdir("/dev"),a.registerDevice(a.makedev(1,3),{read:()=>0,write:(n,i,o,s,c)=>s,llseek:()=>0}),
a.mkdev("/dev/null",a.makedev(1,3)),Re.register(a.makedev(5,0),Re.default_tty_ops),Re.register(a.makedev(6,0),Re.default_tty1_ops),
a.mkdev("/dev/tty",a.makedev(5,0)),a.mkdev("/dev/tty1",a.makedev(6,0));var e=new Uint8Array(1024),r=0,t=()=>(r===0&&(_r(
e),r=e.byteLength),e[--r]);a.createDevice("/dev","random",t),a.createDevice("/dev","urandom",t),a.mkdir("/dev/shm"),a.mkdir(
"/dev/shm/tmp")},createSpecialDirectories(){a.mkdir("/proc");var e=a.mkdir("/proc/self");a.mkdir("/proc/self/fd"),a.mount(
{mount(){var r=a.createNode(e,"fd",16895,73);return r.stream_ops={llseek:R.stream_ops.llseek},r.node_ops={lookup(t,n){var i=+n,
o=a.getStreamChecked(i),s={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:()=>o.path},id:i+1};return s.parent=
s,s},readdir(){return Array.from(a.streams.entries()).filter(([t,n])=>n).map(([t,n])=>t.toString())}},r}},{},"/proc/self\
/fd")},createStandardStreams(e,r,t){e?a.createDevice("/dev","stdin",e):a.symlink("/dev/tty","/dev/stdin"),r?a.createDevice(
"/dev","stdout",null,r):a.symlink("/dev/tty","/dev/stdout"),t?a.createDevice("/dev","stderr",null,t):a.symlink("/dev/tty\
1","/dev/stderr"),a.open("/dev/stdin",0),a.open("/dev/stdout",1),a.open("/dev/stderr",1)},staticInit(){a.nameTable=new Array(
4096),a.mount(R,{},"/"),a.createDefaultDirectories(),a.createDefaultDevices(),a.createSpecialDirectories(),a.filesystems=
{MEMFS:R}},init(e,r,t){a.initialized=!0,e??(e=l.stdin),r??(r=l.stdout),t??(t=l.stderr),a.createStandardStreams(e,r,t)},quit(){
a.initialized=!1;for(var e of a.streams)e&&a.close(e)},findObject(e,r){var t=a.analyzePath(e,r);return t.exists?t.object:
null},analyzePath(e,r){try{var t=a.lookupPath(e,{follow:!r});e=t.path}catch{}var n={isRoot:!1,exists:!1,error:0,name:null,
path:null,object:null,parentExists:!1,parentPath:null,parentObject:null};try{var t=a.lookupPath(e,{parent:!0});n.parentExists=
!0,n.parentPath=t.path,n.parentObject=t.node,n.name=J.basename(e),t=a.lookupPath(e,{follow:!r}),n.exists=!0,n.path=t.path,
n.object=t.node,n.name=t.node.name,n.isRoot=t.path==="/"}catch(i){n.error=i.errno}return n},createPath(e,r,t,n){e=typeof e==
"string"?e:a.getPath(e);for(var i=r.split("/").reverse();i.length;){var o=i.pop();if(o){var s=J.join2(e,o);try{a.mkdir(s)}catch(c){
if(c.errno!=20)throw c}e=s}}return s},createFile(e,r,t,n,i){var o=J.join2(typeof e=="string"?e:a.getPath(e),r),s=yr(n,i);
return a.create(o,s)},createDataFile(e,r,t,n,i,o){var s=r;e&&(e=typeof e=="string"?e:a.getPath(e),s=r?J.join2(e,r):e);var c=yr(
n,i),m=a.create(s,c);if(t){if(typeof t=="string"){for(var _=new Array(t.length),g=0,B=t.length;g<B;++g)_[g]=t.charCodeAt(
g);t=_}a.chmod(m,c|146);var I=a.open(m,577);a.write(I,t,0,t.length,0,o),a.close(I),a.chmod(m,c)}},createDevice(e,r,t,n){
var c;var i=J.join2(typeof e=="string"?e:a.getPath(e),r),o=yr(!!t,!!n);(c=a.createDevice).major??(c.major=64);var s=a.makedev(
a.createDevice.major++,0);return a.registerDevice(s,{open(m){m.seekable=!1},close(m){var _;(_=n==null?void 0:n.buffer)!=
null&&_.length&&n(10)},read(m,_,g,B,I){for(var N=0,j=0;j<B;j++){var U;try{U=t()}catch{throw new a.ErrnoError(29)}if(U===
void 0&&N===0)throw new a.ErrnoError(6);if(U==null)break;N++,_[g+j]=U}return N&&(m.node.atime=Date.now()),N},write(m,_,g,B,I){
for(var N=0;N<B;N++)try{n(_[g+N])}catch{throw new a.ErrnoError(29)}return B&&(m.node.mtime=m.node.ctime=Date.now()),N}}),
a.mkdev(i,o,s)},forceLoadFile(e){if(e.isDevice||e.isFolder||e.link||e.contents)return!0;if(globalThis.XMLHttpRequest)ge(
"Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in we\
b workers. Use --embed-file or --preload-file in emcc on the main thread.");else try{e.contents=G(e.url)}catch{throw new a.
ErrnoError(29)}},createLazyFile(e,r,t,n,i){class o{constructor(){ve(this,"lengthKnown",!1);ve(this,"chunks",[])}get(I){if(!(I>
this.length-1||I<0)){var N=I%this.chunkSize,j=I/this.chunkSize|0;return this.getter(j)[N]}}setDataGetter(I){this.getter=
I}cacheLength(){var I=new XMLHttpRequest;I.open("HEAD",t,!1),I.send(null),I.status>=200&&I.status<300||I.status===304||ge(
"Couldn't load "+t+". Status: "+I.status);var N=Number(I.getResponseHeader("Content-length")),j,U=(j=I.getResponseHeader(
"Accept-Ranges"))&&j==="bytes",d=(j=I.getResponseHeader("Content-Encoding"))&&j==="gzip",L=1024*1024;U||(L=N);var M=(ae,le)=>{
ae>le&&ge("invalid range ("+ae+", "+le+") or no bytes requested!"),le>N-1&&ge("only "+N+" bytes available! programmer er\
ror!");var Z=new XMLHttpRequest;return Z.open("GET",t,!1),N!==L&&Z.setRequestHeader("Range","bytes="+ae+"-"+le),Z.responseType=
"arraybuffer",Z.overrideMimeType&&Z.overrideMimeType("text/plain; charset=x-user-defined"),Z.send(null),Z.status>=200&&Z.
status<300||Z.status===304||ge("Couldn't load "+t+". Status: "+Z.status),Z.response!==void 0?new Uint8Array(Z.response||
[]):vr(Z.responseText||"")},H=this;H.setDataGetter(ae=>{var le=ae*L,Z=(ae+1)*L-1;return Z=Math.min(Z,N-1),typeof H.chunks[ae]>
"u"&&(H.chunks[ae]=M(le,Z)),typeof H.chunks[ae]>"u"&&ge("doXHR failed!"),H.chunks[ae]}),(d||!N)&&(L=N=1,N=this.getter(0).
length,L=N,ee("LazyFiles on gzip forces download of the whole file when length is accessed")),this._length=N,this._chunkSize=
L,this.lengthKnown=!0}get length(){return this.lengthKnown||this.cacheLength(),this._length}get chunkSize(){return this.
lengthKnown||this.cacheLength(),this._chunkSize}}if(globalThis.XMLHttpRequest){T||ge("Cannot do synchronous binary XHRs \
outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc");var s=new o,c={isDevice:!1,contents:s}}else
var c={isDevice:!1,url:t};var m=a.createFile(e,r,c,n,i);c.contents?m.contents=c.contents:c.url&&(m.contents=null,m.url=c.
url),Object.defineProperties(m,{usedBytes:{get:function(){return this.contents.length}}});var _={};for(const[B,I]of Object.
entries(m.stream_ops))_[B]=(...N)=>(a.forceLoadFile(m),I(...N));function g(B,I,N,j,U){var d=B.node.contents;if(U>=d.length)
return 0;var L=Math.min(d.length-U,j);if(d.slice)for(var M=0;M<L;M++)I[N+M]=d[U+M];else for(var M=0;M<L;M++)I[N+M]=d.get(
U+M);return L}return _.read=(B,I,N,j,U)=>(a.forceLoadFile(m),g(B,I,N,j,U)),_.mmap=(B,I,N,j,U)=>{a.forceLoadFile(m);var d=wr(
I);if(!d)throw new a.ErrnoError(48);return g(B,(u(),re),d,I,N),{ptr:d,allocated:!0}},m.stream_ops=_,m}},Je=(e,r,t)=>e?qe(
(u(),se),e,r):"",$={DEFAULT_POLLMASK:5,calculateAt(e,r,t){if(J.isAbs(r))return r;var n;if(e===-100)n=a.cwd();else{var i=$.
getStreamFromFD(e);n=i.path}if(r.length==0){if(!t)throw new a.ErrnoError(44);return n}return n+"/"+r},writeStat(e,r){(u(),
C)[e/4]=r.dev,(u(),C)[(e+4)/4]=r.mode,(u(),k)[(e+8)/8]=BigInt(r.nlink),(u(),C)[(e+16)/4]=r.uid,(u(),C)[(e+20)/4]=r.gid,(u(),
C)[(e+24)/4]=r.rdev,(u(),O)[(e+32)/8]=BigInt(r.size),(u(),A)[(e+40)/4]=4096,(u(),A)[(e+44)/4]=r.blocks;var t=r.atime.getTime(),
n=r.mtime.getTime(),i=r.ctime.getTime();return(u(),O)[(e+48)/8]=BigInt(Math.floor(t/1e3)),(u(),k)[(e+56)/8]=BigInt(t%1e3*
1e3*1e3),(u(),O)[(e+64)/8]=BigInt(Math.floor(n/1e3)),(u(),k)[(e+72)/8]=BigInt(n%1e3*1e3*1e3),(u(),O)[(e+80)/8]=BigInt(Math.
floor(i/1e3)),(u(),k)[(e+88)/8]=BigInt(i%1e3*1e3*1e3),(u(),O)[(e+96)/8]=BigInt(r.ino),0},writeStatFs(e,r){(u(),C)[(e+8)/
4]=r.bsize,(u(),C)[(e+72)/4]=r.bsize,(u(),O)[(e+16)/8]=BigInt(r.blocks),(u(),O)[(e+24)/8]=BigInt(r.bfree),(u(),O)[(e+32)/
8]=BigInt(r.bavail),(u(),O)[(e+40)/8]=BigInt(r.files),(u(),O)[(e+48)/8]=BigInt(r.ffree),(u(),C)[(e+56)/4]=r.fsid,(u(),C)[(e+
80)/4]=r.flags,(u(),C)[(e+64)/4]=r.namelen},doMsync(e,r,t,n,i){if(!a.isFile(r.node.mode))throw new a.ErrnoError(43);if(n&
2)return 0;var o=(u(),se).slice(e,e+t);a.msync(r,o,i,t,n)},getStreamFromFD(e){var r=a.getStreamChecked(e);return r},varargs:void 0,
getStr(e){var r=Je(e);return r}};function ut(e,r,t){if(v)return te(3,0,1,e,r,t);t=p(t),$.varargs=t;try{var n=$.getStreamFromFD(
e);switch(r){case 0:{var i=br();if(i<0)return-28;for(;a.streams[i];)i++;var o;return o=a.dupStream(n,i),o.fd}case 1:case 2:
return 0;case 3:return n.flags;case 4:{var i=br();return n.flags|=i,0}case 5:{var i=Le(),s=0;return(u(),pe)[(i+s)/2]=2,0}case 6:case 7:
return 0}return-28}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}function Kn(e,r){if(v)return te(
4,0,1,e,r);r=p(r);try{return $.writeStat(r,a.fstat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.
errno}}var Ie=(e,r,t)=>it(e,(u(),se),r,t);function ct(e,r){if(v)return te(5,0,1,e,r);e=p(e),r=p(r);try{if(r===0)return-28;
var t=a.cwd(),n=Ne(t)+1;return r<n?-68:(Ie(t,e,r),n)}catch(i){if(typeof a>"u"||i.name!=="ErrnoError")throw i;return-i.errno}}
function ft(e,r,t){if(v)return te(6,0,1,e,r,t);r=p(r),t=p(t);try{var n=$.getStreamFromFD(e);n.getdents||(n.getdents=a.readdir(
n.path));for(var i=280,o=0,s=a.llseek(n,0,1),c=Math.floor(s/i),m=Math.min(n.getdents.length,c+Math.floor(t/i)),_=c;_<m;_++){
var g,B,I=n.getdents[_];if(I===".")g=n.node.id,B=4;else if(I===".."){var N=a.lookupPath(n.path,{parent:!0});g=N.node.id,
B=4}else{var j;try{j=a.lookupNode(n.node,I)}catch(U){if((U==null?void 0:U.errno)===28)continue;throw U}g=j.id,B=a.isChrdev(
j.mode)?2:a.isDir(j.mode)?4:a.isLink(j.mode)?10:8}(u(),O)[(r+o)/8]=BigInt(g),(u(),O)[(r+o+8)/8]=BigInt((_+1)*i),(u(),pe)[(r+
o+16)/2]=280,(u(),re)[r+o+18]=B,Ie(I,r+o+19,256),o+=i}return a.llseek(n,_*i,0),o}catch(U){if(typeof a>"u"||U.name!=="Err\
noError")throw U;return-U.errno}}function mt(e,r,t){if(v)return te(7,0,1,e,r,t);t=p(t),$.varargs=t;try{var n=$.getStreamFromFD(
e);switch(r){case 21509:return n.tty?0:-59;case 21505:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tcgets){var i=n.tty.ops.ioctl_tcgets(
n),o=Le();(u(),A)[o/4]=i.c_iflag||0,(u(),A)[(o+4)/4]=i.c_oflag||0,(u(),A)[(o+8)/4]=i.c_cflag||0,(u(),A)[(o+12)/4]=i.c_lflag||
0;for(var s=0;s<32;s++)(u(),re)[o+s+17]=i.c_cc[s]||0;return 0}return 0}case 21510:case 21511:case 21512:return n.tty?0:-59;case 21506:case 21507:case 21508:{
if(!n.tty)return-59;if(n.tty.ops.ioctl_tcsets){for(var o=Le(),c=(u(),A)[o/4],m=(u(),A)[(o+4)/4],_=(u(),A)[(o+8)/4],g=(u(),
A)[(o+12)/4],B=[],s=0;s<32;s++)B.push((u(),re)[o+s+17]);return n.tty.ops.ioctl_tcsets(n.tty,r,{c_iflag:c,c_oflag:m,c_cflag:_,
c_lflag:g,c_cc:B})}return 0}case 21519:{if(!n.tty)return-59;var o=Le();return(u(),A)[o/4]=0,0}case 21520:return n.tty?-28:
-59;case 21537:case 21531:{var o=Le();return a.ioctl(n,r,o)}case 21523:{if(!n.tty)return-59;if(n.tty.ops.ioctl_tiocgwinsz){
var I=n.tty.ops.ioctl_tiocgwinsz(n.tty),o=Le();(u(),pe)[o/2]=I[0],(u(),pe)[(o+2)/2]=I[1]}return 0}case 21524:return n.tty?
0:-59;case 21515:return n.tty?0:-59;default:return-28}}catch(N){if(typeof a>"u"||N.name!=="ErrnoError")throw N;return-N.
errno}}function Xn(e,r){if(v)return te(8,0,1,e,r);e=p(e),r=p(r);try{return e=$.getStr(e),$.writeStat(r,a.lstat(e))}catch(t){
if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}function Zn(e,r,t,n){if(v)return te(9,0,1,e,r,t,n);r=p(r),
t=p(t);try{r=$.getStr(r);var i=n&256,o=n&4096;return n=n&-6401,r=$.calculateAt(e,r,o),$.writeStat(t,i?a.lstat(r):a.stat(
r))}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return-s.errno}}function dt(e,r,t,n){if(v)return te(10,0,1,e,
r,t,n);r=p(r),n=p(n),$.varargs=n;try{r=$.getStr(r),r=$.calculateAt(e,r);var i=n?br():0;return a.open(r,t,i).fd}catch(o){
if(typeof a>"u"||o.name!=="ErrnoError")throw o;return-o.errno}}function pt(e,r){if(v)return te(11,0,1,e,r);e=p(e),r=p(r);
try{return e=$.getStr(e),$.writeStat(r,a.stat(e))}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return-t.errno}}
var ea=()=>ge("");function ra(e){e=p(e),Dr(e,!T,1,!F,5242880,!1),W.threadInitTLS()}var kr=e=>{if(e instanceof Wr||e=="un\
wind")return _e;h(1,e)},ta=()=>{if(!fr())try{if(v){sr()&&Rr(_e);return}dr(_e)}catch(e){kr(e)}},Fe=e=>{if(!ce)try{e(),ta()}catch(r){
kr(r)}};function Sr(e){if(e=p(e),Atomics.waitAsync){var r=Atomics.waitAsync((u(),A),e/4,e);r.value.then(ar);var t=e+228;
Atomics.store((u(),A),t/4,1)}}var ar=()=>Fe(()=>{var e=sr();e&&(Sr(e),en())});function na(e,r){if(e=p(e),r=p(r),e==r)setTimeout(
ar);else if(v)postMessage({targetThread:e,cmd:"checkMailbox"});else{var t=W.pthreads[e];if(!t)return;t.postMessage({cmd:"\
checkMailbox"})}}var ir=[];function aa(e,r,t,n,i){t=p(t),i=p(i),n/=2,ir.length=n;for(var o=i/8,s=0;s<n;s++)(u(),O)[o+2*s]?
ir[s]=(u(),O)[o+2*s+1]:ir[s]=(u(),he)[o+2*s+1];var c=di[e];W.currentProxiedOperationCallerThread=t;var m=c(...ir);return W.
currentProxiedOperationCallerThread=0,typeof m=="bigint"&&(m=p(m)),m}function ia(e){e=p(e),v?postMessage({cmd:"cleanupTh\
read",thread:e}):Vr(e)}function oa(e){e=p(e),w&&W.pthreads[e].ref()}var sa=e=>e%4===0&&(e%100!==0||e%400===0),la=[0,31,60,
91,121,152,182,213,244,274,305,335],ua=[0,31,59,90,120,151,181,212,243,273,304,334],ca=e=>{var r=sa(e.getFullYear()),t=r?
la:ua,n=t[e.getMonth()]+e.getDate()-1;return n};function fa(e,r){e=p(e),r=p(r);var t=new Date(e*1e3);(u(),A)[r/4]=t.getSeconds(),
(u(),A)[(r+4)/4]=t.getMinutes(),(u(),A)[(r+8)/4]=t.getHours(),(u(),A)[(r+12)/4]=t.getDate(),(u(),A)[(r+16)/4]=t.getMonth(),
(u(),A)[(r+20)/4]=t.getFullYear()-1900,(u(),A)[(r+24)/4]=t.getDay();var n=ca(t)|0;(u(),A)[(r+28)/4]=n,(u(),O)[(r+40)/8]=
BigInt(-(t.getTimezoneOffset()*60));var i=new Date(t.getFullYear(),0,1),o=new Date(t.getFullYear(),6,1).getTimezoneOffset(),
s=i.getTimezoneOffset(),c=(o!=s&&t.getTimezoneOffset()==Math.min(s,o))|0;(u(),A)[(r+32)/4]=c}function gt(e,r,t,n,i,o,s){
if(v)return te(12,0,1,e,r,t,n,i,o,s);e=p(e),i=p(i),o=p(o),s=p(s);try{var c=$.getStreamFromFD(n),m=a.mmap(c,e,i,r,t),_=m.
ptr;return(u(),A)[o/4]=m.allocated,(u(),k)[s/8]=BigInt(_),0}catch(g){if(typeof a>"u"||g.name!=="ErrnoError")throw g;return-g.
errno}}function bt(e,r,t,n,i,o){if(v)return te(13,0,1,e,r,t,n,i,o);e=p(e),r=p(r),o=p(o);try{var s=$.getStreamFromFD(i);t&
2&&$.doMsync(e,s,r,n,o)}catch(c){if(typeof a>"u"||c.name!=="ErrnoError")throw c;return-c.errno}}var ma=function(e,r,t,n){
e=p(e),r=p(r),t=p(t),n=p(n);var i=new Date().getFullYear(),o=new Date(i,0,1),s=new Date(i,6,1),c=o.getTimezoneOffset(),m=s.
getTimezoneOffset(),_=Math.max(c,m);(u(),k)[e/8]=BigInt(_*60),(u(),A)[r/4]=+(c!=m);var g=N=>{var j=N>=0?"-":"+",U=Math.abs(
N),d=String(Math.floor(U/60)).padStart(2,"0"),L=String(U%60).padStart(2,"0");return`UTC${j}${d}${L}`},B=g(c),I=g(m);m<c?
(Ie(B,t,17),Ie(I,n,17)):(Ie(B,n,17),Ie(I,t,17))},_t=()=>performance.timeOrigin+performance.now(),ht=()=>Date.now(),da=e=>e>=
0&&e<=3;function pa(e,r,t){if(t=p(t),!da(e))return 28;var n;e===0?n=ht():n=_t();var i=Math.round(n*1e3*1e3);return(u(),O)[t/
8]=BigInt(i),0}var ga=()=>{},ze=()=>{nr+=1},ba=()=>{throw ze(),"unwind"},_a=()=>new Error().stack.toString(),ha=e=>{var r=_a(),
t=r.split(`
`);r="";var n=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)"),i=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var o of t){
var s="",c="",m=0,_=0,g=i.exec(o);if((g==null?void 0:g.length)==5)s=g[1],c=g[2],m=g[3],_=g[4];else if(g=n.exec(o),(g==null?
void 0:g.length)>=4)s=g[1],c=g[2],m=g[3],_=g[4]|0;else{r+=o+`
`;continue}if(s=="_emscripten_log"||s=="_emscripten_get_callstack"){r="";continue}e&24&&(e&64&&(c=c.substring(c.replace(
/\\/g,"/").lastIndexOf("/")+1)),r+=`    at ${s} (${c}:${m}:${_})
`)}return r=r.replace(/\s+$/,""),r};function va(e,r,t){r=p(r);var n=ha(e);if(!r||t<=0)return Ne(n)+1;var i=Ie(n,r,t);return i+
1}var vt=()=>4294967296,wa=()=>BigInt(vt()),ya=()=>2,Ea=()=>w?require("os").cpus().length:navigator.hardwareConcurrency,
ka=e=>{var r=Be.buffer.byteLength,t=(e-r+65535)/65536|0;try{return Be.grow(BigInt(t)),ye(),1}catch{}};function Sa(e){e=p(
e);var r=(u(),se).length;if(e<=r)return!1;var t=vt();if(e>t)return!1;for(var n=1;n<=4;n*=2){var i=r*(1+.2/n);i=Math.min(
i,e+100663296);var o=Math.min(t,ot(Math.max(e,i),65536)),s=ka(o);if(s)return!0}return!1}var Ae=e=>{var r=Ne(e)+1,t=mr(r);
return Ie(e,t,r),t},Ba=(e,r)=>{(u(),C)[e/4]=r;var t=(u(),C)[e/4];(u(),C)[(e+4)/4]=(r-t)/4294967296},Na=e=>{var r=Ne(e)+1,
t=Gt(r);return t&&Ie(e,t,r),t},Ce=e=>(u(),C)[e/4]+(u(),A)[(e+4)/4]*4294967296,f={Internals:{jsObjects:[],jsObjectInsert:(e,r)=>{
f.Internals.jsObjects[e]=r},bufferOnUnmaps:[],futures:[],futureInsert:(e,r)=>{f.Internals.futures[e]=new Promise(t=>r.finally(
()=>t(e)))}},getJsObject:e=>{if(e)return f.Internals.jsObjects[e]},importJsAdapter:(e,r=0)=>{var t=Qt(r);return f.Internals.
jsObjects[t]=e,t},importJsBindGroup:(e,r=0)=>{var t=Br(r);return f.Internals.jsObjects[t]=e,t},importJsBindGroupLayout:(e,r=0)=>{
var t=Nr(r);return f.Internals.jsObjects[t]=e,t},importJsBuffer:(e,r=0)=>{Y(e.mapState==="unmapped");var t=Vt(r);return f.
Internals.jsObjectInsert(t,e),t},importJsCommandBuffer:(e,r=0)=>{var t=Ir(r);return f.Internals.jsObjects[t]=e,t},importJsCommandEncoder:(e,r=0)=>{
var t=Fr(r);return f.Internals.jsObjects[t]=e,t},importJsComputePassEncoder:(e,r=0)=>{var t=xr(r);return f.Internals.jsObjects[t]=
e,t},importJsComputePipeline:(e,r=0)=>{var t=Ar(r);return f.Internals.jsObjects[t]=e,t},importJsDevice:(e,r=0)=>{var i;var t=Gr(
r),n=Jt(r,t);return f.Internals.jsObjectInsert(t,e.queue),f.Internals.jsObjectInsert(n,e),(i=l.peercomputeOnDevice)==null||
i.call(l,e),n},importJsExternalTexture:(e,r=0)=>{var t=Tt(r);return f.Internals.jsObjects[t]=e,t},importJsPipelineLayout:(e,r=0)=>{
var t=Ut(r);return f.Internals.jsObjects[t]=e,t},importJsQuerySet:(e,r=0)=>{var t=Dt(r);return f.Internals.jsObjects[t]=
e,t},importJsQueue:(e,r=0)=>{var t=Gr(r);return f.Internals.jsObjects[t]=e,t},importJsRenderBundle:(e,r=0)=>{var t=Rt(r);
return f.Internals.jsObjects[t]=e,t},importJsRenderBundleEncoder:(e,r=0)=>{var t=jt(r);return f.Internals.jsObjects[t]=e,
t},importJsRenderPassEncoder:(e,r=0)=>{var t=Ot(r);return f.Internals.jsObjects[t]=e,t},importJsRenderPipeline:(e,r=0)=>{
var t=Lt(r);return f.Internals.jsObjects[t]=e,t},importJsSampler:(e,r=0)=>{var t=Mt(r);return f.Internals.jsObjects[t]=e,
t},importJsShaderModule:(e,r=0)=>{var t=$t(r);return f.Internals.jsObjects[t]=e,t},importJsSurface:(e,r=0)=>{var t=qt(r);
return f.Internals.jsObjects[t]=e,t},importJsTexture:(e,r=0)=>{var t=zt(r);return f.Internals.jsObjects[t]=e,t},importJsTextureView:(e,r=0)=>{
var t=Wt(r);return f.Internals.jsObjects[t]=e,t},errorCallback:(e,r,t,n)=>{var i=ke(),o=Ae(t);((s,c,m)=>et(e).call(null,
s,BigInt(c),BigInt(m)))(r,BigInt(o),n),Se(i)},iterateExtensions:(e,r)=>{for(var t=Number((u(),k)[e/8]);t;t=Number((u(),k)[t/
8])){var n=(u(),A)[(t+8)/4];r[n](t)}},setStringView:(e,r,t)=>{(u(),k)[e/8]=BigInt(r),(u(),k)[(e+8)/8]=BigInt(t)},makeStringFromStringView:e=>{
var r=Number((u(),k)[e/8]),t=Number((u(),k)[(e+8)/8]);return Je(r,t)},makeStringFromOptionalStringView:e=>{var r=Number(
(u(),k)[e/8]),t=Number((u(),k)[(e+8)/8]);return r?Je(r,t):t===0?"":void 0},makeColor:e=>({r:(u(),he)[e/8],g:(u(),he)[(e+
8)/8],b:(u(),he)[(e+16)/8],a:(u(),he)[(e+24)/8]}),makeExtent3D:e=>({width:(u(),C)[e/4],height:(u(),C)[(e+4)/4],depthOrArrayLayers:(u(),
C)[(e+8)/4]}),makeOrigin3D:e=>({x:(u(),C)[e/4],y:(u(),C)[(e+4)/4],z:(u(),C)[(e+8)/4]}),makeTexelCopyTextureInfo:e=>({texture:f.
getJsObject(Number((u(),k)[e/8])),mipLevel:(u(),C)[(e+8)/4],origin:f.makeOrigin3D(e+12),aspect:f.TextureAspect[(u(),A)[(e+
24)/4]]}),makeTexelCopyBufferLayout:e=>{var r=(u(),C)[(e+8)/4],t=(u(),C)[(e+12)/4];return{offset:Ce(e),bytesPerRow:r===4294967295?
void 0:r,rowsPerImage:t===4294967295?void 0:t}},makeTexelCopyBufferInfo:e=>{var r=e+0,t=f.makeTexelCopyBufferLayout(r);return t.
buffer=f.getJsObject(Number((u(),k)[(e+16)/8])),t},makePassTimestampWrites:e=>{if(e!==0)return{querySet:f.getJsObject(Number(
(u(),k)[(e+8)/8])),beginningOfPassWriteIndex:(u(),C)[(e+16)/4],endOfPassWriteIndex:(u(),C)[(e+20)/4]}},makePipelineConstants:(e,r)=>{
if(e){for(var t={},n=0;n<e;++n){var i=r+32*n,o=f.makeStringFromStringView(i+8);t[o]=(u(),he)[(i+24)/8]}return t}},makePipelineLayout:e=>e?
f.getJsObject(e):"auto",makeComputeState:e=>{if(e){var r={module:f.getJsObject(Number((u(),k)[(e+8)/8])),constants:f.makePipelineConstants(
Number((u(),k)[(e+32)/8]),Number((u(),k)[(e+40)/8])),entryPoint:f.makeStringFromOptionalStringView(e+16)};return r}},makeComputePipelineDesc:e=>{
var r={label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((u(),k)[(e+24)/8])),compute:f.makeComputeState(
e+32)};return r},makeRenderPipelineDesc:e=>{function r(d){if(d)return{topology:f.PrimitiveTopology[(u(),A)[(d+8)/4]],stripIndexFormat:f.
IndexFormat[(u(),A)[(d+12)/4]],frontFace:f.FrontFace[(u(),A)[(d+16)/4]],cullMode:f.CullMode[(u(),A)[(d+20)/4]],unclippedDepth:!!(u(),
C)[(d+24)/4]}}function t(d){if(d)return{operation:f.BlendOperation[(u(),A)[d/4]],srcFactor:f.BlendFactor[(u(),A)[(d+4)/4]],
dstFactor:f.BlendFactor[(u(),A)[(d+8)/4]]}}function n(d){if(d)return{alpha:t(d+12),color:t(d+0)}}function i(d){var L=f.TextureFormat[(u(),
A)[(d+8)/4]];return L?{format:L,blend:n(Number((u(),k)[(d+16)/8])),writeMask:(u(),C)[(d+24)/4]}:void 0}function o(d,L){for(var M=[],
H=0;H<d;++H)M.push(i(L+32*H));return M}function s(d){return{compare:f.CompareFunction[(u(),A)[d/4]],failOp:f.StencilOperation[(u(),
A)[(d+4)/4]],depthFailOp:f.StencilOperation[(u(),A)[(d+8)/4]],passOp:f.StencilOperation[(u(),A)[(d+12)/4]]}}function c(d){
if(d)return{format:f.TextureFormat[(u(),A)[(d+8)/4]],depthWriteEnabled:!!(u(),C)[(d+12)/4],depthCompare:f.CompareFunction[(u(),
A)[(d+16)/4]],stencilFront:s(d+20),stencilBack:s(d+36),stencilReadMask:(u(),C)[(d+52)/4],stencilWriteMask:(u(),C)[(d+56)/
4],depthBias:(u(),A)[(d+60)/4],depthBiasSlopeScale:(u(),Oe)[(d+64)/4],depthBiasClamp:(u(),Oe)[(d+68)/4]}}function m(d){return{
format:f.VertexFormat[(u(),A)[(d+8)/4]],offset:Ce(d+16),shaderLocation:(u(),C)[(d+24)/4]}}function _(d,L){for(var M=[],H=0;H<
d;++H)M.push(m(L+H*32));return M}function g(d){if(d){var L=f.VertexStepMode[(u(),A)[(d+8)/4]],M=Number((u(),k)[(d+24)/8]);
return!L&&!M?null:{arrayStride:Ce(d+16),stepMode:L,attributes:_(M,Number((u(),k)[(d+32)/8]))}}}function B(d,L){if(d){for(var M=[],
H=0;H<d;++H)M.push(g(L+H*40));return M}}function I(d){if(d){var L={module:f.getJsObject(Number((u(),k)[(d+8)/8])),constants:f.
makePipelineConstants(Number((u(),k)[(d+32)/8]),Number((u(),k)[(d+40)/8])),buffers:B(Number((u(),k)[(d+48)/8]),Number((u(),
k)[(d+56)/8])),entryPoint:f.makeStringFromOptionalStringView(d+16)};return L}}function N(d){if(d)return{count:(u(),C)[(d+
8)/4],mask:(u(),C)[(d+12)/4],alphaToCoverageEnabled:!!(u(),C)[(d+16)/4]}}function j(d){if(d){var L={module:f.getJsObject(
Number((u(),k)[(d+8)/8])),constants:f.makePipelineConstants(Number((u(),k)[(d+32)/8]),Number((u(),k)[(d+40)/8])),targets:o(
Number((u(),k)[(d+48)/8]),Number((u(),k)[(d+56)/8])),entryPoint:f.makeStringFromOptionalStringView(d+16)};return L}}var U={
label:f.makeStringFromOptionalStringView(e+8),layout:f.makePipelineLayout(Number((u(),k)[(e+24)/8])),vertex:I(e+32),primitive:r(
e+96),depthStencil:c(Number((u(),k)[(e+128)/8])),multisample:N(e+136),fragment:j(Number((u(),k)[(e+160)/8]))};return U},
fillLimitStruct:(e,r)=>{var t=Number((u(),k)[r/8]);function n(s,c,m,_=0){var g=e[s]??_;(u(),C)[(c+m)/4]=g}function i(s,c,m,_=0){
var g=e[s]??_;Ba(c+m,g)}if(n("maxTextureDimension1D",r,8),n("maxTextureDimension2D",r,12),n("maxTextureDimension3D",r,16),
n("maxTextureArrayLayers",r,20),n("maxBindGroups",r,24),n("maxBindGroupsPlusVertexBuffers",r,28),n("maxBindingsPerBindGr\
oup",r,32),n("maxDynamicUniformBuffersPerPipelineLayout",r,36),n("maxDynamicStorageBuffersPerPipelineLayout",r,40),n("ma\
xSampledTexturesPerShaderStage",r,44),n("maxSamplersPerShaderStage",r,48),n("maxStorageBuffersPerShaderStage",r,52),n("m\
axStorageTexturesPerShaderStage",r,56),n("maxUniformBuffersPerShaderStage",r,60),n("minUniformBufferOffsetAlignment",r,80),
n("minStorageBufferOffsetAlignment",r,84),i("maxUniformBufferBindingSize",r,64),i("maxStorageBufferBindingSize",r,72),n(
"maxVertexBuffers",r,88),i("maxBufferSize",r,96),n("maxVertexAttributes",r,104),n("maxVertexBufferArrayStride",r,108),n(
"maxInterStageShaderVariables",r,112),n("maxColorAttachments",r,116),n("maxColorAttachmentBytesPerSample",r,120),n("maxC\
omputeWorkgroupStorageSize",r,124),n("maxComputeInvocationsPerWorkgroup",r,128),n("maxComputeWorkgroupSizeX",r,132),n("m\
axComputeWorkgroupSizeY",r,136),n("maxComputeWorkgroupSizeZ",r,140),n("maxComputeWorkgroupsPerDimension",r,144),n("maxIm\
mediateSize",r,148),t!==0){(u(),A)[(t+8)/4];var o=t;n("maxStorageBuffersInVertexStage",o,16,e.maxStorageBuffersPerShaderStage),
n("maxStorageBuffersInFragmentStage",o,24,e.maxStorageBuffersPerShaderStage),n("maxStorageTexturesInVertexStage",o,20,e.
maxStorageTexturesPerShaderStage),n("maxStorageTexturesInFragmentStage",o,28,e.maxStorageTexturesPerShaderStage)}},fillAdapterInfoStruct:(e,r)=>{
(u(),C)[(r+88)/4]=e.subgroupMinSize,(u(),C)[(r+92)/4]=e.subgroupMaxSize;var t=e.vendor+e.architecture+e.device+e.description,
n=Na(t),i=Ne(e.vendor);f.setStringView(r+8,n,i),n+=i;var o=Ne(e.architecture);f.setStringView(r+24,n,o),n+=o;var s=Ne(e.
device);f.setStringView(r+40,n,s),n+=s;var c=Ne(e.description);f.setStringView(r+56,n,c),n+=c,(u(),A)[(r+72)/4]=2;var m=e.
isFallbackAdapter?3:4;(u(),A)[(r+76)/4]=m,(u(),C)[(r+80)/4]=0,(u(),C)[(r+84)/4]=0},AddressMode:[,"clamp-to-edge","repeat",
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
bgroup_id","texture_and_sampler_let","subgroup_uniformity","texture_formats_tier1"]},Ia={undefined:1,unknown:1,destroyed:2},
Te=()=>{nr-=1};function Fa(e,r,t,n,i,o){e=p(e),r=p(r),t=p(t),n=p(n),i=p(i),o=p(o);var s=f.getJsObject(e),c={};if(o){var m=Number(
(u(),k)[(o+24)/8]);if(m){var _=Number((u(),k)[(o+32)/8]);c.requiredFeatures=Array.from((u(),C).subarray(_/4,(_+m*4)/4),d=>f.
FeatureName[d])}var g=Number((u(),k)[(o+40)/8]);if(g){let d=function(M,H,ae,le=!1){var Z=H+ae,Pe=(u(),C)[Z/4];Pe!=4294967295&&
(!le||Pe!=0)&&(I[M]=Pe)},L=function(M,H,ae){var le=H+ae,Z=(u(),C)[le/4],Pe=(u(),C)[(le+4)/4];(Z!=4294967295||Pe!=4294967295)&&
(I[M]=Ce(le))};var B=Number((u(),k)[g/8]),I={};if(d("maxTextureDimension1D",g,8),d("maxTextureDimension2D",g,12),d("maxT\
extureDimension3D",g,16),d("maxTextureArrayLayers",g,20),d("maxBindGroups",g,24),d("maxBindGroupsPlusVertexBuffers",g,28),
d("maxBindingsPerBindGroup",g,32),d("maxDynamicUniformBuffersPerPipelineLayout",g,36),d("maxDynamicStorageBuffersPerPipe\
lineLayout",g,40),d("maxSampledTexturesPerShaderStage",g,44),d("maxSamplersPerShaderStage",g,48),d("maxStorageBuffersPer\
ShaderStage",g,52),d("maxStorageTexturesPerShaderStage",g,56),d("maxUniformBuffersPerShaderStage",g,60),d("minUniformBuf\
ferOffsetAlignment",g,80),d("minStorageBufferOffsetAlignment",g,84),L("maxUniformBufferBindingSize",g,64),L("maxStorageB\
ufferBindingSize",g,72),d("maxVertexBuffers",g,88),L("maxBufferSize",g,96),d("maxVertexAttributes",g,104),d("maxVertexBu\
fferArrayStride",g,108),d("maxInterStageShaderVariables",g,112),d("maxColorAttachments",g,116),d("maxColorAttachmentByte\
sPerSample",g,120),d("maxComputeWorkgroupStorageSize",g,124),d("maxComputeInvocationsPerWorkgroup",g,128),d("maxComputeW\
orkgroupSizeX",g,132),d("maxComputeWorkgroupSizeY",g,136),d("maxComputeWorkgroupSizeZ",g,140),d("maxComputeWorkgroupsPer\
Dimension",g,144),d("maxImmediateSize",g,148,!0),B!==0){(u(),A)[(B+8)/4];var N=B;"maxStorageBuffersInVertexStage"in GPUSupportedLimits.
prototype&&(d("maxStorageBuffersInVertexStage",N,16),d("maxStorageTexturesInVertexStage",N,20),d("maxStorageBuffersInFra\
gmentStage",N,24),d("maxStorageTexturesInFragmentStage",N,28))}c.requiredLimits=I}var j=Number((u(),k)[(o+48)/8]);if(j){
var U={label:f.makeStringFromOptionalStringView(j+8)};c.defaultQueue=U}c.label=f.makeStringFromOptionalStringView(o+8)}ze(),
f.Internals.futureInsert(r,s.requestDevice(c).then(d=>{Te(),Fe(()=>{var L;f.Internals.jsObjectInsert(i,d.queue),f.Internals.
jsObjectInsert(n,d),(L=l.peercomputeOnDevice)==null||L.call(l,d),n=BigInt(n),f.Internals.futureInsert(t,d.lost.then(M=>{
Fe(()=>{d.onuncapturederror=le=>{};var H=ke(),ae=Ae(M.message);Cr(t,Ia[M.reason],BigInt(ae)),Se(H)})})),d.onuncapturederror=
M=>{var H=5;M.error instanceof GPUValidationError?H=2:M.error instanceof GPUOutOfMemoryError?H=3:M.error instanceof GPUInternalError&&
(H=4);var ae=ke(),le=Ae(M.error.message);Pt(BigInt(n),H,BigInt(le)),Se(ae)},Ur(r,1,BigInt(n),0n)})},d=>{Te(),Fe(()=>{var L=ke(),
M=Ae(d.message);Ur(r,3,BigInt(n),BigInt(M)),t&&Cr(t,4,BigInt(M)),Se(L)})}))}function xa(e){e=p(e);var r=f.getJsObject(e),
t=f.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<t.length;++n)t[n]();delete f.Internals.bufferOnUnmaps[e]}r.destroy()}
var Aa=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=(()=>{var i=f.getJsObject(e);t==-1&&(t=void 0);var o;try{o=i.getMappedRange(
r,t)}catch{return 0n}var s=rn(16,o.byteLength);return(u(),se).set(new Uint8Array(o),s),f.Internals.bufferOnUnmaps[e].push(
()=>Ct(s)),s})();return BigInt(n)},Ga=function(e,r,t,n,i){e=p(e),r=p(r),t=p(t),n=p(n),i=p(i);var o=f.getJsObject(e);f.Internals.
bufferOnUnmaps[e]=[],i==-1&&(i=void 0),ze(),f.Internals.futureInsert(r,o.mapAsync(t,n,i).then(()=>{Te(),Fe(()=>{Tr(r,1,0n)})},
s=>{Te(),Fe(()=>{var c=ke(),m=Ae(s.message),_=s.name==="AbortError"?4:s.name==="OperationError"?3:0;Tr(r,_,BigInt(m)),delete f.
Internals.bufferOnUnmaps[e]})}))};function Ca(e){e=p(e);var r=f.getJsObject(e),t=f.Internals.bufferOnUnmaps[e];if(t){for(var n=0;n<
t.length;++n)t[n]();delete f.Internals.bufferOnUnmaps[e],r.unmap()}}function Ta(e){e=p(e),delete f.Internals.jsObjects[e]}
function Ua(e,r,t){e=p(e),r=p(r),t=p(t);var n=!!(u(),C)[(r+40)/4],i={label:f.makeStringFromOptionalStringView(r+8),usage:(u(),
C)[(r+24)/4],size:Ce(r+32),mappedAtCreation:n},o=f.getJsObject(e),s;try{s=o.createBuffer(i)}catch{return!1}return f.Internals.
jsObjectInsert(t,s),n&&(f.Internals.bufferOnUnmaps[t]=[]),!0}function Da(e,r,t){e=p(e),r=p(r),t=p(t);var n=Number((u(),k)[r/
8]),i=(u(),A)[(n+8)/4],o={label:f.makeStringFromOptionalStringView(r+8),code:""};switch(i){case 2:{o.code=f.makeStringFromStringView(
n+16);break}}var s=f.getJsObject(e);f.Internals.jsObjectInsert(t,s.createShaderModule(o))}var Ra=e=>{const r=f.getJsObject(
e);r.onuncapturederror=null,r.destroy()};function ja(e,r,t,n){r=p(r),t=p(t),n=p(n);var i;if(t){i={featureLevel:f.FeatureLevel[(u(),
A)[(t+8)/4]],powerPreference:f.PowerPreference[(u(),A)[(t+12)/4]],forceFallbackAdapter:!!(u(),C)[(t+16)/4]};var o=Number(
(u(),k)[t/8]);if(o!==0){(u(),A)[(o+8)/4];var s=o;i.xrCompatible=!!(u(),C)[(s+16)/4]}}if(!("gpu"in navigator)){var c=ke(),
m=Ae("WebGPU not available on this browser (navigator.gpu is not available)");He(r,3,BigInt(n),BigInt(m)),Se(c);return}ze(),
f.Internals.futureInsert(r,navigator.gpu.requestAdapter(i).then(_=>{Te(),Fe(()=>{if(_)f.Internals.jsObjectInsert(n,_),He(
r,1,BigInt(n),0n);else{var g=ke(),B=Ae("WebGPU not available on this browser (requestAdapter returned null)");He(r,3,BigInt(
n),BigInt(B)),Se(g)}})},_=>{Te(),Fe(()=>{var g=ke(),B=Ae(_.message);He(r,4,BigInt(n),BigInt(B)),Se(g)})}))}var Oa=function(e,r){
e=p(e),r=p(r);var t=f.getJsObject(e);ze(),f.Internals.futureInsert(r,t.onSubmittedWorkDone().then(()=>{Te(),Fe(()=>{Ht(r,
1)})}))},wt=function(e,r,t){return e=p(e),r=p(r),t=p(t),be.handleAsync(async()=>{var n=[];if(t){var i=(u(),A)[t/4];n.length=
r+1,n[r]=new Promise(m=>setTimeout(m,i,0))}else n.length=r;for(var o=0;o<r;++o){var s=Ce(e+o*8);if(!(s in f.Internals.futures))
return s;n[o]=f.Internals.futures[s]}const c=await Promise.race(n);return delete f.Internals.futures[c],c})};wt.isAsync=
!0;var or={},La=()=>Q||"./this.program",$e=()=>{if(!$e.strings){var e=(typeof navigator=="object"&&navigator.language||"\
C").replace("-","_")+".UTF-8",r={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:e,_:La()};
for(var t in or)or[t]===void 0?delete r[t]:r[t]=or[t];var n=[];for(var t in r)n.push(`${t}=${r[t]}`);$e.strings=n}return $e.
strings};function yt(e,r){if(v)return te(14,0,1,e,r);e=p(e),r=p(r);var t=0,n=0;for(var i of $e()){var o=r+t;(u(),k)[(e+n)/
8]=BigInt(o),t+=Ie(i,o,1/0)+1,n+=8}return 0}function Et(e,r){if(v)return te(15,0,1,e,r);e=p(e),r=p(r);var t=$e();(u(),k)[e/
8]=BigInt(t.length);var n=0;for(var i of t)n+=Ne(i)+1;return(u(),k)[r/8]=BigInt(n),0}function kt(e){if(v)return te(16,0,
1,e);try{var r=$.getStreamFromFD(e);return a.close(r),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}var Ma=(e,r,t,n)=>{for(var i=0,o=0;o<t;o++){var s=Number((u(),k)[r/8]),c=Number((u(),k)[(r+8)/8]);r+=16;var m=a.read(
e,(u(),re),s,c,n);if(m<0)return-1;if(i+=m,m<c)break}return i};function St(e,r,t,n){if(v)return te(17,0,1,e,r,t,n);r=p(r),
t=p(t),n=p(n);try{var i=$.getStreamFromFD(e),o=Ma(i,r,t);return(u(),k)[n/8]=BigInt(o),0}catch(s){if(typeof a>"u"||s.name!==
"ErrnoError")throw s;return s.errno}}function Bt(e,r,t,n){if(v)return te(18,0,1,e,r,t,n);r=p(r),n=p(n);try{if(isNaN(r))return 61;
var i=$.getStreamFromFD(e);return a.llseek(i,r,t),(u(),O)[n/8]=BigInt(i.position),i.getdents&&r===0&&t===0&&(i.getdents=
null),0}catch(o){if(typeof a>"u"||o.name!=="ErrnoError")throw o;return o.errno}}var qa=(e,r,t,n)=>{for(var i=0,o=0;o<t;o++){
var s=Number((u(),k)[r/8]),c=Number((u(),k)[(r+8)/8]);r+=16;var m=a.write(e,(u(),re),s,c,n);if(m<0)return-1;if(i+=m,m<c)
break}return i};function Nt(e,r,t,n){if(v)return te(19,0,1,e,r,t,n);r=p(r),t=p(t),n=p(n);try{var i=$.getStreamFromFD(e),
o=qa(i,r,t);return(u(),k)[n/8]=BigInt(o),0}catch(s){if(typeof a>"u"||s.name!=="ErrnoError")throw s;return s.errno}}function za(e,r){
e=p(e),r=p(r);try{return _r((u(),se).subarray(e,e+r)),0}catch(t){if(typeof a>"u"||t.name!=="ErrnoError")throw t;return t.
errno}}function Wa(e,r){e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillAdapterInfoStruct(t.info,r),1}function Qa(e,r){
e=p(e),r=p(r);var t=f.getJsObject(e);return f.fillLimitStruct(t.limits,r),1}function Va(e,r){e=p(e);var t=f.getJsObject(
e);return t.features.has(f.FeatureName[r])}var Ja=function(e){e=p(e);var r=(()=>{var t=f.getJsObject(e);return t.size})();
return BigInt(r)},$a=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:f.makeStringFromOptionalStringView(r+8),
timestampWrites:f.makePassTimestampWrites(Number((u(),k)[(r+24)/8]))});var i=f.getJsObject(e),o=xr(0n);return f.Internals.
jsObjectInsert(o,i.beginComputePass(n)),o})();return BigInt(t)};function Ha(e,r,t,n,i,o){e=p(e),r=p(r),t=p(t),n=p(n),i=p(
i),o=p(o);var s=f.getJsObject(e),c=f.getJsObject(r),m=f.getJsObject(n);s.copyBufferToBuffer(c,t,m,i,o)}var Pa=function(e,r){
e=p(e);var t=(()=>{var n=f.getJsObject(e),i=Ir(0n);return f.Internals.jsObjectInsert(i,n.finish()),i})();return BigInt(t)};
function Ya(e,r,t,n){e=p(e);var i=f.getJsObject(e);i.dispatchWorkgroups(r,t,n)}function Ka(e){e=p(e);var r=f.getJsObject(
e);r.end()}function Xa(e,r,t,n,i){e=p(e),t=p(t),n=p(n),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(t);n==0?o.setBindGroup(
r,s):o.setBindGroup(r,s,(u(),C),i/4,n)}function Za(e,r){e=p(e),r=p(r);var t=f.getJsObject(e),n=f.getJsObject(r);t.setPipeline(
n)}var ei=function(e,r){e=p(e);var t=(()=>{var n=f.getJsObject(e),i=Nr(0n);return f.Internals.jsObjectInsert(i,n.getBindGroupLayout(
r)),i})();return BigInt(t)},ri=function(e,r){e=p(e),r=p(r);var t=(()=>{function n(m){var _=Number((u(),k)[(m+16)/8]),g=Number(
(u(),k)[(m+40)/8]),B=Number((u(),k)[(m+48)/8]),I=0;f.iterateExtensions(m,{327681:U=>{I=Number((u(),k)[(U+16)/8])}});var N;
if(_){var j=Ce(m+32);j==-1&&(j=void 0),N={buffer:f.getJsObject(_),offset:Ce(m+24),size:j}}else N=f.getJsObject(g||B||I);
return{binding:(u(),C)[(m+8)/4],resource:N}}function i(m,_){for(var g=[],B=0;B<m;++B)g.push(n(_+56*B));return g}var o={label:f.
makeStringFromOptionalStringView(r+8),layout:f.getJsObject(Number((u(),k)[(r+24)/8])),entries:i(Number((u(),k)[(r+32)/8]),
Number((u(),k)[(r+40)/8]))},s=f.getJsObject(e),c=Br(0n);return f.Internals.jsObjectInsert(c,s.createBindGroup(o)),c})();
return BigInt(t)},ti=function(e,r){e=p(e),r=p(r);var t=(()=>{var n;r&&(n={label:f.makeStringFromOptionalStringView(r+8)});
var i=f.getJsObject(e),o=Fr(0n);return f.Internals.jsObjectInsert(o,i.createCommandEncoder(n)),o})();return BigInt(t)},ni=function(e,r){
e=p(e),r=p(r);var t=(()=>{var n=f.makeComputePipelineDesc(r),i=f.getJsObject(e),o=Ar(0n);return f.Internals.jsObjectInsert(
o,i.createComputePipeline(n)),o})();return BigInt(t)};function ai(e,r){return"wgslLanguageFeatures"in navigator.gpu?navigator.
gpu.wgslLanguageFeatures.has(f.WGSLLanguageFeatureName[r]):!1}var ii=function(e,r,t){e=p(e),r=p(r),t=p(t);var n=f.getJsObject(
e),i=Array.from((u(),O).subarray(t/8,(t+r*8)/8),o=>f.getJsObject(o));n.submit(i)};function oi(e,r,t,n,i){e=p(e),r=p(r),t=
p(t),n=p(n),i=p(i);var o=f.getJsObject(e),s=f.getJsObject(r),c=(u(),se).subarray(n,n+i);o.writeBuffer(s,t,c,0,i)}var be={
instrumentWasmImports(e){var r=/^(invoke_.*|__asyncjs__.*)$/;for(let[t,n]of Object.entries(e))typeof n=="function"&&(n.isAsync||
r.test(t))&&(e[t]=n=new WebAssembly.Suspending(n))},instrumentFunction(e){var r=(...t)=>e(...t);return r},instrumentWasmExports(e){
var r=/^(wllama_start|wllama_action|main|__main_argc_argv)$/;be.asyncExports=new Set;var t={};for(let[i,o]of Object.entries(
e))if(typeof o=="function"){r.test(i)&&(be.asyncExports.add(o),o=be.makeAsyncFunction(o));var n=be.instrumentFunction(o);
t[i]=n}else t[i]=o;return t},asyncExports:null,isAsyncExport(e){var r;return(r=be.asyncExports)==null?void 0:r.has(e)},handleAsync:async e=>{
ze();try{return await e()}finally{Te()}},handleSleep:e=>be.handleAsync(()=>new Promise(e)),makeAsyncFunction(e){return WebAssembly.
promising(e)}},It=e=>{var r=l["_"+e];return r},si=(e,r)=>{(u(),re).set(e,r)},Ft=(e,r,t,n,i)=>{var o={pointer:U=>BigInt(U),
string:U=>{var d=0;return U!=null&&U!==0&&(d=Ae(U)),BigInt(d)},array:U=>{var d=mr(U.length);return si(U,d),BigInt(d)}};function s(U){
return r==="string"?Je(Number(U)):r==="pointer"?Number(U):r==="boolean"?!!U:U}var c=It(e),m=[],_=0;if(n)for(var g=0;g<n.
length;g++){var B=o[t[g]];B?(_===0&&(_=ke()),m[g]=B(n[g])):m[g]=n[g]}var I=c(...m);function N(U){return _!==0&&Se(_),s(U)}
var j=i==null?void 0:i.async;return j?I.then(N):(I=N(I),I)},li=(e,r,t,n)=>{var i=!t||t.every(s=>s==="number"||s==="boole\
an"),o=r!=="string";return o&&i&&!n?It(e):(...s)=>Ft(e,r,t,s,n)},ui=(...e)=>a.createPath(...e),ci=(...e)=>a.unlink(...e),
fi=(...e)=>a.createLazyFile(...e),mi=(...e)=>a.createDevice(...e);if(W.init(),a.createPreloadedFile=Yn,a.preloadFile=Er,
a.staticInit(),Ee(),l.noExitRuntime&&(gr=l.noExitRuntime),l.preloadPlugins&&(lt=l.preloadPlugins),l.print&&(ee=l.print),
l.printErr&&(P=l.printErr),l.wasmBinary&&(me=l.wasmBinary),l.arguments&&l.arguments,l.thisProgram&&(Q=l.thisProgram),l.preInit)
for(typeof l.preInit=="function"&&(l.preInit=[l.preInit]);l.preInit.length>0;)l.preInit.shift()();l.ENV=or,l.mmapAlloc=wr,
l.wasmMemory=Be,l.addRunDependency=tr,l.removeRunDependency=rr,l.ccall=Ft,l.cwrap=li,l.FS_preloadFile=Er,l.FS_unlink=ci,
l.FS_createPath=ui,l.FS_createDevice=mi,l.FS=a,l.FS_createDataFile=st,l.FS_createLazyFile=fi,l.MEMFS=R;var di=[Yr,Kr,tt,
ut,Kn,ct,ft,mt,Xn,Zn,dt,pt,gt,bt,yt,Et,kt,St,Bt,Nt];function xt(e,r,t,n){return be.handleAsync(async()=>await b(Je(Number(
e)),Number(r),Number(t),Number(n)))}xt.sig="jjjjj";var At,Gt,Ct,Br,Nr,Ir,Fr,xr,Ar,Tt,Ut,Dt,Rt,jt,Ot,Lt,Mt,qt,zt,Wt,Qt,Vt,
Jt,Gr,$t,Cr,Tr,He,Ur,Ht,Pt,sr,Yt,Dr,Kt,Xt,Zt,Rr,en,rn,tn,nn,an,on,sn,ln;function pi(e){l._wllama_malloc=e.wllama_malloc,
l._wllama_start=e.wllama_start,l._wllama_action=e.wllama_action,l._wllama_exit=e.wllama_exit,l._wllama_debug=e.wllama_debug,
At=l._main=e.main,Gt=e.malloc,Ct=e.free,Br=e.emwgpuCreateBindGroup,Nr=e.emwgpuCreateBindGroupLayout,Ir=e.emwgpuCreateCommandBuffer,
Fr=e.emwgpuCreateCommandEncoder,xr=e.emwgpuCreateComputePassEncoder,Ar=e.emwgpuCreateComputePipeline,Tt=e.emwgpuCreateExternalTexture,
Ut=e.emwgpuCreatePipelineLayout,Dt=e.emwgpuCreateQuerySet,Rt=e.emwgpuCreateRenderBundle,jt=e.emwgpuCreateRenderBundleEncoder,
Ot=e.emwgpuCreateRenderPassEncoder,Lt=e.emwgpuCreateRenderPipeline,Mt=e.emwgpuCreateSampler,qt=e.emwgpuCreateSurface,zt=
e.emwgpuCreateTexture,Wt=e.emwgpuCreateTextureView,Qt=e.emwgpuCreateAdapter,Vt=e.emwgpuCreateBuffer,Jt=e.emwgpuCreateDevice,
Gr=e.emwgpuCreateQueue,$t=e.emwgpuCreateShaderModule,Cr=e.emwgpuOnDeviceLostCompleted,Tr=e.emwgpuOnMapAsyncCompleted,He=
e.emwgpuOnRequestAdapterCompleted,Ur=e.emwgpuOnRequestDeviceCompleted,Ht=e.emwgpuOnWorkDoneCompleted,Pt=e.emwgpuOnUncapturedError,
e._emscripten_tls_init,sr=e.pthread_self,Yt=e.emscripten_builtin_memalign,Dr=e._emscripten_thread_init,Kt=e._emscripten_thread_crashed,
Xt=e._emscripten_run_js_on_main_thread,Zt=e._emscripten_thread_free_data,Rr=e._emscripten_thread_exit,en=e._emscripten_check_mailbox,
rn=e.memalign,tn=e.__trap,nn=e.emscripten_stack_set_limits,an=e._emscripten_stack_restore,on=e._emscripten_stack_alloc,sn=
e.emscripten_stack_get_current,ln=e.__indirect_function_table}var We;function gi(){We={__asyncjs__js_file_read:xt,__pthread_create_js:nt,
__syscall_fcntl64:ut,__syscall_getcwd:ct,__syscall_getdents64:ft,__syscall_ioctl:mt,__syscall_openat:dt,__syscall_stat64:pt,
_abort_js:ea,_emscripten_init_main_thread_js:ra,_emscripten_notify_mailbox_postmessage:na,_emscripten_receive_on_main_thread_js:aa,
_emscripten_thread_cleanup:ia,_emscripten_thread_mailbox_await:Sr,_emscripten_thread_set_strongref:oa,_localtime_js:fa,_mmap_js:gt,
_munmap_js:bt,_tzset_js:ma,clock_time_get:pa,emscripten_check_blocking_allowed:ga,emscripten_date_now:ht,emscripten_exit_with_live_runtime:ba,
emscripten_get_callstack:va,emscripten_get_heap_max:wa,emscripten_get_now:_t,emscripten_has_asyncify:ya,emscripten_num_logical_cores:Ea,
emscripten_resize_heap:Sa,emwgpuAdapterRequestDevice:Fa,emwgpuBufferDestroy:xa,emwgpuBufferGetConstMappedRange:Aa,emwgpuBufferMapAsync:Ga,
emwgpuBufferUnmap:Ca,emwgpuDelete:Ta,emwgpuDeviceCreateBuffer:Ua,emwgpuDeviceCreateShaderModule:Da,emwgpuDeviceDestroy:Ra,
emwgpuInstanceRequestAdapter:ja,emwgpuQueueOnSubmittedWorkDone:Oa,emwgpuWaitAny:wt,environ_get:yt,environ_sizes_get:Et,exit:dr,
fd_close:kt,fd_read:St,fd_seek:Bt,fd_write:Nt,memory:Be,random_get:za,wgpuAdapterGetInfo:Wa,wgpuAdapterGetLimits:Qa,wgpuAdapterHasFeature:Va,
wgpuBufferGetSize:Ja,wgpuCommandEncoderBeginComputePass:$a,wgpuCommandEncoderCopyBufferToBuffer:Ha,wgpuCommandEncoderFinish:Pa,
wgpuComputePassEncoderDispatchWorkgroups:Ya,wgpuComputePassEncoderEnd:Ka,wgpuComputePassEncoderSetBindGroup:Xa,wgpuComputePassEncoderSetPipeline:Za,
wgpuComputePipelineGetBindGroupLayout:ei,wgpuDeviceCreateBindGroup:ri,wgpuDeviceCreateCommandEncoder:ti,wgpuDeviceCreateComputePipeline:ni,
wgpuInstanceHasWGSLLanguageFeature:ai,wgpuQueueSubmit:ii,wgpuQueueWriteBuffer:oi}}function bi(e){e=Object.assign({},e);var r=_=>(g,B,I)=>_(
g,BigInt(B||0),BigInt(I||0)),t=_=>g=>Number(_(BigInt(g))),n=_=>g=>_(BigInt(g)),i=_=>()=>Number(_()),o=_=>(g,B)=>Number(_(
BigInt(g),BigInt(B))),s=_=>(g,B,I,N,j,U)=>_(BigInt(g),B,I,N,j,U),c=_=>(g,B,I,N,j)=>_(g,BigInt(B),I,BigInt(N),j),m=_=>(g,B)=>_(
BigInt(g),BigInt(B));return e.main=r(e.main),e.malloc=t(e.malloc),e.free=n(e.free),e.pthread_self=i(e.pthread_self),e.emscripten_builtin_memalign=
o(e.emscripten_builtin_memalign),e._emscripten_thread_init=s(e._emscripten_thread_init),e._emscripten_run_js_on_main_thread=
c(e._emscripten_run_js_on_main_thread),e._emscripten_thread_free_data=n(e._emscripten_thread_free_data),e._emscripten_thread_exit=
n(e._emscripten_thread_exit),e.memalign=o(e.memalign),e.emscripten_stack_set_limits=m(e.emscripten_stack_set_limits),e._emscripten_stack_restore=
n(e._emscripten_stack_restore),e._emscripten_stack_alloc=t(e._emscripten_stack_alloc),e.emscripten_stack_get_current=i(e.
emscripten_stack_get_current),e}async function _i(){var e=At,r=0,t=0;try{var n=e(r,BigInt(t));return n=await n,Xr(n,!0),
n}catch(i){return kr(i)}}function lr(){if(De>0){Ve=lr;return}if(v){Ue();return}if(Qe(),De>0){Ve=lr;return}async function e(){
var t;if(l.calledRun=!0,!ce){Ue(),(t=l.onRuntimeInitialized)==null||t.call(l);var r=l.noInitialRun||!1;r||await _i(),Gn()}}
l.setStatus?(l.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>l.setStatus(""),1),e()},1)):e()}var Ge;return v||(zr(),
lr()),l}var wn=1,yn={erro_evt:{name:"erro_evt",structName:"glue_msg_error",className:"GlueMsgError",fields:[{type:"str",
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
er=new Uint8Array([71,76,85,69]),Mr=0,Bi=1,Ni=2,Ii=3,Fi=4,xi=5,Ai=6,Gi=7,Ci=8,Ti=9,Ui=10,En={str:Fi,int:Ni,float:Ii,bool:Bi,
raw:xi,arr_str:Ti,arr_int:Gi,arr_float:Ci,arr_bool:Ai,arr_raw:Ui,null:Mr};function Di(l){let b=0;const S=new DataView(l.
buffer),F=()=>{const z=S.getUint32(b,!0);return b+=4,z},T=()=>{const z=S.getInt32(b,!0);return b+=4,z},w=()=>{const z=S.
getFloat32(b,!0);return b+=4,z},v=()=>F()!==0,q=z=>{const K=z??F(),ne=new TextDecoder().decode(l.slice(b,b+K));return b+=
K,ne},Q=()=>{const z=F(),K=l.slice(b,b+z);return b+=z,K},h=z=>{const K=F(),ne=new Array(K);for(let ee=0;ee<K;ee++)ne[ee]=
z();return ne},x=()=>null,y=z=>{switch(z.type){case"str":return q();case"int":return T();case"float":return w();case"boo\
l":return v();case"raw":return Q();case"arr_str":return h(q);case"arr_int":return h(T);case"arr_float":return h(w);case"\
arr_bool":return h(v);case"arr_raw":return h(Q);case"null":return x()}},V=l[0]===er[0]&&l[1]===er[1]&&l[2]===er[2]&&l[3]===
er[3];if(b+=4,!V)throw new Error("Invalid magic number");if(F()!==wn)throw new Error("Invalid version number");const G=q(
8),D=yn[G];if(!D)throw new Error(`Unknown message name: ${G}`);const ie={_name:G};for(const z of D.fields){const K=F();if(K===
Mr){if(!z.isNullable)throw new Error(`${G}: Expect field ${z.name} to be non-nullable`);ie[z.name]=null;continue}if(K!==
En[z.type])throw new Error(`${G}: Expect field ${z.name} to have type ${z.type}`);ie[z.name]=y(z)}return ie}function Ri(l){
const b=yn[l._name];if(!b)throw new Error(`Unknown message name: ${l._name}`);const S=[],F=E=>{const G=new ArrayBuffer(4);
new DataView(G).setUint32(0,E,!0),S.push(new Uint8Array(G))},T=E=>{const G=new ArrayBuffer(4);new DataView(G).setInt32(0,
E,!0),S.push(new Uint8Array(G))},w=E=>{const G=new ArrayBuffer(4);new DataView(G).setFloat32(0,E,!0),S.push(new Uint8Array(
G))},v=E=>{F(E?1:0)},q=E=>{const G=new TextEncoder().encode(E);F(G.byteLength),S.push(G)},Q=E=>{F(E.byteLength),S.push(E)},
h=(E,G)=>{F(E.length);for(const D of E)G(D)};S.push(er),F(wn);{const E=new TextEncoder().encode(l._name);S.push(E)}for(const E of b.
fields){const G=l[E.name];if(!E.isNullable&&G==null)throw new Error(`${l._name}: Expect field ${E.name} to be non-nullab\
le`);if(G==null){F(Mr);continue}switch(F(En[E.type]),E.type){case"str":q(G);break;case"int":T(G);break;case"float":w(G);
break;case"bool":v(G);break;case"raw":Q(G);break;case"arr_str":h(G,q);break;case"arr_int":h(G,T);break;case"arr_float":h(
G,w);break;case"arr_bool":h(G,v);break;case"arr_raw":h(G,Q);break}}const x=S.reduce((E,G)=>E+G.byteLength,0),y=new Uint8Array(
x);let V=0;for(const E of S)y.set(E,V),V+=E.byteLength;return y}const kn=4*1024**2,gn=1024*1024;function ji({files:l,reader:b,
getMemory:S,getSignal:F=()=>{}}){const T=new Map(l.map(w=>[w.name,w]));return async(w,v,q,Q)=>{const h=T.get(w.replace(/^\/?models\//,
""));if(!h||![v,q,Q].every(y=>Number.isSafeInteger(y)&&y>=0)||v>h.size)throw new Error("Invalid GGUF native file read");
const x=Math.min(q,h.size-v);if(!Number.isSafeInteger(Q+x)||Q+x>S().byteLength)throw new Error("GGUF native file read ex\
ceeds WASM memory");for(let y=0;y<x;){fe(F());const V=Math.min(kn,x-y),E=await b.read(h.path,v+y,V,{signal:F()});if(fe(F()),
!(E instanceof Uint8Array)||E.byteLength!==V)throw new Error("Incomplete GGUF artifact range");new Uint8Array(S()).set(E,
Q+y),y+=V}return BigInt(x)}}function Oi(l,b){l.FS.mkdir("/models"),l.FS.mount(l.MEMFS,{root:"."},"/models");const S=new Map(
b.map(w=>[w.name,w])),F=l.MEMFS.stream_ops;for(const w of["read","llseek"]){const v=F[w];F[w]=function(q,...Q){const h=S.
get(q.node.name);return h&&(q.node.usedBytes=h.size),v.call(this,q,...Q)},l.MEMFS.ops_table.file.stream[w]=F[w]}const T=F.
mmap;F.mmap=function(w,...v){if(S.has(w.node.name))throw new Error("GGUF artifact mmap is prohibited");return T.call(this,
w,...v)},l.MEMFS.ops_table.file.stream.mmap=F.mmap;for(const w of b)l.FS_createDataFile("/models",w.name,new Uint8Array(
0),!0,!1,!0)}function Li(l,b,{collect:S=!1,onLost:F}={}){var Q;if(b.device=l,b.runtimeFeatures=[...l.features],b.runtimeAdapter=
l.adapterInfo?{vendor:l.adapterInfo.vendor,architecture:l.adapterInfo.architecture,isFallbackAdapter:l.adapterInfo.isFallbackAdapter??
!1}:null,!l.features.has("shader-f16")||(Q=b.runtimeAdapter)!=null&&Q.isFallbackAdapter)throw new Error("GGUF native run\
time did not acquire the required hardware GPU");if(l.lost.then(h=>F==null?void 0:F(h)),!S)return()=>{};const T=Object.getOwnPropertyDescriptor(
l,"createCommandEncoder"),w=Object.getOwnPropertyDescriptor(l.queue,"submit"),v=l.createCommandEncoder.bind(l),q=l.queue.
submit.bind(l.queue);return l.createCommandEncoder=(...h)=>{const x=v(...h),y=x.beginComputePass.bind(x);return x.beginComputePass=
(...V)=>{const E=y(...V);for(const G of["dispatchWorkgroups","dispatchWorkgroupsIndirect"]){const D=E[G].bind(E);E[G]=(...ie)=>{
const z=D(...ie);return b.dispatches+=1,z}}return E},x},l.queue.submit=(...h)=>{const x=q(...h);return b.submissions+=1,
x},()=>{T?Object.defineProperty(l,"createCommandEncoder",T):delete l.createCommandEncoder,w?Object.defineProperty(l.queue,
"submit",w):delete l.queue.submit}}function Mi(l){const b=/offloaded\s+(\d+)\s*\/\s*(\d+)\s+layers to GPU/i.exec(l);return b?
{gpuLayers:Number(b[1]),totalLayers:Number(b[2])}:null}function qi(l){const b=/([A-Za-z0-9_-]+)\s+(model|KV|compute) buffer size\s*=\s*(\d+(?:\.\d+)?)\s*MiB/i.
exec(l);return b?{backend:b[1],kind:b[2].toLowerCase(),bytes:Math.round(Number(b[3])*1024**2)}:null}async function zi({wasmUrl:l,
weights:b,reader:S,signal:F,collectGpuEvidence:T=!1,onProgress:w,onLost:v,initialize:q=Si}={}){const Q=b.map((Y,X)=>({...Y,
name:`model-${String(X+1).padStart(5,"0")}-of-${String(b.length).padStart(5,"0")}.gguf`})),h={dispatches:0,submissions:0,
device:null,offload:null,buffers:[],lost:!1};let x=F,y,V,E,G,D;const ie=new Promise((Y,X)=>{G=Y,D=X}),z=Y=>{var oe;const X=Mi(
String(Y));X&&(h.offload=X,w==null||w({type:"gpu-offload",...X}));const u=qi(String(Y));u&&h.buffers.length<32&&(h.buffers.
push(u),w==null||w({type:"native-buffer",...u,wasmMemoryBytes:((oe=E==null?void 0:E.wasmMemory)==null?void 0:oe.buffer.byteLength)??
0}))},K=Y=>{y=new Error(`Model session lost: GGUF native runtime failed: ${String(Y).slice(0,300)}`),D(y)};E={noInitialRun:!0,
pthreadPoolSize:0,locateFile(Y){if(Y!=="wllama.wasm")throw new Error("Untrusted GGUF runtime asset request");return l},print:z,
printErr:z,onAbort:K,onExit:K,preRun(){E.ENV.USE_ASYNC_FILE="1"},onRuntimeInitialized(){G()},peercomputeOnDevice(Y){try{
V==null||V(),V=Li(Y,h,{collect:T,onLost(X){h.lost=!0,v==null||v(X)}})}catch(X){Y.destroy(),K(X.message)}}};const ne=ji({
files:Q,reader:S,getMemory:()=>E.wasmMemory.buffer,getSignal:()=>x});q(E,ne),await ie,fe(F),Oi(E,Q);const ee=E.cwrap("wl\
lama_start","string",[],{async:!0}),P=E.cwrap("wllama_malloc","bigint",["bigint","number"]),me=E.cwrap("wllama_action","\
bigint",["string","bigint"],{async:!0});let ue=!1;const ce=async(Y,X,u)=>{if(ue)throw new Error("Concurrent GGUF native \
calls are prohibited");if(y)throw y;if(h.lost)throw new Error("GPU device lost; GGUF session is unavailable");fe(u),ue=!0,
x=u;try{const oe=Ri(X);if(oe.byteLength>gn)throw new Error("GGUF native message exceeds its byte budget");const de=Number(
P(BigInt(oe.byteLength),0)),xe=new Uint8Array(E.wasmMemory.buffer);if(!Number.isSafeInteger(de)||de<=0||de+oe.length>xe.
length)throw new Error("Invalid GGUF input pointer");xe.set(oe,de);const re=Number(await me(Y,BigInt(de)));if(y)throw y;
const se=E.wasmMemory.buffer,pe=new DataView(se).getUint32(de,!0);if(!Number.isSafeInteger(re)||re<=0||pe>gn||re+pe>se.byteLength)
throw new Error("Invalid GGUF output buffer");return Di(new Uint8Array(se,re,pe).slice())}catch(oe){throw y??(y=new Error(
`Model session lost: GGUF native action failed: ${String(oe.message??oe).slice(0,300)}`)),y}finally{ue=!1,x=void 0}},_e=JSON.
parse(await ee());if(y)throw y;if(!_e.success||!h.device)throw new Error("GGUF native hardware GPU backend did not initi\
alize");return fe(F),{files:Q,action:ce,evidence:h,async settleGpu(){try{await h.device.queue.onSubmittedWorkDone()}catch(Y){
throw h.lost=!0,y=new Error(`Model session lost: GGUF GPU completion failed: ${String(Y.message??Y).slice(0,300)}`),y}},
close(){var Y;V==null||V(),(Y=h.device)==null||Y.destroy()},memoryBytes(){return E.wasmMemory.buffer.byteLength}}}const Ye="\
Tsotchke-Corporation/Qwen3.8-27B-GeoRefine-D14-abl-GGUF",Ke="5ce3fd841676adf2c1a10d7193637d46007e88f7",bn=[{path:".gitat\
tributes",size:1603,gitBlobSha1:"dc92aece34cd441111fb2852aeaa5ee468bf2470"},{path:"LICENSE",size:11350,gitBlobSha1:"80c1\
e78282bdef7ca03dd22e21ebe6f181687d02"},{path:"NOTICE",size:514,gitBlobSha1:"8ced6aff2e3eeb0aa9fd727482eaa14e558c59da"},{
path:"Qwen3.8-27B-GeoRefine-D14-abl-MIXED-IQ4_XS.gguf",size:14199740480,sha256:"afe9e0cb33a232fe4735635e9cbb95a2f3fa4d8d\
e2990de0d5fdb9e8a979299d"},{path:"README.md",size:3621,gitBlobSha1:"e1d99b2f8056b073da42651bf2aca14a0c95508d"},{path:"ar\
tifact-manifest.json",size:5510,gitBlobSha1:"af686998d5593950b0ebd97ff47bd8967b3b0f82"},{path:"chat_template.jinja",size:8952,
gitBlobSha1:"c0c686f9c38d70d179fb7b5f5aa7530bc913dda3"},{path:"config.json",size:4312,gitBlobSha1:"706cebd746c4b6f2b1d1f\
892630867acfdfd3df8"},{path:"generation_config.json",size:202,gitBlobSha1:"023756cfadf88e5bf69eefeee3e172f38c448d64"},{path:"\
tokenizer_config.json",size:17928,gitBlobSha1:"5de744b3fca2129d7186979ae47c06be33903243"},{path:"verify_artifact.py",size:1217,
gitBlobSha1:"15dd7292eb203b06e0df3640f9ae04fff09706ef"}],Wi="This catalog supports verified storage and distribution. Ex\
ecution is admitted separately by the managed llama.cpp runtime and GGUF model catalog after browser capability and reso\
urce checks.";function Sn(l){for(const b of Object.values(l))b&&typeof b=="object"&&Sn(b);return Object.freeze(l)}const Qi=Sn(
{"qwen3.8-27b-georefine-d14-gguf":{id:"qwen3.8-27b-georefine-d14-gguf",name:"Qwen3.8 27B GeoRefine D14 (mixed GGUF)",repository:Ye,
revision:Ke,status:"storage-only",format:"GGUF",capabilities:{import:!0,pin:!0,peerHosting:!0,browserInference:!1,executionStatus:"\
unavailable",executionReason:Wi},license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Ye}/blob/${Ke}/LICENSE`,
notice:"Preserve upstream LICENSE, NOTICE, model card, and immutable artifact provenance."},provenance:{repository:Ye,revision:Ke,
format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Ye}/blob/${Ke}/README.md`,sourceManifestPath:"\
artifact-manifest.json"},model:{runtime:"llama.cpp",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"m\
ixed",quantizationTypes:["IQ4_XS","IQ3_S","Q8_0","Q4_K","Q5_K","F32"],repository:Ye,revision:Ke},weightBytes:14199740480,
totalBytes:bn.reduce((l,b)=>l+b.size,0),files:bn}});function Bn(l){return l&&typeof l=="object"&&!Object.isFrozen(l)&&(Object.
values(l).forEach(Bn),Object.freeze(l)),l}const Vi=[{id:"qwen3.5-9b-evil-bowman-q5-k-m-gguf",name:"Qwen3.5 9B Evil (Bowm\
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
EVALUATION.md"}}]}],Ji=Bn(Object.fromEntries(Vi.map(l=>{const{dtype:b,sourceModel:S,blockCount:F,nextnPredictLayers:T,...w}=l,
q=w.files.find(Q=>Q.path==="LICENSE").source;return[w.id,{...w,status:"execution-candidate",format:"GGUF",capabilities:{
import:!0,pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"\
Requires managed llama.cpp WebGPU, shader-f16, cross-origin isolation, shared WASM memory64/JSPI and memory admission. T\
hese exact files have not passed device execution validation."},license:{spdx:"Apache-2.0",sourceUrl:"https://huggingfac\
e.co/"+q.repository+"/blob/"+q.revision+"/LICENSE",notice:"The inherited Apache-2.0 license, conversion/source cards and\
 available modification notices are included."},provenance:{repository:w.repository,revision:w.revision,format:"GGUF",metadataCheckedAt:"\
2026-11-03",modelCardUrl:"https://huggingface.co/"+w.repository+"/blob/"+w.revision+"/README.md",sourceModel:{...S,revisionPurpose:"\
Pinned source documentation and license reference; the converter does not identify its exact source checkpoint revision.",
conversionInputRevisionVerified:!1},upstreamContextTokens:262144,ggufHeader:{version:3,architecture:"qwen35",blockCount:F,
nextnPredictLayers:T,inspectedPrefixBytes:65536},vision:"Upstream vision metadata/projectors exist, but this text-only p\
ackage omits the optional projector and the current managed GGUF adapter rejects images.",behavior:w.behavior.notice},model:{
runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:b,modalities:[
"text"],requiredFeatures:["shader-f16"],repository:w.repository,revision:w.revision},weightBytes:w.files[0].size,totalBytes:w.
files.reduce((Q,h)=>Q+h.size,0)}]}))),Xe="bartowski/Qwen_Qwen3.5-0.8B-GGUF",Ze="f36b1ea49a332ede8fe5f389bbf5b3575ef71f48",
jr=[{path:"Qwen_Qwen3.5-0.8B-Q4_K_M.gguf",size:579615840,sha256:"fb044e93939a70469c905781334f5de1e6c8b608ced6cbc8c9249bd\
4127d9526"},{path:"README.md",size:13782,gitBlobSha1:"499cb320f9f2f3963beee9d8b890046f825c6f5d"}],Lr=Object.freeze({import:!0,
pin:!0,peerHosting:!0,browserInference:!0,requiresCapabilityCheck:!0,executionStatus:"candidate",executionReason:"Requir\
es the managed llama.cpp WebGPU runtime, an isolated browser with shader-f16, and explicit memory admission. Actual mode\
l execution must be verified on the selected device."});function Nn(l){return l&&typeof l=="object"&&!Object.isFrozen(l)&&
(Object.values(l).forEach(Nn),Object.freeze(l)),l}const $i=Object.fromEntries([{id:"qwen3-0.6b-abliterated-q4-k-m-gguf",
name:"Qwen3 0.6B Abliterated (GGUF Q4_K_M, text)",repository:"mlabonne/Qwen3-0.6B-abliterated-GGUF",revision:"92351f431c\
fdd36f71149aaf072a6490a68e144e",architecture:"qwen3",files:[{path:"qwen3-0.6b-abliterated.q4_k_m.gguf",size:396704896,sha256:"\
a5ee9177eeb334fc06883ae2ac5471e783a4ac2480f3a3bd6df852c5b20243e1"},{path:"README.md",size:2525,sha256:"bf87a238c72dda7f2\
1fa8082ebb14a0efa6cbc9f14185c0bf144a20756152a5a",gitBlobSha1:"a75d0a93363be8f7103979938cc420c932911dbb",source:{repository:"\
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
5-0.8B",revision:"2fc06364715b967f1860aea9cf38778875588b17",path:"LICENSE"}}]}].map(({architecture:l,...b})=>[b.id,Nn({...b,
status:"execution-candidate",format:"GGUF",capabilities:Lr,behavior:{kind:"abliterated",notice:"Publisher-described redu\
ction in refusals; not a guarantee of refusal-free output or factual accuracy."},license:{spdx:"Apache-2.0",sourceUrl:`h\
ttps://huggingface.co/${b.files[2].source.repository}/blob/${b.files[2].source.revision}/LICENSE`,notice:"The inherited \
upstream Apache-2.0 license and model card are included."},provenance:{repository:b.repository,revision:b.revision,format:"\
GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${b.repository}/blob/${b.revision}/README.md`,
behavior:"abliterated; publisher claim, not an execution or behavioral guarantee"},model:{runtime:"llama.cpp",runtimeVersion:"\
3.8.1",architecture:l,format:"GGUF",task:"text-generation",dtype:"q4_k_m",modalities:["text"],repository:b.repository,revision:b.
revision},weightBytes:b.files[0].size,totalBytes:b.files.reduce((S,F)=>S+F.size,0)})])),Hi=Object.freeze({"qwen3.5-0.8b-\
q4-k-m-gguf":{id:"qwen3.5-0.8b-q4-k-m-gguf",name:"Qwen3.5 0.8B (GGUF Q4_K_M, text)",repository:Xe,revision:Ze,status:"ex\
ecution-candidate",format:"GGUF",capabilities:Lr,license:{spdx:"Apache-2.0",sourceUrl:`https://huggingface.co/${Xe}/blob\
/${Ze}/README.md`,notice:"Preserve the upstream model card and immutable artifact provenance."},provenance:{repository:Xe,
revision:Ze,format:"GGUF",metadataCheckedAt:"2026-11-03",modelCardUrl:`https://huggingface.co/${Xe}/blob/${Ze}/README.md`},
model:{runtime:"llama.cpp",runtimeVersion:"3.8.1",architecture:"qwen3_5",format:"GGUF",task:"text-generation",dtype:"q4_\
k_m",modalities:["text"],repository:Xe,revision:Ze},weightBytes:jr[0].size,totalBytes:jr.reduce((l,b)=>l+b.size,0),files:jr},
...$i,...Ji,...Object.fromEntries(Object.entries(Qi).map(([l,b])=>[l,{...b,status:"execution-candidate",capabilities:Lr}]))}),
In="3.8.1",_n=2048,je=1024**3;function Fn(l){const b=wi(l),S=b.model,F=Object.values(Hi).filter(h=>h.model.runtime==="ll\
ama.cpp"&&h.repository===(S==null?void 0:S.repository)&&h.revision===(S==null?void 0:S.revision)&&h.model.architecture===
(S==null?void 0:S.architecture)&&h.model.task===(S==null?void 0:S.task)&&h.model.dtype===(S==null?void 0:S.dtype)),T=F.length===
1?F[0]:void 0;if(!T||S.runtime!=="llama.cpp"||S.runtimeVersion!==void 0&&S.runtimeVersion!==In||T.model.runtimeVersion!==
void 0&&S.runtimeVersion!==T.model.runtimeVersion||S.dtype!==T.model.dtype||S.format!=="GGUF"||S.task!=="text-generation")
throw new Error("GGUF model revision is not in the trusted runtime catalog");const w=b.files.filter(h=>h.path.endsWith("\
.gguf")),v=T.files.filter(h=>h.path.endsWith(".gguf"));if(!w.length||w.length!==v.length||w.some(h=>!v.some(x=>x.path===
h.path&&x.size===h.size&&x.sha256===h.sha256)))throw new Error("GGUF weights do not match the pinned catalog digests");const q=b.
files.reduce((h,x)=>h+x.size,0);if(!Number.isSafeInteger(q)||q>16*je)throw new Error("GGUF package exceeds its byte budg\
et");const Q=w.reduce((h,x)=>h+x.size,0)>4*je;return{manifest:b,weights:w,totalBytes:q,resourcePolicy:{maxModelBytes:16*
je,minimumCpuBytes:Q?8*je:2*je,minimumGpuBytes:Q?16*je:2*je}}}function xn(l,b=(S=>(S=globalThis.location)==null?void 0:S.
href)()){const F=new URL(b);if(!l||Object.keys(l).some(w=>w!=="wasm")||typeof l.wasm!="string")throw new Error("GGUF run\
time needs one trusted WASM asset");const T=new URL(l.wasm,F);if(T.origin!==F.origin||!["http:","https:"].includes(T.protocol)||
T.username||T.password||T.search||T.hash||!T.pathname.endsWith(".wasm"))throw new Error("GGUF runtime WASM must be a fix\
ed same-origin asset");return{wasm:T.href}}function An(l={}){if(!l||typeof l!="object"||Array.isArray(l)||Object.keys(l).
some(S=>!["n_ctx","n_batch","n_gpu_layers","n_threads"].includes(S)))throw new Error("Unknown GGUF runtime option");const b={
n_ctx:_n,n_batch:64,n_gpu_layers:99999,n_threads:1,...l};if(!Number.isInteger(b.n_ctx)||b.n_ctx<64||b.n_ctx>_n||!Number.
isInteger(b.n_batch)||b.n_batch<1||b.n_batch>128||!Number.isInteger(b.n_gpu_layers)||b.n_gpu_layers<1||b.n_gpu_layers>99999||
b.n_threads!==1)throw new Error("GGUF options exceed the managed GPU runtime bounds");return Object.freeze(b)}async function Pi({
scope:l=globalThis,gpu:b=(S=>(S=l.navigator)==null?void 0:S.gpu)()}={}){var w,v,q;if(!l.crossOriginIsolated||!l.SharedArrayBuffer)
throw new Error("GGUF requires cross-origin isolation and SharedArrayBuffer");const F=l.WebAssembly;if(typeof(F==null?void 0:
F.Suspending)!="function"||typeof(F==null?void 0:F.promising)!="function")throw new Error("GGUF requires WebAssembly JSP\
I");try{new F.Memory({initial:0n,maximum:1n,shared:!0,address:"i64"})}catch{throw new Error("GGUF requires shared WebAss\
embly memory64")}const T=await(b==null?void 0:b.requestAdapter({powerPreference:"high-performance"}));if(!T||T.isFallbackAdapter||
(w=T.info)!=null&&w.isFallbackAdapter)throw new Error("GGUF requires a hardware WebGPU adapter");if(!T.features.has("sha\
der-f16"))throw new Error("GGUF requires hardware shader-f16; CPU fallback is disabled");return{adapter:{vendor:((v=T.info)==
null?void 0:v.vendor)??"",architecture:((q=T.info)==null?void 0:q.architecture)??"",isFallbackAdapter:!1,requiredFeatures:[
"shader-f16"]},sharedMemory:!0,memory64:!0,jspi:!0}}const Yi=Object.freeze({id:"llama.cpp",moduleUrl:"peercompute:gguf-i\
nference",validateManifest:Fn,validateRuntimeAssets:xn,validateRuntimeOptions:An,retainArtifactBridge:!0,terminateOnUnload:!0,
validateGenerationInput({image:l,maxNewTokens:b}){if(l)throw new Error("This GGUF adapter currently accepts text only");
if(!Number.isInteger(b)||b<1||b>Or.maxNewTokens)throw new Error("GGUF output exceeds its token budget")}}),hn=l=>new TextEncoder().
encode(l).byteLength;function Ki(){if(typeof WorkerGlobalScope>"u"||!(globalThis instanceof WorkerGlobalScope))throw new Error(
"GGUF inference requires a ComputeManager-owned worker")}function vn(l){var b,S,F,T,w,v,q,Q,h;return{sessionId:l.sessionId,
manifestCid:l.manifestCid,status:l.lost?"lost":l.status,runtime:"llama.cpp",runtimeVersion:In,task:"text-generation",workerId:l.
workerId,adapter:(b=l.capabilities)==null?void 0:b.adapter,runtimeAdapter:((S=l.engine)==null?void 0:S.evidence.runtimeAdapter)??
null,runtimeFeatures:((F=l.engine)==null?void 0:F.evidence.runtimeFeatures)??[],gpuDispatches:((T=l.engine)==null?void 0:
T.evidence.dispatches)??0,gpuSubmissions:((w=l.engine)==null?void 0:w.evidence.submissions)??0,gpuOffload:((v=l.engine)==
null?void 0:v.evidence.offload)??null,runtimeOptions:l.options,nativeBuffers:((q=l.engine)==null?void 0:q.evidence.buffers)??
[],wasmMemoryBytes:((Q=l.engine)==null?void 0:Q.memoryBytes())??0,generatedRequests:l.generatedRequests,artifactReads:((h=
l.reader)==null?void 0:h.getStats())??null}}function Xi({loadEngine:l=zi,createReader:b=yi,checkCapabilities:S=Pi,assertWorker:F=Ki,
baseUrl:T=(w=>(w=globalThis.location)==null?void 0:w.href)()}={}){let v;async function q(h,x){var ie,z,K;if(v)throw new Error(
"GGUF worker already has a resident model");const y=Fn(h.manifest),V=xn(h.runtimeAssets,T),E=An(h.runtimeOptions),G=ur(h.
sessionId);fe(x.signal);const D={sessionId:G,manifestCid:h.manifestCid,workerId:x.workerId??null,manifest:y.manifest,status:"\
loading",options:E,generatedRequests:0,residency:new AbortController,lost:!1};v=D;try{if(D.capabilities=await S(),fe(x.signal),
D.reader=b(h.artifactPort,{manifest:y.manifest,signal:D.residency.signal,maxReadBytes:kn,maxReads:1}),D.engine=await l({
wasmUrl:V.wasm,weights:y.weights,reader:D.reader,signal:x.signal,collectGpuEvidence:h.collectGpuEvidence===!0,onProgress:P=>{
var me;return(me=x.emitProgress)==null?void 0:me.call(x,{...P,sessionId:G})},onLost(){var P;D.lost=!0,(P=D.active)==null||
P.abort("GPU device lost")}}),fe(x.signal),!(await D.engine.action("load",{_name:"load_req",model_paths:D.engine.files.map(
P=>`models/${P.name}`),use_mmap:!1,use_mlock:!1,n_ctx_auto:!1,...E,n_ubatch:Math.min(64,E.n_batch),n_parallel:1,kv_unified:!0,
log_level:2,warmup:!1,ctx_shift:!1,cache_idle_slots:!1,reasoning:!1,jinja:!0},x.signal)).success)throw new Error("GGUF n\
ative model load failed");const ee=D.engine.evidence.offload;if(!ee||ee.gpuLayers<1||ee.gpuLayers!==Math.min(E.n_gpu_layers,
ee.totalLayers))throw new Error("GGUF did not honor the explicitly configured GPU layer offload");if(fe(x.signal),D.lost)
throw new Error("GPU device lost during GGUF load");return D.status="ready",vn(D)}catch(ne){throw D.engine&&((ie=x.emitProgress)==
null||ie.call(x,{type:"model-load-memory",sessionId:G,wasmMemoryBytes:D.engine.memoryBytes(),nativeBuffers:D.engine.evidence.
buffers??[]})),D.lost=!0,D.status="lost",D.residency.abort(ne),(z=D.reader)==null||z.close(ne),(K=D.engine)==null||K.close(),
ne}}async function Q(h,x){var Y,X,u,oe,de,xe,re,se,pe,A,C,Oe,he;const y=v;if(!y||y.sessionId!==ur(h.sessionId)||y.lost)throw new Error(
"Model session lost or not loaded");if(y.status!=="ready")throw new Error("GGUF model session is busy");const V=ur(h.requestId),
E=h.maxNewTokens??Or.maxNewTokens;Yi.validateGenerationInput({...h,maxNewTokens:E});const G=Ei(h),D=new AbortController,
ie=()=>{var O;return D.abort((O=x.signal)==null?void 0:O.reason)};(Y=x.signal)==null||Y.addEventListener("abort",ie,{once:!0}),
(X=x.signal)!=null&&X.aborted&&ie(),y.active=D,y.status="generating",y.requestId=V;const z=y.engine.evidence.dispatches,
K=y.engine.evidence.submissions;let ne,ee=!1,P="",me=0,ue=null,ce=null,_e="unknown";try{const O=await y.engine.action("c\
ompletion",{_name:"cmpl_req",is_chat:!0,data_json:JSON.stringify({messages:G,stream:!0,max_tokens:E,temperature:0,cache_prompt:!1,
chat_template_kwargs:{enable_thinking:!1}}),files:[]},D.signal);if(!O.success||!Number.isInteger(O.req_id))throw new Error(
"GGUF failed to start generation");ne=O.req_id,fe(D.signal);for(let k=0;k<4096;k+=1){fe(D.signal);const we=await y.engine.
action("get_result",{_name:"gres_req",req_id:ne},D.signal);if(fe(D.signal),!we.success||we.is_error)throw new Error("GGU\
F generation failed or exceeded the context budget; shorten the conversation or request fewer output tokens");if(we.data_json&&
we.data_json!=="null"){if(hn(we.data_json)>1024*1024)throw new Error("GGUF result exceeds its byte budget");const ye=JSON.
parse(we.data_json);for(const Ee of Array.isArray(ye)?ye:[ye]){const Qe=((oe=(u=Ee.choices)==null?void 0:u[0])==null?void 0:
oe.finish_reason)??Ee.finish_reason;Qe!=null&&(_e=["stop","length"].includes(Qe)?Qe:"unknown");const Ue=((re=(xe=(de=Ee.
choices)==null?void 0:de[0])==null?void 0:xe.delta)==null?void 0:re.content)??Ee.content??"";if(typeof Ue!="string")throw new Error(
"Invalid GGUF text chunk");if(P+=Ue,hn(P)>Or.maxOutputBytes)throw new Error("GGUF output exceeds its byte budget");if(Ue&&
((se=x.emitProgress)==null?void 0:se.call(x,{type:"token",sessionId:y.sessionId,requestId:V,sequence:me++,text:Ue}))===!1)
throw new Error("Token consumer rejected output");ue=((pe=Ee.usage)==null?void 0:pe.prompt_tokens)??((A=Ee.timings)==null?
void 0:A.prompt_n)??ue,ce=((C=Ee.usage)==null?void 0:C.completion_tokens)??((Oe=Ee.timings)==null?void 0:Oe.predicted_n)??
ce}}if(!we.has_more){ee=!0;break}await new Promise(ye=>setTimeout(ye,0))}if(!ee)throw new Error("GGUF result polling exc\
eeded its request budget");if(await y.engine.settleGpu(),fe(D.signal),y.lost)throw new Error("GPU device lost; model ses\
sion is unavailable");if(ce!==null&&(!Number.isSafeInteger(ce)||ce>E))throw new Error("GGUF returned an over-budget toke\
n sequence");return y.generatedRequests+=1,{sessionId:y.sessionId,requestId:V,text:P,inputTokens:ue,outputTokens:ce,finishReason:_e,
contextTruncated:!1,workerId:y.workerId,gpuDispatches:y.engine.evidence.dispatches-z,gpuSubmissions:y.engine.evidence.submissions-
K,gpuOffload:y.engine.evidence.offload,artifactReads:y.reader.getStats()}}catch(O){throw(O==null?void 0:O.name)==="Runti\
meError"?(y.lost=!0,new Error(`Model session lost: GGUF native trap: ${String(O.message).slice(0,300)}`)):(/Model session lost|GPU device lost/.
test(O.message??"")&&(y.lost=!0),O)}finally{(he=x.signal)==null||he.removeEventListener("abort",ie);try{!ee&&ne!==void 0&&
!y.lost&&await y.engine.action("cancel",{_name:"cncl_req",req_id:ne})}catch(O){throw y.lost=!0,new Error(`Model session \
lost during GGUF cancellation: ${O.message}`)}finally{y.active=null,y.requestId=null,y.status=y.lost?"lost":"ready"}}}return async(h={},x={})=>{
var V,E,G;if(F(),h.command==="load")return q(h,x);if(h.command==="generate")return Q(h,x);const y=ur(h.sessionId);if(h.command===
"status")return(v==null?void 0:v.sessionId)===y?vn(v):{sessionId:y,status:"absent"};if(!v||v.sessionId!==y)throw new Error(
"Model session lost or not loaded");if(h.command==="cancel")return v.requestId===h.requestId&&((V=v.active)==null||V.abort(
ki())),{sessionId:y,cancellationRequested:!0};if(h.command==="unload"){if(v.status==="generating")throw new Error("Cance\
l and await GGUF generation before unloading");return v.residency.abort("GGUF unload"),(E=v.reader)==null||E.close(),(G=
v.engine)==null||G.close(),v=null,{sessionId:y,status:"unloaded",requiresWorkerTermination:!0}}throw new Error("Unknown \
GGUF inference command")}}const Zi=Xi(),no=(l,b)=>Zi(l,b);export{Xi as createGgufTaskRuntime,no as handleModelTask};

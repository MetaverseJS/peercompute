import{az as it,aD as w,aA as A,aE as r,aH as M,aF as l,aB as Q}from"./carnageWindow-BBcEUL8m.js";import"./preload-helper-FD8EeCEm.js";
Q();var st=1024,_,W,b,g,k,E,H,u,G,q,C,x,j,O,D,z,V,I,J,P,S,T,at=class extends it{constructor(t,{debug:e=!1}={}){super(),w(
this,u),w(this,_),w(this,W),w(this,b,!0),w(this,g,[]),w(this,k,new Map),w(this,E,Promise.resolve()),w(this,H,!1),this.backend=
t,this.debug=e}async init(t,e){return this.pg=t,await this.backend.init(),{emscriptenOpts:{...e,preRun:[...e.preRun||[],
s=>{s.FS.mkdirTree(A),s.FS.mount(r(this,u,G).call(this,s),{},A)}]}}}async initialSyncFs(){let t=this.pg.Module.FS;M(this,
b,!1);try{for await(let e of this.backend.load()){let s=A+e.path;e.kind==="dir"?t.mkdir(s,448):(t.writeFile(s,e.data,{mode:384,
canOwn:!0}),e.mtime!==void 0&&t.utime(s,e.mtime,e.mtime))}}finally{M(this,b,!0)}}async syncToFs(t=!1){let e=l(this,E).then(
()=>r(this,u,V).call(this,t));M(this,E,e.catch(()=>{})),await e}async closeFs(){await this.syncToFs(),await this.backend.
close(),this.pg.Module.FS.quit()}};_=new WeakMap,W=new WeakMap,b=new WeakMap,g=new WeakMap,k=new WeakMap,E=new WeakMap,H=
new WeakMap,u=new WeakSet,G=function(t){let e=t.MEMFS;return{mount:s=>{let i=e.mount(s);return l(this,W)??M(this,W,r(this,
u,q).call(this,t,e.ops_table)),r(this,u,C).call(this,t,i),M(this,_,i),i},syncfs:(s,i,h)=>{h(null)}}},q=function(t,e){let s=t.
FS,i=e.dir.node,h=e.file.node,n=e.file.stream,y=(o,f)=>{h.setattr(o,f),f.size!==void 0&&s.isFile(o.mode)&&r(this,u,O).call(
this,o)};return{dir:{node:{...i,setattr:y,mknod:(o,f,d,a)=>{let c=i.mknod(o,f,d,a);return r(this,u,C).call(this,t,c),r(this,
u,z).call(this,t,c),c},rename:(o,f,d)=>{let a=r(this,u,S).call(this,t,o);i.rename(o,f,d),r(this,u,D).call(this,a),r(this,
u,z).call(this,t,o)},unlink:(o,f)=>{i.unlink(o,f),r(this,u,D).call(this,r(this,u,T).call(this,r(this,u,S).call(this,t,o),
f))},rmdir:(o,f)=>{i.rmdir(o,f),r(this,u,D).call(this,r(this,u,T).call(this,r(this,u,S).call(this,t,o),f))},symlink:(o,f,d)=>(l(
this,b)&&!l(this,H)&&(M(this,H,!0),console.warn("MEMFS frontend: symlinks are not persisted")),i.symlink(o,f,d))},stream:e.
dir.stream},file:{node:{...h,setattr:y},stream:{...n,write:(o,f,d,a,c,p)=>{let m=n.write(o,f,d,a,c,p);return r(this,u,j).
call(this,o.node,c,c+m),m},msync:(o,f,d,a,c)=>{let p=n.msync(o,f,d,a,c);return r(this,u,j).call(this,o.node,d,d+a),p},allocate:(o,f,d)=>{
n.allocate(o,f,d),r(this,u,O).call(this,o.node)}}}}},C=function(t,e){let s=t.FS;s.isDir(e.mode)?(e.node_ops=l(this,W).dir.
node,e.stream_ops=l(this,W).dir.stream):s.isFile(e.mode)&&(e.node_ops=l(this,W).file.node,e.stream_ops=l(this,W).file.stream)},
x=function(t){let e=l(this,k).get(t);return e||(e={full:!1,resized:!1,ranges:[]},l(this,k).set(t,e)),e},j=function(t,e,s){
if(!l(this,b)||s<=e)return;let i=r(this,u,x).call(this,t);if(i.full)return;let h=i.ranges,n=h[h.length-1];n&&e<=n[1]&&s>=
n[0]?(n[0]=Math.min(n[0],e),n[1]=Math.max(n[1],s)):(h.push([e,s]),h.length>st&&(i.ranges=R(h)))},O=function(t){l(this,b)&&
(r(this,u,x).call(this,t).resized=!0)},D=function(t){l(this,b)&&l(this,g).push({op:"remove",path:t})},z=function(t,e){if(!l(
this,b))return;let s=t.FS;if(s.isDir(e.mode)){l(this,g).push({op:"mkdir",node:e});for(let i of Object.values(e.contents))
r(this,u,z).call(this,t,i)}else if(s.isFile(e.mode)){let i=r(this,u,x).call(this,e);i.full=!0,i.ranges=[]}},V=async function(t){
if(l(this,g).length===0&&l(this,k).size===0)return;let e=r(this,u,I).call(this);try{await this.backend.apply(e.changes,{
relaxedDurability:t})}catch(s){throw r(this,u,J).call(this,e),s}if(this.debug){let{ops:s,files:i}=e.changes,h=i.wal.length+
i.data.length+i.control.length;console.log(`MEMFS frontend: flushed ${s.length} ops, ${h} files`)}},I=function(){let t=this.
pg.Module,e=t.FS,s=[];for(let n of l(this,g))n.op==="remove"?s.push(n):e.isDir(n.node.mode)&&r(this,u,P).call(this,n.node)&&
s.push({op:"mkdir",path:r(this,u,S).call(this,t,n.node)});let i={wal:[],data:[],control:[]};for(let[n,y]of l(this,k)){if(!e.
isFile(n.mode)||!r(this,u,P).call(this,n))continue;let o=n.usedBytes,f=y.full?[[0,o]]:R(y.ranges),d=[];for(let[c,p]of f){
let m=Math.min(p,o);c>=m||d.push({at:c,data:lt(n.contents,c,m)})}let a=r(this,u,S).call(this,t,n);(a.startsWith("/pg_wal\
/")?i.wal:a==="/global/pg_control"?i.control:i.data).push({path:a,size:o,full:y.full,truncate:y.full||y.resized,chunks:d})}
let h={changes:{ops:s,files:i},journal:l(this,g),dirty:l(this,k)};return M(this,g,[]),M(this,k,new Map),h},J=function(t){
M(this,g,[...t.journal,...l(this,g)]);for(let[e,s]of t.dirty){let i=l(this,k).get(e);i?(i.full||(i.full=s.full),i.resized||
(i.resized=s.resized),i.ranges=i.full?[]:R([...s.ranges,...i.ranges])):l(this,k).set(e,s)}},P=function(t){for(;t.parent!==
t;){if(t.parent.contents?.[t.name]!==t)return!1;t=t.parent}return t===l(this,_)},S=function(t,e){return t.FS.getPath(e).
slice(A.length)},T=function(t,e){return`${t}/${e}`};function R(t){let e=[...t].sort((i,h)=>i[0]-h[0]),s=[];for(let[i,h]of e){
let n=s[s.length-1];n&&i<=n[1]?n[1]=Math.max(n[1],h):s.push([i,h])}return s}function lt(t,e,s){return t?new Uint8Array(t.
subarray?t.subarray(e,s):t.slice(e,s)):new Uint8Array(s-e)}Q();var nt=2,rt=/^\/pg_wal\/[0-9A-F]{24}$/,v,F,$,X,B,Y,ht=class{constructor(t,{
maxConcurrentWrites:e=16}={}){w(this,$),w(this,v),w(this,F,new Map),this.dataDir=t,this.maxConcurrentWrites=e}async init(){
M(this,v,await r(this,$,Y).call(this,this.dataDir,{from:await navigator.storage.getDirectory(),create:!0}))}load(){return Z(
l(this,v),"")}async apply(t,{relaxedDurability:e}){let s=new Map,i=a=>{let c=a.join("/"),p=s.get(c);if(!p){let m=a.length?
i(a.slice(0,-1)).then(et=>et.getDirectoryHandle(a[a.length-1],{create:!0})):Promise.resolve(l(this,v));s.set(c,m),m.catch(
()=>s.delete(c)),p=m}return p};for(let a of t.ops){let c=U(a.path);if(a.op==="mkdir"){await i(c);continue}r(this,$,B).call(
this,a.path);let p=c.join("/");for(let m of[...s.keys()])(m===p||m.startsWith(p+"/"))&&s.delete(m);try{await(await i(c.slice(
0,-1))).removeEntry(c[c.length-1],{recursive:!0})}catch(m){if(m?.name!=="NotFoundError")throw m}}let h=async a=>{let c=U(
a);return(await i(c.slice(0,-1))).getFileHandle(c[c.length-1],{create:!0})},n=async a=>{await K(await h(a.path),a,e)},y=async a=>{
if(!rt.test(a.path))return n(a);let c=l(this,F).get(a.path);if(!c){let p=await h(a.path);if(!("createSyncAccessHandle"in
p))return K(p,a,e);c=await p.createSyncAccessHandle()}l(this,F).delete(a.path),l(this,F).set(a.path,c);try{tt(c,a,e)}catch(p){
throw r(this,$,B).call(this,a.path),p}},{wal:o,data:f,control:d}=t.files;await N(o,this.maxConcurrentWrites,y),r(this,$,
X).call(this);for(let a of[f,d])await N(a,this.maxConcurrentWrites,n)}async close(){r(this,$,B).call(this)}};v=new WeakMap,
F=new WeakMap,$=new WeakSet,X=function(){for(let[t,e]of l(this,F)){if(l(this,F).size<=nt)break;l(this,F).delete(t),L(e)}},
B=function(t){for(let[e,s]of l(this,F))t&&e!==t&&!e.startsWith(t+"/")||(l(this,F).delete(e),L(s))},Y=async function(t,e){
let s=e.from;for(let i of U(t))s=await s.getDirectoryHandle(i,{create:e.create});return s};var ut=class extends at{constructor(t,e={}){
super(new ht(t,e),{debug:e.debug}),this.dataDir=t}};async function*Z(t,e){for await(let[s,i]of t.entries()){let h=`${e}/${s}`;
if(i.kind==="directory")yield{kind:"dir",path:h},yield*Z(i,h);else{let n=await i.getFile();yield{kind:"file",path:h,data:new Uint8Array(
await n.arrayBuffer()),mtime:n.lastModified}}}}function U(t){return t.split("/").filter(Boolean)}async function K(t,e,s){
if("createSyncAccessHandle"in t){let i=await t.createSyncAccessHandle();try{tt(i,e,s)}finally{i.close()}}else{let i=await t.
createWritable({keepExistingData:!e.full});try{e.truncate&&!e.full&&await i.truncate(e.size);for(let h of e.chunks)await i.
write({type:"write",position:h.at,data:h.data});await i.close()}catch(h){throw await i.abort().catch(()=>{}),h}}}function tt(t,e,s){
e.truncate&&t.truncate(e.size);for(let i of e.chunks)t.write(i.data,{at:i.at});s||t.flush()}function L(t){try{t.close()}catch{}}
async function N(t,e,s){let i=0,h=async()=>{for(;i<t.length;)await s(t[i++])};await Promise.all(Array.from({length:Math.
min(e,t.length)},h))}export{ut as Memfs2OpfsFS,ht as OpfsBackend};

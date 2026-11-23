import{aC as R,aD as m,aE as h,aF as a,aG as H,aB as C,aH as P,aI as $}from"./carnageWindow-Ta-Zfo9P.js";import"./preload-helper-FD8EeCEm.js";
C();var v="state.txt",B="data",x={DIR:16384,FILE:32768},D,I,O,T,y,w,_,b,k,S,l,A,E,N,g,f,M,W,j,U=class extends R{constructor(t,{
initialPoolSize:e=1e3,maintainedPoolSize:s=100,debug:i=!1}={}){super(t,{debug:i}),m(this,l),m(this,D),m(this,I),m(this,O),
m(this,T),m(this,y),m(this,w,new Map),m(this,_,0),m(this,b,new Map),m(this,k,new Map),this.lastCheckpoint=0,this.checkpointInterval=
1e3*60,this.poolCounter=0,m(this,S,new Set),this.initialPoolSize=e,this.maintainedPoolSize=s}async init(t,e){return await h(
this,l,A).call(this),super.init(t,e)}async syncToFs(t=!1){await this.maybeCheckpointState(),await this.maintainPool(),t||
this.flush()}async closeFs(){for(let t of a(this,w).values())t.sh.close();a(this,y).flush(),a(this,y).close(),this.pg.Module.
FS.quit()}async maintainPool(t){t=t||this.maintainedPoolSize;let e=t-this.state.pool.length,s=[];for(let i=0;i<e;i++)s.push(
new Promise(async o=>{++this.poolCounter;let r=`${(Date.now()-1704063600).toString(16).padStart(8,"0")}-${this.poolCounter.
toString(16).padStart(8,"0")}`,c=await a(this,O).getFileHandle(r,{create:!0}),d=await c.createSyncAccessHandle();a(this,
w).set(r,{fh:c,sh:d}),h(this,l,N).call(this,{opp:"createPoolFile",args:[r]}),this.state.pool.push(r),o()}));for(let i=0;i>
e;i--)s.push(new Promise(async o=>{let r=this.state.pool.pop();h(this,l,N).call(this,{opp:"deletePoolFile",args:[r]});let c=a(
this,w).get(r);c?.sh?.close(),await a(this,O).removeEntry(c.fh.name),a(this,w).delete(r),o()}));await Promise.all(s)}_createPoolFileState(t){
this.state.pool.push(t)}_deletePoolFileState(t){let e=this.state.pool.indexOf(t);e>-1&&this.state.pool.splice(e,1)}async maybeCheckpointState(){
Date.now()-this.lastCheckpoint>this.checkpointInterval&&await this.checkpointState()}async checkpointState(){let t=new TextEncoder().
encode(JSON.stringify(this.state));a(this,y).truncate(0),a(this,y).write(t,{at:0}),a(this,y).flush(),this.lastCheckpoint=
Date.now()}flush(){for(let t of a(this,S))try{t.flush()}catch{}a(this,S).clear()}chmod(t,e){h(this,l,E).call(this,{opp:"\
chmod",args:[t,e]},()=>{this._chmodState(t,e)})}_chmodState(t,e){let s=h(this,l,f).call(this,t);s.mode=e}close(t){let e=h(
this,l,M).call(this,t);a(this,b).delete(t),a(this,k).delete(e)}fstat(t){let e=h(this,l,M).call(this,t);return this.lstat(
e)}lstat(t){let e=h(this,l,f).call(this,t),s=e.type==="file"?a(this,w).get(e.backingFilename).sh.getSize():0,i=4096;return{
dev:0,ino:0,mode:e.mode,nlink:1,uid:0,gid:0,rdev:0,size:s,blksize:i,blocks:Math.ceil(s/i),atime:e.lastModified,mtime:e.lastModified,
ctime:e.lastModified}}mkdir(t,e){h(this,l,E).call(this,{opp:"mkdir",args:[t,e]},()=>{this._mkdirState(t,e)})}_mkdirState(t,e){
let s=h(this,l,g).call(this,t),i=s.pop(),o=[],r=this.state.root;for(let d of s){if(o.push(t),!Object.prototype.hasOwnProperty.
call(r.children,d))if(e?.recursive)this.mkdir(o.join("/"));else throw new p("ENOENT","No such file or directory");if(r.children[d].
type!=="directory")throw new p("ENOTDIR","Not a directory");r=r.children[d]}if(Object.prototype.hasOwnProperty.call(r.children,
i))throw new p("EEXIST","File exists");let c={type:"directory",lastModified:Date.now(),mode:e?.mode||x.DIR,children:{}};
r.children[i]=c}open(t,e,s){if(h(this,l,f).call(this,t).type!=="file")throw new p("EISDIR","Is a directory");let i=h(this,
l,W).call(this);return a(this,b).set(i,t),a(this,k).set(t,i),i}readdir(t){let e=h(this,l,f).call(this,t);if(e.type!=="di\
rectory")throw new p("ENOTDIR","Not a directory");return Object.keys(e.children)}read(t,e,s,i,o){let r=h(this,l,M).call(
this,t),c=h(this,l,f).call(this,r);if(c.type!=="file")throw new p("EISDIR","Is a directory");return a(this,w).get(c.backingFilename).
sh.read(new Uint8Array(e.buffer,s,i),{at:o})}rename(t,e){h(this,l,E).call(this,{opp:"rename",args:[t,e]},()=>{this._renameState(
t,e,!0)})}_renameState(t,e,s=!1){let i=h(this,l,g).call(this,t),o=i.pop(),r=h(this,l,f).call(this,i.join("/"));if(!Object.
prototype.hasOwnProperty.call(r.children,o))throw new p("ENOENT","No such file or directory");let c=h(this,l,g).call(this,
e),d=c.pop(),n=h(this,l,f).call(this,c.join("/"));if(s&&Object.prototype.hasOwnProperty.call(n.children,d)){let u=n.children[d];
a(this,w).get(u.backingFilename).sh.truncate(0),this.state.pool.push(u.backingFilename)}n.children[d]=r.children[o],delete r.
children[o]}rmdir(t){h(this,l,E).call(this,{opp:"rmdir",args:[t]},()=>{this._rmdirState(t)})}_rmdirState(t){let e=h(this,
l,g).call(this,t),s=e.pop(),i=h(this,l,f).call(this,e.join("/"));if(!Object.prototype.hasOwnProperty.call(i.children,s))
throw new p("ENOENT","No such file or directory");let o=i.children[s];if(o.type!=="directory")throw new p("ENOTDIR","Not\
 a directory");if(Object.keys(o.children).length>0)throw new p("ENOTEMPTY","Directory not empty");delete i.children[s]}truncate(t,e=0){
let s=h(this,l,f).call(this,t);if(s.type!=="file")throw new p("EISDIR","Is a directory");let i=a(this,w).get(s.backingFilename)?.
sh;if(!i)throw new p("ENOENT","No such file or directory");i.truncate(e),a(this,S).add(i)}unlink(t){h(this,l,E).call(this,
{opp:"unlink",args:[t]},()=>{this._unlinkState(t,!0)})}_unlinkState(t,e=!1){let s=h(this,l,g).call(this,t),i=s.pop(),o=h(
this,l,f).call(this,s.join("/"));if(!Object.prototype.hasOwnProperty.call(o.children,i))throw new p("ENOENT","No such fi\
le or directory");let r=o.children[i];if(r.type!=="file")throw new p("EISDIR","Is a directory");if(delete o.children[i],
e){let c=a(this,w).get(r.backingFilename).sh;c?.truncate(0),a(this,S).add(c),a(this,k).has(t)&&(a(this,b).delete(a(this,
k).get(t)),a(this,k).delete(t))}this.state.pool.push(r.backingFilename)}utimes(t,e,s){h(this,l,E).call(this,{opp:"utimes",
args:[t,e,s]},()=>{this._utimesState(t,e,s)})}_utimesState(t,e,s){let i=h(this,l,f).call(this,t);i.lastModified=s}writeFile(t,e,s){
let i=h(this,l,g).call(this,t),o=i.pop(),r=h(this,l,f).call(this,i.join("/"));if(Object.prototype.hasOwnProperty.call(r.
children,o)){let n=r.children[o];n.lastModified=Date.now(),h(this,l,N).call(this,{opp:"setLastModified",args:[t,n.lastModified]})}else{
if(this.state.pool.length===0)throw new Error("No more file handles available in the pool");let n={type:"file",lastModified:Date.
now(),mode:s?.mode||x.FILE,backingFilename:this.state.pool.pop()};r.children[o]=n,h(this,l,N).call(this,{opp:"createFile\
Node",args:[t,n]})}let c=r.children[o],d=a(this,w).get(c.backingFilename).sh;e.length>0&&(d.write(typeof e=="string"?new TextEncoder().
encode(e):new Uint8Array(e),{at:0}),t.startsWith("/pg_wal")&&a(this,S).add(d))}_createFileNodeState(t,e){let s=h(this,l,
g).call(this,t),i=s.pop(),o=h(this,l,f).call(this,s.join("/"));o.children[i]=e;let r=this.state.pool.indexOf(e.backingFilename);
return r>-1&&this.state.pool.splice(r,1),e}_setLastModifiedState(t,e){let s=h(this,l,f).call(this,t);s.lastModified=e}write(t,e,s,i,o){
let r=h(this,l,M).call(this,t),c=h(this,l,f).call(this,r);if(c.type!=="file")throw new p("EISDIR","Is a directory");let d=a(
this,w).get(c.backingFilename)?.sh;if(!d)throw new p("EBADF","Bad file descriptor");let n=d.write(new Uint8Array(e,s,i),
{at:o});return r.startsWith("/pg_wal")&&a(this,S).add(d),n}};D=new WeakMap,I=new WeakMap,O=new WeakMap,T=new WeakMap,y=new WeakMap,
w=new WeakMap,_=new WeakMap,b=new WeakMap,k=new WeakMap,S=new WeakMap,l=new WeakSet,A=async function(){P(this,D,await navigator.
storage.getDirectory()),P(this,I,await h(this,l,j).call(this,this.dataDir,{create:!0})),P(this,O,await h(this,l,j).call(
this,B,{from:a(this,I),create:!0})),P(this,T,await a(this,I).getFileHandle(v,{create:!0})),P(this,y,await a(this,T).createSyncAccessHandle());
let t=new ArrayBuffer(a(this,y).getSize());a(this,y).read(t,{at:0});let e,s=new TextDecoder().decode(t).split(`
`),i=!1;try{e=JSON.parse(s[0])}catch{e={root:{type:"directory",lastModified:Date.now(),mode:x.DIR,children:{}},pool:[]},
a(this,y).truncate(0),a(this,y).write(new TextEncoder().encode(JSON.stringify(e)),{at:0}),i=!0}this.state=e;let o=s.slice(
1).filter(Boolean).map(n=>JSON.parse(n));for(let n of o){let u=`_${n.opp}State`;if(typeof this[u]=="function")try{this[u].
bind(this)(...n.args)}catch(F){console.warn("Error applying OPFS AHP WAL entry",n,F)}}let r=[],c=async n=>{if(n.type==="\
file")try{let u=await a(this,O).getFileHandle(n.backingFilename),F=await u.createSyncAccessHandle();a(this,w).set(n.backingFilename,
{sh:F,fh:u})}catch(u){console.error("Error opening file handle for node",n,u)}else for(let u of Object.values(n.children))
r.push(c(u))};await c(this.state.root);let d=[];for(let n of this.state.pool)d.push(new Promise(async u=>{a(this,w).has(
n)&&console.warn("File handle already exists for pool file",n);let F=await a(this,O).getFileHandle(n),z=await F.createSyncAccessHandle();
a(this,w).set(n,{fh:F,sh:z}),u()}));await Promise.all([...r,...d]),await this.maintainPool(i?this.initialPoolSize:this.maintainedPoolSize)},
E=function(t,e){let s=h(this,l,N).call(this,t);try{e()}catch(i){throw a(this,y).truncate(s),i}},N=function(t){let e=JSON.
stringify(t),s=new TextEncoder().encode(`
${e}`),i=a(this,y).getSize();return a(this,y).write(s,{at:i}),a(this,S).add(a(this,y)),i},g=function(t){return t.split("\
/").filter(Boolean)},f=function(t,e){let s=h(this,l,g).call(this,t),i=e||this.state.root;for(let o of s){if(i.type!=="di\
rectory")throw new p("ENOTDIR","Not a directory");if(!Object.prototype.hasOwnProperty.call(i.children,o))throw new p("EN\
OENT","No such file or directory");i=i.children[o]}return i},M=function(t){let e=a(this,b).get(t);if(!e)throw new p("EBA\
DF","Bad file descriptor");return e},W=function(){let t=++$(this,_)._;for(;a(this,b).has(t);)$(this,_)._++;return t},j=async function(t,e){
let s=h(this,l,g).call(this,t),i=e?.from||a(this,D);for(let o of s)i=await i.getDirectoryHandle(o,{create:e?.create});return i};
var p=class extends Error{constructor(t,e){super(e),typeof t=="number"?this.code=t:typeof t=="string"&&(this.code=H[t])}};export{U as OpfsAhpFS};

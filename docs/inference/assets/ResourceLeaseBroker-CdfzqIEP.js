const k="peercompute.service.resource-lease.v0",x="peercompute.service.resource-pressure.v0";let g=1;const w=Object.freeze(
{background:10,compute:50,interactive:75,render:100,critical:1e3});function $(i="resource-lease"){const e=g;return g+=1,
`${i}-${Date.now().toString(36)}-${e.toString(36)}`}function a(i){return i==null?i:JSON.parse(JSON.stringify(i))}function d(i,e,r=1,t=Number.
MAX_SAFE_INTEGER){const s=Math.floor(Number(i));return Number.isFinite(s)?Math.min(t,Math.max(r,s)):e}function A(i,e,r=Number.
MAX_SAFE_INTEGER){const t=Math.floor(Number(i));return Number.isFinite(t)?Math.min(r,Math.max(0,t)):e}function m(i){return String(
i||"gpu").trim().toLowerCase()||"gpu"}function I(i){if(i==null)return 0;if(!Number.isSafeInteger(i)||i<=0)throw new TypeError(
"Memory budgets must be positive safe integers or null");return i}function q(i){const e=String(i||"compute").trim().toLowerCase();
return Object.hasOwn(w,e)?e:"compute"}function S(i,e){const r=Number(e);return Number.isFinite(r)?r:w[i]??w.compute}function M(i,e={}){
const r=d(e.units??e.count,i==="gpu"?1:0,0);return{kind:i,units:r,memoryBytes:A(e.memoryBytes,0),deviceIds:Array.isArray(
e.deviceIds)?e.deviceIds.map(t=>String(t||"").trim()).filter(Boolean):[],metadata:a(e.metadata||{})}}function C(i={}){const e=new Map;
for(const[r,t]of Object.entries(i))e.set(m(r),M(m(r),t));return e.has("gpu")||e.set("gpu",M("gpu",{units:1})),e}class N{constructor({
capacities:e={gpu:{units:1}},defaultTtlMs:r=3e4,now:t=()=>Date.now()}={}){this.pools=C(e),this.defaultTtlMs=d(r,3e4),this.
now=t,this.leases=new Map,this.quarantined=new Map,this.preemptionCount=0}setMemoryBudgets(e){if(!e||typeof e!="object"||
Array.isArray(e)||![Object.prototype,null].includes(Object.getPrototypeOf(e)))throw new TypeError("Invalid resource memo\
ry budgets");const r=Object.entries(e).map(([t,s])=>{const n=this.pools.get(t);if(!n)throw new Error(`No resource pool c\
onfigured for ${t}`);return[n,I(s)]});for(const[t,s]of r)t.memoryBytes=s;return Object.fromEntries(r.map(([t])=>[t.kind,
t.memoryBytes||null]))}async requestLease(e={}){if(this.expireLeases(),e.leaseId&&this.leases.has(e.leaseId))throw new Error(
"Resource lease ID already exists");const r=e.lifetime??"ttl";if(!["ttl","owner"].includes(r))throw new Error("Invalid r\
esource lease lifetime");if(r==="owner"&&(e.resident!==!0||e.preemptable!==!1||e.ttlMs!=null||e.expiresAt!=null))throw new Error(
"Owner lifetime requires a non-preemptable resident allocation without a TTL");const t=m(e.resourceKind||e.kind||e.type),
s=this.pools.get(t);if(!s||s.units<=0)throw new Error(`No resource capacity configured for ${t}`);const n=e.deviceId?String(
e.deviceId):null;if(n&&s.deviceIds.length>0&&!s.deviceIds.includes(n))throw new Error(`Resource device is not in the ${t}\
 pool: ${n}`);if(this.quarantined.has(`${t}:*`)||n&&this.quarantined.has(`${t}:${n}`))throw new Error(`Resource ${n||t} \
is quarantined for ${t}`);const o=q(e.priorityClass),l=S(o,e.priority),u=d(e.units??e.count,1,1,s.units),f=A(e.memoryBytes,
0),B=I(e.memoryBudgetBytes),h=Math.min(s.memoryBytes||1/0,B||1/0),y=this.#t(t);if(f>0&&y+f>h){const c=E=>Number((E/1073741824).
toFixed(3));throw Object.assign(new Error(`Resource memory quota exceeded for ${t}: ${c(y)} GiB estimated reserved + ${c(
f)} GiB requested exceeds the configured ${c(h)} GiB budget`),{code:"ERR_RESOURCE_MEMORY_BUDGET",resourceKind:t,reservedBytes:y,
requestedBytes:f,budgetBytes:h,brokerBytes:s.memoryBytes||null,policyBytes:B||null})}const b=this.#e(t);if(b+u>s.units){
const c=b+u-s.units;if(this.#n(t,l,c)<c)throw new Error(`Resource quota exceeded for ${t}`)}const p=this.now(),R=d(e.ttlMs,
this.defaultTtlMs),v={schema:k,leaseId:e.leaseId||$(),resourceKind:t,rootTaskId:e.rootTaskId||null,serviceId:e.serviceId||
null,taskId:e.taskId||null,priorityClass:o,priority:l,units:u,memoryBytes:f,deviceId:n,preemptable:e.preemptable!==!1,resident:e.
resident===!0,lifetime:r,createdAt:p,expiresAt:r==="owner"?null:d(e.expiresAt,p+R,p),status:"active",metadata:a(e.metadata||
{})};return this.leases.set(v.leaseId,v),a(v)}async releaseLease(e){return this.#r(e,"released","releasedAt")}async renewLease(e,{
ttlMs:r=this.defaultTtlMs}={}){this.expireLeases();const t=this.leases.get(e);if(!t||t.status!=="active")throw new Error(
"Resource lease is no longer active");return t.lifetime!=="owner"&&(t.expiresAt=this.now()+d(r,this.defaultTtlMs)),a(t)}async revokeLease(e){
return this.#r(e,"revoked","revokedAt")}async revokeByRootTask(e){const r=[];for(const t of this.leases.values())t.rootTaskId===
e&&t.status==="active"&&(t.status="revoked",t.revokedAt=this.now(),r.push(a(t)));return r}expireLeases(e=this.now()){const r=[];
for(const t of this.leases.values())t.status==="active"&&t.lifetime!=="owner"&&t.expiresAt<=e&&(t.status="expired",t.expiredAt=
e,r.push(a(t)));return r}quarantineResource({resourceKind:e="gpu",deviceId:r=null,reason:t="device-lost",retryable:s=!0}={}){
const n=m(e),o=`${n}:${r||"*"}`,l={resourceKind:n,deviceId:r,reason:t,retryable:!!s,quarantinedAt:this.now()};this.quarantined.
set(o,l);for(const u of this.leases.values())u.status==="active"&&u.resourceKind===n&&(r==null||u.deviceId===r)&&(u.status=
"quarantined",u.quarantinedAt=l.quarantinedAt,u.quarantineReason=t,u.retryable=!!s);return a(l)}clearQuarantine({resourceKind:e="\
gpu",deviceId:r=null}={}){return this.quarantined.delete(`${m(e)}:${r||"*"}`)}get(e){const r=this.leases.get(e);return r?
a(r):void 0}list({status:e=null,rootTaskId:r=null,resourceKind:t=null}={}){const s=t==null?null:m(t);return[...this.leases.
values()].filter(n=>e==null||n.status===e).filter(n=>r==null||n.rootTaskId===r).filter(n=>s==null||n.resourceKind===s).map(
n=>a(n))}reportPressure(){const e={};for(const[t,s]of this.pools.entries()){const n=this.#e(t),o=this.#t(t);e[t]={units:s.
units,activeUnits:n,availableUnits:Math.max(0,s.units-n),pressure:s.units>0?n/s.units:0,memoryBytes:s.memoryBytes,activeMemoryBytes:o,
availableMemoryBytes:s.memoryBytes>0?Math.max(0,s.memoryBytes-o):null,deviceIds:[...s.deviceIds],metadata:a(s.metadata)}}
const r={};for(const t of this.leases.values())r[t.status]=(r[t.status]||0)+1;return{schema:x,pools:e,leaseCounts:r,activeLeaseCount:r.
active||0,preemptionCount:this.preemptionCount,quarantined:[...this.quarantined.values()].map(t=>a(t)),leases:this.list()}}#e(e){
return[...this.leases.values()].filter(r=>this.#s(r)&&r.resourceKind===e).reduce((r,t)=>r+t.units,0)}#t(e){return[...this.
leases.values()].filter(r=>this.#s(r)&&r.resourceKind===e).reduce((r,t)=>r+t.memoryBytes,0)}#n(e,r,t){let s=0;const n=[...this.
leases.values()].filter(o=>o.status==="active"&&o.resourceKind===e&&o.preemptable&&!o.resident&&o.priority<r).sort((o,l)=>o.
priority-l.priority||o.createdAt-l.createdAt);for(const o of n)if(o.status="preempted",o.preemptedAt=this.now(),o.preemptedByPriority=
r,s+=o.units,this.preemptionCount+=1,s>=t)break;return s}#r(e,r,t){const s=this.leases.get(e);if(s)return(s.status==="ac\
tive"||s.resident&&r==="released"&&s.status!=="released")&&(s.status=r,s[t]=this.now()),a(s)}#s(e){return e.status==="ac\
tive"||e.resident&&e.status!=="released"}}export{k as RESOURCE_LEASE_SCHEMA,x as RESOURCE_PRESSURE_SCHEMA,N as ResourceLeaseBroker};

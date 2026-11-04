const M="peercompute.service.resource-lease.v0",b="peercompute.service.resource-pressure.v0";let w=1;const p=Object.freeze(
{background:10,compute:50,interactive:75,render:100,critical:1e3});function g(n="resource-lease"){const e=w;return w+=1,
`${n}-${Date.now().toString(36)}-${e.toString(36)}`}function a(n){return n==null?n:JSON.parse(JSON.stringify(n))}function c(n,e,r=1,t=Number.
MAX_SAFE_INTEGER){const s=Math.floor(Number(n));return Number.isFinite(s)?Math.min(t,Math.max(r,s)):e}function A(n,e,r=Number.
MAX_SAFE_INTEGER){const t=Math.floor(Number(n));return Number.isFinite(t)?Math.min(r,Math.max(0,t)):e}function d(n){return String(
n||"gpu").trim().toLowerCase()||"gpu"}function k(n){const e=String(n||"compute").trim().toLowerCase();return Object.hasOwn(
p,e)?e:"compute"}function R(n,e){const r=Number(e);return Number.isFinite(r)?r:p[n]??p.compute}function I(n,e={}){const r=c(
e.units??e.count,n==="gpu"?1:0,0);return{kind:n,units:r,memoryBytes:A(e.memoryBytes,0),deviceIds:Array.isArray(e.deviceIds)?
e.deviceIds.map(t=>String(t||"").trim()).filter(Boolean):[],metadata:a(e.metadata||{})}}function x(n={}){const e=new Map;
for(const[r,t]of Object.entries(n))e.set(d(r),I(d(r),t));return e.has("gpu")||e.set("gpu",I("gpu",{units:1})),e}class q{constructor({
capacities:e={gpu:{units:1}},defaultTtlMs:r=3e4,now:t=()=>Date.now()}={}){this.pools=x(e),this.defaultTtlMs=c(r,3e4),this.
now=t,this.leases=new Map,this.quarantined=new Map,this.preemptionCount=0}async requestLease(e={}){if(this.expireLeases(),
e.leaseId&&this.leases.has(e.leaseId))throw new Error("Resource lease ID already exists");const r=e.lifetime??"ttl";if(![
"ttl","owner"].includes(r))throw new Error("Invalid resource lease lifetime");if(r==="owner"&&(e.resident!==!0||e.preemptable!==
!1||e.ttlMs!=null||e.expiresAt!=null))throw new Error("Owner lifetime requires a non-preemptable resident allocation wit\
hout a TTL");const t=d(e.resourceKind||e.kind||e.type),s=this.pools.get(t);if(!s||s.units<=0)throw new Error(`No resourc\
e capacity configured for ${t}`);const i=e.deviceId?String(e.deviceId):null;if(i&&s.deviceIds.length>0&&!s.deviceIds.includes(
i))throw new Error(`Resource device is not in the ${t} pool: ${i}`);if(this.quarantined.has(`${t}:*`)||i&&this.quarantined.
has(`${t}:${i}`))throw new Error(`Resource ${i||t} is quarantined for ${t}`);const o=k(e.priorityClass),l=R(o,e.priority),
u=c(e.units??e.count,1,1,s.units),m=A(e.memoryBytes,0);if(m>0&&s.memoryBytes>0&&this.#t(t)+m>s.memoryBytes)throw new Error(
`Resource memory quota exceeded for ${t}`);const y=this.#e(t);if(y+u>s.units){const v=y+u-s.units;if(this.#i(t,l,v)<v)throw new Error(
`Resource quota exceeded for ${t}`)}const h=this.now(),E=c(e.ttlMs,this.defaultTtlMs),f={schema:M,leaseId:e.leaseId||g(),
resourceKind:t,rootTaskId:e.rootTaskId||null,serviceId:e.serviceId||null,taskId:e.taskId||null,priorityClass:o,priority:l,
units:u,memoryBytes:m,deviceId:i,preemptable:e.preemptable!==!1,resident:e.resident===!0,lifetime:r,createdAt:h,expiresAt:r===
"owner"?null:c(e.expiresAt,h+E,h),status:"active",metadata:a(e.metadata||{})};return this.leases.set(f.leaseId,f),a(f)}async releaseLease(e){
return this.#r(e,"released","releasedAt")}async renewLease(e,{ttlMs:r=this.defaultTtlMs}={}){this.expireLeases();const t=this.
leases.get(e);if(!t||t.status!=="active")throw new Error("Resource lease is no longer active");return t.lifetime!=="owne\
r"&&(t.expiresAt=this.now()+c(r,this.defaultTtlMs)),a(t)}async revokeLease(e){return this.#r(e,"revoked","revokedAt")}async revokeByRootTask(e){
const r=[];for(const t of this.leases.values())t.rootTaskId===e&&t.status==="active"&&(t.status="revoked",t.revokedAt=this.
now(),r.push(a(t)));return r}expireLeases(e=this.now()){const r=[];for(const t of this.leases.values())t.status==="activ\
e"&&t.lifetime!=="owner"&&t.expiresAt<=e&&(t.status="expired",t.expiredAt=e,r.push(a(t)));return r}quarantineResource({resourceKind:e="\
gpu",deviceId:r=null,reason:t="device-lost",retryable:s=!0}={}){const i=d(e),o=`${i}:${r||"*"}`,l={resourceKind:i,deviceId:r,
reason:t,retryable:!!s,quarantinedAt:this.now()};this.quarantined.set(o,l);for(const u of this.leases.values())u.status===
"active"&&u.resourceKind===i&&(r==null||u.deviceId===r)&&(u.status="quarantined",u.quarantinedAt=l.quarantinedAt,u.quarantineReason=
t,u.retryable=!!s);return a(l)}clearQuarantine({resourceKind:e="gpu",deviceId:r=null}={}){return this.quarantined.delete(
`${d(e)}:${r||"*"}`)}get(e){const r=this.leases.get(e);return r?a(r):void 0}list({status:e=null,rootTaskId:r=null,resourceKind:t=null}={}){
const s=t==null?null:d(t);return[...this.leases.values()].filter(i=>e==null||i.status===e).filter(i=>r==null||i.rootTaskId===
r).filter(i=>s==null||i.resourceKind===s).map(i=>a(i))}reportPressure(){const e={};for(const[t,s]of this.pools.entries()){
const i=this.#e(t),o=this.#t(t);e[t]={units:s.units,activeUnits:i,availableUnits:Math.max(0,s.units-i),pressure:s.units>
0?i/s.units:0,memoryBytes:s.memoryBytes,activeMemoryBytes:o,availableMemoryBytes:s.memoryBytes>0?Math.max(0,s.memoryBytes-
o):null,deviceIds:[...s.deviceIds],metadata:a(s.metadata)}}const r={};for(const t of this.leases.values())r[t.status]=(r[t.
status]||0)+1;return{schema:b,pools:e,leaseCounts:r,activeLeaseCount:r.active||0,preemptionCount:this.preemptionCount,quarantined:[
...this.quarantined.values()].map(t=>a(t)),leases:this.list()}}#e(e){return[...this.leases.values()].filter(r=>this.#s(r)&&
r.resourceKind===e).reduce((r,t)=>r+t.units,0)}#t(e){return[...this.leases.values()].filter(r=>this.#s(r)&&r.resourceKind===
e).reduce((r,t)=>r+t.memoryBytes,0)}#i(e,r,t){let s=0;const i=[...this.leases.values()].filter(o=>o.status==="active"&&o.
resourceKind===e&&o.preemptable&&!o.resident&&o.priority<r).sort((o,l)=>o.priority-l.priority||o.createdAt-l.createdAt);
for(const o of i)if(o.status="preempted",o.preemptedAt=this.now(),o.preemptedByPriority=r,s+=o.units,this.preemptionCount+=
1,s>=t)break;return s}#r(e,r,t){const s=this.leases.get(e);if(s)return(s.status==="active"||s.resident&&r==="released"&&
s.status!=="released")&&(s.status=r,s[t]=this.now()),a(s)}#s(e){return e.status==="active"||e.resident&&e.status!=="rele\
ased"}}export{M as RESOURCE_LEASE_SCHEMA,b as RESOURCE_PRESSURE_SCHEMA,q as ResourceLeaseBroker};

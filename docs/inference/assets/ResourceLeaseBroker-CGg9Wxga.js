const E="peercompute.service.resource-lease.v0",M="peercompute.service.resource-pressure.v0";let v=1;const p=Object.freeze(
{background:10,compute:50,interactive:75,render:100,critical:1e3});function g(n="resource-lease"){const e=v;return v+=1,
`${n}-${Date.now().toString(36)}-${e.toString(36)}`}function a(n){return n==null?n:JSON.parse(JSON.stringify(n))}function c(n,e,t=1,s=Number.
MAX_SAFE_INTEGER){const r=Math.floor(Number(n));return Number.isFinite(r)?Math.min(s,Math.max(t,r)):e}function I(n,e,t=Number.
MAX_SAFE_INTEGER){const s=Math.floor(Number(n));return Number.isFinite(s)?Math.min(t,Math.max(0,s)):e}function d(n){return String(
n||"gpu").trim().toLowerCase()||"gpu"}function k(n){const e=String(n||"compute").trim().toLowerCase();return Object.hasOwn(
p,e)?e:"compute"}function b(n,e){const t=Number(e);return Number.isFinite(t)?t:p[n]??p.compute}function w(n,e={}){const t=c(
e.units??e.count,n==="gpu"?1:0,0);return{kind:n,units:t,memoryBytes:I(e.memoryBytes,0),deviceIds:Array.isArray(e.deviceIds)?
e.deviceIds.map(s=>String(s||"").trim()).filter(Boolean):[],metadata:a(e.metadata||{})}}function R(n={}){const e=new Map;
for(const[t,s]of Object.entries(n))e.set(d(t),w(d(t),s));return e.has("gpu")||e.set("gpu",w("gpu",{units:1})),e}class x{constructor({
capacities:e={gpu:{units:1}},defaultTtlMs:t=3e4,now:s=()=>Date.now()}={}){this.pools=R(e),this.defaultTtlMs=c(t,3e4),this.
now=s,this.leases=new Map,this.quarantined=new Map,this.preemptionCount=0}async requestLease(e={}){if(this.expireLeases(),
e.leaseId&&this.leases.has(e.leaseId))throw new Error("Resource lease ID already exists");const t=d(e.resourceKind||e.kind||
e.type),s=this.pools.get(t);if(!s||s.units<=0)throw new Error(`No resource capacity configured for ${t}`);const r=e.deviceId?
String(e.deviceId):null;if(r&&s.deviceIds.length>0&&!s.deviceIds.includes(r))throw new Error(`Resource device is not in \
the ${t} pool: ${r}`);if(this.quarantined.has(`${t}:*`)||r&&this.quarantined.has(`${t}:${r}`))throw new Error(`Resource ${r||
t} is quarantined for ${t}`);const o=k(e.priorityClass),i=b(o,e.priority),l=c(e.units??e.count,1,1,s.units),u=I(e.memoryBytes,
0);if(u>0&&s.memoryBytes>0&&this.#t(t)+u>s.memoryBytes)throw new Error(`Resource memory quota exceeded for ${t}`);const f=this.#e(
t);if(f+l>s.units){const y=f+l-s.units;if(this.#n(t,i,y)<y)throw new Error(`Resource quota exceeded for ${t}`)}const m=this.
now(),A=c(e.ttlMs,this.defaultTtlMs),h={schema:E,leaseId:e.leaseId||g(),resourceKind:t,rootTaskId:e.rootTaskId||null,serviceId:e.
serviceId||null,taskId:e.taskId||null,priorityClass:o,priority:i,units:l,memoryBytes:u,deviceId:r,preemptable:e.preemptable!==
!1,resident:e.resident===!0,createdAt:m,expiresAt:c(e.expiresAt,m+A,m),status:"active",metadata:a(e.metadata||{})};return this.
leases.set(h.leaseId,h),a(h)}async releaseLease(e){return this.#s(e,"released","releasedAt")}async renewLease(e,{ttlMs:t=this.
defaultTtlMs}={}){this.expireLeases();const s=this.leases.get(e);if(!s||s.status!=="active")throw new Error("Resource le\
ase is no longer active");return s.expiresAt=this.now()+c(t,this.defaultTtlMs),a(s)}async revokeLease(e){return this.#s(
e,"revoked","revokedAt")}async revokeByRootTask(e){const t=[];for(const s of this.leases.values())s.rootTaskId===e&&s.status===
"active"&&(s.status="revoked",s.revokedAt=this.now(),t.push(a(s)));return t}expireLeases(e=this.now()){const t=[];for(const s of this.
leases.values())s.status==="active"&&s.expiresAt<=e&&(s.status="expired",s.expiredAt=e,t.push(a(s)));return t}quarantineResource({
resourceKind:e="gpu",deviceId:t=null,reason:s="device-lost",retryable:r=!0}={}){const o=d(e),i=`${o}:${t||"*"}`,l={resourceKind:o,
deviceId:t,reason:s,retryable:!!r,quarantinedAt:this.now()};this.quarantined.set(i,l);for(const u of this.leases.values())
u.status==="active"&&u.resourceKind===o&&(t==null||u.deviceId===t)&&(u.status="quarantined",u.quarantinedAt=l.quarantinedAt,
u.quarantineReason=s,u.retryable=!!r);return a(l)}clearQuarantine({resourceKind:e="gpu",deviceId:t=null}={}){return this.
quarantined.delete(`${d(e)}:${t||"*"}`)}get(e){const t=this.leases.get(e);return t?a(t):void 0}list({status:e=null,rootTaskId:t=null,
resourceKind:s=null}={}){const r=s==null?null:d(s);return[...this.leases.values()].filter(o=>e==null||o.status===e).filter(
o=>t==null||o.rootTaskId===t).filter(o=>r==null||o.resourceKind===r).map(o=>a(o))}reportPressure(){const e={};for(const[
s,r]of this.pools.entries()){const o=this.#e(s),i=this.#t(s);e[s]={units:r.units,activeUnits:o,availableUnits:Math.max(0,
r.units-o),pressure:r.units>0?o/r.units:0,memoryBytes:r.memoryBytes,activeMemoryBytes:i,availableMemoryBytes:r.memoryBytes>
0?Math.max(0,r.memoryBytes-i):null,deviceIds:[...r.deviceIds],metadata:a(r.metadata)}}const t={};for(const s of this.leases.
values())t[s.status]=(t[s.status]||0)+1;return{schema:M,pools:e,leaseCounts:t,activeLeaseCount:t.active||0,preemptionCount:this.
preemptionCount,quarantined:[...this.quarantined.values()].map(s=>a(s)),leases:this.list()}}#e(e){return[...this.leases.
values()].filter(t=>this.#r(t)&&t.resourceKind===e).reduce((t,s)=>t+s.units,0)}#t(e){return[...this.leases.values()].filter(
t=>this.#r(t)&&t.resourceKind===e).reduce((t,s)=>t+s.memoryBytes,0)}#n(e,t,s){let r=0;const o=[...this.leases.values()].
filter(i=>i.status==="active"&&i.resourceKind===e&&i.preemptable&&!i.resident&&i.priority<t).sort((i,l)=>i.priority-l.priority||
i.createdAt-l.createdAt);for(const i of o)if(i.status="preempted",i.preemptedAt=this.now(),i.preemptedByPriority=t,r+=i.
units,this.preemptionCount+=1,r>=s)break;return r}#s(e,t,s){const r=this.leases.get(e);if(r)return(r.status==="active"||
r.resident&&t==="released"&&r.status!=="released")&&(r.status=t,r[s]=this.now()),a(r)}#r(e){return e.status==="active"||
e.resident&&e.status!=="released"}}export{E as RESOURCE_LEASE_SCHEMA,M as RESOURCE_PRESSURE_SCHEMA,x as ResourceLeaseBroker};

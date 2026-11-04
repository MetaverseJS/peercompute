class u{constructor({broker:r,ttlMs:t=3e4}={}){if(!r?.requestLease||!r.renewLease)throw new TypeError("ResourceLeaseBrok\
er is required");if(!Number.isSafeInteger(t)||t<300)throw new RangeError("Invalid resident lease TTL");for(const a of["c\
pu","gpu"])if(!(r.reportPressure().pools[a]?.memoryBytes>0))throw new Error(`An explicit ${a} memory budget is required \
for inference`);this.broker=r,this.ttlMs=t}async acquire({sessionId:r,manifestCid:t,estimatedCpuBytes:a,estimatedGpuBytes:l}){
for(const e of[a,l])if(!Number.isSafeInteger(e)||e<=0)throw new RangeError("Invalid resident memory envelope");const s=[];
try{for(const[e,n]of[["cpu",a],["gpu",l]])s.push(await this.broker.requestLease({resourceKind:e,memoryBytes:n,rootTaskId:r,
serviceId:"model-inference",units:1,resident:!0,preemptable:!1,priorityClass:"interactive",ttlMs:this.ttlMs,metadata:{manifestCid:t,
policy:"configured-resident-envelope"}}))}catch(e){throw await Promise.all(s.map(n=>this.broker.releaseLease(n.leaseId))),
e}let o=!1,c=null;const i=setInterval(()=>{Promise.all(s.map(e=>this.broker.renewLease(e.leaseId,{ttlMs:this.ttlMs}))).catch(
e=>{c=e,clearInterval(i)})},Math.floor(this.ttlMs/3));return i.unref?.(),{leaseIds:s.map(e=>e.leaseId),assertActive:()=>{
if(this.broker.expireLeases(),o||c||s.some(e=>this.broker.get(e.leaseId)?.status!=="active"))throw new Error("Resident a\
dmission expired or was revoked; unload the model before reuse")},release:async()=>{o||(clearInterval(i),await Promise.all(
s.map(e=>this.broker.releaseLease(e.leaseId))),o=!0)}}}}export{u as ResidentModelAdmission};

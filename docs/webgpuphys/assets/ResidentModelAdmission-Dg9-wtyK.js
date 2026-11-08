class f{constructor({broker:r,ttlMs:a=3e4}={}){var o;if(!(r!=null&&r.requestLease)||!r.renewLease)throw new TypeError("R\
esourceLeaseBroker is required");if(!Number.isSafeInteger(a)||a<300)throw new RangeError("Invalid resident lease TTL");for(const i of[
"cpu","gpu"])if(!(((o=r.reportPressure().pools[i])==null?void 0:o.memoryBytes)>0))throw new Error(`An explicit ${i} memo\
ry budget is required for inference`);this.broker=r,this.ttlMs=a}async acquire({sessionId:r,manifestCid:a,estimatedCpuBytes:o,
estimatedGpuBytes:i}){var d;for(const e of[o,i])if(!Number.isSafeInteger(e)||e<=0)throw new RangeError("Invalid resident\
 memory envelope");const s=[];try{for(const[e,t]of[["cpu",o],["gpu",i]])s.push(await this.broker.requestLease({resourceKind:e,
memoryBytes:t,rootTaskId:r,serviceId:"model-inference",units:1,resident:!0,preemptable:!1,priorityClass:"interactive",ttlMs:this.
ttlMs,metadata:{manifestCid:a,policy:"configured-resident-envelope"}}))}catch(e){throw await Promise.all(s.map(t=>this.broker.
releaseLease(t.leaseId))),e}let l=!1,c=null;const n=setInterval(()=>{Promise.all(s.map(e=>this.broker.renewLease(e.leaseId,
{ttlMs:this.ttlMs}))).catch(e=>{c=e,clearInterval(n)})},Math.floor(this.ttlMs/3));return(d=n.unref)==null||d.call(n),{leaseIds:s.
map(e=>e.leaseId),assertActive:()=>{if(this.broker.expireLeases(),l||c||s.some(e=>{var t;return((t=this.broker.get(e.leaseId))==
null?void 0:t.status)!=="active"}))throw new Error("Resident admission expired or was revoked; unload the model before r\
euse")},release:async()=>{l||(clearInterval(n),await Promise.all(s.map(e=>this.broker.releaseLease(e.leaseId))),l=!0)}}}}export{f as ResidentModelAdmission};

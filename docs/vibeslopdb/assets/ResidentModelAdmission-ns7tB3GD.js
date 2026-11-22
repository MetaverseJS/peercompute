class c{constructor({broker:s,allowUnboundedMemory:r=!1,getMemoryBudgets:o}={}){if(!s?.requestLease||!s.releaseLease||!s.
get||!s.expireLeases)throw new TypeError("ResourceLeaseBroker is required");if(typeof r!="boolean"||o!==void 0&&typeof o!=
"function")throw new TypeError("Invalid resident memory admission policy");this.broker=s,this.allowUnboundedMemory=r,this.
getMemoryBudgets=o;for(const i of["cpu","gpu"])this._budget(i)}_budget(s){const r=this.getMemoryBudgets?.()??{};if(!r||typeof r!=
"object"||Array.isArray(r)||![Object.prototype,null].includes(Object.getPrototypeOf(r))||Object.keys(r).some(t=>!["cpuBy\
tes","gpuBytes"].includes(t)))throw new TypeError("Invalid resident memory budgets");for(const t of Object.values(r))if(t!=
null&&(!Number.isSafeInteger(t)||t<=0))throw new TypeError("Invalid resident memory budget");const o=r[`${s}Bytes`]??null,
i=this.broker.reportPressure().pools[s];if(!i||!(i.memoryBytes>0)&&o===null&&!this.allowUnboundedMemory)throw new Error(
`An explicit ${s} memory budget is required for inference; unbounded tracking must be enabled by the owner`);return o}async acquire({
sessionId:s,manifestCid:r,estimatedCpuBytes:o,estimatedGpuBytes:i}){for(const e of[o,i])if(!Number.isSafeInteger(e)||e<=
0)throw new RangeError("Invalid resident memory envelope");const t=[];try{for(const[e,a]of[["cpu",o],["gpu",i]]){const u=this.
_budget(e);t.push(await this.broker.requestLease({resourceKind:e,memoryBytes:a,memoryBudgetBytes:u,rootTaskId:s,serviceId:"\
model-inference",units:1,resident:!0,preemptable:!1,priorityClass:"interactive",lifetime:"owner",metadata:{manifestCid:r,
policy:"configured-resident-envelope"}}))}}catch(e){throw await Promise.all(t.map(a=>this.broker.releaseLease(a.leaseId))),
e}let n=!1;const l=()=>{if(this.broker.expireLeases(),n||t.some(e=>this.broker.get(e.leaseId)?.status!=="active"))throw Object.
assign(new Error("Resident admission was revoked or is unavailable; unload the model before reuse"),{code:"ERR_RESIDENT_\
ADMISSION_INACTIVE"})};return{leaseIds:t.map(e=>e.leaseId),assertActive:l,assertActiveSync:l,release:async()=>{n||(await Promise.
all(t.map(e=>this.broker.releaseLease(e.leaseId))),n=!0)}}}}export{c as ResidentModelAdmission};

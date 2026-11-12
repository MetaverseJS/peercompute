// Device refusal/lifetime mechanism adapted from Kaminos models/trellis2/device-memory.js
// at 5c9a2fc2939e0a28ac3560a1e9108e81ba245fa7. CPU reservations cover explicit
// loader allocations, not released-but-uncollected JS backing, metadata, fetch,
// driver-private memory, textures, or total physical RAM. No capacity is inferred.
const authenticated = new WeakSet();
const controllers = new WeakMap();
const devices = new WeakSet();
const bytes = (value, name) => {
  if (!Number.isSafeInteger(value) || value < 0) throw new TypeError(`${name} must be nonnegative safe-integer bytes`);
  return value;
};
export const isLoaderMemoryBudget = value => authenticated.has(value);

export function createLoaderMemoryBudget({cpuBytes, gpuBytes, totalBytes=cpuBytes+gpuBytes, parentBudget} = {}) {
  bytes(cpuBytes, 'cpuBytes'); bytes(gpuBytes, 'gpuBytes');
  bytes(totalBytes,'totalBytes');
  if (parentBudget !== undefined && !authenticated.has(parentBudget)) throw new TypeError('authenticated parent loader budget required');
  const parent = parentBudget === undefined ? null : controllers.get(parentBudget);
  parent?.assertActive();
  const cpu = {liveBytes:0, peakLiveBytes:0, maxBytes:cpuBytes}, gpu = {liveBytes:0, peakLiveBytes:0, maxBytes:gpuBytes};
  let peakCombinedBytes=0;
  const events = [], buffers = new Map(), unresolvedAllocations = new Set();
  let phase = 'new', refusal = null, device, originalCreate, originalTexture, originalDestroy, wrappedCreate, wrappedTexture, wrappedDestroy, restored = false;
  let acquiring = false, acquiredHere = false, unresolvedAcquisition = false;
  const emit = (kind, details) => events.push({kind, phase, atMs:performance.now(), ...details});
  const refuse = (ledger, size, label, scope) => {
    bytes(size, 'requestedBytes');
    if (size <= ledger.maxBytes - ledger.liveBytes) return;
    refusal = {scope, phase, label, requestedBytes:size, liveBytes:ledger.liveBytes, maxBytes:ledger.maxBytes};
    emit('allocation-refused', refusal);
    const error = new Error(`SF3D ${scope} budget exceeded before allocation: ${ledger.liveBytes} + ${size} > ${ledger.maxBytes}`);
    error.name = 'SF3DMemoryBudgetError'; error.memoryBudget = refusal; throw error;
  };
  const charge = (ledger, size, label, scope) => {
    ledger.liveBytes += size; ledger.peakLiveBytes = Math.max(ledger.peakLiveBytes, ledger.liveBytes);
    emit('reserved', {scope, label, bytes:size, liveBytes:ledger.liveBytes});
    let released = false;
    return Object.freeze({release() {
      if (released) return; released = true; ledger.liveBytes -= size;
      emit('retirement-requested', {scope, label, bytes:size, liveBytes:ledger.liveBytes});
    }});
  };
  const assertActive = () => {
    if (restored) throw new Error('loader budget is restored');
    if (unresolvedAcquisition) throw new Error('device acquisition cleanup is unresolved');
    parent?.assertActive();
  };
  const reserve = (scope, size, label) => {
    assertActive();
    const ledger = scope === 'cpu-loader' ? cpu : gpu;
    refuse(ledger, size, label, scope);
    refuse({liveBytes:cpu.liveBytes+gpu.liveBytes,maxBytes:totalBytes},size,label,'unified-explicit');
    // No allocator runs until every ancestor has charged the same resource.
    // These are nested views of one allowance, not additive RAM discovery.
    const parentLease = parent?.reserve(scope, size, label);
    const lease = charge(ledger, size, label, scope);
    peakCombinedBytes=Math.max(peakCombinedBytes,cpu.liveBytes+gpu.liveBytes);
    let released = false;
    return Object.freeze({release() {
      if (released) return; released = true;
      lease.release(); parentLease?.release();
    }});
  };
  const budget = Object.freeze({
    events,
    setPhase(value) { phase = String(value); },
    reserveCpu(size, label) {
      return reserve('cpu-loader', size, label);
    },
    // A host may reserve an explicitly sized non-buffer GPU store before its
    // own allocator. It owns retirement of this lease; this is not automatic
    // texture discovery or driver-backing measurement.
    reserveGpu(size, label) {
      return reserve('gpu-buffer', size, label);
    },
    assertDevice(value) {
      if (!device || restored || value !== device || device.createBuffer !== wrappedCreate || device.destroy !== wrappedDestroy || (wrappedTexture && device.createTexture!==wrappedTexture))
        throw new Error('loader budget must be installed on this exact owned device');
    },
    assertDeviceAcquiredHere(value) {
      assertActive();
      budget.assertDevice(value);
      if (!acquiredHere) throw new Error('host device must be requested through the budget; earlier acquisition baseline is unaccounted');
    },
    // Request and install before exposing the fresh device to a host. Binding
    // an existing device remains useful for owned loader tests, but cannot
    // certify allocations that happened before the hook was installed.
    async requestOwnedDevice(adapter, descriptor = {}, options = {}) {
      assertActive();
      if (device || acquiring) throw new Error('device already bound or acquisition in progress');
      if (typeof adapter?.requestDevice !== 'function') throw new TypeError('adapter requestDevice required');
      acquiring = true;
      let acquired;
      try {
        acquired = await adapter.requestDevice(descriptor);
        assertActive();
        budget.bindOwnedDevice(acquired, options);
        acquiredHere = true;
        emit('device-acquired', {route:'adapter.requestDevice through loader budget'});
        return acquired;
      } catch (error) {
        if (acquired) {
          try { acquired.destroy(); }
          catch (cleanupError) {
            unresolvedAcquisition = true;
            emit('device-acquisition-cleanup-unresolved', {message:String(cleanupError?.message ?? cleanupError)});
            throw new AggregateError([error, cleanupError], 'device acquisition and cleanup failed', {cause:error});
          }
        }
        throw error;
      } finally { acquiring = false; }
    },
    bindOwnedDevice(value,{textureBytes=null}={}) {
      assertActive();
      if (device || restored || devices.has(value)) throw new Error('device already has a loader budget');
      if (typeof value?.createBuffer !== 'function' || typeof value.destroy !== 'function') throw new TypeError('owned device createBuffer/destroy required');
      if(textureBytes!==null&&(typeof textureBytes!=='function'||typeof value.createTexture!=='function'))throw new TypeError('host texture estimator and owned allocator required');
      wrappedTexture=null;
      originalCreate = value.createBuffer; originalDestroy = value.destroy;
      originalTexture=value.createTexture;
      wrappedCreate = function(descriptor) {
        if (this !== value) throw new Error('budgeted allocator requires the exact owned device');
        // Pin the authority-bearing size once, including accessor-bearing input.
        const size = bytes(descriptor?.size, 'GPUBuffer.size'), label = descriptor?.label ?? '';
        const lease = reserve('gpu-buffer', size, label);
        let buffer;
        try { buffer = Reflect.apply(originalCreate, value, [{...descriptor, size, label}]); }
        catch (error) { lease.release(); throw error; }
        if (buffers.has(buffer)) { lease.release(); return buffer; }
        if (buffer?.size !== size || typeof buffer?.destroy !== 'function') {
          const error = new Error('GPUBuffer size/destroy contract unavailable');
          try {
            if (typeof buffer?.destroy !== 'function') throw new Error('actual allocation retirement unavailable');
            buffer.destroy(); lease.release();
          } catch (cleanupError) {
            unresolvedAllocations.add(lease);
            throw new AggregateError([error,cleanupError],'GPUBuffer contract and cleanup failed',{cause:error});
          }
          throw error;
        }
        const destroy = buffer.destroy;
        buffers.set(buffer, {lease, destroy});
        try {
          const wrapped = function(...args) {
            const result = Reflect.apply(destroy, this, args), row = buffers.get(this);
            if (row) {
              // Already-destroyed objects keep an inert idempotent hook; only
              // live/unresolved hooks need whole-budget restoration.
              row.lease.release(); buffers.delete(this);
            }
            return result;
          };
          buffer.destroy = wrapped;
          if (buffer.destroy !== wrapped) throw new Error('GPUBuffer retirement hook installation failed');
        } catch (error) {
          // createBuffer succeeded before instrumentation failed. Retire the
          // actual buffer; if retirement fails, keep its charge until device
          // destruction rather than inventing reclaimed backing.
          try { Reflect.apply(destroy,buffer,[]); lease.release(); buffers.delete(buffer); }
          catch (cleanupError) { throw new AggregateError([error,cleanupError],'GPUBuffer retirement hook and cleanup failed',{cause:error}); }
          throw error;
        }
        return buffer;
      };
      if(textureBytes)wrappedTexture=function(descriptor){
        if(this!==value)throw Error('budgeted texture allocator requires the exact owned device');
        const plan=textureBytes(descriptor),size=bytes(plan?.bytes,'explicit GPUTexture bytes');
        if(!plan?.descriptor||typeof plan.descriptor!=='object')throw Error('pinned host texture descriptor required');
        const label=plan.descriptor.label??'',lease=reserve('gpu-buffer',size,label);
        let texture;
        try{texture=Reflect.apply(originalTexture,value,[plan.descriptor]);}catch(error){lease.release();throw error;}
        if(buffers.has(texture)){lease.release();return texture;}
        const destroy=texture?.destroy;
        if(typeof destroy!=='function'){unresolvedAllocations.add(lease);throw Error('GPUTexture retirement contract unavailable');}
        buffers.set(texture,{lease,destroy});
        try{
          const wrapped=function(...args){
            const result=Reflect.apply(destroy,this,args),row=buffers.get(this);
            if(row){
              row.lease.release();buffers.delete(this);
            }
            return result;
          };
          texture.destroy=wrapped;if(texture.destroy!==wrapped)throw Error('GPUTexture retirement hook installation failed');
        }catch(error){
          try{Reflect.apply(destroy,texture,[]);lease.release();buffers.delete(texture);}
          catch(cleanupError){throw new AggregateError([error,cleanupError],'GPUTexture hook and cleanup failed',{cause:error});}
          throw error;
        }
        emit('host-texture-allocated',{label,bytes:size,descriptor:plan.descriptor,
          effective:{width:texture.width,height:texture.height,depthOrArrayLayers:texture.depthOrArrayLayers,format:texture.format,mipLevelCount:texture.mipLevelCount,sampleCount:texture.sampleCount}});
        return texture;
      };
      wrappedDestroy = function(...args) {
        const result = Reflect.apply(originalDestroy, this, args);
        if (this === value) {
          for (const row of buffers.values()) row.lease.release();
          for (const lease of unresolvedAllocations) lease.release();
          unresolvedAllocations.clear();
        }
        return result;
      };
      try {
        value.createBuffer = wrappedCreate; value.destroy = wrappedDestroy;if(wrappedTexture)value.createTexture=wrappedTexture;
        if (value.createBuffer !== wrappedCreate || value.destroy !== wrappedDestroy || (wrappedTexture&&value.createTexture!==wrappedTexture)) throw new Error('device budget installation failed');
      } catch (error) { value.createBuffer = originalCreate; value.destroy = originalDestroy;if(wrappedTexture)value.createTexture=originalTexture;throw error; }
      device = value; devices.add(value); return budget;
    },
    snapshot() {
      return {schema:'sf3d.loader-memory-budget.v0', phase, refusal,
        deviceAcquisition:acquiredHere?'requested-through-budget':device?'bound-after-acquisition':'unbound',
        unresolvedAcquisitionCleanup:unresolvedAcquisition,
        accounting:'own and descendant explicit reservations; nested ledgers are not additive physical RAM',
        parentAllowance:parent ? {cpuBytes:parent.cpuBytes,gpuBytes:parent.gpuBytes,totalBytes:parent.totalBytes} : null,
        total:{liveBytes:cpu.liveBytes+gpu.liveBytes,peakLiveBytes:peakCombinedBytes,maxBytes:totalBytes,physicalMemoryMeasured:false,
          meaning:'combined explicit CPU/GPU stores, not total unified physical memory'},
        cpu:{...cpu, physicalMemoryMeasured:false, meaning:'explicit loader reservations; retirement is not proven GC'},
        gpu:{...gpu, physicalMemoryMeasured:false, meaning:wrappedTexture?'API-visible buffers and declared logical texture stores; not reclaimed physical backing':'API-visible buffers; destruction request is not reclaimed physical backing'},
        hostTextures:wrappedTexture?'explicit caller-estimated logical texture stores; not physical backing':'not tracked',
        excludes:['JS/parse metadata', 'released JS backing before GC', 'network/browser/driver-private backing', ...(wrappedTexture?['texture padding/private backing']:['textures']), 'other processes']};
    },
    restore() {
      if (restored) return;
      if (unresolvedAcquisition) throw new Error('device acquisition cleanup is unresolved');
      if (cpu.liveBytes || gpu.liveBytes) throw new Error('retire loader allocations before restoring the budget');
      if (device) {
        device.createBuffer = originalCreate; device.destroy = originalDestroy;
        if(wrappedTexture)device.createTexture=originalTexture;
        for (const [buffer, row] of buffers) buffer.destroy = row.destroy;
        devices.delete(device); buffers.clear();
      }
      restored = true;
    },
  });
  controllers.set(budget,{assertActive,reserve,cpuBytes,gpuBytes,totalBytes});
  authenticated.add(budget); return budget;
}

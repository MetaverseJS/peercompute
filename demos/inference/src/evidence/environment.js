/** Coarse browser/device facts; never send the complete UA, URLs, adapter description or device IDs. */
export function modelEvidenceEnvironment(device = {}, scope = globalThis) {
  const ua = scope.navigator?.userAgent ?? '';
  const match = /(?:Edg|Chrome|Firefox|Version)\/([\d.]+)/.exec(ua);
  const browserFamily = /Edg\//.test(ua) ? 'Edge' : /Chrome\//.test(ua) ? 'Chromium' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'unknown';
  const os = /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Windows/.test(ua) ? 'Windows' : /Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'unknown';
  return { kind: 'browser', browserFamily, browserVersion: match?.[1] ?? 'unknown', os,
    ...(device.deviceMemoryGiB ? { deviceMemoryGiB: device.deviceMemoryGiB } : {}),
    capabilities: { ...(typeof device.webgpu === 'boolean' ? { webgpu: device.webgpu } : {}),
      crossOriginIsolated: device.crossOriginIsolated === true, sharedArrayBuffer: device.sharedArrayBuffer === true,
      wasmMemory64: device.memory64 === true, wasmJSPI: device.jspi === true },
    gpu: { ...(device.gpuInfo ?? {}), features: device.features ?? [], limits: device.limits ?? {} } };
}
export const evidenceBuild = typeof __PC_MODEL_EVIDENCE_BUILD__ !== 'undefined' ? __PC_MODEL_EVIDENCE_BUILD__
  : { clientBuild: 'unversioned-dev', inspectorVersion: 'unversioned-dev', policyVersion: 'unversioned-dev' };

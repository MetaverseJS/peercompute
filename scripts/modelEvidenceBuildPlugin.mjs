import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
function files(path) {
  return readdirSync(path, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(join(path, entry.name))
    : /\.(js|mjs|json|wgsl)$/.test(entry.name) ? [join(path, entry.name)] : []);
}
function digest(paths) {
  const hash = createHash('sha256');
  for (const path of [...new Set(paths)].sort()) hash.update(relative(root, path)).update('\0').update(readFileSync(path)).update('\0');
  return hash.digest('hex');
}
/** Fingerprints code/admission and locked runtime build inputs, not UI-only changes. */
export function modelEvidenceBuildPlugin() {
  const runtime = digest([...files(join(root, 'peercompute/src/peercompute/inference')), join(root, 'package-lock.json'), join(root, 'scripts/prepare-gguf-runtime.mjs')]);
  const inspector = digest(files(join(root, 'peercompute/src/peercompute/inference/hub')));
  const policy = digest([join(root, 'peercompute/src/peercompute/inference/library/modelDeviceCompatibility.js'), join(root, 'peercompute/src/peercompute/inference/library/modelHubPackage.js'), join(root, 'peercompute/src/peercompute/serviceOrchestration/ResidentModelAdmission.js'), join(root, 'peercompute/src/peercompute/serviceOrchestration/ResourceLeaseBroker.js')]);
  let clientBuild = 'uncommitted';
  try {
    clientBuild = execFileSync('git', ['rev-parse', '--short=12', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
    try { execFileSync('git', ['diff', '--quiet', 'HEAD', '--', '.', ':(exclude)docs/**'], { cwd: root, stdio: 'ignore' }); } catch { clientBuild += '-dirty'; }
  } catch { /* Source exports retain content hashes. */ }
  return { name: 'peercompute-model-evidence-build', config() { return { define: { __PC_MODEL_EVIDENCE_BUILD__: JSON.stringify({
    clientBuild, inspectorVersion: inspector, policyVersion: policy, runtimeDigest: runtime }) } }; } };
}

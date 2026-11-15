import { writeFile, rename, chmod, unlink } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

/** Only public secure relay paths, never profile paths, loopback API or private addresses. */
export function publicEvidenceDirectory(status, now = Date.now()) {
  const peerId = status?.identity?.peerId;
  if (status?.phase !== 'ready' || status.connected !== true || status.evidence?.network?.serving !== true || !/^[a-zA-Z0-9_-]{1,128}$/.test(peerId)) return null;
  const addresses = [...new Set(status.addresses ?? [])].filter(address => typeof address === 'string' && address.length <= 2048
    && /^\/dns[46]\/[a-z0-9.-]+\//i.test(address) && !/\/localhost\//i.test(address)
    && /\/(?:wss|tls\/ws)\//.test(address) && address.includes('/p2p-circuit/')
    && !address.includes('/webrtc') && address.endsWith(`/p2p/${peerId}`)).slice(0, 8);
  if (!addresses.length) return null;
  return { schema: 'peercompute.model-evidence-directory.v1', protocol: '/peercompute/model-evidence/1.0.0',
    peerId, addresses, expiresAt: now + 120000 };
}
export async function writeEvidenceDirectory(path, status) {
  const directory = publicEvidenceDirectory(status);
  if (!directory) return false; // Old directory expires; never publish unready/local-only endpoints.
  const temporary = `${path}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(directory), { mode: 0o644, flag: 'wx' });
    await chmod(temporary, 0o644); // Remain readable under the service umask.
    await rename(temporary, path); return true;
  } finally { await unlink(temporary).catch(() => {}); }
}

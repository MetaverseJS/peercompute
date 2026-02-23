import os from 'node:os';

const preferIpv6 = (() => {
  const raw = (process.env.RELAY_PREFER_IPV6 || process.env.PREFER_IPV6 || process.env.IP_VERSION || '')
    .trim()
    .toLowerCase();
  return raw === '6' || raw === 'ipv6' || raw === 'true' || raw === '1' || raw === 'yes';
})();

const nets = os.networkInterfaces();
const ipv4Candidates = [];
const ipv6Candidates = [];

for (const ifname of Object.keys(nets)) {
  const entries = nets[ifname] || [];
  for (const net of entries) {
    if (!net) continue;
    const family = typeof net.family === 'string' ? net.family : String(net.family);
    const isIpv4 = family === 'IPv4' || family === '4';
    const isIpv6 = family === 'IPv6' || family === '6';
    if (!isIpv4 && !isIpv6) continue;
    if (net.internal) continue;

    if (isIpv4) {
      if (!net.address) continue;
      if (net.address.startsWith('169.254.')) continue;
      ipv4Candidates.push(net.address);
      continue;
    }

    if (isIpv6) {
      if (!net.address) continue;
      const addr = net.address.split('%')[0];
      const lower = addr.toLowerCase();
      if (lower === '::1' || lower === '::') continue;
      if (lower.startsWith('fe80:')) continue;
      ipv6Candidates.push(addr);
    }
  }
}

const candidates = preferIpv6
  ? (ipv6Candidates.length > 0 ? ipv6Candidates : ipv4Candidates)
  : (ipv4Candidates.length > 0 ? ipv4Candidates : ipv6Candidates);

if (candidates.length === 0) {
  process.exit(1);
}

process.stdout.write(candidates[0]);

import os from 'node:os';

const nets = os.networkInterfaces();
const candidates = [];

for (const ifname of Object.keys(nets)) {
  const entries = nets[ifname] || [];
  for (const net of entries) {
    if (!net) continue;
    if (net.family !== 'IPv4') continue;
    if (net.internal) continue;
    if (net.address.startsWith('169.254.')) continue;
    candidates.push(net.address);
  }
}

if (candidates.length === 0) {
  process.exit(1);
}

process.stdout.write(candidates[0]);

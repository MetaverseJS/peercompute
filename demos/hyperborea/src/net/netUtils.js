export const logNet = (...args) => console.log('[hyperborea-net]', ...args);

export const isIpv4Host = (host) => /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
export const isIpv6Host = (host) => host.includes(':');
export const isLoopbackHost = (host) => host === 'localhost' || host === '127.0.0.1' || host === '::1';

export const hostToMultiaddrPrefix = (host) => {
  if (isIpv6Host(host)) return `/ip6/${host}`;
  if (isIpv4Host(host)) return `/ip4/${host}`;
  return `/dns4/${host}`;
};

export const rewriteLoopbackAddr = (addr, hostPrefix) => {
  if (typeof addr !== 'string') return addr;
  return addr
    .replace('/ip4/127.0.0.1', hostPrefix)
    .replace('/ip6/::1', hostPrefix)
    .replace('/dns4/localhost', hostPrefix)
    .replace('/dns/localhost', hostPrefix);
};

export const getPeerIdFromAddr = (addr) => {
  if (typeof addr !== 'string') return null;
  const parts = addr.split('/p2p/');
  if (parts.length < 2) return null;
  return parts[parts.length - 1] || null;
};

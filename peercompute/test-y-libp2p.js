import * as Y from 'yjs';
import * as yLibp2p from 'y-libp2p';

console.log('y-libp2p export:', yLibp2p);
console.log('default export:', yLibp2p.default);
if (yLibp2p.Libp2pProvider) {
  console.log('Libp2pProvider type:', typeof yLibp2p.Libp2pProvider);
}
if (yLibp2p.default && yLibp2p.default.Libp2pProvider) {
  console.log('default.Libp2pProvider type:', typeof yLibp2p.default.Libp2pProvider);
}

try {
  const { Libp2pProvider } = yLibp2p;
  console.log('Destructured Libp2pProvider:', Libp2pProvider);
} catch (e) {
  console.log('Destructure failed', e);
}

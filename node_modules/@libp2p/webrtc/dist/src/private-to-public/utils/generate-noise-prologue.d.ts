import type { Multiaddr } from '@multiformats/multiaddr';
/**
 * Generate a noise prologue from the peer connection's certificate.
 * noise prologue = bytes('libp2p-webrtc-noise:') + noise-server fingerprint + noise-client fingerprint
 */
export declare function generateNoisePrologue(localFingerprint: string, remoteAddr: Multiaddr, role: 'client' | 'server'): Uint8Array;
//# sourceMappingURL=generate-noise-prologue.d.ts.map
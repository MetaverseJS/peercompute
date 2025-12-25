import type { Multiaddr } from '@multiformats/multiaddr';
import type { MultihashDigest } from 'multiformats/hashes/interface';
/**
 * Get base2 | identity decoders
 */
export declare const multibaseDecoder: any;
export declare function getFingerprintFromSdp(sdp: string | undefined): string | undefined;
export declare function certhash(ma: Multiaddr): string;
/**
 * Convert a certhash into a multihash
 */
export declare function decodeCerthash(certhash: string): MultihashDigest;
export declare function certhashToFingerprint(certhash: string): string;
/**
 * Extract the fingerprint from a multiaddr
 */
export declare function ma2Fingerprint(ma: Multiaddr): string;
export declare function fingerprint2Ma(fingerprint: string): Multiaddr;
/**
 * Normalize the hash name from a given multihash has name
 */
export declare function toSupportedHashFunction(code: number): 'sha-1' | 'sha-256' | 'sha-512';
/**
 * Create an answer SDP message from a multiaddr - the server always operates in
 * ice-lite mode and DTLS active mode.
 */
export declare function serverAnswerFromMultiaddr(ma: Multiaddr, ufrag: string): RTCSessionDescriptionInit;
/**
 * Create an offer SDP message from a multiaddr
 */
export declare function clientOfferFromMultiAddr(ma: Multiaddr, ufrag: string): RTCSessionDescriptionInit;
/**
 * Replace (munge) the ufrag and password values in a SDP
 */
export declare function munge(desc: RTCSessionDescriptionInit, ufrag: string): RTCSessionDescriptionInit;
//# sourceMappingURL=sdp.d.ts.map
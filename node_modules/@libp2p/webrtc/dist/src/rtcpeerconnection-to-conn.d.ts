import type { MultiaddrConnection } from '@libp2p/interface';
import type { AbstractMultiaddrConnectionInit } from '@libp2p/utils';
export interface RTCPeerConnectionMultiaddrConnectionInit extends Omit<AbstractMultiaddrConnectionInit, 'stream'> {
    peerConnection: RTCPeerConnection;
}
/**
 * Convert a RTCPeerConnection into a MultiaddrConnection
 * https://github.com/libp2p/interface-transport#multiaddrconnection
 */
export declare const toMultiaddrConnection: (init: RTCPeerConnectionMultiaddrConnectionInit) => MultiaddrConnection;
//# sourceMappingURL=rtcpeerconnection-to-conn.d.ts.map
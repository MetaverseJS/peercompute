import { DataChannelMuxerFactory } from '../../muxer.ts';
import type { CreateDialerRTCPeerConnectionOptions } from './get-rtcpeerconnection.ts';
export declare function createDialerRTCPeerConnection(role: 'client' | 'server', ufrag: string, options?: CreateDialerRTCPeerConnectionOptions): Promise<{
    peerConnection: RTCPeerConnection;
    muxerFactory: DataChannelMuxerFactory;
}>;
//# sourceMappingURL=get-rtcpeerconnection.browser.d.ts.map
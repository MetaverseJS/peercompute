import { TypedEventEmitter } from 'main-event';
import type { PeerId, ListenerEvents, Listener, Libp2pEvents } from '@libp2p/interface';
import type { TransportManager } from '@libp2p/interface-internal';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { TypedEventTarget } from 'main-event';
export interface WebRTCPeerListenerComponents {
    peerId: PeerId;
    transportManager: TransportManager;
    events: TypedEventTarget<Libp2pEvents>;
}
export interface WebRTCPeerListenerInit {
    shutdownController: AbortController;
}
export declare class WebRTCPeerListener extends TypedEventEmitter<ListenerEvents> implements Listener {
    private readonly transportManager;
    private readonly shutdownController;
    private readonly events;
    constructor(components: WebRTCPeerListenerComponents, init: WebRTCPeerListenerInit);
    listen(): Promise<void>;
    onTransportListening(event: CustomEvent<Listener>): void;
    getAddrs(): Multiaddr[];
    updateAnnounceAddrs(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=listener.d.ts.map
import { TypedEventEmitter } from 'main-event';
import type { PeerId, ListenerEvents, Listener } from '@libp2p/interface';
import type { TransportManager } from '@libp2p/interface-internal';
import type { Multiaddr } from '@multiformats/multiaddr';
export interface WebRTCDirectListenerComponents {
    peerId: PeerId;
    transportManager: TransportManager;
}
export interface WebRTCDirectListenerInit {
    shutdownController: AbortController;
}
export declare class WebRTCDirectListener extends TypedEventEmitter<ListenerEvents> implements Listener {
    listen(): Promise<void>;
    getAddrs(): Multiaddr[];
    updateAnnounceAddrs(): void;
    close(): Promise<void>;
}
//# sourceMappingURL=listener.browser.d.ts.map
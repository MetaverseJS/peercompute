import { TypedEventEmitter } from 'main-event';
import type { RelayDiscoveryComponents, RelayDiscoveryEvents, RelayDiscoveryInit } from '../index.ts';
import type { PeerId, PeerInfo, Startable } from '@libp2p/interface';
/**
 * ReservationManager automatically makes a circuit v2 reservation on any connected
 * peers that support the circuit v2 HOP protocol.
 */
export declare class RelayDiscovery extends TypedEventEmitter<RelayDiscoveryEvents> implements Startable {
    private readonly components;
    private started;
    private running;
    private topologyId?;
    private readonly log;
    private discoveryController;
    private readonly filter?;
    private queue?;
    constructor(components: RelayDiscoveryComponents, init?: RelayDiscoveryInit);
    isStarted(): boolean;
    start(): Promise<void>;
    stop(): void;
    /**
     * Try to listen on available hop relay connections.
     * The following order will happen while we do not have enough relays:
     *
     * 1. Check the metadata store for known relays, try to listen on the ones we are already connected to
     * 2. Dial and try to listen on the peers we know that support hop but are not connected
     * 3. Search the network - this requires a peer routing implementation to be configured but will fail gracefully
     * 4. Dial any peers discovered - this covers when no peer routing implementation has been configured but some peer discovery mechanism is also present
     */
    startDiscovery(): void;
    stopDiscovery(): void;
    onPeer(evt: CustomEvent<PeerInfo>): void;
    maybeDialPeer(evt: CustomEvent<PeerInfo>): Promise<void>;
    dialPeer({ peerId, signal }: {
        peerId: PeerId;
        signal?: AbortSignal;
    }): Promise<void>;
}
//# sourceMappingURL=discovery.d.ts.map
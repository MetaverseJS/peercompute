import { CODE_P2P_CIRCUIT } from '@multiformats/multiaddr';
import { P2P } from '@multiformats/multiaddr-matcher';
import { fmt, code } from '@multiformats/multiaddr-matcher/utils';
import { TypedEventEmitter } from 'main-event';
const Circuit = fmt(P2P.matchers[0], code(CODE_P2P_CIRCUIT));
export class WebRTCPeerListener extends TypedEventEmitter {
    transportManager;
    shutdownController;
    events;
    constructor(components, init) {
        super();
        this.transportManager = components.transportManager;
        this.events = components.events;
        this.shutdownController = init.shutdownController;
        this.onTransportListening = this.onTransportListening.bind(this);
    }
    async listen() {
        this.events.addEventListener('transport:listening', this.onTransportListening);
    }
    onTransportListening(event) {
        const circuitAddresses = event.detail.getAddrs()
            .filter(ma => Circuit.exactMatch(ma))
            .map(ma => {
            return ma.encapsulate('/webrtc');
        });
        if (circuitAddresses.length > 0) {
            this.safeDispatchEvent('listening');
        }
    }
    getAddrs() {
        return this.transportManager
            .getListeners()
            .filter(l => !(l instanceof WebRTCPeerListener))
            .map(l => l.getAddrs()
            .filter(ma => Circuit.exactMatch(ma))
            .map(ma => {
            return ma.encapsulate('/webrtc');
        }))
            .flat();
    }
    updateAnnounceAddrs() {
    }
    async close() {
        this.events.removeEventListener('transport:listening', this.onTransportListening);
        this.shutdownController.abort();
        queueMicrotask(() => {
            this.safeDispatchEvent('close');
        });
    }
}
//# sourceMappingURL=listener.js.map
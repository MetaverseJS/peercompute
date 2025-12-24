import type { MultiaddrConnection } from '@libp2p/interface';
import type { AbstractMultiaddrConnectionInit } from '@libp2p/utils';
export interface WebSocketMultiaddrConnectionInit extends Omit<AbstractMultiaddrConnectionInit, 'name'> {
    websocket: WebSocket;
    maxBufferedAmount?: number;
    bufferedAmountPollInterval?: number;
}
export declare function webSocketToMaConn(init: WebSocketMultiaddrConnectionInit): MultiaddrConnection;
//# sourceMappingURL=websocket-to-conn.d.ts.map
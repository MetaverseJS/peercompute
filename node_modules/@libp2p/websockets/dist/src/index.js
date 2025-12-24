/**
 * @packageDocumentation
 *
 * A [libp2p transport](https://docs.libp2p.io/concepts/transports/overview/) based on [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API).
 *
 * @example
 *
 * ```TypeScript
 * import { createLibp2p } from 'libp2p'
 * import { webSockets } from '@libp2p/websockets'
 * import { multiaddr } from '@multiformats/multiaddr'
 *
 * const node = await createLibp2p({
 *   transports: [
 *     webSockets()
 *   ]
 * //... other config
 * })
 * await node.start()
 *
 * const ma = multiaddr('/dns4/example.com/tcp/9090/tls/ws')
 * await node.dial(ma)
 * ```
 */
import { transportSymbol, serviceCapabilities, ConnectionFailedError } from '@libp2p/interface';
import { WebSockets as WebSocketsMatcher, WebSocketsSecure } from '@multiformats/multiaddr-matcher';
import { multiaddrToUri as toUri } from '@multiformats/multiaddr-to-uri';
import { pEvent } from 'p-event';
import { CustomProgressEvent } from 'progress-events';
import { createListener } from './listener.js';
import { webSocketToMaConn } from './websocket-to-conn.js';
class WebSockets {
    log;
    init;
    logger;
    metrics;
    components;
    constructor(components, init = {}) {
        this.log = components.logger.forComponent('libp2p:websockets');
        this.logger = components.logger;
        this.components = components;
        this.init = init;
        if (components.metrics != null) {
            this.metrics = {
                dialerEvents: components.metrics.registerCounterGroup('libp2p_websockets_dialer_events_total', {
                    label: 'event',
                    help: 'Total count of WebSockets dialer events by type'
                })
            };
        }
    }
    [transportSymbol] = true;
    [Symbol.toStringTag] = '@libp2p/websockets';
    [serviceCapabilities] = [
        '@libp2p/transport'
    ];
    async dial(ma, options) {
        this.log('dialing %s', ma);
        options = options ?? {};
        const maConn = webSocketToMaConn({
            websocket: await this._connect(ma, options),
            remoteAddr: ma,
            metrics: this.metrics?.dialerEvents,
            direction: 'outbound',
            log: this.components.logger.forComponent('libp2p:websockets:connection'),
            maxBufferedAmount: this.init.maxBufferedAmount,
            bufferedAmountPollInterval: this.init.bufferedAmountPollInterval
        });
        this.log('new outbound connection %s', maConn.remoteAddr);
        const conn = await options.upgrader.upgradeOutbound(maConn, options);
        this.log('outbound connection %s upgraded', maConn.remoteAddr);
        return conn;
    }
    async _connect(ma, options) {
        options?.signal?.throwIfAborted();
        const uri = toUri(ma);
        this.log('create websocket connection to %s', uri);
        const websocket = new WebSocket(uri);
        websocket.binaryType = 'arraybuffer';
        try {
            options.onProgress?.(new CustomProgressEvent('websockets:open-connection'));
            await pEvent(websocket, 'open', options);
        }
        catch (err) {
            if (options.signal?.aborted) {
                this.metrics?.dialerEvents.increment({ abort: true });
                throw new ConnectionFailedError(`Could not connect to ${uri}`);
            }
            else {
                this.metrics?.dialerEvents.increment({ error: true });
            }
            try {
                websocket.close();
            }
            catch { }
            throw err;
        }
        this.log('connected %s', ma);
        this.metrics?.dialerEvents.increment({ connect: true });
        return websocket;
    }
    /**
     * Creates a WebSockets listener. The provided `handler` function will be called
     * anytime a new incoming Connection has been successfully upgraded via
     * `upgrader.upgradeInbound`
     */
    createListener(options) {
        return createListener({
            logger: this.logger,
            events: this.components.events,
            metrics: this.components.metrics
        }, {
            ...this.init,
            ...options
        });
    }
    listenFilter(multiaddrs) {
        return multiaddrs.filter(ma => WebSocketsMatcher.exactMatch(ma) || WebSocketsSecure.exactMatch(ma));
    }
    dialFilter(multiaddrs) {
        return this.listenFilter(multiaddrs);
    }
}
export function webSockets(init = {}) {
    return (components) => {
        return new WebSockets(components, init);
    };
}
//# sourceMappingURL=index.js.map
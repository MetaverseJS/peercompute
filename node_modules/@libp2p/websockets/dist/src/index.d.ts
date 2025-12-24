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
import type { Transport, AbortOptions, ComponentLogger, OutboundConnectionUpgradeEvents, Metrics, CounterGroup, Libp2pEvents } from '@libp2p/interface';
import type { TypedEventTarget } from 'main-event';
import type http from 'node:http';
import type https from 'node:https';
import type { ProgressEvent } from 'progress-events';
export interface WebSocketsInit extends AbortOptions {
    /**
     * Options used to create the HTTP server
     */
    http?: http.ServerOptions;
    /**
     * Options used to create the HTTPs server. `options.http` will be used if
     * unspecified.
     */
    https?: https.ServerOptions;
    /**
     * How large the outgoing [bufferedAmount](https://websockets.spec.whatwg.org/#dom-websocket-bufferedamount)
     * property of incoming and outgoing websockets is allowed to get in bytes.
     *
     * If this limit is exceeded, backpressure will be applied to the writer.
     *
     * @default 4_194_304
     */
    maxBufferedAmount?: number;
    /**
     * If the [bufferedAmount](https://websockets.spec.whatwg.org/#dom-websocket-bufferedamount)
     * property of a WebSocket exceeds `maxBufferedAmount`, poll the field every
     * this number of ms to see if the socket can accept new data.
     *
     * @default 500
     */
    bufferedAmountPollInterval?: number;
}
export interface WebSocketsComponents {
    logger: ComponentLogger;
    events: TypedEventTarget<Libp2pEvents>;
    metrics?: Metrics;
}
export interface WebSocketsMetrics {
    dialerEvents: CounterGroup;
}
export type WebSocketsDialEvents = OutboundConnectionUpgradeEvents | ProgressEvent<'websockets:open-connection'>;
export declare function webSockets(init?: WebSocketsInit): (components: WebSocketsComponents) => Transport;
//# sourceMappingURL=index.d.ts.map
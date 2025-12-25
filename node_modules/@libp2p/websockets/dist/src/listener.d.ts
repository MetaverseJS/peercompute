import http from 'node:http';
import net from 'node:net';
import { TypedEventEmitter } from 'main-event';
import * as ws from 'ws';
import type { ComponentLogger, Listener, ListenerEvents, CreateListenerOptions, CounterGroup, MetricGroup, Metrics, TLSCertificate, Libp2pEvents } from '@libp2p/interface';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { TypedEventTarget } from 'main-event';
import type { Server } from 'node:http';
import type { Duplex } from 'node:stream';
import type tls from 'node:tls';
export interface WebSocketListenerComponents {
    logger: ComponentLogger;
    events: TypedEventTarget<Libp2pEvents>;
    metrics?: Metrics;
}
export interface WebSocketListenerInit extends CreateListenerOptions {
    server?: Server;
    cert?: string;
    key?: string;
    http?: http.ServerOptions;
    https?: http.ServerOptions;
    maxBufferedAmount?: number;
    bufferedAmountPollInterval?: number;
}
export interface WebSocketListenerMetrics {
    status?: MetricGroup;
    errors?: CounterGroup;
    events?: CounterGroup;
}
export declare class WebSocketListener extends TypedEventEmitter<ListenerEvents> implements Listener {
    private components;
    private readonly log;
    private readonly server;
    private readonly wsServer;
    private readonly metrics;
    private readonly sockets;
    private readonly upgrader;
    private readonly httpOptions?;
    private readonly httpsOptions?;
    private readonly shutdownController;
    private http?;
    private https?;
    private addr?;
    private listeningMultiaddr?;
    private maxBufferedAmount?;
    private bufferedAmountPollInterval?;
    constructor(components: WebSocketListenerComponents, init: WebSocketListenerInit);
    onSocketConnection(socket: net.Socket): Promise<void>;
    onWsServerConnection(socket: ws.WebSocket, req: http.IncomingMessage): void;
    onUpgrade(req: http.IncomingMessage, socket: Duplex, head: Buffer): void;
    onTLSClientError(err: Error, socket: tls.TLSSocket): void;
    listen(ma: Multiaddr): Promise<void>;
    onCertificateProvision(event: CustomEvent<TLSCertificate>): void;
    onCertificateRenew(event: CustomEvent<TLSCertificate>): void;
    close(): Promise<void>;
    getAddrs(): Multiaddr[];
    updateAnnounceAddrs(): void;
    private httpRequestHandler;
}
export declare function createListener(components: WebSocketListenerComponents, init: WebSocketListenerInit): Listener;
//# sourceMappingURL=listener.d.ts.map
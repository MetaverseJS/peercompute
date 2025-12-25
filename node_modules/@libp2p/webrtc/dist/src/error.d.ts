export declare class WebRTCTransportError extends Error {
    constructor(msg: string);
}
export declare class SDPHandshakeFailedError extends WebRTCTransportError {
    constructor(message?: string);
}
export declare class ConnectionClosedError extends WebRTCTransportError {
    constructor(state: RTCPeerConnectionState, msg: string);
}
export declare class DataChannelError extends WebRTCTransportError {
    constructor(streamLabel: string, msg: string);
}
export declare class InappropriateMultiaddrError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare class InvalidArgumentError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare class InvalidFingerprintError extends WebRTCTransportError {
    constructor(fingerprint: string, source: string);
}
export declare class OperationAbortedError extends WebRTCTransportError {
    constructor(context: string, abortReason: string);
}
export declare class OverStreamLimitError extends WebRTCTransportError {
    constructor(msg: string);
}
export declare class UnimplementedError extends WebRTCTransportError {
    constructor(methodName: string);
}
export declare class UnsupportedHashAlgorithmError extends WebRTCTransportError {
    constructor(algo: number);
}
//# sourceMappingURL=error.d.ts.map
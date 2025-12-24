export class WebRTCTransportError extends Error {
    constructor(msg) {
        super(`WebRTC transport error: ${msg}`);
        this.name = 'WebRTCTransportError';
    }
}
export class SDPHandshakeFailedError extends WebRTCTransportError {
    constructor(message = 'SDP handshake failed') {
        super(message);
        this.name = 'SDPHandshakeFailedError';
    }
}
export class ConnectionClosedError extends WebRTCTransportError {
    constructor(state, msg) {
        super(`peerconnection moved to state: ${state}: ${msg}`);
        this.name = 'WebRTC/ConnectionClosed';
    }
}
export class DataChannelError extends WebRTCTransportError {
    constructor(streamLabel, msg) {
        super(`[stream: ${streamLabel}] data channel error: ${msg}`);
        this.name = 'WebRTC/DataChannelError';
    }
}
export class InappropriateMultiaddrError extends WebRTCTransportError {
    constructor(msg) {
        super(`There was a problem with the Multiaddr which was passed in: ${msg}`);
        this.name = 'WebRTC/InappropriateMultiaddrError';
    }
}
export class InvalidArgumentError extends WebRTCTransportError {
    constructor(msg) {
        super(`There was a problem with a provided argument: ${msg}`);
        this.name = 'WebRTC/InvalidArgumentError';
    }
}
export class InvalidFingerprintError extends WebRTCTransportError {
    constructor(fingerprint, source) {
        super(`Invalid fingerprint "${fingerprint}" within ${source}`);
        this.name = 'WebRTC/InvalidFingerprintError';
    }
}
export class OperationAbortedError extends WebRTCTransportError {
    constructor(context, abortReason) {
        super(`Signalled to abort because (${abortReason}}) ${context}`);
        this.name = 'WebRTC/OperationAbortedError';
    }
}
export class OverStreamLimitError extends WebRTCTransportError {
    constructor(msg) {
        super(msg);
        this.name = 'WebRTC/OverStreamLimitError';
    }
}
export class UnimplementedError extends WebRTCTransportError {
    constructor(methodName) {
        super(`A method (${methodName}) was called though it has been intentionally left unimplemented.`);
        this.name = 'WebRTC/UnimplementedError';
    }
}
export class UnsupportedHashAlgorithmError extends WebRTCTransportError {
    constructor(algo) {
        super(`unsupported hash algorithm code: ${algo} please see the codes at https://github.com/multiformats/multicodec/blob/master/table.csv `);
        this.name = 'WebRTC/UnsupportedHashAlgorithmError';
    }
}
//# sourceMappingURL=error.js.map
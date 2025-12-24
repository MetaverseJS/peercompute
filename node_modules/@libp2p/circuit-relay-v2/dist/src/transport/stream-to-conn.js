import { AbstractMultiaddrConnection } from '@libp2p/utils';
import { Uint8ArrayList } from 'uint8arraylist';
class StreamMultiaddrConnection extends AbstractMultiaddrConnection {
    stream;
    init;
    constructor(init) {
        super({
            ...init,
            direction: init.stream.direction
        });
        this.init = init;
        this.stream = init.stream;
        this.stream.addEventListener('close', (evt) => {
            this.onTransportClosed(evt.error);
        });
        this.stream.addEventListener('remoteCloseWrite', (evt) => {
            this.onRemoteCloseWrite();
            // close our end when the remote closes
            this.close()
                .catch(err => {
                this.abort(err);
            });
        });
        // count incoming bytes
        this.stream.addEventListener('message', (evt) => {
            init.onDataRead?.(evt.data);
            this.onData(evt.data);
        });
        // forward drain events
        this.stream.addEventListener('drain', () => {
            this.safeDispatchEvent('drain');
        });
    }
    sendData(data) {
        this.init.onDataWrite?.(data);
        return {
            sentBytes: data.byteLength,
            canSendMore: this.stream.send(data)
        };
    }
    async sendClose(options) {
        await this.stream.close(options);
    }
    sendReset() {
        this.stream.abort(new Error('An error occurred'));
    }
    sendPause() {
        this.stream.pause();
    }
    sendResume() {
        this.stream.resume();
    }
}
/**
 * Convert a Stream into a MultiaddrConnection.
 */
export function streamToMaConnection(init) {
    return new StreamMultiaddrConnection(init);
}
//# sourceMappingURL=stream-to-conn.js.map
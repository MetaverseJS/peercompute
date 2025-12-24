import { AbstractMultiaddrConnection, repeatingTask } from '@libp2p/utils';
import { Uint8ArrayList } from 'uint8arraylist';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string';
const DEFAULT_MAX_BUFFERED_AMOUNT = 1024 * 1024 * 4;
const DEFAULT_BUFFERED_AMOUNT_POLL_INTERVAL = 10;
class WebSocketMultiaddrConnection extends AbstractMultiaddrConnection {
    websocket;
    maxBufferedAmount;
    checkBufferedAmountTask;
    constructor(init) {
        super(init);
        this.websocket = init.websocket;
        this.maxBufferedAmount = init.maxBufferedAmount ?? DEFAULT_MAX_BUFFERED_AMOUNT;
        this.checkBufferedAmountTask = repeatingTask(this.checkBufferedAmount.bind(this), init.bufferedAmountPollInterval ?? DEFAULT_BUFFERED_AMOUNT_POLL_INTERVAL);
        this.websocket.addEventListener('close', (evt) => {
            this.log('closed - code %d, reason "%s", wasClean %s', evt.code, evt.reason, evt.wasClean);
            this.checkBufferedAmountTask.stop();
            if (!evt.wasClean) {
                this.onRemoteReset();
                return;
            }
            this.onTransportClosed();
        }, { once: true });
        this.websocket.addEventListener('message', (evt) => {
            try {
                let buf;
                if (typeof evt.data === 'string') {
                    buf = uint8ArrayFromString(evt.data);
                }
                else if (evt.data instanceof ArrayBuffer) {
                    buf = new Uint8Array(evt.data, 0, evt.data.byteLength);
                }
                else {
                    this.abort(new Error('Incorrect binary type'));
                    return;
                }
                this.onData(buf);
            }
            catch (err) {
                this.log.error('error receiving data - %e', err);
            }
        });
    }
    sendData(data) {
        for (const buf of data) {
            this.websocket.send(buf);
        }
        const canSendMore = this.websocket.bufferedAmount < this.maxBufferedAmount;
        if (!canSendMore) {
            this.checkBufferedAmountTask.start();
        }
        return {
            sentBytes: data.byteLength,
            canSendMore
        };
    }
    sendReset() {
        this.websocket.close(1006); // abnormal closure
    }
    async sendClose(options) {
        this.websocket.close();
        options?.signal?.throwIfAborted();
    }
    sendPause() {
        // read backpressure is not supported
    }
    sendResume() {
        // read backpressure is not supported
    }
    checkBufferedAmount() {
        this.log('buffered amount now %d', this.websocket.bufferedAmount);
        if (this.websocket.bufferedAmount === 0) {
            this.checkBufferedAmountTask.stop();
            this.safeDispatchEvent('drain');
        }
    }
}
// Convert a stream into a MultiaddrConnection
// https://github.com/libp2p/interface-transport#multiaddrconnection
export function webSocketToMaConn(init) {
    return new WebSocketMultiaddrConnection(init);
}
//# sourceMappingURL=websocket-to-conn.js.map
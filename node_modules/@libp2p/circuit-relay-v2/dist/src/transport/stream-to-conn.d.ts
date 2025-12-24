import { Uint8ArrayList } from 'uint8arraylist';
import type { MultiaddrConnection, Stream } from '@libp2p/interface';
import type { AbstractMultiaddrConnectionInit } from '@libp2p/utils';
export interface StreamMultiaddrConnectionInit extends Omit<AbstractMultiaddrConnectionInit, 'direction'> {
    stream: Stream;
    /**
     * A callback invoked when data is read from the stream
     */
    onDataRead?(buf: Uint8ArrayList | Uint8Array): void;
    /**
     * A callback invoked when data is written to the stream
     */
    onDataWrite?(buf: Uint8ArrayList | Uint8Array): void;
}
/**
 * Convert a Stream into a MultiaddrConnection.
 */
export declare function streamToMaConnection(init: StreamMultiaddrConnectionInit): MultiaddrConnection;
//# sourceMappingURL=stream-to-conn.d.ts.map
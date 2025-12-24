import type { Logger } from '@libp2p/interface';
import type { AddressInfo } from 'node:net';
export interface StunServer {
    close(): Promise<void>;
    address(): AddressInfo;
}
export interface Callback {
    (ufrag: string, remoteHost: string, remotePort: number): void;
}
export declare function stunListener(host: string, port: number, log: Logger, cb: Callback): Promise<StunServer>;
//# sourceMappingURL=stun-listener.d.ts.map
import type { PeerId, Record } from '@libp2p/interface';
export interface ReservationVoucherOptions {
    relay: PeerId;
    peer: PeerId;
    expiration: bigint;
}
export declare class ReservationVoucherRecord implements Record {
    readonly domain = "libp2p-relay-rsvp";
    readonly codec: Uint8Array<ArrayBuffer>;
    private readonly relay;
    private readonly peer;
    private readonly expiration;
    constructor({ relay, peer, expiration }: ReservationVoucherOptions);
    marshal(): Uint8Array;
    equals(other: Record): boolean;
}
//# sourceMappingURL=reservation-voucher.d.ts.map
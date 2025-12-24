import type { Codec, DecodeOptions } from 'protons-runtime';
import type { Uint8ArrayList } from 'uint8arraylist';
export interface Peer {
    addresses: Address[];
    protocols: string[];
    publicKey?: Uint8Array;
    peerRecordEnvelope?: Uint8Array;
    metadata: Map<string, Uint8Array>;
    tags: Map<string, Tag>;
    updated?: number;
}
export declare namespace Peer {
    interface Peer$metadataEntry {
        key: string;
        value: Uint8Array;
    }
    namespace Peer$metadataEntry {
        const codec: () => Codec<Peer$metadataEntry>;
        const encode: (obj: Partial<Peer$metadataEntry>) => Uint8Array;
        const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Peer$metadataEntry>) => Peer$metadataEntry;
    }
    interface Peer$tagsEntry {
        key: string;
        value?: Tag;
    }
    namespace Peer$tagsEntry {
        const codec: () => Codec<Peer$tagsEntry>;
        const encode: (obj: Partial<Peer$tagsEntry>) => Uint8Array;
        const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Peer$tagsEntry>) => Peer$tagsEntry;
    }
    const codec: () => Codec<Peer>;
    const encode: (obj: Partial<Peer>) => Uint8Array;
    const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Peer>) => Peer;
}
export interface Address {
    multiaddr: Uint8Array;
    isCertified?: boolean;
    observed?: number;
}
export declare namespace Address {
    const codec: () => Codec<Address>;
    const encode: (obj: Partial<Address>) => Uint8Array;
    const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Address>) => Address;
}
export interface Tag {
    value: number;
    expiry?: bigint;
}
export declare namespace Tag {
    const codec: () => Codec<Tag>;
    const encode: (obj: Partial<Tag>) => Uint8Array;
    const decode: (buf: Uint8Array | Uint8ArrayList, opts?: DecodeOptions<Tag>) => Tag;
}
//# sourceMappingURL=peer.d.ts.map
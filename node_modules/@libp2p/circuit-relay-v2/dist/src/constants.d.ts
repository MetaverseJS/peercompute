/**
 * The maximum number of relay reservations the relay server will accept
 */
export declare const DEFAULT_MAX_RESERVATION_STORE_SIZE = 15;
/**
 * How often to check for reservation expiry
 */
export declare const DEFAULT_MAX_RESERVATION_TTL: number;
/**
 * How many reservation attempts to make in parallel
 */
export declare const DEFAULT_RESERVATION_CONCURRENCY = 1;
/**
 * How long to wait for a reservation attempt to finish
 */
export declare const DEFAULT_RESERVATION_COMPLETION_TIMEOUT = 5000;
/**
 * How long to let the reservation attempt queue to grow
 */
export declare const DEFAULT_MAX_RESERVATION_QUEUE_LENGTH = 100;
export declare const RELAY_SOURCE_TAG = "circuit-relay-source";
export declare const KEEP_ALIVE_TAG = "keep-alive-circuit-relay";
export declare const DEFAULT_DURATION_LIMIT: number;
export declare const DEFAULT_DATA_LIMIT: bigint;
/**
 * The hop protocol
 */
export declare const RELAY_V2_HOP_CODEC = "/libp2p/circuit/relay/0.2.0/hop";
/**
 * the stop protocol
 */
export declare const RELAY_V2_STOP_CODEC = "/libp2p/circuit/relay/0.2.0/stop";
/**
 * Hop messages must be exchanged inside this timeout
 */
export declare const DEFAULT_HOP_TIMEOUT: number;
/**
 * How long to wait before starting to advertise the relay service
 */
export declare const DEFAULT_ADVERT_BOOT_DELAY: number;
export declare const MAX_CONNECTIONS = 300;
export declare const DEFAULT_DISCOVERY_FILTER_SIZE = 4096;
export declare const DEFAULT_DISCOVERY_FILTER_ERROR_RATE = 0.001;
//# sourceMappingURL=constants.d.ts.map
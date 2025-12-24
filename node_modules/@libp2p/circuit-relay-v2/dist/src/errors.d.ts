/**
 * A transfer limit was hit
 */
export declare class TransferLimitError extends Error {
    constructor(message?: string);
}
/**
 * A duration limit was hit
 */
export declare class DurationLimitError extends Error {
    constructor(message?: string);
}
/**
 * There were enough relay reservations already
 */
export declare class HadEnoughRelaysError extends Error {
    static name: string;
    name: string;
}
/**
 * An attempt to open a relayed connection over a relayed connection was made
 */
export declare class DoubleRelayError extends Error {
    static name: string;
    name: string;
}
/**
 * An attempt to make a reservation on a relay was made while the reservation
 * queue was full
 */
export declare class RelayQueueFullError extends Error {
    static name: string;
    name: string;
}
//# sourceMappingURL=errors.d.ts.map